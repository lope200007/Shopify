# ¿Puede la tienda vender hoy? — 4 sept 2026

Comprobado contra la tienda en vivo, no contra la API de administración.

## Lo que sí funciona

| Comprobación | Resultado |
|---|---|
| Contraseña de acceso | **Desactivada** — la tienda es pública |
| Añadir al carrito | OK (lima 29,90 €, carrito 29,90 €) |
| Tarifa de envío a Valladolid | OK, 6,99 € (gratis desde 55 €) |
| Pantalla de pago | HTTP 200, carga completa |
| Métodos de pago activos | Visa, Mastercard, Amex, PayPal, Shop Pay, Apple Pay, Google Pay |
| Disponibilidad | Los **84 SKU** con `availableForSale: true`, sin seguimiento de stock: nada figura agotado |
| Páginas legales | Las 5 políticas publicadas |
| Plazos | 30 días naturales máximo, art. 66 bis TRLGDCU, declarado en la web |

**Técnicamente la tienda puede cobrar una compra ahora mismo.**

## Los tres motivos por los que aún no debe recibir tráfico

### 1. La tienda no cobra IVA

Un pedido borrador de prueba (una lima de 29,90 € a una dirección de Valladolid,
con 6,99 € de envío) devolvió:

```
subtotal 29,90 · envío 6,99 · IVA 0,00 · total 36,89 · taxLines: []
```

Cero. El artículo está marcado `taxable: true`, el mercado España existe y está
activo, y los precios son con IVA incluido — pero **no hay ningún tipo
impositivo configurado**, así que Shopify no desglosa nada.

Consecuencia: cada venta quedaría registrada con 0 € de IVA, mientras que a
Hacienda hay que declararle el 21% (de 29,90 €, son 5,19 €). Las facturas y los
informes saldrían mal desde el primer pedido.

Esto se configura en **Ajustes → Impuestos y aranceles**, y **requiere el NIF**:
es el mismo trámite que está fallando en la verificación. No son dos problemas,
es uno.

Relacionado: `taxShipping` está en `false`. El art. 78 de la Ley 37/1992 incluye
el porte en la base imponible, así que los 6,99 € también llevan IVA.

### 2. La portada dice algo que no es cierto

Sigue publicado *"Enviamos desde Europa"*. Todo el stock sale de almacenes
chinos vía YunExpress y CJPacket. Mandar gente a una portada con esa frase es
venderles bajo una afirmación falsa.

Arreglo: publicar el tema **"Mascotas - plazos corregidos"**. Comparados los dos
ficheros línea a línea: mismas 5 secciones, mismo orden, idénticos salvo esa
frase.

### 3. Un pedido no se podría servir

El monedero de CJ está a **0,00 €**. Si alguien compra hoy, se le cobra y no hay
con qué pagar el envío al proveedor.

## Orden recomendado

1. Resolver el NIF (el titular real, con su nombre legal completo)
2. Con el NIF, configurar el IVA al 21% y activarlo sobre gastos de envío
3. Publicar el tema corregido
4. Recargar el monedero de CJ
5. Formato de moneda: `39,90 €` en vez de `€39,90` (Ajustes → Datos de la tienda)
6. Bajar del plan Advanced

Los pasos 1 a 4 son bloqueantes. El 5 y el 6 no impiden vender.
