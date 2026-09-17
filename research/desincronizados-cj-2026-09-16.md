# Los productos «desincronizados» de CJ: qué pasaba y por qué

**16 de septiembre de 2026.** Pablo avisó de que al sincronizar en CJ le
aparecían productos sin conectar. Esto es lo que se encontró, medido contra la
API de CJ y la de Shopify, no supuesto.

---

## El resultado, en corto

**Había 8 productos reales sin vincular. Ya están los 8, confirmados contra la
base de datos de CJ.** Los 5 packs que también aparecen sin conectar es normal
y no tiene arreglo: son cinco productos de CJ metidos en uno solo de la tienda,
y el vínculo de CJ es uno a uno.

Y el motivo por el que se quedaron fuera **no fue un descuido: era un fallo en
nuestro propio código**, que ya está corregido.

---

## Estado antes de tocar nada

| | |
| --- | ---: |
| Productos activos en Shopify | 124 |
| Productos cargados en CJ | 126 (los 124 + 2 archivados) |
| Conexiones variante a variante en CJ | 753 |
| Productos con al menos una conexión | 113 |
| **Productos activos SIN ninguna conexión** | **13** |

De esos 13:

- **5 packs** — baño y lluvia, aseo en casa, comer despacio, cachorro recién
  llegado y pack de coche. **No se pueden vincular nunca.** Un pack son varios
  productos distintos de CJ y su sistema solo admite uno a uno. Cuando se venda
  uno hay que crear los pedidos en CJ a mano. Esto ya estaba documentado.
- **8 productos normales** que sí deberían estar vinculados:

```
Peluche cabezón con sonido          Alfombrilla atrapa-arena
Juguete de papel crujiente          Gorro de sol
Toallitas de dedo para los ojos     Vestido estilo colegial
Comedero elevado de acero           Sudadera de frutas y animales
```

---

## Por qué importa

Sin vínculo, CJ recibe el pedido y **no sabe qué artículo meter en la caja**.
Lo convierte en una «solicitud de abastecimiento» inútil. Es exactamente lo que
pasó con el pedido #1001: llegó con importe 0, sin código postal y sin
transporte.

Si alguien hubiera comprado cualquiera de esos 8, el pedido habría llegado roto.

---

## La causa: paginación inestable y un contador mal puesto

Lo primero que se descartó: **no era un problema de datos**. Los 78 SKU de esos
productos resuelven los 78 en `mapa.js`. Estaban bien.

La causa está en `scripts/cj/vincular.js`. La función que recorre las páginas de
CJ hacía esto:

```js
todo.push(...lote);
if (lote.length < POR_PAGINA || todo.length >= total) return todo;   // ← el fallo
```

Contaba **filas**, no productos distintos. Y resulta que **la paginación de CJ
no es estable**: entre una petición y la siguiente reordena la lista, así que la
misma fila puede salir en dos páginas y otra no salir en ninguna.

Medido hoy, tres lecturas seguidas de la misma lista:

| Lectura | Filas devueltas | Productos distintos |
| --- | ---: | ---: |
| 1.ª | 126 | **116** |
| 2.ª | 126 | **125** |
| 3.ª (una pasada) | — | **123** |

Con 10 filas repetidas, el contador llegaba a 126 y el bucle paraba **10
productos antes de tiempo**. Esos 10 no se vinculaban, y **nadie se enteraba**:
el script terminaba diciendo «todo correcto».

---

## El arreglo

Dos cambios en `paginar()`:

1. **Cuenta elementos distintos, no filas.** Mete todo en un `Map` con una
   clave estable (`platformVariantId`, `platformProductId` o `id`).
2. **Si al terminar faltan, repite la pasada** (hasta 3). Como CJ reordena, en
   otra pasada afloran los que faltaban. Si aun así faltan, **lo dice en voz
   alta** en vez de callarse.

Funcionó exactamente así en la comprobación:

```
paginacion incompleta en /shop/product/queryPage (123/126); pasada 2...
paginacion incompleta en /shop/product/queryPage (124/126); pasada 3...
CJ tiene cargados 126 producto(s) de la tienda.
```

