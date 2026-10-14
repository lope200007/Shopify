#!/usr/bin/env python3
"""Motor de voz Qwen3-TTS (Apache 2.0): clona la voz de referencia de cada
personaje y dice las frases de un trabajo.

Lo llama voces/generar_voces.py con el Python de su propio entorno (los
modelos necesitan PyTorch y no conviven con el de Kokoro):

    python motores/qwen_clonar.py trabajo.json

trabajo.json = {
  "modelo": "Qwen/Qwen3-TTS-12Hz-1.7B-Base",
  "personajes": {"farolin": {"referencia": "ruta.flac", "ref_texto": "..."}},
  "frases": [{"id": "l001", "personaje": "farolin", "texto": "...", "semilla": 1}],
  "salida": "carpeta"
}

Escribe <salida>/<id>.wav (24 kHz, sin tratar). Cada frase lleva su semilla:
la misma frase sale igual cada vez que se genera.
"""
import json
import sys
import time
from pathlib import Path

import soundfile as sf
import torch
from qwen_tts import Qwen3TTSModel


def main():
    trabajo = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    salida = Path(trabajo["salida"])
    salida.mkdir(parents=True, exist_ok=True)
    torch.set_num_threads(int(trabajo.get("hilos", 4)))
    t0 = time.time()
    modelo = Qwen3TTSModel.from_pretrained(trabajo["modelo"], device_map="cpu", dtype=torch.float32)
    print(f"modelo cargado en {time.time() - t0:.0f} s", flush=True)
    avisos = {}
    for nombre, p in trabajo["personajes"].items():
        avisos[nombre] = modelo.create_voice_clone_prompt(ref_audio=p["referencia"], ref_text=p["ref_texto"], x_vector_only_mode=False)
    for f in trabajo["frases"]:
        torch.manual_seed(int(f.get("semilla", 0)))
        t = time.time()
        wavs, sr = modelo.generate_voice_clone(text=f["texto"], language="Spanish", voice_clone_prompt=avisos[f["personaje"]])
        sf.write(salida / f"{f['id']}.wav", wavs[0], sr)
        print(f"{f['id']} {f['personaje']:9s} {len(wavs[0]) / sr:5.2f} s en {time.time() - t:4.0f} s", flush=True)


if __name__ == "__main__":
    main()
