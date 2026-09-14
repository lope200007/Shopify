/**
 * Barrido de invierno 2026: lo que se vende de octubre a febrero en España.
 *
 * Incluye "Pet Shoes & Socks", que en septiembre di por inexistente y sí
 * existe: 247 productos. Las botas de perro son el hueco mas grande que
 * teniamos sin cubrir (480 busquedas/mes, 1.000 en diciembre).
 *
 * No mide portes: deja la cola ordenada para medirla uno a uno despues.
 */
const fs = require('fs');
const cj = require('./cj');

const ZONAS = [
  ['BotasCalcetines', '2410110350451606900'], // Pet Shoes & Socks
  ['Plumiferos',      '2410110350311612500'], // Pet Down & Parkas
  ['Jerseis',         '2410110348401611500'], // Pet Sweaters
  ['Sudaderas',       '2410110348531624100'], // Pet Sweatshirts & Hoodies
  ['RopaFuncional',   '2410110350021615300'], // Pet Functional Clothings
  ['Bufandas',        '2410110350591620800'], // Pet Scarves
  ['Alfombras',       '2410110357391611900'], // Pet Mats (calor / termicas)
  ['Nidos',           '2410110357511615700'], // Pet Nests (cuevas de invierno)
];

// Nada de collares de descarga, antiparasitarios ni bichos que no vendemos.
const VETO = /antiparasit|flea|tick|shock|bark control|anti-?bark|electric.*(collar|train)|pheromone|parrot|bird|reptile|hamster|guinea pig|rabbit/i;
// Lo que de verdad abriga o protege del frio/agua.
const INVIERNO = /coat|jacket|parka|down|sweater|hoodie|sweatshirt|knit|wool|fleece|warm|thermal|winter|snow|boot|shoe|sock|paw protect|scarf|cave|nest|plush/i;

(async () => {
  const out = [];
  for (const [zona, id] of ZONAS) {
    let n = 0;
    for (let p = 1; p <= 4; p++) {
      let r;
      try { r = await cj.buscar({ categoryId: id, pageNum: p, pageSize: 50 }); }
      catch (e) { console.error(zona, 'error', e.message); break; }
      const lista = r.list || [];
      for (const x of lista) {
        const nombre = x.productNameEn || '';
        if (VETO.test(nombre)) continue;
        if (!INVIERNO.test(nombre)) continue;
        const usd = parseFloat(String(x.sellPrice).split('--')[0]) || 0;
        const pesos = String(x.packWeight || x.productWeight || '').match(/\d+(\.\d+)?/g) || [];
        const g = pesos.length ? Math.min(...pesos.map(Number)) : 99999;
        if (usd < 0.5 || usd > 20 || g > 1200) continue;
        out.push({ zona, pid: x.pid, nombre, usd, g });
        n++;
      }
      if (lista.length < 50) break;
    }
    console.error(`${zona.padEnd(16)} ${String(n).padStart(3)} candidatos`);
  }
  out.sort((a, b) => a.usd - b.usd);
  fs.writeFileSync('research/cola-invierno.json', JSON.stringify(out, null, 1));
  console.error('\ntotal', out.length);
})();
