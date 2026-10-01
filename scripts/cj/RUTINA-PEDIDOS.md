# Rutina automática: pasar los pedidos al proveedor (CJ)

Pablo, el 01-10-2026: «déjalo todo preparado para que yo solo tenga que efectuar
los pagos desde el proveedor». Esta es la rutina que lo hace. Se ejecuta sola
cada hora. Pablo solo paga el enlace que aparece en la nota del pedido.

Todo en español y sin tecnicismos en lo que vea Pablo. Antes de nada, leer
`.claude/skills/oficio-tienda-online/SKILL.md` (sección 2: buscar cómo puede
salir mal) y no dar nada por hecho.

## Requisitos

- Conector de Shopify disponible en la sesión.
- Repositorio `lope200007/Shopify` clonado en `/home/user/shopify` (si no está:
  añadirlo con `add_repo` y clonarlo).
- Variable de entorno `CJ_MCP_TOKEN` (la pone Pablo en los ajustes del entorno).
  Si falta, no se hace nada y se avisa a Pablo con una línea: «falta la clave
  del proveedor en los ajustes del entorno». Nunca pedir la clave por chat ni
  imprimirla. `TELEFONO_TIENDA` es opcional (teléfono de respaldo si el cliente
  no deja el suyo).

## Pasos

### 1. Leer los pedidos pagados y sin enviar

```graphql
query Pendientes { orders(first: 20, query: "financial_status:paid fulfillment_status:unfulfilled status:open") { nodes { id name email tags note shippingAddress { name address1 address2 city province zip country countryCodeV2 phone } phone lineItems(first: 20) { nodes { id sku quantity } } fulfillmentOrders(first: 3) { nodes { id status } } } } }
```

Se ignoran los pedidos con la etiqueta `cj-no-servir`.

### 2. Pedidos sin la etiqueta `cj-creado`: crearlos en CJ

1. Escribir el pedido en un JSON del scratchpad (formato en la cabecera de
   `scripts/cj/servir-pedido.js`): `name`, `email`, `envio` (de
   `shippingAddress`; `telefono` = `shippingAddress.phone` o `phone`), `lineas`
   (`id`, `sku`, `quantity`).
2. `node scripts/cj/servir-pedido.js <json>` (simulación). Leer la línea
   `RESULTADO`.
3. Si es `simulado`: `node scripts/cj/servir-pedido.js <json> --ejecutar`.
   NUNCA se repite `--ejecutar` sobre el mismo pedido: si sale error, se lee el
   campo `seCreoIgualmente`.
4. Según el `estado`:
   - `creado` → etiqueta `cj-creado` y añadir al PRINCIPIO de la nota (sin
     borrar lo que hubiera):
     `PAGAR AL PROVEEDOR: <importeUsd> $ — <enlacePago> — pedido CJ <cjOrderId> — transporte <transporte> (<plazo> días)`.
     Si trae `alerta`, añadir también la etiqueta `cj-revisar` y la alerta en la
     nota, y avisar a Pablo de que NO pague hasta revisarlo.
   - `ya-existe` → etiqueta `cj-creado` (y anotar el pedido CJ si la nota no lo
     tiene). No crear nada.
   - `error` → etiqueta `cj-error` y el motivo en la nota. Si `seCreoIgualmente`
     es true, etiqueta `cj-creado` también y avisar a Pablo.

Mutaciones (comprobadas el 01-10-2026):

```graphql
mutation Etiqueta($id: ID!, $tags: [String!]!) { tagsAdd(id: $id, tags: $tags) { node { id } userErrors { field message } } }
mutation Nota($input: OrderInput!) { orderUpdate(input: $input) { order { id note } userErrors { field message } } }
```

Después de escribir, volver a leer el pedido y comprobar que la etiqueta y la
nota están guardadas.

### 3. Pedidos con `cj-creado` y sin enviar: pasar el seguimiento

1. Mirar el pedido en CJ: `cj.pedir('/shopping/order/getOrderDetail', { orderId })`
   (el `orderId` de CJ está en la nota). Si hace falta, buscarlo por número con
   `/shopping/order/list` (`orderNum` = nombre del pedido de Shopify).
2. Solo si el estado de CJ ya NO es `UNPAID`, `UNSHIPPED` ni `CREATED`/`IN_CART`
   (es decir, el paquete ha salido) y hay `trackNumber`: marcar enviado.
   Con `UNSHIPPED` no se marca aunque haya número: el paquete aún no ha salido
   y el cliente recibiría un «enviado» falso.

```graphql
mutation Enviar($f: FulfillmentInput!) { fulfillmentCreate(fulfillment: $f, message: "Enviado por el proveedor") { fulfillment { id status trackingInfo { number company url } } userErrors { field message } } }
```

Variables: `{ "f": { "lineItemsByFulfillmentOrder": [{ "fulfillmentOrderId": "<id OPEN>" }], "notifyCustomer": true, "trackingInfo": { "number": "<trackNumber>", "company": "<logisticName de CJ>", "url": "https://t.17track.net/es#nums=<trackNumber>" } } }`

3. Comprobar después que el pedido sale como enviado y que en `events` aparece
   el correo de envío al cliente. Etiqueta `cj-enviado`.
4. Si `UNPAID` lleva más de 24 h desde que se creó: recordar a Pablo que tiene
   un pedido sin pagar en el proveedor (con el enlace de la nota).

### 4. Avisar a Pablo

Solo si ha pasado algo: un enlace nuevo para pagar, un pedido enviado, un error
o un pedido sin pagar desde hace más de 24 h. Un mensaje corto en español con
el número de pedido, el importe y el enlace directo al pedido:
`https://admin.shopify.com/store/g5d031-ir/orders/<id numérico>`.
Si no ha pasado nada, terminar sin decir nada.

## Lo que NO hace esta rutina

- No paga nada: los pagos al proveedor los hace Pablo con el enlace.
- No reembolsa, no cancela y no borra.
- No toca precios ni productos.
