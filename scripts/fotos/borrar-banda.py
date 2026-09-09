#!/usr/bin/env python3
"""Borra una banda de texto sobreimpreso sin tocar el producto.

La banda esta sobre fondo liso (degradado suave). Se reconstruye fila a fila
interpolando el color real de los bordes izquierdo y derecho de esa misma fila,
que estan siempre fuera del texto. No se mueve ni un pixel del producto.

  borrar-banda.py entrada.jpg salida.jpg y0 y1
"""
import sys
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter

MARGEN = 0.03      # fraccion de ancho que se usa como muestra de fondo
DIFUMINA = 6       # filas de transicion arriba y abajo del parche


def color_fondo(fila, margen):
    """Color de fondo a izquierda y derecha de una fila, robusto a ruido."""
    izq = np.median(fila[:margen], axis=0)
    der = np.median(fila[-margen:], axis=0)
    return izq, der


def borrar(ruta, salida, y0, y1):
    im = Image.open(ruta).convert('RGB')
    a = np.asarray(im).astype(np.float64)
    alto, ancho, _ = a.shape
    margen = max(4, int(ancho * MARGEN))
    rampa = np.linspace(0.0, 1.0, ancho)[:, None]

    parche = a.copy()
    for y in range(y0, y1 + 1):
        izq, der = color_fondo(a[y], margen)
        parche[y] = izq[None, :] * (1 - rampa) + der[None, :] * rampa

    # textura: un parche liso canta al lado del grano del papel. Se copia el
    # relieve de fondo limpio de la propia foto (arriba de la banda), espejado
    # tantas veces como haga falta, y se suma al degradado reconstruido.
    limpio = a[:max(y0 - 2, 1)]
    if limpio.shape[0] >= 8:
        relieve = limpio - gaussian_filter(limpio, (10, 10, 0))
        tira = relieve
        while tira.shape[0] < (y1 - y0 + 1):
            tira = np.concatenate([tira, tira[::-1]], axis=0)
        parche[y0:y1 + 1] += tira[:y1 - y0 + 1]

    # mezcla con transicion suave para que no se vea el corte
    peso = np.zeros(alto)
    peso[y0:y1 + 1] = 1.0
    for i in range(DIFUMINA):
        f = (i + 1) / (DIFUMINA + 1)
        if y0 - 1 - i >= 0:
            peso[y0 - 1 - i] = 1 - f
        if y1 + 1 + i < alto:
            peso[y1 + 1 + i] = 1 - f
    peso = peso[:, None, None]
    fin = a * (1 - peso) + parche * peso

    Image.fromarray(np.clip(fin, 0, 255).astype(np.uint8)).save(salida, quality=95)

    # verificacion: cuantas filas siguen teniendo algo distinto del fondo
    b = np.asarray(Image.open(salida).convert('RGB')).astype(np.float64)
    sucias = 0
    for y in range(max(0, y0 - DIFUMINA), min(alto, y1 + DIFUMINA + 1)):
        izq, der = color_fondo(b[y], margen)
        fondo = (izq + der) / 2
        if (np.abs(b[y] - fondo).max(1) > 28).mean() > 0.002:
            sucias += 1
    print(f'{salida}: filas {y0}-{y1} reconstruidas, {sucias} filas aun sucias')
    return sucias


if __name__ == '__main__':
    if len(sys.argv) != 5:
        sys.exit(__doc__)
    sys.exit(1 if borrar(sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])) else 0)
