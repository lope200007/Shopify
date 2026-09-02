/**
 * Comprobaciones de la logica critica. No necesita tienda, ni red, ni claves
 * reales: usa valores de prueba.
 *
 * Ejecutar:  npm run selftest
 */
import assert from 'assert';
import crypto from 'crypto';

// Valores de prueba ANTES de importar nada que lea configuracion.
process.env.SHOPIFY_SHOP = 'demo-tienda';
process.env.SHOPIFY_CLIENT_ID = 'client_id_de_prueba';
process.env.SHOPIFY_CLIENT_SECRET = 'client_secret_de_prueba';
process.env.SHOPIFY_WEBHOOK_SECRET = 'secreto_de_prueba';
process.env.GROQ_API_KEY = 'gsk_de_prueba';

import { config } from '../src/config';
import { isValidWebhook } from '../src/shopify/verify';
import { getAccessToken, resetTokenCache } from '../src/shopify/auth';
import { getRecentOrders } from '../src/shopify/client';
import { cacheKey } from './linkfox';

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  return Promise.resolve()
    .then(fn)
    .then(() => {
      console.log(`  ok   ${name}`);
      passed++;
    })
    .catch((err) => {
      console.error(`  FALLO ${name}`);
      console.error(`       ${err instanceof Error ? err.message : err}`);
      failed++;
    });
}

async function main(): Promise<void> {
  console.log('\nSelf-test\n');

  await test('el dominio de la tienda se normaliza a .myshopify.com', () => {
    assert.strictEqual(config.shop, 'demo-tienda.myshopify.com');
  });

  await test('el dominio acepta https:// y barra final', () => {
    process.env.SHOPIFY_SHOP = 'https://otra.myshopify.com/';
    assert.strictEqual(config.shop, 'otra.myshopify.com');
    process.env.SHOPIFY_SHOP = 'demo-tienda';
  });

  await test('falta una variable obligatoria -> error claro', () => {
    const saved = process.env.SHOPIFY_CLIENT_ID;
    delete process.env.SHOPIFY_CLIENT_ID;
    assert.throws(() => config.clientId, /SHOPIFY_CLIENT_ID/);
    process.env.SHOPIFY_CLIENT_ID = saved;
  });

  const body = Buffer.from(JSON.stringify({ id: 1, name: '#1001' }), 'utf8');
  const goodSig = crypto
    .createHmac('sha256', 'secreto_de_prueba')
    .update(body)
    .digest('base64');

  await test('webhook con firma valida se acepta', () => {
    assert.strictEqual(isValidWebhook(body, goodSig), true);
  });

  await test('webhook con firma de otro secreto se rechaza', () => {
    const badSig = crypto
      .createHmac('sha256', 'secreto_equivocado')
      .update(body)
      .digest('base64');
    assert.strictEqual(isValidWebhook(body, badSig), false);
  });

  await test('webhook sin cabecera de firma se rechaza', () => {
    assert.strictEqual(isValidWebhook(body, undefined), false);
  });

  await test('firma de longitud distinta se rechaza sin lanzar excepcion', () => {
    // timingSafeEqual lanza si las longitudes difieren: hay que cortar antes.
    assert.strictEqual(isValidWebhook(body, 'corta'), false);
  });

  await test('body alterado invalida la firma', () => {
    const tampered = Buffer.from(JSON.stringify({ id: 2, name: '#1001' }), 'utf8');
    assert.strictEqual(isValidWebhook(tampered, goodSig), false);
  });

  await test('token legacy se usa tal cual, sin pedir uno nuevo', async () => {
    resetTokenCache();
    process.env.SHOPIFY_ADMIN_TOKEN = 'shpat_legacy_de_prueba';
    const token = await getAccessToken();
    assert.strictEqual(token, 'shpat_legacy_de_prueba');
    delete process.env.SHOPIFY_ADMIN_TOKEN;
    resetTokenCache();
  });

  await test('pedir mas pedidos del tope de coste da error explicativo', async () => {
    await assert.rejects(() => getRecentOrders(500), /Maximo 40 pedidos/);
  });

  await test('pedir un numero invalido de pedidos da error', async () => {
    await assert.rejects(() => getRecentOrders(0), /entero positivo/);
  });

  // El ahorro de creditos depende de que nuestra clave de cache coincida BYTE
  // A BYTE con la que calcula el script de linkfox en Python. Si divergen, no
  // encuentra los archivos ya comprados y se paga dos veces en silencio.
  // Referencias generadas con:
  //   sha256(json.dumps(p, ensure_ascii=False, sort_keys=True))[:16]
  const hashFixtures: Array<[Record<string, unknown>, string]> = [
    [{ keyWord: 'yoga mat', cycle: '30', pageSize: 20 }, '6822df815abdbfa0'],
    [
      {
        keyWord: '瑜伽垫',
        cycle: '30',
        sortField: 'saleCount30d',
        sortType: 'desc',
        pageSize: 20,
      },
      '731c3064ee4ca815',
    ],
    [{ pageSize: 1, keyWord: 'a' }, 'a8d8fd02af8960c1'],
    [{ keyWord: 'acento: ñ á é', cycle: '7' }, 'c9e4d81e2b46bcfe'],
  ];

  for (const [params, expected] of hashFixtures) {
    const label = JSON.stringify(params).slice(0, 44);
    await test(`clave de cache coincide con Python: ${label}`, () => {
      assert.strictEqual(cacheKey(params), expected);
    });
  }

  await test('el orden de las claves no altera la clave de cache', () => {
    assert.strictEqual(
      cacheKey({ keyWord: 'a', pageSize: 1 }),
      cacheKey({ pageSize: 1, keyWord: 'a' })
    );
  });

  console.log(`\n${passed} correctos, ${failed} fallidos\n`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
