/**
 * Los dos huecos reales del catalogo, medidos con datos de busqueda de Espana:
 *
 *   collares para perros   3.600/mes  y no tenemos ni uno
 *   alfombra olfativa        1.040/mes (720 + 320), y sube en invierno
 *
 * Las dos cosas viajan planas, que es la unica forma de que el porte desde
 * China no se coma el margen. Se descartan de entrada las camas, rampas y
 * carritos: pagan por volumen.
 */
const cj = require('./cj');
const ZONAS = [
  ['Collares',    '2410110352331629800', 5],
  ['Chapas',      '2410110354301620700', 3],
  ['Educativos',  '2410110340031614900', 4],
  ['Alfombras',   '2410110357391611900', 4],
];
(async () => {
  const out = [];
  for (const [nombre, id, paginas] of ZONAS) {
    for (let pag = 1; pag <= paginas; pag++) {
      let r;
      try { r = await cj.buscar({ categoryId: id, pageNum: pag, pageSize: 50 }); }
      catch (e) { console.error(nombre, e.message); break; }
      const lista = r.list || [];
      for (const p of lista) {
        const usd = parseFloat(String(p.sellPrice).split('--')[0]) || 0;
        const pesos = String(p.packWeight || p.productWeight || '').match(/\d+(\.\d+)?/g) || [];
        const g = pesos.length ? Math.min(...pesos.map(Number)) : 99999;
        if (usd < 0.8 || usd > 15 || g > 500) continue;
        out.push({ zona: nombre, pid: p.pid, nombre: p.productNameEn, usd, g, img: p.productImage });
      }
      if (lista.length < 50) break;
    }
    console.error('  %s: %d', nombre, out.filter((x) => x.zona === nombre).length);
  }
  require('fs').writeFileSync('research/cj-huecos-2026-09-09.json', JSON.stringify(out, null, 1));
  console.error('total', out.length);
})();
