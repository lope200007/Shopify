/**
 * Candidatos para los tres huecos que senala la demanda real de Espana.
 *
 * Datos de busqueda de septiembre de 2026, no intuicion:
 *   camas para perros + cama perro   13.200/mes, ~19.800 en noviembre
 *   rampa para perros                 3.600/mes, plano todo el ano
 *   abrigo para perros                  880/mes, 2.900 en noviembre
 *
 * De las tres, la de rampa es la mas limpia: sin estacionalidad y con cero
 * competencia dentro de nuestro catalogo, porque lo que vendemos es una
 * escalera de espuma y la gente escribe «rampa».
 *
 * El filtro de precio sale de la regla de la casa: el porte es fijo, asi que
 * el margen en euros es mas o menos la mitad del PVP. Para vender a 39-69 EUR
 * con la mitad de margen hace falta un coste de proveedor por debajo de unos
 * 12 dolares.
 */
const cj = require('./cj');

const HUECOS = [
  ['Camas',            '2410110358051626100'],
  ['Nidos y cunas',    '2410110357511615700'],
  ['Escaleras/rampas', '2410110356561607500'],
  ['Abrigos',          '2410110349061619800'],
  ['Plumas y parkas',  '2410110350311612500'],
];

(async () => {
  const salida = [];
  for (const [nombre, id] of HUECOS) {
    for (let pag = 1; pag <= 2; pag++) {
      let r;
      try { r = await cj.buscar({ categoryId: id, pageNum: pag, pageSize: 50 }); }
      catch (e) { console.error(nombre, e.message); break; }
      const lista = r.list || [];
      for (const p of lista) {
        const usd = parseFloat(String(p.sellPrice).split('--')[0]) || 0;
        if (usd < 3 || usd > 13) continue;
        salida.push({ hueco: nombre, pid: p.pid, nombre: p.productNameEn, usd,
                      peso: p.packWeight || p.productWeight || null, img: p.productImage });
      }
      if (lista.length < 50) break;
    }
    console.error('  %s: %d', nombre, salida.filter(x => x.hueco === nombre).length);
  }
  require('fs').writeFileSync('research/cj-tendencia-2026-09-09.json', JSON.stringify(salida, null, 1));
  console.error('total', salida.length);
})();
