/**
 * Comprueba que las credenciales de Shopify funcionan.
 * Ejecutar:  npm run test:connection
 */
import { getShopInfo } from '../src/shopify/client';
import { config } from '../src/config';

async function main(): Promise<void> {
  console.log(`Conectando a ${config.shop} (Admin API ${config.apiVersion})...\n`);

  const { shop } = await getShopInfo();

  console.log('Conexion correcta.\n');
  console.log(`  Nombre:   ${shop.name}`);
  console.log(`  Dominio:  ${shop.myshopifyDomain}`);
  console.log(`  Email:    ${shop.email}`);
  console.log(`  Moneda:   ${shop.currencyCode}`);
  console.log(`  Plan:     ${shop.plan.displayName}`);
}

main().catch((err) => {
  console.error('\nFallo la conexion:\n');
  console.error(err instanceof Error ? err.message : err);
  console.error(
    '\nRevisa SHOPIFY_SHOP, SHOPIFY_ADMIN_TOKEN y los scopes de la custom app.'
  );
  process.exit(1);
});
