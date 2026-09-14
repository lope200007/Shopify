# Auditoría del canal de Google, punto por punto

14 de septiembre de 2026, después de que Pablo instalara el canal.
Todo comprobado contra la API de Shopify, no contra la pantalla.

## Instalación

| Qué | Resultado |
| --- | --- |
| Canal en la tienda correcta | ✅ `Google & YouTube` en `g5d031-ir.myshopify.com` |
| ID de la publicación | `gid://shopify/Publication/370321752412` |
| Cuenta de Merchant Center creada | ✅ **5851656186** |
| Mercado configurado | ✅ Un solo mercado: **España**, activo y principal |
| Moneda | ✅ EUR |

**El susto de `prestige-12657`**: la barra de direcciones del panel mostraba ese
identificador en vez de `g5d031-ir`. No es otra tienda. Shopify conserva en la
URL del panel el identificador con el que se creó la tienda aunque luego se le
cambie el nombre. La prueba definitiva fue mirar desde dentro si el canal había
aparecido en la tienda que gestiono. Apareció.

**Regla para la próxima: la URL del panel no identifica la tienda. El
`myshopifyDomain` sí.**

## El fallo gordo: 39 productos sin categoría

`category: null` en **39 de los 74 productos activos**, más los 4 de Navidad.
Más de la mitad del catálogo.

Por qué importa: la categoría es lo que le dice a Google **en qué búsquedas
enseñar el producto**. Sin ella Google la adivina leyendo el título, y se
equivoca a menudo. El resultado típico no es el rechazo: es que el producto se
aprueba y **no se enseña nunca**, o se enseña en búsquedas que no son.

Es exactamente el fallo que no se ve en ningún contador.

**Arreglado: 43 productos categorizados** (39 activos + 4 de Navidad), con
códigos sacados del catálogo oficial de Shopify mediante la consulta
`taxonomy { categories(search:) }`, no inventados. Ninguno dio error.

Algunos ejemplos del criterio seguido:

| Producto | Categoría asignada |
| --- | --- |
| Alfombrilla refrescante de seda de hielo | Accesorios de cama para mascotas |
| Bebedero portátil 2 en 1 | Cuencos de viaje |
| Pelota rodante para gato | Juguetes para gatos |
| Collar con AirTag | Arneses y collares para mascotas |
| Collar isabelino e inflable | Collares isabelinos para mascotas |
| Barrera de malla y Pack de coche | Barreras para mascotas para vehículos |
| Alas de murciélago y gorro | Disfraces para mascotas |
| Secador-cepillo | Secadores de pelo para mascotas |
| Portabolsas | Bolsas para perros |
| Protector de sofá | Productos para gatos |

## Estado final del catálogo

| Comprobación | Resultado |
| --- | --- |
| Productos activos | **74** |
| Con categoría asignada | **74 de 74** |
| Con marca (`vendor`) | **74 de 74** |
| Publicados en los 4 canales | **72 de 74** |
| Los 2 que faltan | Alas de murciélago y gorro: programados para el 1 de octubre |
| Borradores de Navidad | 4, con categoría ya puesta, esperando al 1 de noviembre |
| Archivados | 2, sin categoría y sin publicar. Correcto: están retirados |

## Envíos, que es lo segundo que mira Google

| Zona | Tarifa |
| --- | --- |
| España peninsular y Baleares | 6,99 € · gratis desde 55 € |
| Unión Europea | 8,99 € |
| Internacional (14 países) | 12,99 € |

Las tres zonas tienen tarifa activa. Google no se va a quejar.

**Pero hay un método fantasma**: en las tres zonas aparece activo un
**«AliDrop Shipping»** sin precio, de la aplicación *Aliexpress Dropshipping
Center*. En la prueba de compra real no devolvió ninguna tarifa —solo salió
«Estándar»—, así que hoy no rompe nada. Es basura de una aplicación que no se
usa. Conviene quitarlo cuando se repasen las aplicaciones.

## Un detalle operativo que hay que recordar

**`autoPublish: false` en los cinco canales.** No es un fallo —es así en toda
la tienda—, pero significa que **un producto nuevo no entra solo en ningún
canal**. Hay que publicarlo a mano en los cuatro, ahora también en Google.

Añadido a la rutina de subida: `publishablePublish` con las cuatro
publicaciones, no tres.

## Las Routines de temporada, corregidas

Las dos de encendido daban por hecho **tres** canales. Ahora son cuatro:

- **Halloween ON — 1 de octubre** (`trig_017wWZ1oMALfy8xYtn9NfiG9`)
- **Navidad ON — 1 de noviembre** (`trig_01Mty91eisJcd1Gr37zWdvxe`)

