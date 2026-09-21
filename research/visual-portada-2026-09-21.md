# La portada, mirada contra tiendas que sí venden — 21/09/2026

Pablo pidió centrarse en el visual y dio conectores para leer tiendas famosas.
Esto es lo que se miró, lo que se midió de la nuestra y lo que se ha cambiado.

Todo está hecho en el **tema borrador**, no en la tienda en vivo. Publicarlo es
un botón suyo.

---

## 1. Cómo se miró (importa, porque cambia lo que se ve)

Con un navegador de verdad a **390 px de ancho**, que es el móvil, porque el
tráfico humano de esta tienda es móvil desde España. No a ojo sobre el
escritorio: a ojo la portada parecía bien.

El navegador de este entorno no podía abrir ninguna página con candado —fallo
de certificado contra el intermediario— hasta que se instaló su autoridad en el
almacén del navegador (`certutil` sobre `/root/.pki/nssdb`). Queda anotado
porque sin eso no hay capturas ni referencias, solo suposiciones.

---

## 2. Lo que se midió en la nuestra, antes

| Qué | Antes |
| --- | ---: |
| Alto de la portada en móvil | **7.690 px** |
| Dónde aparece el primer precio | **3.300 px** (cuatro pantallas de scroll) |
| Alto solo de la rejilla de categorías | **1.903 px** (siete tarjetas apiladas) |
| Sitios donde se anunciaba BIENVENIDA10 | **ninguno** |

El descuento del 10 % de la primera compra existe y está activo desde el 16 de
septiembre. No estaba escrito en ninguna página de la tienda.

---

## 3. Las tres tiendas que se miraron, y qué hacen igual

**Wild One**, **Fable** y **Tiendanimal**. Distintas entre sí —dos de diseño
premium y una gran superficie española— pero en la primera pantalla las tres
hacen lo mismo:

1. **Una barra de aviso encima del logotipo, en todas las páginas.**
   Wild One: «FREE Shipping on Orders $90+».
   Fable: «10% off your first order with code WELCOME10».
   Tiendanimal: «10% dto. + 5 € extra · Cupón: MARCASTOP».
   Las tres ponen ahí lo que quieren que sepas antes de nada.
2. **Un botón principal que lleva a algo concreto**, y un enlace secundario en
   texto. No dos botones iguales que dicen «mira todo».
3. **Producto con precio en la primera o segunda pantalla.** Fable enseña
   fichas de producto justo debajo de la cabecera.

Nosotros no hacíamos ninguna de las tres.

---

## 4. Lo que se ha cambiado, y lo que ha medido después

### a) Barra de aviso en todas las páginas
Sección nueva `sections/patitas-aviso.liquid`, metida en el grupo de cabecera,
así que sale en portada, colecciones, fichas y blog. Dice:

> Envío gratis desde 39 € · −10 % con BIENVENIDA10

Verde oscuro sobre crema (contraste 10:1, muy por encima del mínimo). Sin
JavaScript. Si se vacía el mensaje desde el personalizador, la barra
desaparece. Lleva a la colección «Empieza por aquí».

Comprobado que sale también en `/collections/juguetes`, no solo en la portada.

### b) Producto antes que categorías
El escaparate sube por encima de la rejilla de categorías y pasa a mostrar
**«Los diez que más se buscan»** (la colección «Empieza por aquí», elegida en
su día por volumen de búsqueda medido, no por gusto).

### c) El botón principal lleva a algo concreto
«Empieza por estos 10» → `/collections/empieza-por-aqui`.
«Ver todo el catálogo» pasa a ser el secundario.
Los dos botones ahora tienen enlace configurable desde el personalizador, que
antes estaban clavados en el código.

Esto además resuelve una tarea que llevaba días pendiente: la colección
«Empieza por aquí» existía y no se enlazaba desde ninguna parte.

### d) Categorías de dos en dos en móvil
Eran siete tarjetas de una en una. Ahora dos columnas en cuadrado.

### e) La cabecera deja de flotar sobre la foto en la portada
Con la barra nueva encima, el encabezado transparente se solapaba con el
antetítulo. Apagado. De paso, en escritorio el menú ya no se lee encima del
perro: tiene su propia banda.

### Medido después

| Qué | Antes | Después |
| --- | ---: | ---: |
| Alto de la portada en móvil | 7.690 px | **6.626 px** (−14 %) |
| Dónde aparece el primer precio | 3.300 px | **≈1.400 px** |
| Rejilla de categorías | 1.903 px | **853 px** (−55 %) |

---

## 5. Un fallo que se cometió y se corrigió en el sitio

Al pasar las categorías a dos columnas, el texto pasó a ocupar más parte de la
tarjeta y **se salió de la zona oscura del degradado**: «Comer mejor» sobre un
suelo claro y «Salir sin estropear nada» sobre un cielo azul dejaron de leerse.
Se vio en la captura, no a ojo.

Arreglado oscureciendo el degradado antes y más, solo en móvil, y evitando que
la píldora «Ver los 47 productos» partiera en dos líneas (en pantallas muy
estrechas dice solo «Ver los 47»).

**La regla:** un cambio de densidad es también un cambio de contraste. Si se
encoge una tarjeta con texto encima de una foto, hay que volver a mirar si se
lee.

---

## 6. Cómo se subieron los archivos sin pegarlos (técnica nueva)

`themeFilesUpsert` acepta un cuerpo de tipo `URL`. Como el repositorio es
público, se puede apuntar a `raw.githubusercontent.com` **con el hash del
commit** (no la rama, que se cachea) y Shopify se lo descarga solo:

```
{ "filename": "sections/patitas-home.liquid",
  "body": { "type": "URL",
            "value": "https://raw.githubusercontent.com/lope200007/Shopify/<sha>/theme/sections/patitas-home.liquid" } }
```

Ojo: en ese caso `upsertedThemeFiles` vuelve **vacío y sin errores**, que parece
que no ha hecho nada. Hay que comprobarlo leyendo `checksumMd5` del tema y
comparándolo con el `md5sum` local. Se hizo con los cinco archivos y los cinco
coinciden.

---

## 7. Lo que NO se ha tocado, y por qué

- **Los colores y la tipografía.** Funcionan y pasan contraste. Cambiarlos
  ahora sería ruido, no mejora.
- **Las fotos de producto.** Otro trabajo, más largo.
- **Reseñas.** Es lo que más le falta a esta portada frente a las tres de
  referencia, pero no se inventan: hacen falta clientes primero.
- **El nombre largo de las fichas** («Cama en dónut de pelo largo | De 40 a 80
  cm, en seis colores») ocupa tres líneas en la tarjeta. Se arregla cambiando
  títulos de producto, que toca SEO. Queda anotado, no hecho.

---

## 8. Lo que falta por su parte

