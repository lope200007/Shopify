/**
 * Vincula los productos de la tienda con los de CJ.
 *
 * Sin este vinculo CJ recibe el pedido sin saber que articulo enviar y lo
 * convierte en una "solicitud de abastecimiento" inutil. Paso con el #1001:
 * llego a CJ con importe 0, sin codigo postal y sin transporte.
 *
 *   node scripts/cj/vincular.js            # simulacion: dice que haria
 *   node scripts/cj/vincular.js --ejecutar # crea los vinculos
 *
 * Solo puede vincular los productos que CJ ya tenga cargados de la tienda.
 * Si CJ solo ve unos pocos, hay que lanzar la sincronizacion del catalogo
 * desde la app de CJ y volver a ejecutar esto.
 */
const fs = require('fs');
const path = require('path');
const { resolver } = require('./mapa');

const BASE = 'https://developers.cjdropshipping.com/api2.0/v1';
const TIENDA = '2609031958293531800'; // g5d031-ir
const TRANSPORTE = 'CJPacket Eub';
const ESPACIADO = 1800; // CJ admite 1 peticion por segundo
const POR_PAGINA = 10; // maximo que acepta CJ (error 1600300 si pides mas)

function token() {
  const env = fs.readFileSync(path.join(__dirname, '..', '..', '.env'), 'utf8');
  const t = (env.match(/^CJ_MCP_TOKEN=(.*)$/m) || [])[1];
  if (!t) throw new Error('Falta CJ_MCP_TOKEN en .env');
  return t.trim().split(':').slice(1).join(':');
}

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(ruta, { query, cuerpo } = {}) {
  const url = BASE + ruta + (query ? '?' + new URLSearchParams(query) : '');
  const r = await fetch(url, {
    method: cuerpo ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json', 'CJ-Access-Token': token() },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
  const j = await r.json();
  if (!j.success) throw new Error(`${j.code} ${j.message}`);
  return j.data;
}

/** CJ solo devuelve 10 por pagina, asi que hay que recorrerlas todas. */
async function paginar(ruta, query) {
  const todo = [];
  for (let pagina = 1; ; pagina++) {
    const d = await api(ruta, { query: { ...query, pageNum: pagina, pageSize: POR_PAGINA } });
    const lote = (d && (d.list || d.content)) || [];
    todo.push(...lote);
    const total = d && Number(d.total);
    if (lote.length < POR_PAGINA || (Number.isFinite(total) && todo.length >= total)) return todo;
    await dormir(ESPACIADO);
  }
}

/** El pid de CJ sale de los volcados guardados, buscando por vid. */
function pidLocal(vid) {
  const dir = path.join(__dirname, '..', '..', 'proveedores', 'cj');
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json'))) {
    let d;
    try { d = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch { continue; }
    const p = d.data || d;
    const vs = p.variants || p.variantList || [];
    if (vs.some((v) => String(v.vid) === String(vid))) return p.pid || p.productId;
  }
  return null;
}

/** Si el volcado local no lo tiene, se le pregunta a CJ (y se recuerda). */
const CACHE = path.join(__dirname, '..', '..', '.cj-pid-por-vid.json');
let cache = {};
try { cache = JSON.parse(fs.readFileSync(CACHE, 'utf8')); } catch { /* aun no existe */ }

async function pidPorVid(vid) {
  const local = pidLocal(vid);
  if (local) return local;
  if (cache[vid]) return cache[vid];
  const v = await api('/product/variant/queryByVid', { query: { vid } });
  await dormir(ESPACIADO);
  if (v && v.pid) {
    cache[vid] = v.pid;
    fs.writeFileSync(CACHE, JSON.stringify(cache, null, 2));
    return v.pid;
  }
  return null;
}

async function main() {
  const ejecutar = process.argv.includes('--ejecutar');
  console.log(ejecutar ? 'MODO REAL: se van a crear vinculos.\n' : 'Simulacion: no se toca nada.\n');

  const productos = await paginar('/shop/product/queryPage', {});
  console.log(`CJ tiene cargados ${productos.length} producto(s) de la tienda.\n`);
  await dormir(ESPACIADO);

  const yaVinculados = new Set();
  try {
    for (const c of await paginar('/product/conn/connection', { shopId: TIENDA })) {
      yaVinculados.add(String(c.platformProductId));
    }
  } catch { /* si falla, se intenta igual y CJ avisara */ }
  await dormir(ESPACIADO);

  let hechos = 0, saltados = 0, fallos = 0;
  const intentados = []; // para comprobar despues que CJ los guardo de verdad

  for (const p of productos) {
    const titulo = String(p.platformProductTitle || p.platformProductId).slice(0, 52);

    if (yaVinculados.has(String(p.platformProductId))) {
      console.log(`= ${titulo}  ya vinculado`);
      saltados++;
      continue;
    }

    const detalle = await api('/shop/product/queryDetail', {
      query: { shopId: TIENDA, platformProductIds: p.platformProductId },
    });
    await dormir(ESPACIADO);

    const variantes = ((detalle || [])[0] || {}).variants || [];
    const pares = [];
    const sinResolver = [];

    let esPack = false;
    for (const v of variantes) {
      const r = resolver(v.platformVariantSku);
      if (r && r.pack) { esPack = true; break; }
      const vid = r && r[0] && r[0].vid;
      if (vid) pares.push({ cjVariantId: String(vid), platformVariantId: String(v.platformVariantId) });
      else sinResolver.push(v.platformVariantSku);
    }

    if (esPack) {
      // Un pack son varios productos de CJ y el vinculo es uno a uno:
      // CJ no lo admite. Estos pedidos hay que servirlos a mano.
      console.log(`= ${titulo}  es un pack, se sirve a mano`);
      saltados++;
      continue;
    }

    if (!pares.length) {
      console.log(`! ${titulo}  ninguna variante resuelve en mapa.js`);
      fallos++;
      continue;
    }
    if (sinResolver.length) console.log(`  aviso: sin resolver -> ${sinResolver.join(', ')}`);

    const cjProductId = await pidPorVid(pares[0].cjVariantId);
    if (!cjProductId) {
      console.log(`! ${titulo}  no encuentro el pid de CJ en proveedores/cj/`);
      fallos++;
      continue;
    }

    if (!ejecutar) {
      console.log(`+ ${titulo}  ${pares.length} variante(s) -> ${cjProductId}`);
      hechos++;
      continue;
    }

    const cuerpo = {
      shopId: TIENDA,
      defaultArea: 1,
      logistics: TRANSPORTE,
      cjProductId: String(cjProductId),
      platformProductId: String(p.platformProductId),
      sourceCountryCode: 'CN', sourceCountry: 'China',
      targetCountryCode: 'ES', targetCountry: 'Spain',
      variantList: pares,
    };

    try {
      await api('/product/conn/connection', { cuerpo });
      console.log(`+ ${titulo}  vinculado (${pares.length} variantes)`);
      intentados.push({ titulo, cuerpo });
      hechos++;
    } catch (e) {
      console.log(`! ${titulo}  ${String(e.message).slice(0, 70)}`);
      fallos++;
    }
    await dormir(ESPACIADO);
  }

  // CJ a veces responde "Congratulation!" y no guarda nada. Comprobado el
  // 14/09/2026: 7 de 74 se perdieron asi. Por eso se repasa y se reintenta.
  if (ejecutar && intentados.length) {
    console.log('\nComprobando que CJ los ha guardado de verdad...');
    await dormir(ESPACIADO);
    const guardados = new Set(
      (await paginar('/product/conn/connection', { shopId: TIENDA }))
        .map((c) => String(c.platformProductId)),
    );
    const perdidos = intentados.filter((x) => !guardados.has(String(x.cuerpo.platformProductId)));
    console.log(`${intentados.length - perdidos.length} confirmados, ${perdidos.length} no se guardaron.`);

    for (const x of perdidos) {
      await dormir(ESPACIADO);
      try {
        await api('/product/conn/connection', { cuerpo: x.cuerpo });
        console.log(`  reintentado: ${x.titulo}`);
      } catch (e) {
        console.log(`  ! ${x.titulo}  ${String(e.message).slice(0, 70)}`);
        hechos--; fallos++;
      }
    }

    if (perdidos.length) {
      await dormir(ESPACIADO);
      const final = new Set(
        (await paginar('/product/conn/connection', { shopId: TIENDA }))
          .map((c) => String(c.platformProductId)),
      );
      const siguenFuera = perdidos.filter((x) => !final.has(String(x.cuerpo.platformProductId)));
      if (siguenFuera.length) {
        console.log(`\nATENCION: ${siguenFuera.length} siguen sin vincular tras el reintento:`);
        siguenFuera.forEach((x) => console.log(`  - ${x.titulo}`));
        hechos -= siguenFuera.length; fallos += siguenFuera.length;
      } else {
        console.log('  todos confirmados en el segundo intento.');
      }
    }
  }

  console.log(`\n${hechos} vinculado(s), ${saltados} ya estaban, ${fallos} con problema.`);
  if (!ejecutar) console.log('Nada de esto se ha hecho. Repite con --ejecutar.');
}

main().catch((e) => { console.error('Error:', e.message); process.exit(1); });
