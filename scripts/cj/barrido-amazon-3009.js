/**
 * Barrido del 30-09-2026: lo más vendido en Amazon.es (listas del 30-09) que
 * todavía no tenemos. Busca cada concepto en su categoría de CJ, filtra por
 * nombre y ordena por listedNum (tiendas que ya lo venden en CJ).
 *
 * No mide portes: deja la cola para medir-candidatos.js.
 */
const fs = require('fs');
const cj = require('./cj');

const ZONAS = [
  ['CepilloVapor',   '2410110354491625800', /steam|spray|mist|vapou?r/i],             // Hair Removers & Combs
  ['PeineMuda',      '2410110354491625800', /deshedd|shedding|undercoat|rake/i],
  ['AtrapaLavadora', '2410110354491625800', /laundry|washing|washer/i],
  ['RascadorEsquina','2410110355491614000', /corner|l.?shape|vertical|wall|lounge/i],  // Cat Scratching Posts
  ['AlfombraRasc',   '2410110355491614000', /mat|pad|adhesive|sisal|carpet|tape|sticker/i],
  ['ProtectorMueble','2410110356041603300', /./],                                     // Furniture Protectors
  ['CorreaLarga',    '2410110352471611400', /\b(5|10|15|20|30) ?m\b|long|training|recall|tracking/i],
  ['Rellenable',     '2410110339451623300', /treat|food|leak|dispens|stuff|rubber/i],  // Chew Toys
  ['FuenteInox',     '2410110341331606800', /stainless|steel/i],                        // Drinking Tools
  ['BolsilloMascota','2410110342571606700', /hoodie|sweatshirt|pouch|sling/i],          // Pet Bags
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
  fs.writeFileSync(process.argv[2] || 'research/cola-amazon-3009.json', JSON.stringify(out, null, 1));
  console.error('total', out.length);
})();
