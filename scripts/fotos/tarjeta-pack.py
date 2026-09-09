#!/usr/bin/env python3
"""Tarjeta de pack: que llevas y cuanto te ahorras, en una sola imagen.

Para los packs cuyas piezas son fotos de escena y no objetos sobre blanco. Ahi
recortar y montar queda a collage; se ve mejor una ficha ordenada con las tres
fotos reales, su nombre y la cuenta clara.

El ahorro que se enseña es la resta entre la suma de los precios de la propia
tienda y el precio del pack. No es un "precio anterior" tachado: es una
comparacion comprobable en la web, que es lo que permite la directiva Omnibus.

  tarjeta-pack.py salida.jpg "Titulo" "Subtitulo" pvp foto:Nombre:precio ...
"""
import sys

from PIL import Image, ImageDraw, ImageFont

LADO = 1400
CREMA = (251, 247, 241)
TINTA = (35, 38, 31)
SUAVE = (87, 92, 80)
VERDE = (31, 74, 55)
TERRACOTA = (169, 79, 30)
BORDE = (224, 213, 194)

NEGRA = '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'
NORMAL = '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'


def redondear(im, radio):
    mask = Image.new('L', im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, im.size[0] - 1, im.size[1] - 1], radio, fill=255)
    fondo = Image.new('RGB', im.size, CREMA)
    fondo.paste(im, (0, 0), mask)
    return fondo


def cuadrar(im, lado):
    """Recorte cuadrado centrado, sin deformar y sin ampliar mas de lo que hay."""
    w, h = im.size
    corte = min(w, h)
    im = im.crop(((w - corte) // 2, (h - corte) // 2, (w - corte) // 2 + corte, (h - corte) // 2 + corte))
    return im.resize((lado, lado), Image.LANCZOS)


def euros(x):
    return f'{x:.2f}'.replace('.', ',') + ' €'


def main():
    salida, titulo, subtitulo, pvp = sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4])
    piezas = []
    for a in sys.argv[5:]:
        ruta, nombre, precio = a.split(':')
        piezas.append((ruta, nombre, float(precio)))

    im = Image.new('RGB', (LADO, LADO), CREMA)
    d = ImageDraw.Draw(im)

    d.text((90, 92), titulo, font=ImageFont.truetype(NEGRA, 66), fill=TINTA)
    d.text((90, 176), subtitulo, font=ImageFont.truetype(NORMAL, 36), fill=SUAVE)

    y = 268
    alto = 200
    fnom = ImageFont.truetype(NEGRA, 40)
    fpre = ImageFont.truetype(NORMAL, 36)
    for ruta, nombre, precio in piezas:
        foto = redondear(cuadrar(Image.open(ruta).convert('RGB'), alto), 20)
        im.paste(foto, (90, y))
        d.text((90 + alto + 40, y + 62), nombre, font=fnom, fill=TINTA)
        t = euros(precio) + ' por separado'
        d.text((90 + alto + 40, y + 116), t, font=fpre, fill=SUAVE)
        y += alto + 32

    suma = sum(p[2] for p in piezas)
    y += 18
    d.line([(90, y), (LADO - 90, y)], fill=BORDE, width=3)
    y += 40

    f1 = ImageFont.truetype(NORMAL, 40)
    t1 = f'Las tres por separado: {euros(suma)}'
    d.text((90, y), t1, font=f1, fill=SUAVE)
    # una raya sobre la suma, que se entienda de un vistazo
    an = f1.getbbox(t1)[2]
    d.line([(90 + f1.getbbox('Las tres por separado: ')[2], y + 26), (90 + an, y + 26)], fill=SUAVE, width=3)

    y += 66
    f2 = ImageFont.truetype(NEGRA, 78)
    d.text((90, y), f'En pack: {euros(pvp)}', font=f2, fill=VERDE)

    y += 104
    f3 = ImageFont.truetype(NEGRA, 46)
    ahorro = f'Ahorras {euros(suma - pvp)}'
    an3 = f3.getbbox(ahorro)[2]
    d.rounded_rectangle([90, y, 90 + an3 + 56, y + 78], 22, fill=TERRACOTA)
    d.text((118, y + 16), ahorro, font=f3, fill=CREMA)

    im.save(salida, quality=94, subsampling=0)
    print(f'{salida}  {im.size}  suma {euros(suma)}  pack {euros(pvp)}  ahorro {euros(suma - pvp)}')


if __name__ == '__main__':
    if len(sys.argv) < 6:
        sys.exit(__doc__)
    main()
