# Plan visual con Higgsfield

8 septiembre 2026. Prompts escritos y listos para lanzar.

## La regla que no se salta

**Higgsfield no toca ni una sola foto de producto.**

Un cliente que ve una imagen generada y recibe el objeto físico recibe otra
cosa. Eso es exactamente el engaño clásico del dropshipping, y es lo contrario
de lo que hemos construido: en esta misma tienda hemos quitado «envío desde
Europa», «barrera enrollable», el logotipo de un competidor y una garantía de
tres años que no existía.

| Dónde SÍ | Por qué |
| --- | --- |
| Portada (hero) | Es ambiente, no promete ningún producto |
| Banners de colección | Igual: una categoría, no un artículo |
| Portadas de blog | Ilustración editorial |
| Instagram | Contenido, no catálogo |
| Fondos y texturas | No representan nada vendible |

| Dónde NO | Por qué |
| --- | --- |
| Galería de producto | El cliente recibiría algo distinto |
| Cualquier imagen con nuestro producto reconocible | Aunque sea de ambiente, insinúa cómo es |

**Corolario:** en las imágenes de ambiente, el producto no aparece. Perro y
casa, no perro usando algo que parece lo nuestro pero no lo es.

## Dirección de arte

Primera versión, la que falló. Los prompts pedían *35mm film, subtle grain,
muted tones, late golden afternoon, deep calm, quiet, stillness, grey daylight*.
El modelo obedeció al pie de la letra y devolvió exactamente eso: brillo medio
de 87 a 124 sobre 255, saturación de 15 a 41, y en «camas y descanso» el verde
por encima del rojo (G 116 / R 110), o sea dominante verde medible. Perros
dormidos, encogidos y uno mojado con cara de pena. Bonito de mirar y malo de
vender: parecía una exposición melancólica, no una tienda.

**La lección:** un banner de tienda no es fotografía de autor. Pedir «calma» a
un modelo de imagen devuelve tristeza. Hay que pedir alegría de forma explícita.

Segunda versión, la que funciona:

- **Luz de mediodía abundante**, no de tarde. Brillo medio objetivo: 150-200.
- **Color vivo y saturado**, balance de blancos neutro. Nada de «muted».
- **Fotografía digital nítida y limpia**. Prohibido: *35mm film, grain, vintage*.
- **El perro está despierto y contento**: orejas arriba, boca abierta, cola
  levantada, mirando a cámara o en movimiento. Nunca durmiendo ni encogido.
- **Casa española de verdad**: gres, parquet, persiana, terraza. Y cuando se
  pueda, calle: fachada azul o de colores, cielo despejado.
- **Perros mestizos**, los que se ven aquí.
- **Paleta de la marca**: crema `#fbf7f1`, verde `#1f4a37`, terracota
  `#a94f1e`, tinta `#23261f`.
- **Sin texto dentro de la imagen.** Los modelos lo escriben mal y en inglés.
- **Sin producto reconocible.**

Negativos que hay que escribir siempre, porque el modelo tira solo hacia el
lado triste: `no film grain, no vintage look, no muted tones, no green colour
cast, no dark shadows`.

## El remate en local es gratis

`scripts/fotos/alegrar.py` hace lo que sobra pagar: equilibrio de blancos
tomado del 30 % más claro de la imagen (el gris de referencia está en la pared
y la luz, no en el suelo de terracota), subida de luz por gamma —que mantiene
el 255 en 255 y por tanto no quema la ventana— y viveza. Las tres banners que
ya funcionaban de composición (comederos, juguetes, gatos) se arreglaron así,
sin gastar un solo crédito: brillo 112→138, 123→144 y 122→144.

## Lo que cuesta

Preflight real con `get_cost`, sin gastar nada: **8 créditos por imagen** a 2k
con Recraft V4.1. La cuenta tiene **0 créditos** y plan gratuito, y no hay bolsa
de generaciones gratis (`unlim: false`).

