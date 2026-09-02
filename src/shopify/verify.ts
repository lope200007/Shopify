import crypto from 'crypto';
import { config } from '../config';

/**
 * Verifica la firma HMAC de un webhook de Shopify.
 *
 * IMPORTANTE: hay que pasar el body EXACTO tal como llego (Buffer crudo).
 * Si el body ya paso por express.json() la firma nunca va a coincidir,
 * porque JSON.stringify reordena y reformatea bytes.
 */
export function isValidWebhook(rawBody: Buffer, hmacHeader: string | undefined): boolean {
  if (!hmacHeader) return false;

  const digest = crypto
    .createHmac('sha256', config.webhookSecret)
    .update(rawBody)
    .digest('base64');

  const received = Buffer.from(hmacHeader, 'utf8');
  const expected = Buffer.from(digest, 'utf8');

  // Longitudes distintas -> timingSafeEqual lanzaria excepcion.
  if (received.length !== expected.length) return false;

  return crypto.timingSafeEqual(received, expected);
}