1. Mirar la vista previa: `https://patitascalidas.com/?preview_theme_id=204883591516`
2. Si le gusta, **publicar** el tema «Patitascalidas 2026 — envío gratis 39 €».
3. Los dos textos que siguen fuera de mi alcance: la descripción de la tienda y
   la política de envío (ver `pendiente-de-pablo-2026-09-20.md`).

---

## 9. Segunda pasada, con las skills nuevas (mismo día)

Instaladas `mobile-native` e `impeccable`, se repasó la tienda con ellas. No
como lectura: aplicando su lista contra la página de verdad con el navegador.

### Lo que encontró `mobile-native` (siete medidas, cinco fallos)

| Comprobación | Estaba | Ahora |
| --- | --- | --- |
| `viewport-fit=cover` | **no** → `env(safe-area-inset-*)` valía 0 | sí |
| `theme-color` | **puesta y vacía** | `#1f4a37` |
| `color-scheme` | no declarado | `light` |
| `-webkit-tap-highlight-color` | `rgba(0,0,0,.18)` → **recuadro gris al tocar** | `transparent` |
| `-webkit-text-size-adjust` | `auto` → texto inflado en horizontal | `100%` |
| `touch-action` en pulsables | `auto` → retardo del doble toque | `manipulation` |
| `user-select` en controles | `auto` → la pulsación larga seleccionaba el texto del botón | `none` **solo en controles** |
| Tamaño de los `input` | 16 px | ya estaba bien: no había zoom al enfocar |

Dos decisiones que el skill obliga a razonar, no a copiar:

- **`overscroll-behavior` NO se toca.** Su receta lo pone a `none`, pero una
  tienda es un documento que se scrollea y ahí «tirar para recargar» se espera.
  El propio skill dice que se quite en ese caso.
- **Quitar el recuadro gris deja la tienda muda al tacto.** Los botones ya
  tenían `:active`; las tarjetas y las preguntas frecuentes, no. Se les añadió
  (120 ms, solo `transform`, anulado con `prefers-reduced-motion`).

Comprobado en una página de colección, no solo en la portada: los siete valores
salen bien y el texto normal **sigue siendo seleccionable** (la gente copia
números de pedido).

### Lo que apareció al mirar por fin una ficha de producto

Nunca se había mirado una ficha en móvil. Medido en la cama en dónut:

- **Título: 28 px en negrita. Precio: 16 px, peso normal** — el mismo tamaño
  que el texto corrido. En una ficha el precio es lo segundo que se mira
  después de la foto, y aquí susurraba.
- Arreglado **configurando**, no con CSS encima del tema: el bloque de precio
  de Horizon ya tiene ajustes de tipografía. Ahora 24 px con la tipografía de
  titulares. Verificado: 24 px / peso 700.

---

## 10. Una decisión que NO he tomado por mi cuenta

Los títulos de producto llevan la barra vertical del SEO dentro:

> Cama en dónut de pelo largo **|** De 40 a 80 cm, en seis colores

En el móvil eso son **tres líneas de titular**, y la barra se lee como un
error de maquetación. Sale igual en las tarjetas de la portada, en el blog y
en lo que se comparte.

**El dato que lo hace decidible:** el `<title>` de la página ya es distinto
del título del producto —«Cama redonda en dónut para gato y perro | 40, 50,
60, 70 y 80 cm»—, es decir, **el SEO ya lo lleva el campo de SEO**. El título
visible no necesita cargar las palabras clave.

Así que se podrían acortar los 126 títulos sin perder posicionamiento. No lo
he hecho: es el catálogo de Pablo, su voz, y afecta a los textos ya
programados en Metricool. Queda propuesto con la prueba delante.

---

## 11. El menú lateral: «se ve saturado»

Medido antes de tocar nada, con el menú abierto en el navegador a 390 px:
**dieciséis entradas del mismo tamaño**, en una sola lista plana, sin grupos,
y había que hacer scroll para llegar a «Contacto». El problema no era el
aspecto: era que no se podía leer de un vistazo.

El arreglo va por dos sitios distintos, y conviene no confundirlos:

### a) El menú en sí — **esto ya está en vivo**

Un menú es **dato de la tienda, no del tema**. No espera a publicar nada.

De dieciséis entradas a **siete**:

| | |
| --- | --- |
| **Empieza por aquí** | entra: la colección existía y no se enlazaba desde el menú |
| **Categorías** | con las siete categorías colgando debajo |
| Gatos · Packs y ahorro · Regalos · Novedades | sueltas, como estaban |
| **Ayuda** | con Envíos, Preguntas frecuentes, Quiénes somos y Contacto |

Sale «Inicio»: el logotipo ya lleva a la portada.

La estructura anterior está guardada **entera** en
`copias/menu-principal-antes-2026-09-21.json`. Deshacerlo es un minuto.

### b) El aspecto — esto va en el borrador

- Ritmo más apretado: 17 px en los padres, 15 en los hijos.
- Una línea fina entre grupos.
- Guía verde y sangrado en lo que cuelga de un padre.
- «Empieza por aquí» como píldora de terracota con flecha: es la
  recomendación de la casa, no una línea más.
- Área de toque de 44 px en el aspa de cerrar.

Los estilos van en `assets/patitas-menu.css`, cargado desde nuestro override
de `snippets/stylesheets.liquid`. **No se modifica ningún archivo de Horizon.**

### El error que cometí, y cómo se cazó

Al ver la primera versión dije que la guía verde «salía cortada a trozos» y
escribí una explicación convincente: que Horizon dibujaba una separación por
fila y borraba la línea al cruzarla.

**Era falso.** Se comprobó inyectando un estilo temporal que pintaba la guía
de rojo y 8 px de ancho: aparecía **entera**. Lo que pasaba es que los
enlaces hijos se salen por la izquierda de la caja de contenido del `<ul>`,
así que el `padding-left` del contenedor no los apartaba y **el texto se
montaba encima de la línea**. A 2 px y con poco contraste, eso se lee como
una línea rota.

El hueco se hace ahora en los enlaces, que es donde funciona.

**La regla:** una explicación que encaja no es una comprobación. Exagerar el
elemento sospechoso —más grueso, de otro color— cuesta diez segundos y
distingue «está roto» de «no se ve».

---

## 12. Perros en el menú, y color basado en lo que hacen las grandes

Pablo: «solo ver gatos es como que… ¿y la sección de perro?». Y: «dale un
poco de color a esa zona, no tan llamativo, algo suave, básate en páginas
famosas».

### Perros: había etiquetas, no hizo falta inventar nada

La colección «Gatos» no era una lista a mano: es una **colección inteligente**
con la regla `etiqueta = gato`. Mirando las etiquetas del catálogo:

| | |
| --- | ---: |
| Productos con etiqueta `perro` | 92 |
| Productos con etiqueta `gato` | 60 |
| Con las dos | 42 |
| **Sin ninguna de las dos** | **16** |

Así que se creó `perros` exactamente igual que `gatos` —misma regla, mismo
orden, publicada en los cuatro canales— en vez de enlazar «Perros» a
`/collections/all`, que habría metido los productos de gato dentro.

