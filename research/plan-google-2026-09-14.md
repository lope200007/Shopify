# Cómo aparecer en Google. Plan real, con plazos reales

14 de septiembre de 2026.

## Lo primero, la verdad incómoda

**Google no te va a dar la primera venta.** Un dominio de tres semanas sin un
solo enlace no compite por «cama para perros» contra Amazon, Tiendanimal y
Kiwoko. Eso no es pesimismo, es cómo funciona: Google necesita ver que otros
sitios te enlazan y que la gente vuelve, y eso tarda **de tres a seis meses**
en notarse y un año en consolidarse.

Lo que sí puede pasar en semanas es otra cosa, y es la parte que casi nadie
hace: **aparecer en la pestaña Shopping de Google, que es gratis.**

## Cómo está la tienda ahora mismo (comprobado hoy, no estimado)

| Qué | Cómo está |
| --- | --- |
| Sitemap | ✅ Vivo, con **73 productos**, colecciones, páginas y blog |
| robots.txt | ✅ `Allow: /` |
| Datos estructurados | ✅ `ProductGroup` con las 30 variantes, precio, EUR, `InStock`, marca |
| Idioma | ✅ `<html lang="es">` |
| Canonical | ✅ Correcto en cada ficha |
| Velocidad en móvil | ✅ 0,64 - 1,38 s |
| Valoraciones (`aggregateRating`) | ❌ No hay ninguna |
| Blog | ⚠️ Existe, **3 artículos**, todos del 8 de septiembre |
| Enlaces desde otras webs | ❌ Cero |
| Palabras posicionadas | ❌ Cero, salvo «patitascalidas» |

O sea: **la casa está construida y la puerta abierta. Lo que no hay es calle.**

## Lo que hay que hacer, en orden de lo que antes da resultado

### 1. Google Merchant Center — fichas gratis en Shopping (Pablo, 30 min)

Esto es lo primero y lo más rentable, y está sin hacer.

Desde 2020 las fichas de producto en la pestaña Shopping de Google **son
gratuitas**. No es publicidad: es un listado al que se entra subiendo el
catálogo. Los 73 productos ya tienen el formato que Google pide (lo he
comprobado arriba: precio, moneda, disponibilidad, marca, imagen).

Cómo: en el admin de Shopify → **Canales de venta → + → «Google y YouTube»** →
instalar → conectar una cuenta de Google → crear Merchant Center → elegir
España y euros → sincronizar el catálogo.

Plazo: Google revisa la tienda en **3 a 5 días**. Después, los productos
empiezan a salir en Shopping. Es el único sitio donde un dominio nuevo compite
de tú a tú con Kiwoko, porque ahí ordena por producto y precio, no por
autoridad del dominio.

**Requisito que suele tumbar la revisión:** la tienda necesita política de
devoluciones y de envíos visibles, y datos de contacto. Eso ya está.

### 2. Google Search Console — que Google sepa que existes (Pablo, 15 min)

Sin esto, Google acaba encontrando la tienda sola, pero puede tardar semanas.
Con esto, días.

1. Entra en `search.google.com/search-console` y añade la propiedad
   `patitascalidas.com`.
2. Verifica. La forma más limpia es por **DNS**, en el panel del dominio.
3. **Sitemaps → añadir `sitemap.xml`.**
4. **Inspección de URLs** → pega la portada → «Solicitar indexación». Repite
   con las cinco colecciones principales y los cinco productos que más te
   interesen. Se puede hacer un puñado al día.

Y a partir de ahí, Search Console es **el termómetro**: te dice qué busca la
gente que te encuentra. Hoy estamos ciegos.

### 3. El blog, que es lo único que un dominio nuevo puede ganar

La ficha de producto compite contra Amazon. El artículo compite contra blogs.
Esa es la diferencia, y por eso el blog es la palanca.

Hay 3 artículos. **Hacen falta uno o dos por semana durante tres meses.** No
por cantidad: porque hasta que no hay 15-20 artículos Google no tiene motivo
para considerar el sitio una fuente.

Qué funciona, con volúmenes reales de España ya comprobados:

