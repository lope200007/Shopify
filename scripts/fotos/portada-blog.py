# -*- coding: utf-8 -*-
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image, ImageDraw
import marca as M
from marca import CREMA, TINTA, SUAVE, VERDE, TERRACOTA, BORDE, BLANCO, f, texto, partir, med

W, H = 1200, 630
SAL = '/home/user/shopify/assets/fotos'


def huella(d, cx, cy, r, color):
    """Huella de perro, dibujada."""
    d.ellipse([cx - r*0.62, cy - r*0.18, cx + r*0.62, cy + r*0.95], fill=color)
    for ang, rr in ((-58, 0.30), (-20, 0.26), (20, 0.26), (58, 0.30)):
        a = math.radians(ang - 90)
        x, y = cx + math.cos(a) * r * 0.78, cy + math.sin(a) * r * 0.80
        d.ellipse([x - r*rr, y - r*rr*1.25, x + r*rr, y + r*rr*1.25], fill=color)


def portada(gorro, titulo, dato, dato_pie, pie, salida, color=VERDE):
    base = Image.new('RGB', (W, H), CREMA)
    d = ImageDraw.Draw(base)

    # bloque de color a la derecha, con el dato
    bx = W - 400
    d.rectangle([bx, 0, W, H], fill=color)
    huella(d, W - 92, H - 88, 62, (255, 255, 255, 40) if False else _mezcla(color, CREMA, 0.16))

    fd = f(96 if len(dato) <= 7 else 66, M.PLAYFAIR)
    texto(d, (bx + 200, 210), dato, fd, BLANCO, 'centro')
    fdp = f(26)
    y = 210 + fd.size + 30
    for ln in partir(dato_pie, fdp, 300)[:3]:
        texto(d, (bx + 200, y), ln, fdp, _mezcla(color, BLANCO, 0.72), 'centro')
        y += int(fdp.size * 1.45)

    x, ancho = 66, bx - 132
    fg = f(23)
    d.rounded_rectangle([x, 62, x + med(gorro, fg)[0] + 38, 62 + fg.size + 22],
                        radius=(fg.size + 22) // 2, fill=color)
    texto(d, (x + 19, 62 + 11), gorro, fg, BLANCO)

    for px in range(56, 28, -2):
        ft = f(px, M.PLAYFAIR)
        ls = partir(titulo, ft, ancho)
        if len(ls) <= 3:
            break
    y = 158
    for ln in ls:
        texto(d, (x, y), ln, ft, TINTA)
        y += int(ft.size * 1.24)

    fp = f(26)
    y += 18
    for ln in partir(pie, fp, ancho)[:2]:
        texto(d, (x, y), ln, fp, SUAVE)
        y += int(fp.size * 1.5)

    d.line([(x, H - 96), (x + 54, H - 96)], fill=color, width=4)
    texto(d, (x, H - 70), 'patitascalidas.com', f(23), color)
    M.guardar(base, os.path.join(SAL, salida))


def _mezcla(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


portada('CUIDADOS', 'Cómo cortar las uñas a un perro sin hacerle daño',
        '2 mm', 'por delante del vaso. Ni uno menos.',
        'Dónde está el vaso, cómo verlo en uña negra y qué hacer si te pasas.',
        'blog-unas-perro.jpg')
portada('PRECIOS 2026', 'Cuánto cuesta la peluquería canina en España',
        '240 €', 'al año, un perro mediano cada dos meses.',
        'Tarifas por tamaño, y las cuatro cosas que sí puedes hacer en casa.',
        'blog-peluqueria-precio.jpg', TERRACOTA)
portada('ESPALDA Y ARTICULACIONES', '¿Rampa o escalera para perros?',
        '×2', 'de largo por cada altura que salva.',
        'Rampa si el problema es la columna. Escalera si es la altura del sofá.',
        'blog-rampa-o-escalera.jpg')
