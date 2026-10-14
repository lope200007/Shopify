#!/usr/bin/env python3
"""Genera las voces de un episodio a partir de su guion.

    python voces/generar_voces.py ep01            # solo las frases que falten
    python voces/generar_voces.py ep01 --forzar   # todas otra vez
    python voces/generar_voces.py ep01 --solo l031 l032
    python voces/generar_voces.py ep01 --personaje farolin narrador

Qué hace, por cada frase del guion (src/episodios/<ep>/guion.json):
  1. La sintetiza con el motor de su personaje (voces/personajes.json):
     - «qwen»: Qwen3-TTS (Apache 2.0) clonando la voz de referencia del
       personaje (voces/referencias/), que se diseñó a partir de una
       descripción: no es la voz de ninguna persona real. Es el motor actual.
     - «chatterbox»: Chatterbox multilingüe (MIT), mismo sistema.
     - «kokoro»: Kokoro-82M (Apache 2.0), el de los primeros episodios.
     Los motores grandes corren en su propio entorno de Python
     (voces/motores/, ver LEEME.md). Cada frase tiene su semilla: sale igual
     cada vez; para otra versión de una frase, se pone "toma": 2 en el guion.
  2. Si el personaje lo pide, le cambia el tono con el filtro rubberband de
     ffmpeg (con las voces nuevas no hace falta: subir mucho el tono era lo
     que las hacía sonar robóticas).
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
import zlib
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


def primera_mal(ref: str, hip: str) -> bool:
    """¿Whisper entendió distinta la primera palabra? Es la que más importa
    (el gancho de la frase) y un porcentaje global bajo la esconde."""
    r, h = normalizar_palabras(ref), normalizar_palabras(hip)
    return bool(r) and (not h or r[0] != h[0])


def con_aviso(e: dict) -> bool:
    return e.get("error", 0) > UMBRAL_ERROR or e.get("primera_mal", False)


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


def a_16k(audio: np.ndarray) -> np.ndarray:
    """Whisper espera audio a 16 kHz. Si se le pasa a 24 kHz sin convertir,
    lo «oye» 1,5 veces más lento y grave (y las marcas de tiempo salen mal)."""
    with tempfile.TemporaryDirectory() as tmp:
        ent, sal = Path(tmp) / "e.wav", Path(tmp) / "s.wav"
        sf.write(ent, audio, SR)
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(ent), "-ar", "16000", "-ac", "1", str(sal)], check=True)
        out, sr = sf.read(sal, dtype="float32")
    assert sr == 16000
    return out


def recortar_y_nivelar(audio: np.ndarray, fuerza: float = 0.7) -> np.ndarray:
    # recorta silencios del principio y del final (umbral relativo), dejando
    # un margen para no comerse una consonante suave del arranque («s», «h»)
    env = np.abs(audio)
    umbral = max(1e-4, env.max() * 0.015)
    activos = np.where(env > umbral)[0]
    if len(activos):
        audio = audio[max(0, activos[0] - int(0.04 * SR)): activos[-1] + int(0.05 * SR)]
    # nivel: RMS de las partes con voz → objetivo
    ventana = int(0.03 * SR)
    trozos = [audio[i:i + ventana] for i in range(0, len(audio) - ventana, ventana)]
    rms = np.array([np.sqrt(np.mean(t ** 2)) for t in trozos]) if trozos else np.array([np.sqrt(np.mean(audio ** 2))])
    voz = rms[rms > rms.max() * 0.2] if rms.max() > 0 else rms
    actual_db = 20 * np.log10(np.mean(voz) + 1e-9)
    # nivelar del todo aplana la interpretación (un grito queda igual que un
    # susurro, y eso suena robótico): se corrige el 70 % de la diferencia
    audio = audio * (10 ** (fuerza * (OBJETIVO_RMS_DB - actual_db) / 20))
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


def semilla_de(lid: str, texto: str, toma: int) -> int:
    return zlib.crc32(f"{lid}|{texto}|{toma}".encode("utf-8")) & 0x7FFFFFFF


def leer_a_24k(ruta: Path) -> np.ndarray:
    audio, sr = sf.read(ruta, dtype="float32")
    if audio.ndim > 1:
        audio = audio.mean(axis=1)
    if sr != SR:
        with tempfile.TemporaryDirectory() as tmp:
            sal = Path(tmp) / "s.wav"
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(ruta), "-ar", str(SR), "-ac", "1", str(sal)], check=True)
            audio, _ = sf.read(sal, dtype="float32")
    return audio


def sintetizar_externo(motor: str, conf: dict, personajes: dict, frases: list, carpeta: Path) -> dict:
    """Lanza un motor grande (Qwen3-TTS, Chatterbox) en su propio Python con
    todas las frases de una vez (cargar el modelo es lo que más tarda)."""
    python = os.path.expanduser(os.environ.get(f"FAROLIN_PY_{motor.upper()}", conf["python"]))
    if not Path(python).exists():
        raise SystemExit(f"Falta el entorno de Python del motor «{motor}» ({python}). Ver estudio/LEEME.md.")
    usados = {f["personaje"] for f in frases}
    trabajo = {
        "modelo": conf["modelo"],
        "hilos": conf.get("hilos", 4),
        "personajes": {
            n: {
                "referencia": str(RAIZ / personajes[n]["referencia"]),
                "ref_texto": personajes[n].get("ref_texto", ""),
                "exageracion": personajes[n].get("exageracion", 0.5),
            }
            for n in usados
        },
        "frases": frases,
        "salida": str(carpeta),
    }
    ruta = carpeta / "trabajo.json"
    ruta.write_text(json.dumps(trabajo, ensure_ascii=False), encoding="utf-8")
    print(f"Motor {motor}: {len(frases)} frases…", flush=True)
    subprocess.run([python, str(RAIZ / conf["script"]), str(ruta)], check=True)
    return {f["id"]: carpeta / f"{f['id']}.wav" for f in frases}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("episodio")
    ap.add_argument("--forzar", action="store_true")
    ap.add_argument("--solo", nargs="*", default=None)
    ap.add_argument("--personaje", nargs="*", default=None, help="regenera solo las frases de estos personajes")
    ap.add_argument("--sin-whisper", action="store_true")
    ap.add_argument("--revisar", action="store_true", help="solo vuelve a transcribir las voces que ya existen")
    args = ap.parse_args()

    guion_p = RAIZ / "src" / "episodios" / args.episodio / "guion.json"
    salida_json = guion_p.parent / "voces.json"
    informe_p = guion_p.parent / "informe-voces.md"
    carpeta_audio = RAIZ / "public" / args.episodio / "voces"
    carpeta_audio.mkdir(parents=True, exist_ok=True)

    guion = json.loads(guion_p.read_text(encoding="utf-8"))
    personajes = json.loads((RAIZ / "voces" / "personajes.json").read_text(encoding="utf-8"))
    previo = json.loads(salida_json.read_text(encoding="utf-8")) if salida_json.exists() else {"lineas": {}}

    motores = personajes.get("_motores", {})

    def conf_de(p):
        cfg = personajes[p]
        motor = cfg.get("motor", "kokoro")
        return motor, (cfg.get("kokoro", cfg) if motor == "kokoro" else cfg)

    whisper = None
    if not args.sin_whisper:
        from faster_whisper import WhisperModel
        whisper = WhisperModel("small", device="cpu", compute_type="int8", download_root=str(CACHE / "whisper"))

    def comprobar(entrada, audio, texto):
        if whisper is None:
            return
        segs, _ = whisper.transcribe(a_16k(audio), language="es", beam_size=5)
        oido = " ".join(s.text.strip() for s in segs)
        entrada["whisper"] = oido
        entrada["error"] = round(error_palabras(texto, oido), 2)
        entrada["primera_mal"] = primera_mal(texto, oido)

    resultado = {"episodio": args.episodio, "fps": FPS, "lineas": dict(previo.get("lineas", {}))}
    todas = [(linea, linea["id"], linea["p"], linea["t"], int(linea.get("toma", 1))) for escena in guion["escenas"] for linea in escena["lineas"]]

    # 1. Qué frases hay que (re)hacer
    pendientes = []
    for linea, lid, p, texto, toma in todas:
        archivo = carpeta_audio / f"{lid}.wav"
        motor, _ = conf_de(p)
        previa = resultado["lineas"].get(lid, {})
        hacer = (
            args.forzar
            or not archivo.exists()
            or not previa
            or previa.get("texto") != texto
            or previa.get("motor", "kokoro") != motor
            or int(previa.get("toma", 1)) != toma
        )
        if args.solo is not None:
            hacer = lid in args.solo
        if args.personaje is not None:
            hacer = p in args.personaje
        if args.revisar:
            hacer = False
            if lid in resultado["lineas"] and archivo.exists():
                audio_existente, _ = sf.read(archivo, dtype="float32")
                e = resultado["lineas"][lid]
                comprobar(e, audio_existente, texto)
                if con_aviso(e):
                    print(f"{lid} {p:9s} ⚠️ err={e['error']} primera_mal={e['primera_mal']}  «{texto}» → «{e['whisper']}»", flush=True)
        if hacer:
            pendientes.append((lid, p, texto, toma, motor))

    # 2. Sintetizar: los motores grandes, todas sus frases de una vez
    crudos = {}
    with tempfile.TemporaryDirectory() as tmp:
        por_motor = {}
        for lid, p, texto, toma, motor in pendientes:
            # el truco del yeísmo («ll» → «y») solo le hace falta a Kokoro: los
            # motores nuevos leen el español escrito tal cual
            dicho = texto_para_voz(texto) if motor == "kokoro" else texto
            por_motor.setdefault(motor, []).append({"id": lid, "personaje": p, "texto": dicho, "semilla": semilla_de(lid, texto, toma)})
        for motor, frases in por_motor.items():
            if motor == "kokoro":
                continue
            carpeta = Path(tmp) / motor
            carpeta.mkdir()
            for lid, ruta in sintetizar_externo(motor, motores[motor], personajes, frases, carpeta).items():
                crudos[lid] = leer_a_24k(ruta)
        if "kokoro" in por_motor:
            descargar_modelos()
            from kokoro_onnx import Kokoro
            kokoro = Kokoro(str(MODELO), str(VOCES_BIN))
            for f in por_motor["kokoro"]:
                _, cfg = conf_de(f["personaje"])
                total = sum(cfg["mezcla"].values())
                estilo = sum(kokoro.get_voice_style(v) * (w / total) for v, w in cfg["mezcla"].items())
                audio, sr = kokoro.create(f["texto"], voice=estilo, speed=cfg["velocidad"], lang="es")
                assert sr == SR, f"frecuencia inesperada {sr}"
                crudos[f["id"]] = audio.astype(np.float32)

    # 3. Tratar cada frase: tono (si se pide), silencios, volumen, boca y Whisper
    for lid, p, texto, toma, motor in pendientes:
        _, cfg = conf_de(p)
        audio = cambiar_tono(crudos[lid], float(cfg.get("semitonos", 0)), cfg.get("formantes", "preserved"))
        audio = recortar_y_nivelar(audio)
        sf.write(carpeta_audio / f"{lid}.wav", audio, SR, subtype="PCM_16")
        entrada = {
            "personaje": p,
            "texto": texto,
            "motor": motor,
            "toma": toma,
            "archivo": f"{args.episodio}/voces/{lid}.wav",
            "duracion": round(len(audio) / SR, 3),
            "boca": envolvente_boca(audio),
        }
        comprobar(entrada, audio, texto)
        resultado["lineas"][lid] = entrada
        aviso = " ⚠️" if con_aviso(entrada) else ""
        print(f"{lid} {p:9s} {entrada['duracion']:5.2f}s err={entrada.get('error', '-')}{aviso}  {texto}", flush=True)

    filas_informe = []
    for linea, lid, p, texto, toma in todas:
        e = resultado["lineas"][lid]
        filas_informe.append((lid, p, texto, e.get("whisper", ""), e.get("error", None), e["duracion"], con_aviso(e)))

    # El vídeo usa MP3 (unas 6 veces más ligero que WAV); el WAV no se sube a git.
    for lid, e in resultado["lineas"].items():
        wav = carpeta_audio / f"{lid}.wav"
        mp3 = carpeta_audio / f"{lid}.mp3"
        if wav.exists() and (not mp3.exists() or mp3.stat().st_mtime < wav.stat().st_mtime):
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-codec:a", "libmp3lame", "-b:a", "96k", str(mp3)], check=True)
        e["archivo"] = f"{args.episodio}/voces/{lid}.mp3"

    salida_json.write_text(json.dumps(resultado, ensure_ascii=False), encoding="utf-8")

    total = sum(f[5] for f in filas_informe)
    malas = [f for f in filas_informe if f[6]]
    lineas_md = [
        f"# Informe de voces · {args.episodio}",
        "",
        "Cada frase se sintetizó y después se transcribió con Whisper (modelo «small»).",
        "«Error» es la proporción de palabras que Whisper entendió distinto.",
        "No sustituye a escucharlas: dice si se entienden, no si suenan bien.",
        "",
        f"- Frases: {len(filas_informe)} · voz total: {total:.1f} s",
        f"- Con aviso (más de {int(UMBRAL_ERROR * 100)} % de error, o la primera palabra mal): {len(malas)}",
        "",
        "| Frase | Personaje | Error | Texto | Lo que entendió Whisper |",
        "|---|---|---|---|---|",
    ]
    for lid, p, texto, oido, err, _, aviso in filas_informe:
        marca = " ⚠️" if aviso else ""
        lineas_md.append(f"| {lid} | {p} | {'' if err is None else f'{err:.2f}'}{marca} | {texto} | {oido} |")
    informe_p.write_text("\n".join(lineas_md) + "\n", encoding="utf-8")
    print(f"\nVoz total {total:.1f} s · {len(malas)} frases con aviso · informe en {informe_p.relative_to(RAIZ)}")


if __name__ == "__main__":
    sys.exit(main())