| Artículo | La consulta que caza | Búsquedas/mes |
| --- | --- | ---: |
| Ya escrito: precio peluquería canina | «peluquería canina precio» | 22.200 en la raíz |
| Ya escrito: cómo cortar las uñas | «cortar uñas perro» | 1.300 |
| Ya escrito: rampa o escalera | «rampa para perros» | 3.600 |
| **Qué talla de cama necesita mi perro** | «cama perro» (racimo) | 13.200 |
| **Cómo medir el cuello para el collar** | «collar perro» (racimo) | 9.300 |
| **Golpe de calor en perros: señales** | verano, junio-agosto | pico estacional |
| **Cuánto tarda un pedido de dropshipping** | confianza, cero competencia | bajo pero convierte |

La regla: **cada artículo enlaza a dos o tres fichas del catálogo.** El
artículo trae la visita, la ficha la convierte. Un blog que no enlaza al
producto es un blog que regala tráfico.

### 4. Los enlaces: de cero a unos pocos, sin comprar ninguno

Cero enlaces es lo que más pesa ahora mismo. No hace falta comprar (además
Google lo penaliza). Lo que sí funciona y es gratis:

- **Perfiles reales**: Google Business Profile (aunque no haya tienda física,
  se puede dar de alta como negocio de servicio a domicilio), Instagram,
  TikTok, Pinterest, todos con el enlace a la web.
- **Pinterest** es el que más se infravalora: las fotos de producto con el
  enlace posicionan **dentro de Google Images** y duran años.
- **Foros y grupos españoles de perros**: responder de verdad, no spamear.
  Un enlace puesto donde encaja vale más que cien de directorio.
- **Los 32 vídeos verticales que ya están renderizados** en `assets/video/`:
  subirlos a TikTok y YouTube Shorts con el enlace en la bio.

### 5. Valoraciones: lo único que falta en los datos estructurados

Es lo único técnico que falta. Con valoraciones, la ficha sale en Google con
estrellas amarillas y el porcentaje de clics **sube mucho**. Sin ventas todavía
no hay valoraciones, así que esto va después de las primeras.

Cuando lleguen: instalar una app de reseñas gratuita (Judge.me tiene plan
gratis) y pedirla por correo a los 15 días de la entrega.

## El calendario honesto

| Cuándo | Qué se puede esperar |
| --- | --- |
| Semana 1 | Merchant Center enviado, Search Console verificado, sitemap subido |
| Semanas 2-3 | Fichas aprobadas y saliendo en Shopping. **Aquí puede llegar la primera venta.** |
| Mes 1-2 | Google empieza a indexar el blog. Primeras impresiones en Search Console |
| Mes 3-4 | Los artículos de cola larga empiezan a traer visitas de verdad |
| Mes 6 | Se puede empezar a hablar de posicionar consultas de producto |

## Lo que NO recomiendo todavía

- **Google Ads.** Con 0 ventas no sabemos qué producto convierte. Pagar por
  clics ahora es pagar por aprender lo que Shopping enseña gratis. Cuando haya
  10-15 ventas y se sepa qué producto tira, entonces sí.
- **Comprar enlaces o contratar SEO por 200 €/mes.** A esta escala no compensa.
- **Más productos.** 73 son suficientes. El problema no es el catálogo.

## Y una cosa que ahorra dinero desde mañana

La tienda está en el plan **Advanced de Shopify (289-384 €/mes)** con cero
ventas. El plan **Basic** hace exactamente lo mismo que necesitas ahora. Eso
son unos **3.000 € al año** que dan para mucha publicidad cuando llegue el
momento de hacerla.

---

# HECHO: el canal de Google está instalado (14 de septiembre, por la tarde)

Pablo lo instaló él mismo desde el ordenador. Verificado desde dentro de la
tienda, no por la pantalla:

- El canal **`Google & YouTube`** aparece en las publicaciones de
  `g5d031-ir.myshopify.com` → `gid://shopify/Publication/370321752412`.
- **Merchant Center conectado.**
- **72 de los 74 productos activos** quedaron publicados en el canal.
- Los 2 que faltan son las **alas de murciélago** y el **gorro de Halloween**,
  que están programados para el 1 de octubre. Correcto e intencional.

## Un susto que no era

La barra de direcciones de su navegador ponía `/store/prestige-12657/`, no
`g5d031-ir`. Parecía que hubiera instalado Google en otra tienda. No: Shopify
conserva en la URL del panel el identificador con el que se creó la tienda
aunque después se le cambie el nombre. La prueba definitiva fue mirar desde
dentro si el canal había aparecido en la tienda que gestiono. Apareció.

**Para la próxima: la URL del panel no identifica la tienda. El
`myshopifyDomain` sí.**

## El aviso amarillo de Merchant Center no es un error

