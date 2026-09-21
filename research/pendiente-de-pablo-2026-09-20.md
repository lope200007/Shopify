# Lo que sigue pendiente en el panel — comprobado el 20/09/2026

> **ACTUALIZADO el 20/09/2026, más tarde.** De los cinco puntos de abajo, dos
> ya están resueltos desde aquí y los tres textos de la portada están hechos y
> probados en un tema borrador. Lo único que queda es **un clic tuyo**:
>
> 1. **Publicar el tema** «Patitascalidas 2026 — envío gratis 39 €».
>    https://admin.shopify.com/store/g5d031-ir/themes
>    (Tiene los tres textos ya corregidos. Comprobado en su vista previa.)
> 2. **Cambiar la descripción de la tienda** (una línea, 55 → 39):
>    https://admin.shopify.com/store/g5d031-ir/online_store/preferences
> 3. **Pegar la política de envío** corregida:
>    https://admin.shopify.com/store/g5d031-ir/settings/legal
>
> 4. **Cambiar el título de la portada** (añadido el 21/09). Hoy dice
>    «Accesorios para perros que resuelven algo» — deja fuera a los gatos,
>    que son 55 productos del catálogo. Propuesta: «Accesorios para perros y
>    gatos que resuelven algo». Está en la misma página que el punto 2:
>    https://admin.shopify.com/store/g5d031-ir/online_store/preferences
>    No hay forma de cambiarlo desde la API: comprobado, no existe la
>    operación. Es panel obligatoriamente.
>
> La tarifa vieja de 55 € **ya está borrada** y las tarifas verificadas con
> pedidos de prueba. Lo de abajo se deja como estaba para que se vea de dónde
> se partía.


No es una lista de memoria. Cada línea se ha verificado hoy contra la tienda
en vivo (API de Shopify y el escaparate con `curl` y User-Agent de móvil).

---

## 1. El resultado corto

La tienda **cobra** el envío gratis a partir de **39 €**. La tienda **dice** 55 €
en todas sus páginas. Lleva así desde el 16 de septiembre.

Quien entre con 42 € en el carrito se cree que le van a cobrar 6,99 € de envío.
Se lo encuentra gratis en el paso de pago, si llega. Es una venta que se pierde
antes de empezar, y no cuesta dinero arreglarlo: cuesta cinco minutos.

---

## 2. Lo que sí está hecho (comprobado hoy)

| Cosa | Estado | Comprobación |
| --- | --- | --- |
| Tarifa «Envío gratis» a 39 € | **Activa** | `DeliveryMethodDefinition/1396859666780`, condición ≥ 39 € |
| Zona incluye Baleares | **Sí** | Zona «España peninsular y Baleares» → 48 provincias + `PM` Balears |
| IVA sobre el envío | **Activado** | `shop.taxShipping = true` |
| Descripciones de producto | **Limpias** | Muestra de 5 fichas: ninguna menciona 55 € |
| Descripciones de colección | **Limpias** | Las 15 revisadas, ninguna menciona el umbral |

---

## 3. Lo que falta, y es todo tuyo (5 sitios)

Enlaces directos. Tienda `g5d031-ir`.

### a) Los tres textos de la portada
https://admin.shopify.com/store/g5d031-ir/themes/204184420700/editor

Dentro de la sección **«Portada Patitascalidas»**:

1. Campo **«Aviso bajo los botones»** (`aviso_envio`):
   - dice: `Envío gratis a partir de 55 € · Entrega habitual de 10 a 20 días`
   - poner: `Envío gratis a partir de 39 € · Entrega habitual de 10 a 20 días`

2. Bloque **«Dato de confianza»**, el primero (Título):
   - dice: `Envío gratis desde 55 €`
   - poner: `Envío gratis desde 39 €`

3. Bloque **«Pregunta frecuente»** → «¿Cuánto cuesta el envío?» (Respuesta):
   - dice: `6,99 € por pedido, y gratis a partir de 55 € de compra.`
     `De momento solo servimos a España peninsular. Todavía no llegamos a Baleares, Canarias, Ceuta ni Melilla.`
   - poner: `6,99 € por pedido, y gratis a partir de 39 € de compra.`
     `Servimos a España peninsular y Baleares. Todavía no llegamos a Canarias, Ceuta ni Melilla.`

### b) La descripción de la tienda (lo que sale en Google)
https://admin.shopify.com/store/g5d031-ir/online_store/preferences

- dice: `… Envío gratis desde 55 € y 14 días para devolver.`
- poner: `… Envío gratis desde 39 € y 14 días para devolver.`

