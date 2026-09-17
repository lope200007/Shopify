# Los cambios de ayer están puestos pero no se comunican

**17 de septiembre de 2026.** Comprobado sobre la web en vivo, no sobre la
configuración.

## El problema

Ayer se bajó el umbral de envío gratis de 55 € a 39 € y se creó el código
`BIENVENIDA10`. Las dos cosas funcionan a nivel de tienda: comprobado que un
carrito de 39,80 € ve «Envío gratis 0,00 €» y que el código deja 22,90 € en
20,61 €.

**Pero el cliente no se entera de ninguna de las dos.**

| Dónde | Qué dice hoy | Qué debería decir |
| --- | --- | --- |
| Portada · barra de confianza | «Envío gratis desde 55 €» | **39 €** |
| Portada · aviso bajo los botones | «Envío gratis a partir de 55 € · Entrega habitual de 10 a 20 días» | **39 €** |
| Portada · pregunta «¿Cuánto cuesta el envío?» | «gratis a partir de 55 € … solo servimos a España peninsular» | **39 €** y **peninsular y Baleares** |
| Descripción de la tienda (sale en Google) | «Envío gratis desde 55 €…» | **39 €** |
| Política de envío | «gratis a partir de 55 €» | **39 €** |

Y `BIENVENIDA10` **no aparece anunciado en ninguna parte**. El campo de correo
del pie de página dice solo «Correo electrónico», sin ningún motivo para
dejarlo.

## Por qué esto importa más de lo que parece

Un umbral que el cliente cree que está en 55 € **se comporta como si estuviera
en 55 €**. Ve un producto de 19,90 €, calcula que le faltan 35 € para el envío
gratis, decide que no merece la pena y paga los 6,99 €. O se va. El cambio de
ayer, mientras el texto diga 55 €, no existe.

Y un código de descuento que nadie conoce es exactamente el error del `Pet07`
otra vez: `Pet07` llevaba tres días activo con cero usos porque no estaba
anunciado. `BIENVENIDA10` va camino de lo mismo. **Eso es cosa mía: creé el
código y no le di sitio donde vivir.**

## Dónde se cambia cada cosa (todo de panel, nada de código)

Los tres textos de la portada son **campos del personalizador**, no código.
Leído el `sections/patitas-home.liquid`: son `aviso_envio`, el bloque
«Dato de confianza» y el bloque «Pregunta frecuente».

- **Tienda online → Temas → Personalizar → sección «Portada Patitascalidas»**
  - campo *Aviso bajo los botones*
  - bloque *Dato de confianza* (el primero) → *Título*
  - bloque *Pregunta frecuente* «¿Cuánto cuesta el envío?» → *Respuesta*
- **Tienda online → Preferencias** → descripción de la tienda
- **Ajustes → Políticas → Envío** → texto corregido en
  `research/textos/politica-envio.html`

## Lo que falta y no es un texto

**El carrito no avisa de cuánto falta para el envío gratis.** Comprobado: la
página del carrito no lleva ningún «te faltan X € para el envío gratis».

Eso es lo que convierte un umbral en un pedido más grande. Sin ese aviso, el
umbral solo premia a quien ya iba a comprar dos cosas; con él, empuja a quien
iba a comprar una. Es la pieza que más sube el pedido medio y la única de esta
lista que necesita tocar el tema (un aviso en la plantilla del carrito, o un
bloque de app que lo haga).

## Regla que sale de aquí

**Un cambio de configuración no está terminado hasta que el texto que lo
cuenta también ha cambiado.** Al tocar precios, envíos o descuentos hay que
repasar: portada, carrito, política, descripción de la tienda y redes.
