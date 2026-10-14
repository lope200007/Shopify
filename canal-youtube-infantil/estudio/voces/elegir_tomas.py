"""Prueba varias tomas de unas frases y deja la mejor de cada una.

    ~/.venv-farolin/bin/python voces/elegir_tomas.py <ep> <tomas_nuevas> l001 l010 ...

Las frases a repetir salen de voces/puntuar.py (las que quedan muy por debajo de
su propia voz) y del informe de Whisper (las que no se entienden bien).

1. Guarda la toma actual de cada frase (WAV, MP3 y su entrada de voces.json).
2. Prueba <tomas_nuevas> tomas más, a partir de la actual (si una frase va por
   la toma 2 es porque la 1 no se entendía: no se vuelve a ella). En cada
   ronda pone la toma en guion.json y lanza el generador, que solo rehace esas
   frases; guarda el resultado.
3. Puntúa cada toma: DNSMOS (OVR + P.808) menos el error de Whisper.
4. Restaura la mejor de cada frase, deja su "toma" en guion.json (sin campo si
   es la 1) y reescribe el informe de voces sin volver a transcribir.
"""
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

ESTUDIO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ESTUDIO / "voces"))
import puntuar  # noqa: E402

PY = sys.executable
# copia de cada toma probada (out/ no se sube a git)
SCRATCH = ESTUDIO / "out" / "tomas"


def poner_toma(texto, lid, toma):
    """Cambia "toma" de una frase en el texto del guion sin reformatear el resto."""
    i = texto.index(f'"id": "{lid}"')
    ini = texto.rindex("{", 0, i)
    prof, j, en_cadena, escape = 0, ini, False, False
    while True:
        c = texto[j]
        if en_cadena:
            if escape:
                escape = False
            elif c == "\\":
                escape = True
            elif c == '"':
                en_cadena = False
        elif c == '"':
            en_cadena = True
        elif c == "{":
            prof += 1
        elif c == "}":
            prof -= 1
            if prof == 0:
                break
        j += 1
    obj = re.sub(r',\s*"toma":\s*\d+', "", texto[ini:j + 1])
    if toma != 1:
        cuerpo = obj[:-1].rstrip()
        cola = obj[len(cuerpo):-1]
        if "\n" in obj:
            sangria = re.search(r'\n([ \t]*)"id"', obj).group(1)
            obj = cuerpo + f',\n{sangria}"toma": {toma}' + cola + "}"
        else:
            obj = cuerpo + f', "toma": {toma}' + cola + "}"
    nuevo = texto[:ini] + obj + texto[j + 1:]
    datos = json.loads(nuevo)
    linea = next(l for e in datos["escenas"] for l in e["lineas"] if l["id"] == lid)
    assert int(linea.get("toma", 1)) == toma, (lid, toma)
    return nuevo


def guardar(ep, ids, k, voces):
    d = SCRATCH / ep / f"t{k}"
    d.mkdir(parents=True, exist_ok=True)
    for lid in ids:
        for ext in ("wav", "mp3"):
            shutil.copy2(ESTUDIO / f"public/{ep}/voces/{lid}.{ext}", d / f"{lid}.{ext}")
    entradas = {lid: voces["lineas"][lid] for lid in ids}
    (d / "entradas.json").write_text(json.dumps(entradas, ensure_ascii=False), encoding="utf-8")
    return entradas


def nota(p, e):
    """Más es mejor. Entenderse manda: cada 10 % de error de Whisper resta 0,3."""
    return p["ovr"] + p["p808"] - 3 * float(e.get("error") or 0) - (1.0 if e.get("primera_mal") else 0)


def main():
    ep, extra, ids = sys.argv[1], int(sys.argv[2]), sys.argv[3:]
    guion_p = ESTUDIO / f"src/episodios/{ep}/guion.json"
    voces_p = ESTUDIO / f"src/episodios/{ep}/voces.json"
    voces = json.loads(voces_p.read_text(encoding="utf-8"))
    actual = {lid: int(voces["lineas"][lid].get("toma", 1)) for lid in ids}
    resultados = {lid: {} for lid in ids}  # lid -> toma -> (nota, puntos, entrada)

    def registrar(entradas, k_de):
        pts = puntuar.puntuar(ep, solo=set(entradas))
        for lid, e in entradas.items():
            resultados[lid][k_de(lid)] = (nota(pts[lid], e), pts[lid], e)

    # la toma actual de cada frase
    for k in set(actual.values()):
        grupo = [lid for lid in ids if actual[lid] == k]
        registrar(guardar(ep, grupo, k, voces), lambda lid: actual[lid])

    for ronda in range(1, extra + 1):
        grupo = ids
        texto = guion_p.read_text(encoding="utf-8")
        for lid in grupo:
            texto = poner_toma(texto, lid, actual[lid] + ronda)
        guion_p.write_text(texto, encoding="utf-8")
        print(f"\n— ronda {ronda}: {' '.join(f'{lid}·t{actual[lid] + ronda}' for lid in grupo)}", flush=True)
        subprocess.run([PY, "voces/generar_voces.py", ep], cwd=ESTUDIO, check=True,
                       env={**os.environ, "HF_HUB_DISABLE_TELEMETRY": "1"})
        voces = json.loads(voces_p.read_text(encoding="utf-8"))
        for k in sorted({actual[lid] + ronda for lid in grupo}):
            sub = [lid for lid in grupo if actual[lid] + ronda == k]
            registrar(guardar(ep, sub, k, voces), lambda lid, k=k: k)

    # la mejor de cada frase
    texto = guion_p.read_text(encoding="utf-8")
    voces = json.loads(voces_p.read_text(encoding="utf-8"))
    kmax = max(actual.values()) + extra
    print("\nfrase  " + "  ".join(f"toma{k:>2}" for k in range(1, kmax + 1)) + "   elegida")
    for lid in ids:
        mejor = max(resultados[lid], key=lambda k: resultados[lid][k][0])
        fila = "  ".join(f"{resultados[lid][k][0]:6.2f}" if k in resultados[lid] else "     -" for k in range(1, kmax + 1))
        print(f"{lid}  {fila}   {mejor}  (OVR {resultados[lid][mejor][1]['ovr']:.2f}, P.808 {resultados[lid][mejor][1]['p808']:.2f}, err {resultados[lid][mejor][2].get('error')})")
        d = SCRATCH / ep / f"t{mejor}"
        shutil.copy2(d / f"{lid}.wav", ESTUDIO / f"public/{ep}/voces/{lid}.wav")
        shutil.copy2(d / f"{lid}.mp3", ESTUDIO / f"public/{ep}/voces/{lid}.mp3")
        voces["lineas"][lid] = resultados[lid][mejor][2]
        texto = poner_toma(texto, lid, mejor)
    guion_p.write_text(texto, encoding="utf-8")
    voces_p.write_text(json.dumps(voces, ensure_ascii=False), encoding="utf-8")
    # reescribe el informe con lo restaurado (sin volver a transcribir)
    subprocess.run([PY, "voces/generar_voces.py", ep, "--sin-whisper"], cwd=ESTUDIO, check=True,
                   env={**os.environ, "HF_HUB_DISABLE_TELEMETRY": "1"})
    (SCRATCH / ep / "resultados.json").write_text(json.dumps(
        {lid: {str(k): {"nota": v[0], **v[1]} for k, v in r.items()} for lid, r in resultados.items()}, ensure_ascii=False, indent=1), encoding="utf-8")


if __name__ == "__main__":
    main()
