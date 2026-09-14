/**
 * Lee la configuracion real del checkout de la tienda, sin permisos de pago
 * y sin crear ningun pedido.
 *
 *   node scripts/tienda/auditar-checkout.js [variantId]
 *
 * Por que hace falta: los ajustes de Configuracion -> Pagar -> Opciones del
 * formulario NO estan en la Admin API de Shopify (revisado el QueryRoot de
 * 2026-07). La unica forma de comprobar si el telefono es obligatorio es abrir
 * el checkout como un cliente y leer la configuracion que Shopify incrusta en
 * el HTML.
 *
 * Dos trampas, las dos comprobadas el 14/09/2026:
 *  - La tienda devuelve 429 a los User-Agent genericos. Con el de Safari movil
 *    responde 200.
 *  - fetch de Node recibe 403 donde curl recibe 200, asi que se usa curl.
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const TIENDA = process.env.TIENDA_URL || 'https://patitascalidas.com';
const VARIANTE = process.argv[2] || '58944361070940'; // comedero rotativo, verde
const UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) ' +
  'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

const jar = path.join(os.tmpdir(), `checkout-${process.pid}.cookies`);
const comun = ['-s', '-c', jar, '-b', jar, '-A', UA, '-H', 'Accept-Language: es-ES,es;q=0.9'];
const curl = (args) => execFileSync('curl', [...comun, ...args], { encoding: 'utf8', maxBuffer: 32e6 });

function main() {
  curl([TIENDA + '/', '-o', '/dev/null']);

  const carrito = curl([
    '-H', 'Content-Type: application/json',
    '-X', 'POST', TIENDA + '/cart/add.js',
    '-d', JSON.stringify({ items: [{ id: Number(VARIANTE), quantity: 1 }] }),
  ]);
  if (!carrito.includes('"variant_id"')) throw new Error('no se pudo añadir al carrito: ' + carrito.slice(0, 120));

  const html = curl(['-L', '-H', 'Accept: text/html,application/xhtml+xml', TIENDA + '/checkout'])
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&');
  if (html.length < 10000) throw new Error('el checkout no devolvio la pagina completa');

  console.log(`Checkout leido (${Math.round(html.length / 1024)} KB)\n`);

  const bloques = [];
  for (const m of html.matchAll(/"(\w*[Aa]ddressFormSettings)":/g)) bloques.push([m.index, m[1]]);

  for (const m of html.matchAll(/"phone":\{"mode":"(REQUIRED|OPTIONAL|HIDDEN)"/g)) {
    const previo = bloques.filter(([i]) => i < m.index).pop();
    const pais = (html.slice(Math.max(0, m.index - 900), m.index).match(/"countries":\[([^\]]*)\]/) || [])[1];
    console.log(`telefono ${m[1].padEnd(8)} en ${previo ? previo[1] : '?'}${pais ? ` (paises ${pais})` : ''}`);
  }

  const input = (html.match(/<input[^>]*name="phone"[^>]*>/) || [])[0] || '';
  if (!input) { console.log('\nNo se encontro el campo de telefono en el formulario.'); return; }
  const obligatorio = /\brequired\b/.test(input) || /aria-required="true"/.test(input);
  console.log(`\nCampo real del formulario de envio: ${obligatorio ? 'OBLIGATORIO' : 'NO obligatorio'}`);
}

try { main(); } finally { fs.rmSync(jar, { force: true }); }
