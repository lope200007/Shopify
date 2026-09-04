import { adminGraphQL } from './client';

export interface LineaPedido {
  id: string;
  sku: string | null;
  title: string;
  quantity: number;
}

export interface DireccionEnvio {
  nombre: string;
  direccion1: string;
  direccion2: string | null;
  ciudad: string;
  provincia: string | null;
  codigoPostal: string | null;
  pais: string;
  codigoPais: string;
  telefono: string | null;
}

export interface PedidoPorServir {
  id: string;
  name: string;
  email: string | null;
  createdAt: string;
  envio: DireccionEnvio | null;
  lineas: LineaPedido[];
  /** Se necesita para marcar el pedido como servido. Null si Shopify no lo da. */
  fulfillmentOrderId: string | null;
}

interface RespuestaPedidos {
  orders: {
    nodes: Array<{
      id: string;
      name: string;
      email: string | null;
      createdAt: string;
      shippingAddress: {
        firstName: string | null;
        lastName: string | null;
        address1: string | null;
        address2: string | null;
        city: string | null;
        province: string | null;
        zip: string | null;
        country: string | null;
        countryCodeV2: string | null;
        phone: string | null;
      } | null;
      lineItems: { nodes: Array<{ id: string; title: string; quantity: number; sku: string | null }> };
      fulfillmentOrders: { nodes: Array<{ id: string; status: string }> };
    }>;
  };
}

/**
 * Pedidos pagados y aun sin servir, del mas antiguo al mas reciente.
 *
 * El orden importa: si hay varios pendientes se sirve antes el que lleva mas
 * tiempo esperando, no el ultimo que entro.
 */
export async function pedidosPorServir(limite = 20): Promise<PedidoPorServir[]> {
  if (!Number.isInteger(limite) || limite < 1 || limite > 40) {
    throw new Error('El limite debe ser un entero entre 1 y 40 (coste de query de Shopify).');
  }

  const datos = await adminGraphQL<RespuestaPedidos>(
    `
    query PedidosPendientes($n: Int!) {
      orders(first: $n, sortKey: CREATED_AT, query: "financial_status:paid AND fulfillment_status:unfulfilled") {
        nodes {
          id
          name
          email
          createdAt
          shippingAddress {
            firstName lastName address1 address2 city province zip country countryCodeV2 phone
          }
          lineItems(first: 50) { nodes { id title quantity sku } }
          fulfillmentOrders(first: 5) { nodes { id status } }
        }
      }
    }
  `,
    { n: limite }
  );

  return datos.orders.nodes.map((o) => {
    const d = o.shippingAddress;
    const abierto = o.fulfillmentOrders.nodes.find((f) => f.status === 'OPEN' || f.status === 'IN_PROGRESS');
    return {
      id: o.id,
      name: o.name,
      email: o.email,
      createdAt: o.createdAt,
      envio: d
        ? {
            nombre: [d.firstName, d.lastName].filter(Boolean).join(' ').trim(),
            direccion1: d.address1 ?? '',
            direccion2: d.address2,
            ciudad: d.city ?? '',
            provincia: d.province,
            codigoPostal: d.zip,
            pais: d.country ?? '',
            codigoPais: d.countryCodeV2 ?? '',
            telefono: d.phone,
          }
        : null,
      lineas: o.lineItems.nodes.map((l) => ({
        id: l.id,
        sku: l.sku,
        title: l.title,
        quantity: l.quantity,
      })),
      fulfillmentOrderId: abierto ? abierto.id : null,
    };
  });
}

interface RespuestaServido {
  fulfillmentCreate: {
    fulfillment: { id: string; status: string } | null;
    userErrors: Array<{ message: string }>;
  };
}

/**
 * Marca el pedido como servido en Shopify con su numero de seguimiento.
 *
 * `notifyCustomer: true` a proposito: el cliente recibe el correo con el
 * seguimiento en cuanto CJ lo da. Es la mitad del valor de automatizar esto.
 */
export async function marcarServido(
  fulfillmentOrderId: string,
  seguimiento: { numero: string; empresa: string; url?: string }
): Promise<string> {
  const datos = await adminGraphQL<RespuestaServido>(
    `
    mutation Servir($f: FulfillmentV2Input!) {
      fulfillmentCreate(fulfillment: $f) {
        fulfillment { id status }
        userErrors { message }
      }
    }
  `,
    {
      f: {
        lineItemsByFulfillmentOrder: [{ fulfillmentOrderId }],
        notifyCustomer: true,
        trackingInfo: {
          number: seguimiento.numero,
          company: seguimiento.empresa,
          ...(seguimiento.url ? { url: seguimiento.url } : {}),
        },
      },
    }
  );

  const errores = datos.fulfillmentCreate.userErrors;
  if (errores.length) throw new Error(`Shopify rechazo el envio: ${errores.map((e) => e.message).join('; ')}`);
  if (!datos.fulfillmentCreate.fulfillment) throw new Error('Shopify no devolvio el envio creado.');

  return datos.fulfillmentCreate.fulfillment.id;
}
