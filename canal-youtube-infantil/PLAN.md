# Farolín y Galleta: canal de YouTube infantil

**Un canal sin rostro, para niños de 4 a 8 años, que entretiene primero y
enseña por dentro, con mucho color.**

Plan creado el 13-10-2026 a partir de los seis pasos de las tarjetas de
@alpacka.ai y actualizado ese mismo día con datos reales, el primer episodio
producido y lo aprendido al hacerlo.

| | |
|---|---|
| Estado | **Episodios 1 y 2 terminados**, con las voces nuevas (14-10-2026). Falta que Pablo cree el canal (`GUIA-CREAR-CANAL.md`) y los escuche enteros |
| Nombre | «Farolín y Galleta» (provisional: lo decide Pablo; se cambia en `estudio/src/marca.ts`) |
| Investigación | `investigacion-2026-10-13.md` |
| Episodio 1 | `episodios/ep01/` (ficha de publicación, subtítulos, miniatura) |
| Episodio 2 | `episodios/ep02/` (dinosaurios: ficha, subtítulos, miniatura) |
| Estudio de producción | `estudio/` (cómo se usa: `estudio/LEEME.md`) |

> **Supuestos** (cámbialos y se rehace lo que dependa de ellos): español de
> España, niños de 4 a 8 años, unas 8 horas por semana, 0-30 € al mes, voces
> sintéticas de licencia libre.

---

## 0. Reglas de YouTube que mandan sobre todo lo demás

Comprobadas el 13-10-2026 en la ayuda oficial de YouTube (enlaces al final).

1. **El canal es «creado para niños».** Obligatorio por la ley COPPA. Eso
   **quita**: comentarios, campanita, **tarjetas y pantallas finales**,
   «guardar en lista», minirreproductor, reproducción automática en Inicio,
   publicaciones de comunidad y anuncios personalizados (pagan menos).
   - Por eso cada episodio anuncia la próxima aventura **de viva voz**, dentro
     del propio vídeo: no hay pantalla final que lo haga.
   - Los indicadores (sección 6) no usan comentarios: no los habrá.
2. **«Contenido no auténtico».** YouTube no paga a canales de vídeos en serie
   todos iguales, y lo detecta por canal entero. Protege tener personajes
   propios, una historia distinta en cada vídeo y datos comprobados.
3. **Aviso de IA:** solo es obligatorio en contenido **realista** (personas o
   sucesos reales, escenas realistas). Unos dibujos animados no lo necesitan.
   Aun así, la descripción dice «animación, voces y música creadas por ordenador».
4. **Para cobrar** (Programa de Partners): según fuentes no oficiales de 2026,
   500 suscriptores, 3 subidas en 90 días y 3.000 horas vistas en un año. El
   umbral exacto para España **no está confirmado**: se mira en YouTube Studio
   → Ganar dinero.

Y tres reglas propias, porque el público son niños:

- **Ningún dato sin fuente.** Un niño se cree lo que oye. Los datos de cada
  episodio van en su `guion.json`, con la fuente y la fecha.
- **Nada que se pueda imitar con peligro.** El primer guion tenía a un osito
  subiendo una escalera altísima con pegamento: se cambió por saltar con una red
  de mariposas y caer en un montón de hojas.
- **Nada de personajes ni música de otros.** Toda la música del canal es
  original, compuesta por código (`estudio/musica/componer.py`).

---

## 1. El concepto

**Farolín** (luciérnaga, chico): curioso y prudente. Su farolillo cambia de
color con lo que siente: amarillo normal, **turquesa cuando «se le enciende una
idea»**, azul si tiene miedo, rosa si está muy contento. Los niños aprenden a
leerle la luz.

**Galleta** (osita, chica): valiente e impulsiva. «¡Tengo un plan!», y saca
algo de su bolso. Sus planes salen torcidos, pero es la que se atreve.

**Doña Lechuza** (la sabia): no da respuestas, propone experimentos. Su frase:
«Uuuh… ¡vamos a comprobarlo!». Enseña a comprobar las cosas.

**Por qué este concepto** (datos en `investigacion-2026-10-13.md`):

- Los dos grandes en español (Smile and Learn, 6,28 M de suscriptores, y Happy
  Learning, 3,01 M) **explican con un narrador**. Ninguno cuenta una historia
  con personajes que se resuelve aprendiendo. Ese es el hueco.
- Canales pequeños con personajes despegan: Mighty Kids Adventures tiene 4.230
  suscriptores y un episodio de dinosaurios con 2 millones de visualizaciones.

### La fórmula de cada episodio

1. **Problema** (0-15 s): pasa algo que hay que arreglar.
2. **Plan torcido de Galleta**: el niño ya sabe más que ella, y le encanta.
3. **Experimento de Doña Lechuza**: lo educativo va dentro de la aventura, y
   **los personajes son parte del experimento** (en el episodio 1, Farolín hace
   de Sol con su propia luz y Galleta hace de Tierra).
4. **«¡Te toca a ti!»**: pregunta con cuenta atrás de 3 segundos para contestar
   en voz alta.
