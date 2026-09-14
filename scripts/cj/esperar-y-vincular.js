/**
 * CJ tarda un rato en recoger un producto nuevo de la tienda. Este vigilante
 * espera a que aparezca y lo vincula solo, en vez de dejarlo a medias.
 *
 *   node scripts/cj/esperar-y-vincular.js <platformProductId> [minutos]
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BASE = 'https://developers.cjdropshipping.com/api2.0/v1';
const TIENDA = '2609031958293531800';
const ID = process.argv[2];
const MINUTOS = Number(process.argv[3] || 40);

function token() {
  const env = fs.readFileSync(path.join(__dirname, '..', '..', '.env'), 'utf8');
  return (env.match(/^CJ_MCP_TOKEN=(.*)$/m) || [])[1].trim().split(':').slice(1).join(':');
}

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

async function loVe() {
  for (let p = 1; ; p++) {
    const r = await fetch(`${BASE}/shop/product/queryPage?shopId=${TIENDA}&pageNum=${p}&pageSize=10`, {
      headers: { 'Content-Type': 'application/json', 'CJ-Access-Token': token() },
    });
    const j = await r.json();
    if (!j.success) return false;
    const lote = j.data.list || [];
    if (lote.some((x) => String(x.platformProductId) === String(ID))) return true;
    if (lote.length < 10) return false;
    await dormir(1800);
  }
}

(async () => {
  const limite = Date.now() + MINUTOS * 60000;
  while (Date.now() < limite) {
    if (await loVe()) {
      console.log(`CJ ya ve ${ID}. Vinculando...`);
      // El sondeo acaba de gastar la peticion de este segundo: si lanzamos
      // vincular.js de golpe, CJ responde 1600200 y se pierde el intento.
      await dormir(2500);
      console.log(execFileSync('node', [path.join(__dirname, 'vincular.js'), '--ejecutar'], { encoding: 'utf8' }));
      return;
    }
    console.log(`CJ todavia no ve ${ID}. Reintento en 2 minutos.`);
    await dormir(120000);
  }
  console.log(`Se agotaron los ${MINUTOS} minutos y CJ sigue sin ver ${ID}.`);
  console.log('Haria falta que Pablo pulse Sync en CJ -> Products -> Store Products.');
})();
