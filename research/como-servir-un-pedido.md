# Cómo se sirve un pedido (4 sept 2026)

Estado comprobado hoy: **no hay nada automático**. En Shopify solo existe la
ubicación "Sucursal de la tienda"; no hay ningún servicio de fulfillment de CJ
registrado. Si entra un pedido, se queda en "sin preparar" hasta que alguien lo
pase a CJ a mano.

Y hay un bloqueo antes que ese: **el monedero de CJ está a 0,00 €**
(`/shopping/pay/getBalance` devuelve `amount: 0`). Sin saldo no se puede pagar
ningún envío. Eso hay que resolverlo antes del primer pedido, no durante.

La cuenta de CJ está a nombre de **Pablo Andrés Sánchez** (`CJ5791891`).

## El paso que no se puede improvisar

CJ **no acepta el SKU**: solo acepta su `vid` interno. Un pedido no se puede
servir sin traducir cada línea. Para eso está `scripts/cj/mapa.js`:

```bash
# escribe los SKU del pedido, uno por línea, y pásale el fichero
node scripts/cj/mapa.js pedido.txt
```

Devuelve el `vid` de cada SKU y falla con código 1 si alguno no está mapeado.
Hoy los **84 SKU activos resuelven**, comprobado.

Los productos antiguos usan el propio `variantSku` de CJ y se resuelven solos.
Los que subí después llevan SKU propio y están declarados a mano en el fichero.
**Cada producto nuevo hay que añadirlo ahí**, o su pedido no se podrá servir.

## El pack lleva tres artículos

`PACK-BANO-LLUVIA` no es un artículo: son tres, y van en un solo envío.

| Componente | SKU de CJ |
|---|---|
| Albornoz talla M | `CJPT224333910JQ` |
| Toalla mediana | `CJYD280148202BY` |
| Manopla | `CJGY137221901AZ` |

La ficha promete esas tallas exactas. Si alguien sirve el albornoz XS porque es
más barato, el cliente recibe algo distinto de lo que compró.

## Procedimiento

1. Abrir el pedido en Shopify y anotar los SKU y las cantidades
2. Resolver los `vid` con `mapa.js`
3. Crear el pedido en CJ con la dirección **tal cual la puso el cliente**
4. Elegir el transporte. Para España, CJPacket Ordinary o YunExpress Ordinary
   según peso; el coste real está en `freightCalculate` y es el que se usó para
   calcular los márgenes
5. Pagar desde el saldo de CJ
6. Cuando CJ dé el número de seguimiento, marcar el pedido como preparado en
   Shopify **con ese número**. El cliente recibe el correo automáticamente

## Comprobar antes de aceptar cualquier producto nuevo

`freightCalculate` tiene que devolver **al menos una ruta CN → ES**. Si devuelve
cero opciones, el stock está fuera de China y no se puede servir a España. Así
se detectaron el comedero rotativo (almacén de Reino Unido) y la bola
dispensadora (almacén de Estados Unidos), que llevaban semanas publicados sin
poder entregarse.

## Automatizar esto

La API de CJ permite crear los pedidos sola (`shopping/order/createOrderV2`), y
con el mapa ya hecho es viable. **No lo he montado a propósito**: sería un
proceso que mueve dinero real sin supervisión, y el token de CJ pasó por el chat
y debe rotarse antes de usarlo para pagar nada.

Orden correcto: rotar el token → recargar saldo → servir dos o tres pedidos a
mano para ver dónde falla → entonces automatizar.

---

# Automatizado (4 sept 2026)

Ya no hace falta hacerlo a mano. `npm run servir` recorre los pedidos pagados y
sin servir, los crea en CJ, los paga con el saldo y devuelve el seguimiento a
Shopify.

```bash
npm run servir                        # simulacion: enseña el payload exacto, no toca nada
npm run servir -- --sandbox --ejecutar  # pedido de prueba real en CJ, sin cobro
npm run servir -- --ejecutar            # de verdad: crea, paga y marca servido
```

Para un cron cada quince minutos:

```
*/15 * * * * cd /ruta/shopify && npm run servir -- --ejecutar >> servir.log 2>&1
```

## Lo que resuelve solo

- **Traduce el SKU al vid de CJ.** Si un SKU no esta en `mapa.js`, aborta el
  pedido entero en vez de servirlo a medias.
- **Expande los packs.** `PACK-BANO-LLUVIA` se convierte en los tres articulos
  reales (albornoz M, toalla mediana, manopla), que es lo que promete la ficha.
- **Elige el transporte mas barato** con `freightCalculate` en vivo, para el pais
  del cliente. Si CJ no tiene ruta a ese pais, lo dice y no crea nada.
- **Valida antes de enviar** los nueve campos que CJ exige. CJ rechaza con
  "Param error" sin decir cual falta; el script falla antes y con nombre.
- **No duplica.** `.cj-pedidos.json` registra que pedido ya se mando y con que id
  de CJ. Se guarda **antes** de pagar, no despues: si el proceso muere entre
  crear y pagar, al reintentar se paga el pedido existente en vez de crear otro.
  Sin eso, dos ejecuciones seguidas cobrarian dos veces.
- **Avisa al cliente.** Al marcar servido con `notifyCustomer`, Shopify manda el
  correo con el seguimiento.

## Decisiones que conviene conocer

**IOSS = 3 (el de CJ).** Es quien paga el IVA de importacion en la UE. Con el de
CJ, al cliente no le reclaman nada en la entrega. Cuando la tienda tenga su
propio numero IOSS, cambiar `IOSS_TIPO` a 2 y rellenar `IOSS_NUMERO` en
`scripts/cj/servir.ts`.

**payType = 2**, cobro contra el saldo del monedero. Con saldo 0 la creacion
funciona y el pago falla; el pedido queda creado en CJ y se paga al reintentar.
El script lo dice en vez de fallar en silencio.

## Lo que falta para poder ejecutarlo

1. **Credenciales de Shopify** en `.env` (`SHOPIFY_SHOP` + `SHOPIFY_CLIENT_ID` y
   `SHOPIFY_CLIENT_SECRET`, con permisos `read_orders` y `write_fulfillments`)
2. **Saldo en el monedero de CJ**
3. Probado hasta donde se puede sin esas dos cosas: mapeo, expansion del pack,
   portes reales y validacion del payload. **La creacion del pedido en CJ no se
   ha llegado a ejecutar**, ni siquiera en sandbox: hacerlo requiere aprobacion
   para escribir en un servicio externo. La primera vez, lanzarlo con
   `--sandbox --ejecutar` y revisar el resultado antes de quitar `--sandbox`.
