# Productos en tendencia en redes sociales (05-10-2026)

Pablo: «Busca productos nuevos en tendencia así tengas que ver por TikTok o lo
que sea; este mundo se mueve por las redes sociales».

## De dónde salen los datos

| Fuente | Qué se miró | Fecha |
|---|---|---|
| vidIQ, búsqueda de vídeos que superan a su creador (TikTok + Instagram) | 3 búsquedas: perro (inglés), gato (inglés), perro y gato (español). Vídeos publicados desde agosto (julio en español), mínimo 100.000 vistas (30.000 en español) | 05-10-2026 |
| Autocompletar de Google España | 15 búsquedas de prueba | 05-10-2026 |
| Amazon.es | Precios y opiniones de cada candidato (`curl`, 12 s entre páginas) | 05-10-2026 |
| CJ, API `/product/listV2` (`keyWord`) | Ficha, almacén, envío a España (`totalPostageFee`) y fotos | 05-10-2026 |

«Vídeo que supera» = un vídeo que tiene muchas más vistas que lo normal en
esa cuenta (por ejemplo, 40 veces su media). Se cuenta como tendencia solo lo
que sale en varios vídeos de cuentas distintas.

## Lo que se repite en redes

| Producto | Vídeos (vistas) | ¿Lo tenemos? |
|---|---|---|
| Hamaca para bañar y cortar uñas | 9 vídeos: 3,3 M, 1,7 M, 1,6 M, 1,3 M (español), 1 M, 802 K, 720 K (español, gatos), 678 K, 296 K | **No** |
| Orejeras antirruido para perro (tormentas, petardos) | 3 vídeos en español: 1 M, 456 K, 137 K («No sabía que esto existía para perros») | No (tenemos la capucha de punto, que es otra cosa) |
| Bolso de lona con ventana para la cabeza («corred a Zara») | 718 K, 780 K, 474 K (español), 260 K (español) | **No** |
| Secado de perro con el secador (saco o caja) | 1,6 M y 762 K, los dos en español | No |
| Botella de paseo 2 en 1 | 7,9 M (español), 1,5 M, 1,1 M (España) | **Sí** |
| Peluche con latido para la ansiedad | 976 K, 263 K (español) | **Sí** |
| Fuente de agua para gato | 2,2 M, 907 K (España) | **Sí** |
| Guante quitapelo | 3 M (español) | **Sí** |
| Correa manos libres | 316 K, 151 K | **Sí** |
| Funda de asiento del coche | 945 K | **Sí** |
| Saco de boxeo para gato | 413 K (español), 197 K | No (descartado: ver abajo) |
| Palitos de matatabi o cuerda dental para gato | 2,6 M, 2 M, 252 K | No (descartado) |
| Arco cepillo para gato | 3,2 M, 1,2 M (español), 1,1 M (español) | No (descartado) |

## Los cuatro que pasan todos los filtros

La ganancia se calcula así: precio / 1,21 − coste real de CJ − (precio × 0,016 + 0,30).

- **Coste real de CJ** = (producto × 1,21 + `totalPostageFee` + 0,02) × 0,92. Se
  calcula con la variante más cara y el envío de la más pesada.
- **Peor caso** = envío gratis (pedido de 39 € o más).
- **Si va solo** = por debajo de 39 € el cliente paga los 6,99 € de envío.

| Producto (CJ) | Almacén / envío | Coste real | Precio propuesto | Ganancia peor caso | Si va solo | Amazon.es |
|---|---|---:|---:|---:|---:|---|
| Hamaca de aseo de malla, XS a L (1–19 kg). pid 1823919189233913856 | China, 14.667 uds; CJPacket Eub 4-9 días | 7,59 € | 24,90 € | **12,29 €** | 17,95 € | 20–31 € (BEAUTYZOO 31,45 €, 400 opiniones) |
| Orejeras antirruido, S a XL, negro o azul. pid 2412211207431606000 | China, 7.177 uds; CJPacket Eub 4-9 días | 11,06 € | 24,90 € | **8,82 €** | 14,49 € | 24,53 € (67 opiniones) a 45 € |
| Bolso de lona con ventana y forma de abeja, M y L. pid 2093281779628630018 | China, 7.322 uds; 8-18 días | 13,85 € | 27,90 € | **8,46 €** | 14,13 € | el mismo modelo, 18,62–21,69 € |
| Caja de secado plegable, 52 × 52 × 40 cm. pid 1503636386107371520 | China, 36.400 uds; 8-18 días | 18,91 € | 39,90 € | **13,12 €** | — | solo cajas automáticas, de 380 a 615 € |

### Riesgos de cada uno (sin comprobar todavía)

- **Hamaca.**
  - CJ no pone nombre a las tallas en la búsqueda. La ficha dice XS, S, M y L, y la tabla de pesos sale en su segunda foto.
  - No he podido ver los vídeos. Algunos podrían enseñar un modelo con estructura de pie, no colgado.
- **Orejeras.**
  - Lo bueno: la Nochevieja y los petardos. Hay que publicarlas en noviembre para que lleguen a tiempo.
  - No se puede prometer cuántos decibelios quitan: CJ no da la cifra.
- **Bolso abeja.**
  - En Amazon sale más barato que con nosotros, así que el anuncio no puede presumir de precio.
  - Las tallas no cuadran: la foto pone S/M y CJ pone M/L. Hay que aclararlo antes de publicar.
  - «Paw Peek» es el nombre comercial: no se usa. Tampoco se nombra a Zara.
- **Caja de secado.**
  - No es el mismo formato que en los vídeos (allí sale un saco). Es el mismo uso, pero no se puede decir que sea «el viral».
  - Por la medida, solo vale para perro pequeño o gato.

## Descartados y por qué

| Producto | Motivo |
|---|---|
| Saco de boxeo para gato | En Amazon cuesta 10 €; aquí cuesta 10,41 € puesto en España |
| Correa doble extensible | En Amazon hay una a 11,73 € con 895 opiniones; aquí gana menos de 8 € |
| Palitos de matatabi | Ganancia de 4 €. Solo serviría metido en un pack |
| Arco cepillo para gato | Las fotos de CJ llevan la caja de una marca registrada; coste de 15 € por 720 g |
| Lija de uñas con premio | Coste de 19 € y fotos con pinta de hechas con IA |
| Rascador árbol de Navidad | 6,8 kg: el envío sale a 62 $ |
| Masajeador de cabeza | Coste de 22 € y no es el modelo de los vídeos |
| Pelota que rueda sola para perro | Casi igual que la de gato que ya vendemos |

## Lección de método

La búsqueda por nombre de CJ (`/product/list` con `productNameEn`) ya no filtra:
devuelve productos recién subidos, como ropa o bolsos, sin relación con lo buscado.
La que funciona es `/product/listV2` con `keyWord`, `page` y `size`: la lista
está en `content[0].productList`, con `id`, `nameEn`, `sellPrice`, `listedNum`
y `warehouseInventoryNum`.
