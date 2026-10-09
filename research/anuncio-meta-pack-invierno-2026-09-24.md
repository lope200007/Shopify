# Anuncio de Meta listo para montar — Pack el gato en invierno (24-09-2026)

Lo monta Pablo en el Administrador de anuncios: la app de Meta está en modo desarrollo
y la API no deja crear anuncios. Se deja **apagado** hasta que Pablo diga «sí».

## Estado a 09-10-2026

Pablo: «este producto va a ser la publicidad para nuestra tienda; ahora está en
juego que la gente entre y compre».

**Lo comprobado hoy, como un cliente desde el móvil y sin crear pedidos:**

- **Ficha:** carga en 0,97 s, con el píxel de Meta y los botones de pago rápido.
- **Carrito:** suma 66,90 €.
- **Envío** (API pública de la tienda, `cartCreate` con dirección):
  - Madrid y Palma: «Envío gratis».
  - Canarias, Francia, Portugal y Alemania: ninguna opción. La tienda solo envía a
    la península y Baleares.
- **Código BIENVENIDA10** (aviso de la cabecera): funciona y deja el pack en 60,21 €.

**El dinero, hoy:**

- **Coste real en CJ:** 29,47 €. Productos 10,73 $ × 1,21 + envío conjunto 19,03 $ (YunExpress, 8-15 días), × 0,92.
- **Ganancia por venta:** 24,45 € sin código y **19,03 € con BIENVENIDA10**. Casi todos lo usarán, así que cada venta tiene que costar menos de unos 19 € en anuncios.
- **Existencias:** las tres piezas tienen unidades en China (hamaca 40.000, saco 30.000, manta 6.053).

**Fotos cambiadas:**

- **El fallo:** la foto principal de la ficha y estas imágenes del anuncio enseñaban un saco en dos colores (gris con un cachorro y marrón con un gatito) cuando el pack lleva uno gris. Además, en la ficha la hamaca salía tan recortada que no se veía el radiador.
- **La foto principal nueva:** la manta con el gato arriba; abajo, la hamaca colgada del radiador y el saco gris solo.
- **El anuncio:** rehecho con las mismas tres fotos, en `assets/anuncios/2026-10/`. Copia en Archivos de Shopify:
  - https://cdn.shopify.com/s/files/1/1047/3475/3116/files/anuncio-pack-invierno-4x5-v2.jpg?v=1791541653
  - https://cdn.shopify.com/s/files/1/1047/3475/3116/files/anuncio-pack-invierno-9x16-v2.jpg?v=1791541653
  - https://cdn.shopify.com/s/files/1/1047/3475/3116/files/anuncio-pack-invierno-1x1-v2.jpg?v=1791541653
- **Las imágenes de `assets/anuncios/2026-09/` ya no se usan.**

**Lo que falta, todo de Pablo:**

1. **Saldo pendiente de la cuenta de anuncios:** Pablo dice que lo pagó el 09-10. No se ha podido comprobar desde aquí.
2. **Acceso a la API de Meta:** sigue «API access blocked» desde el 28-09, y no hay ninguna clave de Meta en el entorno.
   - El primer paso es que Pablo mande la captura del aviso de https://developers.facebook.com/apps/4222313344728923/dashboard/
   - Después, la app tiene que pasar a «en vivo», y la clave se guarda en el entorno como `META_ADS_TOKEN`.
3. **Presupuesto:** propuesto 5 €/día tres días, luego 10 €/día, con un tope de 100 €.

## Antes (bloqueos, los quita Pablo)
1. Pagar el saldo pendiente de 3,53 € (cuenta `act_381307905740791`, estado 3 = pago
   pendiente).
2. Terminar la app «Facebook e Instagram» de Shopify (instalada; el píxel aún no sale en
   la web: solo carga el de TikTok). Conjunto de datos nuevo «Patitascalidas»,
   compartir datos «Máximo».

## Imágenes (`assets/anuncios/2026-09/`, sustituidas el 09-10: ver arriba)
- `pack-invierno-4x5.jpg` 1080 × 1350 — feed de Facebook e Instagram.
- `pack-invierno-9x16.jpg` 1080 × 1920 — historias y reels (franjas crema arriba y abajo,
  que es donde la interfaz tapa).
