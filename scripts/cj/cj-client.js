/**
 * Cliente de la API oficial de CJ Dropshipping (api2.0).
 *
 * Credenciales: SOLO desde variables de entorno o .env local.
 * Nunca se escriben en disco fuera de .env, nunca se imprimen, nunca se
 * suben al repositorio. .env esta en .gitignore.
 *
 *   CJ_API_KEY=la-clave-generada-en-CJ-→-My-CJ-→-Authorization-→-API
 *
 * Formato de la clave: CJ<numero de usuario>@api@<32 caracteres hex>.
 * Con ese formato se usa el "modo apiKey" y NO hace falta el correo.
 * CJ_EMAIL solo se usa como respaldo para cuentas antiguas.
 *
 * El token de acceso dura 15 dias; se cachea en .cj-token.json (gitignored).
 */
const fs = require('fs');
const path = require('path');

const BASE = 'https://developers.cjdropshipping.com/api2.0/v1';
const TOKEN_FILE = path.join(__dirname, '..', '..', '.cj-token.json');

function cargarEnv() {
  const f = path.join(__dirname, '..', '..', '.env');
  if (!fs.existsSync(f)) return;
  for (const linea of fs.readFileSync(f, 'utf8').split('\n')) {
    const m = linea.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

// CJ limita a 1 peticion por segundo. Serializamos y espaciamos.
let ultima = 0;
async function esperarTurno() {
  const hueco = 1100 - (Date.now() - ultima);
  if (hueco > 0) await new Promise((r) => setTimeout(r, hueco));
  ultima = Date.now();
}

async function pedir(ruta, { metodo = 'GET', token, cuerpo, query } = {}) {
  await esperarTurno();
  let url = BASE + ruta;
  if (query) url += '?' + new URLSearchParams(query).toString();
  const cabeceras = { 'Content-Type': 'application/json' };
  if (token) cabeceras['CJ-Access-Token'] = token;
  const r = await fetch(url, {
    method: metodo,
    headers: cabeceras,
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
  const j = await r.json();
  if (!j.success) throw new Error(`CJ ${ruta}: ${j.message} (code ${j.code})`);
  return j.data;
}

async function getToken() {
  cargarEnv();
  if (fs.existsSync(TOKEN_FILE)) {
    const c = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
    if (c.expira && Date.parse(c.expira) > Date.now() + 3600e3) return c.accessToken;
  }
  const apiKey = process.env.CJ_API_KEY;
  if (!apiKey) throw new Error('Falta CJ_API_KEY en .env');

  // Modo apiKey (el actual). Si la clave no tiene ese formato, se prueba el
  // modo antiguo de correo + clave, que sigue vivo en cuentas viejas.
  const esModoApiKey = /^CJ\d+@api@[0-9a-f]{32}$/.test(apiKey);
  const cuerpo = esModoApiKey
    ? { apiKey }
    : { email: process.env.CJ_EMAIL, password: apiKey };
  if (!esModoApiKey && !process.env.CJ_EMAIL) {
    throw new Error('La clave no tiene formato de apiKey, asi que hace falta CJ_EMAIL en .env');
  }
  const d = await pedir('/authentication/getAccessToken', { metodo: 'POST', cuerpo });
  fs.writeFileSync(
    TOKEN_FILE,
    JSON.stringify({ accessToken: d.accessToken, expira: d.accessTokenExpiryDate }, null, 2),
    { mode: 0o600 }
  );
  return d.accessToken;
}

const api = {
  /** Busca productos por palabra clave / categoria. */
  listar: (token, q) => pedir('/product/list', { token, query: q }),
  /** Ficha completa: coste real, TODAS las fotos, variantes, peso. */
  detalle: (token, q) => pedir('/product/query', { token, query: q }),
  /** Stock por almacen: aqui se ve si sale de la UE o de China. */
  stock: (token, vid) => pedir('/product/stock/queryByVid', { token, query: { vid } }),
  /** Coste real de envio a Espana. */
  portes: (token, cuerpo) => pedir('/logistic/freightCalculate', { token, metodo: 'POST', cuerpo }),
};

module.exports = { getToken, api, pedir };
