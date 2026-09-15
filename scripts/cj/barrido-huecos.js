/**
 * Tercera tanda: barrido por HUECOS del catalogo, no por categorias grandes.
 *
 * Los huecos salen de mirar que se vende de verdad en Espana (Kiwoko, Miscota,
 * Zooplus, Tiendanimal) y contrastarlo con lo que ya tenemos. Los dos claros:
 *   - hamaca de radiador para gato: 16,99-33 EUR en tiendas espanolas, no la tenemos
 *   - comedero automatico programable: 22,99 EUR el Trixie TX2, y el interes de
 *     busqueda paso de 15 a 93 entre marzo y mayo de 2026
 */
const fs = require('fs');
const cj = require('./cj');

const ZONAS = [
  ['Hamacas',              '2410110357221629500'],
  ['Mantas y colchas',     '2410110358191601900'],
  ['Esterillas',           '2410110357391611900'],
  ['Cuencos',              '2410110341061612000'],
  ['Escaleras y peldanos', '2410110356561607500'],
  ['Muebles: herramientas','2410110356301618100'],
  ['Protectores de mueble','2410110356041603300'],
  ['Colgantes de collar',  '2410110351521627800'],
  ['Bufandas',             '2410110350591620800'],
  ['Adiestramiento',       '2410110342161616300'],
  ['Pijamas',              '2410110349341618600'],
  ['Chapas personalizadas','2410110354301620700'],
  ['Pajaritas y lazos',    '2410110351401621300'],
  ['Tiendas de campana',   '2410110357091627600'],
  ['Esterillas de coche',  '2410110343211625200'],
  ['Juguetes de sonido',   '2410110340161623400'],
  ['Nidos',                '2410110357511615700'],
  ['Camas',                '2410110358051626100'],
];

// Nada de esto entra: o es ilegal de vender sin autorizacion, o no es nuestro animal.
const VETO = /antiparasit|flea|tick|shock|bark control|anti-?bark|electric.*(collar|train)|pheromone|medicin|drug|vaccin|parrot|bird|reptile|hamster|guinea pig|rabbit|chicken|coop|fish tank|aquarium|turtle|snake/i;

// Lo que ya esta en la tienda (108 fichas). Si suena a esto, fuera.
const YA_TENGO = new RegExp([
  'raincoat|rain coat|slow feed|lick mat|puzzle feeder|gravity feeder|water bottle',
  'harness.*leash set|nail (grinder|clipper|polisher)|paw clean|deshedd|self-clean',
  'donut bed|sofa bed|cooling mat|elizabethan|inflatable collar|muzzle|hair dryer',
  'towel|bathrobe|seat cover|trunk|barrier|car seat|boot|shoe|sock|sweater|hoodie',
  'jumpsuit|self-heat|cave bed|treat ball|snuffle|dispens|airtag|squeak|frisbee',
  'floating ring|poop bag|window hammock|sofa protect|scratching (board|post)|bat wing',
  'halloween|laser|kangaroo|advent|christmas tree bowl|water fountain|remote control car',
  'nano-?bug|tunnel|hydroponic|catnip box|carrier backpack|anti-pull leash|treat bag',
  'carrot|cotton rope|suction cup rope|goose plush|crinkle paper|paw balm|eye wipe',
  'raised.*(bowl|stand)|litter mat|sun.?protection hat|vest dress|fruit.*hoodie',
  'down jacket|parka|knit sweater|turtleneck|four.?leg.*suit|igloo|ice silk',
].join('|'), 'i');

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const out = [];
  for (const [zona, id] of ZONAS) {
    let n = 0;
    for (let pagina = 1; pagina <= 6; pagina++) {
      let d;
      try { d = await cj.pedir('/product/list', { categoryId: id, pageNum: pagina, pageSize: 20 }); }
      catch (e) { console.log(`  ${zona} p${pagina}: ${String(e.message).slice(0, 50)}`); break; }
      const lote = (d && d.list) || [];
      for (const p of lote) {
        const nombre = p.productNameEn || '';
        if (VETO.test(nombre) || YA_TENGO.test(nombre)) continue;
        out.push({ zona, pid: p.pid, nombre, sku: p.productSku, precio: +p.sellPrice ||
          +(String(p.sellPrice || '').split('--')[0]) || null, listados: p.listedNum || 0 });
        n++;
      }
      if (lote.length < 20) break;
      await dormir(1700);
    }
    console.log(`${zona.padEnd(24)} ${String(n).padStart(4)} candidatos`);
    await dormir(1700);
  }
  fs.writeFileSync(__dirname + '/../../research/cola-huecos.json', JSON.stringify(out, null, 1));
  console.log(`\n${out.length} candidatos -> research/cola-huecos.json`);
})();
