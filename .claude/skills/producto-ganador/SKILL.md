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

## 2. El porte se cobra por VOLUMEN

Es el filtro que mas candidatos mata y el menos obvio. Mide siempre con
`cj.portes()` sobre el **vid de la variante mas grande**, nunca la mas pequena.

| Producto | Peso | Porte |
|---|---:|---:|
| Abrigo | 66 g | 4,32 € |
| Capucha | 63 g | 3,60 € |
| Alfombra olfativa | 235 g | 5,46 € |
| **Cama redonda de 50 cm** | **380 g** | **18,12 €** |
| **Rampa** | **3.520 g** | **38,51 €** |

La cama de 380 gramos paga cuatro veces mas que la alfombra de 235 porque va por
"CJPacket Sensitive Oversize Line", que cobra el bulto. **Busca solo cosas que
viajen planas o que se enrollen**: ropa, collares, correas, panuelos, alfombras.

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

Con pelo de animal: **no toques el fondo**. Tres tecnicas probadas y fallidas:
recorte simple deja halo rosa, descontaminar + erosionar deja al perro
semitransparente, y desplazar el fondo hacia crema le mete tono verde a las
sombras del pelo.

## 4. Tallas en centimetros o no se vende

Si el ajuste importa (collar, arnes, ropa, bozal, capucha) y el proveedor solo
publica "S, M, L", **el producto no se sube**. Inventarse la tabla es una
devolucion garantizada.

La tabla suele estar donde no la buscas: en `p.description` en crudo (el
inflable la tenia ahi entera) o dentro de una de las fotos. Ningun collar normal
del catalogo de CJ la publica; por eso `collares para perros`, con 3.600/mes,
sigue sin cubrir.

Y si el fabricante lista una talla que no sirve, **no la ofrezcas**: el de
espuma tiene M en su tabla pero no en sus variantes.

## Crear la ficha

```
productCreate(product: ProductCreateInput!)        # NO ProductInput
  -> productVariantsBulkCreate(strategy: REMOVE_STANDALONE_VARIANT)
       el SKU va en inventoryItem.sku, no suelto
  -> publishablePublish   Tienda online 365626753372 + Shop 365626786140
  -> collectionAddProducts
```

`productCreate` deja el producto ACTIVE pero **sin publicar**: da 404 en la web
hasta que se llama a `publishablePublish`. Variantes siempre con
`inventoryPolicy: CONTINUE`, `inventoryItem.tracked: false` y peso en GRAMOS.

Usa el `variantSku` de CJ como SKU de Shopify y guarda el volcado en
`proveedores/cj/`: asi `scripts/cj/mapa.js` resuelve el vid solo. **Verificalo**
con `node scripts/cj/mapa.js fichero.txt` — sin vid no se puede servir el pedido.

## El texto de la ficha

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

1. Comprobar la pagina en vivo con `curl -A "Mozilla/5.0 ..."` (sin User-Agent
   de navegador salta el anti-bot con un 429).
2. Anadir el guion a `scripts/video/guiones.json` y generar el vertical con
   `python3 scripts/video/vertical.py scripts/video/guiones.json <nombre>`.
3. Commit con el porte medido y el margen calculado en el mensaje.
