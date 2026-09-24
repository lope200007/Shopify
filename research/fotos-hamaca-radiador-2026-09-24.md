# Hamaca de radiador: fotos traducidas (24-09-2026)

Pablo: «corregir el texto en inglés, borrarlo o traducirlo, pero bien».

Cuatro fotos de la ficha (`hamaca-de-radiador-para-gato-estructura-de-metal-se-cuelga-y-se-quita`)
llevaban texto en inglés. Se reemplazó el archivo de cada una con `fileUpdate` (mismo id y
misma posición), y quedan en `assets/tienda/2026-09/hamaca-radiador-*.jpg`.

| Foto (MediaImage) | Antes | Ahora |
|---|---|---|
| 72131630727516 | IN A CHOICE OF COLOURS AVAILABLE · BLACK · GREY · WHITE · FLEECE WHITE | VARIOS COLORES DISPONIBLES · NEGRO · GRIS · BLANCO |
| 72131630661980 | KEEPS YOUR CAT WARM | MANTIENE A TU GATO CALENTITO |
| 72131630694748 | STRONG & DURABLE METAL FRAME | ESTRUCTURA DE METAL RESISTENTE Y DURADERA |
| 72131630793052 | Ficha: Size, 6 viñetas, Material/Frame/Maximum Weight, círculo | Todo en español; ampliada al doble (1036 × 906) para que las letras salgan nítidas |

- **«Fleece white» se quitó, no se tradujo:** no es una variante que se venda. En CJ las
  variantes son White, Black, Grey y **Beige** (`queryByVid`, 24-09).
- Letra Oswald Bold (la de los titulares) y Nunito (la de la ficha), de Google Fonts, con los
  colores medidos en cada foto. Fondo blanco tapado con blanco puro; la pared de la foto
  del gato, con relleno (`cv2.inpaint`).
- Comprobado: descargadas de la tienda después de subirlas, iguales a las preparadas
  (diferencia media de píxel < 1,5, la de volver a comprimir el JPG).
- De paso, las 7 fotos tienen ya texto alternativo real (antes «foto 1…7»).
