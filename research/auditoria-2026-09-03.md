# Auditoria completa del catalogo — 3 septiembre 2026

29 productos, 44 variantes. Revisados uno a uno: stock, peso, imagenes,
SKU, politica de inventario y estado de publicacion.

## De donde salieron los productos

La tienda se creo el **20 de agosto de 2026**. El **26 de agosto a las
16:16:43** se crearon 26 productos **en el mismo segundo**: eso no lo
teclea nadie, es una importacion en bloque de una app.

Apps instaladas con permiso de escritura sobre productos:

| App | Desarrollador | Alcance |
|---|---|---|
| Syncee AI Dropship | Syncee | productos, stock, pedidos, envios |
| Dropshipper-ai | Dropshipping.ai | productos, stock, envios |
| DSers-AliExpress | DSers | productos, pedidos, clientes, archivos |
| Cloud: Claude Ai Assistant | **Apporia** | leer pedidos, escribir productos |
| Messaging | Shopify | oficial |
| Shopify Claude Connector | Shopify | este asistente |

El catalogo lo importo una de las apps de dropshipping, con toda
probabilidad Syncee: los productos traen coste del proveedor, SKU del
proveedor y el texto original sin tocar.

**Eso explica el x1,59**: no era un multiplicador arbitrario, es la regla
de precios automatica de la app.

### Riesgo abierto

Si la regla de x1,59 sigue activa dentro de Syncee, **la proxima
sincronizacion puede revertir los precios nuevos**. Hay que cambiar la
regla a x2,5 o desactivar la sincronizacion de precios *dentro de la
app*: no se alcanza por API.

### Nota de seguridad

**"Cloud: Claude Ai Assistant" es de Apporia, no de Anthropic.** Usa el
nombre Claude pero es un tercero, y tiene permiso de escritura sobre
productos. Este asistente entra por "Shopify Claude Connector App", de
Shopify. Si no se instalo a conciencia, desinstalar.

## Corregido hoy

### Pesos de envio a 0 kg (19 variantes)

Era el fallo mas caro. Un producto a 0 kg cotiza como un paquete vacio:
el cliente paga una tarifa que no cubre el envio real y **la diferencia
la pone la tienda en cada pedido**.

Los productos de Nicole Lee si traian peso (0,227 a 2,846 kg). Los 11 de
"Hecho a mano", los 3 packs y los 5 nuevos iban a cero.

| Producto | Peso asignado |
|---|---|
| Cartera de piel de Ubrique | 0,15 kg |
| Cartuchera plana con roseton | 0,25 kg |
| Rinonera cuadrada 3 cremalleras | 0,30 kg |
| Rinonera plana de flecos | 0,30 kg |
| Bolso alargado cierre de bola | 0,50 kg |
| Jabones orientales (6 uds + caja) | 0,60 kg |
| Bolso cuadrado vacuno fez | 0,70 kg |
| Bolso cuadrado de cuerno grande | 0,90 kg |
| Bolso de flecos | 0,90 kg |
| Bolso mediano vacuno hilo blanco | 0,90 kg |
| Bolso de viaje grande | 1,80 kg |
| Set playa (pack) | 0,74 kg |
| Pack Nicole Lee | 1,23 kg |
| Set piel hecha a mano (pack) | 1,35 kg |
| Colgador de bolso (nuevo) | 0,08 kg |
| Organizador de fieltro (nuevo) | 0,25 kg |
| Kit cuidado del cuero (nuevo) | 0,35 kg |
| Bandolera antirrobo (nuevo) | 0,50 kg |
| Set organizadores maleta (nuevo) | 0,50 kg |

**Son estimaciones**, calculadas por comparacion con los pesos reales de
los Nicole Lee equivalentes y sumando componentes en los packs. Una
estimacion razonable es mucho mejor que un cero, que esta mal seguro.
Conviene ajustarlos con el peso real que indique el proveedor.

Verificado tras aplicar: **ningun producto activo queda a 0 kg.**

## Estado del resto (correcto, sin tocar)

- **Imagenes**: los 24 productos activos tienen entre 3 y 12 imagenes.
  Los 5 nuevos van en borrador sin imagenes, como debe ser.
- **Politica de inventario**: DENY en todas las variantes. No se puede
  vender lo que no hay: correcto para dropshipping.
- **Stock**: cifras coherentes con almacen real (4 a 132 unidades).
- **SKU**: todos los importados llevan referencia de proveedor. Los 5
  nuevos no tienen SKU todavia; se lo pondra la app al enlazarlos.

## Pendiente

1. **Regla de precios en Syncee.** Lo mas urgente: puede deshacer la
   subida a x2,5.
2. **Los packs no descuentan componentes.** Shopify no resta stock de
   las piezas al vender un pack. Hay que ajustarlo a mano o usar la app
   Shopify Bundles.
3. **Fotos de los packs**: cada uno muestra una sola pieza, no el
   conjunto.
4. **Dos borradores basura**: "Archival Ecru Hoodie" (marca ajena,
   texto en ingles, stock ficticio de 9.999 por variante) y "Pijama mono
   de monstruo" (coste 19,99 = precio 19,99, margen cero). No estan
   publicados, asi que no hacen dano; conviene borrarlos.
5. **Reglas de devolucion** (Ajustes > Politicas): no se leen por API.
   Comprobar que la ventana sea de 14 dias o mas.

---

# Cierre — todo publicado

## Packs: fotos completadas

Los 3 packs existentes mostraban **una sola pieza del conjunto**. Se les
han anadido las fotos de los componentes que faltaban, tomadas del CDN
de la propia tienda (Shopify las copia, no las enlaza, asi que no se
rompen).

## Tres packs nuevos, publicados y en venta

| Pack | PVP | Suelto | Ahorro | Coste | Margen | Stock |
|---|---|---|---|---|---|---|
| Regalo para el: cartera Ubrique + jabones | 26,90 | 31,80 | 4,90 | 12,75 | 53% | 20 |
| Set de viaje: bolso grande + rinonera | 114,90 | 134,80 | 19,90 | 55,00 | 52% | 4 |
| Duo de piel: bolso mediano + cartuchera | 122,90 | 142,80 | 19,90 | 57,75 | 53% | 6 |

**El stock de cada pack se ha limitado a la pieza mas escasa.** Del bolso
de viaje solo hay 5 unidades, asi que ese pack sale con 4, no con las 24
de la rinonera. Vender lo que no se puede servir es peor que no vender.

### Crear no es publicar (otra vez)

Los tres se crearon con status ACTIVE y aun asi salieron con
`resourcePublications: []`: invisibles en la tienda. Hizo falta
`publishablePublish` explicito sobre Tienda online y Shop. Confirmado
despues: los tres publicados en 2 canales.

## Verificacion final

**30 productos activos.** Comprobados uno a uno contra la API:

- Publicados en los canales de venta: **30 de 30**
- Con fotografias (entre 2 y 12): **30 de 30**
- Con precio: **30 de 30**
- Con peso de envio distinto de cero: **30 de 30**
- Con stock: **30 de 30**

## Lo unico que sigue en borrador

Los 5 productos de dropshipping (organizador de bolso, colgador, kit de
cuidado del cuero, bandolera antirrobo, organizadores de maleta). Tienen
titulo, texto, SEO, precio y peso; **les falta la fotografia**, y esa
tiene que venir del proveedor que va a servir el pedido, no de otro
sitio: ensenar una foto y enviar otro producto es una devolucion segura.

Se importan desde Syncee o DSers, que ya estan instaladas.

Mas los 2 borradores basura (Archival Ecru Hoodie, Pijama mono), que
siguen sin publicar a proposito.
