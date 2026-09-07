# Imagen para compartir de la portada (og:image)

## Como debe ser, y por que

| Regla | Valor | Motivo |
|---|---|---|
| Medidas | **1200 x 630 px** | Es la proporcion 1,91:1 que usan WhatsApp, Facebook, X e Instagram. Otra medida sale recortada |
| Formato | **JPG** | El PNG con transparencia sale con fondo negro en varios clientes |
| Peso | **por debajo de 300 KB** | WhatsApp deja de descargar la vista previa si pesa demasiado |
| Texto | **muy poco y muy grande** | La vista previa se ve a unos 400 px de ancho. Lo que no se lea ahi, no existe |
| Zona segura | lo importante, **centrado** | Algunos clientes recortan por los bordes |
| Fondo | opaco, sin transparencias | Igual que el punto del PNG |

## Que NO poner

- Un logo solo sobre fondo liso: no dice nada y no invita a entrar
- Un collage de muchos productos: a 400 px es una mancha
- Texto pequeno, precios o listas: ilegible en la vista previa
- Una captura de la web: se ve borrosa y con menus cortados

## Que si funciona

Un animal mirando o haciendo algo, con espacio libre para el nombre. En una
tienda de mascotas, la foto de un perro **usando** el producto rinde mas que
el producto solo: se entiende en medio segundo.

## Las dos preparadas

Las dos usan la misma foto (golden retriever lamiendo la alfombrilla), que es
de un producto que vendemos, y las fuentes y colores reales del tema:
Playfair Display, Inter, crema `#FBF7F1` y tinta `#23261F`.

### 1. `portada-compartir-1-marca.jpg` — recomendada
El nombre **Patitascalidas**, la frase de la portada y el
envio gratis sobre el crema de la tienda, con la foto a la derecha. Se lee entera a 400 px y dice quien
eres antes de que abran el enlace.

### 2. `portada-compartir-2-solo-foto.jpg`
Solo la foto, sin texto. Tambien es buena opcion: WhatsApp y Facebook ya
ensenan el titulo y la descripcion **al lado** de la imagen, asi que el texto
dentro puede sobrar. Elige esta si la prefieres mas limpia.

## Donde se sube

No se puede poner por API: es un ajuste del tema y las escrituras sobre el
tema publicado estan bloqueadas.

> Tienda online > Temas > Personalizar > Configuracion del tema >
> Redes sociales > Imagen para compartir

Despues conviene comprobarlo en
`https://developers.facebook.com/tools/debug/` pegando la direccion de la
tienda y pulsando "Scrape Again", que es lo que fuerza a WhatsApp y Facebook
a olvidar la version antigua.

---

# Si prefieres generar la foto con nano banana

## Aviso primero

**No le pidas que escriba el texto en la imagen.** Los modelos de imagen
siguen deformando las palabras, y en espanol con tildes ("Envio",
"Accesorios") falla casi siempre. Pidele **solo la foto, con la mitad
izquierda vacia**, y el texto se pone encima despues con las fuentes reales
del tema.

**Y no le pidas un producto concreto.** Generaria una alfombrilla o una cama
inventadas, distintas de las que vendemos. Para una imagen de tienda vale un
perro a secas; para un producto, la foto del proveedor.

## Ajustes

| Parametro | Valor |
|---|---|
| `aspect_ratio` | `16:9` (es lo mas cercano; luego se recorta a 1200 x 630) |
| `model_tier` | `pro` |
| `resolution` | `2k` o `4k` |
| `n` | `4`, para elegir |

## Prompt (en ingles, que es donde mejor responde)

```
Photorealistic lifestyle photograph of a happy medium-sized dog lying
comfortably on a light oak floor in a bright, modern Spanish apartment.
Warm late-afternoon autumn light coming through a large window on the right.
Calm neutral interior in cream, beige and off-white tones, a plain pale wall
and a hint of a linen sofa softly blurred in the background. The dog sits in
the right third of the frame, looking towards the camera, relaxed and alert,
healthy coat, natural expression. The entire left half of the image is clean
uncluttered empty space, plain wall and floor, softly lit, deliberately left
free for text to be added later. Shot on a 50mm lens at f/2.0, shallow depth
of field, soft natural bokeh, fine detail, natural colours, no colour cast.
Editorial pet-brand photography, warm, calm and premium.
```

## Negative prompt

```
text, letters, words, logo, watermark, signature, caption, distorted anatomy,
extra legs, extra paws, deformed face, malformed eyes, cluttered background,
harsh flash, oversaturated, HDR, cartoon, illustration, 3d render, cgi,
people, human hands, collage, border, frame
```

## Variante de otono, si la prefieres en la calle

Cambia la primera frase por:

```
Photorealistic lifestyle photograph of a happy medium-sized dog standing on a
wet cobbled street in a Spanish town after the rain, soft overcast light,
warm autumn tones, blurred old facades in the background.
```

Manteniendo el resto igual: mitad izquierda vacia, 50mm f/2.0, sin texto.

## Despues

1. Recortar a **1200 x 630** (el 16:9 sale 1200 x 675: sobran 45 px)
2. Guardar en JPG por debajo de 300 KB
3. Subirla en Tienda online > Temas > Personalizar > Configuracion del tema >
   Redes sociales > Imagen para compartir
