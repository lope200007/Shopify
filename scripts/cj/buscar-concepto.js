/**
 * Busca en CJ por concepto, no por categoria.
 *
 * Ordenar 243 candidatos por margen no sirve de nada: con el porte fijo, el
 * margen en euros lo manda el PVP y no el coste, asi que ordenar por margen
 * es ordenar por «lo mas barato primero», que es justo lo contrario de lo que
 * hace falta. La pregunta util es cual de estos articulos aguanta un precio
 * de 40 a 80 euros en Espana, y eso es criterio, no aritmetica.
 *
 * Aqui se buscan conceptos concretos que en el mercado espanol ya se venden a
 * ese precio, y se anota el peso, que es lo que decide el porte.
 */
const cj = require('./cj');
const USD = 0.92, IVA = 1.21, COM = 0.0175, FIJO = 0.25;

const CONCEPTOS = [
  'dog car seat booster',      // asiento elevado de coche: 40-70 EUR en Espana
  'pet water fountain',        // fuente de agua: 30-50
  'automatic pet feeder',      // comedero automatico: 40-80
  'dog backpack carrier',      // mochila de transporte: 50-90
  'heated pet bed',            // cama con calor: invierno
  'orthopedic dog bed memory', // cama ortopedica: 50-90
  'dog drying towel robe',     //
  'pet grooming vacuum',       // aspirador de pelo: 60-120
  'dog puzzle interactive',    //
  'pet stroller',              // carrito: 90-180
];

(async () => {
  const salida = [];
  for (const q of CONCEPTOS) {
    let r;
    try { r = await cj.buscar({ productNameEn: q, pageNum: 1, pageSize: 30 }); }
    catch (e) { console.error(q, '->', e.message); continue; }
    const lista = r.list || [];
    for (const p of lista) {
      const usd = parseFloat(String(p.sellPrice).split('--')[0]) || 0;
      if (!usd) continue;
      salida.push({
        concepto: q, pid: p.pid, nombre: p.productNameEn, usd,
        pesoG: p.packWeight || p.productWeight || null,
        img: p.productImage,
      });
    }
    console.error('%s -> %d', q, lista.length);
  }
  require('fs').writeFileSync('research/cj-conceptos-2026-09-09.json', JSON.stringify(salida, null, 1));
  console.error('total', salida.length);
})();
