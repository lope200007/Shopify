# Configuracion de la tienda — auditoria y arreglos, 3 septiembre 2026

## Lo que estaba bien (me equivoque al principio)

Dije que habia dos tarifas de envio en conflicto para Espana, 6,99 y
0,00. **Es falso.** Al mirar el detalle, la de 0,00 lleva la condicion
`TOTAL_PRICE >= 55`: es envio gratis a partir de 55 EUR, bien puesto.

El perfil general es correcto:

| Zona | Tarifa |
|---|---|
| Espana peninsular | 6,99 EUR, gratis desde 55 EUR |
| Union Europea | 8,99 EUR |
| Internacional | 12,99 EUR |

## El problema real de envios

Las apps crearon **perfiles de envio propios por proveedor**, y esos si
van a cero sin condicion:

| Perfil | Zona | Tarifa |
|---|---|---|
| Hecho a mano | Espana, Portugal, Francia | 0,00 sin minimo |
| Grozavu | Europa, Norteamerica, Sudamerica | 0,00 sin minimo |
| Dropshipper-AI | Todo el mundo | 0,00 sin minimo |
| Nicole Lee | Espana, Portugal | 6,00 |

Un producto usa el perfil de su proveedor, no el general. Consecuencias:

1. La cartera de 19,90 viaja gratis a Espana sin minimo.
2. Si el cliente mezcla un "Hecho a mano" con un Nicole Lee, Shopify
   **suma las tarifas de ambos perfiles** y sale un total incoherente.

**No se tocan todavia.** Al archivar los bolsos, esos perfiles se quedan
sin productos y dejan de aplicar solos. Borrarlos ahora es pelearse con
las apps, que los recrearian.

## Fallos que solo puede arreglar el titular

1. **Pasarela de pago.** `supportedDigitalWallets` esta vacio, lo que
   apunta a que no hay pasarela activa. Sin ella la tienda no cobra ni un
   pedido. **Verificar antes que nada.**
2. **IVA sobre el envio.** `taxShipping` esta en `false`. En Espana el
   transporte forma parte de la base imponible (art. 78 de la Ley
   37/1992). Ajustes > Impuestos > "Cobrar impuestos sobre las tarifas
   de envio". No se puede cambiar por API.
3. **Proteccion por contrasena.** La tienda esta publica mientras se
   reconstruye. Conviene activarla hasta terminar.

## Arreglado hoy

### Paginas creadas y publicadas

- **Quienes somos** — sin humo: tienda pequena, proveedores europeos,
  responde una persona.
- **Preguntas frecuentes** — envios, devoluciones, garantia de 3 anos,
  pago, IVA incluido.
- **Envios y entregas** — tabla de tarifas, plazos, aduanas fuera de la
  UE, que hacer si llega danado.

### Pie de pagina

Antes solo tenia "Buscar". Las cinco politicas legales existian pero
**no estaban enlazadas en ningun sitio**, lo que incumple la LSSI.
Ahora lleva las tres paginas nuevas, Contacto y las cinco politicas.

## La portada: dos fallos

1. **Texto de relleno de la plantilla.** "Prestige ofrece prendas que
   trascienden lo comun, fusionando comodidad y estilo con un toque
   audaz y ludico." No dice nada, y habla de "prendas".

2. **La seccion de producto destacado apunta a
   `pijama-mono-de-monstruo-boca-grande-para-adultos`**, que es un
   BORRADOR sin publicar y con margen cero (coste 19,99 = precio 19,99).
   La portada destaca un producto que nadie puede comprar.

El tema publicado no se puede editar por API, asi que se trabaja sobre
una copia, **"Helio - reconstruccion mascotas"**, que el titular publica
cuando este revisada.

---

# La portada era una demo del pijama entera

No era solo la seccion de producto destacado. Al bajar el
`templates/index.json` completo aparecio el alcance real: **de las seis
secciones de la portada, tres estaban construidas alrededor del
`pijama-mono-de-monstruo`**, un borrador sin publicar con margen cero.

| Seccion | Que conten1a |
|---|---|
| `featured-product-information` | Producto destacado = el pijama (borrador) |
| `section_aweKy6` (imagen + texto) | Imagen enlazada al pijama, titulo "pijama con caracter", texto sobre "algodon organico" y "rutina nocturna", boton "Ver detalles" al pijama |
| `carousel_Bqp4tA` | Tres tarjetas del pijama: "tejido natural", "ajuste relajado... confort nocturno", "cuidado sencillo... lavado a maquina" |

