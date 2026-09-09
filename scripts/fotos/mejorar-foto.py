#!/usr/bin/env python3
"""Mejora una foto del proveedor sin tocar el producto.

La regla, que no se negocia: la imagen se puede rehacer entera —fondo, luz,
encuadre, sombra— pero el producto que sale en ella tiene que ser exactamente
el que le va a llegar al cliente. Ni un tono distinto.

Por eso el script MIDE lo que ha hecho y lo imprime. El desvio de tono se
calcula sobre las proporciones entre canales: si un pixel era el doble de rojo
que de azul, tiene que seguir siendolo aunque cambie el brillo. Por encima de
0,01 hay que parar y mirar: eso ya es un color distinto.

Dos modos, porque las fotos del proveedor no son todas iguales:

  --recortar  Quita el fondo y pone el crema de la marca, con la sombra
              proyectada por la propia silueta. Para las fotos de estudio
              sobre blanco o sobre un color que choca con la tienda.

  --revelar   No toca el fondo. Solo iguala la luz y revela. Para las fotos
              donde el fondo ES el producto: un abrigo reflectante sobre negro
              no se entiende sobre crema, porque lo que se vende es el brillo.

    mejorar-foto.py entrada.jpg salida.jpg --recortar [--plano]
    mejorar-foto.py entrada.jpg salida.jpg --revelar
"""
import importlib.util
import os
import sys

import numpy as np
from PIL import Image, ImageFilter

_ruta = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'montaje-pack.py')
_spec = importlib.util.spec_from_file_location('montaje_pack', _ruta)
mp = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(mp)


def desvio_de_tono(antes, despues, mascara=None):
    """Cuanto se ha movido el COLOR, ignorando el brillo.

    Se comparan las proporciones entre canales. Multiplicar los tres canales
    por el mismo numero no las mueve —eso es cambiar la luz—, pero tocar uno
    solo si, y eso ya es otro color.
    """
    a = np.asarray(antes.convert('RGB')).astype(float)
    b = np.asarray(despues.convert('RGB')).astype(float)
    if a.shape != b.shape:
        b = np.asarray(despues.convert('RGB').resize(antes.size, Image.LANCZOS)).astype(float)
    if mascara is None:
        mascara = a.mean(axis=2) > 25          # fuera el fondo negro
    pa = a[mascara] / np.maximum(a[mascara].sum(1, keepdims=True), 1)
    pb = b[mascara] / np.maximum(b[mascara].sum(1, keepdims=True), 1)
    return float(np.abs(pa - pb).mean())


