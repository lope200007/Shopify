---
name: producto-ganador
description: Encontrar, filtrar y subir un producto nuevo a patitascalidas.com. Usar siempre que haya que buscar productos en tendencia, evaluar si un articulo de CJ es vendible, o crear una ficha de producto. Cubre el filtro de porte por volumen, el corte de fotos con texto sobreimpreso, la regla de las tallas en centimetros y el mapa SKU -> vid sin el cual no se puede servir un pedido.
---

# Subir un producto a Patitascalidas

Cuatro filtros en este orden. **Si uno falla, el producto no se sube.** Cada uno
de ellos ya ha matado a un candidato que parecia bueno; los ejemplos son reales.

## 1. Demanda real en Espana, no intuicion

`mcp__OpenRush__research_keywords` con `location: "Spain"`, `language: "Spanish"`,
`mode: "ideas"` y `min_volume`. **No pases `intent`**: colapsa el resultado a una
sola fila.

Mira tres cosas del `trend_12m`, no solo el volumen:

- **Estacionalidad.** `alfombra refrescante` son 720/mes de media pero 2.900 en
  julio y 10 en diciembre. Subirla en septiembre es tirar el trabajo.
- **CPC.** Bajo = nadie puja = barato posicionar. `collar isabelino perro`:
  2.400/mes a 0,09 USD de CPC. Eso es un regalo.
- **Constancia.** Un termino plano todo el ano vende todo el ano.

Cosas con volumen que NO se pueden vender, ya comprobadas: collares
antiparasitarios (`collar seresto` 9.900/mes) son producto veterinario o biocida
regulado; los collares de adiestramiento electricos y antiladridos (5.500/mes
entre los tres) son aversivos y estan restringidos en varias comunidades.

## 2. El porte: lo decide el lado mayor del bulto, no el peso

Antes de medir nada, mira `variantStandard` en el volcado de CJ. Viene en
milimetros: `long=300,width=200,height=30`.

- **Si el lado mayor pasa de unos 600 mm, el producto esta muerto.** Cae en la
  `CJPacket Sensitive Oversize Line` y paga 25-29 EUR de porte pase lo que pase.
  Una colchoneta de 900 g en un bulto de 650 mm paga 25,39 EUR; una cama de
  870 g en un bulto de 350 mm paga 9,80 EUR.
- **Por debajo de eso se cobra por volumen.** Entre dos versiones del mismo
  articulo, elige siempre la que viene **comprimida al vacio o plegada**: la
  misma cama de 40 cm paga 5,05 EUR comprimida (1.800 cm3) y 23,64 EUR sin
  comprimir (21.888 cm3).

Esto se aprendio tarde. Durante semanas se dieron por muertas las camas enteras
—13.200 busquedas/mes— por un solo dato mal leido: se midio una cama sin
comprimir, salio 18,12 EUR, y se archivo la categoria. Estaba viva.

Detalle completo en `research/porte-por-volumen-2026-09-10.md`.

**El umbral de los 600 mm es una alarma, no un muro.** El 10/9/2026 unas alas de
murcielago con un bulto de **605 mm** de lado mayor pagaron **4,04 EUR**, tarifa
normal, no la de sobredimensionado. Por encima de 600 mm hay que **medir**, no
descartar: lo que descarta de entrada sin medir son los 900-1.200 mm, donde el
tunel de gato se murio con 1.160.

## 2 bis. Medirlo, y que sale en euros

Aunque el bulto pase el filtro de arriba, **mide siempre** con `cj.portes()`
sobre el **vid de la variante mas grande**, nunca la mas pequena.

| Producto | Bulto mayor | Peso | Porte |
|---|---:|---:|---:|
| Capucha | — | 63 g | 3,60 € |
| Portabolsas | 11,5 cm | 62 g | 3,59 € |
| Alfombra olfativa | — | 235 g | 5,46 € |
| Cama en donut 40 cm | 30 cm | 230 g | 5,05 € |
| Cama en donut 80 cm | 35 cm | 870 g | 9,80 € |
| Bozal talla 8 | 18 cm | 198 g | 4,82 € |
| **Colchoneta 60x45** | **65 cm** | **900 g** | **25,39 €** |
| **Rampa** | — | **3.520 g** | **38,51 €** |

La colchoneta de 900 g paga cinco veces mas que la cama de 870 g. Es el lado
largo, siempre el lado largo.

