# Copias de seguridad de las fichas

`fichas-productos.json` guarda el título, la descripción completa en HTML y las
variantes de cada producto publicado, tal y como los sirve la tienda.

## Por qué existe esto

El 7 de septiembre de 2026, entre las 15:33 y las 16:06, **diez fichas
perdieron su descripción**: alguien o algo las sustituyó por un texto genérico
de tres párrafos. Se perdieron el aviso de plazo de entrega, los bloques de
venta cruzada hacia los packs y todo el detalle honesto (materiales, limpieza,
para qué perro no sirve).

Shopify no guarda un historial de la descripción de un producto, así que no
había forma de recuperarlas. Este archivo evita que vuelva a pasar.

## Cómo actualizarla

    curl -s "https://patitascalidas.com/products.json?limit=250" -o /tmp/prods.json

y volver a generar el JSON. Conviene hacerlo antes de instalar cualquier app
que pida permiso de escritura sobre productos.

## Aviso

La copia solo cubre lo que la tienda publica: no incluye productos en borrador
ni los textos de SEO (`seo.title` y `seo.description`), que van por la API de
administración.