---

## Estado después

```
8 vinculado(s), 118 ya estaban, 0 con problema.
Comprobando que CJ los ha guardado de verdad...
8 confirmados, 0 no se guardaron.
```

Y la comprobación posterior, ya con la paginación arreglada:

```
CJ tiene cargados 126 producto(s) de la tienda.
0 vinculado(s), 126 ya estaban, 0 con problema.
```

**Los 121 productos vinculables están vinculados.** Los 5 packs quedan fuera a
propósito.

---

## Dos cosas que me equivoqué al mirar, y cómo se cazaron

Las anoto porque la trampa va a volver:

1. **«Hay 10 productos que CJ no tiene cargados.»** Falso. Era mi propio
   diagnóstico usando la misma paginación mala. Al releer con la versión
   corregida, CJ los tenía todos.
2. **«La mochila transportín grande no está en CJ.»** También falso, y por lo
   mismo. CJ tiene los 126.

**Regla que sale de aquí: una lista paginada de CJ no se cree a la primera.**
Se lee contando elementos distintos y se compara con el total que declara CJ.

---

## Lo que hay que hacer cada vez que se suba una tanda nueva

```bash
node scripts/cj/vincular.js              # simulación: dice qué haría
node scripts/cj/vincular.js --ejecutar   # crea los vínculos que falten
```

Si la simulación dice **«0 vinculado(s)»** y no sale ningún `AVISO`, está todo
conectado. Si sale un `AVISO` de paginación incompleta, **repetir** antes de dar
nada por bueno.

CJ tarda un rato en cargar los productos nuevos de la tienda. Si un producto
recién subido no aparece, hay que entrar en cjdropshipping.com →
**Products → Store Products** → elegir la tienda → **Sync**, esperar unos
minutos y volver a ejecutar.

---

# Adenda: lo que se ve en el panel de CJ (capturas de Pablo, 13:54)

Pablo mandó dos capturas de `m.cjdropshipping.com`. En la pestaña
**Desconectado** salían: la sudadera de frutas y los packs. En **Conectado**:
mariposa eléctrica, calendario de adviento, mordedor de Navidad y comedero árbol.

## 1. La sudadera: la captura es de antes del arreglo

Los vínculos se crearon a las **14:18** (hora de Madrid). La captura es de las
**13:54**, veinticuatro minutos antes. En ese momento la sudadera estaba
desconectada de verdad.

Comprobado ahora contra la API:

```
/product/conn/connection?platformProductId=15820490211676  ->  total: 42
relevanceStatus a nivel de producto: 2   (= conectado)
42 de 42 variantes con relevanceStatus 2
```

**Está conectada.** El panel hay que recargarlo.

## 2. Cómo saber si un producto está conectado, sin fiarse del panel

El campo es **`relevanceStatus`** en `/shop/product/queryDetail`:

| Producto | relevanceStatus | Panel |
| --- | ---: | --- |
| Mariposa eléctrica | **2** | Conectado |
| Sudadera de frutas | **2** | (ya conectado) |
| Comedero elevado | **2** | (vinculado hoy) |
| Pack de coche | **0** | Desconectado |

**2 = conectado. 0 = sin conectar.**

Cuidado con una trampa: `queryDetail` **nunca** devuelve `cjVariantId`, ni
siquiera en los productos que sí están conectados. Si se mira ese campo para
decidir, salen todos a cero y parece que no hay ningún vínculo. No sirve.

## 3. El precio en dólares de la pestaña «Desconectado» no es un fallo

CJ muestra ahí el precio convertido a dólares. La sudadera vale 19,90 € en la
tienda y el panel pone 22,96 $. Es la misma cifra con el cambio aplicado, no un
precio mal puesto.

## 4. Los packs van a salir SIEMPRE como «Desconectado», y no pasa nada

Esto es lo importante de toda la revisión, porque la documentación anterior
decía lo contrario y **estaba mal**:

> ~~«Los packs no se pueden automatizar: hay que crear tres pedidos en CJ a mano.»~~

**Falso.** Hay que separar dos cosas:

