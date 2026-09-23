"""
Publica en Instagram y Facebook lo que toca de contenido/redes/cola-meta.json.

    META_PAGE_TOKEN=... python3 scripts/redes/meta_cola.py            # publica lo que toca
    python3 scripts/redes/meta_cola.py --simular                      # solo dice qué saldría

Lo lanza el aviso de las 10:00, 13:00 y 18:00 (hora de Madrid) en la
conversación de Claude donde vive la clave. La clave no se guarda en ningún
archivo (ver meta_publicar.py).

Reglas:
- Solo sale lo que tiene "revisado" (la revisión de la habilidad
  gestor-redes-patitas: producto publicado, precio de hoy, foto mirada a tamaño
  real y ficha que coincide con el producto de CJ).
- Sale lo que ya ha llegado a su hora y no lleva más de 3 horas de retraso.
  Lo que se pasa de eso se marca "caducada" y no se publica: se reprograma a
  mano, para no soltar tres publicaciones de golpe.
- Lo publicado se apunta en "publicado" con los enlaces, y el archivo se
  guarda después de cada publicación, para que nada salga dos veces.
"""
import datetime
import json
import os
import sys
from zoneinfo import ZoneInfo

sys.path.insert(0, os.path.dirname(__file__))
import meta_publicar  # noqa: E402

COLA = os.path.join(os.path.dirname(__file__), "..", "..", "contenido", "redes", "cola-meta.json")
MADRID = ZoneInfo("Europe/Madrid")
MARGEN = datetime.timedelta(hours=3)


def guardar(datos):
    with open(COLA, "w", encoding="utf-8") as f:
        json.dump(datos, f, ensure_ascii=False, indent=1)
        f.write("\n")


def main(simular):
    datos = json.load(open(COLA, encoding="utf-8"))
    ahora = datetime.datetime.now(MADRID)
    informe = []
    for e in sorted(datos["cola"], key=lambda e: e["fecha"]):
        if e.get("publicado") or e.get("caducada"):
            continue
        hora = datetime.datetime.fromisoformat(e["fecha"]).replace(tzinfo=MADRID)
        if hora > ahora:
            continue
        if not e.get("revisado"):
            informe.append("%s %s: SIN REVISAR, no sale" % (e["fecha"], e["producto"]))
            continue
        if ahora - hora > MARGEN:
            informe.append("%s %s: CADUCADA (más de 3 h tarde), no sale" % (e["fecha"], e["producto"]))
            if not simular:
                e["caducada"] = ahora.isoformat(timespec="minutes")
                guardar(datos)
            continue
        if simular:
            informe.append("%s %s: saldría ahora" % (e["fecha"], e["producto"]))
            continue
        r = meta_publicar.publicar(e)
        e["publicado"] = dict(r, cuando=ahora.isoformat(timespec="minutes"))
        guardar(datos)
        informe.append("%s %s: %s" % (e["fecha"], e["producto"], json.dumps(r, ensure_ascii=False)))
    pendientes = [e for e in datos["cola"] if not e.get("publicado") and not e.get("caducada")]
    informe.append("Quedan %d en la cola; la última es del %s." % (
        len(pendientes), max((e["fecha"] for e in pendientes), default="-")))
    print("\n".join(informe) if informe else "Nada que publicar ahora.")


if __name__ == "__main__":
    main("--simular" in sys.argv)
