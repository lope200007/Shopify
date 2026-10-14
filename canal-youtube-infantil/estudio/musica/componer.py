#!/usr/bin/env python3
"""Compone la música y los efectos del canal, todo sintetizado aquí.

    python musica/componer.py

Todo es original (síntesis con numpy), así que no hay derechos de terceros ni
reclamaciones de Content ID. Escribe MP3 en public/musica/ y public/efectos/.

Instrumentos: cuerda pulsada (Karplus-Strong, suena a ukelele), marimba,
campanitas, bajo suave, colchón (pad), maraca y bombo suave. Reverberación
por convolución con una sala sintética. Todo determinista (misma semilla,
mismo resultado).
"""
import subprocess
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf

SR = 44100
RAIZ = Path(__file__).resolve().parent.parent
DIR_MUSICA = RAIZ / "public" / "musica"
DIR_EFECTOS = RAIZ / "public" / "efectos"
rng = np.random.default_rng(7)


def nota(n):
    """Nota MIDI → frecuencia (69 = La 440)."""
    return 440.0 * 2 ** ((n - 69) / 12)


NOTAS = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}


def m(nombre: str) -> int:
    """'C4' → 60, 'F#3' → 54, 'Bb4' → 70."""
    base = NOTAS[nombre[0]]
    resto = nombre[1:]
    if resto.startswith("#"):
        base += 1
        resto = resto[1:]
    elif resto.startswith("b"):
        base -= 1
        resto = resto[1:]
    return 12 * (int(resto) + 1) + base


# ---------------------------------------------------------------- instrumentos

def env_adsr(n, a=0.005, d=0.1, s=0.6, r=0.2, dur=None):
    t = np.arange(n) / SR
    dur = dur if dur is not None else n / SR
    e = np.ones(n) * s
    e[t < a] = t[t < a] / a
    m_ = (t >= a) & (t < a + d)
    e[m_] = 1 - (1 - s) * (t[m_] - a) / d
    rel = t >= dur - r
    e[rel] = e[rel] * np.clip((dur - t[rel]) / r, 0, 1)
    return e


def pulsada(freq, dur, brillo=0.5, vol=1.0):
    """Cuerda pulsada (Karplus-Strong): ukelele/guitarrita."""
    n = int(dur * SR)
    periodo = max(2, int(SR / freq))
    buf = rng.uniform(-1, 1, periodo)
    # suaviza el ruido inicial para un ataque menos áspero
    for _ in range(int(3 * (1 - brillo)) + 1):
        buf = 0.5 * (buf + np.roll(buf, 1))
    out = np.zeros(n)
    amort = 0.996 - 0.004 * (1 - brillo)
    idx = 0
    for i in range(n):
        out[i] = buf[idx]
        sig = (idx + 1) % periodo
        buf[idx] = amort * 0.5 * (buf[idx] + buf[sig])
        idx = sig
    out *= np.exp(-np.arange(n) / SR * 1.6)
    return out * vol


