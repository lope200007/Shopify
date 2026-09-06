# Auditoria SEO del catalogo y arreglos

Fecha: 2026-09-06. Guia usada: skill `seo-ecommerce` (checklist de ficha de
producto). Sin DataForSEO, asi que solo la parte on-page: titulos, metas,
imagenes y enlazado interno.

## Estado de partida

Los 32 productos activos tenian ya titulo SEO, meta descripcion y texto alt
en todas las imagenes. Eso no era el problema.

## Lo que si estaba mal, y arreglado

### 1. Los packs tenian UNA sola imagen

Los tres packs nuevos son los productos con mas margen del catalogo
(25,97-28,14 EUR) y entraban a la ficha con una unica foto de conjunto.
La checklist pide **tres imagenes minimo** por producto y tiene razon: en un
pack, el comprador quiere ver las piezas.

Se han anadido a cada pack las fotos de sus tres componentes, reutilizando
las imagenes ya subidas a la tienda (`productCreateMedia` con la URL del
propio CDN). Los tres pasan de 1 a 4 imagenes. El pack de bano y lluvia ya
tenia 5 y no se ha tocado.

### 2. Cinco titulos SEO pasaban de 60 caracteres

Medidos, no estimados:

| Producto | Antes | Ahora |
|---|---|---|
| Barrera enrollable | 69 | 52 |
| Cubremaletero | 65 | 50 |
| Escalera plegable | 63 | 52 |
| Pack comer despacio | 62 | 55 |
| Pack cachorro | 62 | 53 |

La meta de la barrera tambien pasaba (160 de 155): 148 ahora.

### 3. Quince textos alt sin tildes

"Cinturon", "antiestres", "bano", "Boton", "Tamanos", "secandose",
"Mosqueton metalico"... Venian asi del volcado inicial. Corregidos en 7
productos. Importa para el lector de pantalla y para la busqueda de
imagenes en espanol.

### 4. Tres colecciones sin imagen: no habia foto al compartir el enlace

Este es el que mas afecta al plan de Instagram. El tema saca `og:image` de
la imagen de la coleccion; sin ella, compartir el enlace da una tarjeta
gris.

Estaban sin imagen: **Packs y ahorro**, **Casa, coche y paseo** y
**Lluvia y barro**. Ya tienen una, elegida entre las fotos del propio
catalogo. Comprobado en la web: las **seis** colecciones devuelven ahora
`og:image`.

## Un fallo que cometi y corregi

Al enviar `productUpdate` con solo `seo.title`, Shopify **vacio la meta
descripcion** de cuatro productos (pack comer despacio, pack cachorro,
cubremaletero, escalera). El objeto `seo` se reemplaza entero, no se
fusiona. Lo vi en la verificacion posterior y las restaure. Comprobado
despues: los 32 productos activos tienen titulo y meta, ninguna vacia.

**Regla para la proxima vez: `seo` se manda siempre completo, con titulo y
descripcion, aunque solo cambie uno de los dos.**

## Dos comprobaciones mias que dieron falso positivo

Vale la pena dejarlo escrito para no volver a asustarse:

1. `grep '<meta name="description"'` no encontraba nada en la web. **El
   tema imprime las etiquetas meta partidas en varias lineas**, y una
   expresion regular de una sola linea no las coge. Estan todas.
2. `grep 'cdn.shopify.com/s/files'` daba cero imagenes. La tienda sirve las
   imagenes desde **`/cdn/shop/files/`**, no desde ese dominio. Habia 12.

Ninguna de las dos era un fallo de la tienda.

## Lo que queda, y por que no lo puedo hacer yo

### Imagen para compartir de la PORTADA (`og:image`)

Comprobado: la portada **no tiene** `og:image`. Si compartes
`prestige-12657.myshopify.com` en Instagram o WhatsApp, sale tarjeta gris
sin foto.

Sale del ajuste del tema, no de la API, y las escrituras sobre el tema
publicado estan bloqueadas por politica. Lo tienes que poner tu:

> Tienda online > Temas > Personalizar > Configuracion del tema >
> Redes sociales > Imagen para compartir

Recomendada: 1200 x 630 px. Vale la del pack de aseo o la del perro con
chubasquero, que ya estan subidas.

### El tema anade " - Prestige" a todos los titulos

`snippets/meta-tags.liquid` hace:

```liquid
{{ page_title }}{%- unless page_title contains shop.name %} &ndash; {{ shop.name }}{% endunless -%}
```

Asi que el titulo real en Google son **11 caracteres mas** que lo que se
escribe en el campo SEO. El presupuesto util es de unos **49**, no 60.

No se ha reescrito todo el catalogo por esto: Google recorta la
presentacion pero lee el titulo entero, y a menudo quita el sufijo el
solo. Se han arreglado los cinco que se pasaban de largo de verdad. Queda
anotado por si algun dia se toca el tema.

### Imagenes por debajo de 800 px

Unas cuantas fotos de proveedor vienen a 480x480, 394x286, 355x327. Google
Shopping prefiere 800 o mas. **No se han reescalado**: ampliar una imagen
pequena la empeora, no la mejora. Se arregla cambiando la foto de origen,
no con software.
