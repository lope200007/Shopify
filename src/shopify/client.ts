import { config } from '../config';
import { getAccessToken } from './auth';

export interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

/**
 * Cliente minimo de la Admin GraphQL API de Shopify.
 *
 * No usamos ninguna libreria pesada a proposito: con un custom app instalado
 * en tu propia tienda solo hace falta el header X-Shopify-Access-Token.
 * Nada de OAuth, nada de sesiones.
 */
export async function adminGraphQL<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const url = `https://${config.shop}/admin/api/${config.apiVersion}/graphql.json`;
  const token = await getAccessToken();

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `Shopify Admin API respondio ${res.status} ${res.statusText}: ${body.slice(0, 500)}`
    );
  }

  const json = (await res.json()) as GraphQLResponse<T>;

  if (json.errors?.length) {
    throw new Error(
      `Errores GraphQL de Shopify: ${json.errors.map((e) => e.message).join('; ')}`
    );
  }
  if (!json.data) {
    throw new Error('Shopify devolvio una respuesta sin campo "data".');
  }

  return json.data;
}

export interface ShopInfo {
  shop: {
    name: string;
    myshopifyDomain: string;
    email: string;
    currencyCode: string;
    plan: { displayName: string };
  };
}

/** Trae los datos basicos de la tienda. Sirve para validar credenciales. */
export function getShopInfo(): Promise<ShopInfo> {
  return adminGraphQL<ShopInfo>(`
    query {
      shop {
        name
        myshopifyDomain
        email
        currencyCode
        plan { displayName }
      }
    }
  `);
}

export interface OrderNode {
  id: string;
  name: string;
  createdAt: string;
  displayFulfillmentStatus: string;
  totalPriceSet: { shopMoney: { amount: string; currencyCode: string } };
  customer: { firstName: string | null; lastName: string | null } | null;
  lineItems: { nodes: Array<{ title: string; quantity: number }> };
}

export interface OrdersResponse {
  orders: { nodes: OrderNode[] };
}

/**
 * Maximo de pedidos por consulta.
 *
 * Shopify cobra las queries por coste: una conexion cuesta segun su argumento
 * `first`, y NINGUNA query puede pasar de 1.000 puntos. Aqui cada pedido
 * arrastra ademas lineItems(first: 20), asi que el coste ronda 21 puntos por
 * pedido. 40 pedidos ~ 840 puntos: suficiente margen bajo el limite.
 */
const MAX_ORDERS_PER_QUERY = 40;

/**
 * Ultimos pedidos de la tienda, mas recientes primero.
 *
 * `async` a proposito: asi los errores de validacion salen como promesa
 * rechazada y no como excepcion sincrona, que reventaria a un llamador que
 * solo use .catch().
 */
export async function getRecentOrders(first = 10): Promise<OrdersResponse> {
  if (!Number.isInteger(first) || first < 1) {
    throw new Error('El numero de pedidos debe ser un entero positivo.');
  }
  if (first > MAX_ORDERS_PER_QUERY) {
    throw new Error(
      `Maximo ${MAX_ORDERS_PER_QUERY} pedidos por consulta (limite de coste de Shopify). ` +
        'Para mas, pagina con cursores.'
    );
  }

  return adminGraphQL<OrdersResponse>(
    `
    query RecentOrders($first: Int!) {
      orders(first: $first, sortKey: CREATED_AT, reverse: true) {
        nodes {
          id
          name
          createdAt
          displayFulfillmentStatus
          totalPriceSet { shopMoney { amount currencyCode } }
          customer { firstName lastName }
          lineItems(first: 20) { nodes { title quantity } }
        }
      }
    }
  `,
    { first }
  );
}
