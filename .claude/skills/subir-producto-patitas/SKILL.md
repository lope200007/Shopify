---
name: subir-producto-patitas
description: Subir un producto nuevo a patitascalidas.com de punta a punta, sin cabos sueltos. Úsala SIEMPRE que se vaya a crear, publicar o revisar una ficha de producto, o cuando haya que comprobar que un producto se puede servir de verdad. Cubre CJ, Shopify, Google, TikTok, el vínculo con el proveedor y la verificación final.
---

# Subir un producto sin cabos sueltos

Escrita el 14/09/2026 a partir de errores reales que costaron un pedido. No es
teoría: cada regla de aquí viene de algo que se rompió.

## La regla madre

**Un producto no está subido hasta que se puede SERVIR.** Una ficha bonita que
no llega al proveedor es peor que nada: cobras y no entregas. El pedido #1001
llegó a CJ con importe 0, sin código postal, sin teléfono y sin transporte,
porque el producto no estaba vinculado. La ficha estaba perfecta.

## Datos fijos

- Tienda: `g5d031-ir` · patitascalidas.com · EUR · Europe/Madrid · solo España
- shopId de CJ: `2609031958293531800`
- Transporte por defecto: `CJPacket Eub` · CN → ES
- Canales que debe tener todo producto: **Tienda online, Shop, TikTok,
  Google & YouTube** (los 4)

## Los 9 pasos

### 1. Encontrar el producto en CJ

- **La búsqueda por texto de CJ no sirve**: devuelve cosas que no tienen nada
  que ver. Hay que buscar por `categoryId` del árbol de `/product/getCategory`.
  Las 68 categorías de mascotas con su id y su tamaño están en
  `research/cj-conteo-categorias-2026-09-08.json`.
- Límite duro: **1 petición por segundo**. Espaciado de 1.800 ms.
- `pageSize` máximo en `/shop/product/queryPage` y `/product/conn/connection`
  es **10**. Con más: `1600300 the max pageSize is 10`.

### 2. Medir el porte ANTES de decidir el precio

- El porte lo decide **el lado más largo de `variantStandard`**, no el peso.
- Más de 1 kg + batería → línea Sensitive/Liquid, más cara.
- Se mide con `/logistic/freightCalculate` a Madrid. Plazo real medido:
  CJPacket Ordinary 4–8 días + 1–3 de preparación.

### 3. Calcular el margen con la fórmula validada

```
margen = pvp/1.21 − coste_usd*0.92 − porte − (pvp*0.0175 + 0.25)
```

Validada contra una venta real: comisión estimada 0,72 € vs real 0,73 €.
Si el margen no llega a ~8 €, no compensa.

### 4. Crear la ficha en Shopify

- SKU propio con el patrón `PTC-XXXXX-01`. **Nunca el SKU de CJ en el código
  fuente de la ficha**: se ve desde fuera y regala el proveedor.
- Fotos reales del producto de CJ. Si la foto no coincide con el artículo,
  se anota el aviso en el metafield `abastecimiento.aviso_foto` y NO se sube.
- Descripción con el bloque "Antes de comprar": plazo real, para qué NO sirve,
  y advertencia si hay riesgo de talla.
- Categoría estándar de Shopify (no es lo mismo que la colección): alimenta
  impuestos y los feeds de Google y Meta.

### 5. Publicar en los 4 canales

`status: ACTIVE` **no basta**. Si `onlineStoreUrl` es `null`, el producto no
está publicado aunque figure activo. Hay que comprobar
`resourcePublicationsV2` y ver los 4 canales en `true`.

### 6. Meterlo en su colección

Ninguna ficha puede quedar huérfana. Si es de temporada (Halloween, Navidad),
va a la colección que se enciende y se apaga en su fecha.

### 7. Declarar la equivalencia SKU → vid en `scripts/cj/mapa.js`

Sin esto no se puede servir: CJ solo entiende su `vid` interno, no el SKU.
Si el `pid` no está en `proveedores/cj/`, se saca con
`/product/variant/queryByVid?vid=...`.

### 8. Vincular el producto en CJ

```bash
node scripts/cj/vincular.js            # simulación
node scripts/cj/vincular.js --ejecutar # crea los vínculos
```

**Requisito previo**: CJ tiene que tener el producto cargado. Si no lo tiene,
devuelve `410 Shop Product not exists`. No hay endpoint de API para lanzar la
sincronización (9 rutas probadas, todas `1600101 Interface not found`): la
pulsa Pablo en CJ → Products → Store Products → Sync.

**LOS PACKS NO SE PUEDEN VINCULAR.** El vínculo de CJ es uno a uno y un pack
son tres productos. Se sirven a mano. Hay 5.

### 9. VERIFICAR. Siempre. Esto no es opcional

**CJ miente.** Responde `200 Congratulation! Well done!` con `data:true` y no
guarda nada. De 74 envíos, 7 se perdieron en silencio. La única prueba válida
es volver a leer `/product/conn/connection` y comprobar que el
`platformProductId` está. `vincular.js` ya lo hace solo y reintenta.

Y el checkout se audita de verdad, no de oído:

```bash
node scripts/tienda/auditar-checkout.js
```

## Trampas de las herramientas

| Trampa | Realidad |
|---|---|
| La tienda devuelve 429 | Es el **User-Agent**, no la IP. Con el de Safari móvil responde 200. |
| `fetch` de Node da 403 en el checkout | Usar **curl**. |
| Ajustes del checkout por API | **No existen** en la Admin API. Solo desde el panel. |
| `appUninstall` | **No lleva argumentos**: desinstala la propia conexión de Claude. Nunca llamarla. |
| Merchant Center "Limitado" | Es por falta de GTIN. **No inventar EAN**: suspenden la cuenta. |
| Google & YouTube | Sostiene la verificación de Search Console. Si se desinstala, se pierde. |

## Lo que hay que decirle a Pablo, siempre

En español llano, sin tecnicismos. Si algo no se ha podido comprobar, se dice
—no se da por bueno. Y si me equivoqué antes, se corrige en una frase y se
sigue.
