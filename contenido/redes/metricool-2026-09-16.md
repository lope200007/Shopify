# Metricool, 16 de septiembre de 2026

## 1. El fallo que había: 21 publicaciones apuntaban al dominio interno

Las 21 publicaciones programadas del 4 al 25 de noviembre enlazaban a
`g5d031-ir.myshopify.com/products/...` en vez de a `patitascalidas.com`.

Eso es el dominio interno de Shopify. Un enlace así no da confianza y expone el
nombre técnico de la tienda. Iban a publicarse tal cual.

**Corregidas las 21.** Antes de cambiarlas se comprobó que los 20 destinos
existen en el dominio bueno (los 20 responden 200). Después se releyó el
calendario de noviembre entero: **25 publicaciones, todas con patitascalidas.com,
cero con myshopify.com.**

De paso, **7 de ellas ganaron vídeo** (lo tenían disponible en
`assets/videos-publicados.json` y seguían con foto): mordedor dental, pack de
coche, pez móvil, portabolsas, protector de sofá, rascador de pared y rascador
redondo.

## 2. Lo que se creyó y no era

Se dio por hecho que los 32 vídeos cubrían productos sin publicación. **Falso:
solo uno** (secador y cepillo 2 en 1) no tenía ninguna publicación programada.
Casi todos los vídeos ya se estaban usando.

El hueco real es otro y es mucho mayor.

## 3. El hueco real: 53 de 120 productos no se promocionan nunca

De los 120 productos activos, **67 aparecen en alguna publicación y 53 no
aparecen en ninguna**. Entre esos 53 están:

- **Los 19 de la tanda 3 entera** (subida el 16/09).
- **Toda la línea de invierno**: manta autocalentable, cama cueva, jersey de
  punto, mono acolchado, botas impermeables, sudadera de forro polar.
- Productos de gato con buen margen: fuente de agua, túnel, bicho eléctrico,
  coche teledirigido, hierba gatera, mochilas transportín.

Y el calendario estaba **lleno un pase al día hasta el 25 de noviembre**, que es
justo cuando el invierno es pico. La línea de invierno se iba a perder su
temporada entera.

## 4. Lo que se ha hecho: un segundo pase a las 10:00

Medido con `getBestTimeToPostByNetwork` (TikTok, semana del 16/09):

| Hora | Mié | Jue | Vie |
| --- | ---: | ---: | ---: |
| 10:00 | **1432** | **1471** | **1379** |
| 12:00 | 1359 | 1299 | 1251 |
| 18:00 | 1386 | 1378 | 1222 |

**Las 10:00 es la mejor hora, por encima de las 18:00 que ya se usaba.** Así que
el segundo pase va ahí y no se pisa con el existente.

**12 publicaciones nuevas, del 18 al 29 de septiembre a las 10:00:**

| Día | Producto | Gancho |
| --- | --- | --- |
| 18 | Hamaca de radiador | El sitio que el gato ya eligió |
| 19 | Saco cueva | No quiere una cama, quiere techo |
| 20 | Manta autocalentable | Sin enchufe ni cables que morder |
| 21 | Abrigo de invierno | Las medidas reales, no «perro mediano» |
| 22 | Cuello braga | Secador, tormenta y orejas en el cuenco |
| 23 | Escalera de arenero | No es rebeldía: no puede entrar |
| 24 | Comedero con sensor | La tapa se abre cuando él llega |
| 25 | Comedero doble inclinado | Si vomita al comer, mira el cuenco |
| 26 | Collar con chapa grabada | Tu teléfono sin la chapa que suena |
| 27 | Manta de felpa | El pelo se queda en la manta |
| 28 | Pijama de felpa | Para los que tiritan dentro de casa |
| 29 | Cama cueva | Tu gato busca 30 grados, no 20 |

Los 12 enlaces comprobados. Tres dieron 429 desde el escaparate (el limitador
por User-Agent, no un enlace roto) y se confirmaron por la API.

Cada texto dice también lo que el producto **no** hace: el comedero con sensor
no es programable, la escalera no quita el dolor de la artrosis, la manta de
felpa no es impermeable, el pijama no vale para la calle con lluvia, el cuello
no es un protector auditivo homologado.

