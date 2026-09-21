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
