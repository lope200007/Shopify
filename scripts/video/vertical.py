#!/usr/bin/env python3
"""Monta un video vertical 1080x1920 para TikTok, Reels y Shorts.

La regla de siempre: la foto del producto se puede mover, ampliar y encuadrar,
pero NO se deforma ni se le cambia el color. El zoom es uniforme -el mismo
factor en alto y ancho- y el recorte es un recorte. Lo que ve la gente en el
video es lo que le llega a casa.

El texto va dentro de la zona segura de TikTok: la aplicacion tapa la franja
de abajo con la descripcion y el lateral derecho con los botones.

  vertical.py guiones.json [nombre]
"""
import json
import os
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ANCHO, ALTO, FPS = 1080, 1920, 30

CREMA = (251, 247, 241)
TINTA = (35, 38, 31)
VERDE = (31, 74, 55)
TERRACOTA = (169, 79, 30)
ARENA = (242, 235, 223)

# Zona segura: TikTok pone la descripcion abajo y los botones a la derecha.
SEGURO_ARRIBA = 210
SEGURO_ABAJO = 420
SEGURO_LADOS = 90

NEGRA = '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'
NORMAL = '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'


def fuente(ruta, tam):
    return ImageFont.truetype(ruta, tam)


def partir(texto, fnt, ancho_max):
    """Parte el texto en lineas que quepan, sin cortar palabras."""
    lineas, actual = [], ''
    for palabra in texto.split():
        prueba = (actual + ' ' + palabra).strip()
        if fnt.getbbox(prueba)[2] <= ancho_max or not actual:
            actual = prueba
        else:
            lineas.append(actual)
            actual = palabra
    if actual:
        lineas.append(actual)
    return lineas


def escribir(d, texto, cy, fnt, color, ancho_max, interlineado=1.18, centrado=True):
    """Escribe un bloque centrado verticalmente en cy. Devuelve su alto."""
    lineas = partir(texto, fnt, ancho_max)
    alto_linea = int((fnt.getbbox('Hg')[3] - fnt.getbbox('Hg')[1]) * interlineado) + 10
    total = alto_linea * len(lineas)
    y = cy - total // 2
    for ln in lineas:
        w = fnt.getbbox(ln)[2]
        x = (ANCHO - w) // 2 if centrado else SEGURO_LADOS
        d.text((x, y), ln, font=fnt, fill=color)
        y += alto_linea
    return total


def encuadrar(im, ancho, alto, zoom=1.0, cx=0.5, cy=0.45):
    """Recorta y escala SIN deformar: un unico factor para alto y ancho."""
    w, h = im.size
    factor = max(ancho / w, alto / h) * zoom
    nueva = im.resize((max(1, int(w * factor)), max(1, int(h * factor))), Image.LANCZOS)
    nw, nh = nueva.size
    x = int((nw - ancho) * cx)
    y = int((nh - alto) * cy)
    x = max(0, min(x, nw - ancho))
    y = max(0, min(y, nh - alto))
    return nueva.crop((x, y, x + ancho, y + alto))


def fondo():
    return Image.new('RGB', (ANCHO, ALTO), CREMA)


