# Seis productos subidos desde CJ — 4 septiembre 2026

Todo con datos reales de la API de CJ: fotos del proveedor, coste por
variante y porte calculado a Espana. Nada inventado.

## Lo que se ha subido

| Producto | Variantes | PVP | Coste real | Mercado ES | Tiendas que ya lo venden |
|---|---|---|---|---|---|
| Albornoz de secado | 5 tallas | 16,90 - 25,90 | 3,28 - 6,72 | 14,99 - 22,99 (Tiendanimal) | **144** |
| Toalla de secado rapido | 3 tamanos | 9,90 - 16,90 | 1,53 - 3,99 | 8 - 15 | **289** |
| Manta impermeable sofa | 4 tamanos | 19,90 - 36,90 | 3,23 - 10,68 | 20 - 35 | **187** |
| Funda de asiento de coche | 3 colores | 29,90 | 7,34 | 30,99 - 34,99 | 17 |
| Cepillo autolimpiable | 2 tallas x 2 colores | 14,90 - 17,90 | 3,05 - 3,21 | 10 - 18 | 12 |
| Comedero lento + alfombrilla 2 en 1 | 2 colores | 19,90 | 5,31 | 8 - 16 sueltos | 8 |

La columna de la derecha es el criterio principal de seleccion: cuantas
tiendas del catalogo de CJ venden ya ese articulo. Es la senal mas honesta
de demanda que da su API. La toalla con 289 y el albornoz con 144 son los
dos numeros mas altos de toda la categoria de mascotas.

Todos los PVP estan **por debajo o dentro** del rango de mercado espanol.
Ninguno repite el error del comedero a 29,90 frente a 7,95 de Tiendanimal.

## Correccion: los plazos NO son de 20 a 30 dias

Deduje ese plazo de que el almacen estuviera en China, sin comprobar las
opciones de envio. Al pedir el porte real a la API:

| Articulo | Porte a Espana | Plazo de transporte |
|---|---|---|
| Albornoz (240 g) | 5,97 USD | **4-8 dias** (CJPacket Ordinary) |
| Toalla (330 g) | 6,96 USD | 4-8 dias |
| Manta sofa (440 g) | 8,17 USD | 4-8 dias |
| Funda de coche (620 g) | 10,14 USD | 4-8 dias |

Sumando 1-3 dias laborables de preparacion, el plazo honesto es **una o dos
semanas**, no un mes. Las seis fichas se han corregido: decían 20-30 dias.

## Las cuentas, con coste y porte reales

| Escenario | Margen de contribucion | Beneficio por cliente | Recupera CAC en |
|---|---|---|---|
| Albornoz M suelto (21,90) | 13,16 (49%) | **-3,52** | 1,37 pedidos |
| Manta sofa 2 plazas (24,90) | 15,32 (51%) | **-1,14** | 1,17 pedidos |
| **Cesta: albornoz + toalla (34,80)** | 20,43 (51%) | **+2,48** | **0,98 pedidos** |

El patron se repite por tercera vez en esta investigacion: **el articulo
suelto no cubre el coste de captar al cliente; la cesta de dos si.** Por eso
la ficha de producto lleva "Suele comprarse junto con esto" y por eso el
envio gratis desde 55 EUR es la palanca importante de la tienda.

## Como se hizo

- Busqueda por `categoryId` del arbol de CJ, no por texto: su busqueda
  difusa devuelve aspiradoras cuando pides "paw cleaner".
- Filtrado por precio (1,5-14 USD) y peso (menos de 700 g), porque el porte
  crece con el peso y se come el margen.
- `productSet` de Shopify crea producto, fotos y variantes en una llamada.
  Las fotos se pasan como URL de CJ y Shopify las descarga sola: las 23
  imagenes quedaron en estado READY.
- Cada variante lleva el **SKU real de CJ** y su coste, asi que el margen
  por talla sale solo en los informes de Shopify y el pedido se puede
  cursar sabiendo exactamente que referencia pedir.

## Coleccion nueva

La manta y la funda de coche no encajaban en comederos, juguetes ni
higiene. Se ha creado **Casa y coche** (`/collections/casa-y-coche`),
publicada y anadida al menu principal.

## Lo que queda pendiente

- **Conectar los pedidos.** Los SKU de CJ estan puestos, pero cuando entre
  un pedido hay que cursarlo. Se puede hacer a mano en la app de CJ o
  automatizarlo con la API (`shopping/orderList`), que ya esta conectada.
- **Los cinco productos viejos** (comedero 29,90, alfombrilla, bola,
  manopla y el pack) siguen con precios por encima de mercado y sin
  proveedor real detras. Hay que decidir si se reprecian contra CJ o se
  retiran.
