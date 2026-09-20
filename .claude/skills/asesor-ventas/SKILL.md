---
name: asesor-ventas
description: >
  Asesor de ventas de patitascalidas.com. Úsalo SIEMPRE antes de decidir precios,
  envíos, descuentos, qué producto subir, dónde invertir esfuerzo o si una tienda
  va bien o mal. Contiene los números reales medidos del negocio, no estimaciones.
  Dispara con: vender, ventas, conversión, margen, precio, envío, descuento,
  carrito, pedido medio, tráfico, anuncios, publicidad, rentable, qué hacemos ahora.
---

# Asesor de ventas — patitascalidas.com

Tienda de accesorios para perro y gato en España. Dropshipping desde CJ.
Un solo dueño, sin equipo, sin presupuesto de publicidad.

**Este documento contiene números medidos.** Cuando actualices uno, pon la fecha
y di cómo lo mediste. Un número sin procedencia no vale nada aquí.

---

## 0. Las dos reglas que están por encima de todo

Son de Pablo, el dueño, y se aplican a cada tarea:

1. **No des por hecho lo que no has verificado.** Ni un dato de un documento
   viejo, ni el contenido de un pack, ni que un enlace funciona.
2. **Antes de subir algo, haz una prueba de que funciona.**

Ejemplo real de esta casa: un texto decía que el «Pack baño y lluvia» llevaba
chubasquero. Llevaba toalla. Se cazó abriendo la ficha, no recordándola.

---

## 1. La aritmética del negocio (medido)

| Dato | Valor | Cómo se midió |
| --- | ---: | --- |
| Margen por pedido | **≈13 €** | Botas 22,90 € → 13,83 €. Cama dónut 32 € → ≈13 € |
| Precio mediano del catálogo | **19,90 €** | 120 productos activos, 16/09/2026 |
| Porte de un producto solo | 3,15 – 6,61 € | `freightCalculate` de CJ |
| Porte de dos productos juntos | 6,84 – 8,36 € | **Viajan en un paquete**: medido 16/09/2026 |
| Porte de lo más voluminoso | 10,92 € (cubremaletero) · 13,74 € (cama sofá) | ídem |
| Conversión de tienda nueva sin reseñas | 1 – 1,5 % | referencia del sector |

### La fórmula

```
margen = pvp/1,21 − coste_usd×0,92 − porte − (pvp×0,0175 + 0,25)
```

El porte se mide **con la variante más pesada**, nunca con la más ligera.

### El umbral que decide todo

```
pedidos necesarios al mes = coste fijo mensual / 13 €
visitas necesarias al mes = pedidos × (100 / 1,5)
```

Con Shopify Basic (32 €): **3 pedidos, ~200 visitas**.
Con Shopify Advanced a precio de tarifa (384 €): **30 pedidos, ~2.000 visitas**.

### CORRECCIÓN IMPORTANTE (20/09/2026): hoy el plan NO cuesta 384 €

Pablo tiene **Advanced en promoción: 1 € al mes durante tres meses**. Lo contó
el 17/09/2026 y dijo que llevaba unos 15 días, así que la promoción empezó
**alrededor del 2 de septiembre de 2026** y termina **alrededor del 2 de
diciembre de 2026**. *Esa fecha es una deducción de lo que él dijo, no un dato
leído del panel: la fecha exacta está en Ajustes → Plan → Facturación y hay que
mirarla antes de tomar ninguna decisión basada en ella.*

Consecuencias, y hay que aplicarlas:

- **Hoy el coste fijo del plan es ~1 €, no 384 €.** El punto de equilibrio real
  de este momento son **3 pedidos al mes**, no 30. Cualquier documento de este
  repositorio que diga «bajar a Basic es la mejora número uno» está escrito con
  la premisa vieja y **ya no vale**.
- **Lo que sí sigue valiendo es la fecha.** El día que acabe la promoción, si
  sigue en Advanced, empiezan a salir ~384 € al mes de una tienda con 0 ventas.
  Pablo ya tiene una alarma puesta; la tarea aquí es **no dejar que se pase**.
- **Mientras dure, Advanced sale gratis: úsalo.** Pero distingue dos cosas:
  - Lo que **desaparece al bajar de plan** (por ejemplo, tarifas de envío
    calculadas por transportista) **no se monta**. Montarlo es dejar la tienda
    rota el día de la bajada.
  - Lo que **queda para siempre** sí se aprovecha: datos e informes que
    extraigamos ahora, y la comisión de tarjeta más baja (1,6 % + 0,30 en vez de
    2,1 % + 0,30) en cualquier venta que ocurra durante estos meses.

**Antes de discutir tráfico, mira el coste fijo.** Sigue siendo la primera
pregunta; lo que ha cambiado es la respuesta: hoy el coste fijo ya está bien, y
la tarea es que lo siga estando en diciembre.

---

## 2. Orden de ataque. No te lo saltes

Cuando alguien pregunte «¿qué hacemos para vender más?», el orden es este y no otro:

