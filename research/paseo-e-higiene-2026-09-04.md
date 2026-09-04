# Ampliación: clúster de paseo e higiene (4 sept 2026)

## Cómo se eligieron

Búsqueda por `categoryId` en CJ (el texto libre está roto: "paw cleaner" devuelve
aspiradoras), 600 productos escaneados por categoría, ordenados por `listedNum`
—cuántas tiendas CJ venden ya el artículo—. Después: precio de mercado español
real, y lectura de la descripción del proveedor antes de escribir la ficha.

Categorías escaneadas: correas, arneses, cepillos quitapelo, bebederos, comederos
(herramientas), bolsas de paseo, protectores de muebles.

## Lo que se subió

| Producto | PVP | Coste + portes | Margen tras IVA | listedNum |
|---|---|---|---|---|
| Conjunto arnés + correa (4 tallas × 3 colores) | 27,90 | 11,09–13,23 € | **9,83–11,97 €** | 4.388 |
| Dispensador por gravedad, doble | 39,90 | 22,03 € | **10,95 €** | 18.774 |
| Dispensador por gravedad, sencillo | 29,90 | 14,84 € | **9,87 €** | 18.774 |
| Cepillo autolimpiable con pulverizador | 19,90 | 8,17–8,31 € | **8,14 €** | 4.130 |
| Botella de paseo 3 en 1 | 22,90 | 11,95 € | **6,98 €** | 18.388 |
| Guante quitapelo, par | 14,90 | 5,04 € | **7,27 €** | 5.430 |
| Guante quitapelo, unidad | 9,90 | 4,42 € | **3,76 €** | 5.430 |

Portes reales vía `freightCalculate` CN → ES, no estimados. CJPacket Ordinary
4-8 días para lo ligero; línea sensible (5-11 días) para el cepillo, que lleva
batería, y para el dispensador.

El conjunto arnés+correa y el dispensador doble son los dos únicos artículos de
la tienda cuyo margen de contribución cubre el CAC (~12,3 €) prácticamente en el
primer pedido. La botella y el guante suelto **no lo cubren**: son artículos de
subida de ticket, no de captación. No se les debe meter tráfico pagado directo.

## Dos rechazos

**Correa extensible reflectante** (CJGY1734347, 639 tiendas). Descartada. El
proveedor no especifica ni la longitud de la cinta ni el peso máximo que
soporta. Una correa extensible que cede es un perro suelto en la calzada; no se
puede vender un artículo de seguridad cuya especificación se desconoce.

**El "comedero automático programable"** (CJMY1636996, 18.774 tiendas). No se
rechazó, se corrigió. CJ lo titula *"Automatic Pet Feeder Smart Food Dispenser
Timer Stainless Steel"*; su propia descripción dice *"2-in-1 Gravity Food Feeder
… do not need to use electricity"* y el material es plástico. No tiene
temporizador, ni motor, ni acero. Venderlo como programable sería práctica
comercial engañosa (TRLGDCU) y una devolución garantizada. Subido como
**dispensador por gravedad**, con el aviso en la ficha de que solo sirve para
animales que se autorregulan.

Kiwoko vende comederos programables de verdad (Petlibro) a 85–139 €. El nuestro
a 29,90/39,90 no compite con eso ni lo pretende.

## Precio de mercado consultado

- Arneses antitirones de marca (Halti, Gotoo) en Kiwoko: 10,99–24,59 €. Por eso
  el conjunto va a 27,90 **con correa incluida** y no a 24,90 el arnés suelto:
  un arnés genérico no aguanta el precio de un Halti, pero el conjunto sí
  justifica el suyo.
- Cepillos autolimpiables: 10–20 €. El nuestro lleva además pulverizador
  recargable → 19,90.
- Guantes quitapelo: 6–12 € la unidad.

## Ficha: qué se declara en cada una

Cada producto lleva escrito su propio inconveniente antes del botón de comprar:

- Arnés: **no es antitirones**, la anilla va en la espalda; sujeta pero no corrige.
- Botella: 300 ml no le llegan a un perro grande en agosto; las bolsas no vienen.
- Cepillo: el depósito humedece, no baña; las rastas cerradas las corta el peluquero.
- Guante: en pelo largo y denso no llega al subpelo, solo al de superficie.
- Dispensador: no dosifica; un perro ansioso comerá sin límite y engordará.

## Colección nueva

`/collections/lluvia-y-barro` — regla `TAG = lluvia`, 6 productos, segunda
entrada del menú principal. Aprovecha etiquetas que ya existían y llega con el
otoño.
