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

## Autenticación: client credentials grant

Se usa una app del **Dev Dashboard** autenticada con **client credentials
grant**. No hay redirect OAuth, ni sesiones, ni App Store, ni revisión.

**Contexto que hay que saber antes de tocar `auth.ts`:** desde el 1 de enero
de 2026 Shopify no permite crear las custom apps antiguas del admin (token
`shpat_` fijo, copiado a mano una sola vez). Casi toda la documentación de
terceros anterior a 2026 describe ese flujo muerto. El flujo vivo es:

```
POST https://{shop}.myshopify.com/admin/oauth/access_token
Content-Type: application/x-www-form-urlencoded
grant_type=client_credentials&client_id=...&client_secret=...

→ { "access_token": "...", "scope": "...", "expires_in": 86399 }
```

Requisito: la app y la tienda deben estar en la **misma organización** del Dev
Dashboard. El grant no pide scopes: `scope` en la respuesta es solo un
*readback* de lo configurado en la versión de la app.

Si algún día hubiera que distribuir la app a terceros, habría que migrar al
authorization code grant (template `Shopify/shopify-app-template-remix`).

## Invariantes críticos

- **Body crudo en webhooks**: la ruta del webhook usa `express.raw()`. La firma
  HMAC se calcula sobre los bytes exactos. Si algún día se añade
  `app.use(express.json())` global, hay que dejar la ruta del webhook fuera o
  la verificación fallará siempre.
- **Responder 200 antes de procesar**: Shopify impone un timeout de 5 segundos
  y reintenta 8 veces a lo largo de 4 horas. Tras fallar todos los reintentos,
  elimina automáticamente la suscripción al webhook. La llamada al LLM va
  después del `res.send()`, en `handleOrder()`.
- **El token caduca a las 24 h**: nunca guardar un access token en el `.env` ni
  tratarlo como constante. `getAccessToken()` lo cachea y lo renueva 5 min
  antes de expirar. La única excepción es `SHOPIFY_ADMIN_TOKEN`, para apps
  legacy anteriores a 2026.
- **Coste de queries GraphQL**: modelo de leaky bucket, ninguna query puede
  superar **1.000 puntos**. Las conexiones cuestan según su `first`, los
  objetos 1 punto, las mutations 10. Por eso `getRecentOrders()` está topado a
  40 pedidos: cada uno arrastra `lineItems(first: 20)`. Si añades más campos
  anidados, recalcula el tope.
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

## Skill del proyecto

`.claude/skills/shopify-development/SKILL.md` contiene los hechos de la
plataforma Shopify verificados contra shopify.dev (septiembre 2026):
autenticación post-2026, versionado de API, límites de coste de GraphQL y
reglas de webhooks. **Léelo antes de tocar `src/shopify/`.** Existe porque la
mayoría de la documentación de terceros describe flujos que Shopify eliminó.

## Verificación antes de dar algo por bueno

```bash
npm run typecheck     # debe salir limpio
npm run selftest      # 11 comprobaciones, sin red ni credenciales reales
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
