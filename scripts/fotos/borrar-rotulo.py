#!/usr/bin/env python3
"""Borra un rotulo sobreimpreso copiando fondo limpio de la misma foto.

A diferencia de borrar-banda.py, aqui el rotulo NO ocupa la fila entera: el
producto esta en la misma altura. Se parchea solo el rectangulo indicado,
copiando un bloque de fondo limpio de las mismas columnas y corrigiendo el
degradado fila a fila, para que se conserve el grano del papel.

  borrar-rotulo.py entrada.jpg salida.jpg x0 y0 x1 y1 y_origen
  borrar-rotulo.py entrada.jpg salida.jpg x0 y0 x1 y1 --liso
  borrar-rotulo.py entrada.jpg salida.jpg x0 y0 x1 y1 --degradado

Con --liso no se copia de ningun sitio: se rellena con el color del propio
fondo, medido en un anillo alrededor del rectangulo, y se le devuelve el grano
de ese mismo anillo. Es para el caso facil -un rotulo sobre fondo plano de
estudio- donde copiar un bloque de otra fila puede traerse un trozo de
producto sin querer.

Con --degradado se hace lo mismo pero ajustando un plano al anillo en vez de
un color unico. Un fondo de estudio casi nunca es plano de verdad: tiene una
caida suave de luz. Rellenar con la mediana deja un parche uniforme sobre esa
caida, y aunque el error sea de un solo nivel de gris el ojo lo lee como una
costura rectangular. El plano sigue el degradado y no se nota.
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


def relleno_degradado(a, x0, y0, x1, y1, margen=30):
    """Como relleno_liso, pero ajustando un plano al anillo (sigue el degradado)."""
    alto, ancho, _ = a.shape
    ax0, ay0 = max(0, x0 - margen), max(0, y0 - margen)
    ax1, ay1 = min(ancho, x1 + margen), min(alto, y1 + margen)
    ys, xs = np.mgrid[ay0:ay1, ax0:ax1]
    dentro = np.zeros(ys.shape, bool)
    dentro[y0 - ay0:y1 - ay0, x0 - ax0:x1 - ax0] = True
    fx, fy = xs[~dentro].astype(float), ys[~dentro].astype(float)
    A = np.column_stack([np.ones_like(fx), fx, fy])
    muestra = a[ay0:ay1, ax0:ax1][~dentro]

    gy, gx = np.mgrid[y0:y1, x0:x1]
    B = np.column_stack([np.ones(gx.size), gx.ravel().astype(float), gy.ravel().astype(float)])
    parche = np.empty((y1 - y0, x1 - x0, 3))
    resto = 0.0
    for c in range(3):
        coef, *_ = np.linalg.lstsq(A, muestra[:, c], rcond=None)
        parche[:, :, c] = (B @ coef).reshape(y1 - y0, x1 - x0)
        resto += float(np.std(muestra[:, c] - A @ coef))
    rng = np.random.default_rng(11)
    return parche + rng.normal(0.0, min(resto / 3.0, 4.0), parche.shape)


def borrar(ruta, salida, x0, y0, x1, y1, yorig):
    a = np.asarray(Image.open(ruta).convert('RGB')).astype(np.float64)
    alto, ancho, _ = a.shape
    margen = max(4, int(ancho * MARGEN))
    fondo = fondo_por_fila(a, margen)

    h = y1 - y0
    if yorig == -2:
        parche = relleno_degradado(a, x0, y0, x1, y1)
    elif yorig < 0:
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
    origen_txt = ('degradado ajustado al anillo' if yorig == -2 else
                  'fondo liso del anillo' if yorig < 0 else f'fondo de y={yorig}')
    print(f'{salida}: rotulo {x0},{y0}-{x1},{y1} sustituido por {origen_txt}')


if __name__ == '__main__':
    if len(sys.argv) < 7:
        sys.exit(__doc__)
    args = sys.argv[3:8]
    if '--degradado' in sys.argv:
        args = sys.argv[3:7] + ['-2']
    elif '--liso' in sys.argv:
        args = sys.argv[3:7] + ['-1']
    borrar(sys.argv[1], sys.argv[2], *[int(v) for v in args])
