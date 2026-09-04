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
