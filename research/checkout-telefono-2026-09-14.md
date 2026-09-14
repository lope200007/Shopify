# Verificación: el teléfono es obligatorio en el checkout

**Fecha:** 14 de septiembre de 2026
**Resultado: SÍ, el teléfono es obligatorio en la dirección de envío.**

## Por qué hizo falta verificarlo a la fuerza

El pedido #1001 llegó a CJ sin teléfono del cliente. Sin teléfono el
transportista español no avisa ni entrega: el paquete se queda en delegación y
acaba volviendo.

Los ajustes de **Configuración → Pagar → Opciones del formulario** **no están
en la Admin API de Shopify**. Revisado el `QueryRoot` de la versión 2026-07: las
únicas consultas cercanas son `abandonedCheckouts`, `deliverySettings` y
`privacySettings`. No hay forma de leer ni escribir esa preferencia por API.

## Cómo se comprobó

Abriendo el checkout real como un cliente, sin crear ningún pedido:

1. `GET /` con cookies.
2. `POST /cart/add.js` con una variante real.
3. `GET -L /checkout` → redirige a `/checkouts/cn/<token>`.

El HTML (251 KB) trae la configuración del formulario en JSON incrustado.

**Dos trampas, las dos reales:**

- La tienda devuelve **429** a los User-Agent genéricos. Con el de **Safari
  móvil** responde 200. El bloqueo no era de la IP como se creyó al principio.
- **`fetch` de Node recibe 403** donde curl recibe 200 (huella del cliente TLS
  y orden de cabeceras). Por eso el script usa `curl`.

## La prueba

```
telefono OPTIONAL en billingAddressFormSettings
telefono REQUIRED en addressFormSettings
telefono REQUIRED en addressFormSettings (paises "ES")

Campo real del formulario de envio: OBLIGATORIO
```

Y el campo tal como se pinta en la página:

```html
<input name="phone" placeholder="Teléfono" required type="tel"
       aria-required="true" autocomplete="shipping tel-national">
```

- **Envío**: obligatorio, tanto en la configuración general como en el bloque
  específico de España.
- **Facturación**: opcional. Es lo normal y no afecta a la entrega.

## Para repetirlo cuando haga falta

```bash
node scripts/tienda/auditar-checkout.js            # variante por defecto
node scripts/tienda/auditar-checkout.js <variantId>
```

No crea pedidos ni necesita permisos de datos de pago.
