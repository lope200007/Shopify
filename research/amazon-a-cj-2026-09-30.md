# Lo más vendido de Amazon.es buscado en CJ — 30-09-2026

Pablo: «ya que tienes la lista de lo que más se vende en Amazon, búscalo en
nuestro proveedor y súbelo, si lo podemos vender un poco más barato o casi al
mismo precio y sacar buena ganancia».

**Resultado: no se sube ninguno.** Se midieron 21 productos de CJ que
corresponden a 10 éxitos de Amazon.es que no tenemos. Ninguno se puede vender
al precio de Amazon, o por debajo, dejando al menos 8 € de ganancia. El envío
de China a España (de 3,70 a 21,44 € por pieza) se come la diferencia.

## Método

1. **Listas.** Más vendidos y novedades de Amazon.es del 30-09: 24 listas, en `research/producto-ganador-2026-09-30.md`. De ahí salen los productos que no tenemos.
2. **Búsqueda en CJ por categoría.** `scripts/cj/barrido-amazon-3009.js` dio 258 candidatos, guardados en `research/cola-amazon-3009.json`. Se hizo una segunda búsqueda para pájaro colgante, mochila burbuja y transportín blando.
3. **Medida del envío a España y de la ganancia.** Con `scripts/cj/medir-candidatos.js`, en `research/medidos-amazon-3009.json`. A los prometedores se les midió además cada variante: la medida general usa la variante más cara y puede engañar.
4. **Ganancia.** `precio/1,21 − coste de CJ − envío de CJ − (1,75 % del precio + 0,25 €)`. No cuenta los 6,99 € de envío que paga el cliente: es el peor caso, el de un pedido de más de 39 € con envío gratis.

## Lo medido

| Éxito de Amazon (precio, opiniones) | Producto de CJ | Coste + envío | Ganancia al precio de Amazon |
|---|---|---:|---:|
| Cepillo de vapor para gato (10,89-14,99 €; 1.295-3.566) | Spray Hair Comb, 1.593 tiendas | 1,68 + 6,02 € (lleva batería) | 2,49 € a 12,90 € |
| Ídem | Cepillo de acero con vapor | 1,90 + 5,12 € | 3,16 € a 12,90 € |
| Ídem, 3 en 1 y recargable | dos modelos | — | Sin transporte a España |
| Alfombrilla rascadora adhesiva (8,49-11,56 €) | Pad adhesivo 30×30 | 0,64 + 3,70 € | 5,84 € a 12,90 € |
| Alfombrilla de sisal (10,79 €; 4.252) | Sisal mat, 484 tiendas | 1,83 + 13,66 € | −3,69 € a 14,90 € |
| Rascador de sisal de pared o vertical (21,99-22,60 €) | dos modelos | 5,5 + 9,9 €; 5,2 + 16 € | 0,47 € y −5,31 € a 19,90 € |
| Fuente de acero de 2,2 l (26,59 €; 19.086) | tres modelos | 11,9-16 € + 10,5-14 € | de −1,71 a −10,08 € |
| Mordedor de caucho tipo Kong (18,17 €; 86.955) | Natural Rubber Chew | — | Sin transporte a España |
| Correa larga de 5 m (11,99 €; 20.915) | Geometric leash 5 m | 2,89 + 5,95 € | 2,15 € a 13,90 € |
| Juguete colgante de puerta (Nepfaivy 20,89 €; 4.701) | Ratón de puerta | 7,32 + 6,96 € | −0,06 € a 17,90 € |
| Ídem | Cuerda de pared eléctrica | 3,53 + 7,45 € | 3,25 € a 17,90 € |
| Ídem | «Cat Yo-Yo» colgante eléctrico | 1,82 + 4,86 € | **9,17 € a 19,90 €**, pero se descarta (ver abajo) |
| Transportín blando plegable (morpilot 27,10 €; 32.765) | dos modelos | 6,56-13,58 € + 13,37-21,44 € | de −3,01 a −5,68 € |
| Mochila burbuja para gato (22,24-27,74 € las genéricas; 444 opiniones la de 27,74) | Mochila de cápsula, «hasta 6,5 kg» | 7,32 + 17,07 € | 7,64 € a 39,90 € |
| Ídem | Mochila con ventana en el techo | 4,04 + 17,07 € | 10,92 € a 39,90 € |

Coste y envío en euros (dólares de CJ × 0,92), leídos variante por variante.

## Por qué no se suben los dos que casi pasan

- **«Cat Yo-Yo»**:
  - no es el mismo producto que el pájaro de Nepfaivy, que es un muelle con plumas, así que no hay precio de Amazon con el que compararlo (regla «mismo tipo, mismo formato»);
  - sus fotos son imágenes hechas por ordenador, no fotos reales;
  - cuatro de sus siete fotos llevan texto en inglés.
- **Mochila burbuja**:
  - el mismo formato se vende en Amazon por 22,24-27,74 €, con envío gratis y en 1-2 días;
  - para ganar 8 € hay que pedir unos 40 €;
  - la de la ventana en el techo no publica medidas ni peso máximo, y para un transportín eso es imprescindible.

## La conclusión para Pablo

Copiar los más vendidos de Amazon no funciona con un proveedor en China:
- Esos productos ya se venden baratos en España, desde almacenes en España.
- Nosotros pagamos de 3,70 a 21,44 € de envío por pieza.

Donde sí podemos competir:
- **En lo que Amazon no vende junto.** Los packs, porque pagan un solo envío.
- **En lo que Amazon vende caro.** Por ejemplo, la hamaca de ventana nº 1 cuesta allí 34,99 € y la nuestra 24,90 €.
- **En lo que llama la atención en un anuncio y la gente no busca comparando.**

Lo mismo salió el 22-09: se midieron 13 y se subieron 3 (`tendencias-amazon-2026-09-22.md`).
