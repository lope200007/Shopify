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
