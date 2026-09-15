/**
 * Prueba real de envío: crea UN pedido en CJ y devuelve el enlace de pago.
 *
 *   node scripts/cj/probar-envio.js <telefono>
 *
 * Por qué existe: el sandbox de CJ no se puede usar (pide credenciales de
 * sandbox propias, error 1603001). La única forma de comprobar que el envío
 * funciona es hacer un pedido de verdad, barato, a la dirección de la tienda.
 *
 * No toca Shopify. Crea el pedido en CJ con `payType: 1`, así que **no cobra
 * nada**: CJ devuelve un enlace y el pago lo hace Pablo con su tarjeta.
 *
 * Artículo elegido: botas de invierno talla M. Producto 1,27 $ + porte 3,28 €.
 */
const cj = require('./cj');

const TELEFONO = process.argv[2];
if (!TELEFONO || !/^[0-9+\s]{9,}$/.test(TELEFONO)) {
  console.error('Falta el telefono. El transportista espanol no entrega sin el.');
  console.error('   node scripts/cj/probar-envio.js 600123456');
  process.exit(1);
}

const cuerpo = {
  orderNumber: 'PRUEBA-ENVIO-' + new Date().toISOString().slice(0, 10),
  shippingCustomerName: 'Patitascalidas',
  shippingAddress: 'Calle Me Falta un Tornillo 3',
  shippingAddress2: '',
  shippingCity: 'Arroyo de la Encomienda',
  shippingProvince: 'Valladolid',
  shippingCountry: 'Spain',
  shippingCountryCode: 'ES',
  shippingZip: '47195',
  shippingPhone: TELEFONO,
  email: 'pablolope7820@gmail.com',
  logisticName: 'CJPacket Eub',
  fromCountryCode: 'CN',
  payType: 1, // enlace de pago: CJ NO cobra nada por su cuenta
  iossType: 3,
  iossNumber: '',
  platform: 'shopify',
  products: [{ vid: '2604110146441636500', quantity: 1 }], // botas invierno, talla M
};

/** CJ no documenta con qué nombre manda el enlace: se busca a conciencia. */
function buscarEnlace(d) {
  const texto = JSON.stringify(d);
  const url = texto.match(/https?:\\?\/\\?\/[^"\\ ]+/);
  return url ? url[0].replace(/\\/g, '') : null;
}

(async () => {
  console.log('Creando el pedido en CJ. payType 1: no se cobra nada ahora.\n');
  let d;
  try {
    d = await cj.pedir('/shopping/order/createOrderV2', null, cuerpo);
  } catch (e) {
    console.error('CJ ha rechazado el pedido:', e.message);
    process.exit(1);
  }
  console.log('CJ lo ha aceptado.\n');
  console.log(JSON.stringify(d, null, 1).slice(0, 900));
  const enlace = buscarEnlace(d);
  console.log('\n' + (enlace ? '>>> PAGA AQUI: ' + enlace : 'CJ no ha devuelto enlace: mira la respuesta de arriba.'));
})();