def marca(d):
    f = fuente(NEGRA, 34)
    t = 'patitascalidas.com'
    d.text(((ANCHO - f.getbbox(t)[2]) // 2, ALTO - SEGURO_ABAJO + 250), t, font=f, fill=(120, 116, 106))


def cuadro_gancho(texto, t):
    """Pantalla de entrada: solo texto grande sobre crema."""
    im = fondo()
    d = ImageDraw.Draw(im)
    escribir(d, texto, ALTO // 2 - 60, fuente(NEGRA, 92), TINTA, ANCHO - 2 * SEGURO_LADOS)
    # una linea de color que entra de izquierda a derecha
    ancho_linea = int((ANCHO - 2 * SEGURO_LADOS) * min(1.0, t * 1.6))
    d.rectangle([SEGURO_LADOS, ALTO // 2 + 190, SEGURO_LADOS + ancho_linea, ALTO // 2 + 200],
                fill=TERRACOTA)
    marca(d)
    return im


def cuadro_producto(foto, texto, t, cx=0.5, cy=0.45):
    """Foto arriba con zoom lento, texto abajo sobre crema."""
    im = fondo()
    alto_foto = 1180
    zoom = 1.0 + 0.055 * t                      # muy lento: no marea y no recorta de mas
    im.paste(encuadrar(foto, ANCHO, alto_foto, zoom, cx, cy), (0, 0))
    d = ImageDraw.Draw(im)
    d.rectangle([0, alto_foto, ANCHO, alto_foto + 6], fill=ARENA)
    escribir(d, texto, alto_foto + 210, fuente(NEGRA, 74), TINTA, ANCHO - 2 * SEGURO_LADOS)
    marca(d)
    return im


def cuadro_cierre(precio, remate, t):
    im = Image.new('RGB', (ANCHO, ALTO), VERDE)
    d = ImageDraw.Draw(im)
    escribir(d, precio, ALTO // 2 - 170, fuente(NEGRA, 150), CREMA, ANCHO - 2 * SEGURO_LADOS)
    escribir(d, remate, ALTO // 2 + 20, fuente(NORMAL, 56), (226, 219, 205), ANCHO - 2 * SEGURO_LADOS)
    f = fuente(NEGRA, 62)
    t2 = 'patitascalidas.com'
    ancho_caja = f.getbbox(t2)[2] + 80
    x0 = (ANCHO - ancho_caja) // 2
    y0 = ALTO // 2 + 190
    d.rounded_rectangle([x0, y0, x0 + ancho_caja, y0 + 118], 24, fill=CREMA)
    d.text(((ANCHO - f.getbbox(t2)[2]) // 2, y0 + 26), t2, font=f, fill=VERDE)
    return im


def mezclar(a, b, k):
    return Image.fromarray(
        (np.asarray(a).astype(np.float32) * (1 - k) + np.asarray(b).astype(np.float32) * k)
        .astype(np.uint8))


def montar(guion, carpeta_fotos, salida):
    escenas = []
    for e in guion['escenas']:
        if e['tipo'] == 'gancho':
            escenas.append((e['segundos'], lambda t, x=e: cuadro_gancho(x['texto'], t)))
        elif e['tipo'] == 'producto':
            foto = Image.open(os.path.join(carpeta_fotos, e['foto'])).convert('RGB')
            escenas.append((e['segundos'], lambda t, x=e, f=foto: cuadro_producto(
                f, x['texto'], t, x.get('cx', 0.5), x.get('cy', 0.45))))
        else:
            escenas.append((e['segundos'], lambda t, x=e: cuadro_cierre(x['precio'], x['remate'], t)))

    import imageio_ffmpeg
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    proc = subprocess.Popen(
        [ff, '-y', '-loglevel', 'error', '-f', 'rawvideo', '-vcodec', 'rawvideo',
         '-s', f'{ANCHO}x{ALTO}', '-pix_fmt', 'rgb24', '-r', str(FPS), '-i', '-',
         '-an', '-vcodec', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20',
         '-preset', 'medium', '-movflags', '+faststart', salida],
        stdin=subprocess.PIPE)

    FUNDIDO = 0.32
    total = 0
    for i, (segundos, pinta) in enumerate(escenas):
        cuadros = int(segundos * FPS)
        for n in range(cuadros):
            t = n / max(1, cuadros - 1)
            im = pinta(t)
            # fundido con la escena anterior en los primeros cuadros
            if i > 0 and n < int(FUNDIDO * FPS):
                k = n / (FUNDIDO * FPS)
                anterior = escenas[i - 1][1](1.0)
                im = mezclar(anterior, im, k)
            proc.stdin.write(np.asarray(im, dtype=np.uint8).tobytes())
            total += 1
    proc.stdin.close()
    proc.wait()
    print(f'{salida}  {total} cuadros  {total / FPS:.1f} s')


if __name__ == '__main__':
    guiones = json.load(open(sys.argv[1], encoding='utf-8'))
    base = os.path.dirname(os.path.abspath(sys.argv[1]))
    solo = sys.argv[2] if len(sys.argv) > 2 else None
    for g in guiones:
        if solo and g['nombre'] != solo:
            continue
        destino = os.path.join(base, '..', '..', 'assets', 'video', g['nombre'] + '.mp4')
        os.makedirs(os.path.dirname(destino), exist_ok=True)
        montar(g, os.path.join(base, '..', '..', 'assets', 'fotos'), os.path.abspath(destino))
