/**
 * Prueba la conexion con CJ y NO imprime ninguna credencial.
 *
 *   node scripts/cj/probar-conexion.js
 *
 * Solo dice si funciona, cuando caduca el token y cuantos productos de
 * mascotas encuentra. Si falla, explica por que en castellano.
 */
const { getToken, api } = require('./cj-client');

(async () => {
  let token;
  try {
    token = await getToken();
  } catch (e) {
    console.log('NO CONECTA.');
    if (/Faltan CJ_EMAIL/.test(e.message)) {
      console.log('Motivo: no encuentro las credenciales.');
      console.log('Ni CJ_EMAIL ni CJ_API_KEY estan disponibles en este entorno.');
    } else if (/1600\d{3}|password|account/i.test(e.message)) {
      console.log('Motivo: CJ rechaza las credenciales.');
      console.log('Revisa que el correo sea el de la cuenta de CJ y que la');
      console.log('clave sea la de API (no la contrasena de entrar a la web).');
    } else {
      console.log('Motivo:', e.message);
    }
    process.exit(1);
  }

  console.log('CONECTA. Credenciales validas.');
  const fs = require('fs');
  const path = require('path');
  const cache = path.join(__dirname, '..', '..', '.cj-token.json');
  if (fs.existsSync(cache)) {
    console.log('Token valido hasta:', JSON.parse(fs.readFileSync(cache, 'utf8')).expira);
  }

  try {
    const r = await api.listar(token, { pageNum: 1, pageSize: 5, productNameEn: 'dog paw cleaner' });
    const total = r.total != null ? r.total : (r.list || []).length;
    console.log(`Catalogo accesible: ${total} resultados para "dog paw cleaner".`);
    for (const p of (r.list || []).slice(0, 5)) {
      console.log(` - ${p.productNameEn} | coste ${p.sellPrice} | SKU ${p.productSku}`);
    }
  } catch (e) {
    console.log('Token OK pero el catalogo da error:', e.message);
    process.exit(2);
  }
})();
