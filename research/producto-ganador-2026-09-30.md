# Producto para la primera prueba de anuncios (50 €): estudio de mercado en internet — 30-09-2026

Pablo: «Lo que tenemos que elegir es el producto ganador de nuestra tienda, pero
minuciosamente». Luego pidió que el estudio se hiciera en internet, no con las
visitas de la tienda, porque aún no hay publicidad. La primera versión de este
archivo usaba datos de la tienda y está en el historial de git.

Todo lo de abajo se leyó el 30-09-2026 salvo donde se indica otra fecha.

## Fuentes

| Fuente | Qué se sacó | Cómo |
|---|---|---|
| Amazon.es, «Los más vendidos» | 24 listas de 30 productos: 12 categorías de accesorios de perro y gato, 5 subcategorías de camas y hamacas de gato, 7 de camas, mantas y ropa de perro | `curl` con navegador de escritorio, 4 s entre páginas |
| Amazon.es, «Últimas novedades» | Las mismas 12 subcategorías finas | ídem |
| Amazon.es, búsqueda | «hamaca radiador gato», «saco dormir gato», «manta autocalentable gato» | ídem |
| Zooplus, Tiendanimal, Kiwoko, Miscota | Precio de la hamaca de radiador | Parallel Search (resultados del 30-09) |
| Biblioteca de anuncios de Meta, España, anuncios activos | Quién anuncia qué | Parallel Search. La herramienta puede devolver una copia guardada; la fecha anotada abajo es la que ella da. Se confirma con los enlaces directos |
| Google (autocompletar, España) | Qué escribe la gente | `suggestqueries.google.com` |
| Volúmenes de Google | `research/tendencias-2026-09-09.md`, `gatos-2026-09-10.md`, `invierno-2026-09-14.md` | Guardados en septiembre. Hoy no hay volúmenes nuevos (ver abajo) |
| Nuestros precios y costes | 135 fichas activas | API de Shopify |

No se pudo:
- Google Trends devolvió 429.
- OpenRush no tiene créditos.
- «Productos del momento» de Amazon sale vacío sin un navegador real.

No se recargó nada.

## Lo más importante: en casi todo, Amazon es más barato que nosotros

Un cliente que ve nuestro anuncio y busca el producto en Google lo encuentra más
barato y con entrega en 1-2 días. Nosotros tardamos de 8 a 15 días. Por debajo
de 39 € le sumamos 6,99 € de envío.

