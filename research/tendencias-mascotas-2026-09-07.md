# Que se busca y que se vende: investigacion de mercado

Fecha: 2026-09-07. Guia: skill `researching-product-market`.

Dos fuentes independientes, cruzadas:

1. **Demanda de busqueda real en Espana** (indice de busqueda, no estimacion
   mia): volumen mensual, tendencia de 12 meses e intencion.
2. **Que se vende de verdad en dropshipping**: el campo `listedNum` de CJ,
   que dice en cuantas tiendas esta listado cada producto. Un producto que
   1.000 tiendas venden no lo venden por casualidad.

No se ha scrapeado Amazon ni AliExpress: la skill lo prohibe, viola sus
terminos y con datos de resenas entra el RGPD.

## Lo que mas se busca en Espana (y podemos vender)

| Busqueda | Vol./mes | Tendencia | Lo tenemos? |
|---|---|---|---|
| cama perro + camas para perros | **13.200** | Pico nov-ene (9.900) | **NO -> ahora SI** |
| arnes para perros | 4.400 | Plana | Si |
| jaula para perros | 4.400 | Pico enero | No (no encaja) |
| cama perro grande | 3.600 | Pico nov-dic (5.400) | **NO -> ahora SI** |
| rampa para perros | 3.600 | Plana | No |
| carritos para perros | 3.600 | Sube en verano | No |
| escalera para perros | 2.900 | Plana | Si |
| caseta perro | 2.900 | Pico nov | No |
| correas para perros | 1.900 | Plana | Si |
| valla para perros | 1.900 | Plana | Si (barrera) |
| ropa para perros | 1.300 | **Pico dic-ene (2.900)** | Si (chubasquero, chaleco) |

### El hallazgo principal

**"Cama para perro" es la mayor demanda del nicho y la tienda no tenia
ninguna.** 13.200 busquedas al mes entre las dos formas, y el pico cae
exactamente en noviembre-enero. En septiembre eso no es una oportunidad
futura: es el momento de estar posicionado antes de que llegue.

### Descartado por riesgo, no por falta de demanda

| Busqueda | Vol./mes | Por que NO |
|---|---|---|
| collar seresto perros | **9.900** | Marca registrada (Bayer). Vender copias = tienda cerrada y cuenta bancaria bloqueada |
| collar scalibor / antiparasitario | 3.600+1.900 | Producto veterinario. Categoria restringida en publicidad y en pagos |
| gps para perros | 3.600 | CPC de 1,39-1,52 USD, el mas alto del nicho. Pero es electronica con suscripcion: soporte imposible y marcado CE nuestro |
| collar electrico / adiestramiento / antiladridos | 5.500 juntas | Dispositivos aversivos. Meta y Google rechazan los anuncios, y su venta esta restringida en varias comunidades |

El collar Seresto es la busqueda mas grande del nicho **y es exactamente la
que hunde tiendas**. Queda dicho por si alguien lo propone.

## Que se vende de verdad (tiendas que lo listan)

| Producto | Tiendas | Coste CN->ES | Veredicto |
|---|---|---|---|
| Rampa para perro | **307** | 38,93 EUR | **NO**: una sola imagen y 29,47 EUR solo de porte (pesa 3,5 kg) |
| Cama sofa con funda desmontable | **86** | 16,52-55,79 EUR | **SI** |
| Cama sofa indoor | 21 | 27,29 EUR | No: peor coste, menos senal |
| Cama bolster acolchada | 11 | 13,94 EUR | No: sin medidas publicadas |
| Abrigo reflectante integral | **242** | 13,49 EUR | Bloqueado: sin tabla de tallas |

