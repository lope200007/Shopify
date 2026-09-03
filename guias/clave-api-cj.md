# Camino A — conectar a Claude con CJ por API

Tiempo: unos 5 minutos. Se hace una vez.

---

## Paso 1 — Entra en tu cuenta de CJ

https://cjdropshipping.com — la misma cuenta con la que autorizaste la app
en Shopify.

## Paso 2 — Busca la pantalla de API

Arriba a la derecha, sobre tu nombre o tu avatar, entra en **My CJ**.
En el menu de la izquierda busca **Authorization** y dentro **API**.

Si no lo ves con ese nombre exacto, esta en uno de estos sitios (CJ cambia
la interfaz cada pocos meses):

- My CJ → **Authorization** → **API**
- My CJ → **Account Settings** → **API**
- Menu de tu avatar → **API**

Atajo si te pierdes: escribe **"API"** en el buscador del panel de CJ.

## Paso 3 — Genera la clave

Boton **Generate** o **Create API Key**.

Sale una cadena larga de letras y numeros. **Copiala entera.**

Ojo con esto: la clave de API **no es** la contrasena con la que entras en
la web de CJ. Son dos cosas distintas. Si me pasas la contrasena no
funciona, y ademas no quiero tenerla.

## Paso 4 — Hacermela llegar

Aqui hay que elegir, y te explico el porque de cada opcion.

Yo trabajo en un ordenador temporal en la nube. Tu no tienes acceso a sus
archivos, asi que no puedes dejarme la clave en un fichero.

### Opcion 1 — Variable de entorno (la limpia)

La clave no pasa por la conversacion en ningun momento.

1. Ve a **https://claude.ai/code**
2. Abre los ajustes del **entorno** que usas para este proyecto.
3. En **Variables de entorno**, anade estas dos:

   ```
   CJ_EMAIL      = el correo de tu cuenta de CJ
   CJ_API_KEY    = la clave que acabas de generar
   ```

4. Guarda y **abre una sesion nueva** (las variables se cargan al arrancar,
   no a mitad de camino).
5. En la sesion nueva me dices "ya esta" y compruebo.

### Opcion 2 — Me la pegas aqui (la rapida)

Funciona al momento, sin reiniciar nada. El precio es que la clave queda
escrita en el historial de esta conversacion.

Si eliges esta, ten claro que:

- Es una clave **solo de CJ**. No toca Shopify, ni cobros, ni datos de
  clientes. Lo peor que permite es consultar el catalogo y crear pedidos
  en tu propia cuenta de CJ.
- **Se revoca en 10 segundos** desde la misma pantalla del Paso 2. En
  cuanto yo termine de traer los costes, las fotos y los almacenes, me
  dices y te aviso para que la anules.

Yo recomiendo la Opcion 1. Pero si quieres avanzar hoy, la 2 con revocacion
al terminar es un riesgo pequeno y controlado.

---

## Paso 5 — Yo compruebo

Ejecuto:

```bash
node scripts/cj/probar-conexion.js
```

Ese script **no imprime la clave**. Solo dice si conecta, hasta cuando
vale el token y si el catalogo responde.

## Que hago en cuanto conecte

Sin que tengas que tocar nada mas:

1. Busco en el catalogo de CJ los articulos de los tres packs que salen
   rentables (lluvia, cachorro, paseo a oscuras).
2. Saco de cada uno el **coste real** — y ahi se confirma o se cae el
   calculo, porque ahora mismo son estimaciones mias.
3. Saco **de que almacen sale**. Es lo que decide si podemos mantener el
   plazo de entrega que ya esta publicado en la politica de envios: Europa
   son 5-8 dias, China 20-30.
4. Me traigo **las fotos del proveedor** y las subo. Se acaba el riesgo de
   que la foto no sea lo que se envia.
5. Creo los productos y los packs en la tienda, con sus fichas escritas.

## Si algo no sale

- **No aparece el menu de API.** Algunas cuentas nuevas lo tienen oculto
  hasta verificar el correo. Verificalo y vuelve a mirar.
- **CJ rechaza las credenciales.** Casi siempre es haber copiado la
  contrasena en vez de la clave de API. Vuelve al Paso 3.
- **Genero una clave nueva y la vieja deja de valer.** Es normal, CJ solo
  mantiene una activa. Pasame la nueva.