1. **Coste fijo.** ¿Hay algo que se paga y no devuelve nada? Arréglalo primero: es gratis e inmediato.
   Hoy no lo hay (Advanced está a 1 € por promoción), pero **comprueba la fecha de fin de la promoción**
   en Ajustes → Plan antes de dar este punto por bueno. Ver la corrección del apartado 1.
2. **Fugas que cuestan dinero en cada pedido.** Umbral de envío mal puesto, IVA mal configurado, un descuento que no hace falta.
3. **Tráfico.** Es el cuello de botella real de esta tienda. Sin gente no hay nada que optimizar.
4. **Conversión.** Solo cuando haya **300–500 visitas reales al mes**. Por debajo de eso, cualquier cambio es una corazonada disfrazada de mejora.
5. **Catálogo.** Lo último. Un producto más no arregla nada si los 120 que hay no han vendido.

---

## 3. Cómo leer la analítica de esta tienda sin engañarte

**Descuenta siempre `escritorio / Estados Unidos` antes de sacar conclusiones.**
Son rastreadores y nuestras propias comprobaciones desde un centro de datos.

Septiembre 2026: de 502 sesiones en 30 días, **368 eran escritorio de EE. UU.**
El tráfico humano de verdad era **72 sesiones de móvil desde España**.

- El escaparate devuelve **429 según el User-Agent**, no según la IP. Con
  User-Agent de móvil responde 200. Si sale 429, no es un enlace roto.
- `fetch` de Node recibe 403 donde `curl` recibe 200. Usa `curl`.
- Shopify **no excluye al administrador**: tus propias visitas cuentan.

---

## 4. Reglas de producto

### Para subir uno nuevo

- **Margen mínimo 8 €** después de portes y comisión. Por debajo, no entra.
- **Mide el porte con la variante más pesada.**
- **Detector de `listedNum`:** si un producto con mucha búsqueda lo venden
  poquísimas tiendas en CJ, casi siempre es porque el porte lo hace imposible.
- **Comprueba las fotos de las variantes antes de escribir la ficha.** Un
  producto titulado «pañuelo» resultó ser una pajarita. Se vio montando las
  8 fotos en un collage, no leyendo el título.
- **Busca duplicados dentro de tu propia tanda.** Dos listados distintos de CJ
  pueden ser el mismo producto (misma tela, mismas medidas, mismo peso).
- **Pon la categoría de la taxonomía de Shopify** (`category`), no solo el
  `productType`. Son dos campos distintos: el `productType` es nuestro texto
  libre y no sale de la tienda; la categoría es la que se traduce a
  `google_product_category` en Merchant Center. Sin ella, Google adivina por el
  título y puede rechazar el producto. Se subieron 46 sin categoría hasta el
  17/09/2026 por no mirarlo.
  Buscar el id: `taxonomy { categories(search: "…") { nodes { id fullName } } }`.
  Comprobar al terminar: `productsCount(query: "status:ACTIVE AND NOT category_id:*")`
  tiene que dar **0**.

### Para escribir la ficha

- **Medidas reales en centímetros**, del fabricante. La talla no va por kilos.
- **Di lo que el producto NO hace.** No es humildad, es conversión: quita las
  devoluciones y las reseñas de una estrella, y es lo único que nos diferencia
  de las otras tiendas que venden exactamente el mismo producto de CJ.
- **Nunca menciones al proveedor** ni el SKU de CJ en texto público.
- **Plazo de entrega honesto**: una o dos semanas. Está en el nombre del tema.

---

## 5. Reglas de envío y precio

- **Envío gratis desde 39 €** (desde el 16/09/2026). Antes eran 55 €, que solo
  alcanzaban 4 de 120 productos. 39 € se alcanza con dos productos, que sí es
  una primera compra creíble.
- **Envío estándar 6,99 €** por debajo de eso.
- Dos productos **viajan en un paquete** (comprobado). Por eso el umbral se
  puede bajar sin que el porte se duplique. **Vuelve a comprobarlo** si cambias
  de proveedor o de almacén.
- **`BIENVENIDA10`**: 10 % en el primer pedido, una vez por cliente. Es la
  moneda de cambio por el correo electrónico, no una rebaja general.
- Un descuento por debajo del 10 % **no mueve a nadie**: el 5 % sobre 19,90 €
  es un euro. El `Pet07` del 5 % estuvo activo tres días con cero usos.

---

## 6. Canales: lo que funciona y lo que no

| Canal | Estado | Qué hacer |
| --- | --- | --- |
| TikTok / Instagram | 59 sesiones/mes | **Enlazar SIEMPRE a la ficha del producto, nunca a la portada.** El 94 % aterrizaba en portada y se iba |
| Búsqueda orgánica | 31 sesiones/mes, 0 palabras posicionadas | El blog está sembrado. Tarda meses. No lo toques esperando resultados rápidos |
| Google Ads | sin usar | **No, todavía.** Ver abajo |
| Correo electrónico | 2 clientes | El agujero más grande. Categoría de compra repetida |

