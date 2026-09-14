# Que fallo en el pedido #1001 y como no repetirlo

14 de septiembre de 2026. Primer pedido de la tienda (compra de prueba de un
familiar, cancelada despues). Llego a CJ **roto**. Esto es lo que pasó, medido
contra la API de CJ, no supuesto.

## Los cinco fallos, con la prueba delante

El pedido existe en CJ como `DP2609141437460648300`, ligado a `#1001`:

| Campo | Lo que llego | Lo que habia en Shopify |
| --- | --- | --- |
| Producto | **importe 0** — sin articulo asignado | `PTC-RASCPARE-01` |
| Codigo postal | **vacio** | 47012 |
| Telefono | **vacio** | (tampoco lo pidio el checkout) |
| Nombre | **"Cisco"** | Jeison Lopera |
| Transporte | **sin elegir** | — |
| Total a pagar | **nulo** | — |

Y ademas, la app genero una **solicitud de abastecimiento** inutil
(`CJSPU959037263`): le pidio a CJ que *buscase* un producto que CJ ya tiene
catalogado, con la foto de dos tablas de surf y "precio objetivo 19,90 $" —
que es el **PVP de la tienda**, no el coste. CJ la marco como
"Pedidos no validos".

## La causa

Los 74 productos se crearon por la API de Shopify, **no importandolos desde la
app de CJ**. La app no tiene forma de saber que producto suyo corresponde a
cada producto nuestro, asi que construye un pedido sin articulo y lo manda a
"buscar producto" en vez de a "servir pedido".

El resto de campos rotos (codigo postal, nombre) son cosecha de la app: los
datos estaban bien en Shopify.

## La decision: no usar la app de CJ para servir

Hay dos caminos y solo uno es fiable.

**La app de CJ** exigiria volver a vincular los 74 productos a mano dentro de
su panel, y aun asi seguiria mutilando el codigo postal y el nombre. Ya lo hizo
una vez.

**`scripts/cj/servir.ts`** lee el pedido de Shopify, resuelve el `vid` con
`mapa.js`, calcula el transporte mas barato con `freightCalculate`, valida los
campos obligatorios **antes** de mandar nada, y crea el pedido con `payType 1`
(enlace de pago) o `2` (monedero). Es nuestro y no se inventa nada.

**Se sirve con el script. La creacion automatica de pedidos de la app de CJ hay
que apagarla**, o las dos cosas competiran por el mismo pedido y volveran los
duplicados rotos.

## Lo que se ha endurecido hoy en el script

1. **`shippingZip` y `shippingPhone` pasan a ser obligatorios.** Antes se
   mandaban vacios si faltaban. Ahora el pedido no se crea y el script dice
   cual falta y por que.
2. **Telefono de respaldo** (`TELEFONO_TIENDA` en `.env`): si el cliente no
   deja telefono, se manda el de la tienda. CJ acepta un pedido sin telefono,
   pero **el transportista espanol no entrega sin un numero al que llamar**:
   el paquete se queda en delegacion y vuelve.
3. Mensajes de error que dicen que hacer, no solo que falta.

Compila limpio con `tsc --project tsconfig.json`.

## Lo que falta, y es de Pablo

1. **Apagar la creacion automatica de pedidos en la app de CJ.** Mientras siga
   encendida, cada venta generara otro pedido roto en paralelo.
2. **Pedir el telefono en el checkout.** Ajustes -> Pago -> datos de contacto:
   poner el telefono como **obligatorio**. Es la solucion de raiz; el respaldo
   del script es la red debajo.
3. **`TELEFONO_TIENDA`** en el `.env` de la maquina donde se ejecute.
4. **Credenciales de Shopify** en ese mismo `.env` (`SHOPIFY_SHOP` y el token
   de admin). El script las necesita; esta sesion en la nube no las tiene ni
   debe tenerlas.
5. **Una maquina encendida.** El sitio natural es el ordenador de Pablo, donde
   ya corre Claude en local con la tienda conectada.

## Como se sirve un pedido, a partir de ahora

    npm run servir                 # simulacion: dice que haria, no toca nada
    npm run servir -- --ejecutar   # crea el pedido en CJ de verdad

En modo `auto` (el de por defecto): si hay saldo en el monedero lo paga solo;
si no, crea el pedido y **imprime un enlace para pagarlo con tarjeta**. No hace
falta recargar para empezar.

El libro `.cj-pedidos.json` impide crear dos veces el mismo pedido, asi que se
puede lanzar cuantas veces haga falta sin riesgo de duplicar.

## Lo que nadie puede arreglar con codigo

El dinero del cliente entra en Shopify y no sale hasta el payout; CJ cobra el
mismo dia del pedido. Ese desfase es estructural. Se reduce poniendo los pagos
de Shopify en **diario**, y se cubre con un colchon pequeno que solo hay que
poner **una vez**: a partir del primer cobro, cada payout financia los pedidos
siguientes.