La rampa duele: 307 tiendas la venden y en Espana se busca 3.600 veces al
mes. Pero la skill avisa de esto literalmente ("los articulos pesados se los
come el envio") y aqui el porte es tres veces la mercancia. Con una sola
foto, ademas, no hay ficha que hacer.

## El producto que entra: cama sofa con funda desmontable

Listada en **86 tiendas**. Es la unica de las cuatro camas evaluadas que
publica **medidas reales de las seis tallas**, que en una cama es el dato
que decide la compra y la devolucion.

### Economia por talla

Portes reales de `freightCalculate` CN->ES, cambio 0,92 EUR/USD, IVA 21%
descontado del PVP para calcular el ingreso neto.

| Talla | Medidas cm | Coste | PVP | Neto | **Margen** | Envio |
|---|---|---|---|---|---|---|
| S | 45 x 39 x 21 | 16,52 | 49,90 | 41,24 | **24,72** | paga 6,99 |
| M | 55 x 40 x 23 | 21,11 | 55,90 | 46,20 | **25,09** | gratis |
| L | 65 x 45 x 30 | 25,33 | 64,90 | 53,64 | **28,31** | gratis |
| XL | 80 x 50 x 32 | 32,47 | 79,90 | 66,03 | **33,56** | gratis |
| 2XL | 100 x 68 x 38 | 49,05 | 109,90 | 90,83 | **41,78** | gratis |
| 3XL | 120 x 70 x 40 | 55,79 | 124,90 | 103,22 | **47,43** | gratis |

**El margen mas bajo (24,72 EUR) dobla el coste de captacion estimado
(12,30 EUR).** Es el producto con mejor economia de toda la tienda, y de
las seis tallas cinco pasan del umbral de envio gratis.

Supuestos declarados, no medidos: captacion de 12,30 EUR (estimacion previa,
sin datos propios todavia), cambio 0,92 EUR/USD, y **compra repetida cero**
— la skill avisa de que asumir recompra es lo que hace que productos que
pierden dinero parezcan rentables.

### Lo que NO dice la ficha

El nombre chino del producto la llama ortopedica. **No se ha puesto.** El
relleno es fibra de poliester, no viscoelastica, y vender un beneficio
medico que no se puede demostrar es justo lo que no hacemos. La ficha lo
dice explicitamente y remite al veterinario si hace falta una cama de
descarga articular.

### Comprobado

- 24 variantes (4 colores x 6 tallas), las 24 con su SKU mapeado a CJ
- 8 imagenes, todas revisadas una por una: sin texto en ingles, sin gatos
  colados, y una ensena la cremallera con el relleno fuera
- Ficha en la web: 200, titulo de 53 caracteres en Google, meta de 131,
  `og:image`, y los seis precios visibles
- `npm run cj:mapa` sobre los **129 SKU** activos: **0 sin mapeo**

## Lo siguiente, por orden de retorno

1. **Desbloquear las dos prendas** pidiendo la tabla de tallas a CJ. "Ropa
   para perros" sube de 1.300 a 2.900 busquedas entre ahora y diciembre, y
   las dos fichas estan hechas salvo por ese dato.
2. **Partir "Casa, coche y paseo"**, que ya son 16 productos y ahora mezcla
   camas con cinturones de coche. Con 13.200 busquedas al mes, "camas"
   merece coleccion propia.
3. **Buscar una rampa ligera**. La demanda esta (3.600/mes); lo que falla
   es ese producto concreto, de 3,5 kg.

## Coleccion propia para las camas

Hecho despues de la investigacion, porque la investigacion lo justifica.

La cama entro en "Casa, coche y paseo", que ya eran 16 productos y mezclaba
camas con cinturones de coche. Con **13.200 busquedas al mes**, "camas" no
puede vivir dentro de un cajon de sastre: necesita una pagina propia a la
que Google pueda mandar esa busqueda.

Se ha creado **Camas y descanso** (`/collections/camas-y-descanso`), por
etiqueta `descanso`, con cuatro productos que comparten un mismo trabajo:
donde pasa el perro las doce o catorce horas que duerme.

- Cama sofa con funda desmontable
- Manta impermeable (cuando el sitio elegido es tu sofa)
- Escalera plegable (el perro que ya no salta)
- Parque plegable (el cachorro que aun no puede quedarse suelto)

Ordenada por mas vendido, con su imagen para compartir, y anadida al menu
principal entre "Higiene y cuidado" y "Casa y coche".

No se ha hecho el reparto completo de "Casa, coche y paseo" en tres
colecciones: eso deja el menu en once entradas y en movil se hace largo. Es
una decision de navegacion que conviene tomar mirando la tienda, no a ciegas.

## Verificacion final

Se deja el script en `scripts/verificar-tienda.py`. Descarga cada pagina
publica y comprueba HTTP 200, titulo por debajo de 60 caracteres ya
decodificado, meta descripcion bajo 155, `og:image`, el bloque "Tambien en
pack" en las 12 fichas que lo llevan, y 4 imagenes minimo en los packs.

```
35 productos + 7 colecciones + portada
FALLOS: 0
PENDIENTE DE TI: 1  -> portada sin og:image (ajuste del tema)
```
