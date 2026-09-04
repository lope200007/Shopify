# SEO y fichas: dos fallos que se veian desde fuera — 4 septiembre 2026

## 1. Todo el SEO firmaba "| Prestige"

Los nueve titulos de SEO (5 productos + 4 colecciones) acababan en
**"| Prestige"**, el nombre que arrastra la tienda de la etapa de bolsos.

En Google eso es lo que se lee:

```
Comedero lento interactivo para perros que comen deprisa | Prestige
```

"Prestige" no dice nada a alguien que busca un comedero para su perro, y
ademas gasta 12 caracteres del titulo, que es justo lo que Google recorta.

**Corregido: fuera el sufijo en los nueve.** Google ya anade el nombre del
sitio por su cuenta cuando le hace falta. Los caracteres liberados se han
usado en palabras que la gente si busca:

| Antes | Ahora |
|---|---|
| Comedero lento interactivo para perros que comen deprisa \| Prestige | Comedero lento para perros que comen deprisa |
| Pack 2 comederos lentos para perro + alfombrilla \| Prestige | Pack: 2 comederos lentos para perro + alfombrilla |
| Alfombrilla antiderrame para comedero de perro \| Prestige | Alfombrilla antiderrame para comedero de perro |
| Bola dispensadora de premios, apertura regulable \| Prestige | Bola dispensadora de premios con apertura regulable |
| Comederos lentos y accesorios para perros \| Prestige | Comederos lentos y alfombrillas para perros |
| Juguetes interactivos y dispensadores \| Prestige | Juguetes interactivos y dispensadores para perros |
| Higiene y cuidado para perros: toallas \| Prestige | Higiene y secado para perros: manoplas y accesorios |

Nota tecnica: la manopla devuelve `seo.title: null` y **esta bien**. El
titulo SEO que le corresponde es identico al del producto, y Shopify no
guarda una sobrescritura redundante: usa el del producto.

## 2. La etiqueta PENDIENTE-FOTOS era publica

Los cinco productos llevaban la etiqueta **`PENDIENTE-FOTOS`**. Era un
recordatorio mio, pero las etiquetas de producto no son privadas: se
exponen por la API de escaparate y algunos temas las pintan en la ficha.

Un cliente leyendo "PENDIENTE-FOTOS" en el producto que se esta planteando
comprar es exactamente la clase de detalle que hace cerrar la pestana.

**Corregido: quitada de los cinco.** El aviso no se pierde, se ha movido al
metacampo `abastecimiento.estado_fotos`, que si es interno.

## Lo que estaba bien y no he tocado

- **Las descripciones de los cinco productos.** Estan bien escritas:
  arrancan del problema real ("si tu perro vacia el cuenco en quince
  segundos, no esta comiendo: esta engullendo"), tienen apartado de
  caracteristicas y, lo que mas importa, un **"Antes de comprar"** que
  avisa de las pegas — que el comedero solo va con pienso seco, que hay
  que elegir la talla de la bola por el tamano del perro. Eso previene
  devoluciones.
- **La plantilla de coleccion.** Titulo, descripcion y rejilla con filtros.
  Sin relleno de plantilla, al contrario que la de producto.

## Lo que sigue mal y no arreglo por mi cuenta

La ficha del pack dice: *"Por separado suman 76,70 €. En pack, 49,90 €. Te
ahorras 26,80 €."* La aritmetica es correcta y los precios de referencia
son los reales de la tienda, asi que cumple el Real Decreto 2/2023.

Pero el ancla es un precio que **ya sabemos que esta 4 veces por encima del
mercado** (Tiendanimal vende el comedero equivalente a 7,95 €). Un ahorro
calculado sobre un precio inflado es tecnicamente legal y practicamente un
descuento falso.

No lo toco porque el arreglo no es reescribir esa frase: es decidir la
estrategia de precios, y eso esta documentado en
`precio-mercado-espana.md` y `seleccion-packs.md` esperando decision.
