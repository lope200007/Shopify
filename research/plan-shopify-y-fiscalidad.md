# Dos hallazgos de la auditoria de ajustes — 4 septiembre 2026

Salieron de consultar `shop` por API, no de suponer.

## 1. Estas en el plan Advanced. Es el mas caro de los tres.

```
shop.plan.displayName = "Advanced"
```

Precios de Shopify en España (2026, IVA incluido):

| Plan | Mensual | Anual (equiv./mes) | Comision con Shopify Payments |
|---|---|---|---|
| Basic | 32 EUR | 24 EUR | desde 2,1% + 0,30 |
| Grow | 92 EUR | 69 EUR | desde 1,8% + 0,30 |
| **Advanced** | **384 EUR** | **289 EUR** | desde 1,6% + 0,30 |

**Diferencia con Basic: 352 EUR al mes pagando mensual (4.224 EUR al ano),
o 265 EUR al mes pagando anual (3.180 EUR al ano).**

### Por que esto importa ahora

Advanced solo se paga a si mismo por una via: la comision es medio punto
mas baja (1,6% en vez de 2,1%). Para que ese medio punto cubra los 352 EUR
de diferencia hacen falta:

```
352 / 0,005 = 70.399 EUR de ventas AL MES
```

Con pago anual, 53.000 EUR al mes.

**Ventas actuales de la tienda: 0 EUR. Pedidos: 0. Y todavia no hay
pasarela de pago, asi que no puede haberlos.**

No hay ninguna funcion de Advanced que necesitemos hoy. Sus ventajas
reales son informes avanzados, hasta 15 cuentas de personal y precios
internacionales por mercado. Nada de eso aplica a una tienda de cinco
productos sin trafico.

### Que hacer

Bajar a **Basic** en Ajustes → Plan. Se puede volver a subir en cualquier
momento y sin perder nada: los datos, productos y pedidos se conservan.
Cuando la tienda facture 50.000 EUR al mes, subir sale a cuenta. Hoy no.

**Antes de nada, comprueba si estas en periodo de prueba.** Si aun estas
en la prueba gratuita no se esta cobrando nada, pero al terminar entraria
directo a 384 EUR. La pantalla de Ajustes → Plan lo dice.

Esto lo tienes que hacer tu: cambiar de plan no se puede por API.

## 2. No se cobra IVA sobre los gastos de envio

```
shop.taxShipping = false
shop.taxesIncluded = true   (esto si es correcto para España)
```

En España **el transporte forma parte de la base imponible del IVA**
(Ley 37/1992, art. 78). Si cobras 4,95 EUR de envio, esos 4,95 llevan su
21% dentro igual que el producto.

Con la casilla desactivada, las facturas salen con la base imponible mal
calculada. Con cero pedidos no ha pasado nada todavia, pero en cuanto haya
uno se convierte en un error contable que hay que rectificar.

Busque la mutacion para arreglarlo por API y **no existe**: es un ajuste
solo del panel.

**Ajustes → Impuestos y aranceles → activar "Aplicar impuestos a los
gastos de envio".**

## Fuentes

- https://finom.co/es-es/blog/shopify-precios/
- https://wardem.com/blog/shopify-precios/
- https://theatlas.es/blog/cuanto-cuesta-tienda-shopify-2026/
