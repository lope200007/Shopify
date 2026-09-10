#!/usr/bin/env python3
"""Borra la pastilla de color que el proveedor pone sobre fondo blanco.

Casi todos los catalogos chinos marcan el color con una pildora de texto en
la esquina de arriba. Como el fondo ahi es blanco puro y el producto empieza
mas abajo, no hace falta reconstruir nada: se localiza lo que no es blanco en
la banda superior, se comprueba que ese bloque NO toca el producto y se pinta
blanco. Si el bloque llega hasta donde empieza el producto, el script se niega
y no toca la foto: mejor descartarla que dejar un parche encima del articulo.

  borrar-pastilla.py entrada.jpg salida.jpg [--banda 0.18] [--holgura 12]
"""
import sys
import numpy as np
from PIL import Image, ImageDraw

BLANCO = 246          # por debajo de esto ya no es fondo
HOLGURA = 12          # pixeles de margen alrededor del rotulo


def filas_con_tinta(g, umbral=BLANCO):
    return (g < umbral).sum(axis=1)


def borrar(ruta, salida, banda=0.18, holgura=HOLGURA):
    im = Image.open(ruta).convert('RGB')
    g = np.asarray(im.convert('L')).astype(float)
    alto, ancho = g.shape
    corte = int(alto * banda)

    tinta = filas_con_tinta(g)
    sup = tinta[:corte]
    if not sup.any():
        im.save(salida, quality=95)
        print(f'{salida}: no habia rotulo, copiada tal cual')
        return 0

    # el rotulo es el bloque de arriba; el producto es el bloque que sigue
    filas = np.nonzero(sup)[0]
    y0, y1 = filas.min(), filas.max()

    # ¿hay fondo limpio entre el rotulo y lo que venga debajo?
    hueco = None
    for y in range(y1 + 1, alto):
        if tinta[y] == 0:
            hueco = y
        elif hueco is not None:
            break
    if hueco is None or hueco - y1 < holgura // 2:
        print(f'{salida}: NO SE TOCA, el rotulo llega hasta el producto', file=sys.stderr)
        return 1

    cols = np.nonzero((g[y0:y1 + 1] < BLANCO).any(axis=0))[0]
    x0, x1 = cols.min(), cols.max()
    caja = [max(0, x0 - holgura), max(0, y0 - holgura),
            min(ancho - 1, x1 + holgura), min(alto - 1, y1 + holgura)]
    ImageDraw.Draw(im).rectangle(caja, fill=(255, 255, 255))
    im.save(salida, quality=95)
    print(f'{salida}: rotulo {caja} pintado de blanco (fondo limpio hasta y={hueco})')
    return 0


if __name__ == '__main__':
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    banda = float(sys.argv[sys.argv.index('--banda') + 1]) if '--banda' in sys.argv else 0.18
    holg = int(sys.argv[sys.argv.index('--holgura') + 1]) if '--holgura' in sys.argv else HOLGURA
    sys.exit(borrar(sys.argv[1], sys.argv[2], banda, holg))