| Producto | Nosotros, con envío | Lo más barato encontrado en España (30-09) |
|---|---:|---|
| Hamaca de radiador | 36,89 € | Zooplus «Yumi» 12,49 € (74 opiniones, 4,4); Amazon Trixie 17,89 €; Tiendanimal Leeby 16,99 € (10,19 € en oferta) |
| Saco cueva | 36,89 € | Amazon Mobiclinic 16,11 €; otros de 11,13 a 31,48 € |
| Manta autocalentable S | 26,89 € | Amazon lionto 13,88 €; las 4 más vendidas de «Lechos» de gato, de 14,99 a 19,99 € |
| Hamaca de ventana 54×30 | 31,89 € | Amazon EDAGNY 54×30 24,64 € (#3 de «camas de ventana»); Dracarys 23,99 € |
| Cama dónut 40 cm | 29,89 € | Amazon Bedsure 19,60 € (#1 de camas de gato, 3.904 opiniones) |
| Chubasquero | 26,89 € | Amazon #1 23,99 € (12.278 opiniones); BPS 14,99 € |
| Botas (juego de 4) | 29,89 € | Amazon 18,99 € (1.868 opiniones); Trixie 16,52 € |
| Fuente de gato | 36,89 € | Amazon 16,24-26,59 € |

Consecuencia: el anuncio no puede presentar el producto como «barato». Tiene que
vender algo que Amazon no ofrece así: el conjunto, la comodidad y la imagen.

## Qué se vende en España en esta época (Amazon.es, 30-09)

- **Gato, camas.** La manta autocalentable ocupa los puestos 1 a 4 de «Lechos»:
  - XIAPIA, 253 opiniones;
  - Wdmiya, 126;
  - Nobleza, 388;
  - Petace, 1.691.

  PiuPet, con 5.080 opiniones, es la #9. Las camas cueva o iglú también venden: la Bedsure es la #2 de camas, con 1.156 opiniones.
- **Hamacas de radiador.** Están en las novedades de «camas de ventana»: B0H3P299N1 a 20,99 € y JYQOQH a 25,99 €. Entran vendedores nuevos, y eso indica temporada.
- **Hamaca de ventana.** Es la categoría fina con más opiniones: EDAGNY #1 a 34,99 € (763 opiniones, 4,6).
- **Perro, invierno.** El chubasquero #1 tiene 12.278 opiniones y los abrigos #1 a #5 entre 1.199 y 9.653.
- **Tendencia nueva.** En las novedades de sudaderas de perro, 11 de los 12 primeros puestos son sudaderas de persona con bolsillo para llevar al perro o al gato. Casi no tienen opiniones todavía (de 0 a 2), así que es una tendencia que empieza, sin ventas probadas. No la tenemos. Queda apuntada.

## Qué se anuncia en Meta en España

Anuncios activos. Entre paréntesis, la fecha que da la herramienta: puede ser de una copia guardada, no de hoy. Una incoherencia lo confirma: la página de «cama para gatos» dice 06-08 y muestra un anuncio que empezó el 22-09.

- «hamaca radiador gato» (28-09): **ningún anuncio**.
- «manta autocalentable» (28-09): **ningún anuncio**.
- «hamaca gato» (21-07): unos 8 anuncios, todos de árboles rascadores con cama y hamaca.
  - Jupplies: desde el 09-07, con −50 %, pago contra reembolso y envío en 24 h.
  - KUNA HOM: desde el 28-05.

  Que sigan meses con el mismo anuncio indica que les compensa. Pero es un mueble grande que envían desde España: no lo podemos igualar desde China.
- «cama para gatos» (06-08): «Top ventas España» anuncia una lima de uñas para gato a 29,99 € con envío gratis. Empezó el 22-09 y lleva 2 anuncios.
- «chubasquero perro» (30-06): unos 8 anuncios, de marcas españolas.
  - candyPet: desde el 05-02, para galgos.
  - Tqel.
  - My Pug & Co.

Conclusión: en las tres piezas del pack de gato **no hay nadie anunciándose en Meta en España**. En chubasqueros y árboles rascadores, sí.

## Qué escribe la gente en Google (autocompletar, 30-09)

- «hamaca radiador» → «hamaca radiador gato».
- «manta autocalentable» → «manta autocalentable perro», «… gatos», «… para mascotas».
- «cama gato» → «cama gato ventana» y «cama gato pared» en los tres primeros puestos.
- «sudadera con bolsillo para» → «… perro», «… gatos», «… mascota», «… meter gato».

El autocompletar dice qué se busca, no cuánto. Volúmenes guardados en septiembre: «cama gato», 2.400 al mes; «abrigo para perros», 880 en septiembre y 2.900 en noviembre.

## Decisión

### El producto: Pack el gato en invierno, pero bajando su precio

Por qué sigue siendo el mejor, con datos de fuera:

1. Sus tres piezas **se venden ahora** en Amazon.es. La manta ocupa los puestos 1 a 4 de su categoría, y las hamacas de radiador entran en novedades.
2. **Nadie las anuncia en Meta en España** (según la copia del 28-09; hay que confirmarlo con el enlace directo). Hay sitio libre.
3. **Nadie las vende juntas.** El que lo quiere todo tiene que comprar tres cosas en tres sitios.
4. **Da más ganancia por venta que ningún otro:** 29,61 € a 66,90 €. Cada venta cubre más de media prueba.
5. **Sin tallas que dudar, y envío gratis** porque pasa de 39 €.

**El problema:** en Amazon, las tres piezas más baratas suman 47,88 €:
- hamaca Trixie, 17,89 €;
- saco Mobiclinic, 16,11 €;
- manta lionto, 13,88 €.

Nuestro pack cuesta 66,90 €: **19,02 € más**. Con marcas medias (lionto 27,09 + lionto cueva 25,58 + Petace 19,99) suman 72,66 €, y ahí nosotros estamos por debajo. Quien compara con lo más barato nos deja; quien compara con lo bueno, no.

**Propuesta: bajar el pack a 54,90 € mientras dure la prueba.** Queda 7 € por encima de lo más barato de Amazon, y 17,76 € por debajo de las marcas medias.

| Precio del pack | Ganancia por venta | Ventas para pagar los 50 € |
|---:|---:|---:|
| 66,90 € (hoy) | 29,61 € | 1,7 |
| 59,90 € | 23,96 € | 2,1 |
| **54,90 €** | **19,92 €** | **2,5** |
| 49,90 € | 15,88 € | 3,1 |

Ganancia = precio / 1,21 − coste de CJ con envío (24,16 €) − cobro (1,9 % + 0,25 €). Lo decide Pablo.

**Otros riesgos que no se pueden quitar:**
- La entrega tarda de 8 a 15 días. Hay que decirlo en el anuncio y en la ficha: hoy, 30-09, llega de sobra antes del frío fuerte y de Navidad.
- Las piezas sueltas están caras frente al mercado. La hamaca de radiador cuesta 29,90 € aquí y 12,49 € en Zooplus. Si alguien entra en la hamaca desde el pack, lo ve. Hay que revisarlo aparte.

### Segunda prueba, si el pack no vende: chubasquero de cuatro patas

- Es la categoría con más opiniones de ropa de perro (12.278 en el #1).
- Octubre es época de lluvia.
- Hay marcas españolas anunciándolo en Meta desde febrero: el canal funciona para este producto.
- Deja 14,59 € por venta, contando los 6,99 € de envío que paga el cliente.
- En contra: tiene tallas y Amazon lo vende a 23,99 €.

### Descartados, con el dato

| Producto | Motivo |
|---|---|
| Manta autocalentable sola | Amazon 13,88-19,99 €; nosotros 26,89 €. A 14,90 € dejaría 12,20 €, pero es poco para pagar anuncios. Va dentro del pack. |
| Hamaca de radiador sola | 36,89 € frente a 12,49 € en Zooplus. |
| Hamaca de ventana | 31,89 € frente a 23,99-24,64 € en Amazon por el mismo tamaño. |
| Lima de uñas | Un competidor ya la anuncia a 29,99 € con envío gratis; la nuestra sale a 36,89 €. |
| Árbol rascador | Es lo que más se anuncia, pero pesa mucho y lo envían desde España en 24 h. |
| Sudadera con bolsillo para mascota | Tendencia que empieza, sin ventas probadas todavía. Pendiente de mirar en CJ. |
| Cama cueva de invierno | La ficha no coincide con el producto de CJ (ver `redes-semanal.md`). |

## La prueba de 50 €

Sin cambios respecto a la versión anterior:
- 10 €/día durante 5 días.
- Campaña de ventas optimizada para «añadir al carrito».
- Un solo conjunto de anuncios con tres creatividades, todas hacia la ficha del pack.

Añadido tras el estudio:
- El texto del anuncio no presume de precio.
- Presume de lo que nadie más ofrece: «las tres cosas que tu gato necesita este invierno, en un solo pedido y con envío gratis».
- El plazo de entrega va dicho claramente.