- **El vínculo de CJ** es uno a uno, así que un pack (tres productos de CJ
  dentro de uno de la tienda) no se puede vincular. Por eso sale como
  «Desconectado» y va a seguir saliendo siempre.
- **Servir el pedido no usa ese vínculo.** `scripts/cj/servir.ts` resuelve el
  SKU con `mapa.js`, expande el pack en sus tres piezas y crea **un solo
  pedido** en CJ con las tres dentro, con un solo porte calculado para el
  conjunto.

Comprobado hoy, los cinco:

```
OK  PACK-BANO-LLUVIA      3 piezas  vid: si,si,si
OK  PACK-ASEO-CASA        3 piezas  vid: si,si,si
OK  PACK-COMER-DESPACIO   3 piezas  vid: si,si,si
OK  PACK-CACHORRO         3 piezas  vid: si,si,si
OK  PACK-COCHE            3 piezas  vid: si,si,si
```

**Los cinco packs se pueden servir automáticamente.**

## 5. Y lo de fondo: el vínculo de CJ no es lo que nos sirve los pedidos

El vínculo solo lo usa **la creación automática de pedidos de la app de CJ**,
que es justo la que hay que tener **apagada**: es la que convirtió el pedido
#1001 en una «solicitud de abastecimiento» con importe 0.

Nuestro camino es `servir.ts`, que no depende de ese vínculo.

Entonces, ¿para qué vincular? Por dos razones, las dos buenas:
1. **Red de seguridad**, por si algún día se usa la vía de CJ.
2. **Para poder leer el panel.** Con todo conectado menos los packs, cualquier
   cosa que aparezca en «Desconectado» que no sea un pack es una señal de que
   hay un producto nuevo sin vincular.

**Regla para el futuro: en «Desconectado» deben salir exactamente los 5 packs.
Si sale un sexto, ejecutar `node scripts/cj/vincular.js --ejecutar`.**

---

# Adenda 2: apagada la sincronización automática (17/09/2026)

## Dónde estaba el interruptor

Costó encontrarlo, así que queda escrito. **No está en el móvil**: los ajustes
del engranaje de «Mi CJ» solo tienen perfil, correo y direcciones.

El camino real, en la **versión de escritorio** de cjdropshipping.com:

```
columna de iconos de la izquierda
  → octavo icono (el de la tiendecita con un sello)
  → Shopify (1)
  → Lista de tiendas → fila de g5d031-ir
```

Esa fila tiene tres interruptores:

| Columna | Estado | Qué es |
| --- | --- | --- |
| Permiso de correo electrónico | encendido | se deja |
| **Sincronización automática (Información de pedidos y productos)** | **APAGADO** | el que traía los pedidos |
| Permiso de perfil de entrega | apagado | se deja |

## Por qué se podía apagar sin miedo

En el menú de autorización de CJ hay **dos** conexiones con nuestra tienda:

- **Shopify (1)** — la app. Es la que tiene ese interruptor y la que rompió
  el pedido #1001.
- **API (1)** — la nuestra, la que usa `scripts/cj/servir.ts` con el token.

**Son independientes.** Apagar la primera no toca la forma en que servimos los
pedidos, porque no pasamos por ahí.

## Comprobado después de apagarlo

```
productos de la tienda que ve CJ : 126  (igual)
conexiones variante a variante   : 833  (igual)
sudadera de frutas               : 42 de 42  (igual)
```

Nota: en la conversación se dijo «antes 831». Era un error de cuenta: eran 753
antes de vincular los 8 productos, que suman 80 variantes. 753 + 80 = **833**.
No cambió nada.

## Lo que queda por comprobar de verdad

Que CJ siga viendo los 126 productos **no prueba que la sincronización de
catálogo siga activa**: puede ser la lista que ya tenía guardada. El interruptor
juntaba «pedidos **y productos**».

**Se sabrá en la siguiente tanda.** Si CJ no ve los productos nuevos, hay que
entrar a *Productos de la tienda* y pulsar **Sync** a mano antes de ejecutar
`node scripts/cj/vincular.js --ejecutar`.
