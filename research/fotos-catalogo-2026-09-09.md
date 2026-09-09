# Auditoría de resolución de las fotos del catálogo — 9 de septiembre de 2026

Salió de una queja concreta y acertada: el perro de la barrera de malla parecía
falso. No lo era: la foto del proveedor mide 480 px y se publicó ampliada a
1200. El fallo estaba en `mejorar-foto.py --revelar`, que llevaba `lado=1600` y
ampliaba todo. Ya corregido: solo reduce, nunca amplía.

## Estado real: 27 fichas de 49 con fotos flojas

Criterio: foto principal por debajo de 900 px, o alguna foto por debajo de 600.

### Corregido sin gastar nada

Dos fichas tenían publicada **la foto más pequeña como principal** teniendo el
proveedor originales más grandes. No hacía falta generar nada, solo reordenar:

| Ficha | Principal antes | Principal ahora |
|---|---:|---:|
| Cama sofá con funda desmontable | 719 px | **1000 px** |
| Toalla de secado rápido | 568 px | **1600 px** |

En la toalla, además, la foto del golden secándose tenía el texto alternativo
equivocado: decía "Tamaños disponibles" y es un perro envuelto en la toalla.
Corregido, que eso lo lee Google y lo lee un lector de pantalla.

Las 21 fotos que se subieron hoy ampliadas están ya rehechas a tamaño nativo.

### Fotos por debajo de 600 px que sobran

Estas no aportan nada y ensucian la galería. Se pueden borrar sin sustituir:

| Ficha | Foto más pequeña |
|---|---:|
| cortapelo-patas-perro | 355 px |
| parque-plegable-perro | 355 px |
| botella-paseo-3-en-1 | 377 px |
| lima-de-unas-electrica-para-perros | 386 px |
| guante-quitapelo-silicona | 389 px |
| escalera-plegable-perro | 400 px |
| cepillo-autolimpiable-pulverizador | 428 px |
| collar-inflable-perro | 468 px |

### Las que sí necesitarían una escena nueva

Aquí el problema no es el tamaño sino la escena: el proveedor no manda ninguna
foto de ambiente decente, o la que manda es un fotograma de vídeo.

1. **barrera-seguridad-perro** — la única de ambiente es de 801 px y las otras
   dos eran fotogramas blandos que se han quitado.
2. **parque-plegable-perro** — principal de 726 px.
3. **chaleco-antiestres-para-perro** — 750 px, sin foto de ambiente.
4. **tentetieso-dispensador-premios** — 750 px.

Para estas cuatro sirve `scripts/fotos/gemini.py`, que manda la foto real y
pide rehacer la escena de alrededor, midiendo después que el producto no se
haya movido de color. Falta la clave de Google Gemini.

## La regla que queda

- No se amplía nunca. Si el proveedor manda 800, se publican 800.
- Por debajo de 700 px vale como secundaria, no como principal ni como foto de
  variante.
- Antes de generar nada, comprobar si el proveedor tiene el original más
  grande. En dos de dos casos revisados hoy, lo tenía.