| Lote | Imágenes | Créditos |
| --- | ---: | ---: |
| Portada | 1 | 8 |
| Banners de colección | 7 | 56 |
| **Primer lote** | **8** | **64** |
| Margen para repetir las que no salgan | ~2 | 16 |
| **Total realista** | | **~80** |

## Los prompts

Modelo `recraft_v4_1`, `model_type: standard`, `resolution: 2k`.

### Portada — 16:9

> Warm late-afternoon sunlight through a window in a real Spanish flat, terrazzo
> and light oak floor, a calm medium-sized mixed-breed dog lying on a woven rug,
> cream and sage-green interior, soft natural shadows, shallow depth of field,
> photographed on 35mm film, no products visible, no text

### Banners de colección — 4:3

Cuatro se regeneraron con la dirección de arte nueva (32 créditos). Las otras
tres se salvaron con `alegrar.py`, gratis, porque la composición ya era buena.

| Colección | Prompt | Origen |
| --- | --- | --- |
| Higiene y cuidado | *A happy small long-haired dog standing alert on a bright white bathroom floor, ears up, looking at camera cheerfully, brilliant clean daylight flooding through a large window, crisp white tiles, fresh folded cream towels, high-key airy lighting, vivid saturated colours, neutral white balance, clean modern commercial photography, fresh and joyful, sharp digital capture, no film grain, no vintage look, no green colour cast, no products visible, no text* | Regenerada |
| Lluvia y barro | *A cheerful mixed-breed dog with muddy paws standing alert in the bright entrance hall of a Spanish flat, ears up and tail raised, brilliant clear sunlight after the rain streaming through a wide open door, light terracotta floor tiles, white walls, vivid saturated colours, neutral white balance, clean crisp commercial photography, lively and energetic, sharp digital capture, no film grain, no vintage look, no grey muted tones, no clothing or products, no text* | Regenerada |
| Camas y descanso | *A relaxed happy dog stretching awake on a cream woven rug in a bright airy Spanish living room, eyes open and alert, abundant midday sunlight pouring through a large balcony window, white walls, light oak floor, warm cream and terracotta accents, vivid clean colours, neutral white balance, high-key bright commercial interior photography, sharp digital capture, no film grain, no vintage look, no green colour cast, no dog bed or products visible, no text* | Regenerada |
| Casa, coche y paseo | *An excited dog with ears up and mouth open happily looking out of the open boot of a car on a sunny Spanish street, brilliant midday sunshine, clear blue sky, vivid saturated colours, neutral white balance, clean crisp commercial photography, cheerful and energetic, bright sunlit façades blurred behind, sharp digital capture, no film grain, no vintage look, no dark shadows, no covers or products visible, no text* | Regenerada |
| Comederos y bebederos | Primera versión | Rescatada con `alegrar.py` |
| Juguetes | Primera versión | Rescatada con `alegrar.py` |
| También para gatos | Primera versión | Rescatada con `alegrar.py` |

### Lo que queda flojo

Con honestidad, para no repetir el error de dar por bueno lo mediocre:

- **Camas y descanso** es la más débil. El perro sale pequeño y la habitación
  está vacía. Se recortó a 4:3 desde abajo-derecha para acercarlo, pero pide
  una regeneración cuando haya créditos.
- **Comederos** el perro mira fuera de cuadro y la escena es estática.
- **También para gatos** conserva un punto de amarillo en el suelo.

Créditos restantes tras este lote: **2**. No dan para otra imagen (8 cada una).

### La portada (hero) queda descartada

La imagen de portada generada en el primer lote es el peor caso de todo el
conjunto: un perro con la cabeza apoyada en el suelo, mirada baja, y una
dominante verde-turquesa que `alegrar.py` no arregla —el equilibrio de
blancos toma la referencia de la ventana, que está quemada y sale neutra, y
por tanto no ve el verde de los medios tonos—. Subirle la luz la vuelve más
turquesa todavía.

No se sube a la tienda. El problema no es de color: es la pose. Un perro
deprimido en la portada no se corrige revelando, se corrige generando otra
vez. Cuesta 8 créditos y quedan 2.
