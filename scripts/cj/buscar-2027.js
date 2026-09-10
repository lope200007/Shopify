/**
 * Barrido para lo que viene: otono-invierno 2026, Navidad y arranque de 2027.
 *
 * Se buscan tres huecos que la demanda real de Espana senala y que el
 * catalogo no cubre:
 *   rampa para perros   3.600/mes y PLANO todo el ano (lo mejor que hay:
 *                       vende igual en agosto que en enero)
 *   camas para perros  13.200/mes, 19.800 en noviembre
 *   collares            3.600/mes y no vendemos ni uno
 */
const cj = require('./cj');
const ZONAS = [
  ['Escaleras y rampas', '2410110356561607500'],
  ['Nidos y cunas',      '2410110357511615700'],
  ['Camas',              '2410110358051626100'],
  ['Collares',           '2410110352331629800'],
];
(async () => {
  const out = [];
  for (const [nombre, id] of ZONAS) {
    for (let pag = 1; pag <= 2; pag++) {
      let r;
      try { r = await cj.buscar({ categoryId: id, pageNum: pag, pageSize: 50 }); }
      catch (e) { console.error(nombre, e.message); break; }
      const lista = r.list || [];
      for (const p of lista) {
        const usd = parseFloat(String(p.sellPrice).split('--')[0]) || 0;
        if (usd < 2 || usd > 14) continue;
        out.push({ zona: nombre, pid: p.pid, nombre: p.productNameEn, usd,
                   peso: p.packWeight || p.productWeight || null, img: p.productImage });
      }
      if (lista.length < 50) break;
    }
    console.error('  %s: %d', nombre, out.filter(x => x.zona === nombre).length);
  }
  require('fs').writeFileSync('research/cj-2027-2026-09-09.json', JSON.stringify(out, null, 1));
  console.error('total', out.length);
})();
