# Giro a mascotas ejecutado — 3 septiembre 2026

## Por que se archivo antes de tener fotos

Argumente que archivar los bolsos dejaria la tienda vacia y que eso era
peor. **Estaba equivocado de prioridad.**

La tienda tiene **cero pedidos y cero trafico**, y deberia estar con
contrasena mientras se reconstruye. Una tienda vacia dos dias no cuesta
nada. Una tienda incoherente, que dice una cosa y vende otra, si.

## Lo archivado: 37 productos

**Archivado, no borrado.** Todo es recuperable desde el admin.

- **30 productos activos**: los 27 de bolsos y complementos de Nicole Lee
  y Hecho a mano, mas los 3 packs que se crearon con ellos.
- **7 borradores**: Archival Ecru Hoodie (marca ajena, stock ficticio de
  9.999 por talla), Pijama mono de monstruo (coste 19,99 = precio 19,99,
  margen cero) y los 5 complementos de bolso que ya no encajan
  (organizador de fieltro, colgador, kit de cuero, bandolera antirrobo,
  organizadores de maleta).

## Estado verificado tras el giro

| | |
|---|---|
| Productos activos | **0** |
| Borradores | 5, todos de mascotas |
| Archivados | 37 |

Cero activos es correcto y esperado: los cinco de mascotas siguen sin
foto.

## Estructura reorientada

**Menu principal**, solo mascotas:

Inicio, Comederos, Juguetes, Higiene y cuidado, Packs y ahorro, Quienes
somos, Contacto.

**"Packs y sets" convertida en "Packs y ahorro"**, y pasada de manual a
automatica por etiqueta `pack`, para que recoja sola el pack de
comederos y los que vengan.

**Portada** reescrita al angulo del producto ancla: "Si tu perro vacia el
cuenco en quince segundos, no esta comiendo: esta engullendo." El boton
lleva a la coleccion de comederos y la lista de productos apunta a
`comederos` en vez de a `all`.

## Lo que no se pudo hacer, y por que

**Despublicar las colecciones de bolsos**: bloqueado por la politica de
seguridad del conector (`publishableUnpublish`, categoria destructiva).
No importa: al quitarlas del menu quedan inalcanzables salvo escribiendo
la URL a mano, y sin productos visibles.

**Borrar archivos de tema**: igualmente bloqueado. Quedo un
`snippets/prueba-acceso.liquid` vacio que no renderiza nada.

## Correccion legal pendiente

El **aviso legal** publicado dice:

> ACTIVIDAD: Comercio electronico minorista: venta a distancia de bolsos,
> complementos y articulos de moda.

Ya no es cierto. El conector no tiene permiso `write_legal_policies`, asi
que **hay que cambiarlo a mano** en Ajustes > Politicas > Aviso legal,
sustituyendo esa linea por:

> Comercio electronico minorista: venta a distancia de articulos y
> accesorios para animales de compania.

Los ficheros de `legal/` ya estan corregidos con ese texto.
