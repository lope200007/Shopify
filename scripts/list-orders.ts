/**
 * Lista los ultimos pedidos de la tienda.
 * Ejecutar:  npm run orders:list  [cantidad]
 */
import { getRecentOrders } from '../src/shopify/client';

async function main(): Promise<void> {
  const count = Number(process.argv[2] ?? 10);
  const { orders } = await getRecentOrders(count);

  if (orders.nodes.length === 0) {
    console.log('No hay pedidos todavia. Crea uno de prueba en el admin de la tienda.');
    return;
  }

  for (const order of orders.nodes) {
    const who =
      [order.customer?.firstName, order.customer?.lastName].filter(Boolean).join(' ') ||
      'sin cliente';
    const money = `${order.totalPriceSet.shopMoney.amount} ${order.totalPriceSet.shopMoney.currencyCode}`;
    const items = order.lineItems.nodes
      .map((i) => `${i.quantity}x ${i.title}`)
      .join(', ');

    console.log(`${order.name}  ${money}  ${who}  [${order.displayFulfillmentStatus}]`);
    console.log(`   ${items}`);
    console.log(`   ${order.createdAt}\n`);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
