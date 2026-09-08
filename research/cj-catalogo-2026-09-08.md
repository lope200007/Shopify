# Cuánto tiene CJ para nosotros

8 septiembre 2026. Consultado en vivo contra `api2.0` con `scripts/cj/cj.js`.

## Primero: lo del «quedan cero» no es un fallo

Comprobado sobre las 126 variantes publicadas: **las 126 se pueden comprar**.
El JSON-LD de cada ficha dice `InStock`, y en ninguna página del sitio aparece
un contador de unidades.

El cero que se ve está en el **panel de Shopify**, y es correcto que esté ahí:

| Ajuste | Valor | Qué significa |
| --- | --- | --- |
| `tracked` | `false` | Shopify no lleva la cuenta del stock |
| `inventoryPolicy` | `CONTINUE` | Se puede comprar aunque marque 0 |
| `inventoryQuantity` | `0` | Es el valor por defecto cuando no se lleva cuenta |

Es la configuración correcta para dropshipping: el stock lo tiene CJ, no
nosotros. Si activáramos el seguimiento tendríamos que meter cantidades a mano
y mantenerlas al día para 126 variantes. **No hay nada que arreglar.**

## Cuánto hay en CJ

| | Productos |
| --- | ---: |
| Catálogo total de CJ | 1.535.855 |
| Categoría *Pet Supplies* | 30.079 |
| Quitando pájaros y peces (perro y gato) | **29.467** |

Reparto por categoría en `cj-conteo-categorias-2026-09-08.json`. Las mayores:
ropa (3.564), nidos y camas (2.121), collares (1.708), correas (1.325),
comederos (1.282), duchas y baño (1.114).

## El dato que importa: con almacén europeo hay 120

`countryCode` filtra por almacén con stock. Sobre las 59 categorías de perro y
gato:

| Almacén | Productos |
| --- | ---: |
| Alemania | 117 |
| España | 3 |
| Francia | 0 |
| Chequia | 0 |
| Polonia | 0 |
| **Total Europa** | **120** |

**120 de 29.467 es el 0,4 %.** Todo lo demás sale de China.

> **Corrección del mismo día.** Escribí aquí «20-30 días» copiando
> `cj-almacenes-2026-09-04.md`. Es falso. Ver el apartado siguiente: el dato
> medido contra la API de CJ es **4 a 8 días** de transporte a España.

Esto confirma y amplía lo de `cj-almacenes-2026-09-04.md`, que solo había
mirado 5 categorías. Ahora está medido el catálogo entero de mascotas.

## El plazo real desde China: 4 a 8 días, no 20-30

Consultado `/logistic/freightCalculate` para tres productos distintos (barrera,
parque plegable y botón grabable), destino Madrid:

| Transportista | Coste | Plazo |
| --- | ---: | --- |
| CJPacket Ordinary | 3,79–10,81 $ | **4-8 días** |
| CJPacket Eub | 3,57–7,43 $ | 4-9 días |
| CJPacket Sensitive | 7,53 $ | 5-7 días |
| YunExpress Ordinary | 6,05–9,14 $ | 8-15 días |
| DHL Official | 37,19 $ | 7-10 días |

Con 1 a 3 días laborables de preparación, el total honesto es de **5 a 11 días**:
una o dos semanas.

Esto cambia la conclusión de `cj-almacenes-2026-09-04.md`, que daba por hecho
20-30 días sin haber consultado los portes. **El almacén europeo no es la
frontera que parecía.** Los 29.467 productos son alcanzables con un plazo que
un cliente español acepta; los 120 europeos ahorran unos pocos días, no tres
semanas.

Lo que sigue en pie de aquel documento: el almacén sí es europeo solo en 120
casos, y la portada nunca debe decir «enviamos desde Europa».

## Y de esos 120, cuántos nos sirven de verdad

Listado completo en `cj-europa-2026-09-08.json`. Filtrando:

| | Productos |
| --- | ---: |
| Con almacén europeo | 120 |
| Quitando jaulas de gallinas y conejos, casas de hámster, muebles de gato, pienso, arena y —literalmente— dos juegos de jardín de madera | 50 |
| De esos, con coste por debajo de 30 $ (nuestro rango de precio) | **24** |

Las categorías de CJ están mal puestas: los 36 de «Pet Guardrails» con stock
alemán son gallineros y conejeras, y en «Pet Tunnel Toys» hay rampas, escaleras
y vallas de madera para perro. Todo ese bloque alemán parece stock de un
mayorista tipo vidaXL.

