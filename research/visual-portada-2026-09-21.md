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