Regla practica para el precio: el margen en euros sale mas o menos la mitad del
PVP, porque el porte es casi fijo. Calculo exacto en `scripts/cj/margenes.js`
(`USD=0.92, IVA=1.21, COM=0.0175, FIJO=0.25`).

Si el coste y el porte suben de verdad con la talla, **pon precio por talla**.
El collar inflable va de 19,90 a 24,90 porque la XL cuesta y pesa el triple que
la XS.

## 3. Las fotos: mirarlas UNA A UNA a tamano legible

Nunca subas una foto que no hayas visto grande. Motivos reales por los que se ha
tirado una foto o un producto entero:

- Rotulos en ingles sobreimpresos: *"Little Whale Traction Rope 5m"*,
  *"No Light Version Gray"*, *"AMAZON EXCLUSIVE COLOR"*.
- Una **tabla de tallas en ingles** publicada como si fuera la foto de un color.
- Marca del fabricante encima del producto (*"Nanaki"*, *"Lightning Xiang"*).
- **Falsificaciones**: un abrigo con el logo de The North Face y una parodia de
  GORE-TEX. Eso es infraccion de marca en la UE, con responsabilidad personal.
- Fotos de un color que no se vende, o de un producto distinto al que se vende.

**Antes de retocar una sola foto, busca la marca de agua.** El 10/9/2026 se
retocaron y se subieron a GitHub las diez fotos de una correa de cuero -8,51 $
de coste, 32,90 $ de PVP, 13,67 EUR de margen- antes de ver que las trece
fotos del proveedor llevaban *JINYUDA* repetido en mosaico. Es invisible sobre
el fondo claro y se lee entero encima del cuero, que es donde importa. Se
perdio el trabajo entero.

El mosaico de texto tenue **no se puede quitar**: no es un rotulo en una
esquina, es una capa de baja opacidad sobre todo el producto. Se intento
separarlo por apertura morfologica y por autocorrelacion, y el grano del cuero
se come la senal en los dos casos. Reconstruirlo seria repintar el producto,
que es justo lo que no se hace. **Producto con marca de agua en mosaico =
producto descartado**, por bueno que sea el margen.

Como se mira, en treinta segundos y antes de nada: abre dos fotos, una de
fondo claro y otra del producto oscuro. Si el fondo esta limpio pero el
producto tiene texto tenue repetido, es mosaico. Fuera.

Herramientas, en este orden:

1. `scripts/fotos/borrar-banda.py in out y0 y1` — el rotulo ocupa la fila
   entera. Reconstruye el degradado desde los bordes y le devuelve el grano.
2. `scripts/fotos/borrar-rotulo.py in out x0 y0 x1 y1 y_origen` — el rotulo
   comparte altura con el producto. Copia fondo limpio de las mismas columnas.
   **Deja 10 px de margen alrededor del texto**: el difuminado del borde come
   las filas extremas y deja el texto fantasma.
3. `scripts/fotos/cuadrar.py in out` — cuadra sin recortar.
4. `scripts/fotos/mejorar-foto.py in out --revelar` — revelado final.

**El producto no se toca.** `mejorar-foto.py` imprime el desvio de tono; por
encima de 0,01 hay que parar y mirar. Lo normal es 0,000-0,004.

**Y no se amplia NUNCA.** Una foto de 480 px estirada a 1600 no gana detalle:
lo inventa, y el pelo de un perro se convierte en plastico. Paso en la barrera
de malla -el cliente dijo, con razon, que el perro parecia falso- y resulto
que el fallo estaba en la herramienta: `--revelar` llevaba `lado=1600` y
ampliaba todo. Ya solo reduce. Antes de publicar, comprueba que el ancho de
salida no es mayor que el de entrada.

Si el proveedor manda 800, se publican 800. Shopify sirve el tamano que toca
en cada pantalla, y una foto pequena y nitida se ve mejor que una grande y
derretida. Por debajo de 700 px vale como secundaria, **no como foto de
variante ni como principal**: ahi busca otra toma del proveedor antes que
recortar un trozo de una lamina.

Con pelo de animal: **no toques el fondo**. Tres tecnicas probadas y fallidas:
recorte simple deja halo rosa, descontaminar + erosionar deja al perro
semitransparente, y desplazar el fondo hacia crema le mete tono verde a las
sombras del pelo.

## 4. Tallas en centimetros o no se vende

Rechazados por esto el 10/9/2026, los dos con buen porte y buenas fotos:

