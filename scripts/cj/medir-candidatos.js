/**
 * Mide de verdad los candidatos antes de decidir nada.
 *
 * Regla: el porte se mide con la variante MAS PESADA, no con la mas ligera.
 * Si el margen aguanta ahi, aguanta en todas. El fallo de esta manana (medir
 * con el recambio de filtro en vez de con la fuente) no se repite.
 */
const fs = require('fs');
const cj = require('./cj');
const USD = 0.92;
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

const CAND = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

const margen = (pvp, costeUsd, porte) => pvp / 1.21 - costeUsd * USD - porte - (pvp * 0.0175 + 0.25);

(async () => {
  const out = [];
  for (const c of CAND) {
    let d;
    try { d = await cj.pedir('/product/query', { pid: c.pid }); }
    catch (e) { console.log(`! ${c.clave.padEnd(18)} ficha: ${String(e.message).replace(/^CJ [^:]+: /, '').slice(0, 42)}`); await dormir(1700); continue; }

    const vs = (d.variants || []).filter((v) => +v.variantWeight > 0);
    if (!vs.length) { console.log(`! ${c.clave.padEnd(18)} sin variantes con peso`); continue; }

    // La mas pesada manda: si el porte sale bien ahi, sale bien en todas.
    const pesada = vs.slice().sort((a, b) => +b.variantWeight - +a.variantWeight)[0];
    const cara = vs.slice().sort((a, b) => +b.variantSellPrice - +a.variantSellPrice)[0];

    let imgs = [];
    try { imgs = typeof d.productImage === 'string' ? JSON.parse(d.productImage) : (d.productImage || []); } catch (e) {}
    if (!imgs.length) imgs = d.productImageSet || [];

    let r;
    try { r = await cj.portes({ startCountryCode: 'CN', endCountryCode: 'ES', products: [{ quantity: 1, vid: pesada.vid }] }); }
    catch (e) { console.log(`! ${c.clave.padEnd(18)} porte: ${String(e.message).replace(/^CJ [^:]+: /, '').slice(0, 42)}`); await dormir(1700); continue; }

    const ok = (r || []).filter((x) => x.logisticPrice != null).sort((a, b) => a.logisticPrice - b.logisticPrice);
    if (!ok.length) { console.log(`! ${c.clave.padEnd(18)} SIN TRANSPORTE A ESPANA`); await dormir(1700); continue; }

    const porte = ok[0].logisticPrice * USD;
    const coste = +cara.variantSellPrice;
    const m = margen(c.pvp, coste, porte);

    out.push({
      clave: c.clave, pid: c.pid, pvp: c.pvp, nombre: d.productNameEn,
      variantes: vs.length, fotos: imgs.length,
      costeUsd: coste, costeEur: +(coste * USD).toFixed(2),
      pesoMax: +pesada.variantWeight, porte: +porte.toFixed(2),
      transporte: ok[0].logisticName, dias: ok[0].logisticAging,
      margen: +m.toFixed(2), listados: c.listados || 0, busquedas: c.busquedas || null,
    });

    const marca = m >= 8 ? 'OK ' : (m >= 6 ? '~  ' : 'NO ');
    console.log(`${marca}${c.clave.padEnd(18)} ${String(vs.length).padStart(3)}var ${String(imgs.length).padStart(2)}fot  coste ${(coste*USD).toFixed(2).padStart(6)}  porte ${porte.toFixed(2).padStart(6)}  PVP ${String(c.pvp).padStart(5)}  margen ${m.toFixed(2).padStart(6)}`);
    await dormir(1700);
  }
  fs.writeFileSync(process.argv[3], JSON.stringify(out, null, 1));
  console.log(`\n${out.length} medidos -> ${process.argv[3]}`);
  console.log(`pasan (>=8 EUR): ${out.filter((x) => x.margen >= 8).length}`);
})();
