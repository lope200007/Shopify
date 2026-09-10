#!/usr/bin/env python3
"""Borra un rotulo sobreimpreso copiando fondo limpio de la misma foto.

A diferencia de borrar-banda.py, aqui el rotulo NO ocupa la fila entera: el
producto esta en la misma altura. Se parchea solo el rectangulo indicado,
copiando un bloque de fondo limpio de las mismas columnas y corrigiendo el
degradado fila a fila, para que se conserve el grano del papel.

  borrar-rotulo.py entrada.jpg salida.jpg x0 y0 x1 y1 y_origen
  borrar-rotulo.py entrada.jpg salida.jpg x0 y0 x1 y1 --liso

Con --liso no se copia de ningun sitio: se rellena con el color del propio
fondo, medido en un anillo alrededor del rectangulo, y se le devuelve el grano
de ese mismo anillo. Es para el caso facil -un rotulo sobre fondo plano de
estudio- donde copiar un bloque de otra fila puede traerse un trozo de
producto sin querer.
"""
import sys
import numpy as np
from PIL import Image

MARGEN = 0.03
PLUMA = 8          # pixeles de difuminado del borde del parche


def fondo_por_fila(a, margen):
    izq = np.median(a[:, :margen], axis=1)
    der = np.median(a[:, -margen:], axis=1)
    return (izq + der) / 2


def relleno_liso(a, x0, y0, x1, y1, margen=26):
    """Color y grano del fondo, medidos en un anillo alrededor del rectangulo."""
    alto, ancho, _ = a.shape
    ax0, ay0 = max(0, x0 - margen), max(0, y0 - margen)
    ax1, ay1 = min(ancho, x1 + margen), min(alto, y1 + margen)
    anillo = a[ay0:ay1, ax0:ax1].reshape(-1, 3)
    dentro = np.zeros((ay1 - ay0, ax1 - ax0), bool)
    dentro[y0 - ay0:y1 - ay0, x0 - ax0:x1 - ax0] = True
    fuera = anillo[~dentro.reshape(-1)]
    color = np.median(fuera, axis=0)
    sigma = float(np.std(fuera - color))
    rng = np.random.default_rng(11)
    forma = (y1 - y0, x1 - x0, 3)
    return color[None, None, :] + rng.normal(0.0, min(sigma, 4.0), forma)


def borrar(ruta, salida, x0, y0, x1, y1, yorig):
    a = np.asarray(Image.open(ruta).convert('RGB')).astype(np.float64)
    alto, ancho, _ = a.shape
    margen = max(4, int(ancho * MARGEN))
    fondo = fondo_por_fila(a, margen)

    h = y1 - y0
    if yorig < 0:
        parche = relleno_liso(a, x0, y0, x1, y1)
    else:
        origen = a[yorig:yorig + h, x0:x1].copy()
        # corrige el degradado vertical: el bloque de origen esta a otra altura
        ajuste = fondo[y0:y0 + h] - fondo[yorig:yorig + h]
        parche = origen + ajuste[:, None, :]

    # mascara con bordes difuminados para que no se vea la costura
    mask = np.zeros((h, x1 - x0))
    mask[PLUMA:-PLUMA, PLUMA:-PLUMA] = 1.0
    from scipy.ndimage import gaussian_filter
    mask = gaussian_filter(mask, PLUMA / 2.0)[:, :, None]

    a[y0:y0 + h, x0:x1] = a[y0:y0 + h, x0:x1] * (1 - mask) + parche * mask
    Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).save(salida, quality=95)
    origen_txt = 'fondo liso del anillo' if yorig < 0 else f'fondo de y={yorig}'
    print(f'{salida}: rotulo {x0},{y0}-{x1},{y1} sustituido por {origen_txt}')


if __name__ == '__main__':
    if len(sys.argv) < 7:
        sys.exit(__doc__)
    args = sys.argv[3:8]
    if '--liso' in sys.argv:
        args = sys.argv[3:7] + ['-1']
    borrar(sys.argv[1], sys.argv[2], *[int(v) for v in args])
