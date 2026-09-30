/**
 * Barrido del 30-09-2026 (2.ª vuelta): lo que más se vende a la vez en Amazon DE, IT y ES y en Kiwoko, y que
 * todavía no tenemos. Busca cada concepto en su categoría de CJ, filtra por
 * nombre y ordena por listedNum (tiendas que ya lo venden en CJ).
 *
 * No mide portes: deja la cola para medir-candidatos.js.
 */
const fs = require('fs');
const cj = require('./cj');

const ZONAS = [
  ['CorreaLarga',   '2410110352471611400', /pvc|waterproof|long|recall|tracking|\b(5|10|15|20|30) ?m\b|meter/i], // Pet Leashes
  ['AlmohadillaPata','2410110350451606900', /pad|sticker|anti.?slip|non.?slip|paw protect|grip/i],         // Shoes & Socks
  ['LuzClip',       '2410110352331629800', /clip|pendant|tag light|safety light|night light/i],            // Pet Collars
  ['LuzClip',       '2410110352471611400', /clip|pendant|safety light|night light/i],
  ['AirTagGato',    '2410110352331629800', /air.?tag|tracker/i],
  ['Quitapelos',    '2410110354491625800', /roller|lint|reusable|remover|sofa|fur remov/i],               // Hair Removers & Combs
  ['CojinCatnip',   '2410110340531618900', /catnip|pillow|cushion|kicker/i],                               // Plush Toys
  ['CojinCatnip',   '2410110339451623300', /catnip|pillow|cushion|kicker/i],                               // Chew Toys
];
const VETO = /shock|bark|flea|tick|bird|parrot|hamster|rabbit|reptile|fish|aquarium|horse/i;

(async () => {
  const out = [];
  for (const [zona, id, filtro] of ZONAS) {
    let n = 0;
    for (let p = 1; p <= 4; p++) {
      let r;
      for (let intento = 1; intento <= 3 && !r; intento++) {
        try { r = await cj.buscar({ categoryId: id, pageNum: p, pageSize: 50 }); }
        catch (e) {
          console.error(zona, 'pág', p, 'intento', intento, e.message);
          await new Promise((ok) => setTimeout(ok, 4000 * intento)); // CJ a veces corta aunque se respete 1/s
        }
      }
      if (!r) break;
      const lista = r.list || [];
      for (const x of lista) {
        const nombre = x.productNameEn || '';
        if (VETO.test(nombre) || !filtro.test(nombre)) continue;
        const usd = parseFloat(String(x.sellPrice).split('--')[0]) || 0;
        const pesos = String(x.packWeight || x.productWeight || '').match(/\d+(\.\d+)?/g) || [];
        const g = pesos.length ? Math.min(...pesos.map(Number)) : 99999;
        if (usd < 0.5 || usd > 18 || g > 1500) continue;
        out.push({ zona, pid: x.pid, nombre, usd, g, listados: +x.listedNum || 0 });
        n++;
      }
      if (lista.length < 50) break;
    }
    console.error(`${zona.padEnd(16)} ${String(n).padStart(3)} candidatos`);
  }
  out.sort((a, b) => b.listados - a.listados);
  fs.writeFileSync(process.argv[2] || 'research/cola-europa-3009.json', JSON.stringify(out, null, 1));
  console.error('total', out.length);
})();
