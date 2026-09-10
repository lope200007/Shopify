#!/usr/bin/env python3
"""Dibuja un esquema de tallas en español, en centímetros.

Los proveedores chinos casi nunca publican la tabla de medidas en una foto, y
cuando la publican viene en ingles o en pulgadas. Antes que subir una foto con
texto ajeno, o que dejar al comprador sin la medida, se dibuja aqui: circulos
a escala real unos respecto a otros, con el diametro debajo.

  tarjeta-tallas.py salida.jpg "40 cm|Gato o cachorro" "50 cm|Perro pequeno" ...
"""
import sys
from PIL import Image, ImageDraw, ImageFont

FONDO = (250, 249, 247)
TINTA = (38, 38, 40)
SUAVE = (122, 122, 128)
CIRCULO = (232, 226, 218)
BORDE = (206, 197, 186)


def fuente(px, negrita=False):
    rutas = ['/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if negrita else ''),
             '/usr/share/fonts/truetype/liberation/LiberationSans%s.ttf' % ('-Bold' if negrita else '-Regular')]
    for r in rutas:
        try:
            return ImageFont.truetype(r, px)
        except OSError:
            continue
    return ImageFont.load_default()


def tarjeta(salida, filas, ancho=1200, alto=800):
    im = Image.new('RGB', (ancho, alto), FONDO)
    d = ImageDraw.Draw(im)
    f_tit = fuente(44, True)
    f_med = fuente(34, True)
    f_pie = fuente(24)

    d.text((ancho // 2, 62), 'Elige el diámetro', font=f_tit, fill=TINTA, anchor='mm')

    diams = [float(x.split(' ')[0].replace(',', '.')) for x, _ in (r.split('|') for r in filas)]
    mayor = max(diams)
    hueco = ancho / len(filas)
    # el circulo mas grande ocupa el 82 % del hueco, el resto va a escala real
    escala = (hueco * 0.82) / mayor
    base_y = 400

    for i, r in enumerate(filas):
        med, pie = r.split('|')
        dia = float(med.split(' ')[0].replace(',', '.')) * escala
        cx = hueco * (i + 0.5)
        caja = [cx - dia / 2, base_y - dia / 2, cx + dia / 2, base_y + dia / 2]
        d.ellipse(caja, fill=CIRCULO, outline=BORDE, width=3)
        d.ellipse([caja[0] + dia * 0.3, caja[1] + dia * 0.3,
                   caja[2] - dia * 0.3, caja[3] - dia * 0.3], outline=BORDE, width=2)
        d.text((cx, base_y + mayor * escala / 2 + 58), med, font=f_med, fill=TINTA, anchor='mm')
        for k, linea in enumerate(pie.split('/')):
            d.text((cx, base_y + mayor * escala / 2 + 104 + k * 32), linea.strip(),
                   font=f_pie, fill=SUAVE, anchor='mm')

    d.text((ancho // 2, alto - 38), 'Diámetro exterior de la cama, medido en centímetros',
           font=f_pie, fill=SUAVE, anchor='mm')
    im.save(salida, quality=95)
    print(f'{salida}: {len(filas)} tallas, {im.size[0]}x{im.size[1]}')


if __name__ == '__main__':
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    tarjeta(sys.argv[1], sys.argv[2:])
