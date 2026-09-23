"""
Monta una imagen de redes con la imagen de marca de patitascalidas.com.

    python3 scripts/redes/creatividad.py datos.json salida.jpg

datos.json:
{
  "foto": "ruta/a/foto.jpg",          # foto del producto YA REVISADA a tamaño real
  "etiqueta": "INVIERNO · GATOS",     # línea pequeña en color teja
  "titular": "Su sitio caliente, sin enchufe",
  "subtitulo": "Hamaca de radiador, saco cueva y manta",
  "precio": "66,90 €",
  "nota": "Envío gratis · 14 días para devolver"
}

Para un pack, en vez de "foto" se puede pasar "fotos": una lista de tres
[ruta, rótulo]. Se montan juntas (una grande a la izquierda y dos a la
derecha), cada una con su rótulo, para que se vea TODO lo que lleva el pack.
Con "grande_arriba": true, la primera va arriba a todo lo ancho y las otras
dos debajo (para una primera foto apaisada).
Una portada de pack con una sola pieza engaña (pasó el 23-09-2026).

Formato 1080 × 1350 (4:5): el que mejor ocupa la pantalla en Instagram y
Facebook, y TikTok lo acepta como foto. Colores y letra de la web y de los
vídeos, para que todo se vea de la misma marca.

Reglas (habilidad gestor-redes-patitas):
- La foto se revisa ANTES a tamaño real: sin texto en otro idioma, sin marca
  del proveedor, sin marca de IA. Este script no la arregla.
- El titular y el precio tienen que ser verdad hoy: precio de Shopify, nada
  de "antes X €" inventados.
"""
import json
import sys

from PIL import Image, ImageDraw, ImageFont

ANCHO, ALTO = 1080, 1350
ALTO_FOTO = 860
CREMA = (251, 247, 241)
VERDE = (31, 74, 55)
TEJA = (169, 79, 30)
TEXTO = (35, 38, 31)
GRIS = (87, 92, 80)

LETRA = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
NEGRITA = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"


def letra(ruta, tam):
    return ImageFont.truetype(ruta, tam)


def recortar_cubriendo(foto, ancho, alto):
    """Escala la foto para cubrir el hueco y recorta el sobrante por el centro."""
    escala = max(ancho / foto.width, alto / foto.height)
    nueva = foto.resize((round(foto.width * escala), round(foto.height * escala)), Image.LANCZOS)
    x = (nueva.width - ancho) // 2
    y = (nueva.height - alto) // 2
    return nueva.crop((x, y, x + ancho, y + alto))


def partir(texto, fuente, ancho_max, dibujo):
    """Parte el texto en líneas que quepan en ancho_max."""
    palabras, lineas, actual = texto.split(), [], ""
    for p in palabras:
        prueba = (actual + " " + p).strip()
        if dibujo.textlength(prueba, font=fuente) <= ancho_max:
            actual = prueba
        else:
            lineas.append(actual)
            actual = p
    if actual:
        lineas.append(actual)
    return lineas


def rotulo(d, x, y, texto):
    fuente = letra(NEGRITA, 26)
    ancho = d.textlength(texto, font=fuente) + 32
    d.rounded_rectangle((x, y, x + ancho, y + 46), radius=23, fill=CREMA)
    d.text((x + 16, y + 9), texto, font=fuente, fill=VERDE)


def collage(lienzo, fotos, grande_arriba=False):
    """Una foto grande a la izquierda y dos apiladas a la derecha.

    Con grande_arriba, la grande ocupa todo el ancho arriba y las otras dos van
    debajo, una al lado de otra: para una foto apaisada que al recortarla en
    vertical perdería lo importante (el saco cueva con el perro y el gato)."""
    d = ImageDraw.Draw(lienzo)
    hueco = 8
    mitad = (ANCHO - hueco) // 2
    if grande_arriba:
        alto_grande = 500
        abajo = alto_grande + hueco
        sitios = [(0, 0, ANCHO, alto_grande), (0, abajo, mitad, ALTO_FOTO - abajo),
                  (mitad + hueco, abajo, ANCHO - mitad - hueco, ALTO_FOTO - abajo)]
    else:
        alto_peq = (ALTO_FOTO - hueco) // 2
        sitios = [(0, 0, mitad, ALTO_FOTO), (mitad + hueco, 0, ANCHO - mitad - hueco, alto_peq),
                  (mitad + hueco, alto_peq + hueco, ANCHO - mitad - hueco, ALTO_FOTO - alto_peq - hueco)]
    for (ruta, texto), (x, y, w, h) in zip(fotos, sitios):
        lienzo.paste(recortar_cubriendo(Image.open(ruta).convert("RGB"), w, h), (x, y))
        rotulo(d, x + 20, y + h - 66, texto)


def montar(datos, salida):
    lienzo = Image.new("RGB", (ANCHO, ALTO), CREMA)
    if datos.get("fotos"):
        collage(lienzo, datos["fotos"], datos.get("grande_arriba", False))
    else:
        foto = Image.open(datos["foto"]).convert("RGB")
        lienzo.paste(recortar_cubriendo(foto, ANCHO, ALTO_FOTO), (0, 0))
    d = ImageDraw.Draw(lienzo)
    margen = 64

    y = ALTO_FOTO + 44
    d.text((margen, y), datos["etiqueta"].upper(), font=letra(NEGRITA, 28), fill=TEJA)
    y += 50

    fuente_tit = letra(NEGRITA, 64)
    lineas = partir(datos["titular"], fuente_tit, ANCHO - 2 * margen, d)
    if len(lineas) > 2:  # si no cabe en dos líneas, se baja un punto
        fuente_tit = letra(NEGRITA, 54)
        lineas = partir(datos["titular"], fuente_tit, ANCHO - 2 * margen, d)
    if len(lineas) > 2:
        raise SystemExit("El titular no cabe en dos líneas: acórtalo.")
    for linea in lineas:
        d.text((margen, y), linea, font=fuente_tit, fill=TEXTO)
        y += fuente_tit.size + 10

    if datos.get("subtitulo"):
        d.text((margen, y + 4), datos["subtitulo"], font=letra(LETRA, 34), fill=GRIS)

    # Franja inferior: precio en píldora verde + nota + dominio
    base = ALTO - 104
    if datos.get("dato"):  # un dato verdadero y comprobable, p. ej. el ahorro real de un pack
        d.text((margen, base - 64), datos["dato"], font=letra(NEGRITA, 32), fill=TEJA)
    fuente_precio = letra(NEGRITA, 44)
    ancho_precio = d.textlength(datos["precio"], font=fuente_precio) + 56
    d.rounded_rectangle((margen, base, margen + ancho_precio, base + 72), radius=36, fill=VERDE)
    d.text((margen + 28, base + 12), datos["precio"], font=fuente_precio, fill=CREMA)
    d.text((margen + ancho_precio + 24, base + 20), datos.get("nota", ""), font=letra(LETRA, 28), fill=GRIS)
    dominio = "patitascalidas.com"
    fuente_dom = letra(NEGRITA, 28)
    d.text((ANCHO - margen - d.textlength(dominio, font=fuente_dom), ALTO_FOTO + 44), dominio,
           font=fuente_dom, fill=VERDE)

    lienzo.save(salida, "JPEG", quality=92)


if __name__ == "__main__":
    montar(json.load(open(sys.argv[1], encoding="utf-8")), sys.argv[2])