### Lo que encaja con la tienda tal y como está (coste < 30 $)

| Almacén | Coste | Producto | Comentario |
| --- | ---: | --- | --- |
| ES | 8,20 $ | Correa extensible de nailon 3,5 m | **No vendemos correa suelta.** Hueco real |
| ES | 13,90 $ | Bolso bandolera de algodón para llevar al perro | Categoría nueva |
| DE | 13,39 $ | 750 bolsas para excrementos | Complemento barato, buen añadido a packs |
| DE | 13,52 $ | Alfombrilla de maletero 180 × 103 cm | Compite con nuestro cubremaletero |
| DE | 16,35 $ | Alfombrilla de maletero con bolsillos | Igual |
| DE | 16,00 $ | Arnés antitirones con portabolsas | Compite con nuestro arnés |
| DE | 19,83 $ | Chubasquero con bandas reflectantes | Ya vendemos chubasquero |
| DE | 21,71 $ | Abrigo impermeable con arnés integrado | Categoría nueva |
| DE | 18,53 $ | Empapadores, 100 uds. | Cachorro |
| DE | 29,79 $ | Bandeja de baño con césped artificial | Cachorro / piso |
| DE | 10–14 $ | Seis productos de higiene: spray desodorante enzimático, toallitas de lagrimal, guantes SPA, capuchón dental, cubreorejas, spray de plantas | Los mismos seis de la revisión anterior |
| DE | 15,43 $ | Dos juguetes de perro (pelota con resorte, juguete eléctrico 3 modos) | |
| DE | 15,18 $ | Collar antiladridos con vibración | **No lo pondría.** Collar de castigo |
| ES | 19,80 $ | Pack de 12 pelotas de caucho | Cantidad rara para venta al público |
| DE | 22,90–23,13 $ | Tres vallas/parques de 8 paneles | Compite con nuestro parque |

Descontando los duplicados de lo que ya vendemos y el collar antiladridos,
quedan **entre 8 y 10 productos** que aportarían algo nuevo.

### Y un bloque aparte: mueble grande alemán (26 productos, 34–185 $)

Rampas de madera, escaleras plegables, vallas de barrotes de 150 y 300 cm,
casetas, jaulas tipo mueble, remolques de bicicleta, carritos y un secador
profesional de 2.400 W.

Es material bueno y sale de Alemania, pero a coste 34–185 $ el precio de venta
va de 80 a 400 €. **Es otra tienda**: la nuestra vende entre 14,90 € y 49,90 €.
No es un «añadir productos», es una decisión de negocio.

## Lo que ya está listo y no está publicado

Tres fichas creadas en Shopify en estado **borrador**, con fotos y precio:

| Ficha | Precio | Origen |
| --- | ---: | --- |
| Comedero rotativo antivoracidad | 29,90 € | CJPB2986711 |
| Bola dispensadora de premios | 24,90 € | CJCT2914956 |
| Dispensador por gravedad de pienso y agua | 29,90 € | CJMY1636996 |

La tercera necesita reescritura: el proveedor la vende como comedero
programable por temporizador, no como dispensador por gravedad.

Y siete fichas de proveedor ya descargadas en `proveedores/cj/` que nunca se
llegaron a subir: alfombrilla de lamer (CJGY1620901), cortaúñas con luz LED
(CJGY1675701), correa extensible reflectante (CJGY1734347), alfombrilla de
asiento trasero (CJGY2114653), cepillo autolimpiable (CJHR3061298), protector
de asiento acolchado (CJJJCWGY00086) y lima de uñas a pilas (CJYD2290404).

## La conclusión

La pregunta «cuántos productos tiene CJ para nosotros» tiene dos respuestas muy
distintas:

- **Con el plazo real de 1 a 2 semanas: 29.467.** Añadir producto no es el
  cuello de botella; podríamos triplicar el catálogo esta semana.
- **Si quisiéramos entrega en 3 o 4 días: 120, y útiles de verdad unos 10.**

Medidos los portes, la disyuntiva es mucho menos dramática de lo que parecía.
Una o dos semanas no compite con Amazon Prime, pero es un plazo normal para
una tienda pequeña y se puede decir sin avergonzarse. **El catálogo está
abierto.** Lo que decide qué añadimos es el criterio de producto, no la
logística.
