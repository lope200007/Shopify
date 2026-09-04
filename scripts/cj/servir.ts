/**
 * Sirve automaticamente en CJ los pedidos pagados y pendientes de Shopify.
 *
 *   npm run servir              # simulacion: no toca nada, solo enseña que haria
 *   npm run servir -- --sandbox --ejecutar   # pedido de prueba real en CJ, sin cobro
 *   npm run servir -- --ejecutar             # DE VERDAD: crea, paga y marca servido
 *
 * QUE HACE, POR ORDEN:
 *   1. Lee de Shopify los pedidos pagados y sin servir
 *   2. Traduce cada SKU al vid interno de CJ (scripts/cj/mapa.js)
 *   3. Elige el transporte mas barato con freightCalculate
 *   4. Crea el pedido en CJ con payType=2 (cobro contra saldo)
 *   5. Paga con el saldo del monedero
 *   6. Cuando CJ da el numero de seguimiento, marca el pedido servido en
 *      Shopify y el cliente recibe el correo
 *
 * POR QUE HAY UN LIBRO DE REGISTRO:
 * Sin el, dos ejecuciones seguidas crearian el pedido dos veces en CJ y se
 * pagaria dos veces. `.cj-pedidos.json` guarda que pedido de Shopify ya se
 * mando y con que id de CJ. Es lo unico que impide cobrar de mas. Esta en el
 * .gitignore porque contiene direcciones de clientes.
 */
import fs from 'fs';
import path from 'path';
import { pedidosPorServir, marcarServido, type PedidoPorServir } from '../../src/shopify/pedidos';

const cj = require('./cj');
const { resolver } = require('./mapa');

const LIBRO = path.join(__dirname, '..', '..', '.cj-pedidos.json');

/** Pais desde el que sale la mercancia. Todo nuestro stock esta en China. */
const PAIS_ORIGEN = 'CN';

/**
 * IOSS: quien paga el IVA de importacion en la UE.
 *   1 = sin IOSS   2 = el nuestro   3 = el de CJ
 * Usamos el de CJ (3) para que al cliente no le reclamen nada en la entrega.
 * Cuando la tienda tenga su propio numero IOSS, cambiar a 2 y rellenar
 * IOSS_NUMERO.
 */
const IOSS_TIPO = 3;
const IOSS_NUMERO = '';

interface Registro {
  pedidoShopify: string;
  cjOrderId: string;
  creado: string;
  pagado: boolean;
  servidoEnShopify: boolean;
  sandbox: boolean;
}

function leerLibro(): Record<string, Registro> {
  try {
    return JSON.parse(fs.readFileSync(LIBRO, 'utf8'));
  } catch {
    return {};
  }
}

function guardarLibro(libro: Record<string, Registro>): void {
  fs.writeFileSync(LIBRO, JSON.stringify(libro, null, 1));
}

/** Traduce las lineas del pedido a productos de CJ. Lanza si algo no mapea. */
function lineasACj(pedido: PedidoPorServir): Array<{ vid: string; quantity: number; storeLineItemId: string }> {
  const salida: Array<{ vid: string; quantity: number; storeLineItemId: string }> = [];

  for (const linea of pedido.lineas) {
    if (!linea.sku) throw new Error(`"${linea.title}" no tiene SKU; no se puede servir.`);

    const r = resolver(linea.sku);
    if (!r) throw new Error(`El SKU ${linea.sku} no esta en scripts/cj/mapa.js. Añadelo antes de servir.`);

    // Un pack son varios articulos de CJ dentro de una sola linea de Shopify.
    const partes = r.pack ? r.pack : r;
    for (const p of partes) {
      if (!p.vid) throw new Error(`El SKU ${linea.sku} resuelve a un componente sin vid.`);
      salida.push({ vid: p.vid, quantity: linea.quantity, storeLineItemId: linea.id });
    }
  }

  return salida;
}