## Reglas que ya estaban y siguen valiendo

- **Con vídeo, `autoAddMusic` va a `false`.** TikTok rechaza el post si no.
- **El `id` del post cambia al actualizarlo; el `uuid` no.** Hay que releer el
  calendario para tener ids frescos antes de un segundo cambio.
- El escaparate limita por User-Agent, no por IP. Si sale 429, comprobar por la
  API en vez de insistir.

## Lo que queda

- **41 productos siguen sin ninguna publicación.** Los siguientes por valor:
  fuente de agua, túnel interactivo, jersey de punto, mono acolchado, botas
  impermeables, mochilas transportín, pajarita, arnés de pecho con correa.
- El 25 de noviembre repite producto con el 4 de noviembre (manopla de baño).
  Se dejó como estaba: cambiar de producto una publicación ya planificada es
  decisión de Pablo, no mía.

---

# Segunda parte del mismo día: los 41 productos sin publicación

## Qué se comprobó antes de tocar nada

No se dio por buena la cifra anterior. Se volvió a calcular de cero:

- **120 productos activos** leídos de la API de Shopify (tres páginas de 50, 50 y 20).
- **79 productos ya tenían publicación**, sacando el enlace del texto de cada
  publicación del calendario entre el 16 de septiembre y el 25 de noviembre.
- La resta da **41 productos sin ninguna publicación**. Coincide con la cifra
  de antes, pero ahora está comprobada, no heredada.

El pase de las **10:00 estaba libre a partir del 30 de septiembre**: el primero
llegaba hasta el 29 y el de las 18:00 se acaba el 25 de noviembre.

## Lo que se ha hecho: 39 publicaciones nuevas, 30 sep – 7 nov

Van en el pase de las 10:00, que es el que mejor mide. Orden pensado por
temporada: primero toda la ropa y la lluvia, porque octubre es cuando se compra,
y después lo que vende igual todo el año.

| Día | Producto | Lo que el texto admite que NO hace |
| --- | --- | --- |
| 30 sep | Mono acolchado 4 patas | Cuesta más ponerlo; talla por largo, no por kilos |
| 1 oct | Jersey de punto | Es punto, no impermeable |
| 2 oct | Sudadera forro polar | Abriga, pero no corta el viento con lluvia |
| 3 oct | Botas impermeables | Ningún perro las acepta el primer día |
| 4 oct | Chubasquero | Tarda más en ponerse que una capa |
| 5 oct | Pack baño y lluvia | Albornoz en talla M; cambio de talla gratis |
| 6 oct | Bálsamo almohadillas | Si sangra o cojea, veterinario |
| 7 oct | Pijama fino | Es fino: para casa, no para enero en la calle |
| 8 oct | Sudadera frutas y animales | La talla no va por kilos |
| 9 oct | Vestido colegial | Es ropa de foto, no prenda de invierno |
| 10 oct | Fuente de agua gato | Una fuente no cura nada; filtro y zumbido |
| 11 oct | Túnel interactivo | No sustituye a que juegues tú |
| 12 oct | Mochila transportín ventilada | Mide y pesa al gato antes |
| 13 oct | Mochila transportín grande | Pesa más; para trayectos cortos sobra |
| 14 oct | Collar AirTag | **El AirTag no va incluido** |
| 15 oct | Chapa identificativa | No sustituye al microchip, obligatorio en España |
| 16 oct | Collar letras strass | Es decoración, no identificación |
| 17 oct | Arnés de pecho + correa | Cómodo, pero no es un antitirones |
| 18 oct | Correa antitirones | Suaviza el tirón, no enseña a no tirar |
| 19 oct | Comedero elevado | Altura del pecho; si vomita, veterinario |
| 20 oct | Bebedero 2 en 1 | 480 ml no dan para un día entero de excursión |
| 21 oct | Alfombrilla atrapa-arena | Recoge la mayor parte, no toda |
| 22 oct | Secador cepillo | Hace ruido; hay que acostumbrarlo |
| 23 oct | Toallitas de dedo ojos | Si el ojo está rojo, veterinario |
| 24 oct | Bolsa de premios | No adiestra sola |
| 25 oct | Funda asiento trasero | Mide el ancho del asiento antes |
| 26 oct | Almohada de algodón | Es una almohada, no una cama |
| 27 oct | Pajarita | De 20 a 36 cm: perro pequeño y gato |
| 28 oct | Hamaca colgante jaula | Necesita algo de donde colgarla |
| 29 oct | Hierba gatera hidropónica | Tarda 4-5 días y dura unas semanas |
| 30 oct | Coche teledirigido gato | — (mando **y** modo automático) |
| 31 oct | Bicho eléctrico gato | No le va a cansar toda la noche |
| 1 nov | Pelota canto de pájaro | Hay gatos a los que el sonido les da igual |
| 2 nov | Pelota rodante automática | Se apaga sola a los 30 min de reposo |
| 3 nov | Juguete papel crujiente | Es de tela: no para destroza-peluches |
| 4 nov | Cuerda doble nudo | Cuando suelta hilos, se retira |
| 5 nov | Cuerda con ventosa | En parquet poroso o alfombra no agarra |
| 6 nov | Zanahoria mordedor | Resistente no es indestructible |
| 7 nov | Peluche cabezón | Es un peluche, con lo que eso implica |

