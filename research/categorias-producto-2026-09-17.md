# 46 productos sin categoría de Shopify (y por qué importaba)

**17 de septiembre de 2026.** Pablo avisó de que en Shopify le salían productos
«sin categorizar». Tenía razón.

## Lo que había

| | |
| --- | ---: |
| Productos activos | 124 |
| Con categoría de producto | 78 |
| **Sin categoría** | **46** |

Los 46 son exactamente los de las últimas tandas: la de invierno, la de gatos
de septiembre y la tercera tanda. Todos tenían `productType` —que es nuestro
texto libre: «Camas y descanso», «Ropa y abrigo»— pero **no la categoría de la
taxonomía estándar de Shopify**, que es un campo distinto y es el que importa
fuera de la tienda.

La causa: se subieron con `productSet` y en las fichas nunca se puso el campo
`category`. No se rompió nada al subirlas, así que no saltó ninguna alarma.

## Por qué importa, y no es cosmético

**El canal de Google es el que se lleva el golpe.** La categoría de Shopify es
lo que se traduce a `google_product_category` en Merchant Center. Sin ella,
Google tiene que adivinar a partir del título, y eso significa:

- productos mal clasificados en Shopping,
- y, en el peor caso, **rechazos en Merchant Center**.

Y aquí está lo relevante: el canal Google & YouTube se instaló el 14 de
septiembre y **los 46 sin categoría estaban publicados en él**. Si aparece
algún rechazo cuando Pablo mire la pantalla de Google, este es el primer
sospechoso, no las fichas.

## Lo que se ha hecho

Se leyó la taxonomía real de Shopify (`taxonomy { categories }`, rama `ap-2`,
productos para mascotas) y se asignó a mano la categoría más específica de cada
uno. Nada de poner a todos el genérico «Productos para mascotas»: cuanto más
concreta, mejor la traduce Google.

Ejemplos del criterio:

| Producto | Categoría asignada |
| --- | --- |
| Botas impermeables | Zapatos para mascotas |
| Jersey de punto | Jerséis para mascotas |
| Sudadera con capucha | Sudaderas con capucha para mascotas |
| Cuello braga | Bufandas para mascotas |
| Fuente de agua para gato | Fuentes de agua |
| Comedero con tapa de sensor | Alimentadores automáticos |
| Comedero elevado | Cuencos elevados |
| Chapa identificativa | Placas identificativas para mascotas |
| Collar con chapa grabada | Collares de identificación personalizados |
| Pajarita con collar | Collares y lazos para mascotas |
| Toallitas de dedo para ojos | Limpiadores de ojos |
| Hamaca colgante de jaula | Accesorios para trasportines y jaulas |
| Escalera de arenero | Escalones y rampas para mascotas |

**46 actualizadas, 0 errores.** Verificado después contra la API:

```
activos 124 · con categoria 124 · sin categoria 0 · borradores sin categoria 0
```

Nota de método: el índice de búsqueda de Shopify tarda un poco en actualizarse.
La primera lectura dio 123 con categoría y 0 sin categoría, que no cuadra. Al
repetirla un minuto después dio 124 y 0. **Si los números no suman, esperar y
releer antes de sacar conclusiones.**

## Para que no vuelva a pasar

Al subir una tanda nueva hay que poner el campo `category` en la ficha, con el
identificador de la taxonomía (`gid://shopify/TaxonomyCategory/ap-2-…`).

Para buscar el identificador de una categoría:

```graphql
{ taxonomy { categories(first: 20, search: "Camas para mascotas") {
    nodes { id fullName } } } }
```

Y para listar toda la rama de mascotas de una vez:

```graphql
{ taxonomy { categories(first: 120,
    descendantsOf: "gid://shopify/TaxonomyCategory/ap-2") {
    nodes { id name } } } }
```

Comprobación rápida de que no queda ninguno suelto:

```graphql
{ productsCount(query: "status:ACTIVE AND NOT category_id:*") { count } }
```

Tiene que dar **0**.
