# Método de precios: que al cliente le parezca bien y a ti te deje dinero — 23-09-2026

Pablo preguntó: "¿Queda un método para que al cliente le parezca atractivo el
precio pero que me genere buena ganancia?".

## Lo que dicen los datos antes de hablar de método

Cruce de los 130 productos a la venta con los 870 más vendidos de Amazon.es
(bajados el 22-09-2026, 16 categorías de perro y gato). Solo cuenta la
comparación con **el mismo tipo de producto y formato**; lo que no se parecía
se descartó a mano.

**Primera conclusión:** en los productos pequeños que Amazon vende iguales, no
se puede competir por precio. Solo el envío desde China nos cuesta 4-5 €, y
Amazon los vende a 5-10 € con envío gratis.

| Grupo | Productos | Nuestro precio frente a Amazon |
|---|---|---|
| **Gancho** (igual o más barato que Amazon) | mochila de gato, chubasquero, barrera de malla del coche, botas, abrigo de invierno | 0,7× a 1,0× |
| **Se puede acercar** | hamaca de ventana, chapa de hueso, bebedero portátil, peluche con latido, lima eléctrica, correa manos libres | 1,1× a 1,5× |
| **Complemento** (no se puede igualar y dejar 8 € de margen) | toallitas de ojos (4,2×), cepillo de vapor (2,8×), bolso bandolera (2,5×), alas de murciélago, bolsa de premios, pelota automática, bozal, alfombrilla de lamer, collar AirTag, cinturón de coche, arneses con correa, funda de asiento trasero, guante | 1,6× a 4,2× |

Datos completos: `comparativa-amazon-curada.json` en el scratchpad de la sesión
(no se sube: son títulos de Amazon, no nuestros).

Ojo: Amazon da envío gratis y llega en uno o dos días. Nosotros cobramos 6,99 €
por debajo de 39 € y tardamos una o dos semanas. Estar "igual de precio" que
Amazon en un artículo suelto es estar 6,99 € más caro para el cliente.

## El método (cinco reglas)

1. **Cada producto tiene un papel.**
   - *Gancho*: igual o más barato que Amazon. Estos se anuncian en redes y son
     la puerta de entrada.
   - *Complemento*: los que Amazon vende más baratos. No se bajan: no llegarían
     a 8 € de margen. Tampoco se anuncian solos. Sirven para que el pedido pase
     de 39 € y salga el envío gratis.
   - *Pack*: la suma de varias piezas que nadie vende junta. No se puede
     comparar de un vistazo y paga un solo envío.
2. **El envío gratis a partir de 39 € es el descuento.** Vale 6,99 € y se gana
   con dos productos de 19,90 €. No se suma a otro descuento en porcentaje:
   Shopify mira los 39 € *después* del descuento (comprobado el 21-09-2026), así
   que un 10 % sobre 39,80 € deja el pedido en 35,82 € y vuelve a cobrar el
   envío.
3. **Precios en escalones que acaban en ,90, justo por debajo del número
   redondo**: 9,90 · 14,90 · 19,90 · 24,90 · 29,90 · 34,90 · 39,90. Nunca
   20,90 ni 25,90. Se lee "diecinueve y algo", no "veinte y algo". Es práctica
   estudiada (efecto del primer dígito); en esta tienda no está medido.
4. **Entre 32 y 39 €, mejor 39,90 € con envío gratis.** Un artículo de 32,90 €
   le cuesta al cliente 39,89 € con el envío. A 39,90 € paga lo mismo, tú ganas
   lo mismo y el cliente ve "envío gratis".
5. **Nada de precios tachados inventados.** La ley solo permite tachar un
   precio si ha sido el más bajo de los últimos 30 días. El ancla legal es otra:
   el pack al lado de la suma real de sus piezas, que el cliente puede
   comprobar.

## Lo que se aplicó hoy (17 variantes)

| Producto | Antes | Ahora | Margen vendido solo |
|---|---|---|---|
| Albornoz, talla XL | 25,90 | 24,90 | 13,18 → 12,37 |
| Alfombrilla atrapa-arena 60 × 90 (4 colores) | 25,90 | 24,90 | 16,58 → 15,77 |
| Jersey de punto, talla 14 | 20,90 | 19,90 | 16,63 → 15,82 |
| Comedero puzzle árbol de Navidad (2 colores) | 26,90 | 24,90 | 15,06 → 13,44 |
| **Mochila de gato (9 variantes)** | 34,90 + 6,99 de envío | **39,90 con envío gratis** | ~25 → ~23,5 |

Lo de la mochila: Amazon vende la equivalente a 36-43 €. Antes el cliente
pagaba 41,89 €; ahora paga 39,90 €, con "envío gratis", y la tienda sigue
ganando unos 23 € por mochila.

Comprobado dos veces: la tienda devuelve los precios nuevos, las fichas
publicadas también y un carrito de prueba con la mochila dice «Ya tienes el
envío gratis».

**Sin tocar a propósito:** el rascador redondo de 20,90 € y la barrera de 26,90 €.
Van dentro del pack del gato recién llegado y del pack cachorro. Los títulos,
textos y precios de referencia de esos packs dicen "Ahorras 8,80 €" y
"Ahorras 16,80 €", calculados con esos precios. Si se bajan, hay que rehacer
también esas dos fichas.

## Lo que queda para que decida Pablo

1. **Pasar a 39,90 € con envío gratis el resto de productos de 32,90-37,90 €.**
   - A 32,90 € (abrigo reflectante tallas grandes, cama dónut 60-70 cm): el
     cliente paga lo mismo y tú ganas lo mismo.
   - A 34,90 € (barrera de malla, cama cueva, cubremaletero, manta grande,
     parque, túnel): el cliente paga 1,99 € menos y tú ganas 1,61 € menos.
   - A 36,90-37,90 € (escalera, cama dónut grande, abrigo 3XL): el cliente paga
     4-5 € menos y tú ganas 3,2-4 € menos.
2. **Subir el chubasquero** de 19,90 € a 24,90 €. Amazon vende un chubasquero
   reflectante a 29,99 €. Ganarías unos 4 € más y seguirías más barato.
   Antes hay que comprobar con las fotos que es el mismo tipo de prenda.
3. **Aviso de complemento en la ficha**: "Añade esto y llega al envío gratis".
   Es trabajo de tema, sobre una copia (no se escribe en el tema publicado).
4. **Precio de referencia de los packs.** Hoy salen tachados con la suma de las
   piezas. Es verdad y se puede comprobar, pero un precio tachado se puede leer
   como "antes costaba". Conviene preguntarlo a la gestoría; mientras tanto, el
   texto del pack ya explica de dónde sale.