5. **Datos curiosos** y **repaso en tres tarjetas**.
6. **Reto para casa** y **pregunta que engancha a la próxima aventura**.

### Identidad

- Tipografías: **Baloo 2** (títulos) y **Fredoka** (textos), licencia OFL.
- Colores: luz amarilla `#FFD23F`, turquesa `#3BCEAC`, coral `#FF6B4A`,
  noche `#140F3D`, caramelo `#C98A4B`, contorno `#2B2140`.
- Contornos gruesos, formas redondas, ojos grandes. Nada de parpadeos rápidos ni
  destellos (hay niños fotosensibles).
- Rótulos de pocas palabras: muchos niños aún no leen.

---

## 2. Banco de ideas, con datos

Búsquedas al mes según vidIQ (13-10-2026). **España** = volumen dentro de España.

| Prioridad | Episodio | Búsqueda que ataca | Al mes | Competencia |
|---|---|---|---|---|
| ✅ hecho | ¿La luna se está rompiendo? | fases de la luna para niños | 5.029 | 29 (baja) |
| ✅ hecho | ¿De quién es esta huella gigante? (dinosaurios) | dinosaurios para niños | 52.889 | 54 |
| 1 | ¿Quién hace ese ruido en el bosque? | sonidos de animales para niños | 18.805 (**+118 %**) | 57 |
| 2 | El dinosaurio del museo se despierta (segundo de dinosaurios: el tema que más se busca) | dinos | 34.138 (+100 %) | 61 |
| 3 | ¿Por qué no se caen las estrellas? (ya anunciado al final del ep. 1) | sistema solar para niños | 6.618 | 49 |
| 4 | Galleta se enfada | emociones niños | 5.369 | 25 (baja) |
| 5 | ¿Cómo se llama este animal? | nombres de animales para niños | 5.101 | 30 (baja) |
| 6 | El arcoíris perdido | colores para niños | 3.437 | 45 |
| 7 | La gota de agua viajera | ciencias para niños | 4.946 | 45 |
| 8 | Farolín tiene miedo a la oscuridad | las emociones para niños | 6.519 | 39 |
| 9 | ¡Hay 10 estrellas escondidas! | (contar) | sin medir | — |
| 10 | La oruga que tenía prisa | (metamorfosis) | sin medir | — |

Más ideas sin medir todavía: el erizo que no quería dormir (hibernación), la
semilla mágica, el misterio de las formas, ¿dónde viven los pingüinos?, la
carrera de los planetas, el cumpleaños de Galleta (compartir y mitades), ¿por
qué tenemos que dormir?, el volcán que estornuda, la abeja que perdió su casa,
grande-mediano-pequeño, Galleta aprende a pedir perdón, la estación que se
equivocó, ¿por qué el cielo es azul?

**Lo que dicen los datos:** en España lo que más se busca para niños son
**animales** (19.027 al mes, solo España) y **dinosaurios** (38.985). Las
**canciones** son la categoría más grande (53.210), pero piden voz cantada.

**Recopilaciones:** con 4 episodios, montar una de 20-30 minutos. Es el formato
con más horas de visualización (los niños lo ven en la tele).

---

## 3. Guion

El del episodio 1 está en `estudio/src/episodios/ep01/guion.json` (62 frases,
fuentes de la NASA incluidas). Cambios respecto al primer borrador:

| Antes | Ahora | Por qué |
|---|---|---|
| Lumi y Bruno | Farolín y Galleta | «El Mundo de Lumi» lo usan 8 canales |
| Bruno sube una escalera con pegamento | Galleta salta con una red y cae en hojas | Un niño puede imitar lo de la escalera |
| «Ayer estaba redonda» | «La semana pasada estaba redonda» | De luna llena a cuarto menguante pasan 7 días, no 1 |
| La lechuza usa una linterna | **Farolín hace de Sol** con su luz | El personaje es parte del experimento |
| «Más lejos que mil montañas» | «Cabrían 30 Tierras en fila» | Es el dato de la NASA, y se puede dibujar |
| Pantalla final con 2 vídeos | Anuncio de la próxima aventura de viva voz | En contenido infantil no hay pantallas finales |

---

## 4. Títulos y miniaturas

Patrón de lo que funciona (sección 4 de la investigación): `TEMA para niños`
+ emoji + frase-gancho + nombre del canal. La miniatura enseña **algo que pasa
en el vídeo**, una cara con emoción clara y como mucho dos o tres palabras, y
deja libre la esquina de abajo a la derecha (ahí va la duración).

Probarla siempre en pequeño (168 px de ancho, como en el móvil): el estudio la saca con `convert Miniatura01.png -resize 168x94`.