/** El transporte mas barato que llegue al pais del cliente. */
async function transporteMasBarato(
  productos: Array<{ vid: string; quantity: number }>,
  codigoPais: string
): Promise<{ nombre: string; precio: number; plazo: string }> {
  const opciones = await cj.portes({
    startCountryCode: PAIS_ORIGEN,
    endCountryCode: codigoPais,
    products: productos.map((p) => ({ vid: p.vid, quantity: p.quantity })),
  });

  if (!opciones || opciones.length === 0) {
    throw new Error(
      `CJ no tiene ninguna ruta de ${PAIS_ORIGEN} a ${codigoPais} para estos articulos. ` +
        'Suele significar que el stock esta en un almacen que no envia a ese pais.'
    );
  }

  const mejor = opciones
    .map((o: any) => ({ nombre: o.logisticName, precio: Number(o.logisticPrice), plazo: o.logisticAging }))
    .sort((a: any, b: any) => a.precio - b.precio)[0];

  return mejor;
}

/**
 * Campos que CJ marca como obligatorios en createOrderV2. Si falta uno, CJ
 * rechaza el pedido con "Param error" y no dice cual. Mejor fallar aqui.
 */
const OBLIGATORIOS = [
  'orderNumber',
  'shippingCountryCode',
  'shippingCountry',
  'shippingProvince',
  'shippingCity',
  'shippingCustomerName',
  'shippingAddress',
  'logisticName',
  'fromCountryCode',
] as const;

function validar(cuerpo: Record<string, any>): void {
  const faltan = OBLIGATORIOS.filter((c) => !cuerpo[c] || String(cuerpo[c]).trim() === '');
  if (faltan.length) throw new Error(`Faltan campos obligatorios para CJ: ${faltan.join(', ')}`);

  if (!Array.isArray(cuerpo.products) || cuerpo.products.length === 0) {
    throw new Error('El pedido no lleva ningun producto.');
  }
  // CJ corta orderNumber a 50 caracteres; si se pasa, se perderia la referencia.
  if (cuerpo.orderNumber.length > 50) throw new Error('orderNumber pasa de 50 caracteres.');
}

