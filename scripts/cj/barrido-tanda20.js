/**
 * Barrido amplio para cerrar el catálogo: 20 productos nuevos.
 *
 * Cubre las categorías grandes que el barrido de invierno no tocó, y descarta
 * lo que ya se vende para no duplicar.
 */
const fs = require('fs');
const cj = require('./cj');

const ZONAS = [
  ['Bolsas y mochilas',  '2410110342571606700'],
  ['Juguetes perseguir', '2410110339311602900'],
  ['Juguetes morder',    '2410110339451623300'],
  ['Juguetes educativos','2410110340031614900'],
  ['Peluches',           '2410110340531618900'],
  ['Baño y ducha',       '2410110355151622300'],
  ['Quitapelos y peines','2410110354491625800'],
  ['Collares',           '2410110352331629800'],
  ['Correas',            '2410110352471611400'],
  ['Arneses',            '2410110352591600400'],
  ['Tocados',            '2410110352051607900'],
  ['Casas y jaulas',     '2410110356441603600'],
  ['Arboles para gato',  '2410110356161627200'],
  ['Rascadores',         '2410110355491614000'],
  ['Bebida',             '2410110341331606800'],
  ['Utensilios comida',  '2410110341451628800'],
  ['Vestidos',           '2410110348131619300'],
  ['Ropa funcional',     '2410110350021615300'],
  ['Guardarrailes',      '2410110343361612300'],
  ['Empapadores',        '2410110342321607200'],
];

const VETO = /antiparasit|flea|tick|shock|bark control|anti-?bark|electric.*(collar|train)|pheromone|parrot|bird|reptile|hamster|guinea pig|rabbit|chicken|coop/i;

// Lo que ya está en la tienda: no se repite.
const YA_TENGO = /raincoat|rain coat|slow feed|lick mat|puzzle feeder|gravity|water bottle.*walk|harness.*leash set|nail (grinder|clipper)|paw cleaner|deshedd|self-clean|donut bed|sofa bed|cooling mat|elizabethan|inflatable collar|muzzle|dryer|towel|bathrobe|seat cover|trunk|barrier|car seat|boot|shoe|sock|sweater|hoodie|jumpsuit|scarf|self-heat|cave|treat ball|snuffle|dispens|airtag|squeak|frisbee|floating ring|poop bag holder|window hammock|sofa protect|scratching board|bat wing|halloween hat|laser|kangaroo|fish.*catnip|advent/i;

(async () => {
  const out = [];
  for (const [zona, id] of ZONAS) {
    let n = 0;
    for (let p = 1; p <= 3; p++) {
      let r;
      try { r = await cj.buscar({ categoryId: id, pageNum: p, pageSize: 50 }); }
      catch (e) { console.error(zona, 'error', e.message); break; }
      const lista = r.list || [];
      for (const x of lista) {
        const nombre = x.productNameEn || '';
        if (VETO.test(nombre) || YA_TENGO.test(nombre)) continue;
        const usd = parseFloat(String(x.sellPrice).split('--')[0]) || 0;
        const pesos = String(x.packWeight || x.productWeight || '').match(/\d+(\.\d+)?/g) || [];
        const g = pesos.length ? Math.min(...pesos.map(Number)) : 99999;
        if (usd < 0.5 || usd > 12 || g > 800) continue;
        out.push({ zona, pid: x.pid, nombre, usd, g });
        n++;
      }
      if (lista.length < 50) break;
    }
    console.error(`${zona.padEnd(20)} ${String(n).padStart(3)}`);
  }
  out.sort((a, b) => a.usd - b.usd);
  fs.writeFileSync('research/cola-tanda20.json', JSON.stringify(out, null, 1));
  console.error('\ntotal', out.length);
})();
