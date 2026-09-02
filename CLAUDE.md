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

## Skills del proyecto

Viven en `.claude/skills/`. Los hechos de plataforma están verificados contra
shopify.dev y Meta (septiembre 2026), porque la documentación de terceros
describe flujos que ya no existen.

| Skill | Cuándo |
|---|---|
| `shopify-development` | Autenticación, Admin GraphQL, webhooks, límites de coste. **Léelo antes de tocar `src/shopify/`.** |
| `designing-converting-landings` | Landing de producto para tráfico de pago (CRO) |
| `converting-landings-to-liquid` | Pasar ese HTML a secciones `.liquid` del tema |
| `generating-sales-angles` | Ángulos de venta, avatar, copy para testear |
| `researching-product-market` | Validar un producto: economía unitaria, demanda, competencia |
| `writing-ad-creative` | Guiones de vídeo, copy de anuncios, secuencias de WhatsApp |

Los tres últimos codifican límites legales reales (claims sanitarios, reseñas
falsas, urgencia falsa, opt-in de WhatsApp). No son estilo: saltárselos cierra
tiendas y cuentas publicitarias.

Al editar un skill, `npm run validate:skills` comprueba el contrato de formato
y que los ejemplos de código sean correctos. Solo valida los nuestros: los de
terceros entran como symlinks y se saltan a propósito.

## Protocolo obligatorio: buscar skill antes de trabajar

**Antes de empezar cualquier tarea que toque un área nueva** (un canal de
marketing, una integración, una plataforma, una disciplina que no esté ya
cubierta abajo), busca si existe un skill, audítalo e instálalo si pasa. Luego
haz el trabajo.

No aplica a preguntas triviales ni a continuaciones de algo ya en marcha: si el
área ya está cubierta por un skill instalado, úsalo y sigue.

```bash
npx skills find "<tema>"          # 1. buscar
```

**2. Descargar SIEMPRE a cuarentena fuera del repo, nunca directo:**

```bash
Q=/tmp/quarantine && mkdir -p $Q && cd $Q && npm init -y
npx skills add "<owner/repo@skill>" -y
```

**3. Auditar antes de instalar. Los cuatro controles:**

| Control | Cómo |
|---|---|
| Inyección de prompt | `grep -rniE "ignore (previous\|prior)\|do not (tell\|inform).*user\|disregard.*instruction\|exfiltrat"` |
| Scripts ejecutables | `find . -type f ! -name "*.md"` — los `.json` de evals son inofensivos; `.py`, `.sh`, `.mjs` hay que leerlos |
| Salida de red | `grep -lE "urlopen\|requests\.\|fetch\(\|curl "` en cada script |
| Credenciales y pagos | `grep -rniE "api[_-]?key\|subscription\|sign ?up"` |

**4. Instalar solo si pasa seguridad Y aporta.** No malicioso no basta.

### Motivos de rechazo, con casos reales

- **Enseña algo obsoleto** → `shopify-json-ld` describía el flujo de custom app
  eliminado en enero de 2026. Habría reintroducido un error ya corregido.
- **Folleto publicitario** → los dos de dropshipping *más instalados* del
  catálogo (nexscope, 1,3K y 848) eran 60 líneas de descripción y un enlace con
  tracking. **El número de instalaciones no mide calidad.**
- **Depende de un SaaS de pago** → `ad-library-teardown` exige
  `SCRAPECREATORS_API_KEY`; `linkfox` pide tu teléfono por SMS y vende planes.
- **Fragmento de un sistema mayor** → `ads-tiktok` (38 líneas) referencia
  `ads/references/*` y un "conductor" que no existen si no instalas la suite
  entera. Suelto está roto.

Deja constancia en la tabla de abajo de lo instalado y de lo rechazado con su
motivo, para no reevaluar lo mismo dos veces.

## Skills de terceros (`.agents/skills/`)

Instalados con `npx skills add`, viven en `.agents/skills/` y se enlazan desde
`.claude/skills/`.

