#!/usr/bin/env python3
"""Genera las voces de un episodio a partir de su guion.

    python voces/generar_voces.py ep01            # solo las frases que falten
    python voces/generar_voces.py ep01 --forzar   # todas otra vez
    python voces/generar_voces.py ep01 --solo l031 l032
    python voces/generar_voces.py ep01 --personaje farolin narrador

Qué hace, por cada frase del guion (src/episodios/<ep>/guion.json):
  1. La sintetiza con Kokoro-82M (licencia Apache 2.0, uso comercial permitido)
     con la mezcla de voces de su personaje (voces/personajes.json).
  2. Le cambia el tono con el filtro rubberband de ffmpeg.
  3. Recorta silencios, iguala el volumen y la guarda en public/<ep>/voces/.
  4. Calcula la apertura de la boca fotograma a fotograma (30 fps).
  5. La transcribe con Whisper y compara con el texto: si no se entiende,
     lo dice. Es la comprobación que sustituye a escucharla.

Escribe src/episodios/<ep>/voces.json (duraciones y bocas) y
src/episodios/<ep>/informe-voces.md (lo que Whisper entendió).

Los modelos (unos 400 MB) se descargan la primera vez en
~/.cache/farolin-y-galleta/ y no se suben al repositorio.
"""
import argparse
import json
import os
import re
import subprocess
import sys
import tempfile
import unicodedata
import urllib.request
from pathlib import Path

import numpy as np
import soundfile as sf

RAIZ = Path(__file__).resolve().parent.parent  # estudio/
CACHE = Path(os.environ.get("FAROLIN_CACHE", Path.home() / ".cache" / "farolin-y-galleta"))
MODELO = CACHE / "kokoro-v1.0.onnx"
VOCES_BIN = CACHE / "voices-v1.0.bin"
URLS = {
    MODELO: "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx",
    VOCES_BIN: "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin",
}
FPS = 30
SR = 24000
PAUSA_INICIO = 0.08
PAUSA_FINAL = 0.12
OBJETIVO_RMS_DB = -20.0
UMBRAL_ERROR = 0.25  # proporción de palabras mal entendidas que se avisa


def descargar_modelos():
    CACHE.mkdir(parents=True, exist_ok=True)
    for destino, url in URLS.items():
        if destino.exists() and destino.stat().st_size > 1_000_000:
            continue
        print(f"Descargando {destino.name}…", flush=True)
        urllib.request.urlretrieve(url, destino)


def texto_para_voz(t: str) -> str:
    """Ajustes que solo afectan a cómo se pronuncia, no al texto en pantalla."""
    # Yeísmo: en España casi todo el mundo pronuncia «ll» como «y».
    t = t.replace("ll", "y").replace("Ll", "Y").replace("LL", "Y")
    t = t.replace("…", "...")
    return t


def normalizar_palabras(t: str):
    t = unicodedata.normalize("NFD", t.lower())
    t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    return re.findall(r"[a-zñ]+", t)


def error_palabras(ref: str, hip: str) -> float:
    r, h = normalizar_palabras(ref), normalizar_palabras(hip)
    if not r:
        return 0.0
    d = np.zeros((len(r) + 1, len(h) + 1), dtype=int)
    d[:, 0] = range(len(r) + 1)
    d[0, :] = range(len(h) + 1)
    for i in range(1, len(r) + 1):
        for j in range(1, len(h) + 1):
            d[i, j] = min(d[i - 1, j] + 1, d[i, j - 1] + 1, d[i - 1, j - 1] + (r[i - 1] != h[j - 1]))
    return d[len(r), len(h)] / len(r)


def cambiar_tono(audio: np.ndarray, semitonos: float, formantes: str) -> np.ndarray:
    if abs(semitonos) < 0.01:
        return audio
    with tempfile.TemporaryDirectory() as tmp:
        ent, sal = Path(tmp) / "e.wav", Path(tmp) / "s.wav"
        sf.write(ent, audio, SR)
        factor = 2 ** (semitonos / 12)
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-i", str(ent),
             "-af", f"rubberband=pitch={factor:.5f}:formant={formantes}:pitchq=quality",
             str(sal)],
            check=True,
        )
        out, _ = sf.read(sal, dtype="float32")
    return out


