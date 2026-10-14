#!/usr/bin/env python3
"""Motor de voz Chatterbox multilingüe (MIT, Resemble AI): clona la voz de
referencia de cada personaje. Con "modelo": "es-es" usa el afinado de español
de España (t3_es_es + s3gen_v3) si carga sin piezas que falten.

    python motores/chatterbox_clonar.py trabajo.json

Mismo formato de trabajo que qwen_clonar.py; cada personaje puede llevar
"exageracion" (0,5 = normal; más alto = más expresivo y algo más rápido).
Chatterbox marca su audio con una marca de agua inaudible (Perth).
"""
import json
import sys
import time
from pathlib import Path

import soundfile as sf
import torch
from huggingface_hub import hf_hub_download
from safetensors.torch import load_file
from chatterbox.mtl_tts import ChatterboxMultilingualTTS


def cargar(modelo_nombre):
    m = ChatterboxMultilingualTTS.from_pretrained(device="cpu")
    if modelo_nombre == "es-es":
        repo = "ResembleAI/Chatterbox-Multilingual-es-es"
        t3 = load_file(hf_hub_download(repo, "t3_es_es.safetensors"))
        if "model" in t3:
            t3 = t3["model"][0]
        faltan, sobran = m.t3.load_state_dict(t3, strict=False)
        if faltan or sobran:
            raise SystemExit(f"t3 es-es no encaja: faltan {len(faltan)}, sobran {len(sobran)}")
        s3 = load_file(hf_hub_download(repo, "s3gen_v3.safetensors"))
        faltan, sobran = m.s3gen.load_state_dict(s3, strict=False)
        # el archivo v3 no trae dos tablas fijas del tokenizador (filtros mel y
        # ventana, que no se aprenden): se quedan las que ya estaban cargadas
        faltan = [k for k in faltan if k not in ("tokenizer._mel_filters", "tokenizer.window")]
        if faltan or sobran:
            raise SystemExit(f"s3gen v3 no encaja: faltan {faltan}, sobran {sobran}")
    return m


def main():
    trabajo = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    salida = Path(trabajo["salida"])
    salida.mkdir(parents=True, exist_ok=True)
    torch.set_num_threads(int(trabajo.get("hilos", 4)))
    t0 = time.time()
    modelo = cargar(trabajo.get("modelo", "multilingue"))
    print(f"modelo {trabajo.get('modelo', 'multilingue')} cargado en {time.time() - t0:.0f} s", flush=True)
    for f in trabajo["frases"]:
        p = trabajo["personajes"][f["personaje"]]
        exag = float(p.get("exageracion", 0.5))
        torch.manual_seed(int(f.get("semilla", 0)))
        t = time.time()
        wav = modelo.generate(
            f["texto"],
            language_id="es",
            audio_prompt_path=p["referencia"],
            exaggeration=exag,
            cfg_weight=float(p.get("cfg", 0.5 if exag <= 0.6 else 0.35)),
        )
        a = wav.squeeze(0).numpy()
        sf.write(salida / f"{f['id']}.wav", a, modelo.sr)
        print(f"{f['id']} {f['personaje']:9s} {len(a) / modelo.sr:5.2f} s en {time.time() - t:4.0f} s", flush=True)


if __name__ == "__main__":
    main()