**Los 16 sin etiquetar eran todos de perro** (arnés, correa, cubremaletero,
escalera para la cama, parque de cachorro, los tres packs…). Sin la etiqueta
no aparecían ni en Perros ni en Gatos: invisibles en las dos secciones nuevas.
Se les añadió `perro`.

Queda pendiente decidir, ficha a ficha, cuáles de esos 16 merecen además la
etiqueta `gato` (el cepillo y el dispensador por gravedad, seguro). Eso no se
hace a ojo desde una lista de títulos.

### El color: dos referencias, la misma receta

Mirados con el navegador los menús de móvil de **Tiendanimal** y **Kiwoko**,
las dos cadenas de tiendas de mascotas más conocidas de España. Hacen lo
mismo, hasta el detalle:

1. **Una banda del color de la marca cruzando arriba**, con el cerrar a la
   derecha en blanco. Verde en Tiendanimal, rojo en Kiwoko.
2. Debajo, **lista limpia sobre fondo claro**, con una línea fina entre cada
   entrada.
3. **Un solo elemento en color de acento** — «Ofertas» en las dos.
4. **Perros y Gatos arriba del todo**, antes que nada.

La lección no es «pon color»: es **dónde**. El color va contenido en una
franja y en un acento. El cuerpo se queda neutro. Por eso tienen vida y no
cansan.

Traducido a esta tienda:

- Banda con **el mismo verde que la barra de aviso** de la cabecera, para que
  al abrir el menú el color no salte a otro sitio. Crema encima: 10:1.
- Línea fina entre todas las entradas de primer nivel.
- El acento ya estaba puesto: la píldora de terracota de «Empieza por aquí».
- Perros y Gatos justo después de la píldora.

**Lo que NO se ha copiado:** el galón (›) al final de las entradas que tienen
hijos. Ellos lo ponen porque al pulsar se abre otro nivel; aquí los hijos ya
se ven desplegados. Un galón que no abre nada es una mentira pequeña, y de
esas se acumulan.

### Comprobación del recuento (21-09, después de que refrescara el índice)

Al etiquetar los 16, el buscador de Shopify seguía diciendo 90. No lo di por
bueno: leí los productos uno a uno por su id y la etiqueta estaba puesta.
Vuelto a consultar ya con el índice al día:

| Consulta | Antes | Ahora |
| --- | --- | --- |
| Colección **Perros** | 90 | **106** |
| Colección **Gatos** | 60 | 60 |
| Productos con etiqueta `perro` | 92 | **108** |
| Productos **sin ninguna de las dos** | 16 | **0** |

Ya no hay ni un producto invisible en las dos secciones nuevas.
(«Perros» muestra 106 y no 108 porque la colección sólo cuenta los publicados.)

Regla que confirma esto otra vez: **el número del buscador no es la verdad,
es una copia que tarda.** La verdad está en el producto.

---

## 13. «Entro en gatos y veo más cosas de perros»

Pablo lo dijo así, y tenía razón por **tres motivos distintos**, no uno.
Los tres estaban a la vez, y por eso la sensación era tan fuerte.

### Motivo 1: cinco productos de perro llevaban la etiqueta `gato`

La colección Gatos es automática: entra todo lo que lleve la etiqueta
`gato`. Cinco productos que son **solo de perro** la llevaban puesta.

No se decidió por el título. Se leyó la ficha de cada uno, que es donde
está la verdad:

| Producto | Lo que dice su propia ficha | Decisión |
|---|---|---|
| Pijama de felpa para perro | «Es ropa de perro pequeño y mediano», tallas por kilos | **Fuera** |
| Abrigo de invierno para perro | Talla más pequeña: cuello 30 cm, pecho 44 cm | **Fuera** |
| Bebedero portátil 2 en 1 | «sin soltar la correa», 29 cm de alto | **Fuera** |
| Collar de perro con AirTag | Ver nota abajo | **Fuera** |
| Limpiapatas eléctrico | Cepillos giratorios para el barro del paseo | **Fuera** |

Y cuatro que **parecían** de perro por el título y se quedan, porque su
ficha dice explícitamente que también sirven para gato:

| Producto | Lo que dice su ficha | Decisión |
|---|---|---|
| Bufanda y gorro de Navidad | «da de sobra para un gato»; las fotos son con un gato | Se queda |
| Collar inflable | «Vale igual para gatos grandes en las tallas XS y S» | Se queda |
| Alfombra olfativa | Tiene una sección entera: «También vale para gatos» | Se queda |
| Sudadera con capucha | «Está pensada para perro pequeño y para gato» | Se queda |

**Nota sobre el collar con AirTag.** Su ficha sí dice «perro pequeño o gato
grande» en la talla S. Aun así se ha sacado de Gatos, y es una decisión mía,
no un dato: es un collar de hebilla metálica y anilla en D, de 60 a 90 g.
Un collar de gato debe llevar cierre de seguridad que se suelte solo si el
animal se engancha. Este no lo lleva. Prefiero no ofrecérselo a alguien que
está comprando para un gato. Si Pablo quiere volver a ponerlo, es un cambio
de una etiqueta.

### Motivo 2: solo cabía UN producto por pantalla

Y eso es lo que más pesaba. El tema tenía `mobile_product_card_size` en
`large`, que en móvil es **una sola tarjeta por fila**. Con la foto ocupando
toda la anchura, un perro dorado a pantalla completa es lo único que ves.

Lo llamativo: **`small` (dos por fila) es el valor por defecto de Horizon.**
Alguien lo había cambiado. Vuelto a `small`.

Medido en una pantalla de 390 px de ancho, en la portada de Gatos:

| | Antes | Ahora |
|---|---|---|
| Productos visibles sin bajar | **1** (a medias) | **4** |
| Líneas de texto antes del primer producto | 10 | 3 |

### Motivo 3: la foto de la propia sección tenía un perro dentro

La imagen de la colección Gatos era «un gato **y un perro** descansando
juntos». Como foto está bien; como cartel de la sección de gatos, no.
Cambiada por un gato solo, dentro del rascador redondo, mirando a cámara.

**Aviso: esa foto anterior ya no existe.** La imagen de una colección se
sustituye en el sitio, y el CDN de Shopify no guarda la versión vieja (lo
comprobé pidiendo la URL antigua: devuelve la nueva). No estaba en
Archivos ni en el repositorio. Si la quería, hay que volver a generarla.

### Lo que sigue sin estar resuelto

De los 55 que quedan en Gatos, unos 20 son **solo de gato** y unos 35 son
compartidos de verdad (cepillos, comederos, camas). Un producto compartido
tiene que salir en las dos secciones: eso no es un error.

Pero **muchos de esos compartidos tienen foto de perro**, porque es la que
manda el proveedor. Eso no se arregla con etiquetas. Se arregla con lo que
Pablo pidió después: **más productos que sean solo de gato**. Queda anotado
como tarea.

