# Los cinco borradores rotos: qué eran, qué se ha hecho

13 de septiembre de 2026.

## El problema

Cinco productos estaban en DRAFT con SKU que no existen en CJ. Se habían
formado pegando un sufijo al SKU de una variante real:
`CJYD240093301AZ` + `-M`, `-L`, `-XL`. CJ no acepta eso: solo acepta el `vid`
interno, y el `vid` se busca por el SKU exacto. **Un pedido de cualquiera de
los cinco no se podía servir.**

Peor: dos de ellos decían en la descripción, a la vista del cliente,
*«Producto basado en el artículo de CJdropshipping SKU CJMY187079002BY»*.
Eso es darle al comprador el nombre del proveedor y el código para buscarlo
más barato.

| Borrador | SKU inventados | Veredicto |
|---|---|---|
| Comedero automático programado | `CJMY205863301AZ-INOX-MARRON` y 5 más | Borrado, **sin sustituto: es imposible** |
| Alfombrilla refrescante | `CJYD240093301AZ-M/-L/-XL` | Rehecho de cero |
| Fuente automática de agua para gato | `CJYD228449801AZ-BLANCO` y 3 más | Borrado, ya había sustituto en catálogo |
| Coche interactivo para gato | `CJMY187079002BY` | Rehecho como pelota rodante |
| Bebedero antivuelco | `CJGY102545413MN` | Rehecho como bebedero portátil 2 en 1 |

El resto del catálogo se comprobó entero: **50 SKU de muestra, uno por
producto, 0 sin mapeo**. El fallo estaba aislado en esos cinco.

## Por qué el comedero automático programable no se puede vender

No es cuestión de encontrar otro proveedor dentro de CJ. Es aritmética:

- Un comedero programable pesa 1,3 kg y lleva motor y batería. Eso lo manda
  a la línea `Sensitive`.
- Porte medido sobre el vid real (`2606051259271606800`): **25,10 €**.
- El mercado español lo vende a 39,90 € (Cecotec) y 55,99 € (MediaMarkt).

A 39,90 €: `39,90/1,21 − 12,44×0,92 − 25,10 − (39,90×0,0175 + 0,25) = −4,51 €`.
Se pierde dinero en cada venta. Para que diera 6 € de margen habría que
venderlo a 53 €, por encima de MediaMarkt y sin marca.

`comedero automatico perros` son 720 búsquedas/mes **planas todo el año**
(de 590 a 1.000, CPC 0,20 $). Es una pena, pero el porte lo mata.

Lo que sí hace ese trabajo y ya está en la tienda es el **dispensador por
gravedad** (`dispensador-gravedad-pienso-agua`, 29,90 / 39,90 €), cuya ficha
ya explica que no es programable.

## Lo que se ha subido

Los tres buscados de cero recorriendo categorías de CJ por `categoryId`
(la búsqueda por texto sigue rota: devuelve lo más nuevo ignorando el término).

### 1. Alfombrilla refrescante de seda de hielo — 14,90 a 39,90 €

`2062095756893974529`, 279 vendedores. **Publica las medidas en cm en la
propia clave de variante**: 40×30, 50×40, 60×50, 70×55, 100×70, 150×100.
Cuatro colores × seis tallas = 24 variantes.

| Talla | Coste | Porte | PVP | Margen |
|---|---:|---:|---:|---:|
| XS 40×30 | 2,27 $ | 3,56 € | 14,90 € | 6,15 € |
| S 50×40 | 2,69 $ | 3,90 € | 17,90 € | 7,86 € |
| M 60×50 | 3,37 $ | 4,42 € | 21,90 € | 9,95 € |
| L 70×55 | 3,65 $ | 4,80 € | 24,90 € | 11,73 € |
| XL 100×70 | 5,00 $ | 5,91 € | 29,90 € | 13,43 € |
| XXL 150×100 | 7,69 $ | 8,17 € | 39,90 € | 16,79 € |

Bulto máximo 380 mm en la XXL: muy por debajo del corte de sobredimensionado.

Es tela de seda de hielo, **no gel**. La ficha lo dice arriba del todo,
porque la diferencia se nota y el que espera gel se lleva un chasco.

**Está fuera de temporada a propósito.** `alfombra refrescante perro` son 90
búsquedas/mes de media pero 390 en junio y 0 en enero. Subirla en septiembre
no vende nada ahora; le da a Google nueve meses para indexarla antes de junio,
que es lo único que no se puede comprar con dinero.

### 2. Bebedero portátil 2 en 1 — 17,90 €

`2408300217501608200`, 1.411 vendedores. 480 ml de agua + 210 ml de pienso,
29 × 9 cm, 175 g. Porte 5,13 €. Margen **7,32 €**.

`bebedero portatil para perros`: 210/mes de media, **plano todo el año**
(70 en enero, 390 en abril-junio), CPC 0,13 $. Ningún producto del catálogo
tenía esa frase en el título: la *Botella de paseo 3 en 1* (22,90 €) se llama
«botella», no «bebedero», y es otro precio.

### 3. Pelota rodante automática para gato — 19,90 €

`1985241812151685121`, 200 vendedores. 7 cm, 69 g, USB-C, tres modos. Porte
3,93 € (línea Liquid Line por la batería). Margen **9,71 €**. Siete colores
con foto propia cada uno.

## Hallazgo: el SKU de CJ se ve en el código fuente de cada ficha

Buscando `"sku"` en el HTML de cualquier página de producto sale el SKU de
CJ en claro:

```
"sku":"CJCT257892301AZ","title":"Rojo"
```

No es cosa del tema: Shopify publica el `sku` en el JSON del producto y en
el endpoint `/products/<handle>.js`. Cualquiera que mire el código fuente
tiene el código exacto para buscar el artículo en el proveedor. Y en cada
ficha salen además los SKU de los productos recomendados.

**En los tres nuevos ya está resuelto**: el SKU de la tienda es propio
(`PTC-HIELO-XS-AZU`, `PTC-BEB2-VER`, `PTC-BOLA-ROJ`) y la traducción a `vid`
vive en `scripts/cj/mapa.js`, que no sale a la web.

**Queda por hacer en los otros 45 productos** (unas 300 variantes). Es
mecánico —renombrar el SKU y añadir la línea al mapa— pero toca todo el
catálogo en producción, así que no se ha hecho sin avisar. Los que ya llevan
código propio (`CJ-CAPA-*`, `CJ-ABRREF-*`, `PACK-*`) están bien, aunque
conviene quitarles el prefijo `CJ`.

## Otro apunte menor

La colección **«Regalos para perro»** se llena con la regla `tag = juguete`,
así que los juguetes de gato (mariposa, pez, guante, y ahora la pelota)
aparecen dentro. O se renombra a «Regalos», o la regla pasa a ser solo
`tag = regalo` y se etiquetan a mano los que valen de regalo.