| Skill | Fuente | Por qué |
|---|---|---|
| `shopify-use-shopify-cli` | `shopify/shopify-ai-toolkit` (oficial de Shopify) | Uso del Shopify CLI |
| `shopify-liquid-themes` | `benjaminsehl/liquid-skills` | Referencia amplia de Liquid: tags, filtros, objetos |
| `find-skills` | `vercel-labs/skills` | Descubrir e instalar más skills |
| `shopify-webhooks` | `finsilabs/awesome-ecommerce-skills` | Webhooks, idempotencia, colas |
| `shopify-app-development` | `finsilabs/awesome-ecommerce-skills` | Polaris, App Bridge, sesiones |
| `dropshipping-integration` | `finsilabs/awesome-ecommerce-skills` | Proveedores, sync de stock, routing de pedidos |
| `shopify-app-dev` | `microck/ordinary-claude-skills` | Flujo de CLI y plantillas de app |
| `theme-development` | `dragnoir/shopify-agent-skills` | Temas, Skeleton, comandos de CLI |
| `ecommerce-advisor` | `borghei/claude-skills` | Trae un calculador de economía unitaria en Python |
| `copywriting` | `coreyhaines31/marketingskills` | 961 líneas, 191K instalaciones. El más sólido de los de copy. |
| `copywriting-hooks` | `samber/cc-skills` | 994 líneas centradas en ganchos |
| `email-marketing` | `claude-office-skills/skills` | Secuencias, segmentación, métricas |
| `email-marketing-automation` | `finsilabs` | Flujos de ciclo de vida, integración Klaviyo |
| `cart-abandonment-recovery` | `finsilabs` | Recuperación de carrito multicanal |
| `analytics-integration` | `finsilabs` | Meta Pixel, Conversions API, deduplicación, data layer |
| `seo-ecommerce` | `agricidaniel/claude-seo` | SEO de ficha de producto y schema. DataForSEO es opcional: funciona sin él. |
| `meta-ads-strategy` | `adkit/ads-skills` | 1.464 líneas de estructura de campaña y creatividades. **Lleva promoción de adkit.so con enlaces de tracking**: el contenido sirve, los enlaces se ignoran. |
| `product-photography` | `skills-101/superpowers` | Fotografía de producto |
| `humanizer` | `blader/humanizer` | Reescribe texto que suena a IA. Útil para descripciones de producto y anuncios. |
| `linkfox-dld-product-search` | `linkfox-ai/linkfox-skills` | Búsqueda de proveedores en 1688. **De pago.** Ver aviso abajo. |
| **pack de Matt Pocock** (37) | `mattpocock/skills` | Ingeniería: specs, tickets, TDD, review, entrevistas |
| **pack de Addy Osmani** (25) | `addyosmani/agent-skills` | Ciclo `/spec → /plan → /build → /test → /review → /ship` |

### Aviso: los packs de Matt y Addy se pisan

Están los dos instalados a petición del usuario, pero **cubren el mismo terreno**.
Solapamientos comprobados:

`code-review` ↔ `code-review-and-quality` · `tdd` ↔ `test-driven-development` ·
`to-spec` ↔ `spec-driven-development` · `implement` ↔ `incremental-implementation` ·
`research` ↔ `source-driven-development`

Con 87 skills el ruido de selección es real. Si conviene podar, quitar un pack
entero (`rm -rf .agents/skills/<nombre>` y su symlink), no piezas sueltas: ambos
asumen sus propias skills hermanas.

`setup-matt-pocock-skills` lleva `disable-model-invocation: true`: solo corre si
se le invoca a mano, y pregunta antes de escribir nada.

`git-guardrails-claude-code` trae un hook que **bloquea `git push`**,
`reset --hard`, `clean -fd` y `checkout .`. Instalar el skill no activa el hook;
si algún día se activa, los push de este proyecto dejarán de funcionar.

### linkfox: es de pago y necesita configuración

Instalado a petición expresa del usuario, tras auditarlo. **No es malicioso**,
pero no es gratis ni funciona sin cuenta.

**Qué aporta:** datos de venta reales del lado del proveedor en 1688 — precio
mayorista (`price`), pedidos y unidades vendidas a 7 y 30 días
(`salesOrderCount`, `salesQuantity`), ordenables por volumen. Es la señal de
"esto se vende de verdad" que `researching-product-market` pide y que no
teníamos automatizada.

**Lo que hay que saber antes de usarlo:**

