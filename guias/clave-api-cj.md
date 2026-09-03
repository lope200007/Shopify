# Sacar la clave de API de CJ (2 minutos)

## Por que la necesito

La app de CJ ya esta instalada en Shopify y autorizada. Pero la app solo
funciona a mano, desde el navegador: yo no puedo entrar en ella.

La web de CJ me bloquea el acceso automatico (me redirige a una pagina de
verificacion anti-robots). Su **API oficial si me responde**. Lo he
comprobado: contesta correctamente, solo pide una credencial.

Con esa credencial obtengo, sin que tu tengas que copiar nada a mano:

- El **coste real** de cada articulo (ahora mismo trabajo con estimaciones mias).
- **Todas las fotos** del proveedor, para subirlas tal cual.
- **De que almacen sale**: si es Europa son 5-8 dias, si es China son 20-30.
  Esto decide si podemos mantener la promesa de entrega que ya esta publicada.
- El **porte real** hasta Espana.

## Como se saca

1. Entra en https://cjdropshipping.com con tu cuenta.
2. Arriba a la derecha, en tu nombre: **My CJ**.
3. En el menu de la izquierda: **Authorization** → **API**.
   (En algunas versiones aparece como *Account Settings* → *API*.)
4. Boton **Generate** / **Create API Key**.
5. Copia la clave que sale.

## Como me la pasas

**No la pegues en el chat.** Guardala tu mismo en el archivo `.env` del
proyecto, que ya esta excluido del repositorio y nunca se sube a GitHub:

```
CJ_EMAIL=el-correo-de-tu-cuenta-de-cj
CJ_API_KEY=la-clave-que-acabas-de-generar
```

Y me dices "ya esta". Yo la leo desde ahi, no la imprimo en ningun sitio
y no la escribo en ningun archivo que se suba.

## Que es y que no es

- Es una clave **solo de CJ**. No toca Shopify, ni cobros, ni clientes.
- Solo permite consultar el catalogo y crear pedidos en **tu** cuenta de CJ.
- Se puede **revocar desde la misma pantalla** cuando quieras, sin afectar
  a nada mas.
- Caduca sola: el token de sesion dura 15 dias y se renueva solo.

Si prefieres no darmela, la alternativa es que me pases a mano, por cada
producto: las fotos, el coste y el almacen. Funciona igual, pero son 10
minutos tuyos por producto en vez de 5 segundos mios.
