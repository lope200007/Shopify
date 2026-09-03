# Procedencia de cada imagen de la tienda — 3 septiembre 2026

Peticion del usuario: **ninguna imagen inventada**; la de cada ficha
tiene que ser la del proveedor, o un recorte de ella.

Esto documenta de donde sale cada pixel.

## Fotos de producto: TODAS son archivo del proveedor

Origen: fichas publicas de proveedores de AliExpress. Descargadas de
`ae-pic-a1.aliexpress-media.com`, que es el CDN donde el propio proveedor
las publica.

| Producto | Archivo de origen | Que se le hizo |
|---|---|---|
| Comedero, principal | S828d14f955e74d538a9bf82567431eb3a | Recorte del collage |
| Comedero, segunda | S926a76105b584979b653bc2065297c48U | Recorte + escalado |
| Alfombrilla, principal | S4a10d92dfd524fe38914b823ca436af7d | Solo reescalado |
| Alfombrilla, segunda | S7b8ab043274f4f758212f255d55910c5J | Solo reescalado |
| Bola dispensadora | S9827f6405bad41aaa1042a1a59a638e9a | Recorte del margen blanco |
| Manopla de secado | S4636d37ad213424ab10612eb46f7678fQ | Recorte + escalado |

**Lo unico que se ha hecho a cada archivo:**

1. **Recortar.** Las fichas de AliExpress son collages: producto + perro
   + tira de variantes + a veces rotulos. Se recorta para dejar el
   producto.
2. **Escalar** a 1400x1400.
3. **Convertir** de WebP a JPEG.

**Lo que NO se ha hecho:** ni retoque de color, ni borrado de elementos,
ni composicion, ni relleno generativo, ni una sola imagen creada. Los
pixeles del producto son exactamente los del proveedor.

Verificado con una comparativa lado a lado entre el archivo original
descargado de AliExpress y el que esta vivo en el CDN de Shopify.

## Descartadas, y por que

Cuatro candidatas se rechazaron por llevar cosas de otro vendedor
encima:

- "Get your dog moving! Burn off your dog's energy" (rotulo en ingles)
- "Adjustable-opening treat ball" (rotulo en ingles)
- "Pet Bath Towel / Strong water absorption" (rotulo en ingles)
- Marca de agua "LumiChicBoutiqu372986145345"

Eso es lo que da el aspecto de reventa barata.

## Lo unico generado en toda la tienda: 3 cabeceras de coleccion

Las cabeceras de Comederos, Juguetes e Higiene **si** estan hechas por
mi, con Pillow desde codigo: fondo de color, retícula de puntos,
titular y pie. Son tipografia y color, no fotografia.

Son piezas de marca y **nadie compra una cabecera creyendo que es lo que
recibe**. Si el usuario prefiere quitarlas, se sustituyen por una foto
del proveedor o se dejan las colecciones sin cabecera.

## Correccion aplicada al verificar

La comparativa lado a lado destapo un fallo propio: en el comedero azul
y en la manopla, el recorte se habia pegado en un lienzo de 1400 **sin
escalarlo**, asi que el producto salia diminuto rodeado de blanco.
Rehechos ambos escalando el recorte hasta llenar el cuadro.