Sin esto, los productos de temporada habrían salido en la web pero **no en
Google Shopping**, justo en su campaña. Y como la aprobación tarda de 3 a 5
días, encenderlos tarde es perder la temporada entera.

## Lo que no se puede ver desde aquí

La aplicación de Google **no guarda el estado de aprobación dentro de la
tienda**. Comprobado producto a producto: solo existe el metafield
`mm_google_shopping_extension.merchant_id` a nivel de tienda.

Así que **Approved / Not Approved solo lo ve Pablo**, en la pantalla del canal
dentro de Shopify. Reparto:

| Quién | Qué |
| --- | --- |
| Pablo | Lee los contadores, pasa los rechazos y los correos de Google |
| Yo | Arreglo la ficha: categoría, título, descripción, fotos, precio, canales |
| Nadie desde aquí | Ajustes dentro de Merchant Center (envíos, datos del negocio) |

## El aviso amarillo no es un error

*«No Google Ads account linked»* es Google intentando vender publicidad. Se
queda ahí para siempre y no afecta a las fichas gratuitas de Shopping. **No
enlazar Google Ads** mientras no haya ventas que digan qué producto tira.

## Siguiente revisión

`trig_01QcLBVbszbY2CAcudoH2UWr` — 17 de septiembre.

---

## Cierre: los 67 "Limitado" y el único aviso de la cuenta

Fecha: 14 de septiembre de 2026, 12:20. Verificado por Pablo pantalla por
pantalla dentro de Merchant Center 5851656186.

### Lo que dice Merchant Center

| Pantalla | Resultado |
| --- | --- |
| Productos totales | 391 (= 74 productos, Google cuenta variantes) |
| No aprobado | **0** |
| Productos > Necesita atención | **vacía** — "Aquí aparecerán los productos que requieren su atención" |
| Problemas de configuración y políticas | **1** |
| Columna Visibilidad de los "Limitado" | **check verde** — se están mostrando |

### El único aviso de la cuenta

Literal de `/mc/products/diagnostics/accountissues?a=5851656186`:

> **No hay ninguna cuenta de Google Ads vinculada.**
> Para crear anuncios, deberá vincular su cuenta de Google Ads con Merchant Center.

Es el upsell de publicidad de pago, no un defecto de la tienda. **No se
vincula**: con 0 ventas, invertir en Ads es apostar a ciegas, y además el
formulario de alta que Google ofrece venía con huso horario
`(GMT-04:00) Hora estándar del Atlántico` preseleccionado — el huso horario de
una cuenta de Google Ads **no se puede cambiar después de crearla**, así que
aceptarlo habría dejado todos los informes desfasados para siempre.

Google empuja a ese mismo formulario desde al menos cuatro sitios distintos
(el aviso amarillo de Descripción general, el panel de la app en Shopify, la
pestaña de configuración y este diagnóstico). Es el mismo botón, no cuatro
problemas.

### Por qué "Limitado", con el resto ya descartado

Descartado uno a uno contra Shopify: los cuatro productos afectados que se
pudieron leer en pantalla tienen categoría, marca, foto de 670 px o más,
precio y `availableForSale: true`.

| Producto | Variantes | Categoría | Marca | Foto |
| --- | --- | --- | --- | --- |
| Alfombrilla de seda de hielo | 24 | Accesorios de cama | sí | 1400 px |
| Bozal de silicona tipo cesta | 18 | Bozales para mascotas | sí | 670 px |
| Pelota rodante para gato | 7 | Juguetes para gatos | sí | 800 px |
| Bebedero portátil 2 en 1 | 3 | Cuencos de viaje | sí | 800 px |
| | **52** | | | |

Suman 52 de los 67; los ~15 restantes no se llegaron a ver al hacer scroll.

Con "Necesita atención" vacía, la causa que queda es la falta de **GTIN**
(el EAN de fabricante). Los artículos de CJ no lo llevan porque no son de una
marca registrada: el identificador **no existe**, no es que se haya omitido.

Consecuencia real: Google no los agrupa en las comparativas de "mismo producto
en varias tiendas", pero sí los muestra en Shopping. De ahí el check verde.

**No se arregla y no se intenta.** Inventar códigos EAN está prohibido por la
política de Google y es motivo de suspensión de la cuenta de Merchant Center.

### Regla para futuras subidas

No dejar el campo código de barras a medias ni rellenarlo con nada inventado.
"Limitado" es el estado normal y esperado de un catálogo de dropshipping sin
marca propia. No es un defecto que perseguir.

### Lo que sí queda pendiente en Google

Verificar el dominio en Search Console y enviar el sitemap. Eso es la búsqueda
orgánica (los resultados de texto), que es un canal distinto de Shopping y el
que de verdad puede traer visitas sin pagar.
