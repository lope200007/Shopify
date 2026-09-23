# Plan para empezar a ganar dinero con anuncios en Meta — 23-09-2026

Pablo: "Analiza todo el proyecto, mira cómo generar dinero desde ya. Lo que
tengo pensado es publicidad en Meta. ¿O prefieres un solo producto para la
publicidad, que entren a comprar ese y la página les lleve a más productos?"

## Resumen

La idea del producto gancho es buena, con dos ajustes:

- el anuncio lleva a la ficha del producto, nunca a la portada;
- la ficha empuja hacia el pack, que es lo que deja dinero.

Antes de gastar un euro faltan tres cosas: que Meta pueda ver las ventas, un
vídeo real y dinero de caja preparado.

## Los datos de partida (medidos hoy)

| Dato | Valor | De dónde sale |
|---|---|---|
| Visitas reales en 30 días | 87 (móvil, España) | Analítica de Shopify; las 513 de escritorio de EE. UU. son robots y nuestras pruebas |
| Ventas reales | 0 | El #1001 es la prueba de un familiar, reembolsada |
| Instagram → portada | 40 visitas, **0 carritos** | Analítica, página de entrada |
| Instagram → ficha del rascador de pared | 5 visitas, **2 carritos** | ídem |
| Píxel de Meta en la web | **No hay** | Solo está el de TikTok (DAGQUG3C…) |
| Canal «Facebook e Instagram» en Shopify | **No instalado** | Canales: Tienda online, Shop, Point of Sale, TikTok, Google & YouTube |
| Vídeo real de los candidatos en CJ | **Ninguno** | `productVideo` vacío en los 7 consultados |
| Monedero de CJ | 0 $ | Simulación de pedido del 23-09 |
| Ganancia media de un artículo suelto | ~13 € | `asesor-ventas` |

## Lo que no se estaba viendo

1. **Meta no puede ver las ventas.**
   - Sin píxel, Meta no sabe quién compra y optimiza para clics baratos.
   - Tampoco puede volver a enseñar el producto a quien lo miró y no compró.
   - Se arregla instalando la app «Facebook e Instagram» de Meta en Shopify.
     Es gratis, se hace con la cuenta de Facebook de Pablo y trae el píxel, el
     envío de eventos desde el servidor y el catálogo.
2. **El anuncio vive del vídeo, y no hay ninguno real.**
   - Los vídeos que tenemos son fotos con zoom.
   - CJ no tiene vídeo de estos productos.
   - 702 tiendas venden la misma hamaca con las mismas fotos.
   - Un vídeo propio es lo único que nos distingue.
3. **Solo se puede anunciar lo que deja 25-30 € por pedido.**
   - Con 13 € de ganancia, cualquier venta que cueste más de 13 € en anuncios
     pierde dinero.
   - Los packs dejan 25-30 €.
4. **Portada no, ficha sí.** Los datos de arriba lo dicen solos.
5. **Con poco presupuesto, Meta no aprende a buscar compradores.**
   - Necesita ventas para aprender.
   - La guía de la habilidad `meta-ads-strategy` pide 2-3 veces el coste por
     venta al día para optimizar por compra: 60-90 €/día.
   - Con 10-15 €/día hay que optimizar por «añadir al carrito», que ocurre
     más veces.
6. **Caja.**
   - Meta cobra a la tarjeta y cada venta hay que pagarla en CJ antes de que
     Shopify pague.
   - Monedero de CJ a 0 $.
   - Un pago fallido en Meta puede cerrar la cuenta publicitaria para siempre
     (guía de la habilidad). Mejor tarjeta de crédito, con saldo de sobra.
7. **Fechas.**
   - Plazo de entrega de 8-15 días: para Navidad, el último pedido es a
     primeros de diciembre.
   - La promoción de Shopify Advanced acaba hacia el 2 de diciembre (384 €/mes
     después). La prueba tiene que dar respuesta antes.
8. **Riesgos que rompen la primera venta.**
   - El comedero rotativo sigue publicado y CJ no lo puede enviar a España.
   - Lo fiscal (IVA/IOSS con la gestoría) sigue pendiente.

## Qué producto usar de gancho

| Candidato | Ganancia por pedido | Frente a Amazon | Temporada | Imagen que se entiende en 1 s |
|---|---:|---|---|---|
| **Hamaca de radiador → Pack gato en invierno** | 16,40 € sola / **29,71 € pack** | El trío no lo vende nadie junto | **Oct-feb, ahora** | Gato dormido colgado del radiador |
| Pack de coche | 28,15 € | No comparable | Todo el año / viajes de Navidad | Menos inmediata |
| Mochila de gato | 22-25 € | En la media (26-49 €) | Todo el año | Buena |
| Rascador de pared | 14-17 € | Amazon más barato | Todo el año | Único con carritos reales (2 de 5) |

**Elegido: hamaca de radiador como anzuelo, pack de invierno como venta.**

Ya hecho el 23-09-2026:
- Las fichas de la hamaca, del saco cueva y de la manta enlazan ahora al pack,
  con «66,90 € en vez de 79,70 €, te ahorras 12,80 € y el envío sale gratis».
- Comprobado en la web publicada: cada texto es idéntico al de antes más el
  bloque nuevo.

## Las tres fases

### Fase 0 — preparar (esta semana)

Lo hace Pablo:
1. Instalar la app «Facebook e Instagram» en Shopify con su cuenta de Facebook
   y su Instagram de empresa.
2. Muestra para grabar:
   - una hamaca (unos 13 € en CJ) o el pack (unos 24 €);
   - necesita saldo en CJ.
   - Si no hay gato en casa: regalar una hamaca a una cuenta de gatos
     española a cambio de un vídeo y del permiso para usarlo como anuncio
     (anuncios de colaboración de Meta).

Lo hago yo:
1. Comprobar que el píxel manda ver producto, añadir al carrito y compra.
2. Cinco textos de anuncio y cinco guiones de vídeo de 15 segundos.
3. Repasar la ficha del pack y la de la hamaca.

### Fase 1 — prueba (7-10 días, tope 100-150 €)

- Campaña de ventas optimizando por **añadir al carrito**, España, sin
  segmentar.
- Anuncios:
  - tres a cinco vídeos;
  - todos a la ficha de la hamaca;
  - la ficha empuja al pack.
- Presupuesto: 3-5 €/día los tres primeros días (cuenta nueva), luego
  10-15 €/día.
- Reglas de corte:
  - Tras 30 €, si casi nadie hace clic: el vídeo no engancha. Se cambia el
    vídeo, no el producto.
  - Tras 60 €, clics pero ningún carrito: falla la ficha o el precio. Se para
    y se revisa.
  - Carritos baratos y alguna venta: fase 2.

### Fase 2 — escalar lo que funcione

- Optimizar por **compra**.
- Subir el presupuesto un 10-15 % cada 48 horas mientras cada venta cueste
  menos de ~20 €.
- Encender el anuncio de catálogo para quien vio productos y no compró.

## Lo que decide Pablo

1. ¿Hamaca de radiador + pack de invierno como gancho?
2. ¿Muestra para grabar: hamaca (≈13 €) o pack (≈24 €)?
3. ¿Tope de la prueba: 100-150 € en 7-10 días?
4. ¿Hay gato en casa o buscamos una cuenta de gatos para colaborar?
5. El comedero rotativo: ¿se despublica?
