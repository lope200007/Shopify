// Mapa SKU de Shopify -> vid de CJ. Sin esto no se puede servir un pedido:
// CJ solo acepta el vid interno, no el SKU.
const fs = require('fs'), path = require('path');
const DIR = path.join(__dirname, '..', '..', 'proveedores', 'cj');

// Los productos antiguos usan el propio variantSku de CJ y se resuelven solos.
const indice = {};
for (const f of fs.readdirSync(DIR)) {
  let d; try { d = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')); } catch { continue; }
  for (const v of (d.variants || [])) {
    indice[v.variantSku] = { vid: v.vid, cjSku: v.variantSku, precio: +v.variantSellPrice, peso: v.variantWeight, producto: d.productNameEn.slice(0, 60) };
  }
}

// Los productos nuevos llevan SKU propio y hay que declararlos a mano.
const manual = {
  'CJGX131815-SET-S-NEG': '2601110812321604800', 'CJGX131815-SET-S-NAR': '2601110812321605500', 'CJGX131815-SET-S-ROJ': '2601110812321606200',
  'CJGX131815-SET-M-NEG': '2601110812321604600', 'CJGX131815-SET-M-NAR': '2601110812321605300', 'CJGX131815-SET-M-ROJ': '2601110812321606000',
  'CJGX131815-SET-L-NEG': '2601110812321604500', 'CJGX131815-SET-L-NAR': '2601110812321605100', 'CJGX131815-SET-L-ROJ': '2601110812321605800',
  'CJGX131815-SET-XL-NEG': '2601110812321605000', 'CJGX131815-SET-XL-NAR': '2601110812321605700', 'CJGX131815-SET-XL-ROJ': '2601110812321606300',
  'CJMY179795-IND': '1678644524677079040', 'CJMY179795-VER': '1678644524953903104',
  'CJMY179795-GRI': '1678644525016817664', 'CJMY179795-BLA': '1678644525079732224',
  'CJMY171222-BLA': '1637798503055372288', 'CJMY171222-ROS': '1650372877348249600',
  'CJMY171222-VER': '1650372877394386944', 'CJMY171222-NEG': '2511300117201618300',
  'CJYD233200-1U': '2503191148021601500', 'CJYD233200-2U': '2505200823161622300',
  'CJMY163699-S-GRI': '1602564551311110144', 'CJMY163699-S-ROS': '1602564551315304448',
  'CJMY163699-D-GRI': '1602564551311110145', 'CJMY163699-D-ROS': '1602564551315304449',
  'CJGY200835-VER': '1778298416821448704', 'CJGY200835-BLA': '1778298416888557568',
  'CJMY206336-BLA': '2406181119581626900',
  'CJGY200603-NEG': '2502060218301618100',
  'CJMY191848-3C': '1734125879615295488',
  'CJYD196025-ROJ': '1752236157204705280', 'CJYD196025-VER': '1752236157309562880',
};

// El pack son tres articulos distintos en un solo envio.
const packs = { 'PACK-BANO-LLUVIA': ['CJPT224333910JQ', 'CJYD280148202BY', 'CJGY137221901AZ'] };

function resolver(sku) {
  if (packs[sku]) return { pack: packs[sku].map((s) => indice[s] || { sku: s, error: 'sin mapeo' }) };
  if (indice[sku]) return [indice[sku]];
  if (manual[sku]) return [{ vid: manual[sku], cjSku: sku }];
  return null;
}

module.exports = { resolver, indice, manual, packs };

if (require.main === module) {
  const skus = fs.readFileSync(process.argv[2], 'utf8').split('\n').map((s) => s.trim()).filter(Boolean);
  let mal = 0;
  for (const s of skus) {
    const r = resolver(s);
    if (!r) { console.log('SIN MAPEO  ' + s); mal++; continue; }
    if (r.pack) { console.log('pack       ' + s + ' -> ' + r.pack.map((x) => x.vid || x.error).join(' + ')); continue; }
    console.log('ok         ' + s + ' -> ' + r[0].vid);
  }
  console.log('\n' + skus.length + ' SKU, ' + mal + ' sin mapeo');
  process.exit(mal ? 1 : 0);
}
