"""Herramientas para quitar el texto incrustado de las fotos del proveedor
y volver a escribirlo en castellano."""
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

INTER = "/tmp/fuentes/inter.ttf"
PLAYFAIR = "/tmp/fuentes/playfair.ttf"
TINTA = (17, 17, 17)


# ---------- tipografia ----------

def fuente(px, ruta=INTER):
    return ImageFont.truetype(ruta, int(px))


def ancho(txt, f):
    a = f.getbbox(txt)
    return a[2] - a[0]


def ajustar(txt, objetivo, ruta=INTER, lo=6, hi=500):
    """Fuente cuyo texto mide lo mas cerca posible de `objetivo` px sin pasarse."""
    while lo < hi - 1:
        m = (lo + hi) // 2
        if ancho(txt, fuente(m, ruta)) <= objetivo:
            lo = m
        else:
            hi = m
    return fuente(lo, ruta)


def escribir(im, txt, x, y_top, y_bot, f, color=TINTA, anclaje="izq"):
    """Coloca `txt` centrado verticalmente en la banda [y_top, y_bot]."""
    d = ImageDraw.Draw(im)
    a = f.getbbox(txt)
    y = y_top + ((y_bot - y_top) - (a[3] - a[1])) / 2 - a[1]
    if anclaje == "centro":
        x = x - (a[2] - a[0]) / 2
    elif anclaje == "der":
        x = x - (a[2] - a[0])
    d.text((x, y), txt, font=f, fill=color)


def borrar(im, caja, color=(255, 255, 255)):
    ImageDraw.Draw(im).rectangle(caja, fill=color)


# ---------- borrado por relleno de contenido ----------

def quitar(im, cajas, umbral=45, dilatar=5, radio=9):
    """Borra el texto dentro de `cajas` rellenando con el contenido de alrededor.

    Dentro de cada caja marca los pixeles que se alejan del color mediano
    (las letras), engorda la marca y deja que OpenCV reconstruya el fondo.
    Sirve igual sobre color plano que sobre foto o degradado.
    """
    arr = cv2.cvtColor(np.array(im.convert("RGB")), cv2.COLOR_RGB2BGR)
    mask = np.zeros(arr.shape[:2], np.uint8)
    for (a, b, c, d) in cajas:
        a, b, c, d = int(a), int(b), int(c), int(d)
        trozo = arr[b:d, a:c].astype(np.int16)
        med = np.median(trozo.reshape(-1, 3), axis=0)
        dist = np.abs(trozo - med).sum(axis=2)
        mask[b:d, a:c] = (dist > umbral).astype(np.uint8) * 255
    if dilatar:
        k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (dilatar, dilatar))
        mask = cv2.dilate(mask, k)
    out = cv2.inpaint(arr, mask, radio, cv2.INPAINT_TELEA)
    return Image.fromarray(cv2.cvtColor(out, cv2.COLOR_BGR2RGB))


def bandas(im, caja, umbral=120, claro=False, minimo=4):
    """Devuelve las bandas horizontales con texto dentro de `caja`."""
    g = im.convert("L")
    a, b, c, d = caja
    px = g.load()
    res, ini, x0, x1 = [], None, 0, 0
    for y in range(b, d):
        hit = [x for x in range(a, c)
               if (px[x, y] > umbral if claro else px[x, y] < umbral)]
        if hit:
            if ini is None:
                ini, x0, x1 = y, min(hit), max(hit)
            else:
                x0, x1 = min(x0, min(hit)), max(x1, max(hit))
        elif ini is not None:
            if y - ini >= minimo:
                res.append((ini, y - 1, x0, x1))
            ini = None
    if ini is not None and d - ini >= minimo:
        res.append((ini, d - 1, x0, x1))
    return res
