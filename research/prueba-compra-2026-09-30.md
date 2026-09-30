# Compra de prueba de punta a punta (30-09-2026)

Pablo: «es una prueba que lo vamos a hacer nosotros y queremos comprar barato,
solo tener un euro de ganancia nada más, pero ver que todo sale bien».

## Qué se prueba

1. Que la tienda cobra bien (y que el dinero llega a la cuenta de la tienda).
2. Que el pedido pasa al proveedor y Pablo lo paga él mismo con su tarjeta,
   pedido a pedido, sin recargar el monedero de CJ.
3. Que el producto llega y el seguimiento vuelve a Shopify.
4. Que la ganancia final es la calculada: **1 €**.

## Intento 1: pedido #1002 (rodillo quitapelos) — anulado

- Código `PRUEBA-YW57LV` (ya gastado). Cobrado 8,21 € con Shop Pay; comisión
  real 0,43 €.
- Quedó «Autorizado» sin cobrar: el método de captura no era automático.
  Pablo lo cambió a «Automáticamente en la pantalla de pago» el 30-09.
- En CJ (pedido SD2609301401060667700, sin pagar) salió **10,19 $** en vez de lo
  calculado: se había elegido el transporte por el precio base
  (`logisticPrice`) y no por lo que se cobra (`totalPostageFee`). Arreglado en
  `scripts/cj/cj.js` y `servir.ts` (commit 1600d2c).
- Desglose real del pedido CJ, cuadra al céntimo:
  producto 1,39 + envío total 8,50 + 21 % IVA del producto 0,29 + 0,01 = 10,19 $.
- Pendiente de Pablo: cancelar SD2609301401060667700 en el panel de CJ (la API
  no borra pedidos UNPAID) y cancelar/reembolsar el #1002 en Shopify.

## Intento 2: rascador de pared «tabla de surf», diseño damero

- Código `PRUEBA-2RCLKQ`: 16,92 € de descuento, solo `PTC-RASCPARE-02`, un
  solo uso, caduca el 02-10-2026 a medianoche.
- Enlace: `https://patitascalidas.com/discount/PRUEBA-2RCLKQ?redirect=/products/rascador-pared-gato?variant=59072022315356`

| | |
|---|---|
| Rascador (19,90 − 16,92) | 2,98 € |
| Envío | 6,99 € |
| **Total en la tienda** | **9,97 €** |
| Comisión Shopify (1,6 % + 0,30, ajustada a los dos cobros reales) | −0,46 € |
| IVA | −1,73 € |
| CJ: 2,70 + 4,09 (CJPacket Eub, total) + 0,57 IVA + 0,01 = 7,37 $ × 0,92 | −6,78 € |
| **Ganancia** | **1,00 €** (≈ 1,29 € al cambio BCE de hoy, 0,88067) |

- Riesgo abierto: CJ da 75 g para este diseño y 150 g para el otro, siendo la
  misma tabla. Si recalcula el peso, el precio cambia. Por eso, al crear el
  pedido en CJ se comprueba que pide **7,37 $** antes de pasarle el enlace a
  Pablo.

## Estado (30-09-2026, 17:58)

- Precio de prueba bajado a **0,50 €** de ganancia a petición de Pablo:
  descuento 17,53 €, rascador a 2,37 €, total 9,36 €.
- Tienda **#1003**: 9,36 € cobrado al momento (`SALE`, ya no «Autorizado»).
- CJ **SD2609301457370648900**: pidió **7,38 $** (2,70 + 4,09 CJPacket Eub +
  0,57 IVA + 0,02 de tasa). Lo calculado era 7,37 $: 1 centavo de diferencia
  por la tasa de gestión. Pablo lo pagó a las 15:55 (hora de CJ). Estado
  `UNSHIPPED`, aún sin seguimiento.
- Intento 1 cerrado: #1002 cancelado en Shopify con devolución de 6,99 + 1,22 €
  (pendiente de que la procese el banco); pedido CJ del #1002 borrado (TRASH).
- 30-09, 18:20: CJ ya ha asignado seguimiento **LZ476709507CN** (CJPacket Eub),
  pero el pedido sigue `UNSHIPPED` (aún no ha salido). Se marca como enviado en
  Shopify cuando CJ lo pase a enviado, para no mandar al cliente un «enviado»
  de un paquete que no ha salido.
- Queda: seguimiento de CJ → marcar enviado en Shopify; comisión real de
  Shopify del #1003; ingreso en la cuenta de la tienda. Revisión programada
  para el 01-10.

## Cuando entre el pedido

1. Comprobar en Shopify: total 9,97 €, estado «Pagado» (no «Autorizado»).
2. Crear el pedido en CJ con pago por enlace y CJPacket Eub.
3. Leer `orderAmount` de la respuesta: tiene que ser 7,37 $. Si no, parar y
   avisar antes de que Pablo pague.
4. Pasarle el enlace de pago.
5. Con el seguimiento de CJ, marcar el pedido como enviado en Shopify.
6. Comprobar el ingreso de Shopify en la cuenta de la tienda (9,97 − comisión).
