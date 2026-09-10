# El canal de TikTok, y los 16 productos que se habian quedado fuera

10 de septiembre de 2026.

## Lo primero: un producto no vive dentro de un tema

Pablo pregunto si los productos se estaban subiendo al tema publicado o a uno
nuevo. **Un producto no pertenece a ningun tema.** El tema es solo el diseno;
los productos estan en el catalogo de la tienda y se muestran en el tema que
este publicado, sea cual sea.

Comprobado en vivo: `/products/cama-donut-perro` la renderiza
`{"name":"Patitascalidas 2026 — plazo de entrega real","id":204140708188,"role":"main"}`,
que es el tema **publicado**. El de «portada con movimiento»
(`204184420700`) es un borrador sin publicar y no contiene ni un producto.

## Lo segundo: TikTok es una publicacion, no una app aparte

La app de TikTok instalada en Shopify crea una **publicacion**:

```
gid://shopify/Publication/369532469596   "TikTok"
```

Un producto solo llega al catalogo de TikTok si esta publicado en ese canal. Y
`productCreate` **no lo publica en ningun canal**: hay que llamar a
`publishablePublish` con cada publicationId.

Las fichas viejas si estaban en TikTok, porque la app las publico en bloque
cuando se instalo. **Las 16 creadas despues, no.** Se habian subido solo a
Tienda online y a Shop:

| | Producto |
|---|---|
| 1 | alfombra-olfativa-perro |
| 2 | collar-isabelino-espuma-perro |
| 3 | collar-inflable-perro |
| 4 | pack-coche-barrera-cubremaletero-cinturon |
| 5 | arnes-acolchado-reflectante-perro |
| 6 | mordedor-dental-perro |
| 7 | cepillo-spray-agua-perro |
| 8 | portabolsas-paseo-perro |
| 9 | anilla-flotante-perro |
| 10 | frisbee-blando-perro |
| 11 | comedero-plegable-viaje |
| 12 | alfombrilla-bajo-comedero |
| 13 | bozal-silicona-cesta-perro |
| 14 | cepillo-carda-redondo-perro |
| 15 | cama-donut-perro |
| 16 | bufanda-gorro-navidad-perro |

Ya estan los 61 productos activos en los tres canales. Verificado leyendo
`resourcePublicationsV2` de los 61, uno a uno.

## La regla, para no repetirlo

**Cada `productCreate` va seguido de un `publishablePublish` con LOS TRES
canales**, no con dos:

```
365626753372  Tienda online
365626786140  Shop
369532469596  TikTok
```

Queda anadido a la skill `producto-ganador`.

## Lo que TikTok hace y lo que no

Publicar en el canal manda el **catalogo** a TikTok: es lo que permite etiquetar
productos en los videos y que aparezcan en la pestana de tienda del perfil.

**No sube videos.** Los 18 verticales de `assets/video/` hay que publicarlos
desde la cuenta de TikTok. La API de publicacion de videos de TikTok necesita su
propia autorizacion, que esta tienda no tiene conectada aqui.
