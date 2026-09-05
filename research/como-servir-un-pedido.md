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


## Como se paga cada pedido (obsoleto, ver abajo)

Por defecto el script **no usa el monedero de CJ**. Crea el pedido con
`payType: 1` y CJ devuelve un **enlace de pago** que el script imprime:

    >>> PAGA AQUI:  https://...

Se paga con tarjeta en ese enlace. En cuanto CJ cobra, la siguiente
ejecucion recoge el numero de seguimiento y marca el pedido servido en
Shopify, que avisa al cliente.

**Por que asi y no con saldo.** El monedero de CJ tiene minimos de recarga
altos (el tramo de transferencia empieza en 5.000 USD) y el dinero que
entra ahi cuesta sacarlo. Con pocos pedidos al dia, pagar uno a uno cuesta
un minuto y no inmoviliza nada.

**Cuando pasar a saldo.** Cuando ese minuto por pedido moleste: recargar el
monedero y ejecutar `npm run servir -- --ejecutar --saldo`, o cambiar
`MODO_POR_DEFECTO` en el script.

**Volver a ejecutarlo es seguro.** Si el pedido ya existe en CJ no se crea
otra vez: el libro `.cj-pedidos.json` lo impide. Si esta pendiente de pago,
vuelve a imprimir el enlace.

**Si CJ no devuelve enlace.** No esta documentado con que nombre lo manda,
asi que el script prueba varias claves y despues rastrea cualquier URL de
la respuesta. Si aun asi no encuentra ninguna, imprime la respuesta entera
de CJ y el id del pedido para poder pagarlo a mano desde el panel. No se
inventa una URL.


## Pago automatico (2026-09-05, definitivo)

El modo por defecto es **`auto`** y funciona asi, pedido a pedido:

1. Mira el saldo del monedero de CJ
2. Estima lo que cuesta el pedido: mercancia + porte real, mas un 25% de
   colchon porque CJ puede ajustar el importe al cobrar
3. **Si el saldo llega** -> crea el pedido con `payType 2` y lo paga solo.
   Nadie toca nada.
4. **Si no llega** -> crea el pedido con `payType 1` e imprime el enlace de
   pago para pagarlo con tarjeta

La decision se toma **antes** de crear el pedido a proposito: `payType` se
fija al crearlo y ya no se puede cambiar.

Cuando un articulo no tiene precio conocido (los declarados a mano en
`mapa.js`), se supone que cuesta 25 USD. Es deliberadamente alto: preferimos
mandar de mas a enlace de pago que quedarnos sin saldo a mitad de un cobro y
dejar el pedido creado y sin pagar.

### Por que el enlace no se puede pagar solo

Es una pasarela que pide tarjeta, y la PSD2 obliga a autenticacion reforzada
en cada pago: el banco pediria confirmacion en el movil igualmente.
Automatizarlo exigiria guardar la tarjeta y teclearla con un robot, seria
fragil y probablemente iria contra los terminos de CJ.

**El saldo prepagado es el unico camino a un cobro sin intervencion.** Por
eso el modo `auto` existe: mientras haya saldo va solo, y cuando se acaba
degrada a enlace en vez de atascarse.

### Para que sea automatico de verdad hace falta ejecutarlo solo

El script es idempotente (el libro `.cj-pedidos.json` impide crear dos veces
el mismo pedido), asi que se puede lanzar cada pocos minutos sin riesgo:

    */15 * * * * cd /ruta/a/shopify && npm run servir -- --ejecutar >> servir.log 2>&1

Hace falta una maquina encendida. Si no la hay, ejecutarlo a mano una o dos
veces al dia tambien vale mientras el volumen sea bajo.

### Cuanto recargar

Avisa cuando el saldo baja de 60 USD. Con un coste medio de ~15 USD por
pedido, recargar 165-220 USD cubre los primeros 12-14 pedidos.

**Importante:** el tramo de 5.000 USD que aparece al recargar es el de
transferencia bancaria. Con tarjeta o PayPal los minimos son mucho menores.
