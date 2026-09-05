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

## Por qué no está aplicado

El conector no puede transportar el fichero:

- **Por URL**: `themeFilesUpsert` con `body.type: URL` responde sin errores pero
  **no aplica nada** (comprobado dos veces, checksum del tema sin cambiar), tanto
  con la URL firmada de staging como con la del CDN de Shopify.
- **Por texto**: los 18 KB del fichero **se truncan** en la llamada.
- Reducirlo a 10,8 KB exigiría quitar ajustes suponiendo cuáles son los valores
  por defecto del tema. Eso es adivinar, y en este proyecto adivinar esquemas ha
  salido caro.

## Cómo aplicarlo

**Opción A — Shopify CLI** (sin límite de tamaño, es la vía natural):

```bash
shopify theme push --theme 203947442524 --only templates/index.json
```

desde la carpeta del tema, con `theme/index.nuevo.json` renombrado a
`templates/index.json`.

**Opción B — editor de temas**, dos minutos:

1. Tienda online → Temas → *Mascotas - plazos corregidos* → Personalizar
2. **Añadir sección** → *Producto destacado* → arrastrar justo debajo del hero →
   elegir *Pack baño y lluvia*
3. **Añadir sección** → *Cita destacada* al final → titular
   "Empieza por el paseo de esta tarde", texto y botón "Ver todo lo que vendemos"
   apuntando a `/collections/all`
4. Guardar y **Publicar** (esto publica también la corrección de
   "Enviamos desde Europa", que sigue pendiente)

## Pendiente de limpiar

Quedan dos ficheros de prueba en el tema **en borrador**:
`assets/prueba-permiso.txt` y `assets/prueba-url.json`. Son inertes y no los
referencia nada, pero conviene borrarlos desde el admin: `themeFilesDelete` está
bloqueado por seguridad en el conector.
