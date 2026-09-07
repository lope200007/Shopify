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

## Tres comprobaciones mias que dieron falso positivo

Vale la pena dejarlo escrito para no volver a asustarse:

1. `grep '<meta name="description"'` no encontraba nada en la web. **El
   tema imprime las etiquetas meta partidas en varias lineas**, y una
   expresion regular de una sola linea no las coge. Estan todas.
2. `grep 'cdn.shopify.com/s/files'` daba cero imagenes. La tienda sirve las
   imagenes desde **`/cdn/shop/files/`**, no desde ese dominio. Habia 12.

3. Mi script media el `<title>` **sobre el HTML en bruto**, donde el guion
   se escribe `&ndash;`: 7 caracteres que se ven como 1. Contaba 6 de mas en
   cada titulo. Corregido decodificando las entidades antes de medir.

Ninguna de las tres era un fallo de la tienda.

## Otro comportamiento de Shopify que conviene conocer

Cuatro productos devolvian `seo.title: null` despues de guardarlos sin dar
ningun error. No es un fallo: **Shopify no guarda el titulo SEO cuando es
identico al nombre del producto**, porque el titulo por defecto de la pagina
ya es ese. La pagina sale exactamente igual. Comprobado en la web: los
cuatro renderizan el titulo correcto.

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

### RESUELTO: el tema anade " - Prestige" a todos los titulos

`snippets/meta-tags.liquid` hace:

```liquid
{{ page_title }}{%- unless page_title contains shop.name %} &ndash; {{ shop.name }}{% endunless -%}
```

Asi que el titulo real en Google son **11 caracteres mas** que lo escrito en
el campo SEO. El presupuesto util es de **49**, no 60.

Con ese limite no eran 5 los titulos largos: eran **24**. Se han reescrito
los 24 (21 productos y 3 colecciones) mas dos que se quedaron a 61 en la
comprobacion final. **Los 32 productos y las 6 colecciones estan ahora por
debajo de 60 caracteres tal como los ve Google.**

### Imagenes por debajo de 800 px

Unas cuantas fotos de proveedor vienen a 480x480, 394x286, 355x327. Google
Shopping prefiere 800 o mas. **No se han reescalado**: ampliar una imagen
pequena la empeora, no la mejora. Se arregla cambiando la foto de origen,
no con software.

## Verificacion final (39 paginas, una por una)

Script `verif2.py`: descarga cada pagina publica y comprueba HTTP 200,
`<title>` presente y por debajo de 60 caracteres **ya decodificado**, meta
descripcion presente y bajo 155, `og:image` presente, el bloque "Tambien en
pack" en las 12 fichas que lo llevan, y 4 imagenes minimo en los packs.

```
32 productos + 6 colecciones + portada
FALLOS: 0
PENDIENTE DE TI: 1  -> portada sin og:image (ajuste del tema)
```