Dice *«No Google Ads account linked»*. Es Google intentando vender publicidad.
Se queda ahí para siempre y no afecta a las fichas gratuitas de Shopping. **No
enlazar Google Ads** mientras no haya ventas que digan qué producto tira.

## Lo que NO se ve desde aquí

La aplicación de Google **no guarda el estado de aprobación dentro de la
tienda**. Solo deja un metafield `mm_google_shopping_extension.merchant_id`.
Comprobado producto a producto: no hay metafields de feed.

Así que **el estado Approved / Not Approved solo lo ve Pablo**, en la pantalla
del canal dentro de Shopify. El reparto queda así:

| Quién | Qué |
| --- | --- |
| Pablo | Lee los contadores y me pasa los rechazos |
| Yo | Arreglo la ficha: título, descripción, fotos, precio, canales |
| Nadie desde aquí | Ajustes dentro de Merchant Center (envíos, datos del negocio) |

## Las Routines de temporada, corregidas

Las dos de encendido daban por hecho que había **tres** canales. Ahora son
cuatro. Actualizadas para que publiquen también en `Google & YouTube`:

- **Halloween ON — 1 de octubre** (`trig_017wWZ1oMALfy8xYtn9NfiG9`)
- **Navidad ON — 1 de noviembre** (`trig_01Mty91eisJcd1Gr37zWdvxe`)

Sin esto, los productos de temporada habrían salido en la web pero **no en
Google Shopping** justo en su campaña. Y como la aprobación tarda de 3 a 5
días, encenderlos tarde es perder la temporada.

## Siguiente revisión

Programada para el **17 de septiembre**: comprobar aprobaciones, visitas y
pedidos (`trig_01QcLBVbszbY2CAcudoH2UWr`).

---

## HECHO: Search Console verificado y sitemap enviado

14 de septiembre de 2026, 12:50. Ejecutado por Pablo paso a paso.

| Paso | Estado |
| --- | --- |
| Propiedad `https://patitascalidas.com` añadida (prefijo de URL) | hecho |
| Verificación | **automática** — método "Etiqueta HTML" |
| Sitemap `sitemap.xml` enviado | hecho |
| Indexación solicitada: artículo de camas | hecho |
| Indexación solicitada: artículo de arneses | hecho |

### La verificación fue gratis, y por qué

Google verificó la propiedad **sin intervención manual**. La etiqueta
`google-site-verification` ya estaba en la portada: la había puesto el canal
de Google y YouTube al instalarse el 14/09. Confirmado desde fuera con una
petición a la portada (1 coincidencia en el HTML en línea).

**Consecuencia operativa: no desinstalar la app de Google y YouTube.** Si se
desinstala, desaparece la etiqueta y se pierde la verificación de Search
Console. Si alguna vez hay que quitarla, añadir antes un segundo método en
Ajustes → Verificación de la propiedad (registro DNS o archivo HTML).

### Estado del sitemap en pantalla

Search Console mostró "Tipo desconocido / No se ha podido obtener" justo
después del envío. **No es un fallo.** Comprobado con una petición usando el
User-Agent de Googlebot:

| Comprobación | Resultado |
| --- | --- |
| `GET /sitemap.xml` como Googlebot | 200, 892 B, 0,53 s |
| `content-type` | `application/xml; charset=utf-8` |
| Cabecera `cf-mitigated` | ausente — Cloudflare no interfiere |
| `GET /sitemap_blogs_1.xml` | 200, lista las 5 entradas |

Los dos artículos publicados hoy ya figuran en el sitemap del blog. El estado
de la pantalla pasa a "Correcto" solo, entre unas horas y dos días.
**No reenviar el sitemap**: no acelera nada y duplica la fila.

### Nota: el 429 es nuestro, no de la tienda

Al pedir `robots.txt` desde esta sesión salió **HTTP 429**. Es el escudo
antibots de la propia tienda limitando este centro de datos tras un volumen
alto de peticiones. No afecta a Googlebot. Al leer analítica o probar la web
desde aquí, espaciar las peticiones.

### Qué esperar ahora

Search Console empieza a acumular datos desde hoy. En unos días habrá
consultas reales: qué escribe la gente en Google antes de llegar a la tienda.
Ese dato no lo teníamos y es el que permitirá elegir los siguientes artículos
sobre demanda observada en vez de estimada.

Indexar no es posicionar. Los dos artículos se leerán en días; aparecer en
las primeras posiciones lleva semanas y depende de la calidad del contenido.
