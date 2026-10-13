# Estudio de Farolín y Galleta

Aquí se fabrican los episodios: dibujos vectoriales animados con
[Remotion](https://www.remotion.dev/) (React → vídeo), voces sintéticas
comprobadas con Whisper y música compuesta por código. Nada depende de
servicios de pago.

**Licencias:** Remotion es gratis para particulares y empresas de hasta 3
personas. Voces: Kokoro-82M (Apache 2.0). Tipografías Baloo 2 y Fredoka (OFL).
Música y efectos: originales (`musica/componer.py`).

## Producir un episodio

```bash
cd canal-youtube-infantil/estudio
npm install                                   # una vez

# 0. Entorno de Python para voces (una vez)
python3 -m venv ~/.venv-farolin && ~/.venv-farolin/bin/pip install -r voces/requirements.txt

# 1. Guion: src/episodios/epNN/guion.json (frases, personaje, pausas, fuentes)
#    y escenas.json (márgenes de cada escena y nombres de capítulo)

# 2. Voces: genera, mide y transcribe cada frase. Lee el informe al acabar.
~/.venv-farolin/bin/python voces/generar_voces.py epNN
cat src/episodios/epNN/informe-voces.md      # frases con ⚠️ = reescribirlas

# 3. Escenas: src/episodios/epNN/escenas/*.tsx y EpisodioNN.tsx; registrar en Root.tsx

# 4. Revisar fotogramas sueltos antes de renderizar todo
node scripts-fotogramas.mjs EpisodioNN 0.5 out/revision 100 400 900

# 5. Render y volumen final (-14 LUFS)
npx remotion render EpisodioNN out/episodioNN-bruto.mp4 --codec=h264 --crf=18 --audio-bitrate=192k
python3 masterizar.py out/episodioNN-bruto.mp4 out/episodioNN.mp4

# 6. Subtítulos y capítulos para YouTube (mismos tiempos que el vídeo)
node publicar.mjs epNN

# Imágenes de marca y miniatura
node scripts-stills.mjs out/marca MiniaturaNN:1.5 Avatar Banner
```

En el contenedor de Claude hay que indicar el navegador:
`--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`
(y `REMOTION_CHROME` con esa ruta para los scripts `.mjs`).

## Qué hay en cada sitio

| Carpeta | Qué |
|---|---|
| `src/personajes/` | Farolín, Galleta, Doña Lechuza y sus caras (expresiones, parpadeo, boca que habla) |
| `src/escenario/` | Bosque de noche, árbol de Doña Lechuza, espacio, luna con sus fases reales |
| `src/comun/` | Reloj del guion (`tiempo.ts`), sonido, rótulos, transición de iris, logo |
| `src/episodios/epNN/` | Guion, voces generadas, escenas del episodio |
| `voces/` | Generador de voces y la configuración de cada personaje |
| `musica/` | Compositor de música y efectos |
| `public/` | Audio (voces en MP3, música, efectos) y tipografías |

## Reglas que salen de hacer el episodio 1

- **Ninguna frase de una o dos palabras suelta.** «¿Yo?» o «¡Luna llena!» no se
  entienden ni a Whisper ni a un niño. Con contexto, sí: «¿Quién, yo?».
- **Cuidado con frases que suenan igual que otra:** «¡y mírala ahora!» se oye
  «y mira la hora». Whisper lo detecta; un humano escuchando deprisa, no.
- **Medir el tono de cada personaje** tras tocar sus voces: Farolín y Galleta
  salieron al principio casi iguales (195 y 198 Hz) y nadie lo habría notado
  sin medirlo.
- **Revisar fotogramas antes de renderizar**: así salieron un personaje
  durmiendo delante de la seta en vez de encima, un rótulo pisando otro, un
  texto que se salía de su tarjeta y ojos cerrados en la frase «¡la veo!».
- **La miniatura se prueba en pequeño** (168 px de ancho, como en el móvil) y
  deja libre la esquina de abajo a la derecha, donde YouTube pone la duración.
