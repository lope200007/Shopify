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
from PIL import Image, ImageChops, ImageDraw, ImageFilter

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


def armonizar(obj, objetivo=228.0, tope=1.18):
    """Iguala SOLO la exposicion de una pieza. Nunca su color.

    El primer intento tambien corregia la dominante de cada recorte, y salio
    caro: el albornoz verde se volvio menta, la toalla gris se volvio azul
    marino y la banda reflectante, morada. El algoritmo estaba tratando el
    color del producto como si fuera un defecto de la foto.

    El color del producto es informacion, no ruido. Si al cliente le llega una
    toalla gris, en la foto tiene que salir gris. Asi que aqui solo se toca el
    brillo, multiplicando los tres canales por el MISMO numero —lo que no
    puede cambiar el tono de nada— y con un tope del 18 % para que una pieza
    oscura no acabe lavada.
    """
    a = np.asarray(obj).astype(float)
    rgb, alfa = a[..., :3], a[..., 3]
    dentro = alfa > 128
    if dentro.sum() < 50:
        return obj

    claro = np.percentile(rgb[dentro], 92)
    if claro > 8:
        k = float(np.clip(objetivo / claro, 1.0 / tope, tope))
        rgb *= k                                  # un solo factor: el tono no se mueve

    return Image.fromarray(np.clip(np.dstack([rgb, alfa]), 0, 255).astype('uint8'), 'RGBA')


def luz(obj, fuerza=0.11):
    """Una unica direccion de luz para todas las piezas.

    Un degradado suave sobre cada objeto: mas claro arriba a la izquierda, mas
    oscuro abajo a la derecha. Es poco —un 11 %— pero es lo que hace que tres
    objetos fotografiados en tres sitios distintos parezcan iluminados por la
    misma ventana.
    """
    a = np.asarray(obj).astype(float)
    h, w = a.shape[:2]
    y = np.linspace(0, 1, h)[:, None]
    x = np.linspace(0, 1, w)[None, :]
    g = 1.0 + fuerza * (0.5 - (x * 0.45 + y * 0.55))
    a[..., :3] *= g[..., None]
    return Image.fromarray(np.clip(a, 0, 255).astype('uint8'), 'RGBA')


def sombra_silueta(obj, aplastado=0.26, inclinacion=0.42, desenfoque=0.045, fuerza=118):
    """La sombra que proyecta la propia pieza, no una elipse.

    Una elipse debajo de cada objeto es lo que delata un collage: todas las
    sombras iguales, todas simetricas, ninguna con la forma de lo que la
    proyecta. Aqui se coge la silueta real —el canal alfa del recorte—, se
    aplasta contra el suelo y se inclina hacia la derecha, que es a donde
    caeria con la luz puesta arriba a la izquierda.
    """
    alfa = obj.split()[3]
    w, h = alfa.size
    alto = max(6, int(h * aplastado))
    silueta = alfa.resize((w, alto), Image.LANCZOS)

    ancho = w + int(alto * inclinacion) + 2
    lienzo = Image.new('L', (ancho, alto), 0)
    lienzo.paste(silueta, (0, 0))
    # inclinar: cada fila se desplaza segun lo lejos que este del suelo
    lienzo = lienzo.transform((ancho, alto), Image.AFFINE,
                              (1, inclinacion, -inclinacion * alto, 0, 1, 0),
                              resample=Image.BICUBIC)
    lienzo = lienzo.filter(ImageFilter.GaussianBlur(max(2.0, h * desenfoque)))
    return Image.eval(lienzo, lambda v: int(v * fuerza / 255))


def graduar(im, grano=2.1, vineta=0.055):
    """Revelado comun: un solo grano y una sola caida de luz para toda la foto.

    Sin esto quedan tres texturas distintas dentro del mismo cuadro. El grano
    es finisimo y la vineta apenas se ve, pero son las dos cosas que hacen que
    el conjunto se lea como una sola captura y no como un montaje.
    """
    a = np.asarray(im).astype(float)
    h, w = a.shape[:2]

    y = (np.linspace(-1, 1, h)[:, None]) ** 2
    x = (np.linspace(-1, 1, w)[None, :]) ** 2
    a *= (1.0 - vineta * np.clip(x + y, 0, 2) / 2)[..., None]

    ruido = np.random.default_rng(7).normal(0, grano, (h, w, 1))
    a += ruido
    return Image.fromarray(np.clip(a, 0, 255).astype('uint8'))


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
    """Coloca cada pieza donde se le dice y devuelve UNA foto.

    `piezas` es una lista de (ruta, cx, base, ancho) en fraccion del cuadro.
    Las piezas se situan a mano y no en fila: una fila deja el cuadro en una
    banda, con todo a la misma distancia y sin profundidad. Lo grande detras y
    arriba, lo pequeno delante y abajo, y ademas solapandose un poco: que un
    objeto tape a otro es la senal mas fuerte de que estan en el mismo sitio.

    Cuatro pasos hacen el resto del trabajo:
      1. armonizar()  iguala exposicion y dominante de cada pieza
      2. luz()        les pone una unica direccion de luz
      3. sombra_silueta() proyecta la sombra con la forma real de cada objeto
      4. graduar()    revela el conjunto entero de una sola vez
    """
    lienzo = superficie(lado)
    puestas = []
    for ruta, cx, base, ancho in piezas:
        obj = recortar_plano(ruta[:-6]) if ruta.endswith('!plano') else recortar(ruta)
        obj = luz(armonizar(obj))
        w = int(lado * ancho)
        h = int(obj.height * w / obj.width)
        obj = obj.resize((w, h), Image.LANCZOS)
        puestas.append((obj, int(lado * cx - w / 2), int(lado * base) - h))

    # Todas las sombras antes que los objetos, para que la de una pueda caer
    # sobre la de al lado en vez de quedar cada cual en su recuadro.
    capa = Image.new('L', (lado, lado), 0)
    for obj, x, y in puestas:
        s = sombra_silueta(obj)
        trozo = capa.crop((x, y + obj.height - s.height // 2, x + s.width,
                           y + obj.height - s.height // 2 + s.height))
        capa.paste(ImageChops.lighter(trozo, s), (x, y + obj.height - s.height // 2))
    oscuro = Image.new('RGB', (lado, lado), (84, 74, 58))
    lienzo = Image.composite(oscuro, lienzo, capa)

    for obj, x, y in puestas:
        lienzo.paste(obj, (x, y), obj)

    graduar(lienzo).save(salida, quality=94, subsampling=0)
    print('%s  %s' % (os.path.basename(salida), lienzo.size))


if __name__ == '__main__':
    # uso: montaje-pack.py salida.jpg  ruta:cx:base:ancho  ...
    piezas = []
    for arg in sys.argv[2:]:
        r, cx, b, a = arg.rsplit(':', 3)
        piezas.append((r, float(cx), float(b), float(a)))
    montar(piezas, sys.argv[1])