Mas los dos textos de relleno de la plantilla ("Prestige ofrece prendas
que trascienden lo comun...").

## Portada reconstruida

Se trabajo sobre la copia **"Helio - reconstruccion mascotas"** porque el
tema publicado no admite escritura por API.

Quedan tres secciones:

1. **Cabecera** — "Todo para tu perro, elegido de uno en uno." Explica el
   criterio (no subimos catalogos enteros) y el plazo real (Europa, dias
   no semanas). Boton a la coleccion.
2. **Confianza** — 14 dias de desistimiento, 3 anos de garantia, envio
   gratis desde 55 EUR, y que contesta una persona. Boton a Preguntas
   frecuentes.
3. **Lista de productos** — ampliada de 3 a 8 productos en 4 columnas,
   con encabezado "Lo que tenemos ahora".

Verificado tras subir: `templates/index.json` pasa de 9.730 a 8.116
bytes, cero coincidencias de "pijama", "monstruo", "nocturna", "algodon
organico" ni "trascienden", y el unico enlace apunta a
`shopify://collections/all`, que existe.

**El tema copia esta SIN PUBLICAR.** Para que estos cambios se vean hay
que publicarlo desde Tienda online > Temas. Se deja asi a proposito: lo
revisa el titular antes de que sustituya al que esta vivo.

Nota menor: quedo un `snippets/prueba-acceso.liquid` vacio de la prueba
de escritura. No lo renderiza nada. Borrarlo por API esta bloqueado por
politica de seguridad (con razon: bloquea todo borrado de archivos de
tema); se quita desde el admin si molesta.

---

# Remate final de configuracion — 3 septiembre 2026

## SEO de colecciones

Las 3 colecciones de mascotas nacieron con SEO. **Las 7 heredadas no
tenian ninguno**: titulo y descripcion en blanco. Completadas todas con
titulo, meta descripcion y texto de coleccion:

Bolsos, Bandoleras, Rinoneras y carteras, Complementos, Hecho a mano,
Packs y sets, Ropa.

Solo queda sin SEO "Pagina de inicio", que es una coleccion de sistema y
no se indexa como tal.

## Menu principal

Antes: Inicio, Tienda, Packs y sets, Hecho a mano, Contacto. Cinco
entradas planas, sin acceso a la mayoria del catalogo.

Ahora, con submenu:

- Inicio
- Tienda
  - Bolsos
  - Bandoleras
  - Rinoneras y carteras
  - Complementos
- Hecho a mano
- Packs y sets
- Quienes somos
- Contacto

## Coherencia de la portada

La portada reconstruida decia "Todo para tu perro", pero **el catalogo
vivo son bolsos**: mascotas esta bloqueado por las fotos. Publicar el
tema asi habria dejado un titular que no corresponde con lo que se
vende.

Reescrita con texto **cierto hoy**: "Piel hecha a mano en Espana, y
complementos elegidos de uno en uno". Asi el tema se puede publicar ya.
El titular de mascotas entra cuando esos productos esten vivos.

## Por que NO se han archivado los bolsos todavia

Estaba previsto archivarlos al montar el catalogo de mascotas. **No se
hace, y el motivo importa**: los cinco productos de mascotas siguen en
borrador porque les faltan las fotos.

Archivar los 30 bolsos ahora dejaria la tienda con **cero productos
publicados**. Una tienda vacia es peor que una descolocada.

El archivado se hace en cuanto los productos de mascotas esten
publicados con foto.

## Estado verificado

| Elemento | Estado |
|---|---|
| Politicas legales | 5 publicadas, enlazadas en el pie |
| Paginas | 4 publicadas (Contacto, Quienes somos, FAQ, Envios) |
| Colecciones | 10 con SEO completo, publicadas |
| Menu principal | 6 entradas + 4 subentradas |
| Menu de pie | 9 entradas |
| Productos activos | 30, todos con foto, precio, peso y stock |
| Productos en borrador | 10 (5 mascotas, 3 complementos, 2 basura) |
| Tema reconstruido | Listo, SIN PUBLICAR |