### Por qué Ads todavía no

Con 13 € de margen, un clic a 0,35 € y una conversión del 1 %:
100 clics = 35 € de gasto y 1 venta = 13 € de margen → **−22 €**.
El equilibrio exige convertir al 2,7 %, el doble o el triple de lo normal en
una tienda nueva sin reseñas.

**Y no se puede decidir todavía porque no tenemos una conversión real medida.**
Primero tráfico gratis hasta 300–500 visitas/mes, luego se mide, luego se
rehace esta cuenta con el número de verdad, y solo entonces se prueba con
presupuesto cerrado (5 €/día, 14 días, huso de Madrid).

### El hueco que nadie ha tapado

**Nadie ha tocado un producto físico todavía.** Todas las fotos son del
proveedor, iguales a las de cualquier competidor. Los vídeos son fotos con
zoom y texto encima, no metraje real.

Pedirse 3–4 productos a casa (60–80 €) arregla tres cosas de golpe: vídeo real
para redes, fotos propias, y control de calidad **antes** de que lo haga un
cliente.

---

## 7. Lo que sí y lo que no se puede tocar por API

**Sí:** productos, variantes, colecciones, precios, tarifas de envío nuevas,
códigos de descuento, publicaciones en canales, blog, metafields.

**No, solo desde el panel:**
- Cambiar de plan de Shopify.
- «Aplicar impuestos a los gastos de envío».
- Los rangos de precio de una tarifa de envío existente (se leen, no se editan).
- Los ajustes del formulario de pago (teléfono obligatorio).
- Desinstalar apps (`appUninstall` desinstala la que llama, o sea la nuestra).
- Escribir en el tema publicado.

Cuando algo caiga en la segunda lista, **dilo claro y da el camino exacto del
panel**. No lo dejes en «habría que…».

---

## 8. Riesgos vivos que rompen el primer pedido

1. ~~**La creación automática de pedidos de la app de CJ.**~~ **RESUELTO el
   17/09/2026.** Se apagó el interruptor «Sincronización automática (Información
   de pedidos y productos)» en la versión de **escritorio** de CJ: columna de
   iconos de la izquierda → **octavo icono** (tiendecita con un sello) →
   **Shopify (1)** → fila de `g5d031-ir`. No está en la versión móvil.
   Se podía apagar sin miedo porque en ese menú hay dos conexiones
   independientes: **Shopify (1)**, que es la app y la que rompió el #1001, y
   **API (1)**, que es la nuestra y la que usa `servir.ts` con el token.
   Comprobado después: 126 productos, 833 conexiones y 42 de 42 variantes de la
   sudadera, todo intacto.
   **Pendiente de comprobar en la siguiente tanda:** ese interruptor juntaba
   pedidos *y productos*, así que puede que ya no sincronice el catálogo solo.
   Si CJ no ve los productos nuevos, pulsar **Sync** a mano en *Productos de la
   tienda* antes de ejecutar `vincular.js --ejecutar`.
   **Se sigue sirviendo con `scripts/cj/servir.ts`, nunca con la app.**
2. **El teléfono es obligatorio en el envío** (verificado). Sin él el
   transportista español no entrega.
3. **Saldo en CJ.** Sin saldo el pedido no sale aunque el cliente haya pagado.

---

## 9. Dónde está cada cosa

```
research/estructura-negocio-2026-09-16.md   el análisis completo del negocio
research/embudo-2026-09-14.md               por qué 0 ventas no es un dato todavía
research/criterio-seleccion-2026-09-16.md   cómo se elige un producto
research/pedidos-que-no-se-rompen-*.md      qué falló en el #1001
contenido/redes/                            el calendario de redes y sus reglas
contenido/blog/README.md                    qué artículos hay y cuáles no se pueden ganar
scripts/cj/                                 medir portes, márgenes, servir pedidos
scripts/tienda/                             subir tandas de productos
```

Skills hermanas en este repo: `ecommerce-advisor` (marcos generales),
`merchandising-rules`, `cart-abandonment-recovery`, `email-marketing`,
`seo-ecommerce`, `copywriting`, `producto-ganador`.

---

## 10. Cómo responder cuando te pregunten «¿vamos bien?»

Con números y con la verdad:

- **Cero ventas con 72 visitas al mes no es un fracaso, es aritmética.** A 1 %
  de conversión, lo esperable es 0,7 ventas al mes.
- Lo que **sí** se puede afirmar: el sistema de venta funciona de punta a punta
  (comprobado con una compra real), el catálogo está bien hecho y las fichas
  dicen la verdad.
- Lo que **no** se puede afirmar todavía: cuál es la conversión real de la
  tienda. Hacen falta 300–500 visitas antes de que ese número signifique algo.

**Nunca presentes un pedido de prueba como una venta.** El #1001 fue una
compra de un familiar, devuelta.
