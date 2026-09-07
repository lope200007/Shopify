# Auditoría visual del catálogo — 7 de septiembre de 2026

He mirado **las 171 imágenes** de los 35 productos publicados, una a una y a tamaño
legible (no en miniatura). Lo que sigue es lo que he visto, no lo que supongo.

Método: descarga de las 171 imágenes desde `products.json`, hojas de contacto de
6 columnas a 345 px por celda, y lectura de las 17 hojas. Después, contraste de
cada duda contra el volcado del proveedor en `proveedores/cj/*.json` y contra las
variantes reales de Shopify.

## Resumen

| Clase de defecto | Imágenes |
| --- | --- |
| Texto en inglés o chino incrustado en la foto | 43 |
| Gatos en producto de perro (además de las de arriba) | 3 |
| Color que no vendemos | 12 |
| Otro producto distinto dentro de la foto | 4 |
| **Total** | **~60 de 171 (35 %)** |

Aparte: unos **70 textos alternativos** describen algo que no es lo que se ve en
su imagen (el `alt` habla de un detalle de la hebilla y la foto es un perro entero).

## Lo grave: fichas que no dicen lo que el producto es

### 1. `dispensador-gravedad-pienso-agua` — RETIRADO A BORRADOR

La ficha afirma, en negrita: *«no es un comedero programable. No tiene
temporizador, ni reloj, ni motor»*.

Las cuatro fotos del producto enseñan **un dial graduado 0-4-8-12-16-20-24-28-32-36-40-44-48**.
Es un temporizador mecánico de hasta 48 horas que abre la tapa de cada
compartimento. Las medidas (24 × 14 × 7,5 cm y 28,5 × 24,5 × 7,5 cm) y las
variantes «sencillo / doble» encajan con eso y no con un depósito por gravedad:
7,5 cm de alto no sostienen un depósito de agua.

El proveedor se contradice a sí mismo: el título dice *«Automatic … Timer»* y la
descripción pegada debajo habla de gravedad. El título, las variantes, las
medidas y las fotos coinciden entre sí; la descripción es texto copiado de otro
producto.

**Hecho:** pasado a borrador. No se puede vender una página que afirma lo
contrario de lo que enseña su propia foto principal.
**Pendiente:** reescribirlo como lo que es — comedero de 1 o 2 raciones con
temporizador mecánico de 48 h, gris o rosa, sin electricidad.

### 2. `bozal-de-nailon-para-perro` — CORREGIDO

Dos errores, ya arreglados:

- Prometía «tres colores» y el cliente no puede elegir color: las variantes son
  solo tallas. Ahora la ficha dice que el color llega según existencias.
- Daba a entender que servía para cumplir la obligación legal de bozal en perros
  PPP, y tres párrafos más abajo el propio texto decía que para uso prolongado
  hace falta un bozal cesta. Un perro PPP lleva el bozal **todo el paseo**. Ahora
  la ficha tiene un apartado que dice explícitamente que este no es ese bozal y
  que no lo vendemos.

### 3. `guante-quitapelo-silicona` — PENDIENTE

Se llama «de silicona». El material declarado por el proveedor es `Cloth` y las
cinco fotos enseñan una **manopla de malla textil** de 16 × 24 cm, sin púas de
silicona por ningún lado. (La descripción del proveedor dice «silicone bristles»,
pero contradice a su propio campo de material y a sus propias fotos.)

Afecta también al `pack-aseo-en-casa`, que lista el componente como «guante
quitapelo de silicona».

### 4. `escalera-plegable-perro` — PENDIENTE

- Vendemos **verde pequeña, gris grande y verde grande**. No hay **ni una sola
  foto en verde**: dos de las tres variantes se compran a ciegas.
- Las seis fotos llevan la etiqueta de marca de otro vendedor, **«PetSibuyi»**,
  bien visible.

### 5. `cubremaletero-perro-coche` — PENDIENTE

El proveedor lo fabrica con **ribete naranja** o con **ribete blanco**. Nosotros
vendemos una sola variante, «Negro», y enseñamos las dos versiones en las fotos.
El cliente recibirá una de las dos al azar.

## Peores casos por producto (imágenes limpias que quedarían)

| Producto | Imágenes | Defectuosas | Limpias |
| --- | --- | --- | --- |
| `comedero-puzzle-tres-capas` | 6 | 5 | 1 |
| `parque-plegable-perro` | 6 | 5 | 1 |
| `boton-grabable-para-perros` | 5 | 4 | 1 |
| `cepillo-autolimpiable-pulverizador` | 5 | 4 | 1 |
| `manta-impermeable-para-sofa-y-cama` | 3 | 2 | 1 |
| `lima-electrica-unas-perro` | 6 | 4 | 2 |
| `comedero-lento-y-alfombrilla-de-lamer` | 5 | 3 | 2 |
| `chaleco-antiestres-para-perro` | 4 | 2 | 2 |
| `toalla-de-secado-rapido-para-perro` | 4 | 2 | 2 |

Borrar sin más deja estos productos por debajo de tres fotos. Hay que sacar
sustitutas limpias de los volcados del proveedor, como ya se hizo con la
alfombrilla.

## Variantes que se venden sin ninguna foto

lima blanca · cepillo rosa y negro · botella índigo, verde oscuro y blanco ·
arnés naranja · escalera verde (las dos tallas) · tentetieso verde ·
parque azul (la única foto en azul lleva un gato)

## Lo que había dado por malo y no lo era

Lo anoto porque me equivoqué al sospecharlo y conviene que quede escrito:

- **`funda-de-asiento-coche-para-perro`** (título real: «Colchoneta acolchada
  para el asiento del coche»). Sospeché que la ficha no correspondía al producto.
  El proveedor (`CJCM2991208`) confirma que es exactamente eso: una colchoneta
  antideslizante para el asiento trasero. La ficha está bien. Lo que está mal es
  un `alt` que se inventa unas «sujeciones a los reposacabezas» que el producto
  no tiene.
- **El «pulverizador» del cepillo autolimpiable** sí existe: el proveedor lo
  documenta como *Built-in Mist Humidifier*.
- **El «3 en 1» de la botella de paseo** sí es cierto: 300 ml de agua, 100 g de
  pienso y compartimento para bolsas.
- **La variante «Negro» del cepillo** sí la sirve el proveedor (`RK56 USB Black`).
- **Las fotos compuestas de los packs** son correctas: el comedero puzzle es de
  verdad morado y verde, y el tentetieso es de verdad turquesa.

## Fallo propio, ya corregido

La tercera foto del limpiapatas eléctrico era `82974b7b` («Pet automatic Foot
bath massager», en inglés, con fotos de almohadillas antes y después). La imagen
que yo había elegido era `cf516c2a`. Sustituida y recolocada en su posición.
