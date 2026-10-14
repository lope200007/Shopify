# Estudio de Farolín y Galleta

Aquí se fabrican los episodios: dibujos vectoriales animados con
[Remotion](https://www.remotion.dev/) (React → vídeo), voces sintéticas
comprobadas con Whisper y música compuesta por código. Nada depende de
servicios de pago.

**Licencias:** Remotion es gratis para particulares y empresas de hasta 3
personas. Voces: Qwen3-TTS (Apache 2.0); antes, Kokoro-82M (Apache 2.0).
Tipografías Baloo 2 y Fredoka (OFL). Música y efectos: originales
(`musica/componer.py`).

## Las voces (desde el 14-10-2026)

Pablo escuchó el episodio 1 y las voces le sonaron **muy robóticas**. Tenía
razón: Kokoro tiene pocas voces en español y para los niños había que subirles
mucho el tono, que es justo lo que deja ese sonido metálico.

Ahora cada personaje tiene una **voz de referencia** (`voces/referencias/`),
creada con Qwen3-TTS *VoiceDesign* a partir de una descripción escrita
(«una niña de seis años, enérgica y juguetona…», en `voces/personajes.json`).
**No es la voz de ninguna persona real.** Después, Qwen3-TTS *Base* clona esa
referencia en cada frase, así el personaje suena igual en todos los episodios.

| Motor | Licencia | Estado |
|---|---|---|
| Qwen3-TTS 1.7B (VoiceDesign + Base) | Apache 2.0 | **El que se usa.** Se entienden todas las frases de prueba |
| Chatterbox multilingüe y su afinado de español de España | MIT | Probado: buenas voces adultas con acento de España, pero en las de niños Whisper no entendía frases enteras («¡Es bella! ¡Le fatón trozo!») |
| Kokoro-82M | Apache 2.0 | El de la primera versión del episodio 1 |

Los motores grandes van en entornos de Python aparte (no conviven con Kokoro):

```bash
uv venv --python 3.12 ~/.venv-qwen
uv pip install --python ~/.venv-qwen/bin/python torch torchaudio --index-url https://download.pytorch.org/whl/cpu
uv pip install --python ~/.venv-qwen/bin/python -r voces/requirements-qwen.txt
# (opcional) Chatterbox: voces/requirements-chatterbox.txt, con Python 3.11
```

En un ordenador sin tarjeta gráfica (4 núcleos) tarda unas 5-7 veces la
duración del audio: un episodio de 4 minutos de voz, unos 30 minutos.

**Si una frase sale mal:** se añade `"toma": 2` a esa frase en `guion.json` y
se vuelve a lanzar el generador; solo rehace esa frase, con otra semilla.

**Pulir un episodio (después de generar todas sus voces):**

```bash
~/.venv-farolin/bin/python voces/puntuar.py epNN                 # señala las frases flojas
~/.venv-farolin/bin/python voces/elegir_tomas.py epNN 3 l010 l044 # prueba 3 tomas, deja la mejor
~/.venv-farolin/bin/python voces/palabras.py epNN                 # rehace la sincronía
```

`puntuar.py` usa DNSMOS (Microsoft, MIT, sin conexión), que predice la nota
que pondría una persona. **Cada frase se compara con su misma voz**: DNSMOS
puntúa peor cualquier voz infantil, así que comparar a Galleta con el
narrador no dice nada. Una frase muy por debajo de la mediana de su propio
personaje suele tener un fallo (un arranque raro, una vocal estirada).
`elegir_tomas.py` repite esas frases con otras semillas, puntúa cada toma
(DNSMOS menos el error de Whisper: entenderse manda) y deja la mejor, con su
número de toma apuntado en `guion.json`.

Probado y descartado: subir los agudos a las voces de los niños (las nuevas
tienen menos brillo que las de Kokoro). DNSMOS no mejoró con ninguno de tres
ajustes, y sin poder escuchar no se añade un retoque que no demuestra nada.

## Producir un episodio

```bash
cd canal-youtube-infantil/estudio
npm install                                   # una vez

# 0. Entornos de Python para voces (una vez): el de las herramientas (Whisper,
#    Kokoro) y el del motor de voz (ver «Las voces», arriba)
python3 -m venv ~/.venv-farolin && ~/.venv-farolin/bin/pip install -r voces/requirements.txt

# 1. Guion: src/episodios/epNN/guion.json (frases, personaje, pausas, fuentes)
#    y escenas.json (márgenes de cada escena y nombres de capítulo)

# 2. Voces: genera, mide y transcribe cada frase. Lee el informe al acabar.
~/.venv-farolin/bin/python voces/generar_voces.py epNN
cat src/episodios/epNN/informe-voces.md      # frases con ⚠️ = reescribirlas o «toma»: 2
~/.venv-farolin/bin/python voces/palabras.py epNN   # momento de cada palabra (sincronía)

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
- **La primera palabra se comprueba aparte.** Un 5 % de error global escondía
  que «¡Se me ha encendido una idea!», la frase clave, se oía «Te me ha…».
  El generador avisa ahora si falla la primera palabra.
- **Las voces muy agudas se comen la primera consonante** («Mucho» → «Ucho»).
  A Farolín lo arregló hablar un poco más despacio (velocidad 0,98).
- **Ningún efecto de sonido encima del arranque de una frase.** El «tilín» va
  antes o después; la campanita de acierto, después de la respuesta.
- **Medir el tono de cada personaje** tras tocar sus voces: Farolín y Galleta
  salieron al principio casi iguales (195 y 198 Hz) y nadie lo habría notado
  sin medirlo.
- **Revisar fotogramas antes de renderizar**: así salieron un personaje
  durmiendo delante de la seta en vez de encima, un rótulo pisando otro, un
  texto que se salía de su tarjeta y ojos cerrados en la frase «¡la veo!».
- **La miniatura se prueba en pequeño** (168 px de ancho, como en el móvil) y
  deja libre la esquina de abajo a la derecha, donde YouTube pone la duración.