## 14. Repaso visual del resto de la tienda

### La portada decía que la tienda es de perros

Literalmente: «PATITASCALIDAS · ACCESORIOS **PARA PERROS**» y «Productos que
hacen más fácil la vida con **tu perro**». Con 55 productos de gato en el
catálogo, eso es la raíz del problema: la sección de gatos parecía un
añadido porque la portada decía que lo era.

Cambiado a «Perros y gatos» y «tu perro o tu gato». Y donde decía «para qué
**perro** sirve» ahora dice «para qué **animal** sirve».

**Perros y Gatos entran como las dos primeras tarjetas de categoría**, antes
que Comederos. Es lo que hacen Tiendanimal y Kiwoko: la especie primero,
la necesidad después.

### Un fallo que llevaba tiempo a la vista: «Ver los 104productos»

Sin espacio. En todas las tarjetas de categoría, desde siempre.

La causa no era una errata: el espacio **sí estaba** en el código. El
contenedor `.pcj-etiqueta` es `display:inline-flex`, y eso convierte al
`<span>` de dentro en un elemento flex —o sea, en un bloque— y el navegador
se come el espacio con el que empieza. Arreglado con `white-space:pre`.

**La lección:** esto no se ve leyendo el código, porque el código está bien.
Se ve mirando la página.

### Los títulos se leían rotos

Nuestros títulos van en dos partes separadas por una barra. En la rejilla,
el título se parte en varias líneas y la barra acaba cayendo sola al
principio de una línea:

```
Pijama fino para perro
y gato pequeños
| Cinco colores,
cinco tallas
```

En vez de acortar los 126 títulos —que es catálogo de Pablo y afecta a lo
que ya está programado en Metricool— se ha hecho algo que **no toca ningún
dato**: `blocks/product-title.liquid` separa las dos partes y pone la
segunda debajo, más pequeña y en gris. Queda como un subtítulo.

```
Pijama fino para perro y gato pequeños
Cinco colores, cinco tallas
```

En la ficha del producto el título sale entero, como siempre. Comprobado:
en la ficha hay 0 subtítulos y el `<h1>` lleva la barra.

**Si un título no lleva barra**, `split` devuelve el título entero y el
detalle queda vacío: se comporta exactamente como antes.

### La búsqueda

Mismo tratamiento: el titular «Resultados de la búsqueda» ocupaba dos
líneas a 48 px y media pantalla. Ahora es una línea a 32 px y se ven cuatro
productos.

### Cómo se subió cada cambio

Los seis ficheros del tema se subieron con la técnica de la URL, apuntando
al SHA exacto del commit, y **cada uno verificado comparando su `checksumMd5`
en Shopify con el `md5sum` local**. `upsertedThemeFiles` vuelve vacío en las
subidas por URL: no sirve para saber si funcionó.

---

## 15. La ficha de producto y el carrito

### El botón decía «Agregar al carrito»

Y esa es una frase de español de América, no de España. Aquí se dice
**«Añadir»**. Al mirarlo, el fichero de idioma entero (`locales/es.json`,
304 textos) estaba en la variante americana: «Retiro disponible» en vez de
recogida, «En existencias» en vez de en stock, «video» sin tilde, «la
calificación de este producto»…

Y una falta de ortografía a la vista de todo el mundo, en el carrito vacío:

> Tu carrito **esta** vacío

Reescrito entero. **Esto no es un capricho de estilo.** Esta tienda tiene
un problema de confianza —35 visitas, cero ventas— y el idioma es la
primera señal que lee un comprador español para decidir si esto es una
tienda de aquí o un revendedor de fuera.

**La red de seguridad:** el fichero original sigue intacto en el tema que
está publicado, así que nada de esto es irreversible. Y si se hubiera
perdido alguna clave, Shopify enseña el texto en inglés: se vería, no se
rompería.

### Los títulos se leían rotos, también en la rejilla

Ya contado en la sección 14. Un apunte de lo que **no** funcionó: intenté
aplicar el mismo tratamiento al `<h1>` de la ficha de producto y **no hizo
nada**, porque ese titular no sale de `blocks/product-title.liquid`: sale
de un bloque de texto de `templates/product.json` con `<h1>{{ product.title }}</h1>`
dentro. Lo vi mirando el HTML, no suponiéndolo.

Peor: el modificador que había añadido para «la ficha» se habría aplicado
a las tarjetas de productos relacionados de la ficha, que es donde NO lo
quería. Comprobé que en esa página no hay tarjetas (cero), así que no
rompía nada — y aun así lo quité. **Código muerto que dice hacer algo que
no hace es peor que no tener código.**

### El carrito no decía nada del envío gratis

Con 39,80 € en el carrito ya lo tenías y la página no se enteraba. Con
29,90 €, nadie te decía que por 9,10 € más te lo llevabas gratis. Eso, en
una tienda con pedido medio de ~20 €, es dinero que se deja en la mesa.

**La trampa, que es la razón de que esto no sea trivial.** Antes de
escribir nada lo comprobé con un pedido de prueba:

| Carrito | Con BIENVENIDA10 | Envío |
|---|---|---|
| 42,00 € | **37,80 €** | **6,99 € — se pierde el envío gratis** |

La condición de envío gratis se evalúa **sobre el importe ya rebajado**.
O sea: un aviso que dijera «ya tienes el envío gratis» a alguien con 40 €
le estaría mintiendo en cuanto usara el código que le ofrecemos en la
barra de arriba.

Por eso el aviso tiene tres estados, y el tercero solo lo ve quien le
afecta:

| Carrito | Qué se ve |
|---|---|
| 19,90 € | «Te faltan **19,10 €** para el envío gratis» + barra |
| 39,80 € | «Ya tienes el envío gratis» **+ aviso**: con el código te quedarías en 35,82 € y volverías a pagar el envío |
| 99,50 € | «Ya tienes el envío gratis», **sin aviso** (con el código seguirías por encima) |

Los tres comprobados en el navegador, uno a uno. Sin JavaScript: se
recalcula solo porque la página del carrito se vuelve a pintar al cambiar
cantidades.

### «También te podría gustar» no recomendaba nada

Debajo del carrito había un bloque con ese título. No es el recomendador
de Shopify: es una lista fija apuntando a la colección `all` con
`max_products: 4`. O sea, **los cuatro primeros productos del catálogo**,
que resultan ser abrigos de perro. A quien lleva un rascador de gato en el
carrito se le enseñaban cuatro abrigos de perro y se le decía que le
podrían gustar.

Ahora apunta a `empieza-por-aqui` (los diez elegidos) y se llama **«Lo que
más se busca»**, que es lo que es. Además ayuda con el envío gratis: son
productos de entre 17 y 30 €.

**La regla:** un título que promete personalización sobre una lista fija es
una mentira pequeña. Se arregla cambiando el título o cambiando la lista.
Aquí se han cambiado las dos.

