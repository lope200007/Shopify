/**
 * Barrido del 23-09-2026: huecos del catálogo (132 productos) en gato e invierno.
 *
 * Mira solo lo que NO tenemos ya: cueva de fieltro, tienda/tipi de gato, arnés
 * de gato con correa, cepillo de esquina, rascador pequeño, hamaca de silla,
 * luz de collar para las tardes oscuras. Ordena por listedNum (tiendas que ya
 * lo venden en CJ): es la única señal de demanda que no cuesta créditos.
 *
 * No mide portes: deja la cola para medirla después con medir-candidatos.js.
 */
const fs = require('fs');
const cj = require('./cj');

const ZONAS = [
  ['CuevaFieltro', '2410110357511615700', /felt/i],                                   // Pet Nests
  ['CasaGato',     '2410110356441603600', /cat.*(felt|cave|house)|(felt|cave).*cat/i],   // Pet Houses & Cages
  ['TiendaGato',   '2410110357091627600', /cat|tent|teepee|tipi/i],                    // Pet Tents
  ['ArnesGato',    '2410110352591600400', /cat.*(harness|vest)|(harness|vest).*cat/i], // Pet Harnesses
  ['SetGato',      '2410110353301600600', /cat/i],                                     // Collar, Leash & Harness Sets
  ['EsquinaGato',  '2410110354491625800', /corner|self.?groom|wall|massag/i],          // Hair Removers & Combs
  ['RascadorPeq',  '2410110355491614000', /./],                                        // Cat Scratching Posts
  ['HamacaSilla',  '2410110357221629500', /chair|bed ?side|wall|hanging/i],            // Pet Hammocks
  ['LuzCollar',    '2410110352331629800', /led|light|glow/i],                          // Pet Collars
];
const VETO = /shock|bark|flea|tick|bird|parrot|hamster|rabbit|reptile|fish|aquarium/i;

(async () => {
  const out = [];
  for (const [zona, id, filtro] of ZONAS) {
    let n = 0;
    for (let p = 1; p <= 4; p++) {
      let r;
      try { r = await cj.buscar({ categoryId: id, pageNum: p, pageSize: 50 }); }
      catch (e) { console.error(zona, 'error', e.message); break; }
      const lista = r.list || [];
      for (const x of lista) {
        const nombre = x.productNameEn || '';
        if (VETO.test(nombre) || !filtro.test(nombre)) continue;
        const usd = parseFloat(String(x.sellPrice).split('--')[0]) || 0;
        const pesos = String(x.packWeight || x.productWeight || '').match(/\d+(\.\d+)?/g) || [];
        const g = pesos.length ? Math.min(...pesos.map(Number)) : 99999;
        if (usd < 0.5 || usd > 18 || g > 900) continue;
        out.push({ zona, pid: x.pid, nombre, usd, g, listados: +x.listedNum || 0 });
        n++;
      }
      if (lista.length < 50) break;
    }
    console.error(`${zona.padEnd(14)} ${String(n).padStart(3)} candidatos`);
  }
  out.sort((a, b) => b.listados - a.listados);
  fs.writeFileSync('research/cola-tanda-2309.json', JSON.stringify(out, null, 1));
  console.error('total', out.length);
})();