Cada texto lleva el precio real y el enlace al producto concreto, nunca a la
portada.

## Los dos que se han dejado fuera a propósito

- **Alfombrilla refrescante de seda de hielo**
- **Gorro de sol para perro y gato**

Son productos de verano. Publicarlos en octubre en España es tirar el pase.
**Van en el hueco de mayo**, no antes. Es la única razón por la que la tanda son
39 y no 41.

## Un error que se cazó a tiempo

El texto del **Pack baño y lluvia** decía que incluía chubasquero, albornoz y
manopla. Al abrir la ficha resultó que es **albornoz + toalla de microfibra +
manopla**, y encima el texto añadía «no incluye toalla», que era justo lo
contrario de la verdad. Se corrigió la publicación antes de que se fuera nadie.

**La regla que sale de aquí:** en un pack no se escribe de memoria. Se abre la
ficha y se lee qué lleva dentro.

Lo mismo con el **coche teledirigido**: iba a decir «no se mueve solo». La ficha
dice que tiene mando **y** modo automático. Comprobado antes de publicar.

## Comprobaciones

- **39 de 39 enlaces responden 200** con User-Agent de móvil. Tres dieron 429 a
  la primera (el limitador por User-Agent otra vez) y salieron 200 al reintentar.
- **El 25 de octubre cambia la hora en España.** Las publicaciones del 25 en
  adelante se mandaron con desfase +01:00 en vez de +02:00. Releído el día 25 en
  el calendario: la publicación está a las 10:00 de Madrid, como debía.
- Ninguno de los 39 estaba ya en el calendario: la lista se cruzó contra los 79
  que sí tenían publicación.

## Un detalle del formato que costó cinco errores

`createScheduledPost` **rechaza el post si mandas `twitterData` o
`instagramData` sin tener esas redes en `providers`**:

```
networkData contains data for network 'twitter' not listed in providers
```

Las publicaciones viejas los traen porque el servidor los rellena solo en la
respuesta. Al crear, solo se manda el `networkData` de las redes que van en
`providers`. Aquí, solo `tiktokData`.

## Estado del calendario después de esto

- **10:00** — lleno del 16 de septiembre al 7 de noviembre.
- **18:00** — lleno del 16 de septiembre al 25 de noviembre.
- **118 de 120 productos activos tienen ya publicación.** Los dos que faltan son
  los de verano, a propósito.

## Lo que queda

- Meter los dos de verano en mayo.
- El 25 de noviembre sigue repitiendo producto con el 4 de noviembre (manopla de
  baño). Se deja como está: cambiar de producto una publicación ya planificada
  es decisión de Pablo.
- A partir del 8 de noviembre el pase de las 10:00 queda libre otra vez. Ahí
  toca empezar a repetir los productos que mejor funcionen, no inventar más.