### c) La política de envío
https://admin.shopify.com/store/g5d031-ir/settings/legal → **Política de envíos**

El texto completo ya corregido está en `research/textos/politica-envio.html`.
Cambia tres cosas: el umbral (55 → 39), «España peninsular» → «España
peninsular y Baleares», y quitar Baleares de la lista de sitios a los que no
servimos.

### d) (opcional, limpieza) Borrar la tarifa vieja de 55 €
https://admin.shopify.com/store/g5d031-ir/settings/shipping

En la tarifa **Estándar** hay todavía una condición vieja de «gratis a partir
de 55 €». No hace daño —la de 39 € se aplica antes— pero deja dos líneas de
«Gratis» en el paso de pago cuando el carrito pasa de 55 €. Es cosmético.

---

## 4. Por qué no lo hago yo

No es pereza ni olvido: **está bloqueado desde aquí.**

- **Los textos de la portada** son campos del personalizador, y escribir en el
  tema publicado está prohibido por la herramienta con la que trabajo. Su propia
  documentación lo dice: los cambios de ficheros de tema solo se permiten en
  temas *no publicados*. Un tema no publicado no te sirve de nada, porque
  publicarlo también está bloqueado.
- **La política de envío** necesita el permiso `write_legal_policies`, que esta
  conexión no tiene. Intentado el 17/09: `Access denied for shopPolicyUpdate`.
- **La descripción de la tienda** no tiene mutación en la API de administración.

Los tres son límites reales, comprobados, no suposiciones.

---

## 5. La otra fecha que no se puede pasar

**Advanced está en promoción de 1 €/mes hasta ≈2 de diciembre de 2026.**
Confirma la fecha exacta aquí y apúntala:
https://admin.shopify.com/store/g5d031-ir/settings/plan

Ver `research/plan-advanced-promocion-2026-09-20.md`.


---

## 6. Lo hecho desde aquí el 20/09/2026 (y una trampa que costó un susto)

### Tema borrador con los textos corregidos

Escribir en el tema **publicado** está bloqueado, pero duplicarlo y escribir en
la copia **no**. Así que:

1. Se duplicó el tema vivo → `OnlineStoreTheme/204883591516`, sin publicar.
2. Se subió a esa copia el `templates/index.json` con los tres textos a 39 €.
3. Se comprobó en su vista previa real, no de memoria:
   `https://patitascalidas.com/?preview_theme_id=204883591516`
   Salen los tres a 39 € y ningún 55 € que venga del tema.

Publicar un tema también está bloqueado, y está bien que lo esté: eso lo decide
el dueño de la tienda. Es un botón.

### La tarifa vieja de 55 €: borrada, pero por el camino se rompió el envío

Esto conviene leerlo entero porque la trampa se puede repetir.

La condición de «gratis a partir de 55 €» no era una tarifa aparte: era un
**rango de precio** pegado a la tarifa «Estándar» de 6,99 €. La API la enseña
con un identificador falso, con una interrogación dentro:

```
gid://shopify/DeliveryMethodDefinition/1375216238940?source=RateRangeCondition&source_id=457161671004
```

- Borrarla como condición (`conditionsToDelete`) **dice que sí y no hace nada**.
  Sin error. Silencio. Si te fías del «sin errores», te crees que está hecho.
- Borrarla como método (`methodDefinitionsToDelete`) con ese identificador
  **borra la tarifa Estándar entera**, no solo el rango. Durante un minuto la
  tienda se quedó **sin ninguna forma de envío por debajo de 39 €**: cualquiera
  con un carrito pequeño no habría podido terminar la compra.

Se recreó al momento con los mismos valores (Estándar, 6,99 €, sin condiciones)
y se verificó con pedidos de prueba de verdad (`draftOrderCalculate`):

| Carrito | Destino | Qué sale | Correcto |
| --- | --- | --- | --- |
| 29,90 € | Valladolid | Estándar 6,99 € | sí |
| 43,80 € | Madrid | Envío gratis 0 € + Estándar 6,99 € | sí — el umbral de 39 € funciona |
| 59,80 € | **Palma** | Envío gratis 0 € + Estándar 6,99 € | sí — y Baleares se sirve |

**La regla que queda:** en las tarifas de envío, «sin errores» no es «hecho».
Se vuelve a leer el perfil después de cada cambio, y se prueba un carrito por
debajo y otro por encima del umbral. Si solo se prueba por encima, un envío
roto pasa desapercibido.

La tarifa Estándar tiene ahora un identificador nuevo:
`DeliveryMethodDefinition/1400203051356`.
