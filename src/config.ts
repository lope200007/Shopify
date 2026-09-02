import dotenv from 'dotenv';

dotenv.config();

/**
 * Lee una variable de entorno obligatoria. Falla temprano y con un mensaje
 * claro si falta, en vez de romper a mitad de una request.
 */
function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(
      `Falta la variable de entorno ${name}. Copia .env.example a .env y rellenala.`
    );
  }
  return value.trim();
}

function optional(name: string, fallback: string): string {
  const value = process.env[name];
  return value && value.trim() !== '' ? value.trim() : fallback;
}

/** Normaliza el dominio: acepta "mi-tienda", con https:// o con barra final. */
function normalizeShop(raw: string): string {
  let shop = raw.replace(/^https?:\/\//, '').replace(/\/+$/, '');
  if (!shop.includes('.')) shop = `${shop}.myshopify.com`;
  return shop;
}

export const config = {
  get shop(): string {
    return normalizeShop(required('SHOPIFY_SHOP'));
  },
  get clientId(): string {
    return required('SHOPIFY_CLIENT_ID');
  },
  get clientSecret(): string {
    return required('SHOPIFY_CLIENT_SECRET');
  },
  /**
   * Token fijo de una custom app legacy (anterior a 2026). Opcional:
   * si existe, se usa tal cual y no se pide token por client credentials.
   */
  get legacyAdminToken(): string | null {
    const value = process.env.SHOPIFY_ADMIN_TOKEN;
    return value && value.trim() !== '' ? value.trim() : null;
  },
  get webhookSecret(): string {
    return required('SHOPIFY_WEBHOOK_SECRET');
  },
  get apiVersion(): string {
    return optional('SHOPIFY_API_VERSION', '2026-07');
  },
  get groqApiKey(): string {
    return required('GROQ_API_KEY');
  },
  get groqModel(): string {
    return optional('GROQ_MODEL', 'llama-3.3-70b-versatile');
  },
  get port(): number {
    return Number(optional('PORT', '3002'));
  },
};
