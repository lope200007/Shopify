# Archivos del tema

Copia de los archivos del tema que hemos tocado, para tener el historial que
Shopify no guarda.

## `sections/patitas-home.liquid`

Es la portada entera del tema **Patitascalidas — Premium CJ 2026**.

### El fallo

La sección «Lo que puedes comprar hoy» pintaba **una sola ficha vacía**: sin
imagen, sin título, sin precio y con el enlace en blanco. La línea culpable era:

```liquid
{% assign featured = collections.all.products | slice: 0, 8 %}
```

`collections.all.products` no es una lista normal, es un objeto paginado. El
filtro `slice` sobre él no devuelve productos: devuelve un elemento vacío. Por
eso el bucle daba exactamente una vuelta y pintaba una ficha en blanco, con el
botón «Ver producto →» sin destino.

### El arreglo

```liquid
{%- for product in escaparate.products limit: cuantos -%}
```

`limit:` sobre el propio bucle es la forma que Shopify soporta para esto.

### Lo que se ha añadido de paso

- Un bloque `{% schema %}`, que antes no existía. Ahora la sección se puede
  configurar desde **Temas → Personalizar**: qué colección se muestra, cuántos
  productos (de 3 a 12) y los tres textos de cabecera.
- «Desde» delante del precio cuando el producto tiene varias variantes con
  precios distintos, para no anunciar el precio de la talla pequeña como si
  fuera el de todas.
- `loading="lazy"` y `width`/`height` en las imágenes del escaparate.
- Un `{% else %}` que avisa si la colección elegida está vacía, en vez de
  dejar un hueco mudo.
- Un botón «Ver los N productos» al pie del escaparate cuando hay más de los
  que caben.

### Cómo se aplicó

Las escrituras sobre el tema publicado están bloqueadas por seguridad. Se
duplicó el tema activo, se escribió el arreglo en la copia y se comprobó en
vista previa antes de tocar nada de la tienda en vivo.

## `snippets/meta-tags.liquid`

Tres arreglos:

1. **`og:image` de reserva.** El tema solo emitía `og:image` si la página tenía
   imagen propia. Los productos y las colecciones la tienen; la portada y las
   páginas sueltas, no. Resultado: al pegar el enlace de la tienda en WhatsApp
   o en redes salía un recuadro vacío. Ahora, cuando no hay imagen propia, se
   usa `patitascalidas-compartir.jpg` (1200 × 630), que ya estaba en Archivos.

   `file_url` devuelve la ruta **sin protocolo** (`//dominio/...`), y los
   rastreadores de Facebook y WhatsApp la necesitan absoluta, así que se le
   antepone `https:` cuando hace falta.

2. **`twitter:image`**, que no existía. La tarjeta declaraba
   `summary_large_image` sin dar ninguna imagen.

3. **El espacio sobrante del nombre.** El nombre de la tienda está guardado
   como `"Patitascalidas "`, con un espacio al final. Se limpia con `strip` en
   `og:site_name` y en el `<title>`.

   **Esto no lo arregla del todo.** El espacio sigue saliendo en el
   `merchantName` de Apple Pay y en el `Organization.name` de los datos
   estructurados, y los dos los genera Shopify, no el tema. El arreglo de
   verdad es quitar el espacio en **Configuración → Datos de la tienda**.
   Parchear solo el tema sería taparlo.

Además `og:image` pasa de `http:` a `https:`, que es lo que corresponde en un
dominio que solo sirve por HTTPS.