def recortar_y_nivelar(audio: np.ndarray) -> np.ndarray:
    # recorta silencios del principio y del final (umbral relativo)
    env = np.abs(audio)
    umbral = max(1e-4, env.max() * 0.02)
    activos = np.where(env > umbral)[0]
    if len(activos):
        audio = audio[max(0, activos[0] - int(0.01 * SR)): activos[-1] + int(0.03 * SR)]
    # nivel: RMS de las partes con voz → objetivo
    ventana = int(0.03 * SR)
    trozos = [audio[i:i + ventana] for i in range(0, len(audio) - ventana, ventana)]
    rms = np.array([np.sqrt(np.mean(t ** 2)) for t in trozos]) if trozos else np.array([np.sqrt(np.mean(audio ** 2))])
    voz = rms[rms > rms.max() * 0.2] if rms.max() > 0 else rms
    actual_db = 20 * np.log10(np.mean(voz) + 1e-9)
    audio = audio * (10 ** ((OBJETIVO_RMS_DB - actual_db) / 20))
    pico = np.abs(audio).max()
    if pico > 0.89:  # -1 dBFS
        audio = audio * (0.89 / pico)
    silencio_ini = np.zeros(int(PAUSA_INICIO * SR), dtype=np.float32)
    silencio_fin = np.zeros(int(PAUSA_FINAL * SR), dtype=np.float32)
    return np.concatenate([silencio_ini, audio.astype(np.float32), silencio_fin])