def recortar_sobre_marca(ruta, salida, lado=1600, ancho=0.74, base=0.88,
                         plano=False, pelo=False):
    """Producto recortado sobre el crema de la marca, con su sombra.

    `pelo=True` para las fotos con un animal dentro. El pelo es lo mas dificil
    de recortar: rembg devuelve un borde de opacidad intermedia de varios
    pixeles, y si ahi se erosiona y se divide por la opacidad para limpiar el
    tinte del fondo, el resultado es un perro semitransparente que se ve por
    dentro. Peor que el halo que se queria quitar.

    Con pelo se hace lo contrario: no se toca el borde. Se compone tal cual
    sobre el crema, de modo que las puntas del pelo se funden con el fondo
    nuevo en vez de con el rosa del estudio. Queda un resto de tinte en las
    puntas, pero es un resto calido sobre un fondo calido y no se ve.
    """
    obj = mp.recortar_plano(ruta) if plano else mp.recortar(ruta)
    if not pelo:
        obj = mp.descontaminar(obj)
    obj = mp.luz(mp.armonizar(obj))
    w = int(lado * ancho)
    h = int(obj.height * w / obj.width)
    tope = int(lado * 0.78)
    if h > tope:
        h, w = tope, int(obj.width * tope / obj.height)
    obj = obj.resize((w, h), Image.LANCZOS)

    lienzo = mp.superficie(lado)
    x, y = (lado - w) // 2, int(lado * base) - h
    s = mp.sombra_silueta(obj)
    capa = Image.new('L', (lado, lado), 0)
    capa.paste(s, (x, y + h - s.height // 2))
    lienzo = Image.composite(Image.new('RGB', (lado, lado), (84, 74, 58)), lienzo, capa)
    lienzo.paste(obj, (x, y), obj)
    return mp.graduar(lienzo)


def recolorear_fondo(ruta, lado=1600, sigma=42.0):
    """Lleva el fondo del estudio al crema de la marca, sin recortar nada.

    Recortar un perro peludo de un fondo de color no sale bien: si se limpia
    el borde, el pelo se transparenta; si no se limpia, queda un halo del
    color viejo. Las dos versiones se ven peor que la foto original.

    Asi que no se recorta. Se desplaza hacia el crema TODO lo que se parece al
    fondo, en proporcion a cuanto se parece. Un pixel de fondo puro se mueve
    entero; uno de la punta de un pelo, que es medio rosa y medio pelo, se
    mueve la mitad; el abrigo azul y el ojo negro no se mueven nada.

    El pelo conserva su forma y sus medios tonos, que es justo lo que se
    perdia recortando, y el rosa desaparece tambien de entre los pelos, que es
    donde delataba el montaje.
    """
    im = Image.open(ruta)
    im.load()
    im = im.convert('RGB')
    a = np.asarray(im).astype(float)

    borde = np.concatenate([a[:14].reshape(-1, 3), a[-14:].reshape(-1, 3),
                            a[:, :14].reshape(-1, 3), a[:, -14:].reshape(-1, 3)])
    fondo = np.median(borde, axis=0)
    crema = np.array(mp.CREMA, dtype=float)

    d = np.linalg.norm(a - fondo, axis=2)
    parecido = np.exp(-(d / sigma) ** 2)[..., None]     # 1 en el fondo, 0 en el objeto
    salida = a + (crema - fondo) * parecido
    return Image.fromarray(np.clip(salida, 0, 255).astype('uint8')), fondo, parecido[..., 0]


def revelar(ruta, salida, lado=1600):
    """Solo luz y revelado. El fondo se queda como esta."""
    im = Image.open(ruta)
    im.load()
    im = im.convert('RGB')
    a = np.asarray(im).astype(float)

    # Igualar la exposicion mirando solo el objeto, no el fondo: en una foto
    # sobre negro el 92 % de los pixeles son fondo y falsearian la medida.
    lum = a.mean(axis=2)
    objeto = lum > max(30, np.percentile(lum, 55))
    if objeto.sum() > 500:
        claro = np.percentile(a[objeto], 92)
        if claro > 8:
            a *= float(np.clip(224.0 / claro, 0.88, 1.16))   # un solo factor

    out = Image.fromarray(np.clip(a, 0, 255).astype('uint8'))
    lonja = max(out.size)
    if lonja != lado:
        k = lado / lonja
        out = out.resize((int(out.width * k), int(out.height * k)), Image.LANCZOS)
    out = out.filter(ImageFilter.UnsharpMask(radius=2.2, percent=52, threshold=4))
    return mp.graduar(out, grano=1.6, vineta=0.04)


if __name__ == '__main__':
    entrada, salida = sys.argv[1], sys.argv[2]
    modo = ('--revelar' if '--revelar' in sys.argv else
            '--fondo' if '--fondo' in sys.argv else '--recortar')
    original = Image.open(entrada); original.load()

    if modo == '--fondo':
        res, fondo, parecido = recolorear_fondo(entrada)
        # el tono se mide SOLO donde no se ha tocado el fondo: el producto
        m = parecido < 0.12
        d = desvio_de_tono(original, res, m)
        print('   fondo del proveedor R%.0f G%.0f B%.0f -> crema de la marca' % tuple(fondo))
    elif modo == '--recortar':
        res = recortar_sobre_marca(entrada, salida, plano='--plano' in sys.argv, pelo='--pelo' in sys.argv)
        # aqui el fondo cambia a proposito, asi que el tono se mide solo sobre
        # el producto: la silueta del recorte
        obj = mp.recortar_plano(entrada) if '--plano' in sys.argv else mp.recortar(entrada)
        antes = obj.convert('RGB')
        limpio = obj if '--pelo' in sys.argv else mp.descontaminar(obj)
        despues = mp.luz(mp.armonizar(limpio)).convert('RGB')
        m = np.asarray(obj)[..., 3] > 200
        d = desvio_de_tono(antes, despues, m)
    else:
        res = revelar(entrada, salida)
        d = desvio_de_tono(original, res)

    res.save(salida, quality=94, subsampling=0)
    aviso = '  <-- REVISAR, el color se ha movido' if d > 0.01 else ''
    print('%-36s %s  desvio de tono %.4f%s' % (os.path.basename(salida), res.size, d, aviso))
