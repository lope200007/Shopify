# Verificación completa de la tienda en línea

14 de septiembre de 2026. Todo comprobado contra **patitascalidas.com en vivo**,
no contra el admin ni contra un tema de pruebas.

## El tema en línea es el de siempre

`204140708188` — **«Patitascalidas 2026 — plazo de entrega real»**, rol `MAIN`.
No se ha tocado ningún tema en toda la sesión. Hay ocho temas sin publicar
guardados (Helio, versiones de reconstrucción, «portada con movimiento»…) y
ninguno está en línea.

Conviene tenerlo claro para no volver a dudar: **los productos, los precios,
las variantes, las fotos y los SKU no viven dentro de un tema.** Son datos de
la tienda. El tema solo decide cómo se pintan. Por eso todo lo subido aparece
en el que esté publicado, sea cual sea.

## Catálogo

| Comprobación | Resultado |
| --- | --- |
| URLs de producto en el sitemap | 72 productos + portada |
| Fichas que no dan HTTP 200 | **0** |
| Variantes en total | **391** |
| Productos sin ninguna foto | **0** |
| Variantes sin precio válido | **0** |
| Variantes con SKU del proveedor | **0** |
| Fotos de los tres productos nuevos | 20 de 20 cargan (81 kB, 93 kB, 46 kB de muestra) |

## Los tres productos nuevos, tal y como los ve un cliente

| | Alfombrilla seda de hielo | Bebedero 2 en 1 | Pelota rodante |
| --- | --- | --- | --- |
| Botón de compra | sí | sí | sí |
| Precio visible | sí | sí | sí |
| Selector de variantes | sí, 24 opciones | sí, 3 | sí, 7 |
| Fotos | 6 | 6 | 8 |
| Tabla de tallas en la galería | sí | no aplica | no aplica |
| Apartados de la ficha | 7 | 7 | 8 |
| Plazo de entrega escrito | sí | sí | sí |
| Envío gratis desde 55 € | sí | sí | sí |
| Canales | Tienda online + Shop + TikTok | los tres | los tres |

## Navegación

Las **12 colecciones** del menú dan 200. Los tres nuevos aparecen donde deben:
novedades y gatos los tres; camas-y-descanso la alfombrilla; comederos el
bebedero; juguetes la pelota; casa-y-coche la alfombrilla y el bebedero.

## Temporada: lo que todavía no debe verse

`/collections/halloween`, `/collections/navidad`,
`/products/alas-murcielago-halloween` y `/products/bufanda-gorro-navidad-perro`
dan **404**, que es lo correcto hasta el 1 de octubre y el 1 de noviembre.

## Compra de verdad

Carrito con tres artículos distintos:

```
1 x PTC-BOLA-MOR       19,90 €   Pelota rodante automática para gato
2 x PTC-BEB2-VER       35,80 €   Bebedero portátil 2 en 1
1 x PTC-HIELO-XL-AZU   29,90 €   Alfombrilla refrescante de seda de hielo
                       ------
             TOTAL     85,60 EUR   (4 artículos)
```

- Checkout: **HTTP 200 en 1,87 s**.
- Portes a Madrid con 85,60 € en el carrito: **0,00 €** (pasa del umbral de 55).
- Portes a Madrid con 19,90 €: **6,99 €**.
- Portes a Palma de Mallorca con 19,90 €: **6,99 €** — Baleares está cubierto.
- Métodos de pago visibles: Visa, Mastercard, PayPal.
- Sin contraseña de acceso: la tienda está abierta al público.

## Móvil (iPhone)

Portada 0,52 s · ficha de producto 0,63 s · colección 0,43 s. Todo HTTP 200.

## Un fallo encontrado y arreglado

Las páginas **«Preguntas frecuentes»** y **«Envíos y entregas»** existían,
estaban publicadas y estaban en el menú de pie… pero **no eran accesibles con
un clic desde ninguna parte de la web**. El motivo: el pie del tema en línea
no tiene ningún bloque de menú. Solo lleva el boletín, el copyright, la lista
de políticas y los iconos sociales.

Eso es justo lo que mira un cliente que nunca te ha comprado antes: cuánto
tarda y qué pasa si quiere devolverlo.

Arreglado añadiéndolas al **menú principal**, que es dato de la tienda y no
depende del tema. Verificado en vivo (saltando la caché de Shopify): las
cuatro páginas salen ahora enlazadas desde la portada y las 12 colecciones
siguen intactas.

**Queda mejor todavía si Pablo añade el menú al pie** (2 minutos):
Tienda online → Personalizar → Pie de página → Añadir bloque → **Menú** →
elegir «Menú de pie de página». Eso no lo puedo hacer yo: el conector bloquea
escribir en el tema publicado, y con razón.
