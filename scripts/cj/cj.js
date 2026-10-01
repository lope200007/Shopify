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

/**
 * La clave se lee primero de la variable de entorno CJ_MCP_TOKEN (ajustes del
 * entorno en la nube: sobrevive a que el contenedor se reinicie y la usan las
 * tareas automaticas) y, si no esta, del .env local.
 */
function token() {
  let t = process.env.CJ_MCP_TOKEN;
  if (!t) {
    try {
      const env = fs.readFileSync(path.join(__dirname, '..', '..', '.env'), 'utf8');
      t = (env.match(/^CJ_MCP_TOKEN=(.*)$/m) || [])[1];
    } catch (e) { /* sin .env */ }
  }
  if (!t) throw new Error('Falta CJ_MCP_TOKEN (variable de entorno o .env)');
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

/**
 * LO QUE CJ COBRA DE VERDAD POR EL ENVIO, EN DOLARES.
 *
 * freightCalculate devuelve dos precios y el que parece obvio es el malo:
 *   logisticPrice   -> precio base del transporte, SIN impuestos ni despacho
 *   totalPostageFee -> lo que CJ cobra en el pedido (base + taxesFee +
 *                      clearanceOperationFee...)
 * Pedido de prueba #1002 (30-09-2026), rodillo quitapelos: YunExpress daba
 * 5,00 de base y cobro 8,50; CJPacket Eub daba 5,50 y 5,50. Elegir y sumar
 * por logisticPrice escogio el transporte caro y dejo la venta en perdidas.
 * Si algun dia CJ no manda totalPostageFee, se cae al precio base.
 */
function porteReal(o) {
  const total = Number(o && o.totalPostageFee);
  if (Number.isFinite(total) && total > 0) return total;
  return Number(o && o.logisticPrice);
}

/** Opciones de envio validas, de la mas barata a la mas cara EN TOTAL. */
async function transportes(c) {
  const r = await pedir('/logistic/freightCalculate', null, c);
  return (r || [])
    .filter((o) => Number.isFinite(porteReal(o)))
    .map((o) => ({ ...o, porteReal: porteReal(o) }))
    .sort((a, b) => a.porteReal - b.porteReal);
}

module.exports = {
  buscar: (q) => pedir('/product/list', q),
  detalle: (q) => pedir('/product/query', q),
  stock: (vid) => pedir('/product/stock/queryByVid', { vid }),
  // Respuesta cruda de CJ. Para precios, usar transportes() o porteReal().
  portes: (c) => pedir('/logistic/freightCalculate', null, c),
  transportes,
  porteReal,
  pedir,
};
