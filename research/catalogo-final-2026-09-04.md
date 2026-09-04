# Catalogo completo con proveedor real — 4 septiembre 2026

**Los 11 productos de la tienda salen ya de CJ**, con foto del proveedor,
SKU real y coste real. No queda ninguna foto de origen dudoso ni ningun
producto sin proveedor detras.

## Los cinco primeros, corregidos

Tenian fotos que yo habia sacado de listados de AliExpress y precios sin
proveedor detras. Buscado el equivalente real en CJ:

| Producto | Antes | Ahora | Coste real | Tiendas que ya lo venden |
|---|---|---|---|---|
| Comedero | "lento interactivo", espiral, 29,90 | **Comedero rotativo antivoracidad**, 3 colores, 29,90 | 12,79 | 27 |
| Alfombrilla | "antiderrame para comedero", 16,90 | **Alfombrilla de lamer con ventosas**, 4 colores, 12,90 | 2,87 | 22 |
| Bola | "dispensadora de premios", 24,90 | misma, 2 colores, 24,90 | 12,51 | **202** |
| Manopla | "de secado microfibra", 22,90 | **Manopla de bano y secado**, 14,90 | 3,38 | **365** |
| Pack | "2 comederos + alfombrilla", 49,90 | **Pack bano y lluvia**, 39,90 | 11,30 | — |

### Por que cada cambio

**El comedero era el problema mas gordo de la tienda.** Un comedero de
espiral es una commodity: Tiendanimal lo vende a 7,95 y nosotros pediamos
29,90. En vez de bajar el precio (que ya calcule que daba -9,86 EUR por
cliente), lo he cambiado por un **comedero rotativo tipo puzle**, que es
otra categoria de producto. Ese no esta en Tiendanimal a 7,95, y los 29,90
se sostienen.

**La alfombrilla antiderrame no existe en CJ a un precio razonable** (las
que hay cuestan 27-36 USD de coste). En su lugar va una **alfombrilla de
lamer**, que es un producto real, con demanda y a 2,87 de coste. La ficha
esta reescrita entera: ya no habla de recoger salpicaduras sino de lamer
para calmar, que es lo que de verdad hace.

**La manopla estaba a 22,90 y el mercado esta en 10-15.** Bajada a 14,90.
Y el equivalente que encontre en CJ tiene **365 tiendas vendiendolo**: el
numero mas alto de toda la categoria de mascotas en su catalogo.

**La bola tiene 202 tiendas** y la de CJ es exactamente la de apertura
regulable que describia la ficha. Se mantiene a 24,90 porque el coste real
es alto (12,51) y el mercado espanol de bolas dispensadoras de marca esta
en 15-25.

**El pack ya no tenia sentido**: sus dos componentes cambiaron y anunciaba
un ahorro de 26,80 calculado sobre un precio de referencia inflado.
Reconstruido como **Pack bano y lluvia** (albornoz + toalla + manopla) a
39,90 frente a 49,70 sueltos. Los precios de referencia ahora son los
reales de cada ficha, comprobables haciendo clic.

## El catalogo entero

| Producto | PVP | Coste | Coleccion |
|---|---|---|---|
| Toalla de secado rapido | 9,90 - 16,90 | 1,53 - 3,99 | Higiene |
| Alfombrilla de lamer | 12,90 | 2,87 | Comederos |
| Manopla de bano y secado | 14,90 | 3,38 | Higiene |
| Cepillo autolimpiable | 14,90 - 17,90 | 3,05 - 3,21 | Higiene |
| Albornoz de secado | 16,90 - 25,90 | 3,28 - 6,72 | Higiene |
| Comedero + alfombrilla 2 en 1 | 19,90 | 5,31 | Comederos / Juguetes |
| Manta impermeable | 19,90 - 36,90 | 3,23 - 10,68 | Casa y coche |
| Bola dispensadora | 24,90 | 12,51 | Juguetes |
| Comedero rotativo | 29,90 | 12,79 | Comederos |
| Funda de asiento de coche | 29,90 | 7,34 | Casa y coche |
| **Pack bano y lluvia** | **39,90** | 11,30 | Packs |

Colecciones: Comederos 4, Higiene 4, Juguetes 3, Casa y coche 2, Packs 1.

## Lo que queda por hacer

**Cursar los pedidos.** Cada variante lleva su SKU de CJ, asi que cuando
entre un pedido se sabe exactamente que pedir. Falta decidir si se hace a
mano en la app de CJ o se automatiza con la API, que ya esta conectada
(`shopping/orderList`).

**Revocar el token de CJ** cuando se termine: ha pasado por el chat.
