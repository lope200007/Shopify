#!/usr/bin/env python3
"""Monta las piezas de un pack en UNA sola foto.

El problema que resuelve: hasta ahora la foto de un pack era un collage de
rectangulos pegados sobre un fondo crema. Se veian las costuras —cada foto
traia su propio fondo blanco, gris o lila— y lo que llegaba al cliente era
«tres fotos juntas», no «un producto».

Aqui se recorta el fondo de cada pieza con rembg y se colocan las tres sobre
una unica superficie continua, apoyadas en la misma linea de suelo y con su
sombra de contacto. El resultado se lee como una foto de tres objetos encima
de una mesa.

Nada de esto es generado: son las fotos reales del proveedor, recortadas.
Un pack tiene que ensenar lo que llega a casa.
"""
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

CREMA = (251, 247, 241)      # --crema de la marca
LADO = 1600

_sesion = None


def recortar(ruta):
    """Quita el fondo y devuelve la pieza ajustada a su caja."""
    global _sesion
    from rembg import remove, new_session
    if _sesion is None:
        _sesion = new_session('u2net')
    im = Image.open(ruta)
    im.load()
    out = remove(im.convert('RGBA'), session=_sesion)
    caja = out.getbbox()
    return out.crop(caja) if caja else out


def recortar_plano(ruta, tolerancia=26, suavizado=1.4):
    """Recorte para objetos claros sobre fondo blanco liso.

    rembg falla con la alfombrilla de lamer: es gris claro sobre blanco y el
    modelo no la distingue del fondo, asi que solo devuelve la comida de los
    huecos. Aqui no hace falta un modelo. El fondo es de un color plano, y lo
    que hay que quitar es exactamente eso: las manchas de ese color que tocan
    el borde de la foto. Lo de dentro del objeto —un hueco blanco, un reflejo—
    no toca el borde y se queda.
    """
    from scipy import ndimage
    im = Image.open(ruta)
    im.load()
    im = im.convert('RGB')
    a = np.asarray(im).astype(int)

    esquinas = np.concatenate([a[:8, :8].reshape(-1, 3), a[:8, -8:].reshape(-1, 3),
                               a[-8:, :8].reshape(-1, 3), a[-8:, -8:].reshape(-1, 3)])
    fondo = np.median(esquinas, axis=0)
    parecido = np.abs(a - fondo).max(axis=2) <= tolerancia

    etiquetas, n = ndimage.label(parecido)
    del_borde = set(etiquetas[0, :]) | set(etiquetas[-1, :]) | set(etiquetas[:, 0]) | set(etiquetas[:, -1])
    del_borde.discard(0)
    quitar = np.isin(etiquetas, list(del_borde))

    alfa = np.where(quitar, 0, 255).astype('uint8')
    alfa = np.asarray(Image.fromarray(alfa).filter(ImageFilter.GaussianBlur(suavizado)))
    out = Image.fromarray(np.dstack([np.asarray(im), alfa]), 'RGBA')
    caja = out.getbbox()
    return out.crop(caja) if caja else out


def sombra(tam, ancho, opacidad=88):
    """Sombra de contacto: una elipse difuminada bajo el objeto.

    Es lo que hace que las piezas parezcan apoyadas en la misma superficie
    en vez de flotando cada una por su lado. Sin esto el montaje sigue
    leyendose como un collage aunque los fondos coincidan.
    """
    capa = Image.new('L', tam, 0)
    d = ImageDraw.Draw(capa)
    alto = max(10, int(ancho * 0.13))
    cx, cy = tam[0] // 2, tam[1] - alto // 2
    d.ellipse([cx - ancho // 2, cy - alto // 2, cx + ancho // 2, cy + alto // 2],
              fill=opacidad)
    return capa.filter(ImageFilter.GaussianBlur(alto * 0.55))


def superficie(lado):
    """Fondo crema con una caida de luz suave, para que no sea un plano muerto."""
    base = Image.new('RGB', (lado, lado), CREMA)
    y = np.linspace(0, 1, lado)[:, None]
    x = np.linspace(0, 1, lado)[None, :]
    # mas luz arriba a la izquierda, como una ventana fuera de cuadro
    caida = 1.0 - 0.055 * ((x * 0.6 + y * 0.9) / 1.5)
    a = np.asarray(base).astype(float) * caida[..., None]
    return Image.fromarray(np.clip(a, 0, 255).astype('uint8'))


def montar(piezas, salida, lado=LADO):
    """Coloca cada pieza donde se le dice y devuelve una sola foto.

    `piezas` es una lista de (ruta, cx, base, ancho), en fraccion del cuadro:
      cx     centro horizontal
      base   linea donde apoya la pieza
      ancho  ancho de la pieza

    Se colocan a mano y no en fila porque una fila deja el cuadro en una
    banda: lo grande y lo pequeno acaban a la misma distancia y la foto no
    tiene profundidad. Poniendo lo grande detras y arriba, y lo pequeno
    delante y abajo, el ojo lee una mesa con tres cosas encima en vez de tres
    recortes alineados.

    Se dibujan primero todas las sombras y despues todos los objetos, para
    que la sombra de uno pueda caer sobre el de al lado.
    """
    lienzo = superficie(lado)
    puestas = []
    for ruta, cx, base, ancho in piezas:
        if ruta.endswith('!plano'):
            obj = recortar_plano(ruta[:-6])
        else:
            obj = recortar(ruta)
        w = int(lado * ancho)
        h = int(obj.height * w / obj.width)
        obj = obj.resize((w, h), Image.LANCZOS)
        puestas.append((obj, int(lado * cx - w / 2), int(lado * base) - h))

    for obj, x, y in puestas:
        s = sombra((obj.width, obj.height + 46), int(obj.width * 0.78), 96)
        oscuro = Image.new('RGB', s.size, (86, 76, 60))
        lienzo.paste(oscuro, (x, y + obj.height - s.size[1] + 34), s)
    for obj, x, y in puestas:
        lienzo.paste(obj, (x, y), obj)

    lienzo.save(salida, quality=94, subsampling=0)
    print('%s  %s' % (os.path.basename(salida), lienzo.size))


if __name__ == '__main__':
    # uso: montaje-pack.py salida.jpg  ruta:cx:base:ancho  ...
    piezas = []
    for arg in sys.argv[2:]:
        r, cx, b, a = arg.rsplit(':', 3)
        piezas.append((r, float(cx), float(b), float(a)))
    montar(piezas, sys.argv[1])