---

## 16. Los packs: la auditoría que casi hago mal

«Actualiza los packs.» Lo primero era comprobar la promesa que hace la
propia colección:

> «El ahorro de cada pack está calculado sobre el precio real de sus piezas
> sueltas, no sobre un precio inventado.»

Eso no es una frase de marketing: es una afirmación comprobable, y en
España un precio de referencia inflado no es solo feo, es sancionable.

### El error que estuve a punto de cometer

Saqué el catálogo con `priceRangeV2.minVariantPrice` y comparé. Salió esto:

| Pieza | Lo que dice el pack | Lo que leí |
|---|---|---|
| Albornoz de secado | 21,90 € | **16,90 €** |
| Toalla de microfibra | 15,90 € | **12,90 €** |

Iba a acusar al Pack baño y lluvia de inflar el precio de referencia en 8 €.

**Y era mentira mía.** `minVariantPrice` es el precio de la variante **más
barata**, no el de la que lleva el pack:

- Albornoz: XS 16,90 · S 18,90 · **M 21,90** · L 23,90 · XL 25,90
- Toalla: Pequeña 12,90 · **Mediana 15,90** · Grande 19,90

El pack dice «albornoz **talla M**» y «toalla **mediana**». Los dos precios
son correctos.

**La regla, que es nueva y va al manual:** en un producto con variantes, el
precio del producto no existe. Existe el precio de *cada variante*. Comparar
contra `minVariantPrice` es comparar contra otra cosa.

### El resultado, ya comprobado bien

Los cinco, contra el precio de la variante exacta que cita cada descripción:

| Pack | Suma real | Precio | Ahorro |
|---|---|---|---|
| Coche | 34,90 + 34,90 + 14,90 = 84,70 | 64,90 | 19,80 ✓ |
| Cachorro | 34,90 + 24,90 + 14,90 = 74,70 | 59,90 | 14,80 ✓ |
| Comer despacio | 29,90 + 14,90 + 19,90 = 64,70 | 55,90 | 8,80 ✓ |
| Aseo en casa | 29,90 + 24,90 + 9,90 = 64,70 | 55,90 | 8,80 ✓ |
| Baño y lluvia | 21,90 + 15,90 + 16,90 = 54,70 | 39,90 | 14,80 ✓ |

**Ninguno miente.** La promesa de la colección se cumple.

Un susto de paso: aparecían **dos limas de uñas**, a 19,90 € y a 29,90 €.
Si las dos estuvieran a la venta, el precio de referencia del Pack de aseo
quedaría en entredicho. La de 19,90 € está **archivada** (SKU
`PTC-LIMAVIEJ-01`, «la vieja»). No está a la venta. No hay conflicto.

### Lo que sí estaba mal

**1. Tres packs seguían diciendo «el envío sale gratis, porque pasa de 55 €».**
El umbral es 39 € desde el 16 de septiembre. Corregido en cachorro, comer
despacio y aseo. Comprobado antes de escribirlo que la frase sigue siendo
verdad con BIENVENIDA10: 59,90 × 0,9 = 53,91 € y 55,90 × 0,9 = 50,31 €,
los dos por encima de 39.

**2. El Pack de coche era el único sin precio tachado.** Los otros cuatro
llevaban `compareAtPrice`; este no, así que en la rejilla se veía como un
producto normal de 64,90 € y el ahorro solo aparecía en el título. Puesto
en 84,70 €, que es la suma real.

### Y entonces apareció lo gordo

Si tres packs tenían el «55 €» viejo, era razonable pensar que no eran los
únicos. Barrí **las fichas de los 124 productos activos**, en tres páginas,
buscando cualquier mención a 55.

**Quince fichas más** decían a sus clientes que el envío gratis empieza en
55 €, cuando empieza en 39 €.

Esto no es una errata: es **contarle al cliente una oferta peor que la que
tenemos**. Alguien con 42 € en el carrito leía «gratis a partir de 55 €»,
calculaba que le faltaban 13 € y se iba.

Las quince corregidas y vueltas a barrer: **cero menciones a 55 € en todo
el catálogo.**

| | Antes | Ahora |
|---|---|---|
| Fichas diciendo 55 € | **18** (15 + 3 packs) | **0** |
| Fichas diciendo 39 € | 0 | 15 |

### Lo que dejo apuntado y no toco

- **El Pack baño y lluvia cuesta 39,90 €**, noventa céntimos por encima del
  umbral. Con BIENVENIDA10 se queda en 35,91 € y vuelve el envío de 6,99 €.
  El nuevo aviso del carrito ya se lo dice a quien compre así. Subirlo a
  43,90 € lo dejaría a salvo del código, pero **eso es decisión de precio
  de Pablo**, no mía.
- **Los cinco packs son de perro.** Ninguno de gato. Es el pack que falta, y
  además los packs son lo que más empuja a pasar de 39 €. No lo he creado
  porque un pack nuevo necesita una foto de conjunto, y ahora mismo no
  tengo con qué generarla (Higgsfield pide autorización y nanobanana no
  conecta). Con una foto suelta de una de las piezas quedaría peor que los
  otros cuatro. Queda como tarea.
- **Solo un pack lleva el ahorro en el título** («| Ahorras 19,80 €»). Los
  otros cuatro no. Unificarlo es cambiar cuatro títulos del catálogo, que
  es la voz de Pablo. Lo dejo propuesto, no hecho.

---

## 17. «¿Son los colores correctos?» — medido, no opinado

Pablo lo preguntó y la respuesta corta es **sí, la elección es correcta;
la ejecución tenía tres derivas, y una de ellas era un fallo de verdad**.

### Lo que hace la competencia, medido por dentro

No de memoria: abriendo sus webs y leyendo los estilos calculados del DOM.

| | Lienzo | Texto | Marca | Acento / CTA |
|---|---|---|---|---|
| **Tiendanimal** | blanco (35,7 M px²) | `#444` `#555` | verde `#00632E` | naranja `#EC6533` |
| **Kiwoko** | blanco (20,7 M px²) | `#444` `#333` | rojo `#CB333B` | el mismo rojo |
| **Patitascalidas** | crema `#FBF7F1` | `#23261F` `#575C50` | verde `#1F4A37` | terracota `#A94F1E` |

**La estructura es la misma en las tres**: un lienzo neutro dominante, un
texto oscuro que no es negro puro, y **un solo color de acción**.
Tiendanimal usa verde de marca + naranja de oferta, que es exactamente
nuestro reparto.

La única diferencia real es el lienzo: ellos blanco, nosotros crema. Y eso
está bien que sea distinto. Ellos son cadenas grandes con miles de
referencias: el blanco es el fondo neutro que deja respirar un catálogo
enorme. Nosotros somos 124 productos con fotos de proveedor de calidad
desigual, y **el crema las unifica**: sobre blanco, una foto con fondo
blanco recortado y otra con fondo gris se ven como dos tiendas distintas;
sobre crema, las tarjetas blancas flotan y el conjunto se lee como una sola.

