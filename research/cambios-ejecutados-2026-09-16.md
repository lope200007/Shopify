# Lo que se ha cambiado hoy en la tienda


> **AVISO (20/09/2026).** Este documento da por hecho que el plan Advanced
> cuesta ~384 € al mes y que bajar a Basic es la mejora más rentable. **Eso
> es falso:** Pablo tiene Advanced en promoción por **1 € durante tres meses**
> (hasta ~2 de diciembre de 2026). Todo lo que este documento diga sobre bajar
> de plan está anulado por `research/plan-advanced-promocion-2026-09-20.md`.
> El resto del documento sigue siendo válido.

**16 de septiembre de 2026.** Todo comprobado contra la tienda en vivo después
de hacerlo, no solo contra la respuesta de la API.

---

## 1. Envío gratis: de 55 € a 39 €

### Por qué

El precio mediano del catálogo es 19,90 €. Con el umbral en 55 € solo **4 de
120 productos** lo alcanzaban solos, así que en la práctica nadie tenía envío
gratis y todo el mundo veía 6,99 € de sorpresa en el pago: un **+35 %** sobre
lo que creía que iba a pagar.

39 € se alcanza con **dos productos**, que sí es una primera compra creíble.

### Lo que había que verificar antes (y se verificó)

El riesgo era que dos productos de CJ viajaran en dos paquetes y el porte se
duplicara. **Medido con `freightCalculate`, dos veces con pares distintos:**

| | por separado | juntos | |
| --- | ---: | ---: | --- |
| manta de felpa + jersey de punto | 9,76 € | **6,84 €** | viajan juntas |
| zanahoria + toallitas | 10,40 € | **8,36 €** | viajan juntas |

Segundo riesgo: un producto voluminoso que cruce solo los 39 € y se lleve el
envío gratis. **Medido el porte de los seis más voluminosos:**

| Producto | Porte | PVP | ¿Cruza los 39 € solo? |
| --- | ---: | ---: | --- |
| Cubremaletero | 10,92 € | 34,90 € | **no** |
| Parque plegable | 8,41 € | — | no |
| Túnel interactivo | 7,51 € | 34,90 € | no |
| Bolso transportín | 6,47 € | 39,90 € | sí, y aguanta |
| Cama dónut 80 cm | 5,05 € | 44,90 € | sí, y aguanta |
| Cama sofá (la mayor) | 13,74 € | 124,90 € | sí, y sobra |

El peor caso (cubremaletero, 10,92 € de porte) **no llega al umbral**, así que
sigue pagando envío. En todos los casos que sí lo cruzan el margen se queda
entre 10 y 13 €, la misma banda de siempre, con el doble de facturación por
pedido.

### Cómo se hizo

La condición de 55 € resultó ser un **«rango de precio»** de la tarifa
existente: la API lo deja leer pero **no editar ni borrar** (`conditionsToUpdate`
y `conditionsToDelete` devuelven «condición no encontrada»). Se creó una tarifa
nueva, **«Envío gratis», 0 € a partir de 39 €**, en la zona de España.

### Comprobado en la tienda real

```
carrito 22,90 € (1 producto)  -> Estándar 6,99 €                    (paga)
carrito 39,80 € (2 productos) -> Envío gratis 0,00 € · Estándar 6,99 €
carrito 68,70 € (3 productos) -> Envío gratis 0,00 € · Estándar 0,00 €
```

**Queda un fleco:** por encima de 55 € salen dos líneas gratis, porque el rango
viejo sigue ahí. No hace daño —el cliente elige una— pero conviene borrarlo.
Es de panel: *Ajustes → Envíos y entregas → Perfil general → tarifa «Estándar»
→ quitar el rango de precio de 55 €.*

---

## 2. El descuento: `Pet07` fuera, `BIENVENIDA10` dentro

`Pet07` daba un **5 %**. Sobre 19,90 € eso es **un euro**. Llevaba tres días
activo con **cero usos** y no estaba anunciado en ningún sitio.

Se ha desactivado (queda como EXPIRED, no borrado) y se ha creado:

- **`BIENVENIDA10`** — 10 % en el primer pedido, **una vez por cliente**.
- Es la moneda de cambio por el **correo electrónico**, no una rebaja general.
- Se combina con descuentos de envío, no con otros de producto.

**Comprobado:** carrito de 22,90 € → **20,61 €** con el código aplicado.

### Por qué 10 % y no «envío gratis en el primer pedido», que era lo propuesto

Porque el envío gratis ya es el premio por llegar a 39 €. Dos mensajes de
«envío gratis» compitiendo se anulan entre sí y además se cargarían el
incentivo de subir el pedido medio. El 10 % no pisa nada.

---

## 3. La Navidad estaba en el cajón

Cuatro productos de Navidad llevaban **en borrador desde el 10 de septiembre**:
bufanda y gorro, calendario de adviento para gato, comedero puzzle en árbol y
mordedor de peluche.

