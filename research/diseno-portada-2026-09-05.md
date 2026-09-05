# Mejora de la portada según `designing-converting-landings` (5 sept 2026)

## La skill que aplica

De todas las de diseño disponibles, la que encaja es **`designing-converting-landings`**
(en `.claude/skills/`): está escrita para páginas de tráfico pagado en
dropshipping, que es exactamente nuestro caso. Las genéricas de UI (`ui-ux-pro-max`,
`frontend-design`, `styleseed`) hablan de paletas y tipografía, y eso ya está bien
en esta tienda: cambiarlo sería pulir lo que no está roto.

## Qué dice y qué falla en nuestra portada

La regla principal de la skill:

> **Above the fold: Promise + product visible + price + CTA.**

Nuestra portada tiene promesa y CTA, pero **ni producto ni precio**. En escritorio
media pantalla queda vacía; en móvil el primer producto con precio aparece a unos
660 px de scroll. El visitante que llega de un anuncio no ve nada que comprar
hasta pasar dos pantallas.

Segunda regla incumplida:

> **Repeat the CTA after mechanism, after proof, and at the end. Never end on a footer.**

La página termina en captación de correo y pie. No hay una última llamada a comprar.

Tercera comprobación, esta la pasamos: la skill enumera las prácticas que cierran
tiendas —urgencia falsa, reseñas inventadas, estadísticas sin fuente, precios
tachados que nunca se cobraron—. **No tenemos ninguna.** El único precio tachado
es el del pack, y son 54,70 € reales que se pueden comprobar sumando las tres
fichas.

## Los dos cambios

Preparados y verificados en `theme/index.nuevo.json`:

1. **Sección `destacado`** (tipo `featured-product`) justo debajo del hero, con el
   Pack baño y lluvia: foto grande, título, precio y botón de compra. Es el
   producto de mayor ticket y encaja con la temporada.
2. **Sección `cta_final`** al final, antes del pie: *"Empieza por el paseo de esta
   tarde"* con botón a la tienda entera.

Nuevo orden: `hero · destacado · confianza · categorias · productos · garantias · cta_final`

El fichero es la portada actual **exacta** (verificado por hash contra el tema)
más esas dos secciones. Los esquemas de `featured-product` y `media-with-content`
se leyeron del propio tema, no se supusieron.

## Aplicado y verificado

Está **subido y funcionando en el tema en borrador** `Mascotas - plazos corregidos`,
comprobado con capturas reales de la previsualización a 390 px y 1440 px.

Fichero final: `theme/index.portada-nueva.json` (7.369 bytes, idéntico byte a byte
al que Shopify aceptó).

### Cómo se consiguió subirlo

Los dos primeros intentos fallaron y merece la pena dejarlo escrito:

- **Por URL** (`body.type: URL`): responde sin errores pero **no aplica nada**.
  Probado con la URL firmada de staging y con la del CDN de Shopify; el checksum
  del tema no cambiaba. Falla en silencio.
- **Por texto con el fichero completo** (18 KB): la llamada **se trunca**. También
  se truncó a 11 KB. El JSON dentro de JSON se infla demasiado.
- **Lo que sí funciona**: reescribir la plantilla apoyándose en los valores por
  defecto del tema. 7,4 KB entran sin problema.

### Lo que costó ese atajo, y cómo se arregló

Aligerar rompió cosas, y solo se vio **mirando las capturas**:

1. La rejilla de productos **desapareció entera**. Los bloques estáticos
   `_product-card` y `_collection-card` no son opcionales: sin ellos no renderiza.
2. Las tarjetas de categoría salían con el texto cortado y superpuesto.
3. Shopify rechazó un intento con un error útil: los bloques estáticos deben
   llevar **los identificadores exactos del preset**, no unos inventados.

Es la misma lección de todo el proyecto: leer el esquema, y comprobar en vez de
suponer. La diferencia es que aquí el bucle capturar → mirar → corregir lo
resolvió en tres iteraciones.

### De paso, dos defectos arreglados

- **El título duplicado de las tarjetas de categoría** (lo señalé en la revisión
  de diseño): la imagen de cada colección ya lleva el nombre escrito, así que se
  quitó el bloque `collection-title`.
