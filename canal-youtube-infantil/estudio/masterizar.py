#!/usr/bin/env python3
"""Ajusta el volumen final de un vídeo al nivel de YouTube (-14 LUFS).

    python3 masterizar.py out/episodio01-bruto.mp4 out/episodio01.mp4

Dos pasadas de ffmpeg «loudnorm»: la primera mide, la segunda corrige con
esas medidas (más precisa que una sola pasada). Quita también los graves por
debajo de 40 Hz, que no se oyen en un móvil y solo restan volumen útil.
La imagen no se vuelve a comprimir: se copia tal cual.
Al final vuelve a medir el resultado, para no fiarse del ajuste.
"""
import json
import re
import subprocess
import sys

OBJETIVO = {"I": -14.0, "TP": -1.5, "LRA": 11.0}


def medir(ruta: str, filtro_previo: str = "") -> dict:
    filtro = (filtro_previo + "," if filtro_previo else "") + "loudnorm=I={I}:TP={TP}:LRA={LRA}:print_format=json".format(**OBJETIVO)
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", ruta, "-af", filtro, "-f", "null", "-"],
                       capture_output=True, text=True)
    bloque = re.findall(r"\{[^{}]*\"input_i\"[^{}]*\}", r.stderr)
    if not bloque:
        raise SystemExit("No pude medir el audio:\n" + r.stderr[-2000:])
    return json.loads(bloque[-1])


def main(entrada: str, salida: str):
    pasa_altos = "highpass=f=40"
    m = medir(entrada, pasa_altos)
    print(f"Antes:   {float(m['input_i']):6.1f} LUFS · pico {float(m['input_tp']):5.1f} dBTP")
    filtro = (
        f"{pasa_altos},loudnorm=I={OBJETIVO['I']}:TP={OBJETIVO['TP']}:LRA={OBJETIVO['LRA']}"
        f":measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
        f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
    )
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", entrada, "-af", filtro,
                    "-ar", "48000", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", salida],
                   check=True)
    d = medir(salida)
    print(f"Después: {float(d['input_i']):6.1f} LUFS · pico {float(d['input_tp']):5.1f} dBTP")
    if abs(float(d["input_i"]) - OBJETIVO["I"]) > 1.0:
        raise SystemExit("El volumen final no quedó cerca de -14 LUFS: revisar")


if __name__ == "__main__":
    main(*sys.argv[1:3])
