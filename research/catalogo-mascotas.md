# Catalogo de mascotas — 3 septiembre 2026

Cinco productos creados en borrador, construidos alrededor del producto
ancla que gano la seleccion de nicho.

| Producto | PVP | Coste | Margen | Peso |
|---|---|---|---|---|
| **Pack: 2 comederos lentos + alfombrilla** | 49,90 | 13,10 | 74% | 0,95 kg |
| Comedero lento interactivo | 29,90 | 4,80 | 84% | 0,35 kg |
| Juguete dispensador de premios | 24,90 | 5,20 | 79% | 0,20 kg |
| Toalla de secado de microfibra | 22,90 | 4,90 | 79% | 0,25 kg |
| Alfombrilla antiderrame | 16,90 | 3,50 | 79% | 0,30 kg |

## Correccion al precio de la investigacion

La investigacion asumia **32,90 EUR** para el comedero suelto, y de ahi
salian los +12,03 de beneficio. Pero en Amazon.es un comedero lento
basico se vende entre 10 y 20 EUR.

Bajado a **29,90**, que sigue siendo alto. **Verificar contra anuncios
reales antes de publicar.** Si el mercado esta en 15-20 EUR, hay que
rehacer el modelo entero: es el supuesto del que cuelga todo lo demas.

## Numeros reales del pack ancla

Calculados con los precios realmente puestos, no con los supuestos.
Juzgando por el primer pedido (contribucion menos CAC):

| Escenario | Contribucion | CAC | Primer pedido |
|---|---|---|---|
| Pack 49,90 + 6,99 de envio | 35,10 | 20,00 | **+15,10** |
| Pack 49,90 con envio gratis | 28,21 | 20,00 | +8,21 |

### El pack queda justo por debajo del umbral, y esta bien asi

El envio es gratis desde **55 EUR**. El pack cuesta **49,90**. Faltan
**5,10 EUR**.

Eso no es un fallo: empuja a anadir una segunda cosa para no pagar
porte, que es exactamente la palanca que identifico la investigacion
("la oferta es la palanca, no el producto"). **No se toca el umbral.**

## Como esta escrito el texto

El comedero lento resuelve un problema real: un perro que engulle traga
aire, y en razas de pecho profundo hay riesgo de torsion gastrica.

**El texto describe el mecanismo pero no promete curar nada.** Las
afirmaciones de salud hacen que Meta rechace los anuncios y exponen a
reclamaciones. Cada ficha lleva su advertencia: "no es un producto
sanitario, consulta al veterinario".

Otras cautelas aplicadas del skill de investigacion:

- **Nada de marcas registradas.** El juguete dispensador se describe de
  forma generica, nunca como "tipo Kong".
- **Nada electrico.** Se descarto la fuente de agua: los productos
  electricos exigen certificacion CE bajo responsabilidad del vendedor,
  tambien en dropshipping.
- **Advertencia de talla** en el juguete: uno demasiado pequeno es
  riesgo de atragantamiento.

## Colecciones creadas y publicadas

Automaticas por etiqueta, se llenan solas al importar mas producto:

| Coleccion | Regla |
|---|---|
| Comederos y bebederos | etiqueta = comedero |
| Juguetes | etiqueta = juguete |
| Higiene y cuidado | etiqueta = higiene |

Publicadas en Tienda online y Shop con `publishablePublish`: crear no es
publicar.

## Pendiente

1. **Las fotos.** Los cinco estan en DRAFT con la etiqueta
   PENDIENTE-FOTOS. Se importan desde Syncee o DSers, ya instaladas.
2. **Verificar el precio del comedero** contra anuncios reales.
3. **Archivar los 30 bolsos** cuando este el catalogo de mascotas vivo.
4. **Rehacer el menu principal**, que todavia apunta a bolsos.

---

# Fotos del proveedor: descargadas, corregidas y subidas

## De donde salen

Fichas reales de proveedores de AliExpress, obtenidas leyendo las paginas
de busqueda. **Corresponden a productos que se pueden pedir**, que es lo
que hace que la foto no mienta. No son imagenes generadas.

## Que se corrigio, y por que

El material de AliExpress viene con el aire de collage que se nota a la
legua. Correcciones aplicadas con Pillow:

1. **Recorte de los collages.** Las fichas mezclan el producto con
   perros, gatos y tiras de variantes. Se recorto para dejar el producto
   como protagonista.
