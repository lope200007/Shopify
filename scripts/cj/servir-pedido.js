/**
 * Pasa UN pedido de la tienda a CJ con pago por enlace (payType 1). Pablo solo
 * tiene que pagar el enlace. No necesita acceso a la API de Shopify: el pedido
 * se le da en un JSON (lo saca la tarea automatica con el conector de Shopify).
 *
 *   node scripts/cj/servir-pedido.js pedido.json             # simulacion
 *   node scripts/cj/servir-pedido.js pedido.json --ejecutar  # crea el pedido
 *
 * pedido.json:
 *   { "name": "#1004", "email": "...",
 *     "envio": { "nombre", "direccion1", "direccion2", "ciudad", "provincia",
 *                "pais", "codigoPais", "codigoPostal", "telefono" },
 *     "lineas": [ { "id": "gid://shopify/LineItem/...", "sku": "PTC-...", "quantity": 1 } ] }
 *
 * Sale UNA linea JSON al final (empieza por RESULTADO ) para que la tarea la lea:
 *   estado: 'simulado' | 'creado' | 'ya-existe' | 'error'
 *
 * Lo que aprendimos con los pedidos de prueba #1002 y #1003 (30-09-2026):
 *  - El transporte se elige por lo que CJ cobra de verdad (totalPostageFee).
 *  - Lo que CJ cobra = producto + envio total + 21 % del producto (IVA de
 *    aduana) + tasa de gestion (0,01-0,02 $). #1003: 2,70 + 4,09 + 0,57 + 0,02.
 *  - Nunca se crea un pedido "para ver el precio": el precio se calcula antes.
 *  - Una llamada que da error puede haber creado el pedido: antes de crear se
 *    mira si ya existe uno con el mismo numero, y nunca se reintenta a ciegas.
 */
const fs = require('fs');
const path = require('path');
const cj = require('./cj');
const { resolver } = require('./mapa');

const TASA_GESTION = 0.02;
const MARGEN_AVISO = 0.05; // si CJ pide mas de un 5 % sobre lo calculado, se avisa

function telefonoRespaldo() {
  if (process.env.TELEFONO_TIENDA) return process.env.TELEFONO_TIENDA.trim();
  try {
    const env = fs.readFileSync(path.join(__dirname, '..', '..', '.env'), 'utf8');
    return ((env.match(/^TELEFONO_TIENDA=(.*)$/m) || [])[1] || '').trim();
  } catch (e) { return ''; }
}

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
async function conReintento(fn) {
  // Solo para LECTURAS: crear un pedido no se reintenta nunca.
  for (let i = 1; i <= 5; i++) {
    try { return await fn(); } catch (e) {
      if (i === 5 || !/Too Many|1600200|fetch failed|ECONN/i.test(e.message)) throw e;
      await dormir(2500 * i);
    }
  }
}

/** Pedido de CJ que ya lleve este numero (y no este en la papelera). */
async function buscarExistente(numero) {
  for (let pag = 1; pag <= 10; pag++) {
    const r = await conReintento(() => cj.pedir('/shopping/order/list', { pageNum: pag, pageSize: 10 }));
    const lista = (r && r.list) || [];
    const hit = lista.find((o) => o.orderNum === numero && o.orderStatus !== 'TRASH' && o.orderStatus !== 'CANCELLED');
    if (hit) return hit;
    if (lista.length < 10) return null;
  }
  return null;
}

function salir(resultado) {
  console.log('RESULTADO ' + JSON.stringify(resultado));
  if (resultado.estado === 'error') process.exitCode = 1;
}

