/**
 * Barrido para dos frentes a la vez, septiembre de 2026:
 *   - Gato: hamacas de ventana, protectores de sofa y juguetes.
 *   - Halloween: panuelos, lazos, tocados y disfraces.
 *
 * No mide portes. Solo deja la cola ordenada para medir uno a uno despues.
 */
const fs = require('fs');
const cj = require('./cj');

const ZONAS = [
  ['Hamacas',        '2410110357221629500'],
  ['ProtectorMuebl', '2410110356041603300'],
  ['Rascadores',     '2410110355491614000'],
  ['JuegoSet',       '2410110340411608400'],
  ['Perseguir',      '2410110339311602900'],
  ['Peluches',       '2410110340531618900'],
  ['Panuelos',       '2410110350591620800'],
  ['LazosCorbatas',  '2410110351401621300'],
  ['Tocados',        '2410110352051607900'],
  ['Vestidos',       '2410110348131619300'],
  ['ConjuntosRopa',  '2410110350161600700'],
  ['Guardarrailes',  '2410110343361612300'],
];

const VETO = /antiparasit|flea|tick|shock|bark control|anti-?bark|electric.*(collar|train)|pheromone|parrot|bird|reptile|hamster|guinea pig|rabbit/i;

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
        if (VETO.test(nombre)) continue;
        const usd = parseFloat(String(x.sellPrice).split('--')[0]) || 0;
        const pesos = String(x.packWeight || x.productWeight || '').match(/\d+(\.\d+)?/g) || [];
        const g = pesos.length ? Math.min(...pesos.map(Number)) : 99999;
        if (usd < 0.5 || usd > 18 || g > 900) continue;
        out.push({ zona, pid: x.pid, nombre, usd, g });
        n++;
      }
      if (lista.length < 50) break;
    }
    console.error(`${zona.padEnd(15)} ${String(n).padStart(3)} candidatos`);
  }
  fs.writeFileSync('research/cola-gatos-halloween.json', JSON.stringify(out, null, 1));
  console.error('\ntotal', out.length);
})();