- **Lluvia y barro** salía como tarjeta rota porque la colección no tiene imagen.
  Fuera de la portada; sigue en el menú.

### Lo que queda cosmético

Entre el hero y el producto destacado queda un bloque gris vacío: es el área de
medios de `featured-product`, que no tiene bloque definido. Definirlo exige los
identificadores exactos del preset y un intento falló; se puede ajustar desde el
editor de temas en un minuto.

## Para publicarlo

Tienda online → Temas → **Mascotas - plazos corregidos** → **Publicar**.

Eso publica de una vez la portada nueva **y** la corrección del
"Enviamos desde Europa", que sigue viva en la portada actual.

## Sobre el 3D

La skill `web-3d-graphics` dice que para un producto suelto lo correcto es
`<model-viewer>`, que es exactamente lo que Shopify usa de forma nativa con sus
medios 3D y realidad aumentada. **No aplica aquí todavía**: CJ solo entrega
fotos, no hay modelos GLB, y encargarlos para artículos de 20 € con 10 € de
margen no se paga. Montar Three.js en la portada además rompería la regla de
`designing-converting-landings`: *speed is conversion*. El 3D entra cuando haya
un producto estrella que justifique el coste del modelo.

## Pendiente de limpiar

Quedan dos ficheros de prueba en el tema **en borrador**:
`assets/prueba-permiso.txt` y `assets/prueba-url.json`. Son inertes, pero
conviene borrarlos desde el admin: `themeFilesDelete` está bloqueado en el conector.

---

# Tipografía serif y el bloque gris (5 sept 2026)

## El bloque gris de la camiseta

Era el área de multimedia de `featured-product`. Ese bloque **no coge la imagen
del producto solo**: tiene un `image_picker` propio y, vacío, Shopify pinta su
marcador (la camiseta doblada). Se subió a Archivos la foto del labrador con el
albornoz y se asignó como `shopify://shop_images/...`. Es una foto distinta de la
de la galería a propósito, para no repetir imagen.

De paso, dos rechazos útiles de Shopify: los bloques internos de
`_featured-product` (título, precio, galería) **no se pueden declarar** en la
plantilla, los gestiona el tema. Solo `media` es configurable.

## Tipografía

Del prompt de dirección de arte, lo que sí aplica a esta tienda:

- **Titulares en serif** (Playfair Display) sobre cuerpo en sans (Inter). Da la
  autoridad que pedía el encargo sin tocar la paleta.
- H1 de 56 a 48, H2 de 40 a 36, H3 de 28 a 26: la serif pesa más ópticamente que
  la Inter y a 56 px se comía la pantalla.
- Interletrado de titulares a `heading-normal`: el `heading-tight` estaba pensado
  para una sans geométrica y en serif apelmazaba.
- Las etiquetas de oferta pasan de la fuente de titular a la de acento: una
  serif en mayúsculas dentro de una píldora pequeña se lee mal.

## Lo del encargo que NO se aplica, y por qué

El prompt pide una identidad de **marca de lujo**. Esta tienda vende accesorios
para perro de 10 a 40 € comprados en CJ. Hay tres puntos que serían un error:

- **"Colecciones de Autor", manifiesto de marca, apariciones en prensa.** No
  existen. Inventarlas es exactamente la prueba social falsa que
  `designing-converting-landings` señala como motivo de cierre de tiendas y
  bloqueo de cuentas publicitarias.
- **Paleta fría de blanco alabastro, negro ónix y grises.** La actual (crema,
  verde profundo, terracota) es cálida y encaja con producto para animales. El
  gris frío de lujo silencioso funciona en joyería y moda; en una tienda de
  perros lee a clínica.
- **Headless o CMS empresarial.** Para 25 referencias, cero ventas y un plan
  Advanced que ya cuesta 352 €/mes de más, es la decisión técnica equivocada.
  Shopify con el tema actual escala hasta miles de pedidos sin tocar nada.

El resto del encargo ya estaba hecho: descripciones de producto con storytelling
y detalle técnico, checkout de un paso (Shopify lo es de serie) y sellos de
seguridad reales.
