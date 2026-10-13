"""
Anuncio del código BIENVENIDA10 (patitascalidas.com), en 4:5, 9:16 y 1:1.

Condiciones comprobadas el 13-10-2026 en la tienda (codeDiscountNodeByCode):
10 % en todo el pedido, sin compra mínima, un uso por cliente, activo y sin
fecha de fin. Por eso el texto dice «en todo el pedido» y «Un uso por cliente».
No se nombra el envío gratis: se calcula sobre el importe ya rebajado y juntar
las dos cosas confunde.

Foto: assets/fotos/cama-donut-10-gato.jpg (cama dónut marrón, a la venta).
Logo: assets/marca/logo-oficial.jpg, copia a escala, sin tocar.
Letra: Inter (la de la web), de github.com/google/fonts (ofl/inter,
Inter[opsz,wght].ttf); no está en el repositorio, se descarga a una carpeta
temporal. Colores: los del tema.
Salida: assets/anuncios/2026-10/bienvenida10-{4x5,9x16,1x1}.jpg

Uso: python3 -P anuncio.py <foto> <logo> <inter.ttf> <carpeta-salida>
"""
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

FOTO, LOGO, INTER, SALIDA = sys.argv[1:5]

CREMA = (251, 247, 241)
CREMA2 = (242, 235, 223)
TINTA = (35, 38, 31)
SUAVE = (87, 92, 80)
VERDE = (31, 74, 55)
TEJA = (169, 79, 30)


def fuente(tam, peso, opsz=None):
    f = ImageFont.truetype(INTER, tam)
    ejes = f.get_variation_axes()
    valores = []
    for e in ejes:
        n = e["name"].decode() if isinstance(e["name"], bytes) else e["name"]
        if "eight" in n:
            valores.append(peso)
        elif "ptical" in n:
            valores.append(opsz if opsz else max(14, min(32, tam)))
        else:
            valores.append(e["default"])
    f.set_variation_by_axes(valores)
    return f


def ancho_con_espacio(d, txt, f, esp):
    return sum(d.textlength(c, font=f) for c in txt) + esp * (len(txt) - 1)


def escribir(d, cx, y, txt, f, color, esp=0):
    """Escribe centrado en cx; y es la parte de arriba de las letras."""
    caja = f.getbbox(txt)
    if esp:
        w = ancho_con_espacio(d, txt, f, esp)
        x = cx - w / 2
        for c in txt:
            d.text((x, y - caja[1]), c, font=f, fill=color)
            x += d.textlength(c, font=f) + esp
    else:
        w = d.textlength(txt, font=f)
        d.text((cx - w / 2, y - caja[1]), txt, font=f, fill=color)
    return caja[3] - caja[1]


def foto_recortada(ancho, alto, centro_y=0.62):
    im = Image.open(FOTO).convert("RGB")
    escala = max(ancho / im.width, alto / im.height)
    im = im.resize((round(im.width * escala), round(im.height * escala)), Image.LANCZOS)
    im = im.filter(ImageFilter.UnsharpMask(radius=1.2, percent=40, threshold=2))
    x = (im.width - ancho) // 2
    y = int(im.height * centro_y - alto / 2)
    y = max(0, min(y, im.height - alto))
    return im.crop((x, y, x + ancho, y + alto))


def componer(ancho, alto, alto_foto, k, nombre, centro_y=0.62, logo_si=True):
    lienzo = Image.new("RGB", (ancho, alto), CREMA)
    lienzo.paste(foto_recortada(ancho, alto_foto, centro_y), (0, 0))
    d = ImageDraw.Draw(lienzo)

    # Logo oficial, copia a escala, arriba a la izquierda. En historias no:
    # esa franja la tapa el nombre de la cuenta.
    if logo_si:
        lado = int(150 * k)
        logo = Image.open(LOGO).convert("RGB").resize((lado, lado), Image.LANCZOS)
        lienzo.paste(logo, (int(40 * k), int(40 * k)))

    cx = ancho / 2
    y = alto_foto + int(46 * k)
    y += escribir(d, cx, y, "PARA TU PRIMERA COMPRA", fuente(int(30 * k), 600), TEJA, esp=int(4 * k)) + int(30 * k)

    # «10 %» grande, con espacio fino entre el número y el signo
    f_num = fuente(int(210 * k), 900, 32)
    f_pct = fuente(int(150 * k), 800, 32)
    w_num = d.textlength("10", font=f_num)
    w_pct = d.textlength("%", font=f_pct)
    hueco = int(14 * k)
    x0 = cx - (w_num + hueco + w_pct) / 2
    caja_num = f_num.getbbox("10")
    caja_pct = f_pct.getbbox("%")
    d.text((x0, y - caja_num[1]), "10", font=f_num, fill=TEJA)
    base = y + (caja_num[3] - caja_num[1])
    d.text((x0 + w_num + hueco, base - (caja_pct[3] - caja_pct[1]) - caja_pct[1]), "%", font=f_pct, fill=TEJA)
    y = base + int(26 * k)

    y += escribir(d, cx, y, "de descuento en todo el pedido", fuente(int(46 * k), 600), TINTA) + int(40 * k)

    # Cupón con el código
    bw, bh = int(780 * k), int(158 * k)
    bx, by = cx - bw / 2, y
    d.rounded_rectangle((bx, by, bx + bw, by + bh), radius=int(22 * k), fill=CREMA2, outline=TEJA, width=max(2, int(3 * k)))
    r = int(20 * k)
    for ex in (bx, bx + bw):
        d.ellipse((ex - r, by + bh / 2 - r, ex + r, by + bh / 2 + r), fill=CREMA, outline=TEJA, width=max(2, int(3 * k)))
    # tapar la mitad del círculo que cae fuera del cupón, para que parezca un mordisco
    d.rectangle((bx - r - 2, by + bh / 2 - r - 2, bx - 1, by + bh / 2 + r + 2), fill=CREMA)
    d.rectangle((bx + bw + 1, by + bh / 2 - r - 2, bx + bw + r + 2, by + bh / 2 + r + 2), fill=CREMA)
    yy = by + int(24 * k)
    yy += escribir(d, cx, yy, "USA EL CÓDIGO", fuente(int(24 * k), 500), SUAVE, esp=int(4 * k)) + int(18 * k)
    escribir(d, cx, yy, "BIENVENIDA10", fuente(int(76 * k), 800, 32), VERDE, esp=int(5 * k))
    y = by + bh + int(34 * k)

    escribir(d, cx, y, "patitascalidas.com  ·  Un uso por cliente", fuente(int(30 * k), 500), SUAVE)

    ruta = f"{SALIDA}/{nombre}.jpg"
    lienzo.save(ruta, quality=92, optimize=True, progressive=True)
    print(ruta, lienzo.size)


componer(1080, 1350, 700, 1.0, "bienvenida10-4x5")
# Historias: arriba (unos 250 px) y abajo (unos 340 px) los tapa Instagram;
# el texto acaba antes de esa franja de abajo.
componer(1080, 1920, 960, 1.05, "bienvenida10-9x16", centro_y=0.56, logo_si=False)
# Cuadrada: la cama entera (en la foto escalada va de y=398 a y=1006).
componer(1080, 1080, 620, 0.76, "bienvenida10-1x1", centro_y=0.65)
