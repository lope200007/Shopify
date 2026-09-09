# Cada color, su foto — 9 de septiembre de 2026

## Lo que estaba pasando

Ninguna variante del catálogo tenía foto asignada. Ni una, de 39 productos.

Eso significa que quien entraba en la ficha del limpiapatas y elegía «Rosa»
seguía viendo la foto del azul. Elegir un color y que no cambie nada es una
de las fricciones más caras que hay en una ficha de producto: el cliente no
llega a ver lo que va a comprar y se va.

## Lo que se ha hecho

Las fotos por color ya estaban subidas: solo faltaba enlazarlas. Se han
asignado **39 variantes de 7 productos**, emparejando cada variante con la
foto cuyo texto alternativo nombra ese color.

| Producto | Variantes con foto | Colores sin foto |
| --- | ---: | --- |
| `boton-grabable-para-perros` | 4 de 4 | — |
| `botella-paseo-3-en-1` | 4 de 4 | — |
| `limpiapatas-electrico-perro` | 3 de 3 | — |
| `cepillo-autolimpiable-pulverizador` | 3 de 4 | Negro |
| `lanzapelotas-muelle-dispensador` | 2 de 3 | Gris claro |
| `cama-sofa-perro-funda-desmontable` | 18 de 24 | Beige (6 tallas) |
| `chubasquero-para-perro` | 5 de 8 | Amarillo (3 tallas) |

Verificado en la tienda en vivo: las 39 devuelven una URL de imagen, y las 11
que siguen en `null` son exactamente las que se dejaron fuera a propósito.

## Lo que hay que decidir

Quedan **11 variantes que se venden en un color del que no tenemos ninguna
foto**: negro, gris claro, beige y amarillo. Se está ofreciendo un color a
ciegas. Solo hay dos salidas honestas:

1. Pedir a CJ la foto de ese color y subirla.
2. Quitar el color de la lista de opciones.

Dejarlo como está es la tercera, y es la mala: el cliente elige amarillo,
sigue viendo el chubasquero azul, y decide por una foto que no corresponde a
lo que le va a llegar.

## Un defecto aparte, en el chubasquero

Las dos primeras fotos del chubasquero son de la versión **rosa**, que no
vendemos. La foto principal de la ficha enseña un color que no está en el
desplegable. Está en la lista de «color que no vendemos» de la auditoría del
7 de septiembre y sigue sin resolver.

## Cómo se emparejó

No hizo falta mirar las fotos una a una: los textos alternativos del catálogo
están bien escritos y nombran el color («Botella de paseo en verde oscuro»,
«Cama sofá para perro en caqui»). Se buscó el color de cada variante dentro
del texto alternativo de cada foto del producto. Donde la única foto que
mencionaba el color era la de muestrario —«Colores disponibles: rojo y
verde»— no se asignó nada, porque esa foto no enseña una unidad suelta.
