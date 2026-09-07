# Tema de Patitascalidas

Aquí está el código de lo que es **nuestro** dentro del tema: la portada, sus
estilos y las etiquetas meta. Todo lo demás —carrito, filtros, selector de
variantes, buscador— es de Horizon y no se toca: funciona.

## Por qué no se reescribió el tema entero

Reconstruir un tema de Shopify desde cero significa rehacer el carrito, el
selector de variantes, los filtros de colección y la búsqueda predictiva. Eso
sería un retroceso, no una mejora. Lo que estaba mal era nuestra portada, y eso
es lo que se ha reconstruido.

## Los archivos

| Archivo | Qué es |
| --- | --- |
| `sections/patitas-home.liquid` | La portada entera, con su esquema configurable |
| `assets/patitas-cj.css` | Sus estilos |
| `templates/index.json` | Qué bloques y textos lleva la portada |
| `snippets/meta-tags.liquid` | Etiquetas meta, Open Graph y tarjetas sociales |

## Los cinco errores que se arreglaron, y por qué pasaban

### 1. `slice` sobre una colección pinta una ficha vacía

```liquid
{% assign featured = collections.all.products | slice: 0, 8 %}
```

`collections.all.products` no es una lista: es un objeto paginado. Al aplicarle
`slice`, Liquid lo convierte a texto y se queda con los ocho primeros
caracteres. El bucle daba entonces **una vuelta con una cadena**, no con un
producto, y pintaba una ficha sin imagen, sin título, sin precio y con el enlace
en blanco.

Se recorta siempre con `limit:` en el propio `for`.

### 2. Los nombres de clase chocaban con el tema

Horizon define **19 reglas para `.hero`, 279 para `.product`, 15 para `.price`
y 7 para `.btn`**. Entre ellas:

```css
.hero{position:relative;min-height:calc(var(--hero-min-height) - var(--hero-height-offset))}
```

El CSS anterior usaba esos mismos nombres, así que el tema se colaba dentro de
nuestra portada. Ahora **todas** las clases llevan prefijo `pcj-`.

### 3. `aspect-ratio` peleado con `stretch`

La foto de la cabecera es un elemento de rejilla estirado. Al darle además
`aspect-ratio`, el navegador resolvía la altura de la fila con la proporción de
la foto (538,86 px = 663,20 × 13/16) en vez de con el contenido del texto
(634 px). La columna de texto se salía, `overflow:hidden` la recortaba y la
barra de confianza tapaba el segundo botón.

En escritorio la foto usa `min-height` y estira. En una sola columna, donde no
hay conflicto, se mantiene la proporción.

### 4. Sin imagen al compartir el enlace

El tema solo emitía `og:image` si la página tenía imagen propia. Los productos y
las colecciones la tienen; la portada y las páginas sueltas, no. Ahora hay una
imagen de reserva, y con protocolo absoluto, que es lo que piden los
rastreadores de WhatsApp y Facebook.

### 5. Contrastes que no llegaban

El naranja de los botones daba **4,24:1** con texto blanco, por debajo del 4,5
que exige la norma. Se oscureció hasta 5,49:1. El verde de marca subió a
9,40:1 sobre crema. El anillo de foco es de doble aro para que se vea igual
sobre fondo crema que sobre el verde.

## Cómo actualizar un archivo en un tema

Se puede escribir por URL, que evita transcribir a mano:

```graphql
themeFilesUpsert(themeId: ..., files: [{
  filename: "assets/patitas-cj.css",
  body: { type: URL, value: "https://raw.githubusercontent.com/.../patitas-cj.css" }
}])
```

**Aviso:** Shopify cachea por URL. Si vuelves a subir el mismo archivo con la
misma URL, se queda con la versión vieja **sin dar ningún error**. Hay que usar
la URL del commit concreto (con su SHA), que es única. Y comprobar siempre el
`checksumMd5` después.

`templates/*.json` no se acepta por URL: ese va como `TEXT`.

## Lo que se comprobó antes de entregarlo

- 15 páginas del tema en vista previa: portada, colecciones, fichas, páginas,
  políticas, carrito, buscador y 404. **Cero errores de Liquid.**
- Maquetación medida en tres anchuras (1440, 820 y 390 px): sin recortes, sin
  solapes y **sin desbordamiento horizontal**.
- Accesibilidad de la portada: 19 imágenes, **ninguna sin texto alternativo**;
  21 enlaces, **ninguno sin destino ni sin nombre**; cero identificadores
  repetidos; jerarquía de encabezados correcta; 18 de 19 imágenes con carga
  diferida y `srcset`.
- Paleta verificada contra WCAG 2.2 AA, par por par.

## Lo que sigue en tu tejado

- **El espacio del nombre de la tienda.** Está guardado como `"Patitascalidas "`.
  El tema lo limpia con `strip`, pero Apple Pay y los datos estructurados lo
  cogen de Configuración, no del tema.
- **El formato de moneda.** Sale `€16,90`; en España se escribe `16,90 €`.
  Es un ajuste de tienda, no de tema.
