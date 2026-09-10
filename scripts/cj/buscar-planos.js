/**
 * Solo cosas PLANAS. Es la leccion que ha costado tres mediciones.
 *
 * El porte no se cobra por peso sino por volumen cuando el bulto abulta: una
 * cama redonda de 380 gramos paga 18,12 EUR porque va por la linea de
 * sobredimensionado, y una rampa de 3,5 kg paga 38,51. Con eso no hay precio
 * que aguante. En cambio un abrigo de 66 gramos paga 4,32 y una barrera de
 * malla plegada 5,50.
 *
 * Asi que la busqueda ya no es «que se vende mucho» sino «que se vende mucho
 * Y CABE EN UN SOBRE». Ropa, collares, correas, panuelos, alfombras
 * plegables: todo lo que viaja plano.
 */
const cj = require('./cj');
const ZONAS = [
  ['Collares',        '2410110352331629800'],
  ['Correas',         '2410110352471611400'],
  ['Arneses',         '2410110352591600400'],
  ['Panuelos',        '2410110350591620800'],
  ['Juegos de juguetes','2410110340411608400'],
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
        const pesos = String(p.packWeight || p.productWeight || '').match(/\d+(\.\d+)?/g) || [];
        const g = pesos.length ? Math.min(...pesos.map(Number)) : 99999;
        if (usd < 1 || usd > 12 || g > 400) continue;   // plano y ligero
        out.push({ zona: nombre, pid: p.pid, nombre: p.productNameEn, usd, g, img: p.productImage });
      }
      if (lista.length < 50) break;
    }
    console.error('  %s: %d', nombre, out.filter(x => x.zona === nombre).length);
  }
  require('fs').writeFileSync('research/cj-planos-2026-09-09.json', JSON.stringify(out, null, 1));
  console.error('total', out.length);
})();
