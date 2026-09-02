import { ask } from './executor';

/**
 * Forma minima de un pedido de Shopify, con lo que necesita el agente.
 * El webhook orders/create manda muchisimos campos mas; solo usamos estos.
 */
export interface OrderPayload {
  id?: number | string;
  name?: string;
  currency?: string;
  total_price?: string;
  customer?: {
    first_name?: string | null;
    last_name?: string | null;
  } | null;
  line_items?: Array<{ title?: string; quantity?: number }>;
}

export interface OrderInsight {
  order: string;
  customerName: string;
  itemsSummary: string;
  total: string;
  message: string;
}

function customerName(order: OrderPayload): string {
  const first = order.customer?.first_name?.trim() ?? '';
  const last = order.customer?.last_name?.trim() ?? '';
  const full = `${first} ${last}`.trim();
  return full || 'cliente';
}

function itemsSummary(order: OrderPayload): string {
  const items = order.line_items ?? [];
  if (items.length === 0) return 'sin articulos detallados';
  return items
    .map((i) => `${i.quantity ?? 1}x ${i.title ?? 'articulo sin nombre'}`)
    .join(', ');
}

const SYSTEM_PROMPT = `Eres el agente de post-venta de una tienda online.
Escribes mensajes de agradecimiento para clientes que acaban de comprar.

Reglas:
- Responde SIEMPRE en espanol neutro.
- Maximo 4 frases. Calido pero profesional, nunca empalagoso.
- Menciona los productos comprados de forma natural.
- No inventes plazos de envio, descuentos, ni politicas de devolucion.
- No uses emojis ni signos de exclamacion multiples.
- Devuelve solo el mensaje, sin encabezados ni comillas.`;

/**
 * Genera el mensaje de agradecimiento personalizado para un pedido nuevo.
 * Este es el primer caso de uso del proyecto: se dispara desde el webhook
 * orders/create.
 */
export async function buildOrderInsight(order: OrderPayload): Promise<OrderInsight> {
  const name = customerName(order);
  const items = itemsSummary(order);
  const total = `${order.total_price ?? '?'} ${order.currency ?? ''}`.trim();

  const message = await ask({
    system: SYSTEM_PROMPT,
    user: `Pedido ${order.name ?? 's/n'}
Cliente: ${name}
Articulos: ${items}
Total: ${total}

Escribe el mensaje de agradecimiento.`,
  });

  return {
    order: order.name ?? String(order.id ?? 's/n'),
    customerName: name,
    itemsSummary: items,
    total,
    message,
  };
}