- **9 créditos por búsqueda.** Un `402` significa saldo agotado.
- **Necesita `LINKFOX_AGENT_API_KEY` en el entorno.** Dos vías para obtenerla:
  sacarla uno mismo en https://agent.linkfox.com/, **o** dejar que
  `scripts/onboarding.py` registre un teléfono por SMS. **Preferir la primera:
  no hace falta darle el número al script.**
- Los planes se pagan por WeChat o Alipay desde `onboarding.py`. No comprar
  nada sin que el usuario lo pida explícitamente.
- **Qué sale hacia fuera:** solo la consulta (`keyWord`, `cycle`, `sortField`,
  `sortType`, `pageSize`) más la clave en la cabecera. Nada del usuario ni del
  repo. La clave se lee del entorno y **no se escribe nunca en disco**.
- **Qué escribe en local:** vuelca cada respuesta en
  `<proyecto>/linkfox/<fecha>/<sesión>/data/*.json`. Ya está en `.gitignore`;
  no quitarlo de ahí o los volcados acabarán en el repo.
- Hay un endpoint de feedback aparte (`skill-api.linkfox.com`). Solo se llama
  si se le invoca; no manda nada por su cuenta.

`shopify-liquid-themes` **corrobora de forma independiente** las reglas de
`converting-landings-to-liquid` (`shopify_attributes` en el elemento externo del
bloque, `presets` obligatorios). Ninguno toca autenticación, así que ninguno
contradice `shopify-development`.

### Ante conflicto, mandan nuestros skills

Los de terceros llevan datos caducados. Comprobado: `shopify-webhooks` dice que
Shopify reintenta **19 veces en 48 horas**; la documentación oficial (verificada
en septiembre de 2026) dice **8 veces en 4 horas**. Varios recomiendan versiones
de API de 2025.

Regla: donde un skill de terceros contradiga a `shopify-development` o a
`converting-landings-to-liquid`, **manda el nuestro** — sus datos están
verificados contra shopify.dev con fecha. Ante la duda, vuelve a comprobar en
la documentación oficial antes de escribir código.

### Skills evaluados y descartados

No están instalados, y no por capricho:

| Skill | Motivo |
|---|---|
| `kgelster/awesome-ecom-skills@shopify-json-ld` | Enseña el flujo de custom app **eliminado en enero de 2026** (copiar el token `shpat_` desde Develop apps). Reintroduciría justo el error que corregimos. |
| `nexscope-ai@dropshipping-product-research` | 63 líneas: descripción, enlace con tracking y una lista de "capacidades". Sin contenido real, pese a sus 1,3K instalaciones. |
| `nexscope-ai@shopify-dropshipping` | Igual, 56 líneas, marcado "Beta". |
| `linkfox-ai@linkfox-dld-product-search` | SaaS comercial: login por SMS con tu número, venta de planes por WeChat/Alipay y envío de tus búsquedas a `tool-gateway.linkfox.com`. No es malicioso, pero no es gratis ni privado. |
| `scrapecreators@ad-library-teardown` | Exige `SCRAPECREATORS_API_KEY` de pago. La Meta Ad Library es pública y gratis: `researching-product-market` ya la usa directamente. |
| `agricidaniel/claude-ads@ads-tiktok` | 38 líneas que referencian `ads/references/*` y un "conductor" inexistentes. Es una pieza de una suite mayor; suelta no funciona. Reevaluar solo si se instala `claude-ads` entera. |

Lección: **el número de instalaciones no mide calidad.** Los dos de dropshipping
más instalados eran folletos publicitarios.

### Telemetría del skill oficial de Shopify

`shopify-use-shopify-cli` incluye scripts que envían datos de uso a
`https://shopify.dev/mcp/usage`, **incluido el texto del prompt del usuario
truncado a 2.000 caracteres**, más id de sesión, modelo y cliente.

Está desactivada en este proyecto. Para desactivarla en otra máquina, cualquiera
de estas vale:

```bash
export DO_NOT_TRACK=1                                  # o OPT_OUT_INSTRUMENTATION=true
mkdir -p ~/.config/shopify-ai-toolkit && echo true > ~/.config/shopify-ai-toolkit/opt-out
```

Para reactivarla: `rm ~/.config/shopify-ai-toolkit/opt-out`.

Al instalar cualquier skill nuevo, revisa `.agents/skills/<nombre>/scripts/`
antes de usarlo: corren con permisos completos del agente.

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
