const fs = require('fs'), path = require('path');
const { resolver } = require('/home/user/shopify/scripts/cj/mapa.js');
const S = '/tmp/claude-0/-home-user-libre/917f3732-f020-5fa4-b126-7adc8cf2b4f6/scratchpad';
const DIR = '/home/user/shopify/proveedores/cj';

// indice vid -> precio de coste, sacado de TODAS las fichas del proveedor
const porVid = {};
for (const f of fs.readdirSync(DIR)) {
  let d; try { d = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')); } catch { continue; }
  for (const v of (d.variants || [])) if (v.vid) porVid[String(v.vid).toUpperCase()] = +v.variantSellPrice;
}
console.error('vids con precio:', Object.keys(porVid).length);

const USD = 0.92, IVA = 1.21, COM = 0.0175, FIJO = 0.25;
const portes = {};
for (const f of JSON.parse(fs.readFileSync(S + '/margenes.json', 'utf8'))) portes[f.handle] = { eur: f.porteEur, dias: f.dias };

const productos = JSON.parse(fs.readFileSync(S + '/catalogo.json', 'utf8'));
const filas = [];
for (const p of productos) {
  const v = p.variants[0], pvp = +v.price;
  const r = resolver(v.sku);
  let coste = 0, faltan = 0;
  if (r && r.pack) {
    for (const x of r.pack) {
      const c = porVid[String(x.vid || '').toUpperCase()];
      if (c === undefined) faltan++; else coste += c;
    }
  } else if (r) {
    const c = porVid[String(r[0].vid || '').toUpperCase()];
    if (c === undefined) faltan++; else coste = c;
  } else faltan++;

  const pt = portes[p.handle];
  const neto = pvp / IVA, costeEur = coste * USD, com = pvp * COM + FIJO;
  const ok = pt && pt.eur != null && !faltan;
  filas.push({ handle: p.handle, titulo: p.title, pvp, costeEur, porteEur: pt ? pt.eur : null,
               dias: pt ? pt.dias : '', com, faltan,
               margen: ok ? neto - costeEur - pt.eur - com : null,
               pct: ok ? (neto - costeEur - pt.eur - com) / neto * 100 : null });
}
fs.writeFileSync(S + '/margenes2.json', JSON.stringify(filas, null, 1));
console.log('  PVP  coste  porte  comis  MARGEN    %   dias    producto');
for (const f of filas.sort((a, b) => (a.pct ?? 999) - (b.pct ?? 999))) {
  if (f.margen === null) { console.log(`${f.pvp.toFixed(2).padStart(5)}  -- faltan datos de coste (${f.faltan} pieza/s) --   ${f.titulo.slice(0,38)}`); continue; }
  console.log(`${f.pvp.toFixed(2).padStart(5)} ${f.costeEur.toFixed(2).padStart(6)} ${f.porteEur.toFixed(2).padStart(6)} ${f.com.toFixed(2).padStart(6)} ${f.margen.toFixed(2).padStart(7)} ${f.pct.toFixed(0).padStart(4)}% ${String(f.dias).padStart(6)}  ${f.titulo.slice(0,40)}`);
}
const val = filas.filter(f => f.margen !== null);
console.log('\nproductos con datos completos:', val.length, 'de', filas.length);
console.log('margen medio:', (val.reduce((a,b)=>a+b.margen,0)/val.length).toFixed(2), 'EUR |',
            (val.reduce((a,b)=>a+b.pct,0)/val.length).toFixed(0), '%');
