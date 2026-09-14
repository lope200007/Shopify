# Vincular el catálogo con CJ — estado al 14 de septiembre de 2026

## Por qué importa

El pedido #1001 llegó a CJ roto: importe 0, sin código postal, sin teléfono y
sin transporte elegido. La causa no fue el script de servir: fue que **ningún
producto de la tienda estaba vinculado con su producto de CJ**. Sin ese vínculo
CJ recibe la orden y no sabe qué artículo meter en la caja, así que la convierte
en una "solicitud de abastecimiento" que no sirve para nada.

Comprobado con la API:

```
GET /product/conn/connection?shopId=2609031958293531800
→ {"list":[],"total":0}
```

## Lo que ya está hecho

1. **Rascador de pared vinculado a mano** (3 variantes), y verificado:
   `cjProductId 2607280913391614600` ↔ `platformProductId 15811436642652`,
   transporte `CJPacket Eub`, CN → ES. Respuesta de CJ:
   `200 Congratulation! Well done!`

2. **`scripts/cj/vincular.js`**: hace lo mismo con todo el catálogo.
   - `node scripts/cj/vincular.js` → simulación, no toca nada.
   - `node scripts/cj/vincular.js --ejecutar` → crea los vínculos.
   - Pagina de 10 en 10 (el máximo de CJ; con más devuelve
     `1600300 the max pageSize is 10`).
   - Si el `pid` de CJ no está en los volcados locales, se lo pregunta a CJ con
     `/product/variant/queryByVid` y lo guarda en `.cj-pid-por-vid.json`.
   - Los packs los salta: un pack son tres productos de CJ y el vínculo es uno
     a uno, CJ no lo admite.
   - Respeta 1 petición por segundo (espaciado de 1,8 s).

3. **Informe de preparación** del catálogo (74 productos activos):
   - **67 listos para vincular enteros** (366 variantes con `vid` + `pid`).
   - **5 packs** que hay que servir a mano: baño y lluvia, aseo en casa,
     comer despacio, cachorro recién llegado, pack de coche.
   - **2 productos** (abrigo reflectante, plumífero) que sí tienen `vid` en
     `mapa.js` pero cuyo `pid` no estaba en `proveedores/cj/`: los resuelve ya
     el nuevo fallback contra la API.

## Lo que bloquea

CJ **solo tiene cargado 1 de los 74 productos** de la tienda:

```
GET /shop/product/queryPage?shopId=2609031958293531800  → total = 1
```

Y si se intenta vincular uno que CJ no ha cargado, lo rechaza:

```
POST /product/conn/connection  (Comedero rotativo)
→ {"code":410,"message":"Shop Product not exists"}
```

La app de CJ (`CJdropshipping: Much Faster`) **está instalada en Shopify y tiene
permiso `read_products`**, así que puede leer el catálogo entero. Lo que falta es
que alguien pulse la sincronización dentro de CJ. No hay endpoint de API para
lanzarla: probados y todos devuelven `1600101 Interface not found`:
`/shop/product/sync`, `/shop/sync`, `/shop/product/syncProduct`,
`/product/conn/sync`, `/shop/product/import`, `/shop/list`, `/shop/queryPage`,
`/shop/authorization/list`, `/shop/product/pull`.

## Lo que tiene que hacer Pablo (una vez)

1. Entrar en cjdropshipping.com con su cuenta.
2. Menú **Products → Store Products**.
3. Elegir la tienda **g5d031-ir** (patitascalidas.com) y pulsar **Sync**
   (sincronizar productos de la tienda). Tarda unos minutos.
4. Avisar. Entonces se ejecuta `node scripts/cj/vincular.js --ejecutar` y quedan
   los 67 vinculados de una vez.

En esa misma pantalla existe **Add Automatic Connection**, que intenta emparejar
por SKU. Es opcional: el script lo hace con los `vid` exactos, que es más fiable.

## Pendiente aparte

- Teléfono obligatorio en el checkout (o `TELEFONO_TIENDA` en `.env`): sin
  teléfono el transportista español no entrega.
- Los 5 packs no se pueden automatizar: cuando se venda uno hay que crear tres
  pedidos en CJ a mano.
