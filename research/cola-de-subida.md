# Cola de subida — lista para ejecutar cuando vuelva la API de portes

Preparada el 9 de septiembre de 2026, con la calculadora de portes de CJ caída.
**Todo lo demás ya está investigado**: producto localizado, coste, peso,
variantes, fotos contadas y comprobado si publica medidas. Lo único que falta
de cada línea es el porte, que es el filtro que decide.

Barrido: 23 categorías del catálogo de CJ, 1.873 candidatos que pasan el filtro
de plano y ligero (≤600 g, 0,80-16 $), descartando de entrada lo regulado, lo
aversivo y lo que es de gato, pájaro o roedor.

---

## Cómo se ejecuta cada línea

```
1. node scripts/cj/portes-candidatos.js   (o medir el vid a mano)
      -> si el porte deja menos de 6 EUR de margen, se descarta y se anota
2. bajar fotos, mirarlas UNA A UNA a tamaño legible
      -> fuera las que llevan texto en inglés, marca ajena o un color que no se vende
3. scripts/fotos/borrar-banda.py / borrar-rotulo.py / cuadrar.py
4. scripts/fotos/mejorar-foto.py --revelar   (nunca amplía; desvío de tono < 0,01)
5. productCreate -> productVariantsBulkCreate -> publishablePublish -> colección
6. guardar el volcado en proveedores/cj/ y verificar con scripts/cj/mapa.js
7. añadir guion a scripts/video/guiones.json y generar el vertical
```

Está todo en `.claude/skills/producto-ganador/SKILL.md`.

---

## GRUPO 1 — Listos para subir en cuanto haya porte

| # | Producto | pid | Coste | Peso | Var. | Fotos | Sirve a | Vol/mes |
|---|---|---|---:|---:|---:|---:|---|---:|
| 1 | **Alfombrilla de silicona bajo comedero** | `2608250338081619900` | 0,95-5,50 $ | 210-420 g | 26 | 17 | comedero perro | 1.900 |
| 2 | **Frisbee blando de anilla** | `2605250925121630500` | 0,97 $ | 125 g | 4 | 8 | juguetes para perros | 1.900 |
| 3 | **Anilla de tira y afloja (perro grande)** | `2604290649151607300` | 1,55 $ | 165 g | 3 | 8 | juguetes para perros | 1.900 |
| 4 | **Comedero plegable de viaje** | `2608280130201619400` | 0,92-1,67 $ | 120-180 g | 16 | 10 | comedero perro | 1.900 |
| 5 | **Peine deslanador de acero** | `2608030601051636000` | 1,02 $ | 97 g | 5 | 8 | cepillo para perros | 880 |
| 6 | **Bolsa de paseo con portabolsas** | `2607101002501618600` | 1,49 $ | 62 g | 3 | 5 | bolsa paseo perro | 720 |

Ninguno de estos necesita tabla de tallas en centímetros: no son prendas ni
van ceñidos al cuerpo. Los números 1 y 2 publican medidas igualmente.

**Precio orientativo**: con la regla de siempre (el margen en euros sale más o
menos la mitad del PVP, porque el porte es casi fijo), estos caen en la banda
de 12,90 a 19,90 €. Se fija con el porte real, no antes.

## GRUPO 2 — Estacional: subir en OCTUBRE, no ahora

| # | Producto | pid | Coste | Peso | Var. | Fotos | Por qué octubre |
|---|---|---|---:|---:|---:|---:|---|
| 7 | **Gorro navideño** | `2502160808291616000` | 1,00-1,05 $ | 45-55 g | 22 | 15 | Publica medidas en cm |
| 8 | **Pañuelo navideño de punto** | `2407110815231615600` | 0,84-2,11 $ | 35-58 g | 8 | 23 | Comprobar antes si la talla de cuello sale en las fotos |

`regalos navidad` pasa de 210 búsquedas en julio a **60.500 en diciembre**.
Para que Google los tenga indexados en noviembre hay que subirlos en octubre.
Los dos entran solos en `/collections/regalos` con la etiqueta `regalo`.

## GRUPO 3 — Bloqueados por falta de medidas

| # | Producto | pid | Vol/mes | Qué falta |
|---|---|---|---:|---|
| 9 | **Jersey de punto de invierno** | `2412170611181629400` | 1.300 (2.900 dic) | 22 variantes, 9 fotos, **sin contorno de pecho en cm**. Mirar si la tabla está dentro de alguna foto |
| 10 | **Bozal de silicona tipo cesta** | `1741674559775977472` | 880 | 30 variantes, 14 fotos, **sin medidas**. Un bozal mal medido no sujeta o asfixia: sin tabla no se sube |
| 11 | **Collar táctico con asa** | `2609070738301614700` | **3.600** | Sigue sin contorno de cuello. Es el mismo muro que tumbó a los otros 90 collares |

El jersey es el más recuperable: si la tabla aparece en una foto, sube directo
al grupo 1 y llega a tiempo del pico de diciembre.

## GRUPO 4 — Hay que confirmar una cosa antes

| # | Producto | pid | Vol/mes | Qué confirmar |
|---|---|---|---:|---|
| 12 | **Chapa identificativa grabada** | `2605140441451632200` | **4.400** | Es el mayor volumen de toda la cola. Pero lleva **grabado personalizado**: hay que confirmar con CJ si aceptan el texto en el pedido por API y cómo se manda. Si no lo aceptan, no se puede servir |

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