def envolvente_boca(audio: np.ndarray) -> list:
    """Apertura de la boca (0..1) en cada fotograma, a partir del volumen."""
    paso = SR // FPS
    valores = []
    for i in range(0, len(audio), paso):
        trozo = audio[i:i + paso]
        rms = np.sqrt(np.mean(trozo ** 2)) if len(trozo) else 0.0
        db = 20 * np.log10(rms + 1e-9)
        valores.append(float(np.clip((db + 42) / 26, 0, 1)))
    # suavizado: abre rápido, cierra algo más despacio
    salida, previo = [], 0.0
    for v in valores:
        previo = v if v > previo else previo * 0.55 + v * 0.45
        salida.append(round(previo, 2))
    return salida


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("episodio")
    ap.add_argument("--forzar", action="store_true")
    ap.add_argument("--solo", nargs="*", default=None)
    ap.add_argument("--personaje", nargs="*", default=None, help="regenera solo las frases de estos personajes")
    ap.add_argument("--sin-whisper", action="store_true")
    args = ap.parse_args()

    guion_p = RAIZ / "src" / "episodios" / args.episodio / "guion.json"
    salida_json = guion_p.parent / "voces.json"
    informe_p = guion_p.parent / "informe-voces.md"
    carpeta_audio = RAIZ / "public" / args.episodio / "voces"
    carpeta_audio.mkdir(parents=True, exist_ok=True)

    guion = json.loads(guion_p.read_text(encoding="utf-8"))
    personajes = json.loads((RAIZ / "voces" / "personajes.json").read_text(encoding="utf-8"))
    previo = json.loads(salida_json.read_text(encoding="utf-8")) if salida_json.exists() else {"lineas": {}}

    descargar_modelos()
    from kokoro_onnx import Kokoro
    kokoro = Kokoro(str(MODELO), str(VOCES_BIN))

    estilos = {}
    for nombre, cfg in personajes.items():
        if nombre.startswith("_"):
            continue
        total = sum(cfg["mezcla"].values())
        estilos[nombre] = sum(kokoro.get_voice_style(v) * (w / total) for v, w in cfg["mezcla"].items())

    whisper = None
    if not args.sin_whisper:
        from faster_whisper import WhisperModel
        whisper = WhisperModel("small", device="cpu", compute_type="int8", download_root=str(CACHE / "whisper"))

    resultado = {"episodio": args.episodio, "fps": FPS, "lineas": dict(previo.get("lineas", {}))}
    filas_informe = []
    for escena in guion["escenas"]:
        for linea in escena["lineas"]:
            lid, p, texto = linea["id"], linea["p"], linea["t"]
            archivo = carpeta_audio / f"{lid}.wav"
            hacer = args.forzar or not archivo.exists() or lid not in resultado["lineas"] or resultado["lineas"][lid].get("texto") != texto
            if args.solo is not None:
                hacer = lid in args.solo
            if args.personaje is not None:
                hacer = p in args.personaje
            if hacer:
                cfg = personajes[p]
                audio, sr = kokoro.create(texto_para_voz(texto), voice=estilos[p], speed=cfg["velocidad"], lang="es")
                assert sr == SR, f"frecuencia inesperada {sr}"
                audio = cambiar_tono(audio.astype(np.float32), cfg["semitonos"], cfg["formantes"])
                audio = recortar_y_nivelar(audio)
                sf.write(archivo, audio, SR, subtype="PCM_16")
                entrada = {
                    "personaje": p,
                    "texto": texto,
                    "archivo": f"{args.episodio}/voces/{lid}.wav",
                    "duracion": round(len(audio) / SR, 3),
                    "boca": envolvente_boca(audio),
                }
                if whisper is not None:
                    segs, _ = whisper.transcribe(audio, language="es", beam_size=5)
                    oido = " ".join(s.text.strip() for s in segs)
                    entrada["whisper"] = oido
                    entrada["error"] = round(error_palabras(texto, oido), 2)
                resultado["lineas"][lid] = entrada
                aviso = " ⚠️" if entrada.get("error", 0) > UMBRAL_ERROR else ""
                print(f"{lid} {p:9s} {entrada['duracion']:5.2f}s err={entrada.get('error', '-')}{aviso}  {texto}", flush=True)
            e = resultado["lineas"][lid]
            filas_informe.append((lid, p, texto, e.get("whisper", ""), e.get("error", None), e["duracion"]))

    # El vídeo usa MP3 (unas 6 veces más ligero que WAV); el WAV no se sube a git.
    for lid, e in resultado["lineas"].items():
        wav = carpeta_audio / f"{lid}.wav"
        mp3 = carpeta_audio / f"{lid}.mp3"
        if wav.exists() and (not mp3.exists() or mp3.stat().st_mtime < wav.stat().st_mtime):
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-codec:a", "libmp3lame", "-b:a", "96k", str(mp3)], check=True)
        e["archivo"] = f"{args.episodio}/voces/{lid}.mp3"

    salida_json.write_text(json.dumps(resultado, ensure_ascii=False), encoding="utf-8")

    total = sum(f[5] for f in filas_informe)
    malas = [f for f in filas_informe if f[4] is not None and f[4] > UMBRAL_ERROR]
    lineas_md = [
        f"# Informe de voces · {args.episodio}",
        "",
        "Cada frase se sintetizó y después se transcribió con Whisper (modelo «small»).",
        "«Error» es la proporción de palabras que Whisper entendió distinto.",
        "No sustituye a escucharlas: dice si se entienden, no si suenan bien.",
        "",
        f"- Frases: {len(filas_informe)} · voz total: {total:.1f} s",
        f"- Con más de {int(UMBRAL_ERROR * 100)} % de error: {len(malas)}",
        "",
        "| Frase | Personaje | Error | Texto | Lo que entendió Whisper |",
        "|---|---|---|---|---|",
    ]
    for lid, p, texto, oido, err, _ in filas_informe:
        marca = " ⚠️" if err is not None and err > UMBRAL_ERROR else ""
        lineas_md.append(f"| {lid} | {p} | {'' if err is None else f'{err:.2f}'}{marca} | {texto} | {oido} |")
    informe_p.write_text("\n".join(lineas_md) + "\n", encoding="utf-8")
    print(f"\nVoz total {total:.1f} s · {len(malas)} frases con aviso · informe en {informe_p.relative_to(RAIZ)}")


if __name__ == "__main__":
    sys.exit(main())
