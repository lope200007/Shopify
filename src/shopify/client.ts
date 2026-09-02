import { config } from '../config';

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

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': config.adminToken,
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

/** Ultimos pedidos de la tienda, mas recientes primero. */
export function getRecentOrders(first = 10): Promise<OrdersResponse> {
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
