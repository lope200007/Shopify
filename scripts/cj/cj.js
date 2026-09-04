/**
 * Cliente de la API de CJ Dropshipping.
 *
 * Autenticacion: el token MCP que genera CJ (Type = MCP Token) contiene un
 * JWT despues del primer ':'. Ese JWT vale directamente como cabecera
 * CJ-Access-Token contra api2.0. Comprobado.
 *
 * Credenciales solo desde .env (CJ_MCP_TOKEN), que esta en .gitignore.
 * CJ limita a 1 peticion por segundo.
 */
const fs = require('fs');
const path = require('path');

const BASE = 'https://developers.cjdropshipping.com/api2.0/v1';

function token() {
  const env = fs.readFileSync(path.join(__dirname, '..', '..', '.env'), 'utf8');
  const t = (env.match(/^CJ_MCP_TOKEN=(.*)$/m) || [])[1];
  if (!t) throw new Error('Falta CJ_MCP_TOKEN en .env');
  return t.trim().split(':').slice(1).join(':');
}

let ultima = 0;
async function pedir(ruta, query, cuerpo) {
  const hueco = 1600 - (Date.now() - ultima);
  if (hueco > 0) await new Promise((r) => setTimeout(r, hueco));
  ultima = Date.now();

  let url = BASE + ruta;
  if (query) url += '?' + new URLSearchParams(query).toString();
  const r = await fetch(url, {
    method: cuerpo ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json', 'CJ-Access-Token': token() },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
  const j = await r.json();
  if (!j.success) throw new Error(`CJ ${ruta}: ${j.code} ${j.message}`);
  return j.data;
}

module.exports = {
  buscar: (q) => pedir('/product/list', q),
  detalle: (q) => pedir('/product/query', q),
  stock: (vid) => pedir('/product/stock/queryByVid', { vid }),
  portes: (c) => pedir('/logistic/freightCalculate', null, c),
  pedir,
};