function payload(pedido: PedidoPorServir, productos: any[], transporte: string, sandbox: boolean) {
  const e = pedido.envio!;
  return {
    orderNumber: pedido.name, // el mismo numero que ve el cliente: #1001
    shippingCustomerName: e.nombre,
    shippingAddress: e.direccion1,
    shippingAddress2: e.direccion2 ?? '',
    shippingCity: e.ciudad,
    shippingProvince: e.provincia ?? e.ciudad,
    shippingCountry: e.pais,
    shippingCountryCode: e.codigoPais,
    shippingZip: e.codigoPostal ?? '',
    shippingPhone: e.telefono ?? '',
    email: pedido.email ?? '',
    logisticName: transporte,
    fromCountryCode: PAIS_ORIGEN,
    payType: 2, // cobro contra saldo del monedero
    iossType: IOSS_TIPO,
    iossNumber: IOSS_NUMERO,
    platform: 'shopify',
    ...(sandbox ? { isSandbox: 1 } : {}),
    products: productos,
  };
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const ejecutar = args.includes('--ejecutar');
  const sandbox = args.includes('--sandbox');

  const libro = leerLibro();
  const pedidos = await pedidosPorServir(20);

  if (pedidos.length === 0) {
    console.log('No hay pedidos pagados pendientes de servir.');
    return;
  }

  console.log(
    `${pedidos.length} pedido(s) pendiente(s).` +
      (ejecutar ? (sandbox ? '  MODO SANDBOX (sin cobro real).' : '  MODO REAL.') : '  Simulacion: no se toca nada.')
  );

  const saldo = await cj.pedir('/shopping/pay/getBalance');
  console.log(`Saldo en CJ: ${saldo.amount} (retenido ${saldo.freezeAmount})\n`);

  for (const pedido of pedidos) {
    console.log(`--- ${pedido.name}  (${pedido.createdAt.slice(0, 10)})`);

    const yaHecho = libro[pedido.name];
    if (yaHecho && !yaHecho.servidoEnShopify) {
      console.log(`    Ya existe en CJ como ${yaHecho.cjOrderId}. No se vuelve a crear.`);
    } else if (yaHecho) {
      console.log('    Ya servido. Nada que hacer.');
      continue;
    }

    if (!pedido.envio) {
      console.log('    SIN DIRECCION DE ENVIO. Se salta.');
      continue;
    }
    if (!pedido.fulfillmentOrderId) {
      console.log('    Shopify no da fulfillmentOrder abierto. Se salta.');
      continue;
    }

    let productos: any[];
    try {
      productos = lineasACj(pedido);
    } catch (err) {
      console.log(`    ${err instanceof Error ? err.message : err}`);
      continue;
    }

    let transporte;
    try {
      transporte = await transporteMasBarato(productos, pedido.envio.codigoPais);
    } catch (err) {
      console.log(`    ${err instanceof Error ? err.message : err}`);
      continue;
    }

    console.log(`    ${productos.length} articulo(s) -> ${productos.map((p) => p.vid).join(', ')}`);
    console.log(`    ${pedido.envio.ciudad} (${pedido.envio.codigoPais})`);
    console.log(`    ${transporte.nombre}: ${transporte.precio} USD, ${transporte.plazo} dias`);

    const cuerpo = payload(pedido, productos, transporte.nombre, sandbox);
    try {
      validar(cuerpo);
    } catch (err) {
      console.log(`    ${err instanceof Error ? err.message : err}`);
      continue;
    }

    if (!ejecutar) {
      console.log('    [simulacion] esto es lo que se enviaria a CJ:');
      console.log(
        JSON.stringify(cuerpo, null, 1)
          .split('\n')
          .map((l) => '    ' + l)
          .join('\n')
      );
      continue;
    }

    let cjOrderId = yaHecho?.cjOrderId;

    if (!cjOrderId) {
      const creado = await cj.pedir('/shopping/order/createOrderV2', null, cuerpo);
      cjOrderId = creado.orderId || creado.orderNum || creado.id;
      if (!cjOrderId) throw new Error(`CJ no devolvio orderId: ${JSON.stringify(creado).slice(0, 200)}`);
      console.log(`    creado en CJ: ${cjOrderId}`);

      libro[pedido.name] = {
        pedidoShopify: pedido.name,
        cjOrderId,
        creado: new Date().toISOString(),
        pagado: false,
        servidoEnShopify: false,
        sandbox,
      };
      guardarLibro(libro); // se guarda ANTES de pagar: si algo peta, no se duplica
    }

    if (!libro[pedido.name].pagado) {
      try {
        await cj.pedir('/shopping/pay/payBalance', null, { orderId: cjOrderId });
        libro[pedido.name].pagado = true;
        guardarLibro(libro);
        console.log('    pagado con el saldo');
      } catch (err) {
        console.log(`    NO SE PUDO PAGAR: ${err instanceof Error ? err.message : err}`);
        console.log('    El pedido queda creado en CJ; se paga al reintentar con saldo.');
        continue;
      }
    }

    const detalle = await cj.pedir('/shopping/order/getOrderDetail', { orderId: cjOrderId });
    const seguimiento = detalle.trackNumber || detalle.trackingNumber;

    if (!seguimiento) {
      console.log('    Aun sin numero de seguimiento. Vuelve a ejecutar mas tarde.');
      continue;
    }

    await marcarServido(pedido.fulfillmentOrderId, {
      numero: seguimiento,
      empresa: transporte.nombre,
    });
    libro[pedido.name].servidoEnShopify = true;
    guardarLibro(libro);
    console.log(`    servido en Shopify con seguimiento ${seguimiento}`);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