- **Cama ortopedica** (`2608270816251620800`), 1.600 busquedas/mes y el CPC mas
  alto del nicho: tallas M, L y XL y ni un centimetro en la descripcion, ni en
  `variantStandard`, ni en ninguna de sus seis fotos.
- **40 collares** revisados leyendo la ficha entera del proveedor y no solo las
  fotos: **cero** publican el contorno de cuello. 9.300 busquedas/mes que siguen
  sin poder cubrirse.

Cuando el proveedor no publica la medida pero **si la publica por variante**
(`Diameter 60cm`, `45x35cm`), se puede dibujar el esquema en espanol con
`scripts/fotos/tarjeta-tallas.py` en vez de subir una tabla en ingles.


Si el ajuste importa (collar, arnes, ropa, bozal, capucha) y el proveedor solo
publica "S, M, L", **el producto no se sube**. Inventarse la tabla es una
devolucion garantizada.

La tabla suele estar donde no la buscas: en `p.description` en crudo (el
inflable la tenia ahi entera) o dentro de una de las fotos. Ningun collar normal
del catalogo de CJ la publica; por eso `collares para perros`, con 3.600/mes,
sigue sin cubrir.

Y si el fabricante lista una talla que no sirve, **no la ofrezcas**: el de
espuma tiene M en su tabla pero no en sus variantes.

### Lee la lista de contenido, no solo el titulo

Una hamaca de ventana de gato a 1,00 $ y 220 g parecia el chollo del dia. Su
`packing list` decia **"Mesh Laundry Cover x1pc"**: era la funda de repuesto
sola, no la hamaca. Se habria vendido un recambio como si fuera el producto.

La buena, del mismo barrido, decia "Skeleton x1, Round tube x2, Cloth cover x1,
Suction cup x4". Esa si es la hamaca entera.

Mira siempre `packing list` en la descripcion antes de medir el porte. Y
desconfia de lo que sea sospechosamente barato dentro de su categoria: casi
siempre es un accesorio, un recambio o una talla suelta.

### El corolario: lo mejor es que no haya talla

La regla de los centimetros se lee como una barrera, pero tambien es una
brujula. Un producto **sin eje de talla** no puede fallar de talla: no hay
devolucion por ajuste, no hay tabla que traducir, no hay que fiarse de que el
proveedor midiera bien.

Los tres de Navidad del 10/9/2026 se eligieron por eso antes que por el margen:
calendario de adviento (una caja), comedero puzzle (una tabla de 34x26 cm) y
mordedor de peluche (tres disenos, mismo tamano). Ninguno tiene talla. Los dos
que se cayeron ese mismo dia -disfraz de Papa Noel y jersey de punto- se
cayeron por S-XL sin centimetros.

Cuando dudes entre dos candidatos con margen parecido, **quedate con el que no
tiene talla**. Y para regalo es todavia mas fuerte: el que regala no sabe las
medidas del animal de otro.

## Crear la ficha

```
productCreate(product: ProductCreateInput!)        # NO ProductInput
  -> productVariantsBulkCreate(strategy: REMOVE_STANDALONE_VARIANT)
       el SKU va en inventoryItem.sku, no suelto
  -> publishablePublish   LOS TRES: Tienda online 365626753372
                          + Shop 365626786140 + TikTok 369532469596
  -> collectionAddProducts
```

`productCreate` deja el producto ACTIVE pero **sin publicar**: da 404 en la web
hasta que se llama a `publishablePublish`. Variantes siempre con
`inventoryPolicy: CONTINUE`, `inventoryItem.tracked: false` y peso en GRAMOS.

Usa el `variantSku` de CJ como SKU de Shopify y guarda el volcado en
`proveedores/cj/`: asi `scripts/cj/mapa.js` resuelve el vid solo. **Verificalo**
con `node scripts/cj/mapa.js fichero.txt` — sin vid no se puede servir el pedido.

## El texto de la ficha

### Nunca prometas envio gratis, y no inventes una especificacion

Dos errores reales del 10/9/2026, los dos mios, los dos en fichas ya publicadas:

1. **Ocho fichas decian «Envio gratis».** El envio de esta tienda cuesta
   **6,99 € y solo es gratis a partir de 55 €**. Prometer gratis y cobrar 6,99
   en el pago es la forma mas rapida de que abandonen el carrito, y ademas es
   informacion de precio enganosa. La frase correcta es: *«El envio cuesta
   6,99 € y es gratis a partir de 55 € de compra.»* Comprueba la tarifa real con
   `deliveryProfiles`, no de memoria.