(async () => {
  const fichero = process.argv[2];
  const ejecutar = process.argv.includes('--ejecutar');
  if (!fichero) return salir({ estado: 'error', motivo: 'falta el fichero del pedido' });
  const pedido = JSON.parse(fs.readFileSync(fichero, 'utf8'));
  const e = pedido.envio || {};

  // 1. Datos minimos para que el transportista entregue.
  const telefono = (e.telefono || '').trim() || telefonoRespaldo();
  const faltan = [];
  for (const [campo, valor] of [['nombre', e.nombre], ['direccion1', e.direccion1], ['ciudad', e.ciudad],
    ['codigoPostal', e.codigoPostal], ['codigoPais', e.codigoPais], ['telefono', telefono]]) {
    if (!valor || !String(valor).trim()) faltan.push(campo);
  }
  if (faltan.length) return salir({ estado: 'error', pedido: pedido.name, motivo: 'faltan datos de envio: ' + faltan.join(', ') });

  // 2. SKU de la tienda -> articulos de CJ (los packs se abren en sus piezas).
  const productos = [];
  for (const l of pedido.lineas || []) {
    const r = l.sku ? resolver(l.sku) : null;
    if (!r) return salir({ estado: 'error', pedido: pedido.name, motivo: `el SKU ${l.sku} no esta en scripts/cj/mapa.js` });
    for (const p of r.pack ? r.pack : r) {
      if (!p.vid) return salir({ estado: 'error', pedido: pedido.name, motivo: `el SKU ${l.sku} no tiene vid` });
      productos.push({ vid: p.vid, quantity: l.quantity, storeLineItemId: l.id });
    }
  }
  if (!productos.length) return salir({ estado: 'error', pedido: pedido.name, motivo: 'el pedido no lleva productos' });

  // 3. Que no exista ya en CJ (evita pagar dos veces).
  const existente = await buscarExistente(pedido.name);
  if (existente) {
    return salir({ estado: 'ya-existe', pedido: pedido.name, cjOrderId: existente.orderId,
      cjEstado: existente.orderStatus, importeUsd: existente.orderAmount, seguimiento: existente.trackNumber || null });
  }

  // 4. Precio calculado ANTES de crear: producto + envio total + 21 % + tasa.
  let productoUsd = 0;
  for (const p of productos) {
    const v = await conReintento(() => cj.pedir('/product/variant/queryByVid', { vid: p.vid }));
    const precio = Number(v && v.variantSellPrice);
    if (!Number.isFinite(precio)) return salir({ estado: 'error', pedido: pedido.name, motivo: 'CJ no da precio para ' + p.vid });
    productoUsd += precio * p.quantity;
  }
  const opciones = await conReintento(() => cj.transportes({
    startCountryCode: 'CN', endCountryCode: e.codigoPais,
    products: productos.map((p) => ({ vid: p.vid, quantity: p.quantity })),
  }));
  if (!opciones.length) return salir({ estado: 'error', pedido: pedido.name, motivo: `CJ no tiene ruta de China a ${e.codigoPais}` });
  const t = opciones[0];
  const ivaUsd = Math.round(productoUsd * 0.21 * 100) / 100;
  const calculadoUsd = +(productoUsd + t.porteReal + ivaUsd + TASA_GESTION).toFixed(2);

  const cuerpo = {
    orderNumber: pedido.name,
    shippingCustomerName: e.nombre,
    shippingAddress: e.direccion1,
    shippingAddress2: e.direccion2 || '',
    shippingCity: e.ciudad,
    shippingProvince: e.provincia || e.ciudad,
    shippingCountry: e.pais || e.codigoPais,
    shippingCountryCode: e.codigoPais,
    shippingZip: e.codigoPostal,
    shippingPhone: telefono,
    email: pedido.email || '',
    logisticName: t.logisticName,
    fromCountryCode: 'CN',
    payType: 1, // enlace de pago: lo paga Pablo, sin monedero
    iossType: 3,
    iossNumber: '',
    platform: 'shopify',
    products: productos,
  };

  const base = { pedido: pedido.name, transporte: t.logisticName, plazo: t.logisticAging,
    productoUsd: +productoUsd.toFixed(2), envioUsd: t.porteReal, ivaUsd, calculadoUsd };
  if (!ejecutar) return salir({ estado: 'simulado', ...base });

  // 5. Crear (UNA vez; si da error no se reintenta: se comprueba en CJ).
  let creado;
  try {
    creado = await cj.pedir('/shopping/order/createOrderV2', null, cuerpo);
  } catch (err) {
    const tras = await buscarExistente(pedido.name).catch(() => null);
    return salir({ estado: 'error', ...base, motivo: 'CJ dio error al crear: ' + err.message,
      seCreoIgualmente: !!tras, cjOrderId: tras ? tras.orderId : null });
  }
  const importeUsd = Number(creado.orderAmount ?? creado.actualPayment);
  const alerta = Number.isFinite(importeUsd) && importeUsd > calculadoUsd * (1 + MARGEN_AVISO)
    ? `CJ pide ${importeUsd} $ y lo calculado era ${calculadoUsd} $: revisar antes de pagar` : null;
  return salir({ estado: 'creado', ...base, cjOrderId: creado.orderId, importeUsd,
    enlacePago: creado.cjPayUrl || null, alerta });
})().catch((err) => salir({ estado: 'error', motivo: err.message }));
