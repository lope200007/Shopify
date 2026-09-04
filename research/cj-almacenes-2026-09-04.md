# CJ conectado — y el hallazgo que cambia el plan

4 septiembre 2026

## La conexion funciona

El token que genero el usuario es de tipo **MCP Token**, no API Key. Su
formato es `MCP@CJ<numero>@CJ:<JWT>`. La parte de despues del primer `:`
es un JWT que **vale directamente como cabecera `CJ-Access-Token`** contra
`api2.0`. Comprobado: acceso a 1.535.855 productos.

Cliente en `scripts/cj/cj.js`. Credenciales solo en `.env` (gitignored).
Limite real: 1 peticion por segundo, con 1,6 s de separacion va fino.

## Como buscar en CJ sin recoger basura

La busqueda por texto (`productNameEn`) es **difusa por palabra suelta**.
Buscando "paw cleaner" devuelve aspiradoras y limpiacristales; "led dog
collar" devuelve altavoces bluetooth y juguetes sexuales. Es inservible.

Lo que si funciona: **buscar por `categoryId`** del arbol de
`/product/getCategory`. Las de mascotas:

| Categoria | ID |
|---|---|
| Comederos (Pet Bowls) | 2410110341061612000 |
| Toallas (Pet Towels) | 2410110355321622400 |
| Bano y ducha (Pet Shower) | 2410110355151622300 |
| Collares (Pet Collars) | 2410110352331629800 |
| Juguetes de morder | 2410110339451623300 |
| Juguetes de entrenamiento | 2410110340031614900 |

Y `countryCode` filtra por **pais del almacen con stock**. Ese es el dato
que decidia todo.

## El hallazgo: CJ no tiene almacen europeo para lo nuestro

Productos con stock, por categoria y almacen:

| Categoria | DE | ES | FR | US | CN |
|---|---|---|---|---|---|
| Toallas y manoplas | **0** | 0 | 0 | 2 | 76 |
| Bano y ducha | 6 | 0 | 0 | 53 | 1.046 |
| Collares | **0** | 0 | 0 | 53 | 1.579 |
| Comederos | 1 | 0 | 0 | 87 | 1.200 |
| Juguetes de morder | **0** | 1 | 0 | 17 | 423 |

Los 6 de "bano y ducha" en Alemania no son limpiadores de patas: son
guantes SPA, tapas antibacterianas para dientes, spray desodorante,
cubreorejas y toallitas para lagrimales. El unico "comedero" con stock
aleman es un saco de pienso de 7 kg.

**Traduccion: todo lo que necesitan los tres packs sale de China.** No son
5-8 dias, son 20-30.

## Lo que esto invalida

CJ se eligio como proveedor **precisamente por sus almacenes europeos**
(documentado en `productos-nuevos-cj.md`: "Via elegida: CJ Dropshipping.
Gratis de verdad y con almacenes en Europa: 5-8 dias en vez de 25"). Ese
motivo no se sostiene para la categoria de accesorios de perro.

Y peor: la portada publicada decia **"Enviamos desde Europa"**. Era falso.

## Corregido

Tema `Mascotas - plazos corregidos` (203947442524), sin publicar:

- Portada: "Enviamos desde Europa" -> "El plazo de entrega real lo ves
  antes de pagar".
- Ficha de producto: el titulo "Llega en dias" -> "Plazo claro antes de
  pagar", y el texto ya no promete preparacion en 1-3 dias.

## Lo que hay que decidir

1. **Aceptar 20-30 dias** y decirlo claro en cada ficha. Legal y honesto,
   pero mata la conversion frente a Amazon.
2. **Cambiar de proveedor** a uno con stock europeo real (BigBuy es el
   candidato obvio en Espana, pero cobra cuota).
3. **Cambiar de categoria** a algo donde CJ si tenga stock europeo.

No decido esto por mi cuenta: cambia el modelo de negocio entero.
