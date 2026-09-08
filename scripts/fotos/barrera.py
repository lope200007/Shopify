# -*- coding: utf-8 -*-
import os, sys, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
# Descarga previa: las 9 fotos de productImageSet y las 3 de la descripcion de
# proveedores/cj/CJJJCWGY00196.json, guardadas como bar00..bar08 y desc-*.
from PIL import Image, ImageDraw, ImageFilter
from marca import *

D = os.environ.get("ORIGINALES", "/tmp/fotos-proveedor/barrera")  # fotos del proveedor
SAL = "/home/user/shopify/assets/fotos"


def ab(n):
    im = Image.open(os.path.join(D, n))
    if im.mode == "RGBA":                       # los PNG del proveedor van sobre crema
        fondo = Image.new("RGB", im.size, CREMA)
        fondo.paste(im, mask=im.split()[-1])
        return fondo
    return im.convert("RGB")


def cuadrar(im, centro=(0.5, 0.5)):
    """Recorta al cuadrado mayor posible alrededor de un punto."""
    l = min(im.size)
    cx = int(centro[0] * im.width)
    cy = int(centro[1] * im.height)
    x0 = max(0, min(im.width - l, cx - l // 2))
    y0 = max(0, min(im.height - l, cy - l // 2))
    return im.crop((x0, y0, x0 + l, y0 + l))


def marco(base, caja, grosor=2):
    ImageDraw.Draw(base).rectangle(caja, outline=BORDE, width=grosor)


# ---------------------------------------------------------------- foto + pie
def foto_con_pie(src, pie, salida, recorte=None, lado_foto=None, con_marco=True):
    im = ab(src)
    if recorte:
        im = im.crop(recorte)
    base = lienzo()
    d = ImageDraw.Draw(base)
    alto_pie = 152
    caja = (86, 92, L - 86, L - alto_pie)
    if lado_foto:
        cx, cy = L // 2, (92 + L - alto_pie) // 2
        caja = (cx - lado_foto // 2, cy - lado_foto // 2, cx + lado_foto // 2, cy + lado_foto // 2)
    r = pegar_centrado(base, im, caja)
    if con_marco:
        marco(base, (r[0] - 1, r[1] - 1, r[2], r[3]))
    parrafo(d, L // 2, L - alto_pie + 42, pie, f(31), L - 200, SUAVE, 1.45, "centro")
    guardar(base, os.path.join(SAL, salida))


# ---------------------------------------------------------------- 3 contenido
def contenido():
    base = lienzo()
    d = ImageDraw.Draw(base)
    texto(d, (L // 2, 84), "Lo que viene en la caja", f(60, PLAYFAIR), TINTA, "centro")

    foto = ab("desc-4c29f918.jpg").crop((10, 5, 745, 560))
    r = pegar_centrado(base, foto, (70, 200, L - 70, 200 + 620))
    marco(base, (r[0] - 1, r[1] - 1, r[2], r[3]))

    esc = (r[2] - r[0]) / 735.0
    px = lambda x, y: (r[0] + (x - 10) * esc, r[1] + (y - 5) * esc)

    fn = f(38)
    for n, (ox, oy) in [("1", (215, 300)), ("2", (525, 285)), ("3", (683, 300))]:
        cx, cy = px(ox, oy)
        rr = 34
        d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=TERRACOTA, outline=CREMA, width=4)
        texto(d, (cx, cy - fn.size * 0.36), n, fn, BLANCO, "centro")

    # leyenda: tres columnas repartidas midiendo el texto de verdad
    items = [("1", "La malla plegable"), ("2", "4 ganchos adhesivos"), ("3", "2 varillas de acero")]
    fl = f(30)
    rr = 19
    anchos = [rr * 2 + 14 + med(t, fl)[0] for _, t in items]
    hueco = (L - 150 - sum(anchos)) / (len(items) - 1)
    x = 75
    y = r[3] + 54
    for (n, t), w in zip(items, anchos):
        d.ellipse([x, y, x + rr * 2, y + rr * 2], fill=TERRACOTA)
        texto(d, (x + rr, y + rr - f(24).size * 0.36), n, f(24), BLANCO, "centro")
        texto(d, (x + rr * 2 + 14, y + 7), t, fl, TINTA)
        x += w + hueco
    texto(d, (L // 2, y + 82), "Nada de tornillos, nada de taladro.", f(30), SUAVE, "centro")
    guardar(base, os.path.join(SAL, "barrera-3-contenido.jpg"))


# ---------------------------------------------------------------- 4 pasos
def pasos():
    base = lienzo()
    d = ImageDraw.Draw(base)
    texto(d, (L // 2, 76), "Se pone en un minuto", f(60, PLAYFAIR), TINTA, "centro")
    texto(d, (L // 2, 158), "Sin tornillos y sin taladro", f(31), SUAVE, "centro")

    filas = [
        (("desc-4c29f918.jpg", (425, 180, 625, 380)),
         "Pega los ganchos", "Cuatro ganchos adhesivos, dos a cada lado del hueco."),
        (("desc-75d2ef73.jpg", (300, 170, 660, 530)),
         "Mete las varillas", "Estiras las dos varillas de acero y las pasas por las presillas de la malla."),
        (("bar00.jpg", (12, 18, 462, 468)),
         "Cuelga la malla", "La enganchas en los cuatro ganchos y ya está cerrado el paso."),
    ]
    y = 230
    alto, lado = 296, 252
    for i, ((src, rec), tit, txt) in enumerate(filas):
        im = ab(src).crop(rec)
        r = pegar_centrado(base, im, (86, y + (alto - lado) // 2, 86 + lado, y + (alto + lado) // 2))
        marco(base, (r[0] - 1, r[1] - 1, r[2], r[3]))
        x = 86 + lado + 46
        d.ellipse([x, y + 70, x + 44, y + 114], fill=VERDE)
        texto(d, (x + 22, y + 70 + 22 - f(26).size * 0.36), str(i + 1), f(26), BLANCO, "centro")
        texto(d, (x + 60, y + 76), tit, f(40, PLAYFAIR), TINTA)
        parrafo(d, x, y + 138, txt, f(29), L - x - 86, SUAVE, 1.45)
        if i < 2:
            d.line([(86, y + alto + 16), (L - 86, y + alto + 16)], fill=BORDE, width=2)
        y += alto + 36
    guardar(base, os.path.join(SAL, "barrera-4-pasos.jpg"))


# ---------------------------------------------------------------- 5 medidas
def malla(w, h):
    """Trozo de malla de nailon dibujado: trama fina sobre tejido oscuro."""
    e = 3
    t = Image.new("RGB", (w * e, h * e), (62, 65, 60))
    d = ImageDraw.Draw(t)
    paso = 9
    for x in range(0, w * e, paso):
        d.line([(x, 0), (x, h * e)], fill=(118, 122, 114))
    for y in range(0, h * e, paso):
        d.line([(0, y), (w * e, y)], fill=(118, 122, 114))
    t = t.resize((w, h), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.4))
    # caida de luz de izquierda a derecha, para que no parezca un plano
    som = Image.linear_gradient("L").rotate(90, expand=True).resize((w, h))
    return Image.composite(t, Image.new("RGB", (w, h), (42, 44, 41)), som.point(lambda v: 95 + v // 3))


def medidas():
    base = lienzo()
    d = ImageDraw.Draw(base)
    texto(d, (L // 2, 82), "74 cm de alto", f(64, PLAYFAIR), TINTA, "centro")
    texto(d, (L // 2, 164), "y hasta 124 cm de ancho", f(38), SUAVE, "centro")

    mw = 800
    mh = int(round(mw * 74 / 124.0))          # proporción real
    mx0 = (L - mw) // 2
    my0 = 330
    mx1, my1 = mx0 + mw, my0 + mh

    base.paste(malla(mw, mh), (mx0, my0))
    banda = 30
    d.rectangle([mx0, my0, mx1, my0 + banda], fill=(24, 26, 23))          # refuerzo arriba
    d.rectangle([mx0, my1 - banda, mx1, my1], fill=(24, 26, 23))          # refuerzo abajo
    for lx in (mx0, mx1 - 34):                                            # túneles laterales
        d.rectangle([lx, my0, lx + 34, my1], fill=(30, 32, 29))
        d.rounded_rectangle([lx + 12, my0 + 44, lx + 22, my1 - 44], radius=5,
                            fill=(186, 188, 184), outline=(126, 129, 122), width=1)
    d.rectangle([mx0, my0, mx1, my1], outline=(24, 26, 23), width=3)

    for gx, gy in [(mx0, my0), (mx1, my0), (mx0, my1), (mx1, my1)]:
        d.ellipse([gx - 16, gy - 16, gx + 16, gy + 16], fill=BLANCO, outline=SUAVE, width=3)

    def flecha(p0, p1, color=TERRACOTA, g=4, t=16):
        d.line([p0, p1], fill=color, width=g)
        an = math.atan2(p1[1] - p0[1], p1[0] - p0[0])
        for pt, s in ((p1, an), (p0, an + math.pi)):
            for lado in (2.5, -2.5):
                d.line([pt, (pt[0] - t * math.cos(s + lado), pt[1] - t * math.sin(s + lado))], fill=color, width=g)

    tf = f(40)
    ax = mx0 - 86
    flecha((ax, my0), (ax, my1))
    d.line([(ax - 18, my0), (mx0, my0)], fill=BORDE, width=2)
    d.line([(ax - 18, my1), (mx0, my1)], fill=BORDE, width=2)
    w, h = med("74 cm", tf)
    d.rectangle([ax - w / 2 - 14, (my0 + my1) / 2 - h / 2 - 12, ax + w / 2 + 14, (my0 + my1) / 2 + h / 2 + 12], fill=CREMA)
    texto(d, (ax, (my0 + my1) / 2 - h / 2), "74 cm", tf, TERRACOTA, "centro")

    ay = my1 + 86
    flecha((mx0, ay), (mx1, ay))
    d.line([(mx0, my1), (mx0, ay + 18)], fill=BORDE, width=2)
    d.line([(mx1, my1), (mx1, ay + 18)], fill=BORDE, width=2)
    w, h = med("hasta 124 cm", tf)
    d.rectangle([L / 2 - w / 2 - 16, ay - h / 2 - 12, L / 2 + w / 2 + 16, ay + h / 2 + 12], fill=CREMA)
    texto(d, (L / 2, ay - h / 2), "hasta 124 cm", tf, TERRACOTA, "centro")

    texto(d, (L // 2, L - 168), "Las dos varillas de acero van por dentro,", f(29), SUAVE, "centro")
    texto(d, (L // 2, L - 128), "una a cada lado, y los ganchos en las cuatro esquinas.", f(29), SUAVE, "centro")
    texto(d, (L // 2, L - 66), "Mide tu hueco: si pasa de 124 cm, no encaja.", f(33), TINTA, "centro")
    guardar(base, os.path.join(SAL, "barrera-5-medidas.jpg"))


# ---------------------------------------------------------------- 6 ganchos
def ganchos():
    base = lienzo()
    d = ImageDraw.Draw(base)
    texto(d, (L // 2, 92), "Dónde agarran los ganchos", f(58, PLAYFAIR), TINTA, "centro")
    texto(d, (L // 2, 172), "Míralo antes de pegarlos", f(30), SUAVE, "centro")

    cols = [
        (86, VERDE, "Agarran bien",
         ["Marco de puerta pintado y liso", "Azulejo", "Melamina o laminado", "Puerta lacada"], True),
        (L // 2 + 14, TERRACOTA, "Agarran mal",
         ["Gotelé", "Papel pintado", "Pared recién pintada", "Ladrillo o piedra vista"], False),
    ]
    ancho_col = L // 2 - 100
    y0, alto_col = 262, 560
    for x0, color, tit, items, si in cols:
        d.rounded_rectangle([x0, y0, x0 + ancho_col, y0 + alto_col], radius=26, fill=BLANCO, outline=BORDE, width=2)
        d.rounded_rectangle([x0, y0, x0 + ancho_col, y0 + 96], radius=26, fill=color)
        d.rectangle([x0, y0 + 62, x0 + ancho_col, y0 + 96], fill=color)
        texto(d, (x0 + ancho_col / 2, y0 + 32), tit, f(38, PLAYFAIR), BLANCO, "centro")
        y = y0 + 150
        for it in items:
            cx, cy = x0 + 48, y + 15
            if si:
                d.line([(cx - 14, cy), (cx - 3, cy + 12)], fill=VERDE, width=7)
                d.line([(cx - 3, cy + 12), (cx + 15, cy - 13)], fill=VERDE, width=7)
            else:
                d.line([(cx - 13, cy - 13), (cx + 13, cy + 13)], fill=TERRACOTA, width=7)
                d.line([(cx + 13, cy - 13), (cx - 13, cy + 13)], fill=TERRACOTA, width=7)
            yy = parrafo(d, x0 + 84, y, it, f(31), ancho_col - 124, TINTA, 1.4)
            y = max(yy, y + 50) + 40
    texto(d, (L // 2, L - 128), "Al despegarlos de una pared con gotelé o papel", f(30), SUAVE, "centro")
    texto(d, (L // 2, L - 84), "pueden llevarse un trozo. Sobre eso, mejor no.", f(30), SUAVE, "centro")
    guardar(base, os.path.join(SAL, "barrera-6-ganchos.jpg"))


if __name__ == "__main__":
    foto_con_pie("bar00.jpg",
                 "Cierra el paso de una habitación sin dejar una reja fija en mitad del pasillo.",
                 "barrera-1-perro-detras.jpg")
    foto_con_pie("bar01.jpg",
                 "Malla de nailon semitransparente: el perro te ve a través y tú lo ves a él.",
                 "barrera-2-golden.jpg")
    contenido()
    pasos()
    medidas()
    ganchos()
    foto_con_pie("desc-75d2ef73.jpg",
                 "Presillas cosidas a los dos lados: por ahí entran las varillas de acero.",
                 "barrera-7-presillas.jpg")
    foto_con_pie("bar04.jpg",
                 "También sirve para el arranque de una escalera o para un hueco entre dos paredes.",
                 "barrera-8-hueco.jpg")
    foto_con_pie("bar06.png",
                 "Se descuelga y se dobla como una tela. Los ganchos se quedan puestos para volver a colgarla.",
                 "barrera-9-plegada.jpg", lado_foto=820)
