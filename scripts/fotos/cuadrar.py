#!/usr/bin/env python3
"""Deja una foto cuadrada sin recortar el producto.

Rellena arriba y abajo (o a los lados) estirando y desenfocando el borde de la
propia foto. En un fondo liso —una pared, una alfombra— no se nota la costura,
y no se pierde nada de lo que se ve.

  cuadrar.py entrada.jpg salida.jpg
"""
import sys
import numpy as np
from PIL import Image, ImageFilter


def cuadrar(ruta, salida):
    im = Image.open(ruta).convert('RGB')
    w, h = im.size
    if w == h:
        im.save(salida, quality=94, subsampling=0)
        print(f'{salida}: ya era cuadrada {w}x{h}')
        return
    lado = max(w, h)
    a = np.asarray(im).astype(np.uint8)

    if h < lado:                     # falta alto: se estiran las filas extremas
        arriba = (lado - h) // 2
        abajo = lado - h - arriba
        relleno = np.concatenate([
            np.repeat(a[:1], arriba, axis=0), a, np.repeat(a[-1:], abajo, axis=0)])
    else:                            # falta ancho
        izq = (lado - w) // 2
        der = lado - w - izq
        relleno = np.concatenate([
            np.repeat(a[:, :1], izq, axis=1), a, np.repeat(a[:, -1:], der, axis=1)], axis=1)

    base = Image.fromarray(relleno)
    suave = base.filter(ImageFilter.GaussianBlur(18))
    # solo se desenfoca lo añadido; la foto original queda intacta
    mask = Image.new('L', (lado, lado), 255)
    if h < lado:
        mask.paste(0, (0, (lado - h) // 2, lado, (lado - h) // 2 + h))
    else:
        mask.paste(0, ((lado - w) // 2, 0, (lado - w) // 2 + w, lado))
    fin = Image.composite(suave, base, mask)
    fin.save(salida, quality=94, subsampling=0)
    print(f'{salida}: {w}x{h} -> {lado}x{lado}')


if __name__ == '__main__':
    cuadrar(sys.argv[1], sys.argv[2])