- `pack-invierno-1x1.jpg` 1080 × 1080 — columna derecha y buscador.
Origen: `assets/redes/2026-09/pack-invierno-anuncio.jpg` (saco cueva arriba, hamaca
blanca y manta abajo; la hamaca en blanco porque es la que lleva el pack).

## Enlace
https://patitascalidas.com/products/pack-gato-invierno?utm_source=meta&utm_medium=paid&utm_campaign=pack-invierno-prueba
(comprobado: 200)

## Textos (todos salen de la ficha; nada inventado)
Texto principal A:
> Tu gato ya ha elegido su sitio: el más caliente de la casa. 🐾
> Este pack le da tres, y ninguno lleva enchufe:
> • Hamaca de radiador: duerme justo donde sube el calor
> • Saco cueva: entra, se da la vuelta y se queda tapado
> • Manta autocalentable: le devuelve su propio calor
> 66,90 € en vez de 79,70 € por separado. Envío gratis.

Texto principal B:
> ¿Tu gato duerme encima del radiador haciendo equilibrios?
> Dale una hamaca que se cuelga del radiador, sin tornillos. Y para cuando quiera
> esconderse, un saco cueva y una manta que le devuelve su propio calor.
> Pack de invierno: 66,90 € (te ahorras 12,80 €). Envío gratis.

Texto principal C:
> Tres sitios calientes para tu gato, sin cables ni enchufes.
> Hamaca de radiador + saco cueva + manta autocalentable.
> 66,90 € el pack · te ahorras 12,80 € · envío gratis.

Títulos: «Pack gato en invierno: 66,90 €» · «Tres camas calientes, sin enchufe» ·
«Te ahorras 12,80 €»
Descripción: «Envío gratis · 14 días para devolver»
Botón: Comprar

## Ajustes
- Objetivo: **Ventas**. Evento: **Añadir al carrito** (con 5-10 €/día no hay ventas
  suficientes para que Meta aprenda con «Compra»).
- Presupuesto del conjunto de anuncios: 5 €/día los 3 primeros días, luego 10 €/día.
  Tope propuesto de la prueba: 100 € (lo decide Pablo).
- Ubicación: España, **excluyendo Canarias, Ceuta y Melilla** (la tienda no envía allí).
- Edad 25-65+, todos los sexos, público Advantage+ activado.
- Ubicaciones: Advantage+ (automáticas).
- Identidad: página Patitascalida + Instagram @patitascalidas_.
- Seguimiento: conjunto de datos «Patitascalidas».
- Al terminar: **publicar y apagar el interruptor de la campaña** hasta el «sí».
- La campaña vacía del 23-09 («Hamaca radiador → pack invierno…», en pausa, 0 €) no se usa.

## Reglas de corte (plan del 23-09)
- 30 € sin apenas clics → cambiar la imagen, no el producto.
- 60 € con clics y 0 carritos → parar y revisar ficha o precio.
- Carritos baratos y alguna venta → optimizar por compra y subir 10-15 % cada 48 h
  mientras cada venta cueste menos de ~20 €.

## Estado comprobado a las 11:00 del 24-09
- **Píxel instalado y funcionando:** `1858409395124273`, «Shopify: g5d031ir …'s pixel» (lo creó
  la app de Shopify a las 10:44). Ya recibe visitas. En el anuncio, el conjunto de datos
  se llama así, no «Patitascalidas».
- **Productos en Meta:** 136 de 136 activos están en el canal «Facebook & Instagram»
  (`Publication/371869319516`). **Ojo: `autoPublish` está apagado**: cada producto nuevo hay
  que publicarlo también en ese canal (son 5 canales ahora, no 4).
- **Cuenta de anuncios:** sigue con **3,53 € pendientes** (estado 3). Sin pagar eso no sale nada.
- El píxel **no aparece asignado** a la cuenta de anuncios `act_381307905740791` desde la API
  (la clave no tiene permiso de negocio para verlo todo). Si al crear el anuncio no sale el
  conjunto de datos, asignarlo en el Administrador de eventos.
