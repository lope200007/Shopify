# Venta cruzada: bloque "También en pack" en las 12 fichas componentes

Fecha: 2026-09-06.

## Por qué

Del análisis económico del catálogo (`analisis-negocio-2026-09-05.md`):
24 de las 33 referencias no cubren por sí solas el coste estimado de
captación (12,30 EUR). Los únicos productos que superan 2x ese coste son
los tres packs nuevos.

La conclusión no era borrar los productos de poco margen, sino
**recolocarlos**. El guante quitapelo deja 3,76 EUR de margen: no sirve
para atraer a nadie, pero sí para que quien ya está en su ficha se lleve
el pack de 55,90 EUR. Su trabajo no es que lo busquen: es que lo suban.

Además el precio medio del catálogo es de unos 21 EUR y el envío gratis
empieza en 55. Con un solo artículo casi nadie llega.

## Qué se ha hecho

Al final de la descripción de **cada una de las 12 piezas que componen un
pack** se ha añadido un bloque:

```html
<h3>También en pack</h3>
<p>… va incluido en el <a href="/products/HANDLE">NOMBRE DEL PACK</a>,
junto con X e Y: <strong>PVP en vez de REFERENCIA</strong>, …</p>
```

| Pack | PVP | Referencia | Componentes enlazados |
|---|---|---|---|
| Aseo en casa | 55,90 | 64,70 | lima eléctrica, cortapelo de patas, guante quitapelo |
| Comer despacio | 55,90 | 64,70 | comedero puzzle, alfombrilla de lamer, tentetieso |
| Cachorro recién llegado | 59,90 | 74,70 | parque 74 cm, barrera enrollable, dinosaurio 25 cm |
| Baño y lluvia | 39,90 | 54,70 | albornoz, toalla, manopla |

Los tres primeros pasan de 55 EUR, así que el bloque dice **"con el envío
gratis incluido"**. El pack de baño y lluvia está en 39,90 y **no** lo
dice: ahí el argumento es el ahorro de 14,80 EUR. No se promete un envío
gratis que el carrito no va a dar.

Los precios de referencia son la suma real de las fichas sueltas de la
propia tienda (Real Decreto 2/2023), no cifras infladas.

## Comprobado

- 12 mutaciones `productUpdate` con `userErrors: []`
- Las 12 fichas siguen en ACTIVE y llevan el bloque
- Las 4 URL de pack enlazadas devuelven **200** en el storefront
- El bloque se renderiza en la página pública (comprobado en cortapelo,
  manopla y dinosaurio)

## Erratas corregidas de paso

Al reescribir las descripciones se arreglaron dos errores tipográficos
que ya estaban publicados:

- parque plegable: "un cachopo saltador" → "un cachorro saltador"
- dinosaurio: "Cuarenta centimétros" → "Cuarenta centímetros"

## Lo que no se ha tocado

El enlace es de una sola dirección: de la pieza al pack. Las fichas de los
packs ya enumeran sus componentes en el texto, así que no se ha añadido
nada allí.
