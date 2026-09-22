# Tendencias de Amazon.es → CJ → tienda — 22 de septiembre de 2026

Pablo pidió: "revisa en internet los productos más vendidos y en tendencia en
este momento, búscalos en mi proveedor y súbelos. Todo en España".

## De dónde salen los datos

- **Amazon.es, "Los más vendidos"**, 16 subcategorías de accesorios de perro y
  gato (entrenamiento, camas, collares, comederos, higiene, juguetes, ropa,
  viaje, puertas; y las de gato), 60 productos por categoría: **900 productos**.
  "Productos del momento" y "Los más regalados" no devuelven nada sin navegador.
- **CJ por API** (`scripts/cj/cj.js`), no por la web: 18 categorías de mascotas
  enteras bajadas (11.300 productos) y filtradas a mano. La búsqueda por texto
  de CJ mezcla ventiladores y ropa de mujer; por categoría sí sirve.
- **Sin volúmenes de Google nuevos**: OpenRush se quedó sin créditos (402) y
  Parallel Search sin cupo. No se recargó nada: es dinero y lo decide Pablo.

Se descartó de entrada lo que no vendemos ni vamos a vender: comida, arena,
antiparasitarios, champús y cremas (cosmética y veterinaria), collares
antiladridos y de adiestramiento (aversivos) y todo lo que pesa más de 1 kg.

## Lo que se midió

Margen = (PVP + 6,99 de envío que paga el cliente)/1,21 − coste − porte −
comisión (1,8 % + 0,25). "En pedido ≥39 €" es el peor caso: el cliente no paga
envío y el artículo carga con su porte entero.

| Producto | PVP | Coste | Porte | Solo | En pedido ≥39 € | Amazon.es | Decisión |
|---|---:|---:|---:|---:|---:|---|---|
| Peluche con latido | 24,90 | 6,44 | 6,70 | 12,39 | 6,74 | 25,09 € | **Subido** |
| Búho que aletea (gato) | 19,90 | 6,86 | 4,31 | 10,32 | 4,66 | 15,99-21,99 € | **Subido** |
| Correa manos libres + riñonera | 19,90 | 5,13 | 6,10 | 10,26 | 4,60 | 16,99-19,97 € | **Subido** |
| Rodillo quitapelos (CJ 1368888013161107456) | 12,90 | 1,35 | 4,32 | 10,16 | 4,51 | 9-17 € | Fuera: fotos malas, marca de agua tenue en una, los "sets" mezclan un guante con marca X-PET |
| Rodillo quitapelos (CJ 1777181071063396352) | — | — | — | — | — | — | Fuera: casi todas las fotos llevan texto en inglés encima |
| Filtros de la fuente (misma ficha de CJ, 5 uds, 1,30 $) | 8,90 | 1,20 | 4,04 | 7,36 | 1,71 | 8-15 € | Pendiente: la única foto es de 562 px y lleva texto en inglés sobre el filtro |
| Collar LED USB de fibra | 11,90 | 1,43 | 4,48 | 9,12 | 3,46 | 8,99-12,99 € | Fuera: Amazon lo vende más barato |
| Cortaúñas | 9,90 | 2,17 | 4,08 | 7,15 | 1,50 | 8,45-9,45 € | Fuera: margen |
| Calcetines antideslizantes x4 | 9,90 | 2,25 | 3,63 | 7,52 | 1,87 | 6,99-9,99 € | Fuera: margen (la tabla en cm sí existe) |
| Traje posoperatorio de gato | 12,90 | 5,19 | 4,14 | 6,50 | 0,85 | 6,99-10,99 € | Fuera: Amazon más barato y tallas sin cm |
| Capa de vampiro (Halloween) | 9,90 | 3,82 | 3,87 | 5,72 | 0,07 | 6,75 € | Fuera: margen |
| Botella para aclarar el pipí | — | — | — | — | — | 6-15 € | CJ no la tiene; no se vende otra cosa como si lo fuera |
| Asiento de coche para perro pequeño | — | — | — | — | — | 19,96 € | Fuera: 1,1-1,9 kg, porte de 13-18 € |

## Los tres que se subieron

| Ficha | SKU | vid de CJ | Stock CJ | Línea |
|---|---|---|---:|---|
| `peluche-con-latido-para-cachorro` | PTC-LATIDO-01 | 1378174768334901248 | 40.000 | Liquid Line, 5-11 días (lleva batería) |
| `buho-que-aletea-para-gato` | PTC-BUHO-01 | 2407140642131614100 | 14.643 | Liquid Line, 5-11 días (lleva batería) |
| `correa-manos-libres-cinturon-rinonera` | PTC-MANOSLIBRES-01 | 3356FEAE-66FE-48D4-B9F4-C7DE427002E3 | 40.000 | CJPacket Ordinary, 4-8 días |

- **Búho**: de los siete pájaros de la ficha de CJ solo se vende el búho gris
  («Picture Style-17cm»). Es el único con fotos reales (en la mano, en la cesta,
  el hueco del mecanismo) y con la medida en una foto (17 cm, 85 g). La variante
  «Sparrow» es en realidad un pato: vender los demás era arriesgarse a mandar el
  pájaro equivocado.
- **Correa**: solo fotos del color gris, que es la única variante. Fuera las que
  llevan «HANDS FREE», «2set» o «3set» sobreimpreso y las de otros colores.
- **Lo que no se sabe y por eso no se promete**: tipo de pila del corazón, si el
  búho suena y cómo se activa, si trae cable USB (la lista de contenido de CJ
  solo dice "1 Cat Toy"; la ficha lo avisa).
- Coste apuntado en Shopify = producto + porte de CJ, como el resto del catálogo.
- 4 canales publicados y comprobados. Colecciones: juguetes-perro, juguetes-gato
  y paseo-perro por etiqueta.

## Lo que falta y es de Pablo

1. **CJ → Products → Store Products → Sync**, para que CJ vea las tres fichas
   nuevas. Después, `node scripts/cj/vincular.js --ejecutar`. Sin eso el mapa de
   `scripts/cj/mapa.js` ya sirve para crear el pedido a mano con el vid.
2. **La fuente de agua no tiene coste apuntado en Shopify.** Es uno de los 93.
