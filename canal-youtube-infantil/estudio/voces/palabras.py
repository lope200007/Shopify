#!/usr/bin/env python3
"""Momento de cada palabra en las voces de un episodio (para sincronizar).

    python voces/palabras.py ep02

Transcribe cada voz con Whisper pidiendo marcas de tiempo por palabra y
escribe src/episodios/<ep>/palabras.json: {frase: [[palabra, inicio, fin], ...]}
en fotogramas (30 fps) contados desde el principio del audio de la frase.
Así la animación cae justo en la palabra («uno… dos… ¡y tres!»).
"""
import json
import sys
from pathlib import Path

import soundfile as sf

sys.path.insert(0, str(Path(__file__).resolve().parent))
import generar_voces as g  # noqa: E402


def main():
    ep = sys.argv[1]
    carpeta = g.RAIZ / "public" / ep / "voces"
    guion = json.loads((g.RAIZ / "src" / "episodios" / ep / "guion.json").read_text(encoding="utf-8"))
    from faster_whisper import WhisperModel

    w = WhisperModel("small", device="cpu", compute_type="int8", download_root=str(g.CACHE / "whisper"))
    salida = {}
    for escena in guion["escenas"]:
        for linea in escena["lineas"]:
            audio, _ = sf.read(carpeta / f"{linea['id']}.wav", dtype="float32")
            segs, _ = w.transcribe(g.a_16k(audio), language="es", beam_size=5, word_timestamps=True)
            palabras = []
            for s in segs:
                for p in s.words or []:
                    palabras.append([p.word.strip(), round(p.start * g.FPS), round(p.end * g.FPS)])
            salida[linea["id"]] = palabras
            print(linea["id"], " ".join(f"{p[0]}@{p[1]}" for p in palabras), flush=True)
    destino = g.RAIZ / "src" / "episodios" / ep / "palabras.json"
    destino.write_text(json.dumps(salida, ensure_ascii=False), encoding="utf-8")
    print("escrito", destino.relative_to(g.RAIZ))


if __name__ == "__main__":
    main()
