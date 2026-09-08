# -*- coding: utf-8 -*-
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image, ImageDraw
import marca as M
from marca import CREMA, TINTA, SUAVE, VERDE, TERRACOTA, BORDE, BLANCO, f, texto, partir, med

W, H = 1080, 1350
SAL = '/home/user/shopify/assets/fotos'

def mezcla(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

def huella(d, cx, cy, r, color):
    d.ellipse([cx-r*0.62, cy-r*0.18, cx+r*0.62, cy+r*0.95], fill=color)
    for ang, rr in ((-58,0.30), (-20,0.26), (20,0.26), (58,0.30)):
        a = math.radians(ang - 90)
        x, y = cx + math.cos(a)*r*0.78, cy + math.sin(a)*r*0.80
        d.ellipse([x-r*rr, y-r*rr*1.25, x+r*rr, y+r*rr*1.25], fill=color)

base = Image.new('RGB', (W, H), CREMA)
d = ImageDraw.Draw(base)
x = 88
ancho = W - 176

# banda superior
d.rectangle([0, 0, W, 14], fill=TERRACOTA)

fg = f(26)
g = 'LO QUE CUESTA DE VERDAD'
d.rounded_rectangle([x, 96, x+med(g,fg)[0]+42, 96+fg.size+26], radius=(fg.size+26)//2, fill=TERRACOTA)
texto(d, (x+21, 96+13), g, fg, BLANCO)

# titular
ft = f(74, M.PLAYFAIR)
y = 196
for ln in partir('La peluquería canina son 240 € al año', ft, ancho):
    texto(d, (x, y), ln, ft, TINTA); y += int(ft.size*1.18)

fs = f(34)
y += 26
for ln in partir('Un perro mediano, cada dos meses. Cuatro de esas cosas las puedes hacer tú en casa.', fs, ancho):
    texto(d, (x, y), ln, fs, SUAVE); y += int(fs.size*1.45)

# la lista
y += 56
items = [('Las uñas', 'Son 7 € cada vez, y toca cada mes'),
         ('El pelo de las almohadillas', 'Es por lo que resbala en el parquet'),
         ('El cepillado', 'Evita los 20 € de desenredado'),
         ('El secado', 'Una toalla buena le quita medio secador')]
fn = f(30); fi = f(36); fx = f(27)
for i, (t, sub) in enumerate(items, 1):
    d.ellipse([x, y, x+52, y+52], fill=VERDE)
    texto(d, (x+26, y+26-fn.size*0.36), str(i), fn, BLANCO, 'centro')
    texto(d, (x+72, y+2), t, fi, TINTA)
    texto(d, (x+72, y+2+fi.size+10), sub, fx, SUAVE)
    y += 126

# pie verde, colocado a continuacion de la lista
pie = max(y + 46, H - 300)
d.rectangle([0, pie, W, H], fill=VERDE)
huella(d, W-118, H-112, 70, mezcla(VERDE, CREMA, 0.14))
fq = f(31)
texto(d, (x, pie+54), 'Y lo que NO deberías intentar en casa,', fq, mezcla(VERDE, BLANCO, 0.78))
texto(d, (x, pie+54+44), 'también te lo contamos. Son cinco cosas.', fq, mezcla(VERDE, BLANCO, 0.78))
texto(d, (x, H-78), 'patitascalidas.com', f(30), BLANCO)

M.guardar(base, os.path.join(SAL, 'insta-peluqueria.jpg'))
