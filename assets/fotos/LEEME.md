# Fotos del catálogo corregidas

Fotos del proveedor a las que se les ha quitado el texto incrustado en inglés
o en chino y se ha vuelto a escribir en castellano.

El texto se borra con relleno por contenido (`cv2.inpaint`), no tapándolo con
un rectángulo, así que el fondo —foto, degradado o color plano— queda intacto.
Después se reescribe con Inter y Playfair, las tipografías de la marca, al
doble de resolución para que quede nítido.

Las herramientas están en `scripts/fotos/`.

Cada archivo aquí sustituye a una foto concreta del producto. Se suben a
Shopify sirviéndolas desde este repositorio (es público), lo que evita el
trámite de subida por *staged uploads*.

## Barrera de malla (septiembre 2026)

Las cuatro fotos que tenía la ficha venían del proveedor a 801, 480, 417 y 480
píxeles. A ese tamaño Shopify no puede ampliar y el producto parecía un montaje.

El proveedor tenía tres fotos más, incrustadas en el HTML de su descripción y
fuera de `productImageSet`, que nadie había mirado: son las de más resolución de
todo el lote (750×578 el contenido de la caja, 800×800 el detalle de las
presillas). De ahí sale el juego nuevo de nueve imágenes a 1200 px:

| Archivo | De dónde sale |
| --- | --- |
| `barrera-1-perro-detras.jpg` | foto real del proveedor, perro detrás de la malla |
| `barrera-2-golden.jpg` | foto real del proveedor, golden retriever |
| `barrera-3-contenido.jpg` | foto de la descripción del proveedor + rótulos |
| `barrera-4-pasos.jpg` | montaje de tres recortes + los pasos en castellano |
| `barrera-5-medidas.jpg` | dibujo a escala real (124 × 74) |
| `barrera-6-ganchos.jpg` | dibujo: dónde pega el adhesivo y dónde no |
| `barrera-7-presillas.jpg` | foto de la descripción del proveedor |
| `barrera-8-hueco.jpg` | foto real del proveedor, labrador |
| `barrera-9-plegada.jpg` | foto del proveedor, plegada |

Las tarjetas se generan con `scripts/fotos/barrera.py` sobre `scripts/fotos/marca.py`,
que tiene la paleta y la tipografía de la marca.