Esto contradecía la propia estrategia escrita en `navidad-2026-09-10.md`: la
Navidad se monta en septiembre **precisamente porque una página nueva no
posiciona en cuatro semanas** y el pico de `regalos para perros` (×11 sobre el
suelo de julio) pasa por encima si se llega tarde. Un producto en borrador no
posiciona para nada.

**Antes de activarlos se comprobó** que estaban completos: 4–9 fotos, variantes,
SEO, colecciones, y los **14 SKU resuelven a CJ** (si se compran, se pueden
servir).

Los cuatro están **activos y publicados en los cuatro canales**, y los cuatro
responden 200 en la web.

---

## 4. Colección nueva: «Empieza por aquí»

El problema: 120 productos y **catorce colecciones que se pisan** («Novedades»
tiene 126, o sea el catálogo entero). Quien llega a la portada tiene catorce
puertas y todas dan al mismo sitio.

`patitascalidas.com/collections/empieza-por-aqui` — **diez productos**,
elegidos por volumen de búsqueda medido y por temporada:

| Producto | Por qué está |
| --- | --- |
| Cama en dónut | `cama perro` 13.200/mes |
| Abrigo de invierno | temporada, con tabla de medidas |
| Cama cueva de invierno | `cama gato` 2.400/mes + temporada |
| Rascador de pared | `rascadores para gatos` 7.000/mes |
| Rascador redondo de cartón | mismo racimo |
| Fuente de agua para gato | `fuente para gatos` 4.200/mes |
| Arnés acolchado reflectante | `arnés para perros` 4.400/mes |
| Collar de microfibra con chapa | racimo `collar perro` 9.300/mes |
| Comedero lento 2 en 1 | `comedero perro` 1.900/mes |
| Pack de coche 64,90 € | cruza el umbral él solo |

Está publicada y responde 200. **Falta enlazarla desde la portada**, y eso no
se puede hacer por API: escribir en el tema publicado está bloqueado. Es de
panel: *Tienda online → Temas → Personalizar → sección de colección destacada →
elegir «Empieza por aquí».*

---

## 5. Dos textos que se quedaron desfasados al cambiar el envío

- **La política de envío pública sigue diciendo 55 €.** Y además decía
  «enviamos únicamente a España peninsular» y «no servimos a Baleares», **cuando
  la zona de envío sí cubre Baleares** (48 provincias peninsulares + Balears;
  excluye Canarias, Ceuta y Melilla, eso sí está bien).
- **La descripción de la tienda** («Envío gratis desde 55 € y 14 días para
  devolver») sale como meta descripción en Google.

Las dos son de panel: la conexión **no tiene el permiso
`write_legal_policies`** y la descripción de la tienda tampoco se escribe por
API. El texto corregido está listo para copiar y pegar en
`research/textos/politica-envio.html`.

---

## 6. Lo que sigue siendo de Pablo, por orden de valor

| # | Qué | Dónde | Por qué importa |
| --- | --- | --- | --- |
| 1 | ~~Bajar de Advanced a Basic~~ → **Mirar la fecha de fin de la promoción de 1 €** | Ajustes → Plan | Hoy Advanced cuesta 1 €, no 384 €. Bajar ahora no ahorra nada; lo que importa es bajar **antes** de que acabe (≈2/12/2026) |
| 2 | **Apagar los pedidos automáticos de la app de CJ** | panel de la app | El #1001 llegó roto por esto |
| 3 | **Activar el IVA sobre el envío** | Ajustes → Impuestos | Error contable en cuanto haya un pedido |
| 4 | **Pegar la política de envío corregida** | Ajustes → Políticas → Envío | Hoy contradice a la tienda |
| 5 | **Cambiar la descripción de la tienda a 39 €** | Tienda online → Preferencias | Es lo que sale en Google |
| 6 | **Enlazar «Empieza por aquí» desde la portada** | Temas → Personalizar | La colección existe pero no se ve |
| 7 | **Borrar el rango de 55 € de la tarifa** | Ajustes → Envíos | Quita la línea gratis duplicada |
| 8 | **Pedirse 3–4 productos a casa** (60–80 €) | CJ | Vídeo real, fotos propias, control de calidad |

---

## 7. Skill nueva: `asesor-ventas`

En `.claude/skills/asesor-ventas/`. No se descargó de ningún sitio: **no había
nada en el mercado que sirviera**, y lo genérico vale menos que los números
reales de esta tienda.

Contiene el margen medido, la fórmula, el umbral de pedidos según el coste
fijo, cómo leer la analítica sin engañarse con el tráfico de bots, las reglas
de producto y de ficha, lo que se puede y lo que no se puede tocar por API, y
los riesgos vivos del primer pedido.

**Aviso importante:** las 90 skills de este repositorio —`asesor-ventas`
incluida— **solo se cargan si la sesión se abre en la carpeta de la tienda**
(`/home/user/shopify`). Las sesiones abiertas en `libre` no las ven. Por eso en
esta sesión no estaban disponibles.
