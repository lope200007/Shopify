# Cola de subida — EJECUTADA el 10 de septiembre de 2026

**El Grupo 1 está subido y publicado.** La API de portes de CJ volvió a
funcionar y los siete pasaron el filtro: portes de 3,59 a 6,47 €.

| Producto | Handle | PVP | Porte | Margen | Var. |
|---|---|---:|---:|---:|---:|
| Portabolsas de paseo | `portabolsas-paseo-perro` | 14,90 € | 3,59 € | 6,84 € (56 %) | 3 |
| Anilla flotante de espuma | `anilla-flotante-perro` | 14,90 € | 4,44 € | 6,47 € (53 %) | 4 |
| Frisbee blando con dos asas | `frisbee-blando-perro` | 16,90 € | 4,57 € | 7,43 € (53 %) | 3 |
| Comedero plegable de viaje | `comedero-plegable-viaje` | 14,90 / 19,90 € | 4,37-4,68 € | 6,54-9,63 € | 8 |
| Alfombrilla bajo comedero | `alfombrilla-bajo-comedero` | 17,90 / 21,90 € | 5,42-6,10 € | 7,75-9,60 € | 12 |
| Bozal de silicona de cesta | `bozal-silicona-cesta-perro` | 17,90 € | 3,70-4,82 € | 7,74-9,53 € | 18 |
| Cepillo carda redondo | `cepillo-carda-redondo-perro` | 16,90 € | 4,06 € | 8,42 € (60 %) | 5 |

53 variantes nuevas, cada una con su foto real del proveedor. Sumadas a
las 6 del cepillo con spray de la misma tanda son 59 SKU, y las 59
resuelven contra el volcado: `59 SKU, 0 sin mapeo`. Los siete entran
solos en Novedades y en su colección por etiqueta, y llevan su vídeo
vertical en `assets/video/`.

## Dos cosas que salieron por el camino

**1. Los nombres del barrido estaban cruzados.** Lo que la cola llamaba
«frisbee blando de anilla» es una **anilla** de espuma, y la «anilla de
tira y afloja» es un **disco** con dos asas. Son dos productos distintos,
los dos buenos, y se han subido los dos con el nombre que les toca.

**2. El cepillo carda rectangular estaba ARCHIVADO.** Al ir a subir el
redondo apareció `cepillo-autolimpiable-para-perro` en el catálogo, y por
un momento pareció un duplicado. No lo es: está archivado, no se vende.
Y tenía dos fallos de bulto:

- la foto principal llevaba texto en inglés («Deep Deshedding & Gentle on Skin»),
- y **la variante Verde mostraba el cepillo morado**: se subió la foto del
  color equivocado.

Se ha arreglado igualmente (fotos reales de los cinco colores, las medidas
en centímetros, diez variantes con su imagen correcta), pero **sigue
archivado**: no se toca su estado sin que lo decida Pablo.

Su margen tampoco cuadra: cuesta 3,32 $ y el porte son 4,50 €, así que a
14,90 € deja **4,25 €**, por debajo de la regla de los 6 €. Si se
desarchiva habría que subirlo a 16,90 / 19,90 €.

---

## GRUPO 2 — Estacional: subir en OCTUBRE, no ahora

| # | Producto | pid | Coste | Peso | Var. | Fotos | Por qué octubre |
|---|---|---|---:|---:|---:|---:|---|
| 7 | **Gorro navideño** | `2502160808291616000` | 1,00-1,05 $ | 45-55 g | 22 | 15 | Publica medidas en cm |
| 8 | **Pañuelo navideño de punto** | `2407110815231615600` | 0,84-2,11 $ | 35-58 g | 8 | 23 | Comprobar antes si la talla de cuello sale en las fotos |

`regalos navidad` pasa de 210 búsquedas en julio a **60.500 en diciembre**.
Para que Google los tenga indexados en noviembre hay que subirlos en octubre.
Los dos entran solos en `/collections/regalos` con la etiqueta `regalo`.

## GRUPO 3 — Revisado el 9/9 por la noche

