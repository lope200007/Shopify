import { config } from '../config';

interface TokenResponse {
  access_token: string;
  scope: string;
  expires_in: number;
}

let cached: { token: string; expiresAt: number } | null = null;

/** Margen de seguridad: renovamos 5 min antes de que caduque de verdad. */
const REFRESH_MARGIN_MS = 5 * 60 * 1000;

/**
 * Obtiene un Admin API access token mediante el "client credentials grant".
 *
 * POR QUE ESTO Y NO UN TOKEN FIJO:
 * desde el 1 de enero de 2026 Shopify ya no deja crear las custom apps
 * antiguas del admin (las del token shpat_ pegado a mano). Las apps nuevas se
 * crean en el Dev Dashboard y dan Client ID + Client Secret, que se cambian
 * por un token que CADUCA A LAS 24 HORAS. Por eso hay que cachearlo y
 * renovarlo, no guardarlo en el .env.
 *
 * Requisito de Shopify: la app y la tienda deben pertenecer a la misma
 * organizacion del Dev Dashboard.
 *
 * Si tienes una app legacy anterior a 2026, define SHOPIFY_ADMIN_TOKEN en el
 * .env y se usara ese token directamente, sin pedir uno nuevo.
 */
export async function getAccessToken(): Promise<string> {
  const legacy = config.legacyAdminToken;
  if (legacy) return legacy;

  const now = Date.now();
  if (cached && now < cached.expiresAt) return cached.token;

  const url = `https://${config.shop}/admin/oauth/access_token`;
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: config.clientId,
    client_secret: config.clientSecret,
  });

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `No se pudo obtener el access token (${res.status}): ${text.slice(0, 300)}\n` +
        'Revisa SHOPIFY_CLIENT_ID / SHOPIFY_CLIENT_SECRET y que la app y la tienda ' +
        'esten en la misma organizacion del Dev Dashboard.'
    );
  }

  const data = (await res.json()) as TokenResponse;
  if (!data.access_token) {
    throw new Error('Shopify no devolvio access_token en la respuesta.');
  }

  cached = {
    token: data.access_token,
    expiresAt: now + data.expires_in * 1000 - REFRESH_MARGIN_MS,
  };

  console.log(
    `[auth] token renovado, caduca en ${Math.round(data.expires_in / 3600)}h ` +
      `(scopes: ${data.scope || 'ninguno'})`
  );

  return cached.token;
}

/** Solo para tests: olvida el token cacheado. */
export function resetTokenCache(): void {
  cached = null;
}
