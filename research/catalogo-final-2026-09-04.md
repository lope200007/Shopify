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

---

# Ampliacion: cuatro productos mas (misma sesion)

Barridas 14 categorias mas del catalogo de CJ y ordenado todo por numero de
tiendas que ya venden cada articulo. Descartados los de gato (la tienda es
de perro) y los que superaban 15 USD de coste o 600 g.

| Producto | PVP | Coste | Peso | Tiendas que lo venden | Mercado ES |
|---|---|---|---|---|---|
| **Lima de unas electrica** | 19,90 | 2,05 | 120 g | **760** | 17,90 - 49,95 |
| Boton grabable | 12,90 | 1,48 | 98 g | 150 | 10 - 20 |
| Peluche con chirriador | 14,90 | 3,99 | 145 g | 106 | 8 - 15 |
| Funda de collar para AirTag | 9,90 | 0,92 | 10 g | 105 | 8 - 15 |

## La lima de unas es el mejor producto de la tienda

760 tiendas del catalogo de CJ la venden ya. Es el numero mas alto que he
visto en toda la categoria de mascotas, por delante de la manopla (365) y
de la bola (202).

Y las cuentas lo acompanan: **cuesta 2,05 EUR, pesa 120 g** (porte a Espana
unos 4 EUR) y en Espana se vende entre 17,90 y 49,95. A 19,90 el margen de
contribucion ronda el 72%, el mejor de todo el catalogo.

Resuelve ademas un miedo real: cortar las unas a un perro y darle en la
vena. Una lima desgasta en vez de cortar, asi que es imposible pasarse de
golpe. Es el producto con mejor combinacion de demanda, margen y problema
concreto de toda la seleccion.

## Un aviso honesto en cada ficha

Las cuatro llevan su pega escrita:

- La lima: **las pilas no vienen** (2 AA), y en unas negras no se ve la vena.
- El boton: **requiere constancia tuya** durante semanas o el perro no lo
  asocia; no es un juguete que funcione solo. Pilas no incluidas.
- El peluche: **es un peluche**. Un destructor de verdad lo abre igual, con
  costura reforzada o sin ella. Si es tu caso, comprale la bola.
- La funda de AirTag: **el AirTag no viene incluido**, y un AirTag no es un
  GPS — en el monte, sin iPhones alrededor, puede no dar senal.

Eso es lo que evita devoluciones y resenas malas: decir la pega antes de
cobrar, no despues.

## Catalogo al cierre: 15 productos

Comederos 3, Juguetes 5, Higiene y cuidado 6, Casa/coche/paseo 3, Packs 1.
La coleccion "Casa y coche" pasa a llamarse **"Casa, coche y paseo"** para
que la funda de AirTag no quedara huerfana.

Los 15 tienen foto de proveedor, SKU real de CJ y coste real cargado.
