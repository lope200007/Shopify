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
Nombre de la tienda, la frase de la portada y el envio gratis sobre el crema
de la tienda, con la foto a la derecha. Se lee entera a 400 px y dice quien
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
