#!/usr/bin/env python3
"""Deja una foto cuadrada sin recortar nada del producto.

Dos formas de rellenar, y la elige la propia foto:

  - Si las esquinas son del mismo color -fondo liso de estudio-, se rellena
    con ese color. No se nota.
  - Si no lo son -una foto de detalle, un recorte de dentro de otra imagen-,
    se rellena con la misma foto ampliada y desenfocada detras. Es lo que
    hacen los moviles y queda como una decision, no como un fallo.

  cuadrar.py entrada.jpg salida.jpg [--difuminado]
"""
import sys
import numpy as np
from PIL import Image, ImageFilter

MARGEN = 12          # lado del cuadrado de esquina que se muestrea
TOLERANCIA = 10.0    # cuanto pueden diferir las esquinas para llamarlas lisas


def color_de_fondo(a):
    """Color de las cuatro esquinas, y si son o no el mismo color."""
    m = MARGEN
    esquinas = [a[:m, :m], a[:m, -m:], a[-m:, :m], a[-m:, -m:]]
    medias = np.array([e.reshape(-1, 3).mean(0) for e in esquinas])
    return medias.mean(0), float(np.abs(medias - medias.mean(0)).max())


def cuadrar(ruta, salida, forzar_difuminado=False):
    im = Image.open(ruta).convert('RGB')
    w, h = im.size
    if w == h:
        im.save(salida, quality=94, subsampling=0)
        print(f'{salida}: ya era cuadrada {w}x{h}')
        return

    lado = max(w, h)
    a = np.asarray(im).astype(float)
    color, dispersion = color_de_fondo(a)

    if dispersion <= TOLERANCIA and not forzar_difuminado:
        fondo = Image.new('RGB', (lado, lado), tuple(int(round(c)) for c in color))
        modo = f'color liso R{color[0]:.0f} G{color[1]:.0f} B{color[2]:.0f}'
    else:
        escala = lado / min(w, h)
        grande = im.resize((int(w * escala + 1), int(h * escala + 1)), Image.LANCZOS)
        gw, gh = grande.size
        grande = grande.crop(((gw - lado) // 2, (gh - lado) // 2,
                              (gw - lado) // 2 + lado, (gh - lado) // 2 + lado))
        fondo = grande.filter(ImageFilter.GaussianBlur(lado // 22))
        modo = 'difuminado detras'

    fondo.paste(im, ((lado - w) // 2, (lado - h) // 2))
    fondo.save(salida, quality=94, subsampling=0)
    print(f'{salida}: {w}x{h} -> {lado}x{lado} ({modo})')


if __name__ == '__main__':
    cuadrar(sys.argv[1], sys.argv[2], '--difuminado' in sys.argv)
