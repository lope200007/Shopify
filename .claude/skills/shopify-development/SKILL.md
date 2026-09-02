---
name: shopify-development
description: Use when working on any Shopify integration — authenticating or getting an access token, calling the Admin GraphQL API, querying orders, products or customers, receiving or verifying webhooks, hitting throttle or cost limits, choosing an API version, or deciding what type of Shopify app to build.
---

# Shopify Development

Practical patterns for Shopify store automation. **Read the "what changed"
section first** — the majority of Shopify tutorials, blog posts and Stack
Overflow answers online describe a flow that Shopify removed in 2026, and
following them wastes hours.

Facts here were verified against shopify.dev in September 2026. Anything with a
date attached should be re-verified if a lot of time has passed.

## What changed in 2026 (read this before anything else)

**Admin-created custom apps are dead for new apps.** Since **1 January 2026**
you can no longer create the old-style custom app in the store admin — the one
that showed you an `shpat_...` Admin API access token to copy once and paste
into a config file.

| | Legacy (pre-2026, still works if it exists) | Current |
|---|---|---|
| Where you create it | Admin → Settings → Apps → Develop apps | **Dev Dashboard** or Shopify CLI |
| What you get | `shpat_...` token, shown once | **Client ID + Client Secret** |
| Token lifetime | Never expires | **24 hours**, must be refreshed |
| To rotate | Uninstall + reinstall the app | Just request a new token |

If a tutorial says "copy your Admin API access token from the admin", it is
describing the dead flow. Existing legacy apps keep working — only *creating*
new ones is blocked.

## Getting an access token (client credentials grant)

For an app acting on stores in **your own organization** — the normal case for
automating your own store — this is the least-setup grant. No redirect, no
callback URL, no session storage.

```
POST https://{shop}.myshopify.com/admin/oauth/access_token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id={id}&client_secret={secret}
```

Response:

```json
{ "access_token": "...", "scope": "read_orders,read_products", "expires_in": 86399 }
```

Rules that bite if you ignore them:

1. **The token expires in 24 hours.** Cache it in memory and refresh a few
   minutes before expiry. Never persist it in `.env` or treat it as a constant.
2. **App and store must be in the same Dev Dashboard organization**, or the
   request fails.
3. **The grant does not request scopes.** The `scope` field in the response is
   a readback of what was configured on the app's version in the Dev Dashboard.
   To change scopes, edit the app version and release it — not the token call.
4. Use the token as the `X-Shopify-Access-Token` header on API calls.

For apps distributed to **other merchants**, this grant does not apply — use
the authorization code grant (the `Shopify/shopify-app-template-remix` template
handles it).

## API versioning

- Version strings are dates: `YYYY-MM`. New stable version every quarter:
  **January, April, July, October**, on the 1st.
- Each version is supported at least **12 months**.
- As of September 2026 the current stable is **`2026-07`**; `2026-10` lands
  1 October 2026.
- **Always pin a version explicitly** in the URL. Never rely on a default.
- Endpoint shape: `https://{shop}.myshopify.com/admin/api/{version}/graphql.json`

Put the version in an env var so bumping it is a config change, not a code
change.

## Rate limits: cost-based, not request-based

The GraphQL Admin API does **not** count requests. It runs a leaky bucket of
points:

| Plan | Restore rate |
|---|---|
| Standard | 100 points/sec |
| Advanced | 200 points/sec |
| Plus | 1000 points/sec |
| Enterprise | 2000 points/sec |

Cost calculation:

- Scalars and enums: **0 points**
- Objects: **1 point**
- Connections: sized by the `first` / `last` argument
- Mutations: **10 points** default

**Hard ceiling: no single query may exceed 1,000 points, on any plan.**

This is the trap: nested connections multiply. `orders(first: 50)` each with
`lineItems(first: 20)` costs roughly 50 × 21 ≈ 1,050 points → rejected outright,
regardless of plan. Cap page sizes in code and paginate with cursors instead of
raising `first`.

Shopify returns the requested cost up front and refunds the difference between
requested and actual cost after execution.

## Webhooks

### Verification (get this wrong and nothing works)

- Header: `X-Shopify-Hmac-SHA256` (HTTP headers are case-insensitive, so
  `req.get()` handles casing for you)
- Algorithm: **HMAC-SHA256**, **base64** encoded
- Signed with the app's **client secret** for API-created subscriptions; a
  webhook created by hand in **Settings → Notifications** is signed with a
  **store-level secret shown on that page instead**. These are different
  values — using the wrong one fails every time with no useful error.
- **The raw, unparsed body is required.** If `express.json()` touches the body
  before verification, the signature will never match, because re-serializing
  JSON changes bytes and key order.
- Compare with a timing-safe comparison, and length-check first —
  `crypto.timingSafeEqual` throws on length mismatch.

```ts
app.post('/webhooks/x', express.raw({ type: 'application/json' }), (req, res) => {
  const digest = crypto.createHmac('sha256', SECRET).update(req.body).digest('base64');
  // length check, then crypto.timingSafeEqual
});
```

### Delivery rules

- **5-second timeout** for the whole request.
- On failure Shopify **retries 8 times over 4 hours**.
- After all retries fail, API-created subscriptions are **deleted
  automatically** and a warning email goes to the app's emergency contact.

Therefore: **respond 200 immediately, then do the slow work.** Any LLM call,
database write, or third-party request must happen *after* `res.send()`, never
before. A webhook handler that awaits an LLM call inline will silently lose its
subscription under load.

## Choosing an app type

| Goal | Use |
|---|---|
| Automate one store you own | Dev Dashboard app + client credentials grant |
| Custom storefront, Shopify backend | Hydrogen (Storefront API) |
| Restyle an existing store | Theme (Liquid) — no app needed |
| Distribute to other merchants | Authentication with authorization code grant, App Store review |

Do not reach for the full embedded-app template when automating a single store.
It brings OAuth, session storage, Polaris and App Bridge for no benefit.

## Cost model (relevant when advising a beginner)

- A **development store** under a Partners account is **free indefinitely** and
  needs no card.
- Dev stores use the **Bogus Gateway** for fake payments, so end-to-end order
  flows can be tested with zero real money.
- A paid Shopify plan is only needed to sell to real customers.

## Local development

Shopify must reach your machine over HTTPS to deliver webhooks. Use a tunnel:

```bash
npx cloudflared tunnel --url http://localhost:3002
```

Then point the webhook subscription at the tunnel URL. The URL changes on each
restart of an ephemeral tunnel — update the subscription when it does.

## Security

- Least privilege on scopes. `read_orders` exposes customer PII; do not add
  write scopes without a concrete need.
- Client secret and access tokens belong in env vars or the host's secret
  store, never in code or logs.
- Reject unverified webhooks with 401 before parsing the body.
- Order and customer payloads are personal data — think before logging them
  verbatim or sending them to a third-party LLM.

## Authoritative sources

Prefer these over blog posts, which are frequently pre-2026 and wrong:

- API versioning: https://shopify.dev/docs/api/usage/versioning
- Rate limits: https://shopify.dev/docs/api/usage/rate-limits
- Webhooks over HTTPS: https://shopify.dev/docs/apps/build/webhooks/subscribe/https
- Client credentials grant: https://shopify.dev/docs/apps/build/authentication-authorization/client-credentials-grant
- Admin GraphQL reference: https://shopify.dev/docs/api/admin-graphql