| # | Producto | pid | Vol/mes | Estado |
|---|---|---|---:|---|
| 9 | **Jersey de punto de invierno** | `2412170611181629400` | 1.300 (2.900 dic) | ❌ **DESCARTADO.** Revisadas sus 9 fotos una a una: no hay tabla por ningún lado. Las tallas son «No 6» a «No 16», numeración china sin equivalencia publicada |
| 10 | **Bozal de silicona tipo cesta** | `1741674559775977472` | 880 | ✅ **DESBLOQUEADO.** La tabla estaba en la foto 10, en milímetros |
| 11 | **Collar táctico con asa** | `2609070738301614700` | **3.600** | ❌ Sigue sin contorno de cuello. Mismo muro que los otros 90 collares |

### La tabla del bozal, ya convertida

Se vende por **contorno de hocico**, que es la medida que decide. La columna de
kilos es del fabricante y **es inconsistente** —la fila 5 viene en libras y el
resto en *catties* chinos—, así que va solo como orientación.

| Talla | Contorno de hocico | Largo | Ancho | Peso orientativo |
|---|---:|---:|---:|---|
| 3 | 10,3 cm | 9,1 cm | 8,8 cm | 2,5 a 5 kg |
| 4 | 11,4 cm | 10,1 cm | 9,7 cm | 5 a 7,5 kg |
| 5 | 12,5 cm | 11,1 cm | 10,6 cm | 7,5 a 10 kg |
| 6 | 13,3 cm | 11,8 cm | 11,3 cm | 10 a 15 kg |
| 7 | 13,9 cm | 12,3 cm | 11,8 cm | 15 a 20 kg |
| 8 | 16,6 cm | 14,8 cm | 14,2 cm | 20 a 30 kg |

Va al grupo 1. Y es mejor producto que el bozal de nailon que ya vendemos: al
ser de cesta, el perro puede jadear y beber con él puesto. La ficha tiene que
decir eso y también que un bozal no se deja puesto sin vigilancia.

## GRUPO 4 — Hay que confirmar una cosa antes

| # | Producto | pid | Vol/mes | Qué confirmar |
|---|---|---|---:|---|
| 12 | **Chapa identificativa grabada** | `2605140441451632200` | **4.400** | Ver abajo |

### Chapa: respondido, y la respuesta es «sí, pero»

CJ **sí acepta personalización** en este producto: `customizationVersion: 2`,
con un área de diseño llamada `diy`, `podType: 3`. Y publica medidas: redonda
de 3,5 cm de diámetro, cuadrada de 2,3 × 4,5 cm.

El pero: **no es un campo de texto**. Es impresión bajo demanda — hay que
mandar con el pedido una imagen de diseño colocada sobre la plantilla, con sus
coordenadas (`left: 149.25`, `top: 410`), su escala (`scaleX: 1.698`) y su
cuerpo de letra (`fontSize: 12`).

O sea: para venderlo hay que **construir un paso que dibuje el nombre y el
teléfono del cliente sobre la plantilla y lo suba con el pedido**. Es un
proyecto de medio día, no una ficha de veinte minutos.

Con 4.400 búsquedas/mes probablemente merezca la pena, pero es una decisión
aparte: no se puede colar en una tanda de subidas normales.

---

## Lo que esta cola NO incluye, y por qué

- **Camas** (6.600/mes, 9.900 en nov-ene), **rampas** (3.600), **carritos**
  (3.600), **casetas** (2.900): el porte se cobra por volumen. La cama redonda
  de 380 g pagaba 18,12 € y la rampa 38,51 €. **15.000 búsquedas al mes que
  solo se abren con un proveedor europeo.**
- **Antiparasitarios** (15.400 sumando): producto veterinario y biocida.
- **Collares de adiestramiento eléctricos y antiladridos** (5.500): aversivos.
- **GPS** (3.600): equipo radioeléctrico, conformidad CE/RED.
- **Champús, bálsamos y toallitas**: producto tópico, etiquetado en castellano
  y restricciones de envío de líquidos. Pendiente de mirar con calma.
- **Alfombra y cama refrescantes** (1.600 sumando): pico en junio-julio, valle
  en diciembre. Van en abril.

## Estado de la API de portes

El 9 de septiembre por la noche `/logistic/freightCalculate` empezó a devolver
`[]` para **todos** los productos, incluidos los que veinte minutos antes daban
precio (el arnés daba 5,60 € y el mordedor 3,70 €). Tres intentos seguidos,
misma respuesta vacía.

**Antes de subir nada, reintentar con un producto conocido.** Si el arnés
`2096911781092425733` vuelve a dar unos 5,60 €, la API está bien y se puede
ejecutar la cola.
