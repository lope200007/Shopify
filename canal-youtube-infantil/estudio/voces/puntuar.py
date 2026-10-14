"""Puntúa la calidad de cada frase de un episodio y señala las que conviene repetir.

Yo no puedo escuchar, así que mido. DNSMOS (Microsoft, licencia MIT; modelos
ONNX que trae el paquete `speechmos`, sin conexión a internet) predice la
nota que pondría una persona a la voz: SIG (limpieza), OVR (global) y P.808.

Ojo: DNSMOS puntúa peor **cualquier** voz infantil, porque se entrenó sobre
todo con adultos. Por eso cada frase se compara con la mediana de su **misma
voz**, nunca con la de otro personaje. Una frase muy por debajo de su propia
voz suele tener un fallo (un arranque raro, una vocal estirada): se repite con
`"toma": 2` (o 3) en guion.json y se queda la toma que mejor puntúe.

    ~/.venv-farolin/bin/python voces/puntuar.py ep02            # tabla de las peores
    ~/.venv-farolin/bin/python voces/puntuar.py ep02 --json x.json

Instalación (una vez): ~/.venv-farolin/bin/pip install speechmos==0.0.1.1
"""
import argparse
import importlib.util
import json
import subprocess
import sys
from pathlib import Path

import librosa
import numpy as np
import onnxruntime as ort

RAIZ = Path(__file__).resolve().parent.parent
# Margen por debajo de la mediana de su voz (OVR + P.808) a partir del cual se
# recomienda otra toma. Con 0,6 salieron 6 de 65 frases en el episodio 2.
UMBRAL = 0.6


def modelos():
    spec = importlib.util.find_spec("speechmos")
    if spec is None:
        sys.exit("Falta el paquete speechmos: ~/.venv-farolin/bin/pip install speechmos==0.0.1.1")
    carpeta = Path(spec.origin).parent / "dnsmos_models"
    return (ort.InferenceSession(str(carpeta / "sig_bak_ovr.onnx")),
            ort.InferenceSession(str(carpeta / "model_v8.onnx")))


def leer_16k(ruta):
    pcm = subprocess.run(["ffmpeg", "-v", "quiet", "-i", str(ruta), "-ac", "1", "-ar", "16000", "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(pcm, dtype="float32")


def dnsmos(audio16, principal, p808):
    """Igual que el DNSMOS oficial: 9,01 s de audio (repetido si la frase es más corta)."""
    largo = int(9.01 * 16000)
    a = audio16.copy()
    while len(a) < largo:
        a = np.append(a, a)
    a = a[:largo].astype("float32")
    mel = librosa.feature.melspectrogram(y=a[:-160], sr=16000, n_fft=321, hop_length=160, n_mels=120)
    mel = ((librosa.power_to_db(mel, ref=np.max) + 40) / 40).T.astype("float32")
    p = p808.run(None, {"input_1": mel[np.newaxis]})[0][0][0]
    s, _, o = principal.run(None, {"input_1": a[np.newaxis]})[0][0]
    sig = np.poly1d([-0.08397278, 1.22083953, 0.0052439])(s)
    ovr = np.poly1d([-0.06766283, 1.11546468, 0.04602535])(o)
    return float(sig), float(ovr), float(p)


def puntuar(ep, solo=None):
    principal, p808 = modelos()
    voces = json.loads((RAIZ / f"src/episodios/{ep}/voces.json").read_text(encoding="utf-8"))["lineas"]
    res = {}
    for lid, info in voces.items():
        if solo and lid not in solo:
            continue
        sig, ovr, p = dnsmos(leer_16k(RAIZ / "public" / info["archivo"]), principal, p808)
        res[lid] = {"personaje": info["personaje"], "toma": info.get("toma", 1), "sig": round(sig, 3),
                    "ovr": round(ovr, 3), "p808": round(p, 3), "error": info.get("error", 0.0), "texto": info["texto"]}
    return res


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("ep")
    ap.add_argument("--json", help="guardar todas las puntuaciones en este archivo")
    ap.add_argument("--umbral", type=float, default=UMBRAL,
                    help="caída bajo la mediana de su voz para recomendar otra toma (0 = toda la mitad floja)")
    ap.add_argument("--personaje", nargs="*", help="solo estos personajes")
    args = ap.parse_args()
    res = puntuar(args.ep)
    if args.json:
        Path(args.json).write_text(json.dumps(res, ensure_ascii=False, indent=1), encoding="utf-8")
    repetir = []
    for quien in sorted({r["personaje"] for r in res.values()}):
        if args.personaje and quien not in args.personaje:
            continue
        filas = {k: r for k, r in res.items() if r["personaje"] == quien}
        med = {m: float(np.median([r[m] for r in filas.values()])) for m in ("ovr", "p808")}
        print(f"\n{quien} ({len(filas)} frases): mediana OVR {med['ovr']:.2f} · P.808 {med['p808']:.2f}")
        for k, r in sorted(filas.items(), key=lambda kv: kv[1]["ovr"] + kv[1]["p808"]):
            caida = (med["ovr"] - r["ovr"]) + (med["p808"] - r["p808"])
            if caida < args.umbral or caida <= 0:
                break
            repetir.append(k)
            print(f"  ⚠️ {k}  OVR {r['ovr']:.2f}  P.808 {r['p808']:.2f}  (−{caida:.2f} bajo su voz)  {r['texto'][:58]}")
    print(f"\nPara repetir ({len(repetir)}): {' '.join(repetir) if repetir else 'ninguna'}")


if __name__ == "__main__":
    main()
