import express from 'express';
import { config } from './config';
import { isValidWebhook } from './shopify/verify';
import { buildOrderInsight, OrderPayload, OrderInsight } from './agents/order-agent';

const app = express();

/** Log en memoria de lo que fue generando el agente (ultimos 200). */
const insights: Array<OrderInsight & { receivedAt: string }> = [];
const MAX_INSIGHTS = 200;

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    shop: config.shop,
    apiVersion: config.apiVersion,
    insightsStored: insights.length,
    uptimeSeconds: Math.round(process.uptime()),
  });
});

/** Ver lo que genero el agente, mas reciente primero. */
app.get('/insights', (_req, res) => {
  res.json({ count: insights.length, insights: [...insights].reverse() });
});

/**
 * Webhook orders/create.
 *
 * express.raw es obligatorio: la firma HMAC se calcula sobre los bytes
 * exactos del body. Si express.json() lo parsea antes, la firma falla.
 */
app.post(
  '/webhooks/orders-create',
  express.raw({ type: 'application/json' }),
  (req, res) => {
    const hmac = req.get('X-Shopify-Hmac-Sha256');

    if (!isValidWebhook(req.body as Buffer, hmac)) {
      console.warn('[webhook] firma HMAC invalida, descartado');
      res.status(401).send('firma invalida');
      return;
    }

    let order: OrderPayload;
    try {
      order = JSON.parse((req.body as Buffer).toString('utf8'));
    } catch {
      res.status(400).send('body no es JSON valido');
      return;
    }

    // Shopify espera un 200 en menos de 5 segundos o reintenta el webhook.
    // Por eso confirmamos ya y procesamos con el LLM en segundo plano.
    res.status(200).send('ok');

    void handleOrder(order);
  }
);

async function handleOrder(order: OrderPayload): Promise<void> {
  try {
    const insight = await buildOrderInsight(order);

    insights.push({ ...insight, receivedAt: new Date().toISOString() });
    if (insights.length > MAX_INSIGHTS) insights.shift();

    console.log(`[agente] pedido ${insight.order} (${insight.customerName})`);
    console.log(`[agente] ${insight.message}`);
  } catch (err) {
    console.error('[agente] fallo procesando el pedido:', err);
  }
}

const server = app.listen(config.port, () => {
  console.log(`Shopify AI Agent escuchando en http://localhost:${config.port}`);
  console.log(`Tienda: ${config.shop} (Admin API ${config.apiVersion})`);
  console.log(`Webhook: POST /webhooks/orders-create`);
});

/** Apagado ordenado para que el hosting no mate conexiones a medias. */
function shutdown(signal: string): void {
  console.log(`\n${signal} recibido, cerrando servidor...`);
  server.close(() => process.exit(0));
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