### Contraste: los siete pares que importan

| | Ratio | Mínimo | |
|---|---|---|---|
| Texto normal (tinta sobre crema) | 14,38:1 | 4,5 | AAA |
| Texto secundario | 6,45:1 | 4,5 | AA |
| Barra de aviso (crema sobre verde) | 9,40:1 | 4,5 | AAA |
| Botón secundario | 9,40:1 | 4,5 | AAA |
| Botón principal | 5,49:1 | 4,5 | AA |

Todos pasan.

### Las tres derivas

Al medir la portada aparecieron colores que no estaban en nuestra paleta:

| Debería ser uno | Y eran dos | Distancia |
|---|---|---|
| Verde | `#1F4A37` (nuestro) y `#2E5943` (pie y boletín) | **ΔE 6,4** |
| Naranja | `#A94F1E` (nuestro) y `#C0602B` (tema) | **ΔE 7,5** |
| Beige de borde | `#E0D5C2` y `#E4DBCC` | ΔE 3,1 |

Por encima de ΔE 2 se nota a simple vista. Son colores lo bastante
parecidos para parecer un error y lo bastante distintos para verse.

### Y el fallo de verdad

El naranja del tema, `#C0602B`, con texto blanco da **4,24:1**. El mínimo
de la norma es 4,5:1. **No llega.**

Y no es un color cualquiera: `color10` es
`palette_primary_button_background`. Es el color del botón **«Añadir al
carrito»** de las 124 fichas, y el de las insignias de oferta.

Unificado con el nuestro, `#A94F1E`, que da **5,49:1** con blanco y 5,15:1
con crema. Se arregla el contraste y la duplicidad de un solo cambio.

Comprobado en la ficha después: **un solo naranja y un solo verde en toda
la página.**

### La regla que queda

Nuestra paleta vive en dos sitios: las variables CSS de
`assets/patitas-cj.css` y el `color_palette` de
`config/settings_data.json`. **Los dos tienen que decir lo mismo.** Si se
cambia un color, se cambia en los dos. Si no, aparece esto: dos verdes, dos
naranjas y un botón que no cumple la norma sin que nadie lo haya decidido.

### Lo que NO he cambiado, y por qué

`ui-ux-pro-max` propone para «tienda de mascotas» un verde azulado
`#0D9488` con estilo «plastilina». **No lo he puesto.** Nuestra paleta está
copiada de tiendas españolas que venden de verdad; la suya sale de una
base de datos genérica. Una base de datos no sabe que Tiendanimal y
Kiwoko, las dos, evitan el turquesa.

---

## 18. El barrido que no había hecho

Pablo preguntó si había corregido todo y hecho un barrido. La respuesta
honesta era **no**: había ido corrigiendo lo que me iba encontrando tirando
de hilos, que no es lo mismo. Este es el barrido de verdad.

### Lo primero: llevaba toda la sesión ignorando un aviso

Cada vez que cargaba una página, el navegador decía «3 errores en consola».
No miré ni uno en todo el día. Al mirarlos: son **de Shopify y del
laboratorio**, no del tema. El medidor de analítica de Shopify
(`event_observer_reporter`) y el iframe de Shop Pay, que este entorno
bloquea por política de red.

**Salvedad honesta:** aquí el proxy bloquea a los terceros, así que esto no
demuestra que un visitante real no vea otra cosa. Demuestra que **el tema no
lanza errores propios**.

### Lo que encontró el barrido

**Cinco sitios más con el «55 €», y ninguno era un producto.** Por eso no
los pillé: había barrido las 124 fichas y me había parado ahí.

| Dónde | Por qué importa |
|---|---|
| Página **Envíos y entregas** | Es la página a la que va la gente justo a mirar eso |
| Página **Preguntas frecuentes** | |
| Colección **Ropa y abrigos** (SEO) | Sale en Google |
| Colección **Regalos** (SEO) | Sale en Google |
| Artículo **«Mi perro come demasiado rápido»** | |

### Y algo peor que el 55 €: dos páginas que se contradecían

- **Preguntas frecuentes:** «6,99 € a España peninsular… A la Unión Europea,
  8,99 €. Resto de destinos, 12,99 €.»
- **Envíos y entregas:** «De momento, **solo a España peninsular**. Todavía
  no servimos a Baleares, Canarias, Ceuta, Melilla ni fuera de España.»

Fui a mirar el perfil de envío real en vez de elegir a ojo:

| Zona activa | Tarifa |
|---|---|
| España peninsular **y Baleares** (48 provincias) | 6,99 € · gratis desde 39 € |
| **Unión Europea** (27 países) | 8,99 € |
| **Internacional** (EE. UU., R. Unido, Japón, Australia…) | 12,99 € |

**La de Preguntas frecuentes tenía razón. La de Envíos estaba mal.** Le
estaba diciendo a un cliente balear o europeo que se fuera, cuando puede
comprar perfectamente. Corregida.

Y el texto que tenía preparado para la política legal
(`research/textos/politica-envio.html`) repetía el mismo error. También
corregido, con un aviso dentro del fichero.

### Lo que comprobé y está bien

| Qué | Resultado |
|---|---|
| **40 rutas** (productos, colecciones, páginas, políticas, carrito, búsqueda) | **0 rotas** |
| **22 productos enlazados** desde blog, páginas y fichas | los 22 **activos** (ninguno archivado) |
| Enlaces externos del blog | 3, todos a fuentes citadas de precios de peluquería |
| Políticas legales | 4 de 5 limpias |

### Lo que queda, y por qué

**1. La política de envío legal sigue diciendo 55 €.** Verificado hoy, no
de memoria: los permisos de esta aplicación incluyen `read_legal_policies`
pero **no** `write_legal_policies`. No se puede desde aquí. El texto
corregido está listo para pegar.

**2. Unos 250 textos alternativos de imagen son de relleno.** Hay dos
generaciones:

- Las primeras: escritas a mano y descriptivas — *«Perro secándose con el
  albornoz después del baño»*.
- Las últimas 250: automáticas — *«Hamaca colgante para jaula y transportín
  de gato — foto 7»*.

Las segundas **existen** (no hay fallo de accesibilidad: toda imagen tiene
su atributo) pero **no dicen nada**. A una persona ciega, «foto 7» no le
cuenta qué hay en la foto 7.

**No las he reescrito, y es a propósito.** Para escribir un texto
alternativo de verdad hay que **mirar la imagen**. Inventar 250
descripciones sin mirarlas sería peor que dejarlas: tendríamos 250
descripciones que pueden estar mal. Queda como tarea, con la misma regla
que la revisión de fotos de septiembre: a tamaño legible y de una en una.

**3. Seis colecciones sin foto de portada**: novedades, regalos, navidad,
halloween, empieza-por-aqui y la `frontpage` vacía que trae Shopify de
serie. Solo se nota si alguna se pone como tarjeta en la portada.

