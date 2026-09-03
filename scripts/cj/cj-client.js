/**
 * Cliente de la API oficial de CJ Dropshipping (api2.0).
 *
 * Credenciales: SOLO desde variables de entorno o .env local.
 * Nunca se escriben en disco fuera de .env, nunca se imprimen, nunca se
 * suben al repositorio. .env esta en .gitignore.
 *
 *   CJ_EMAIL=tu-correo-de-cj
 *   CJ_API_KEY=la-clave-generada-en-CJ-→-My-CJ-→-Authorization-→-API
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

async function pedir(ruta, { metodo = 'GET', token, cuerpo, query } = {}) {
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
  const email = process.env.CJ_EMAIL;
  const apiKey = process.env.CJ_API_KEY;
  if (!email || !apiKey) {
    throw new Error('Faltan CJ_EMAIL y/o CJ_API_KEY en .env');
  }
  const d = await pedir('/authentication/getAccessToken', {
    metodo: 'POST',
    cuerpo: { email, password: apiKey },
  });
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
