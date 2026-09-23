"""
Publica una imagen en Instagram y en la página de Facebook de patitascalidas.

    META_PAGE_TOKEN=... python3 scripts/redes/meta_publicar.py publicacion.json

La clave NUNCA va en un archivo ni en git: se lee de la variable de entorno
META_PAGE_TOKEN, que Pablo guarda en los ajustes del entorno de Claude Code.
Vale la clave de la página (no caduca) o una de usuario con acceso a la página
(dura 60 días): en ese caso se saca la de la página al vuelo.
El script no imprime la clave nunca.

publicacion.json:
{
  "imagen": "https://raw.githubusercontent.com/.../algo.jpg",   # pública, JPG
  "texto_instagram": "...",   # el enlace no se puede pulsar: "Enlace en la bio"
  "texto_facebook": "...",    # aquí sí: https://patitascalidas.com/products/...
  "redes": ["instagram", "facebook"]
}

Probado el 23-09-2026: pack de invierno publicado en las dos redes.
Permisos de la app de Meta: pages_show_list, pages_read_engagement,
pages_manage_posts, instagram_basic, instagram_content_publish.
"""
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

API = "https://graph.facebook.com/v21.0/"
PAGINA = "1249959148207574"          # página de Facebook «Patitascalida»
INSTAGRAM = "17841433600204625"      # @patitascalidas_


def llamar(ruta, clave, metodo="GET", **parametros):
    parametros["access_token"] = clave
    datos = urllib.parse.urlencode(parametros)
    if metodo == "GET":
        peticion = urllib.request.Request(API + ruta + "?" + datos)
    else:
        peticion = urllib.request.Request(API + ruta, data=datos.encode(), method=metodo)
    try:
        with urllib.request.urlopen(peticion, timeout=60) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        return {"ERROR": json.load(e).get("error", {}).get("message", str(e.code))}


def clave_de_pagina(clave):
    r = llamar(PAGINA, clave, fields="access_token")
    return r.get("access_token", clave)  # si ya es la de la página, no la da y sirve tal cual


def publicar(p):
    clave = os.environ.get("META_PAGE_TOKEN")
    if not clave:
        sys.exit("Falta META_PAGE_TOKEN en los ajustes del entorno.")
    clave = clave_de_pagina(clave)
    resultado = {}

    if "instagram" in p.get("redes", []):
        c = llamar(INSTAGRAM + "/media", clave, "POST", image_url=p["imagen"], caption=p["texto_instagram"])
        if "id" not in c:
            resultado["instagram"] = "ERROR al preparar: %s" % c.get("ERROR")
        else:
            for _ in range(20):  # Instagram procesa la imagen antes de dejar publicarla
                if llamar(c["id"], clave, fields="status_code").get("status_code") == "FINISHED":
                    break
                time.sleep(3)
            pub = llamar(INSTAGRAM + "/media_publish", clave, "POST", creation_id=c["id"])
            if "id" in pub:
                resultado["instagram"] = llamar(pub["id"], clave, fields="permalink").get("permalink")
            else:
                resultado["instagram"] = "ERROR al publicar: %s" % pub.get("ERROR")

    if "facebook" in p.get("redes", []):
        f = llamar(PAGINA + "/photos", clave, "POST", url=p["imagen"], message=p["texto_facebook"], published="true")
        if "post_id" in f:
            resultado["facebook"] = llamar(f["post_id"], clave, fields="permalink_url").get("permalink_url")
        else:
            resultado["facebook"] = "ERROR: %s" % f.get("ERROR")

    return resultado


if __name__ == "__main__":
    print(json.dumps(publicar(json.load(open(sys.argv[1], encoding="utf-8"))), ensure_ascii=False, indent=1))
