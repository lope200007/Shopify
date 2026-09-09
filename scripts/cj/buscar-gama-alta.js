/**
 * Busca en CJ candidatos para la franja de 40-80 EUR que le falta a la tienda.
 *
 * Por que esa franja: sobre los 35 margenes ya medidos, el porte es el 60 %
 * del coste de servir un pedido y apenas se mueve (2,87 a 11,67 EUR) mientras
 * el PVP va de 9,90 a 59,90. El margen en euros sale mas o menos la mitad del
 * PVP, casi con independencia del producto. La palanca es el precio.
 *
 * Hoy hay 20 productos por debajo de 25 EUR, que dejan de 4 a 9 EUR: una sola
 * incidencia se come tres ventas. Y solo 3 por encima de 40.
 *
 * Se filtra por almacen con stock para Espana (countryCode) y por precio de
 * proveedor: para vender a 49,90 con la mitad de margen hace falta un coste
 * por debajo de 6,17 EUR, o sea unos 6,70 dolares.
 */
const cj = require('./cj');

const USD = 0.92, IVA = 1.21, COM = 0.0175, FIJO = 0.25;

// Margen en euros de vender a `pvp` algo que cuesta `usd` mas `porte` de envio.
function margen(pvp, usd, porte) {
  return pvp / IVA - usd * USD - porte - (pvp * COM + FIJO);
}

const CATEGORIAS = [
  ['Bolsas y transportines', '2410110342571606700'],
  ['Casetas y jaulas',       '2410110356441603600'],
  ['Camas',                  '2410110358051626100'],
  ['Nidos y cunas',          '2410110357511615700'],
  ['Ropa funcional',         '2410110350021615300'],
  ['Barreras',               '2410110343361612300'],
  ['Alfombrillas de coche',  '2410110343211625200'],
];

(async () => {
  const salida = [];
  for (const [nombre, id] of CATEGORIAS) {
    for (let pag = 1; pag <= 2; pag++) {
      let r;
      try {
        r = await cj.buscar({ categoryId: id, pageNum: pag, pageSize: 50});
      } catch (e) { console.error(nombre, 'pag', pag, e.message); break; }
      const lista = r.list || [];
      for (const p of lista) {
        const usd = parseFloat(String(p.sellPrice).split('--')[0]) || 0;
        if (usd < 4 || usd > 16) continue;          // fuera de la franja util
        salida.push({
          categoria: nombre,
          pid: p.pid,
          nombre: p.productNameEn,
          usd,
          costeEur: +(usd * USD).toFixed(2),
          // margen si lo vendemos a 49,90 con un porte tipico de 9 EUR
          m4990: +margen(49.9, usd, 9).toFixed(2),
          m6990: +margen(69.9, usd, 10).toFixed(2),
          peso: p.packWeight || p.productWeight || null,
          img: p.productImage,
        });
      }
      if (lista.length < 50) break;
    }
    console.error('  ' + nombre + ': ' + salida.filter((x) => x.categoria === nombre).length + ' candidatos');
  }
  salida.sort((a, b) => b.m4990 - a.m4990);
  require('fs').writeFileSync('research/cj-gama-alta-2026-09-09.json', JSON.stringify(salida, null, 1));
  console.error('total', salida.length);
})();
