#!/usr/bin/env python3
"""Borra un rotulo sobreimpreso copiando fondo limpio de la misma foto.

A diferencia de borrar-banda.py, aqui el rotulo NO ocupa la fila entera: el
producto esta en la misma altura. Se parchea solo el rectangulo indicado,
copiando un bloque de fondo limpio de las mismas columnas y corrigiendo el
degradado fila a fila, para que se conserve el grano del papel.

  borrar-rotulo.py entrada.jpg salida.jpg x0 y0 x1 y1 y_origen
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


def borrar(ruta, salida, x0, y0, x1, y1, yorig):
    a = np.asarray(Image.open(ruta).convert('RGB')).astype(np.float64)
    alto, ancho, _ = a.shape
    margen = max(4, int(ancho * MARGEN))
    fondo = fondo_por_fila(a, margen)

    h = y1 - y0
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
    print(f'{salida}: rotulo {x0},{y0}-{x1},{y1} sustituido por fondo de y={yorig}')


if __name__ == '__main__':
    if len(sys.argv) != 8:
        sys.exit(__doc__)
    borrar(sys.argv[1], sys.argv[2], *[int(v) for v in sys.argv[3:8]])
