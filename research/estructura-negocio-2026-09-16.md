# Análisis de la estructura del negocio


> **AVISO (20/09/2026).** Este documento da por hecho que el plan Advanced
> cuesta ~384 € al mes y que bajar a Basic es la mejora más rentable. **Eso
> es falso:** Pablo tiene Advanced en promoción por **1 € durante tres meses**
> (hasta ~2 de diciembre de 2026). Todo lo que este documento diga sobre bajar
> de plan está anulado por `research/plan-advanced-promocion-2026-09-20.md`.
> El resto del documento sigue siendo válido.

**16 de septiembre de 2026.** Todo medido hoy contra la API de Shopify y la web
en vivo. Lo que es estimación, se dice que lo es.

---

## 1. El negocio en una foto

| Pieza | Estado hoy |
| --- | --- |
| Catálogo | **120 productos activos**, 4 borradores, 2 archivados |
| Precio mediano | **19,90 €** (medio 24,68 €; de 9,90 a 64,90 €) |
| Colecciones | 14 |
| Blog | 9 artículos publicados |
| Mercados | 1 — España. Un idioma |
| Clientes | **2** |
| Pedidos reales | **0** (el #1001 fue una prueba de un familiar, devuelta) |
| Sesiones 30 días | 502, de las cuales **72 son móvil España** |
| Plan de Shopify | **Advanced** |

---

## 2. La cuenta que manda sobre todas las demás

Margen medido por pedido, en dos productos distintos:

- Botas de invierno, 22,90 € → **13,83 €** de margen (porte real 3,28 €).
- Cama en dónut, venta media 32 € → **≈13 €** de margen.

Llamémoslo **13 € de margen por pedido**. Ahora el coste fijo:

| Plan | Coste al mes | Pedidos/mes solo para pagarlo |
| --- | ---: | ---: |
| **Advanced (el actual)** | **384 €** | **30 pedidos** |
| Basic | 32 € | **3 pedidos** |

*(Precios comprobados el 4 de septiembre; pagando anual, Advanced baja a 289 €.)*

Y traducido a visitas, con una conversión del 1,5 % (lo normal en tienda nueva
sin reseñas):

- Para 30 pedidos al mes hacen falta **2.000 visitas reales al mes**.
- Para 3 pedidos al mes hacen falta **200 visitas reales al mes**.

Hoy entran **72**, y parte son nuestras propias comprobaciones.

**Conclusión:** el plan Advanced no es «un gasto». Es lo que separa un negocio
que se paga solo con 200 visitas al mes de uno que necesita 2.000. Mientras siga
puesto, cada mes se van 384 € a cambio de nada, y el punto de equilibrio está
diez veces más lejos de lo que hace falta.

**Esto es, con diferencia, la mejora número uno. Y es gratis.**

> **Corregido el 20/09/2026:** este apartado entero está mal. Advanced está
> en promoción de **1 € al mes** hasta ≈2/12/2026, así que no se van 384 € a
> ningún sitio y el punto de equilibrio real de hoy son 3 pedidos, no 30.
> La mejora número uno **no** es bajar de plan: es no pasarse de la fecha.
> Ver `research/plan-advanced-promocion-2026-09-20.md`.

---

## 3. El envío está peleado con el catálogo

| Dato | Valor |
| --- | --- |
| Envío estándar España | 6,99 € |
| Envío gratis a partir de | **55 €** |
| Precio mediano del catálogo | 19,90 € |
| Productos que llegan a 55 € **solos** | **4 de 120** |

Un cliente normal pone un producto de 19,90 € en el carrito y en el pago le
aparecen 6,99 € más. Eso es un **+35 % sobre lo que creía que iba a pagar**, y
es la causa número uno de abandono de carrito en España.

Para librarse necesita llegar a 55 €, o sea **tres productos**. Nadie hace una
primera compra de tres productos en una tienda que no conoce.

**Dos arreglos posibles:**

1. **Bajar el umbral a 39 €.** Se alcanza con dos productos, que sí es una
   compra creíble, y sube el pedido medio de ~20 a ~40 €. El margen por pedido
   casi se dobla.
   *Cuidado:* hay que comprobar antes que dos productos distintos de CJ viajan
   en **un solo paquete**. Si van en dos, se paga porte dos veces y el arreglo
   se come el margen. Los 5 packs ya resuelven esto porque van juntos.
2. **Envío gratis en el primer pedido**, a cambio del correo electrónico.
   Cuesta ~3,6 € de margen y quita el susto exacto que hace que la gente cierre
   la pestaña.

---

## 4. Tres agujeros estructurales

### 4.1 No hay ni una reseña

Comprobado sobre la portada real: **cero estrellas, cero valoraciones, ninguna
app de reseñas instalada**. Una tienda de dos semanas, sin marca, con entrega en
una o dos semanas desde China, y sin una sola prueba de que alguien haya
comprado y le haya llegado.

No se pueden inventar reseñas, y no vamos a hacerlo. Lo que sí se puede:
**pedirlas a los primeros pedidos reales** con un correo automático a los 20 días
de la entrega. Judge.me tiene plan gratuito.

### 4.2 La lista de correo son 2 personas

`customersCount = 2`. Hay un campo de correo en el pie, pero **sin ningún
motivo para dejarlo**.

Esto importa más de lo que parece: los accesorios de mascota son una categoría
de **compra repetida** (juguetes, higiene, ropa por temporada). Un cliente que
compra una vez y no vuelve deja 13 € de margen; uno que vuelve tres veces deja
39 € y no cuesta nada captarlo la segunda y la tercera vez. Sin lista, todo
cliente es un cliente de una sola vez.

Shopify Email es gratis hasta 10.000 envíos al mes. No hay excusa de coste.

### 4.3 Hay un código de descuento muerto

`Pet07`, **5 %**, activo desde el 13 de septiembre, sin caducidad, **0 usos**, y
no aparece anunciado en ninguna parte.

Un 5 % sobre 19,90 € es **1 €**. No mueve a nadie. Y peor: la casilla «código
de descuento» visible en el pago hace que la gente se vaya a buscar cupones a
Google y no vuelva.

**Cambiarlo por `ENVIOGRATIS` en el primer pedido**, que vale 6,99 € reales y
resuelve el problema del punto 3.

---

## 5. El catálogo es ancho y no está validado

120 productos activos. **Cero validados por una venta.**

Y las colecciones se pisan unas a otras:

| Colección | Productos |
| --- | ---: |
| **Novedades** | **126** ← el catálogo entero |
| Gatos | 60 |
| Casa, coche y paseo | 47 |
| Regalos para perro y gato | 44 |
| Juguetes | 31 |
| Higiene y cuidado | 23 |
| Ropa y abrigos | 18 |
| Comederos | 17 |
| Camas | 15 |
| Lluvia y barro | 9 |
| Packs | 5 |
| Navidad | 5 |
| Halloween | 2 |

«Novedades» con 126 productos no destaca nada: es el catálogo otra vez. Un
visitante que entra por la portada tiene catorce puertas y todas dan al mismo
sitio.

**Lo que toca:** parar de subir producto y **elegir entre 8 y 12 héroes**. Esos
son los que van en la portada, los que se enlazan desde redes y los que reciben
los artículos del blog. El resto queda en el catálogo para quien busque, pero
deja de competir por la atención.

Esto también significa **congelar la tarea #22 (arbitraje de tendencias)**. Con
0 ventas, el producto 121 no aporta nada que no aporte ya el 120.

---

## 6. El cuello de botella real sigue siendo el mismo: no entra gente

Origen de las 502 sesiones de los últimos 30 días:

| Origen | Sesiones |
| --- | ---: |
| directo | 411 (casi todo rastreadores y nuestras propias pruebas) |
| social | 59 |
| búsqueda | 31 |

Y por país y dispositivo: **368 son escritorio desde Estados Unidos** — bots y
nuestras comprobaciones. **Móvil España: 72.**

De esas 72, hubo **2 que añadieron al carrito y 1 que llegó al pago**: la compra
de prueba. O sea que la tienda convierte cuando entra una persona de verdad; lo
que no hay es personas.

### El punto ciego del plan actual de redes

El calendario de Metricool está lleno hasta el 25 de noviembre y 118 de 120
productos tienen publicación. Eso está hecho. Pero **lo que se publica son fotos
de producto con texto encima**, no producto real funcionando. En TikTok eso
rinde poco: la plataforma premia metraje real.

**La palanca más barata que queda sin usar, y la recomiendo con fuerza:**

> **Pedir de CJ tres o cuatro de los productos héroe a tu propia casa.**
> Cuesta unos 60–80 € y arregla tres cosas de una vez:
> 1. **Vídeo real** para TikTok e Instagram, que es lo único que puede romper el
>    techo de alcance.
> 2. **Fotos propias** — ahora mismo todas las fotos son del proveedor, iguales
>    a las de cualquier otra tienda que venda lo mismo.
> 3. **Control de calidad**: compruebas tú si el producto es decente **antes**
>    de que lo compruebe un cliente y te deje la primera reseña de una estrella.

Nadie ha tocado un producto todavía. Eso es una anomalía en un negocio que
vende productos físicos.

---

## 7. Lo que se va a romper en el primer pedido de verdad

| Riesgo | Estado | Qué pasa si no se toca |
| --- | --- | --- |
| **Creación automática de pedidos en la app de CJ** | No se puede leer por API | El #1001 llegó a CJ sin producto, sin código postal y sin teléfono. Si sigue encendida, vuelve a pasar |
| **IVA sobre el transporte apagado** (`taxShipping = false`) | Confirmado hoy | Las facturas salen con la base imponible mal. Con un pedido ya es un error contable que hay que rectificar |
| **Saldo en CJ** | Pendiente el pago de 5,12 $ | Sin saldo, el pedido no sale aunque el cliente haya pagado |

Los tres son de panel, no de API. Los tiene que hacer Pablo.

---

## 8. Configuración muerta que conviene limpiar

- **Zonas de envío a la UE (8,99 €) y al resto del mundo (12,99 €)** creadas,
  pero el único mercado activo es España. Nadie puede usarlas: configuración
  huérfana que despista al leer los ajustes.
- 4 borradores y 2 archivados sin decidir.
- Apps que siguen puestas y no se usan: **TeemDrop** y **Stack**. También están
  «TikTok Shop — SPL», «Cloud: Claude Ai Assistant» y «Shopify ChatGPT MCP» si no
  se usan.
- Lo bueno: **la portada ya no carga ni un script de terceros**. La limpieza de
  apps anterior funcionó y el píxel de PagePilot que espiaba a los visitantes ya
  no está.

---

## 9. Orden de ataque

Por impacto dividido entre esfuerzo, no por gusto:

| # | Qué | Quién | Coste | Efecto |
| --- | --- | --- | --- | --- |
| 1 | ~~Bajar a Basic~~ → **Confirmar en el panel cuándo acaba la promoción de 1 €** | Pablo (panel) | 0 € | Advanced está a 1 €/mes hasta ≈2/12/2026. Bajar hoy no ahorra nada; lo que cuesta dinero es pasarse de la fecha |
| 2 | **Apagar la creación automática de pedidos de la app de CJ** | Pablo (panel) | 0 € | Evita que el primer pedido real llegue roto |
| 3 | **Activar el IVA sobre el envío** | Pablo (panel) | 0 € | Evita el error contable |
| 4 | **Pedirse 3–4 productos héroe a casa** | Pablo | 60–80 € | Vídeo real, fotos propias y control de calidad |
| 5 | **Umbral de envío gratis a 39 €** *(tras comprobar el porte combinado)* | yo | 0 € | Sube el pedido medio de ~20 a ~40 € |
| 6 | **Cambiar `Pet07` por envío gratis en el primer pedido a cambio del correo** | yo | ~3,6 €/pedido | Quita el susto del pago y empieza la lista |
| 7 | **Elegir 8–12 héroes y rehacer la portada alrededor** | yo | 0 € | Deja de ofrecer catorce puertas iguales |
| 8 | **Correo automático de reseña a los 20 días** | yo | 0 € | Empieza a haber prueba social |
| 9 | **Congelar la tarea #22 y no subir más producto** | — | 0 € | El producto 121 no aporta nada |
| 10 | **Limpiar zonas de envío, borradores y apps sobrantes** | los dos | 0 € | Menos sitios donde equivocarse |

Los puntos 1, 2 y 3 son de panel y valen más que todo lo demás junto.
El punto 4 es el que puede cambiar la curva de tráfico.

---

## 10. Lo honesto sobre dónde estamos

El sistema de venta funciona: se comprobó de punta a punta y se puede comprar.
El catálogo está bien hecho, las fichas dicen la verdad, el blog está sembrado y
las redes están programadas hasta noviembre.

**Lo que no hay es gente, y lo que no hay es prueba de que el producto sea
bueno.** Ninguna de las dos cosas se arregla subiendo más producto ni escribiendo
más fichas. Se arreglan con metraje real, con la lista de correo empezando a
existir, y con que el coste fijo deje de exigir treinta pedidos al mes.
