import Groq from 'groq-sdk';
import { config } from '../config';

let client: Groq | null = null;

/**
 * Inicializacion perezosa del cliente Groq.
 *
 * Nunca instanciar a nivel de modulo: dotenv tiene que cargar primero y la
 * clave tiene que validarse. (Mismo patron que usamos en el proyecto NLX.)
 */
function getGroq(): Groq {
  if (!client) {
    client = new Groq({ apiKey: config.groqApiKey });
  }
  return client;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface AskOptions {
  system: string;
  user: string;
  maxRetries?: number;
  temperature?: number;
}

/**
 * Llama al LLM con reintentos y backoff exponencial.
 * Reintenta ante rate limits (429) y errores 5xx; no reintenta ante 4xx reales.
 */
export async function ask({
  system,
  user,
  maxRetries = 3,
  temperature = 0.7,
}: AskOptions): Promise<string> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const completion = await getGroq().chat.completions.create({
        model: config.groqModel,
        temperature,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      });

      const answer = completion.choices[0]?.message?.content;
      if (!answer) throw new Error('El modelo devolvio una respuesta vacia.');
      return answer.trim();
    } catch (err) {
      lastError = err;

      const status = (err as { status?: number }).status;
      const retryable = status === undefined || status === 429 || status >= 500;
      if (!retryable || attempt === maxRetries) break;

      const waitMs = 2 ** attempt * 1000;
      console.warn(
        `[executor] intento ${attempt + 1} fallo (status ${status ?? 'desconocido'}), reintentando en ${waitMs}ms`
      );
      await sleep(waitMs);
    }
  }

  throw new Error(
    `El agente no pudo responder tras ${maxRetries + 1} intentos: ${String(lastError)}`
  );
}
