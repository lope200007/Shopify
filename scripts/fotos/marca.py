"""Piezas comunes para las tarjetas de producto de Patitascalidas."""
from PIL import Image, ImageDraw, ImageFont, ImageFilter

INTER = "/tmp/fuentes/inter.ttf"
PLAYFAIR = "/tmp/fuentes/playfair.ttf"

CREMA     = (251, 247, 241)
TINTA     = (35, 38, 31)
SUAVE     = (87, 92, 80)
VERDE     = (31, 74, 55)
TERRACOTA = (169, 79, 30)
BORDE     = (224, 213, 194)
BLANCO    = (255, 255, 255)

L = 1200          # lado del lienzo


def f(px, ruta=INTER):
    return ImageFont.truetype(ruta, int(px))


def med(txt, fnt):
    a = fnt.getbbox(txt)
    return a[2] - a[0], a[3] - a[1]


def texto(d, xy, txt, fnt, color=TINTA, anclaje="izq"):
    a = fnt.getbbox(txt)
    x, y = xy
    if anclaje == "centro":
        x -= (a[2] - a[0]) / 2
    elif anclaje == "der":
        x -= (a[2] - a[0])
    d.text((x - a[0], y - a[1]), txt, font=fnt, fill=color)
    return a[3] - a[1]


def partir(txt, fnt, ancho_max):
    lineas, act = [], ""
    for p in txt.split():
        pr = (act + " " + p).strip()
        if med(pr, fnt)[0] <= ancho_max or not act:
            act = pr
        else:
            lineas.append(act)
            act = p
    if act:
        lineas.append(act)
    return lineas


def parrafo(d, x, y, txt, fnt, ancho_max, color=SUAVE, interlineado=1.55, anclaje="izq"):
    salto = int(fnt.size * interlineado)
    for ln in partir(txt, fnt, ancho_max):
        texto(d, (x, y), ln, fnt, color, anclaje)
        y += salto
    return y


def ampliar(im, lado):
    """Reescala manteniendo proporcion y afila un poco lo que se ha estirado."""
    im = im.convert("RGB")
    r = lado / max(im.size)
    nueva = (max(1, round(im.width * r)), max(1, round(im.height * r)))
    out = im.resize(nueva, Image.LANCZOS)
    if r > 1.2:
        out = out.filter(ImageFilter.UnsharpMask(radius=1.6, percent=int(min(90, 45 * r)), threshold=3))
    return out


def lienzo(color=CREMA):
    return Image.new("RGB", (L, L), color)


def pegar_centrado(base, im, caja):
    """Encaja `im` dentro de la caja (x0,y0,x1,y1) sin deformarla."""
    x0, y0, x1, y1 = caja
    im = ampliar(im, max(x1 - x0, y1 - y0))
    r = min((x1 - x0) / im.width, (y1 - y0) / im.height)
    if r < 1:
        im = im.resize((round(im.width * r), round(im.height * r)), Image.LANCZOS)
    x = x0 + ((x1 - x0) - im.width) // 2
    y = y0 + ((y1 - y0) - im.height) // 2
    base.paste(im, (x, y))
    return (x, y, x + im.width, y + im.height)


def pastilla(d, xy, txt, fnt, fondo=VERDE, tinta=BLANCO, pad=(22, 12), radio=None):
    x, y = xy
    a, b = med(txt, fnt)
    w, h = a + pad[0] * 2, b + pad[1] * 2
    if radio is None:
        radio = h // 2
    d.rounded_rectangle([x, y, x + w, y + h], radius=radio, fill=fondo)
    texto(d, (x + pad[0], y + pad[1]), txt, fnt, tinta)
    return w, h


def guardar(im, ruta, calidad=92):
    im.save(ruta, "JPEG", quality=calidad, subsampling=1, optimize=True, progressive=True)
    print("->", ruta, im.size)
