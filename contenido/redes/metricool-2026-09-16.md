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
