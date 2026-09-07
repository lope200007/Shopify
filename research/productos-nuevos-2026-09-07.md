# Dos productos nuevos, y por que se quedaron fuera seis

Fecha: 2026-09-07. Guia: skill `seo-ecommerce` para las fichas.

## Como se eligieron

La busqueda por nombre en la API de CJ devuelve ruido (buscando "dog
raincoat" salian jerseis de mujer). Se fue por el **arbol de categorias**,
que es fiable, y se miraron las que llenan huecos del catalogo y encajan
con otono en Espana.

De cada candidato se comprobo, en este orden:

1. Ruta real **CN -> ES** con `freightCalculate`. Sin ruta, fuera.
2. Coste real: precio de mercancia por `vid` + porte, a 0,92 EUR/USD.
3. Margen contra el coste de captacion estimado (12,30 EUR).
4. **Mirar las fotos una por una** en hojas de contactos.
5. Que la ficha del proveedor de datos suficientes para describirlo sin
   inventar nada.

## Los dos que entran

| | Limpiapatas electrico | Lanzapelotas de muelle |
|---|---|---|
| PVP | 39,90 EUR | 49,90 EUR |
| Mercancia | 6,60 USD | 6,91 USD |
| Porte CN->ES | 9,96 EUR | 10,10 EUR |
| Coste | 16,04 EUR | 16,46 EUR |
| Margen | **16,94 EUR** | **24,78 EUR** |
| Coleccion | Higiene + Lluvia y barro | Juguetes |
| Imagenes | 4 | 5 |

Los dos superan el coste de captacion. El lanzapelotas lo dobla.

### El lanzapelotas NO es automatico

El proveedor lo titula "Automatic Tennis Ball Launcher". **Es falso.** Las
fotos ensenan un muelle y el texto de una de ellas dice "high-performance
spring design". No lleva pilas ni motor.

Copiar el titulo del proveedor habria sido vender algo que no es. La ficha
dice muelle, y ademas lo usa como argumento: no hay bateria que se
descargue a mitad de juego.

Las medidas (18 cm de diametro, 18,5 de alto, boca de 7 cm) salen de una
foto del proveedor, no de la API, que no traia ninguna.

## Los seis que se quedaron fuera, y por que

| Candidato | pid | Motivo |
|---|---|---|
| Puzzle IQ para perro | 2091789741312368642 | **Sin ruta a Espana** |
| Mordedor resistente con dispensador | 2091824835593289730 | **Sin ruta a Espana** |
| Manta polar doble cara | 2090343502818287617 | Ya hay manta; margen de 13 EUR, apenas cubre la captacion |
| Cojin-sofa para perro | 2093244110744354818 | Una sola foto limpia, y **la ficha se contradice**: unas fotos dicen "perlas de frio" y otras aislamiento termico |
| Comedero elevado de bambu | 2609050156381621600 | La ficha dice 35,9 x 13,9 cm y "para gatos"; una foto anuncia 6 alturas regulables. No cuadra |
| Cama tipo sofa con borde | 2608270816251620800 | **Sin medidas** de M/L/XL, y la ficha dice "limpiar con pano" mientras una foto anuncia funda desmontable |

El del mordedor duele: en la ficha del dinosaurio le decimos al cliente
"si tu perro destroza peluches, comprale un mordedor de caucho" **y no
vendemos ninguno**. Sigue siendo el hueco mas claro del catalogo.

## Dos prendas listas pero bloqueadas

Estas dos pasaron todas las pruebas menos una:

| Prenda | pid | PVP | Coste | Margen |
|---|---|---|---|---|
| Chubasquero impermeable de cuello alto (sin patas) | 2603230205131607000 | 39,90 | 10,64 (M) / 13,40 (XL) | 19-22 EUR |
| Abrigo acolchado integramente reflectante | 2601110729201604500 | 44,90 | 13,49 (M) / 15,08 (2XL) | 22-24 EUR |

Ruta a Espana verificada, margen bueno, fotos limpias comprobadas, y las
dos encajan con la temporada. Pero **el proveedor no publica tabla de
tallas** ni en la API ni en las imagenes, y no la vamos a inventar.

En ropa la talla es el producto. Sin tabla, la devolucion es casi segura, y
una devolucion a China se come el margen de dos ventas.

**Lo que las desbloquea:** pedir la tabla de medidas a CJ desde el panel
(Message / Product inquiry, citando el pid). Con las medidas de lomo por
talla, las dos fichas se suben en un rato.

## Comprobado

- `npm run cj:mapa` sobre los **105 SKU** activos: **0 sin mapeo**. Todo el
  catalogo, incluidos los dos nuevos, se puede servir.
- Las dos fichas devuelven 200, con titulo por debajo de 60 caracteres tal
  como lo ve Google, meta descripcion, `og:image` e imagenes.
- Las colecciones son inteligentes por etiqueta: el limpiapatas aparece
  solo en Higiene y en Lluvia y barro, y el lanzapelotas solo en Juguetes.
- Se quito la etiqueta `hogar` del lanzapelotas: lo colaba en "Casa, coche
  y paseo", donde no pinta nada.
