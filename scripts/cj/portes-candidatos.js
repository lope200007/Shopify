const cj = require('./cj');
const USD = 0.92;
const CANDIDATOS = [
  ['Barrera de malla coche',      '2093270032629805057'],
  ['Barrera coche con bolsillos', '2078422303778316290'],
  ['Cueva iglu S (570 g)',        '2608291159391615703'],
  ['Cueva iglu M (770 g)',        '2608291159391615704'],
  ['Abrigo impermeable L',        '1741074936296378368'],
  ['Bolso transportin S',         '2607040559551604400'],
];
(async () => {
  for (const [nombre, vid] of CANDIDATOS) {
    let r;
    try { r = await cj.portes({ startCountryCode: 'CN', endCountryCode: 'ES', products: [{ quantity: 1, vid }] }); }
    catch (e) { console.log(nombre + '  ERROR ' + e.message); continue; }
    console.log('## ' + nombre);
    for (const o of (r || []).filter(x => x.logisticPrice != null).sort((a,b) => a.logisticPrice - b.logisticPrice).slice(0, 5)) {
      console.log('   ' + o.logisticName.padEnd(28) + (o.logisticPrice * USD).toFixed(2).padStart(6) + ' EUR   ' + o.logisticAging + ' dias');
    }
    console.log('');
  }
})();
