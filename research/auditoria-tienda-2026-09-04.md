# Auditoría profunda de la tienda — 4 sept 2026

Revisión completa tras cerrar la subida de productos. Método: skill
`merchandising-rules` para el orden de colecciones, skill `seo-ecommerce` para
la checklist de fichas, y verificación contra la tienda **en vivo**, no contra
la API.

## Estado final

29 productos: **25 activos**, 2 en borrador, 2 archivados.
Cero imágenes sin texto alternativo. Cero medios sin procesar. Cero fichas por
debajo de 189 palabras. Cero márgenes negativos. Las 5 políticas legales
publicadas. Las 4 páginas informativas en 200.

## Hallazgo grave: dos productos que no se podían entregar

`freightCalculate` devolvía **cero opciones de envío** a España para el comedero
rotativo y la bola dispensadora de premios. Consultando el stock:

- Comedero rotativo → único stock en el **almacén de Reino Unido** (40 uds)
- Bola dispensadora → único stock en el **almacén de Estados Unidos** (193 uds)

Ninguno tiene stock en China, y CJ no tiene ruta GB→ES ni US→ES. Un pedido
habría entrado, cobrado, y no se habría podido servir. **Los dos eran de los
primeros productos de la tienda y llevaban semanas publicados.**

Pasados a borrador y sustituidos por equivalentes con stock chino verificado
(19 rutas de envío cada uno):

| Retirado | Sustituto | PVP | Margen |
|---|---|---|---|
| Comedero rotativo antivoracidad | Comedero puzzle de tres capas giratorias | 29,90 | 12,27 € |
| Bola dispensadora de premios | Tentetieso dispensador de premios | 19,90 | 8,04 € |

**Regla nueva: antes de publicar cualquier producto, comprobar que
`freightCalculate` devuelve al menos una ruta CN→ES.** Sin ruta, no hay
producto.

## Hallazgo grave: el coste no incluía los portes

Los 17 productos anteriores a las 12:43 tenían `unitCost` = precio de compra en
CJ **sin portes**. El margen que mostraba Shopify era falso por un factor de
dos o tres. Ejemplos reales:

| Producto | coste registrado | coste real | margen real |
|---|---|---|---|
| Toalla S (9,90) | 1,53 € | 6,06 € | **2,12 €** |
| Manopla (14,90) | 3,38 € | 9,70 € | **2,61 €** |
| Colchoneta coche (29,90) | 7,34 € | 15,29 € | 9,42 € |
| Pack baño y lluvia (39,90) | 11,30 € | 16,58 € | 16,40 € |

51 costes corregidos con portes reales de `freightCalculate`. El pack se calculó
con los tres artículos en un solo envío (8,89 USD de bienes + 9,13 de portes),
no sumando tres envíos por separado.

Con los costes reales, nueve artículos quedaban por debajo del umbral de
viabilidad. Reajustados sin salirse del precio de mercado español:

toalla 9,90→12,90 / 12,90→15,90 / 16,90→19,90 · manopla 14,90→16,90 ·
cinturón 11,90→14,90 · peluche 14,90→16,90 · alfombrilla 12,90→14,90 ·
comedero 2en1 19,90→22,90 · botón 12,90→14,90 · bozal 12,90→14,90 ·
manta XL 36,90→39,90

## Cuatro productos duplicados, tres creados por mí el mismo día

Escribí en un commit que meter una alternativa barata junto a un ancla
canibaliza el margen — y acto seguido lo hice, por no revisar el catálogo antes
de subir.

| Duplicado | Resolución |
|---|---|
| Lima de uñas 19,90 vs 29,90 | Archivada la barata: sin control de velocidad ni tope de tamaño, que es justo la pieza de seguridad |
| Cepillo autolimpiable 14,90 vs 19,90 | Archivado el viejo: mismo producto sin pulverizador y con la mitad de margen |
| Tres alfombrillas de lamer | **Borrada la que subí hoy**: 3 € más cara que la existente y sin ventosas ni cuatro texturas. El error era mío, no del catálogo |
| Funda de asiento 29,90 vs 34,90 | Productos distintos. Renombrada la vieja a "Colchoneta acolchada": una es cama, la otra cubre el asiento entero |

## Orden de las colecciones

Todas estaban en "más vendidos". Con cero ventas eso es orden arbitrario, así
que los artículos de 4 € de margen salían por encima de los de 13 €. Pasadas a
manual y ordenadas por margen de contribución real. En Lluvia y barro manda la
temporada: el chubasquero primero, que es lo que se busca en octubre.

## Perfiles de envío huérfanos

Cuatro perfiles de apps desinstaladas (Dropshipper-AI, Nicole Lee, Hecho a mano,
Grozavu), todos con 0 variantes, dos de ellos con **envío gratis a todo el
mundo**. Vacíos no hacían daño, pero cualquier app que asignase un producto lo
habría enviado gratis a Australia. Eliminados los cuatro.

El perfil general está bien: 6,99 € a España peninsular, **gratis desde 55 €**
(una sola tarifa con condición, no dos tarifas duplicadas como parecía a primera
vista), 8,99 € UE, 12,99 € resto.

## SEO

Cuatro títulos por encima de 60 caracteres (Google los corta) y tres
descripciones por encima de 155. Corregidos. El resto de la checklist de
`seo-ecommerce` ya se cumplía: alt descriptivo en las 130 imágenes, más de 3
fotos por producto, H2 estructurados, descripción propia y no copiada del
fabricante.

Corregida también la URL de la manopla, que era
`/products/toalla-de-secado-de-microfibra-para-perros` — la dirección decía
toalla y el producto es una manopla.

## Lo único que no puedo arreglar yo

**La portada sigue diciendo "Enviamos desde Europa" y es falso.** Todo el stock
sale de almacenes chinos vía YunExpress y CJPacket. El conector bloquea escribir
en el tema publicado, y hace bien.

La corrección ya está preparada en el tema **"Mascotas - plazos corregidos"**.
Comparados los dos ficheros línea a línea: mismas 5 secciones, mismo orden,
idénticos salvo esa frase. Publicarlo no pierde nada.

## Acciones que requieren al usuario

1. **Publicar el tema "Mascotas - plazos corregidos"** — quita la afirmación falsa
2. **Activar el IVA sobre gastos de envío** (Ajustes → Impuestos). Cobramos 6,99 €
   por debajo de 55 € y el art. 78 de la Ley 37/1992 incluye el porte en la base
   imponible. Hoy está desactivado
3. Correo de contacto: `vicgalindobarber@gmail.com` es una dirección personal
4. Cambiar el nombre de la tienda, que sigue siendo "Prestige"
5. Bajar del plan Advanced (352 €/mes de más)
6. **Revocar el token de CJ**, que pasó por el chat
7. Revisar la app "Cloud: Claude Ai Assistant" de **Apporia** — usa el nombre
   Claude, no es de Anthropic, y tiene permiso `write_products`