| Episodio | Título | Miniatura |
|---|---|---|
| 1 ✅ | ¿La luna se está rompiendo? 🌙 Las fases de la luna para niños \| Farolín y Galleta | Media luna con el trozo «que falta» punteado, Galleta asombrada, «¿SE ROMPE?» |
| 2 ✅ | ¿De quién es esta huella gigante? 🦖 Dinosaurios para niños \| Farolín y Galleta | Huella gigante vista desde arriba, Galleta asombrada, «¿DE QUIÉN ES?» |
| 3 | ¿Por qué no se caen las estrellas? ⭐ El cielo para niños \| Farolín y Galleta (anunciado al final de los episodios 1 y 2) | Estrella cayendo y Galleta con la red |
| 4 | ¿Quién hace ese ruido? 🔊 Sonidos de animales para niños \| Farolín y Galleta | Sombra de animal con «?», Farolín asustado (luz azul) |

**Títulos en pregunta** (desde el 14-10-2026): una pregunta que el vídeo
responde. Así el título engancha sin afirmar algo falso, que es lo que YouTube
pide a los vídeos infantiles.

---

## 5. Flujo de producción

Todo se hace en `estudio/` con Claude. Pasos y tiempo de Pablo:

| Paso | Quién | Tiempo de Pablo |
|---|---|---|
| Elegir tema del banco de ideas | Pablo | 5 min |
| Guion (`guion.json`) con datos y fuentes | Claude, Pablo lo lee | 15 min |
| Voces: `voces/generar_voces.py` (incluye la comprobación con Whisper) | Claude | 0 |
| Escenas y animación (Remotion) | Claude | 0 |
| Revisión de fotogramas y render | Claude | 0 |
| **Ver el episodio entero con sonido** | **Pablo** | 10 min |
| Subir con la ficha de publicación | Pablo | 10 min |

**Lo que no se automatiza nunca:** la historia de cada episodio, el humor y la
verificación de datos. Es lo que hace el canal auténtico.

**Voces (14-10-2026):** Pablo las encontró «muy robóticas». Era el tono subido
a mano (hasta 7,5 semitonos) sobre una voz adulta de Kokoro. Ahora cada
personaje tiene una voz **diseñada** con Qwen3-TTS a partir de una descripción
(no se imita a nadie real) y se clona en cada frase, sin retoques de tono.
Detalle y mediciones en `estudio/LEEME.md`.

**Siguiente mejora de calidad:** que Pablo (o alguien contratado) grabe las
voces. Una voz humana con ganas engancha más que la mejor sintética. El
generador ya deja cada frase en su sitio: bastaría con sustituir los archivos.

---

## 6. Sistema semanal

### Calendario (un episodio por semana)

| Día | Qué | Tiempo de Pablo |
|---|---|---|
| Lunes | Mirar los números de la semana · elegir tema | 20 min |
| Martes | Leer el guion y dar el visto bueno | 15 min |
| Jueves | Ver el episodio terminado con sonido | 10 min |
| Viernes | Programar la subida para el sábado por la mañana | 10 min |

*La hora (fin de semana por la mañana) es una estimación: se ajusta con las
estadísticas de las primeras semanas.*

### Los cuatro indicadores

| Indicador | Dónde | Qué significa | Listón inicial (estimado) |
|---|---|---|---|
| Retención media | Studio → Contenido → vídeo | Si el niño se queda | Más del 50 % |
| Caída en los primeros 30 s | Gráfico de retención | Si el gancho funciona | Menos del 30 % |
| CTR de miniatura | Studio → Alcance | Si la miniatura atrae | 4-8 % |
| Espectadores recurrentes | Studio → Audiencia | Si vuelven por Farolín y Galleta | Que suba mes a mes |

### Reglas para reforzar lo que funciona

- Un vídeo que **dobla la retención media** → continuación en 3 semanas.
- Un tipo de episodio que gana **3 veces seguidas** → serie fija.
- CTR bajo y buena retención → **cambiar la miniatura**, no el vídeo.
- CTR alto y retención baja → la miniatura promete algo que el vídeo no da:
  revisar el gancho.
- **Cada 8 semanas**, revisión grande.

---

## Fuentes (consultadas el 13-10-2026)

- Funciones que no tiene el contenido creado para niños: https://support.google.com/youtube/answer/9527654
- Cuándo es «creado para niños»: https://support.google.com/youtube/answer/9528076
- Aviso de contenido generado con IA: https://support.google.com/youtube/answer/14328491
- Contenido no auténtico: https://air.io/en/monetization/youtube-monetization-policy-changes-2026-a-complete-dated-timeline
- Programa de Partners (no oficial): https://vidiq.com/blog/post/monetize-youtube-guide/
- Datos de la Luna (NASA): https://science.nasa.gov/moon/facts/ · https://science.nasa.gov/moon/moon-phases/
- Licencia de Remotion (gratis para particulares y empresas de hasta 3 personas): https://www.remotion.dev/
- Voces Kokoro-82M (Apache 2.0, las del primer montaje): https://huggingface.co/hexgrad/Kokoro-82M
- Voces Qwen3-TTS (Apache 2.0, las actuales): https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign · https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base
- Dinosaurios (Museo de Historia Natural de Londres): https://www.nhm.ac.uk/discover/dino-directory/tyrannosaurus.html · https://www.nhm.ac.uk/discover/how-dinosaurs-evolved-into-birds.html
