#!/usr/bin/env python3
"""Alegrar una foto: quitar la dominante verde, subir la luz y darle viveza.

Nace de un fallo real: las primeras banners generadas con Higgsfield salieron
con brillo medio 87-124 sobre 255 y saturacion 15-38. Eran bonitas de mirar y
malas de vender: parecian una exposicion melancolica, no una tienda.

El objetivo aqui es un brillo medio cercano a 150 y una dominante neutra,
sin quemar los blancos ni volver la piel del perro naranja.

    python3 alegrar.py entrada.jpg salida.jpg [brillo_objetivo]
"""
import sys
import numpy as np
from PIL import Image, ImageEnhance


def equilibrio_de_blancos(a):
    """Neutraliza la dominante mirando solo el 30% mas claro de la imagen.

    Usar la media de toda la foto falla cuando hay mucho suelo de terracota:
    el gris de referencia esta en las paredes y la luz, no en el suelo.
    """
    lum = a.mean(axis=2)
    claros = a[lum > np.percentile(lum, 70)]
    if len(claros) == 0:
        return a
    med = claros.mean(axis=0)
    return a * (med.mean() / np.maximum(med, 1e-6))


def subir_luz(a, objetivo):
    """Gamma que lleva el brillo medio al objetivo.

    Gamma y no una suma: mantiene el 255 en 255, asi que sube las sombras y
    los medios sin quemar las zonas ya claras (una ventana, un azulejo blanco).
    """
    actual = a.mean() / 255.0
    meta = objetivo / 255.0
    if actual <= 0 or actual >= 1:
        return a
    g = np.log(meta) / np.log(actual)
    g = float(np.clip(g, 0.45, 1.0))          # tope: nunca aplanar del todo
    return 255.0 * np.power(np.clip(a, 0, 255) / 255.0, g)


def alegrar(ruta_in, ruta_out, objetivo=150.0):
    im = Image.open(ruta_in).convert("RGB")
    a = np.asarray(im).astype(np.float64)
    antes = (a.mean(), (a.max(2) - a.min(2)).mean())

    a = equilibrio_de_blancos(a)
    a = subir_luz(a, objetivo)
    a[..., 0] *= 1.012                        # una pizca hacia la crema #fbf7f1
    a[..., 2] *= 0.992
    out = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))

    out = ImageEnhance.Color(out).enhance(1.22)      # viveza
    out = ImageEnhance.Contrast(out).enhance(1.06)   # que no quede lechosa
    out.save(ruta_out, quality=92, subsampling=0)

    b = np.asarray(out).astype(np.float64)
    print("%s  brillo %.0f -> %.0f   sat %.1f -> %.1f"
          % (ruta_out.split("/")[-1], antes[0], b.mean(),
             antes[1], (b.max(2) - b.min(2)).mean()))


if __name__ == "__main__":
    alegrar(sys.argv[1], sys.argv[2],
            float(sys.argv[3]) if len(sys.argv) > 3 else 150.0)
