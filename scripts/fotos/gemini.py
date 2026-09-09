#!/usr/bin/env python3
"""Reencuadra una foto de producto con Gemini ("nano banana") SIN cambiar el producto.

La regla de la tienda no cambia porque la imagen la haga una IA: el producto
que sale en la foto tiene que ser exactamente el que le llega al cliente. Por
eso aqui no se genera nada desde cero: se manda la foto REAL del proveedor y
se le pide que rehaga la escena alrededor.

Y despues se MIDE. Se compara el producto de antes con el de despues sobre las
proporciones entre canales -si un pixel era el doble de rojo que de azul, tiene
que seguir siendolo-. Por encima de 0,01 el color se ha movido y el fichero no
se guarda. Es el mismo listón que usa mejorar-foto.py.

  gemini.py entrada.jpg salida.jpg "la escena que quieres"
  gemini.py entrada.jpg salida.jpg "..." --forzar     # guarda aunque se pase

La clave sale de shopify/.env (GEMINI_API_KEY), que esta en .gitignore. Nunca
se escribe en el codigo, ni en un commit, ni en un log.
"""
import base64
import io
import json
import os
import sys
import urllib.error
import urllib.request

import numpy as np
from PIL import Image

MODELOS = ['gemini-3-pro-image', 'gemini-3.1-flash-image', 'gemini-2.5-flash-image']
LIMITE = 0.01
BASE = 'https://generativelanguage.googleapis.com/v1beta/models'


def clave():
    ruta = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '.env')
    if os.path.exists(ruta):
        for linea in open(ruta, encoding='utf-8'):
            if linea.startswith('GEMINI_API_KEY='):
                return linea.split('=', 1)[1].strip()
    if os.environ.get('GEMINI_API_KEY'):
        return os.environ['GEMINI_API_KEY']
    sys.exit('Falta GEMINI_API_KEY en shopify/.env')


def desvio_de_tono(antes, despues, mascara):
    """Cuanto se ha movido el COLOR, ignorando el brillo."""
    a = np.asarray(antes.convert('RGB')).astype(float)
    b = np.asarray(despues.convert('RGB').resize(antes.size, Image.LANCZOS)).astype(float)
    pa = a[mascara] / np.maximum(a[mascara].sum(1, keepdims=True), 1)
    pb = b[mascara] / np.maximum(b[mascara].sum(1, keepdims=True), 1)
    return float(np.abs(pa - pb).mean())


def pedir(modelo, prompt, jpg, api):
    cuerpo = json.dumps({
        'contents': [{'parts': [
            {'text': prompt},
            {'inline_data': {'mime_type': 'image/jpeg', 'data': base64.b64encode(jpg).decode()}},
        ]}],
    }).encode()
    req = urllib.request.Request(
        f'{BASE}/{modelo}:generateContent?key={api}',
        data=cuerpo, headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=180) as r:
            d = json.load(r)
    except urllib.error.HTTPError as e:
        # Google contesta 429 con dos cosas muy distintas y conviene no
        # confundirlas: "has gastado tu cuota" y "tu cuota es CERO". Lo segundo
        # significa que el modelo de imagen no entra en la capa gratuita y hace
        # falta activar la facturacion, no esperar a manana.
        detalle = e.read().decode()[:600]
        if e.code == 429 and 'limit: 0' in detalle:
            raise RuntimeError(
                'la capa gratuita de Google no incluye modelos de imagen '
                '(limit: 0). Hay que activar la facturacion del proyecto en '
                'https://aistudio.google.com/apikey. Se paga por imagen, unos '
                '0,04 EUR, sin cuota mensual.')
        raise RuntimeError(f'HTTP {e.code}: ' + detalle.replace(api, '<<CLAVE>>'))
    for c in d.get('candidates', []):
        for p in c.get('content', {}).get('parts', []):
            dat = p.get('inline_data') or p.get('inlineData')
            if dat and dat.get('data'):
                return base64.b64decode(dat['data'])
    raise RuntimeError('la respuesta no trae imagen: ' + json.dumps(d)[:300])


def main():
    entrada, salida, prompt = sys.argv[1], sys.argv[2], sys.argv[3]
    api = clave()
    jpg = open(entrada, 'rb').read()
    original = Image.open(entrada).convert('RGB')

    ultimo = None
    for m in MODELOS:
        try:
            png = pedir(m, prompt, jpg, api)
            modelo = m
            break
        except Exception as e:
            ultimo = f'{m}: {e}'
    else:
        sys.exit('ningun modelo respondio -> ' + str(ultimo))

    nueva = Image.open(io.BytesIO(png)).convert('RGB')

    # El tono se mide donde esta el producto, no en el fondo: el fondo cambia
    # a proposito. Se toma como producto lo que no es fondo liso en la original.
    a = np.asarray(original).astype(float)
    lum = a.mean(2)
    mascara = (lum > 20) & (lum < 250)
    if mascara.sum() < 500:
        mascara = np.ones(lum.shape, bool)

    d = desvio_de_tono(original, nueva, mascara)
    aviso = ''
    # Aviso honesto: si se rehace la ESCENA entera, esta medida deja de ser un
    # veredicto. La mascara coge fondo, y el fondo cambia a proposito, asi que
    # el numero sube aunque el producto este intacto. Sirve para el revelado;
    # para una escena nueva hay que mirar la foto y comparar el producto.
    if d > LIMITE and '--forzar' not in sys.argv:
        print(f'RECHAZADA  desvio de tono {d:.4f} > {LIMITE}: el producto ha cambiado de color.')
        print('Si de verdad quieres guardarla, repite con --forzar y mirala tu antes de publicar.')
        sys.exit(1)
    if d > LIMITE:
        aviso = '  <-- FORZADA, el color se ha movido'
    nueva.save(salida, quality=94, subsampling=0)
    print(f'{os.path.basename(salida)}  {nueva.size}  modelo {modelo}  desvio de tono {d:.4f}{aviso}')


if __name__ == '__main__':
    if len(sys.argv) < 4:
        sys.exit(__doc__)
    main()
