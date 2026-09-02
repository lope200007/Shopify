# Shopify AI Agent — Guía para Claude Code

## Qué es este proyecto

Automatización de una tienda Shopify con agentes de IA. Node.js + TypeScript + Express.
Sin relación con el proyecto NLX/`libre` (ese es Solana), pero comparte sus patrones
de código a propósito: mismo estilo de `executor.ts`, misma inicialización perezosa
del cliente Groq, mismo apagado ordenado con SIGTERM.

**Caso de uso actual:** webhook `orders/create` → agente genera mensaje de
agradecimiento personalizado.

## Estructura

```
src/
  config.ts              — lectura y validación de env (getters perezosos)
  server.ts              — Express: /health, /insights, /webhooks/orders-create
  shopify/
    client.ts            — cliente Admin GraphQL (fetch nativo, sin librerías)
    verify.ts            — verificación HMAC de webhooks
  agents/
    executor.ts          — llamadas a Groq con reintentos y backoff
    order-agent.ts       — prompt + lógica del agente de post-venta
scripts/
  test-connection.ts     — valida credenciales de Shopify
  list-orders.ts         — lista pedidos recientes
  demo-agent.ts          — prueba el agente sin tienda (solo GROQ_API_KEY)
```

## Enfoque elegido: custom app, no app pública

Se usa una **custom app** creada en el admin de la tienda, con un token
`shpat_...` fijo. **No** hay flujo OAuth, ni sesiones, ni App Store, ni revisión.

Esto es deliberado: el proyecto automatiza *una* tienda propia. Si algún día
hubiera que distribuir la app a terceros, entonces sí habría que migrar al
template oficial (`Shopify/shopify-app-template-remix`) con OAuth completo.

## Invariantes críticos

- **Body crudo en webhooks**: la ruta del webhook usa `express.raw()`. La firma
  HMAC se calcula sobre los bytes exactos. Si algún día se añade
  `app.use(express.json())` global, hay que dejar la ruta del webhook fuera o
  la verificación fallará siempre.
- **Responder 200 antes de procesar**: Shopify reintenta el webhook si no
  recibe 200 en 5 segundos. La llamada al LLM va después del `res.send()`,
  en `handleOrder()`.
- **Cliente Groq perezoso**: nunca instanciar a nivel de módulo. `dotenv` debe
  cargar primero y la clave validarse (`getGroq()` en `executor.ts`).
- **`SHOPIFY_WEBHOOK_SECRET` tiene dos orígenes distintos** según cómo se creó
  el webhook: el *webhook signing secret* de Settings → Notifications, o la
  *API secret key* de la app si el webhook se registró por API. No son el mismo
  valor. Está documentado en `.env.example`.
- **`ts-node` y `typescript` van en `dependencies`**, no en devDependencies:
  hace falta para `npm run dev` en contenedores con `npm ci --omit=dev`.
- **Versión de API**: `SHOPIFY_API_VERSION` (por defecto `2026-07`). Shopify
  publica una nueva cada trimestre y da soporte ~12 meses. Al actualizar,
  revisar el changelog de la Admin API por breaking changes.

## Verificación antes de dar algo por bueno

```bash
npm run typecheck     # debe salir limpio
npm run agent:demo    # prueba el agente end-to-end (necesita GROQ_API_KEY)
```

Para probar el webhook sin tienda, firmar el body a mano:

```bash
BODY='{"id":1,"name":"#1001","currency":"EUR","total_price":"10.00","customer":{"first_name":"Ana"},"line_items":[{"title":"Camiseta","quantity":1}]}'
SIG=$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$SHOPIFY_WEBHOOK_SECRET" -binary | base64)
curl -X POST http://localhost:3002/webhooks/orders-create \
  -H "Content-Type: application/json" -H "X-Shopify-Hmac-Sha256: $SIG" -d "$BODY"
```

Firma válida → 200. Firma inválida o ausente → 401.

## Seguridad

- Nunca commitear `.env` (está en `.gitignore`)
- `SHOPIFY_ADMIN_TOKEN` y `GROQ_API_KEY` solo en `.env` o en el panel del hosting
- Pedir el mínimo de scopes: hoy `read_orders`, `read_products`, `read_customers`
- No añadir scopes de escritura sin que haya una necesidad real

## Ideas de siguientes agentes

- **Inventario**: webhook `inventory_levels/update` → avisar cuando algo baja
  del umbral, sugerir reposición
- **Atención al cliente**: responder preguntas frecuentes sobre pedidos
- **Descripciones de producto**: generar copy para productos nuevos
- **Envío real de emails**: hoy el mensaje solo se registra; conectar Resend o
  el propio sistema de notificaciones de Shopify

## Referencia útil

- Admin GraphQL API: https://shopify.dev/docs/api/admin-graphql
- Webhooks: https://shopify.dev/docs/apps/build/webhooks
- Custom apps: https://help.shopify.com/en/manual/apps/app-types/custom-apps
