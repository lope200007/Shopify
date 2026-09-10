# La regla del porte, por fin entendida

10 de septiembre de 2026. La API de portes de CJ lleva todo el dia respondiendo.

Durante semanas dimos por muertas las camas, las rampas y las casetas —unas
15.000 busquedas al mes— porque una cama redonda de 380 g pagaba **18,12 €** de
porte. La conclusion de entonces fue «el flete se cobra por volumen y las camas
abultan». Era media verdad, y la media que faltaba cambia el catalogo entero.

## Lo que decide no es el peso ni el volumen: es el lado mas largo del bulto

CJ tiene una linea aparte, **CJPacket Sensitive Oversize Line**, y cuando un
paquete cae en ella el precio se dispara a 25-29 € pase lo que pase. Lo que la
dispara es que **el lado mayor del embalaje pase de unos 60 cm**.

Medido hoy, mismo dia, mismo destino (China -> Espana):

| Producto | Bulto (mm) | Lado mayor | Peso | Porte | Linea |
|---|---|---:|---:|---:|---|
| Cama en donut 40 cm | 300 x 200 x 30 | 30 cm | 230 g | **5,05 €** | YunExpress Ordinary |
| Cama en donut 80 cm | 350 x 200 x 80 | 35 cm | 870 g | **9,80 €** | YunExpress Ordinary |
| Cueva de tela M | 430 x 370 x 20 | 43 cm | 300 g | **6,29 €** | YunExpress Ordinary |
| Cama desenfundable 40 cm | 500 x 400 x 30 | 50 cm | 570 g | **8,91 €** | YunExpress Ordinary |
| Colchoneta rectangular 60x45 | 480 x **650** x 30 | **65 cm** | 900 g | **25,39 €** | Sensitive Oversize |
| Colchoneta rectangular 80x60 | 580 x **850** x 35 | **85 cm** | 1.150 g | **28,90 €** | Sensitive Oversize |

La colchoneta de 900 g paga cinco veces mas que la cama de 870 g. No es el peso.

## Lo segundo: el volumen, cuando el bulto es cubico

Dentro de la linea normal si se cobra por volumen. Una cama que viene **plegada
o comprimida al vacio** viaja plana y sale barata; la misma cama sin comprimir,
en una caja cubica, no.

| | Bulto | cm3 | Peso | Porte |
|---|---|---:|---:|---:|
| Cama redonda 40 cm, comprimida | 300 x 200 x 30 | 1.800 | 230 g | 5,05 € |
| «Set» de cama 40 cm, sin comprimir | 480 x 380 x 120 | 21.888 | 473 g | 23,64 € |

Doce veces el volumen, cinco veces el porte, y la cama es del mismo diametro.

## Que hacer con esto

1. **Antes de nada, mirar `variantStandard`.** Viene en el volcado de CJ como
   `long=300,width=200,height=30`, en milimetros. Si el lado mayor pasa de 550-600
   mm, el producto esta muerto y no hace falta ni medir el porte.
2. Entre dos versiones del mismo articulo, **elegir siempre la que viene
   comprimida**. El comprador ni se entera; el margen cambia diez euros.
3. La regla vieja —«el margen en euros sale mas o menos la mitad del PVP»— sigue
   valiendo para lo plano y pequeno. Para camas, con portes de 5 a 10 €, el
   margen sale entre el 48 % y el 65 % del neto.

## Lo que esto ha desbloqueado hoy

`cama perro` + `camas para perros` son **13.200 busquedas/mes**, con pico de
19.800 entre noviembre y enero. Es la palabra mas grande del nicho y llevabamos
meses sin poder servirla. Ya esta subida: cama en donut, cinco diametros de 40 a
80 cm, seis colores, de 22,90 a 44,90 €.