2. **El cepillo con spray decia «Se carga por USB-C, 5 V. El cable va
   incluido».** El proveedor solo publica «USB power port». Ni el tipo de
   conector, ni el voltaje, ni el cable estaban en ningun sitio: me los invente.
   Si el dato no esta en la ficha del proveedor o en una foto legible, **no se
   escribe**, o se escribe diciendo que no se sabe.

Antes de dar por buena una ficha, relee lo que promete y pregunta de cada frase:
*¿de donde he sacado esto?* Si la respuesta no es «del volcado» o «de la foto
numero tal», fuera.


La voz de la tienda esta en las fichas existentes: frase corta, concreta, sin
adjetivos de folleto. Empieza por el problema del dueno, no por el producto.

Tres cosas que no se negocian:

- **Di tambien lo que el producto NO hace.** El cono de espuma se dobla y un
  perro grande llega igual. La correa extensible es mala idea si el perro tira.
  Esto vende mas, no menos, y evita devoluciones.
- **Nada de promesas medicas.** El proveedor escribe "wound healing" y
  "hematoma"; nosotros describimos la funcion y remitimos al veterinario.
- **Sin precio tachado inventado.** La directiva Omnibus exige que un precio
  anterior sea el mas bajo aplicado en los 30 dias previos.

Enlaza a los productos relacionados que ya existen: es lo que sube el ticket
hasta los 55 € del envio gratis.

## Despues de subirlo

### Los TRES canales, no dos

`productCreate` deja el producto **sin publicar en ningun canal**. Hay que
llamar a `publishablePublish` con los tres:

```
365626753372  Tienda online
365626786140  Shop
369532469596  TikTok
```

El 10/9/2026 aparecieron **16 fichas fuera de TikTok** por publicar solo en dos.
Las viejas si estaban, porque la app de TikTok las publico en bloque al
instalarse; las creadas despues se quedaron invisibles para el canal sin que
nada avisara. Comprueba siempre con `resourcePublicationsV2` despues de subir.


### La coleccion tiene que estar en el menu

Una coleccion inteligente recoge el producto sola por la etiqueta, y eso
enganya: parece que el trabajo esta hecho. El 10/9/2026 `/collections/regalos`
tenia **22 productos y no estaba en el menu principal**, y `/collections/ropa-y-abrigos`
tampoco. Una coleccion a la que no se llega desde la navegacion no la rastrea
Google ni la encuentra el visitante: son 22 fichas trabajadas apuntando a un
pico de 2.900 busquedas en diciembre, invisibles.

Despues de crear o llenar una coleccion, lee el menu
(`menu(id: "gid://shopify/Menu/341834989916")`) y comprueba que esta. Recuerda
que `menuUpdate` **reemplaza la lista entera**: hay que reenviar todos los items.

Y publica la coleccion en los tres canales, igual que el producto.

### El contador miente, la pertenencia no

`collection.productsCount` va con retraso y no es de fiar justo despues de
subir. Para comprobar de verdad si el producto entro donde tocaba, lee
`product.collections`, no el contador de la coleccion.


1. Comprobar la pagina en vivo con `curl -A "Mozilla/5.0 ..."` (sin User-Agent
   de navegador salta el anti-bot con un 429).
2. Anadir el guion a `scripts/video/guiones.json` y generar el vertical con
   `python3 scripts/video/vertical.py scripts/video/guiones.json <nombre>`.
3. Commit con el porte medido y el margen calculado en el mensaje.

### Encender y apagar una temporada

Shopify sabe **publicar** en una fecha y no sabe **despublicar** en una fecha.

`publishablePublish` acepta `publishDate` por canal, y funciona: se guarda y se
activa sola. Pero **solo en el canal Tienda online**. Shop y TikTok descartan la
fecha en silencio -sin `userErrors`- y el recurso se queda sin publicar en ellos
para siempre. Comprueba siempre con:

```
resourcePublicationsV2(first: 5, onlyPublished: false) { nodes { publication { name } isPublished publishDate } }
```

Si solo vuelve un nodo cuando pediste tres canales, los otros dos se perdieron.

Para apagar en una fecha no hay nada nativo: o una app de terceros, o un
disparador externo, o a mano. Y al apagar, **despublica, no borres**: el año
siguiente se vuelve a encender sin rehacer fotos, tabla de tallas ni mapeo de
SKU a vid.

Puesto el 10/9/2026 para Halloween: encendido programado el 1 de octubre en
Tienda online, y dos Routines de aviso para lo que la API no cubre.
