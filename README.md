# Shopify AI Agent

Automatización de una tienda Shopify con agentes de IA, en Node.js + TypeScript.

**Primer caso de uso:** cuando entra un pedido nuevo, un agente de IA genera
automáticamente un mensaje de agradecimiento personalizado para ese cliente,
con sus productos y su nombre.

Coste del setup completo: **0 €**. Dev store gratis + Groq free tier + hosting free tier.

---

## Cómo funciona

```
Cliente compra en la tienda
        │
        ▼
Shopify dispara el webhook  orders/create
        │
        ▼
POST /webhooks/orders-create
        │  1. verifica la firma HMAC (rechaza lo que no venga de Shopify)
        │  2. responde 200 al instante (Shopify exige < 5 s)
        │  3. procesa en segundo plano:
        ▼
    order-agent.ts  →  executor.ts  →  Groq (llama-3.3-70b)
        │
        ▼
    mensaje generado → log + GET /insights
```

---

## Paso a paso desde cero

### 1. Crear la tienda de desarrollo (gratis)

1. Entra en [partners.shopify.com](https://partners.shopify.com)
2. **Stores → Add store → Create development store**
3. Elige *"Create a store to test and build"*
4. Ponle un nombre. No pide tarjeta y no caduca.

Apunta el dominio que te queda: `algo.myshopify.com`

### 2. Crear la custom app y sacar el token

Dentro del **admin de esa tienda**:

1. **Settings → Apps and sales channels → Develop apps**
2. **Allow custom app development** (te lo pide la primera vez) → **Create an app**
3. Nómbrala p. ej. `AI Agent`
4. **Configuration → Admin API integration → Configure**, marca estos scopes:
   - `read_orders`
   - `read_products`
   - `read_customers`
5. **Save** → **Install app**
6. **API credentials** → copia el **Admin API access token** (empieza por `shpat_`)

> Ese token se muestra **una sola vez**. Cópialo ya.

### 3. Configurar el proyecto

```bash
git clone <url-de-este-repo>
cd shopify-ai-agent
npm install
cp .env.example .env
```

Rellena el `.env`:

| Variable | De dónde sale |
|---|---|
| `SHOPIFY_SHOP` | El dominio de tu tienda (`algo.myshopify.com`) |
| `SHOPIFY_ADMIN_TOKEN` | El `shpat_...` del paso 2 |
| `SHOPIFY_WEBHOOK_SECRET` | Paso 5 (déjalo en blanco por ahora) |
| `GROQ_API_KEY` | Gratis en [console.groq.com](https://console.groq.com) |

### 4. Probar que todo responde

```bash
npm run agent:demo        # prueba el agente, solo necesita GROQ_API_KEY
npm run test:connection   # valida las credenciales de Shopify
npm run orders:list       # lista los últimos pedidos de la tienda
```

Si `test:connection` falla, el problema está en `SHOPIFY_SHOP`,
en el token, o en los scopes de la app.

### 5. Conectar el webhook

El servidor corre en tu máquina, así que Shopify necesita una URL pública
para alcanzarlo. Usa un túnel (gratis):

```bash
# en una terminal
npm run dev

# en otra terminal
npx cloudflared tunnel --url http://localhost:3002
```

Cloudflared te da una URL tipo `https://algo-random.trycloudflare.com`.

Ahora en el admin de la tienda:

1. **Settings → Notifications → Webhooks → Create webhook**
2. Evento: **Order creation**
3. Formato: **JSON**
4. URL: `https://algo-random.trycloudflare.com/webhooks/orders-create`
5. Guarda
6. Al final de esa misma página está el **webhook signing secret** →
   cópialo a `SHOPIFY_WEBHOOK_SECRET` en tu `.env` y reinicia `npm run dev`

### 6. Probar con un pedido real (sin dinero real)

En una dev store los pagos son ficticios (*Bogus Gateway*), así que puedes
crear pedidos de prueba sin gastar nada:

1. Admin → **Orders → Create order**
2. Añade cualquier producto → **Collect payment → Mark as paid**

En la terminal de `npm run dev` verás el mensaje que generó el agente.
También queda guardado en `GET http://localhost:3002/insights`.

### 7. Desplegar (opcional, gratis)

Cuando quieras que funcione sin tu ordenador encendido: Railway, Render o
Fly.io tienen free tier suficiente.

- Conecta el repo, build `npm run build`, start `npm start`
- Define las mismas variables de entorno en el panel del hosting
- Actualiza la URL del webhook en Shopify a la del hosting

---

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Arranca el servidor con ts-node (desarrollo) |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm start` | Arranca lo compilado (producción) |
| `npm run typecheck` | Comprueba tipos sin compilar |
| `npm run agent:demo` | Prueba el agente con un pedido de ejemplo |
| `npm run test:connection` | Verifica credenciales de Shopify |
| `npm run orders:list [n]` | Lista los últimos `n` pedidos |

## Endpoints

| Método | Ruta | Para qué |
|---|---|---|
| `GET` | `/health` | Estado del servidor |
| `GET` | `/insights` | Mensajes generados por el agente |
| `POST` | `/webhooks/orders-create` | Recibe el webhook de Shopify (firma verificada) |

---

## Seguridad

- **Nunca** subas el `.env` — ya está en `.gitignore`
- El `shpat_...` da acceso completo a los datos de la tienda según sus scopes
- Todo webhook se valida por HMAC con `timingSafeEqual`; sin firma válida → 401
- Pide solo los scopes que necesites, ni uno más

## Cuándo empiezas a pagar

Nunca, mientras sea una dev store. Solo pagas plan de Shopify (~30 €/mes)
el día que quieras vender de verdad a clientes reales.