2. **Descartadas las imagenes con rotulos en ingles.** Habia dos con
   texto sobreimpreso ("Adjustable-opening treat ball", "Pet Bath Towel /
   Strong water absorption"). Eso es lo que delata el origen.
3. **Recorte automatico del margen blanco** y reencuadre para que el
   producto ocupe el 88% del cuadro, como marca la guia de fotografia.
4. **Normalizadas** a 1400x1400 JPEG de calidad 92, fondo blanco.
5. **Texto alternativo** escrito en espanol para cada una: SEO y lector
   de pantalla.

## Dos textos corregidos para que digan lo que ensena la foto

**La toalla no era una toalla.** La ficha decia "toalla de microfibra con
bolsillos para las manos". De las tres candidatas, solo una tenia
bolsillos de verdad, y es una **manopla**. Renombrado el producto a
"Manopla de secado de microfibra para perros" y reescrito el texto.

Las otras dos eran toallas planas: usarlas habria dejado el texto
mintiendo sobre una caracteristica principal.

**La alfombrilla gano una medida real.** La foto del proveedor trae
30 x 48 cm impreso. Anadido a la ficha.

## Estado final verificado

| Producto | PVP | Fotos | Publicado |
|---|---|---|---|
| Pack: 2 comederos + alfombrilla | 49,90 | 2 | si |
| Comedero lento interactivo | 29,90 | 2 | si |
| Juguete dispensador | 24,90 | 1 | si |
| Manopla de secado | 22,90 | 1 | si |
| Alfombrilla antiderrame | 16,90 | 2 | si |

Los cinco ACTIVE y publicados en Tienda online y Shop, todos con imagen
de 1400x1400 en el CDN de Shopify y con texto alternativo.

Colecciones: Comederos 3, Juguetes 1, Higiene y cuidado 1.

## Aviso que sigue abierto sobre el precio

Los precios de origen vistos en las fichas del proveedor van de **0,99 a
7,44 dolares**. El comedero concreto elegido esta en **3,79**.

Eso confirma que el coste asumido (4,80 EUR) era generoso, pero refuerza
la duda del PVP: es un articulo de commodity muy barato, y **29,90 EUR
sigue siendo alto** frente a los 10-20 EUR de Amazon.es. Es el supuesto
del que cuelga todo el modelo y hay que contrastarlo antes de gastar en
publicidad.

---

# Segunda pasada de fotos: elegidas por claridad, no por limpieza

Aviso del usuario: las fotos no dejaban claro **que era** el producto.
Tenia razon en dos de los cinco.

## Que fallaba

| Producto | Foto anterior | Problema |
|---|---|---|
| Alfombrilla | Monton de esterillas apiladas | No se entiende que va debajo del comedero |
| Juguete | Cinco piezas de caucho sueltas | No se ve que suelte comida |

Las otras tres (comedero x2, manopla) si comunicaban y se quedan.

## Fotos nuevas

Buscadas con un criterio distinto: **producto en uso**, no producto
aislado.

- **Alfombrilla, principal**: la alfombrilla en el suelo con el comedero
  y el bebedero encima, el pienso caido y las gotas de agua retenidas
  sobre ella. Explica el producto sin una palabra.
- **Alfombrilla, segunda**: en el suelo de madera de una cocina real, con
  los dos cuencos. Da la escala.
- **Juguete**: bola transparente con el pienso visible dentro y cayendo
  por la abertura. Se entiende al instante.

Descartadas cuatro candidatas por llevar rotulos en ingles sobreimpresos
("Get your dog moving!", "Adjustable-opening treat ball") o marca de agua
de otro vendedor ("LumiChicBoutiqu...").

## Dos textos reescritos, porque la foto manda

Las fotos nuevas son de **productos distintos** a las anteriores. Cambiar
la imagen sin cambiar el texto habria dejado la ficha mintiendo:

1. **Alfombrilla**: quitada la medida "30 x 48 cm", que era de la
   esterilla rectangular anterior. La nueva es de silicona con forma
   ondulada. Reescrito el texto sobre lo que hace, no sobre sus cotas.
2. **Juguete**: renombrado de "Juguete dispensador de premios" a **"Bola
   dispensadora de premios"**. Fuera "caucho resistente a la mordida" y
   "bota de forma irregular"; el producto real es una bola transparente
   con **apertura regulable**, que ademas es mejor argumento de venta:
   se empieza facil y se va cerrando segun el perro aprende.

Las cuatro imagenes viejas se borraron de las fichas, incluida la copia
que arrastraba el pack.