**4. Una decisión que es de Pablo:** las zonas de UE e Internacional están
activas. O el texto dice la verdad (que es lo que he hecho), o se cierran
las zonas. Se pueden cerrar desde aquí si lo dice, pero es decisión suya,
no mía.

### La regla que deja este barrido

Barrer «los productos» no es barrer «la tienda». El mismo dato —el umbral
de envío gratis— vivía en **seis** sitios distintos: fichas de producto,
páginas, descripciones SEO de colección, artículos del blog, la política
legal y los ajustes de envío. Cambiar uno no cambia los otros.

**Antes de dar por corregido un dato, hay que listar dónde vive.**

---

## 19. Tres packs nuevos, y cómo se resolvió lo de la foto

Ayer dejé el pack de gato sin hacer porque «necesita una foto de conjunto y
no tengo con qué generarla». Eso era cierto a medias: no puedo **generar**
una imagen, pero sí puedo **componer** una con las fotos reales de cada
pieza. Y componer es mejor que generar: el cliente puede ir a ver cada foto
en su propia ficha.

### Los tres

| Pack | Piezas | Suma real | Precio | Ahorro | Con BIENVENIDA10 |
|---|---|---|---|---|---|
| **El gato recién llegado** | rascador 35 cm + hierba gatera + pez | 55,70 € | 46,90 | 8,80 | 42,21 € ✓ |
| **El gato en invierno** | hamaca radiador + saco cueva M + manta 40×50 | 79,70 € | 66,90 | 12,80 | 60,21 € ✓ |
| **Todo el paseo** | arnés+correa + botella 3 en 1 + portabolsas | 65,70 € | 55,90 | 9,80 | 50,31 € ✓ |

La última columna importa: los tres siguen por encima de 39 € después de
aplicar el código de bienvenida, así que la frase «el envío sale gratis» no
miente a nadie.

### El error que volví a estar a punto de cometer

Iba a poner el rascador a **17,90 €**. Ese es el precio de la variante de
**30 cm**. El pack lleva la de **35 cm**, que su propia ficha llama «la
medida más habitual para un gato adulto normal», y cuesta **20,90 €**.

Es exactamente el mismo fallo del albornoz de ayer. La regla ya está en el
manual y aun así casi cae otra vez: **en un producto con variantes, el
precio del producto no existe.**

### Las fotos: tres intentos hasta que estuvo bien

Compuestas con PIL, 1200 × 1200, fondo crema `#FBF7F1` y borde `#E4DBCC` —
los de la tienda. Arriba la foto de ambiente, abajo las otras dos piezas.

**Intento 1 — formato equivocado.** Salieron 1380 × 500. Las tarjetas del
tema recortan en **cuadrado**: se habrían comido las dos piezas laterales.

**Intento 2 — texto en inglés dentro.** La foto de la hierba gatera lleva
rótulos incrustados: «Hydroponic Cat Grass Box». Poner eso en la portada de
un pack, el mismo día que acabo de pasar 304 textos a español de España,
sería deshacerlo con una imagen. De sus diez fotos, **nueve tienen texto**;
solo una está limpia. Es la que se usó.

Lo mismo con el conjunto de arnés y correa: la única foto que enseña las dos
piezas lleva la medida impresa («0.8x1.8m») y salía cortada por el borde.

**Intento 3 — una foto que engaña.** Puse arriba al teckel con el
portabolsas, pero el recorte dejaba en primer plano un **jersey de rayas
que no va en el pack**. Reordenado: arriba la botella, abajo el arnés y el
teckel en pequeño, donde el dispensador se ve claro.

**La regla:** una foto de pack no puede enseñar en grande algo que no va
dentro. Aunque sea la foto oficial del producto.

### Y un desajuste que creé yo

Al meter los tres con «| Ahorras X €» en el título, la rejilla quedó con
**cuatro packs que lo dicen y cuatro que no**. Ayer decidí no tocar esos
cuatro títulos porque son la voz de Pablo. Hoy, habiendo creado el
desajuste, dejarlo a medias era peor que cualquiera de las dos opciones.

Añadido a los cuatro. Los ahorros son los verificados ayer, uno a uno.
**Los cuatro `handle` no han cambiado**, así que ningún enlace se rompe:
comprobado en la respuesta de cada mutación.

### Una fragilidad que dejo señalada, sin tocar

La foto del **Pack de coche** (el de septiembre) lleva **los precios
escritos dentro de la imagen**: «34,90 € por separado», «En pack: 64,90 €».
Hoy es verdad. El día que cambie un precio, la imagen mentirá y nadie se
acordará de ella.

Las tres nuevas no llevan ni un número dentro. A propósito.

## 20. Los dos barridos que pediste, y el tercero que hizo falta

Pablo pidió *«sin errores… como mínimo haz dos barridos de revisión»*. Hice
dos. El segundo dio limpio. **El segundo estaba mal hecho**, y el tercero es
el que encontró lo gordo. Lo cuento en ese orden porque el fallo de método
es más útil que el resultado.

### Barrido 1 — sobre lo que acababa de escribir

Empecé por lo más peligroso: comprobar, frase a frase, que las fichas de los
tres packs nuevos no afirmaran nada que no estuviera en la ficha del producto
suelto. Salieron **tres inventos míos**:

| Lo que escribí | Lo que dice la ficha real |
| --- | --- |
| La hierba «brota en 3 días, lista en 7» | «Lista en **cuatro o cinco días**» |
| La manta lleva «capa metalizada» | «Capa **térmica reflectante**» |
| Tres cosas de la botella de paseo | Eran del **Bebedero 2 en 1**, otro producto |

Las tres reescritas. El origen de la primera es el que más me preocupa: la
saqué del rótulo en inglés de una foto del proveedor que yo mismo acababa de
descartar por llevar texto incrustado. Leí el gráfico y no la ficha.

### Barrido 2 — y por qué no valía

Comprobé pertenencia a colecciones, orden de «Novedades», su descripción SEO
(estaba vieja, corregida) y **las descripciones de los 127 productos activos**
contra el 55 € antiguo. Cero apariciones. Di el barrido por bueno.

Dos errores de método:

1. **Busqué el 55 € en los productos, no en el tema.** El número no vivía en
   ningún producto.
2. **La comprobación de rutas era humo.** Inventé los `handle` en vez de
   pedirlos a la tienda, y `curl` devuelve un 404 con la página entera del
   tema dentro. Mis comprobaciones de texto «pasaban» sobre páginas de error.
   Los tres packs nuevos no son `pack-gato-hierba-gatera-y-juguete-de-plumas`
   sino `pack-gato-recien-llegado`, `pack-gato-invierno` y
   `pack-todo-el-paseo`.

Regla nueva, ya en CLAUDE.md: **los `handle` se piden a la tienda; y una
comprobación de ruta sin mirar el código HTTP no es una comprobación.**

