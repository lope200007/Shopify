# Cómo elegir un producto para patitascalidas — 16 de septiembre de 2026

Escrito después de medir 36 candidatos y ver caer al 80%. No es teoría: cada
regla viene de un número concreto.

## La regla que manda sobre todas: el peso

El porte a España desde China es casi una función del peso. Medido:

| Peso | Porte real | Qué se puede vender |
|---|---|---|
| < 100 g  | 3,15 €  | Casi cualquier precio funciona |
| 150-300 g | 4,2-5,0 € | Margen de 8-12 € a 19,90 € |
| 500 g    | 6,9-7,8 € | Hay que ir a 24,90-29,90 € |
| 850 g    | 9,65 €  | 29,90 € mínimo |
| 1,3 kg   | 13,1 €  | 39,90 € mínimo |
| 2,1 kg   | 18,85 € | Ya no sale a ningún precio razonable |
| 2,8 kg (arenero XL) | **101,47 €** | Imposible |

**Conclusión: por debajo de 300 g está el negocio.** Un producto de 2 kg no es
un mal producto, es un producto que no podemos servir.

## El detector barato: cuántas tiendas lo venden ya

CJ dice en `listedNum` cuántas tiendas lo tienen listado. Sirve para dos cosas
opuestas y las dos importan:

- **Muchas tiendas (300+)**: está probado que se vende y que se puede servir.
- **Muy pocas tiendas (< 10) en una categoría muy buscada**: señal de alarma.
  Si 8.100 personas al mes buscan "arenero para gato" y solo 6 tiendas lo
  venden por CJ, no es un hueco de mercado: es que **el porte lo hace
  imposible**. Se comprobó: 101,47 € de porte.

## Comprobar SIEMPRE que hay transporte a España

De 24 candidatos, **6 no tenían ninguna opción de envío a España**: CJ solo los
tiene en almacén de Estados Unidos o Reino Unido. Entre ellos el collar LED que
venden 839 tiendas. Si `/logistic/freightCalculate` devuelve vacío, fuera,
por muy bueno que parezca el producto.

## No basta el volumen de búsqueda: hay que bajar al detalle

"Arenero para gato" son 8.100 búsquedas al mes. Pero por dentro:

| Tipo | Búsquedas/mes | ¿Se puede? |
|---|---|---|
| Mueble de madera | 1.600 | No: mueble, porte imposible |
| Autolimpiable | 1.300 | No: aparato de 150-400 € |
| Grande / XL | 1.000 | Con matices |
| Cerrado | 720 | Con matices |
| Automático | 720 | No |

**El término general engaña.** Hay que mirar qué tipo concreto se busca y
comprobar si ese tipo se puede servir. Se hace con `research_keywords` en
modo `suggestions` sobre la palabra concreta, filtrando `intent: transactional`.

## Palabras que no se tocan

De las búsquedas más grandes del sector, tres están prohibidas para nosotros:

- `collar seresto perros` — 9.900/mes — marca ajena
- `collar antiparasitario perros` — 3.600/mes — producto sanitario
- `collar adiestramiento perros` — 2.900/mes — son los de descarga

## Medir con la variante MÁS PESADA

Si el margen aguanta en la variante más pesada, aguanta en todas. Medir con la
más ligera fue el error del 15 de septiembre: en la fuente de agua la variante
más ligera era el recambio de filtro, no la fuente.

Para productos con tallas, medir tres tramos (mínimo, medio, máximo) y poner
**precio escalonado**, no un precio único.

## El precio se contrasta con el mercado español, no se inventa

Subir el precio hasta que el margen cuadre es hacer trampa. El precio tiene que
ser defendible: la hamaca de radiador a 29,90 € vale porque Trixie la vende a
33 € y Nayeco a 40,76 €. Si no hay referencia española que lo sostenga, el
producto no entra.