def marimba(freq, dur, vol=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = (np.sin(2 * np.pi * freq * t) * np.exp(-t * 3.2)
         + 0.35 * np.sin(2 * np.pi * freq * 3.93 * t) * np.exp(-t * 14)
         + 0.08 * np.sin(2 * np.pi * freq * 9.6 * t) * np.exp(-t * 30))
    ataque = np.clip(t / 0.002, 0, 1)
    return s * ataque * vol


def campanita(freq, dur, vol=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    parciales = [(1, 1.0, 2.2), (2.76, 0.5, 4.0), (5.40, 0.25, 7.0), (8.93, 0.12, 11.0)]
    s = sum(a * np.sin(2 * np.pi * freq * r * t) * np.exp(-t * d) for r, a, d in parciales)
    return s * np.clip(t / 0.001, 0, 1) * vol


def bajo(freq, dur, vol=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * freq * t) + 0.25 * np.sin(2 * np.pi * 2 * freq * t)
    return s * env_adsr(n, a=0.01, d=0.15, s=0.55, r=0.08) * vol


def colchon(freqs, dur, vol=1.0):
    """Pad suave: senos ligeramente desafinados con ataque lento."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for f in freqs:
        for det in (-0.25, 0.0, 0.25):
            ff = f * 2 ** (det / 100 * 10)
            s += np.sin(2 * np.pi * ff * t + rng.uniform(0, 6.28)) + 0.15 * np.sin(2 * np.pi * 2 * ff * t)
    s /= max(1, len(freqs) * 3)
    return s * env_adsr(n, a=min(0.8, dur * 0.3), d=0.2, s=0.9, r=min(0.9, dur * 0.3)) * vol


def maraca(dur=0.08, vol=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    ruido = rng.normal(0, 1, n)
    ruido = np.diff(ruido, prepend=0)  # agudo
    return ruido * np.exp(-t * 45) * vol * 0.35


def bombo(vol=1.0):
    n = int(0.25 * SR)
    t = np.arange(n) / SR
    f = 95 * np.exp(-t * 18) + 45
    fase = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(fase) * np.exp(-t * 14) * vol


# ---------------------------------------------------------------- utilidades

def mezclar_en(pista, sonido, inicio_s, pan=0.0):
    """Suma `sonido` (mono) en `pista` (estéreo) desde `inicio_s`, con panorámica."""
    i = int(inicio_s * SR)
    if i >= len(pista):
        return
    fin = min(len(pista), i + len(sonido))
    trozo = sonido[: fin - i]
    izq = np.sqrt(0.5 * (1 - pan))
    der = np.sqrt(0.5 * (1 + pan))
    pista[i:fin, 0] += trozo * izq
    pista[i:fin, 1] += trozo * der


def reverb(pista, mezcla=0.25, cola=1.6):
    """Convolución con una respuesta de sala sintética (ruido que decae)."""
    n = int(cola * SR)
    t = np.arange(n) / SR
    salida = np.zeros_like(pista)
    for canal in range(2):
        ir = rng.normal(0, 1, n) * np.exp(-t * 6.9 / cola)
        # suaviza la cola: menos agudos al final
        for _ in range(2):
            ir = 0.5 * (ir + np.roll(ir, 1))
        ir[: int(0.012 * SR)] = 0  # pre-delay
        ir /= np.sqrt(np.sum(ir ** 2))
        largo = len(pista[:, canal]) + n - 1
        nfft = 1 << (largo - 1).bit_length()
        conv = np.fft.irfft(np.fft.rfft(pista[:, canal], nfft) * np.fft.rfft(ir, nfft), nfft)[: len(pista)]
        salida[:, canal] = conv
    return pista * (1 - mezcla) + salida * mezcla * 1.6


def fundido_bucle(pista, solape_s=1.5):
    """Hace que el final enlace con el principio (para músicas en bucle)."""
    n = int(solape_s * SR)
    cola = pista[-n:].copy()
    pista = pista[:-n]
    rampa = np.linspace(0, 1, n)[:, None]
    pista[:n] = pista[:n] * rampa + cola * (1 - rampa)
    return pista


def guardar(pista, ruta: Path, pico=0.8):
    ruta.parent.mkdir(parents=True, exist_ok=True)
    p = np.abs(pista).max()
    if p > 0:
        pista = pista / p * pico
    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / "x.wav"
        sf.write(wav, pista.astype(np.float32), SR)
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-codec:a", "libmp3lame", "-b:a", "160k", str(ruta)], check=True)
    print(f"  {ruta.relative_to(RAIZ)}  {len(pista) / SR:5.1f} s")


ACORDES = {
    "C": ["C4", "E4", "G4"], "G": ["G3", "B3", "D4"], "Am": ["A3", "C4", "E4"], "F": ["F3", "A3", "C4"],
    "Dm": ["D4", "F4", "A4"], "Em": ["E4", "G4", "B4"], "Bb": ["Bb3", "D4", "F4"],
}
RAIZ_BAJO = {"C": "C2", "G": "G2", "Am": "A2", "F": "F2", "Dm": "D2", "Em": "E2", "Bb": "Bb1"}


def rasgueo(pista, acorde, t, dur, vol=0.5, arriba=False, pan=-0.2):
    notas = ACORDES[acorde]
    orden = notas[::-1] if arriba else notas
    for k, nn in enumerate(orden):
        mezclar_en(pista, pulsada(nota(m(nn) + 12), dur, brillo=0.55, vol=vol * (0.9 if arriba else 1.0)), t + k * 0.014, pan)


# ---------------------------------------------------------------- músicas

def tema_canal():
    """Sintonía de 8 s: el «motivo» del canal (sube como una lucecita)."""
    bpm = 120
    b = 60 / bpm
    dur = 16 * b + 1.5
    pista = np.zeros((int(dur * SR), 2))
    prog = ["C", "Am", "F", "G"]
    for i, a in enumerate(prog):
        t0 = i * 4 * b
        for k in range(4):
            rasgueo(pista, a, t0 + k * b, b * 1.2, vol=0.42, arriba=(k % 2 == 1))
            mezclar_en(pista, maraca(vol=0.6), t0 + k * b + b / 2, pan=0.4)
        mezclar_en(pista, bajo(nota(m(RAIZ_BAJO[a])), 4 * b * 0.95, vol=0.55), t0)
        mezclar_en(pista, bombo(0.5), t0)
        mezclar_en(pista, bombo(0.4), t0 + 2 * b)
    # motivo: Sol-Do-Mi-Sol (Fa-ro-lín y Ga-lle-ta) y respuesta
    melodia = [("G5", 0, 1), ("C6", 1, 1), ("E6", 2, 1), ("G6", 3, 2), ("E6", 5, 1), ("F6", 6, 1), ("D6", 7, 1),
               ("C6", 8, 1), ("A5", 9, 1), ("C6", 10, 2), ("B5", 12, 1), ("D6", 13, 1), ("G6", 14, 2)]
    for nn, ini, d in melodia:
        mezclar_en(pista, campanita(nota(m(nn)), d * b + 0.8, vol=0.3), ini * b, pan=0.25)
        mezclar_en(pista, marimba(nota(m(nn) - 12), d * b + 0.5, vol=0.35), ini * b, pan=-0.1)
    # final: acorde de Do brillante
    for nn in ["C5", "E5", "G5", "C6"]:
        mezclar_en(pista, campanita(nota(m(nn)), 1.6, vol=0.22), 16 * b)
    mezclar_en(pista, bajo(nota(m("C2")), 1.2, vol=0.5), 16 * b)
    return reverb(pista, 0.25, 1.4)


def noche_tranquila():
    """Fondo de noche en el bosque: colchón y marimba lenta. Bucle de ~55 s."""
    bpm = 70
    b = 60 / bpm
    prog = ["F", "C", "Dm", "Bb", "F", "C", "Bb", "C"]
    dur = len(prog) * 4 * b + 1.5
    pista = np.zeros((int(dur * SR), 2))
    for i, a in enumerate(prog):
        t0 = i * 4 * b
        mezclar_en(pista, colchon([nota(m(n) - 12) for n in ACORDES[a]], 4 * b + 0.8, vol=0.5), t0)
        notas = ACORDES[a] + [ACORDES[a][1]]
        for k, nn in enumerate(notas):
            mezclar_en(pista, marimba(nota(m(nn) + 12), 1.4, vol=0.28), t0 + k * b, pan=(-0.3 if k % 2 else 0.3))
        mezclar_en(pista, bajo(nota(m(RAIZ_BAJO[a])), 4 * b * 0.9, vol=0.3), t0)
        if i % 2 == 1:
            mezclar_en(pista, campanita(nota(m(ACORDES[a][2]) + 24), 2.0, vol=0.08), t0 + 3.5 * b, pan=0.5)
    pista = reverb(pista, 0.35, 2.2)
    return fundido_bucle(pista, 1.5)


def aventura():
    """Música de acción alegre (planes de Galleta, viajes). Bucle de ~35 s."""
    bpm = 116
    b = 60 / bpm
    prog = ["C", "G", "Am", "F"] * 4
    dur = len(prog) * 4 * b * 0.5 * 2 + 1.5
    pista = np.zeros((int(dur * SR), 2))
    t = 0.0
    for i, a in enumerate(prog):
        t0 = i * 2 * b
        for k, (sub, arriba) in enumerate([(0, False), (0.5, True), (1, False), (1.5, True)]):
            rasgueo(pista, a, t0 + sub * b, b * 0.9, vol=0.38, arriba=arriba)
        for k in range(4):
            mezclar_en(pista, maraca(vol=0.55), t0 + k * b / 2 + b / 4, pan=0.45)
        mezclar_en(pista, bombo(0.45), t0)
        mezclar_en(pista, bajo(nota(m(RAIZ_BAJO[a])), b * 0.9, vol=0.5), t0)
        mezclar_en(pista, bajo(nota(m(RAIZ_BAJO[a]) + 7), b * 0.9, vol=0.4), t0 + b)
    # melodía saltarina con marimba en la segunda mitad
    escala = ["C5", "D5", "E5", "G5", "A5", "C6"]
    patron = [0, 2, 3, 2, 4, 3, 2, 1, 0, 2, 4, 5, 4, 3, 2, 0]
    for i, idx in enumerate(patron * 2):
        tt = 8 * 2 * b + i * b / 2
        if tt < dur - 2:
            mezclar_en(pista, marimba(nota(m(escala[idx])), 0.5, vol=0.3), tt, pan=0.15)
    pista = reverb(pista, 0.2, 1.2)
    return fundido_bucle(pista, 1.0)


def experimento():
    """Curiosidad: notas punteadas y campanitas, misterioso pero amable. ~40 s."""
    bpm = 92
    b = 60 / bpm
    prog = ["Am", "F", "C", "G", "Am", "F", "Dm", "G"]
    dur = len(prog) * 4 * b + 1.5
    pista = np.zeros((int(dur * SR), 2))
    for i, a in enumerate(prog):
        t0 = i * 4 * b
        notas = ACORDES[a]
        arpegio = [notas[0], notas[1], notas[2], notas[1], notas[0], notas[2], notas[1], notas[2]]
        for k, nn in enumerate(arpegio):
            mezclar_en(pista, pulsada(nota(m(nn) + 12), 0.5, brillo=0.25, vol=0.32), t0 + k * b / 2, pan=(-0.35 if k % 2 else 0.35))
        mezclar_en(pista, bajo(nota(m(RAIZ_BAJO[a])), 4 * b * 0.9, vol=0.32), t0)
        mezclar_en(pista, colchon([nota(m(n)) for n in notas], 4 * b + 0.6, vol=0.18), t0)
        if i % 2 == 0:
            mezclar_en(pista, campanita(nota(m(notas[2]) + 24), 1.5, vol=0.1), t0 + 2 * b, pan=-0.5)
    pista = reverb(pista, 0.3, 1.8)
    return fundido_bucle(pista, 1.2)


def repaso():
    """Ligera y saltarina para el repaso y la pregunta. Bucle de ~30 s."""
    bpm = 104
    b = 60 / bpm
    prog = ["F", "C", "G", "C"] * 2
    dur = len(prog) * 4 * b + 1.2
    pista = np.zeros((int(dur * SR), 2))
    for i, a in enumerate(prog):
        t0 = i * 4 * b
        for k in range(4):
            mezclar_en(pista, marimba(nota(m(ACORDES[a][k % 3]) + 12), 0.6, vol=0.33), t0 + k * b, pan=-0.2)
            mezclar_en(pista, marimba(nota(m(ACORDES[a][(k + 1) % 3]) + 12), 0.4, vol=0.2), t0 + k * b + b / 2, pan=0.2)
            mezclar_en(pista, maraca(vol=0.45), t0 + k * b + b / 2, pan=0.5)
        mezclar_en(pista, bajo(nota(m(RAIZ_BAJO[a])), 2 * b * 0.9, vol=0.42), t0)
        mezclar_en(pista, bajo(nota(m(RAIZ_BAJO[a]) + 7), 2 * b * 0.9, vol=0.36), t0 + 2 * b)
        mezclar_en(pista, bombo(0.35), t0)
    pista = reverb(pista, 0.2, 1.2)
    return fundido_bucle(pista, 1.0)


# ---------------------------------------------------------------- efectos

def ef_salto():
    """«Boing»: muelle que sube."""
    n = int(0.55 * SR)
    t = np.arange(n) / SR
    f = 180 + 520 * (1 - np.exp(-t * 7)) + 60 * np.sin(2 * np.pi * 16 * t) * np.exp(-t * 5)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 5.5)
    return np.column_stack([s, s])


def ef_plof():
    """Caída blandita en un montón de hojas."""
    n = int(0.7 * SR)
    t = np.arange(n) / SR
    golpe = np.sin(2 * np.pi * np.cumsum(120 * np.exp(-t * 9) + 50) / SR) * np.exp(-t * 16)
    hojas = rng.normal(0, 1, n)
    for _ in range(6):
        hojas = 0.5 * (hojas + np.roll(hojas, 1))
    hojas *= np.exp(-t * 6) * (0.6 + 0.4 * rng.uniform(0, 1, n) ** 8)
    s = 0.9 * golpe + 0.5 * hojas
    return np.column_stack([s, s * 0.95])


def ef_susurro():
    """«Fiuuu»: pasa algo rápido (transición)."""
    n = int(0.6 * SR)
    t = np.arange(n) / SR
    ruido = rng.normal(0, 1, n)
    centro = 400 + 2600 * np.sin(np.pi * t / t[-1]) ** 2
    out = np.zeros(n)
    y1 = y2 = 0.0
    for i in range(n):  # paso banda sencillo que se mueve
        w = 2 * np.pi * centro[i] / SR
        y = ruido[i] * w * 0.5 + 2 * np.cos(w) * 0.97 * y1 - 0.97 ** 2 * y2
        y2, y1 = y1, y
        out[i] = y
    out *= np.sin(np.pi * t / t[-1]) ** 2
    return np.column_stack([out * np.linspace(1.2, 0.4, n), out * np.linspace(0.4, 1.2, n)])


def ef_idea():
    """Chispa de idea: arpegio de campanitas que sube."""
    pista = np.zeros((int(1.6 * SR), 2))
    for k, nn in enumerate(["C6", "E6", "G6", "C7", "E7"]):
        mezclar_en(pista, campanita(nota(m(nn)), 1.2, vol=0.5), k * 0.07, pan=-0.4 + k * 0.2)
    return reverb(pista, 0.3, 1.0)


def ef_acierto():
    """Ding-ding de respuesta correcta."""
    pista = np.zeros((int(1.4 * SR), 2))
    mezclar_en(pista, campanita(nota(m("G5")), 1.0, vol=0.7), 0.0)
    mezclar_en(pista, campanita(nota(m("C6")), 1.2, vol=0.7), 0.13)
    return reverb(pista, 0.25, 0.9)


def ef_magia():
    """Brillo mágico (cuando Farolín enciende su luz muy fuerte)."""
    pista = np.zeros((int(2.0 * SR), 2))
    escala = ["C6", "D6", "E6", "G6", "A6", "C7", "D7", "E7"]
    for k in range(14):
        nn = escala[int(rng.integers(0, len(escala)))]
        mezclar_en(pista, campanita(nota(m(nn)), 0.8, vol=0.25), k * 0.06 + rng.uniform(0, 0.02), pan=rng.uniform(-0.8, 0.8))
    mezclar_en(pista, colchon([nota(m("C5")), nota(m("G5"))], 1.8, vol=0.25), 0)
    return reverb(pista, 0.35, 1.4)


def ef_clic():
    """Interruptor de la lámpara."""
    n = int(0.08 * SR)
    t = np.arange(n) / SR
    s = rng.normal(0, 1, n) * np.exp(-t * 120) + 0.5 * np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 90)
    return np.column_stack([s, s])


def ef_pop():
    n = int(0.18 * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * np.cumsum(900 * np.exp(-t * 25) + 300) / SR) * np.exp(-t * 22)
    return np.column_stack([s, s])


def ef_grillos(dur=24.0):
    """Ambiente de noche: grillos suaves, en bucle."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    pista = np.zeros((n, 2))
    for k, (f, ritmo, pan) in enumerate([(4300, 2.2, -0.6), (4700, 2.9, 0.5), (3900, 1.7, 0.1)]):
        pulso = (np.sin(2 * np.pi * ritmo * t + k) > 0.55).astype(float)
        trino = (np.sin(2 * np.pi * 32 * t) > 0).astype(float)
        env = np.convolve(pulso * trino, np.ones(80) / 80, mode="same")
        s = np.sin(2 * np.pi * f * t) * env * 0.25
        mezclar_en(pista, s, 0, pan)
    return fundido_bucle(reverb(pista, 0.4, 1.5), 1.0)


# ---------------------------------------------------------------- episodio 2
# Cada función nueva fija su propia semilla: así sale igual se genere sola
# o con todo lo demás, y no cambia lo que ya existía.

def semilla(n):
    global rng
    rng = np.random.default_rng(n)


def filtro_banda(x, f, q):
    """Resonador de paso banda (biquad) para dar forma de vocal."""
    w = 2 * np.pi * f / SR
    alfa = np.sin(w) / (2 * q)
    b0, b2 = alfa, -alfa
    a0, a1, a2 = 1 + alfa, -2 * np.cos(w), 1 - alfa
    y = np.zeros_like(x)
    x1 = x2 = y1 = y2 = 0.0
    for i in range(len(x)):
        yi = (b0 * x[i] + b2 * x2 - a1 * y1 - a2 * y2) / a0
        x2, x1 = x1, x[i]
        y2, y1 = y1, yi
        y[i] = yi
    return y


def voz_sintetica(f0, formantes, ruido=0.0, aspereza=0.0):
    """Fuente de pulsos (como unas cuerdas vocales) pasada por formantes."""
    n = len(f0)
    t = np.arange(n) / SR
    fase = 2 * np.pi * np.cumsum(f0) / SR
    fuente = sum(np.sin(k * fase) / k ** 1.1 for k in range(1, 30))
    if aspereza:
        fuente *= 1 + aspereza * np.sin(2 * np.pi * 31 * t + np.sin(2 * np.pi * 7 * t))
    if ruido:
        fuente = fuente + ruido * rng.normal(0, 1, n)
    salida = sum(g * filtro_banda(fuente, f, q) for f, q, g in formantes)
    return salida / (np.abs(salida).max() + 1e-9)


def ef_pum():
    """Pisotón de dinosaurio de juguete: redondo y blandito, nunca un susto."""
    semilla(201)
    n = int(0.9 * SR)
    t = np.arange(n) / SR
    golpe = np.sin(2 * np.pi * np.cumsum(70 * np.exp(-t * 6) + 42) / SR) * np.exp(-t * 7)
    polvo = rng.normal(0, 1, n)
    for _ in range(10):
        polvo = 0.5 * (polvo + np.roll(polvo, 1))
    polvo *= np.exp(-t * 9) * 0.35
    s = golpe * np.clip(t / 0.006, 0, 1) + polvo
    pista = np.column_stack([s, s])
    return reverb(pista, 0.18, 0.8)


def ef_rugido():
    """Rugido de dinosaurio de dibujos: «¡raaaar!» agudo y simpático."""
    semilla(202)
    dur = 1.15
    n = int(dur * SR)
    t = np.arange(n) / SR
    contorno = np.interp(t, [0, 0.12, 0.55, dur], [150, 205, 190, 120])
    f0 = contorno * (1 + 0.035 * np.sin(2 * np.pi * 6.5 * t))
    # «r» áspera al principio y vocal «a» abierta
    voz = voz_sintetica(f0, [(780, 6, 1.0), (1250, 8, 0.7), (2600, 10, 0.25)], ruido=0.15, aspereza=0.55)
    env = np.clip(t / 0.06, 0, 1) * np.clip((dur - t) / 0.35, 0, 1)
    s = voz * env
    pista = np.column_stack([s, s])
    return reverb(pista, 0.22, 0.9)


def ef_hipo():
    """«¡Hip!»: un hipo cortito y gracioso."""
    semilla(203)
    dur = 0.22
    n = int(dur * SR)
    t = np.arange(n) / SR
    f0 = np.interp(t, [0, 0.05, dur], [330, 560, 520])
    voz = voz_sintetica(f0, [(320, 6, 1.0), (2300, 9, 0.6), (3000, 10, 0.3)], ruido=0.05)
    env = np.clip(t / 0.008, 0, 1) * np.exp(-np.maximum(0, t - 0.05) * 22)
    clic = np.zeros(n)
    clic[: int(0.004 * SR)] = rng.normal(0, 0.12, int(0.004 * SR))
    s = voz * env + clic
    pista = np.zeros((int(0.6 * SR), 2))
    mezclar_en(pista, s, 0.0)
    return reverb(pista, 0.15, 0.6)


def ef_glup():
    """Un trago enorme («glup»): para el braquiosaurio que no masticaba."""
    semilla(204)
    pista = np.zeros((int(0.9 * SR), 2))
    for k, (ini, f1, f2) in enumerate([(0.0, 520, 170), (0.18, 430, 130)]):
        n = int(0.22 * SR)
        t = np.arange(n) / SR
        f = f2 + (f1 - f2) * np.exp(-t * 18)
        s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 14) * np.clip(t / 0.004, 0, 1)
        mezclar_en(pista, s * (1.0 - 0.25 * k), ini)
    return reverb(pista, 0.2, 0.7)


def ef_redoble():
    """Redoble suave que crece y termina en un «¡tachán!» de campanitas."""
    semilla(205)
    dur = 2.4
    pista = np.zeros((int(dur * SR), 2))
    golpes = np.arange(0.0, 1.45, 1 / 22)
    for i, g in enumerate(golpes):
        n = int(0.05 * SR)
        t = np.arange(n) / SR
        caja = rng.normal(0, 1, n)
        caja = np.diff(caja, prepend=0) * 0.6 + caja * 0.4
        caja *= np.exp(-t * 60) * (0.18 + 0.5 * (i / len(golpes)) ** 1.6)
        mezclar_en(pista, caja, g, pan=(-0.15 if i % 2 else 0.15))
    for k, nn in enumerate(["C6", "E6", "G6", "C7"]):
        mezclar_en(pista, campanita(nota(m(nn)), 0.9, vol=0.45), 1.5 + k * 0.035, pan=-0.3 + k * 0.2)
    mezclar_en(pista, bombo(0.6), 1.5)
    return reverb(pista, 0.25, 1.0)


def ef_rio(dur=20.0):
    """Ambiente de orilla de río: agua que corre y algún burbujeo."""
    semilla(206)
    n = int(dur * SR)
    t = np.arange(n) / SR
    pista = np.zeros((n, 2))
    for canal in range(2):
        agua = rng.normal(0, 1, n)
        for _ in range(4):
            agua = 0.5 * (agua + np.roll(agua, 1))
        lento = np.convolve(rng.normal(0, 1, n // 2000 + 2), np.ones(3) / 3, mode="same")
        mod = 0.65 + 0.35 * np.interp(t, np.linspace(0, dur, len(lento)), lento / (np.abs(lento).max() + 1e-9))
        pista[:, canal] = agua * mod * 0.25
    for _ in range(int(dur * 3)):
        ini = rng.uniform(0, dur - 0.2)
        m_ = int(0.06 * SR)
        tt = np.arange(m_) / SR
        f = rng.uniform(500, 1100) * (1 + tt * 6)
        burbuja = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 55) * 0.25
        mezclar_en(pista, burbuja, ini, pan=rng.uniform(-0.7, 0.7))
    return fundido_bucle(reverb(pista, 0.3, 1.2), 1.0)


def misterio():
    """Detectives de huellas: pizzicato de puntillas y bajo que camina. ~30 s."""
    semilla(207)
    bpm = 100
    b = 60 / bpm
    acordes = {"Am": ["A3", "C4", "E4"], "Dm": ["D4", "F4", "A4"], "E": ["E3", "G#3", "B3"], "F": ["F3", "A3", "C4"]}
    raiz = {"Am": "A2", "Dm": "D2", "E": "E2", "F": "F2"}
    prog = ["Am", "Dm", "E", "Am", "F", "Dm", "E", "E"]
    dur = len(prog) * 4 * b + 1.2
    pista = np.zeros((int(dur * SR), 2))
    for i, a in enumerate(prog):
        t0 = i * 4 * b
        notas = acordes[a]
        # pizzicato a contratiempo (de puntillas)
        for k in range(4):
            nn = notas[(k + i) % 3]
            mezclar_en(pista, pulsada(nota(m(nn) + 12), 0.25, brillo=0.2, vol=0.3), t0 + k * b + b / 2, pan=(-0.3 if k % 2 else 0.3))
        # bajo que camina
        base = m(raiz[a])
        for k, paso in enumerate([0, 7, 12, 7]):
            mezclar_en(pista, marimba(nota(base + paso + 12), 0.45, vol=0.32), t0 + k * b, pan=-0.1)
        mezclar_en(pista, maraca(vol=0.35), t0 + 1.5 * b, pan=0.5)
        mezclar_en(pista, maraca(vol=0.35), t0 + 3.5 * b, pan=0.5)
    # motivo «¿de quién será?»: sube y se queda en el aire
    motivo = [("A5", 0, 0.5), ("C6", 0.5, 0.5), ("E6", 1, 0.5), ("G#5", 2, 1.5)]
    for vuelta in (1, 5):
        for nn, ini, d in motivo:
            mezclar_en(pista, campanita(nota(m(nn)), d * b + 0.6, vol=0.16), vuelta * 4 * b + ini * b, pan=0.25)
    pista = reverb(pista, 0.25, 1.4)
    return fundido_bucle(pista, 1.0)


EPISODIO2 = {
    "misterio": (misterio, DIR_MUSICA / "misterio.mp3", 0.8),
    "pum": (ef_pum, DIR_EFECTOS / "pum.mp3", 0.7),
    "rugido": (ef_rugido, DIR_EFECTOS / "rugido.mp3", 0.6),
    "hipo": (ef_hipo, DIR_EFECTOS / "hipo.mp3", 0.6),
    "glup": (ef_glup, DIR_EFECTOS / "glup.mp3", 0.6),
    "redoble": (ef_redoble, DIR_EFECTOS / "redoble.mp3", 0.6),
    "rio": (ef_rio, DIR_EFECTOS / "rio.mp3", 0.5),
}


def main():
    print("Música:")
    guardar(tema_canal(), DIR_MUSICA / "tema.mp3")
    guardar(noche_tranquila(), DIR_MUSICA / "noche.mp3")
    guardar(aventura(), DIR_MUSICA / "aventura.mp3")
    guardar(experimento(), DIR_MUSICA / "experimento.mp3")
    guardar(repaso(), DIR_MUSICA / "repaso.mp3")
    print("Efectos:")
    guardar(ef_salto(), DIR_EFECTOS / "salto.mp3", 0.7)
    guardar(ef_plof(), DIR_EFECTOS / "plof.mp3", 0.7)
    guardar(ef_susurro(), DIR_EFECTOS / "susurro.mp3", 0.6)
    guardar(ef_idea(), DIR_EFECTOS / "idea.mp3", 0.6)
    guardar(ef_acierto(), DIR_EFECTOS / "acierto.mp3", 0.6)
    guardar(ef_magia(), DIR_EFECTOS / "magia.mp3", 0.6)
    guardar(ef_clic(), DIR_EFECTOS / "clic.mp3", 0.5)
    guardar(ef_pop(), DIR_EFECTOS / "pop.mp3", 0.6)
    guardar(ef_grillos(), DIR_EFECTOS / "grillos.mp3", 0.5)
    for funcion, ruta, pico in EPISODIO2.values():
        guardar(funcion(), ruta, pico)


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1:
        # solo las piezas pedidas: python musica/componer.py pum rugido
        for nombre in sys.argv[1:]:
            funcion, ruta, pico = EPISODIO2[nombre]
            guardar(funcion(), ruta, pico)
    else:
        main()
