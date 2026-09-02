/**
 * Prueba el agente SIN necesidad de una tienda ni de un pedido real.
 * Solo necesita GROQ_API_KEY en el .env.
 *
 * Ejecutar:  npm run agent:demo
 */
import { buildOrderInsight, OrderPayload } from '../src/agents/order-agent';

const pedidoDeEjemplo: OrderPayload = {
  id: 1234567890,
  name: '#1001',
  currency: 'EUR',
  total_price: '89.90',
  customer: { first_name: 'Ana', last_name: 'Martinez' },
  line_items: [
    { title: 'Camiseta algodon organico', quantity: 2 },
    { title: 'Gorra bordada', quantity: 1 },
  ],
};

async function main(): Promise<void> {
  console.log('Generando mensaje para un pedido de ejemplo...\n');

  const insight = await buildOrderInsight(pedidoDeEjemplo);

  console.log(`Pedido:    ${insight.order}`);
  console.log(`Cliente:   ${insight.customerName}`);
  console.log(`Articulos: ${insight.itemsSummary}`);
  console.log(`Total:     ${insight.total}`);
  console.log(`\nMensaje generado:\n${insight.message}\n`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