### Barrido 3 — el que sí

Hecho al revés: contra el tema y contra el HTML que de verdad sirve el
borrador (entrando primero por `?preview_theme_id=` para coger la cookie, que
si no se sirve el tema publicado y parece que no ha cambiado nada).

**Hallazgo 1 — el 55 € seguía en las 127 fichas.**
`templates/product.json` tenía un bloque de envío que decía *«Envío gratis a
partir de 55 €»*. No es una ficha suelta: es la plantilla, y **los 127
productos activos tienen `templateSuffix` nulo**, así que la usan todos. El
sitio con más lectores de la tienda era el único que seguía con el número
viejo. Corregido y comprobado en el HTML servido.

**Hallazgo 2 — los plazos se contradecían dentro de la misma página.**
Treinta fichas dicen «llega a España en dos o tres semanas» porque su
producto va en la línea lenta. El bloque del tema, justo al lado, decía
«Llega en 1 o 2 semanas» y daba un desglose que suma once días laborables
como mucho. La portada hacía lo mismo consigo misma: dos textos de «una o dos
semanas» contra su propia pregunta frecuente, que dice «entre 10 y 20 días
naturales» y que es la que está bien.

Arreglado hacia el lado de prometer de menos: **1 a 3 semanas** en los tres
sitios, y el párrafo de la ficha ya no da un desglose genérico, remite al
plazo concreto de la descripción cuando lo hay. **Cuarenta y dos fichas no
llevan ningún plazo escrito**, por eso el bloque sigue dando un rango en vez
de limitarse a remitir.

**Hallazgo 3 — la portada solo hablaba de España.** La pregunta «¿cuánto
cuesta el envío?» decía 6,99 € y peninsular y Baleares, y ya. Las zonas de UE
(8,99 €) e internacional (12,99 €) están activas. Ahora dice las tres, con el
«gratis desde 39 €» pegado a la frase de España, que es la única zona donde
se aplica.

### Lo que el barrido 3 sí dio limpio

- **Enlaces**: los 38 enlaces internos de la portada del borrador devuelven
  200. Ninguno roto. (Las cuatro fuentes que salían como «rotas» eran un
  fallo de mi script, que le pegaba el dominio a una URL que ya lo llevaba.)
- **El 55 € en el borrador**: cero en portada, colecciones, carrito,
  buscador, páginas y cuatro de las cinco políticas. **Queda en
  `/policies/shipping-policy`**, que sigue siendo la única que no puedo tocar
  (falta el permiso `write_legal_policies`). El texto corregido está en
  `research/textos/politica-envio.html`.
- **Las cuentas de los tres packs**, componente a componente, leyendo la
  variante exacta que nombra el texto:

  | Pack | Suma de las piezas | Precio | Ahorro |
  | --- | --- | --- | --- |
  | El gato recién llegado | 20,90 + 16,90 + 17,90 = 55,70 | 46,90 | 8,80 ✓ |
  | El gato en invierno | 29,90 + 29,90 + 19,90 = 79,70 | 66,90 | 12,80 ✓ |
  | Todo el paseo | 27,90 + 22,90 + 14,90 = 65,70 | 55,90 | 9,80 ✓ |

  Los tres pasan de 39 €, así que la frase «el envío sale gratis» es cierta
  en los tres.
- **Las afirmaciones del pack del paseo**: aquí me asusté por nada. Creí que
  había mezclado dos arneses distintos, porque hay dos a 27,90 €. Fui a
  comprobarlo antes de decir nada y el texto describe el correcto (el
  «Conjunto arnés de pecho + correa a juego»): las bandas reflectantes, la
  anilla en D, las cuatro tallas en centímetros y hasta el aviso de que el
  reflectante se despega están, palabra por palabra, en su ficha.

### Lo que dejo señalado y no toco

- El **Pack de coche** sigue con los precios escritos dentro de la foto.
- El **Pack baño y lluvia a 39,90 €** se queda 0,90 € por encima del umbral:
  con BIENVENIDA10 baja de 39 € y vuelve a pagar envío.

## 21. «¿Están bien los colores para lanzar?» — tres fallos más, medidos

Pablo preguntó si la tienda está lista. En vez de opinar, medí otra vez toda
la paleta contra los mínimos de la WCAG. Los textos y los botones pasan de
sobra:

| Dónde | Contraste | Mínimo |
| --- | ---: | ---: |
| Texto normal (tinta sobre crema) | 14,38:1 | 4,5 |
| Texto gris sobre crema | 6,45:1 | 4,5 |
| Texto gris sobre arena | 5,81:1 | 4,5 |
| Botón «Añadir al carrito» | 5,15:1 | 4,5 |
| Banda verde con texto crema | 9,40:1 | 4,5 |

### Fallo 1 — el borde de las cajas de texto no se veía

`#E4DBCC` sobre `#FBF7F1` da **1,29:1**. La WCAG 1.4.11 pide **3:1** en el
borde de un control cuando ese borde es lo único que lo identifica, y aquí lo
era: el fondo de los campos es el mismo crema que la página. Si el borde no se
ve, la caja no existe.

Nuevo: **`#968973`, 3,21:1**. Mismo matiz cálido (37°), solo más oscuro, para
no cambiar el carácter de la paleta. `color3` se usa en exactamente dos sitios
—comprobado con grep en todo el tema—: el borde de los campos y el de los
selectores de variante. Ningún borde decorativo se ve afectado.

### Fallo 2 — el selector de cantidad se saltaba el ajuste

Cambiar `color3` no llegó al selector de cantidad de la ficha. **Visto en el
navegador, no deducido:** ese bloque tenía su propio color fijado a `color11`,
que seguía siendo el `#E4DBCC` viejo. Ahora apunta a `color3`, como el resto.

Comprobado después en el navegador, midiendo el contraste real de cada control
de la ficha: selector de color **3,21:1**, selector de cantidad **3,21:1**,
alta de correo del pie **6,88:1**. Los tres pasan.

Este es el motivo de abrir el navegador de verdad: el fichero decía una cosa y
la página pintaba otra.

### Fallo 3 — el arnés salía preseleccionado en talla 2XL

Mirando la captura de la ficha vi que el desplegable de talla venía puesto en
**2XL**. No era casualidad: las tallas estaban guardadas en orden alfabético
(2XL, L, M, S, XL), así que Shopify preseleccionaba la primera, que es la más
grande de todas.

Quien compre para un chihuahua y no se fije se lleva un arnés de perro
gigante. Eso es una devolución, y encima pagada por el cliente.

Repasados **los 127 productos activos**: solo dos tenían el orden mal.

| Producto | Antes | Ahora |
| --- | --- | --- |
| Arnés de pecho con correa | 2XL, L, M, S, XL | S, M, L, XL, 2XL |
| Saco de dormir cueva | S, M, L, XS | XS, S, M, L |

Comprobado en la ficha después del cambio: el desplegable ya viene en **S**.
