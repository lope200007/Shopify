#!/usr/bin/env python3
"""Dibuja una tabla de tallas en español, en centímetros.

Hermana de tarjeta-tallas.py: aquella dibuja circulos a escala para un producto
que se elige por diametro; esta dibuja la tabla de una prenda, que se elige por
contorno. Es la unica forma de publicar la medida cuando el proveedor solo la
trae dentro de una foto en ingles y en pulgadas, que es lo normal.

  tabla-tallas.py salida.jpg "Talla;Pecho;Cuello" "S;44-76 cm;35-60 cm" ...

La primera fila es la cabecera. El pie se pone con --pie "texto".
"""
import sys
from PIL import Image, ImageDraw, ImageFont

FONDO = (250, 249, 247)
TINTA = (38, 38, 40)
SUAVE = (122, 122, 128)
RAYA = (232, 226, 218)
CABECERA = (243, 240, 235)


def fuente(px, negrita=False):
    rutas = ['/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if negrita else ''),
             '/usr/share/fonts/truetype/liberation/LiberationSans%s.ttf' % ('-Bold' if negrita else '-Regular')]
    for r in rutas:
        try:
            return ImageFont.truetype(r, px)
        except OSError:
            continue
    return ImageFont.load_default()


def tabla(salida, filas, titulo='Tabla de tallas', pie=None, ancho=1200):
    cols = len(filas[0])
    f_tit = fuente(46, True)
    f_cab = fuente(30, True)
    f_cel = fuente(32)
    f_pie = fuente(23)

    alto_fila = 78
    y_tabla = 150
    alto = y_tabla + alto_fila * len(filas) + (150 if pie else 90)
    im = Image.new('RGB', (ancho, alto), FONDO)
    d = ImageDraw.Draw(im)
    d.text((ancho // 2, 78), titulo, font=f_tit, fill=TINTA, anchor='mm')

    margen = 60
    util = ancho - margen * 2
    # la primera columna es estrecha (la talla), el resto se reparte
    anchos = [util * 0.18] + [util * 0.82 / (cols - 1)] * (cols - 1)

    for i, fila in enumerate(filas):
        y = y_tabla + i * alto_fila
        if i == 0:
            d.rectangle([margen, y, ancho - margen, y + alto_fila], fill=CABECERA)
        x = margen
        for j, celda in enumerate(fila):
            f = f_cab if i == 0 else f_cel
            color = SUAVE if i == 0 else TINTA
            # el texto no puede invadir la columna de al lado: se encoge hasta caber
            px = 30 if i == 0 else 32
            while px > 15 and d.textlength(celda, font=f) > anchos[j] - 18:
                px -= 1
                f = fuente(px, i == 0)
            d.text((x + anchos[j] / 2, y + alto_fila / 2), celda, font=f, fill=color, anchor='mm')
            x += anchos[j]
        d.line([margen, y + alto_fila, ancho - margen, y + alto_fila], fill=RAYA, width=2)

    if pie:
        yp = y_tabla + alto_fila * len(filas) + 46
        for k, linea in enumerate(pie.split('|')):
            d.text((ancho // 2, yp + k * 34), linea.strip(), font=f_pie, fill=SUAVE, anchor='mm')

    im.save(salida, quality=95)
    print('%s  %d filas' % (salida, len(filas)))


if __name__ == '__main__':
    args = sys.argv[1:]
    pie = None
    if '--pie' in args:
        i = args.index('--pie')
        pie = args[i + 1]
        args = args[:i] + args[i + 2:]
    titulo = 'Tabla de tallas'
    if '--titulo' in args:
        i = args.index('--titulo')
        titulo = args[i + 1]
        args = args[:i] + args[i + 2:]
    salida, filas = args[0], [f.split(';') for f in args[1:]]
    tabla(salida, filas, titulo=titulo, pie=pie)
