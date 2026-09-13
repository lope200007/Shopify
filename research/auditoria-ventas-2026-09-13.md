# Auditoría del sistema de ventas

13 de septiembre de 2026. Todo medido, nada supuesto.

---

## Resumen en una frase

**El sistema de ventas funciona entero. Lo que no hay es gente: 37 visitantes
españoles reales en un mes, poco más de uno al día.**

---

## 1. Lo que SÍ funciona (probado, no supuesto)

No me he fiado de mirarlo por encima: he hecho la compra como un cliente.

| Pieza | Cómo se comprobó | Resultado |
|---|---|---|
| Añadir al carrito | `POST /cart/add.js` con el collar AirTag, y luego `/cart.js` | ✅ 1 artículo, 22,90 €, moneda EUR |
| Checkout | Seguido hasta el final con las cookies del carrito | ✅ HTTP 200, en `es-es`, 2,3 s |
| Formas de pago | Leídas del HTML del checkout real | ✅ Shop Pay, PayPal, tarjeta (Visa/Mastercard), Apple Pay, Google Pay, Klarna |
| Contraseña de tienda | `onlineStore.passwordProtection` | ✅ Desactivada: la tienda es pública |
| Dominio y SSL | `shop.primaryDomain` | ✅ patitascalidas.com con SSL |
| Tema publicado | `Shopify.theme` leído de la portada | ✅ "Patitascalidas 2026 — plazo de entrega real" |
| Velocidad en móvil | curl con User-Agent de iPhone | ✅ Portada 1,38 s · colección 1,33 s · ficha 0,64 s |
| Rastreo | robots.txt y sitemap.xml | ✅ `Allow: /`, sitemap al día |

**No hay ni un fallo técnico en el embudo.** Si entrara un cliente, podría comprar.

---

## 2. El dato que lo explica todo

```
FROM sessions SHOW sessions, sessions_with_cart_additions,
     sessions_that_reached_checkout, conversion_rate SINCE -90d

  sesiones  389   |   carritos  0   |   checkouts  0   |   conversión  0,0 %
```

Cero añadidos al carrito en 389 sesiones parece imposible… hasta que se mira de
dónde vienen esas sesiones:

| Dispositivo | País | Sesiones | Qué es |
|---|---|---:|---|
| **Escritorio** | **Estados Unidos** | **305** | Tráfico automático. Nadie en EE. UU. teclea el dominio de una tienda española de collares de perro |
| Móvil | Estados Unidos | 20 | Idem |
| **Móvil** | **España** | **37** | ← **Los clientes de verdad** |
| Escritorio | Polonia, Alemania, Francia… | 27 | Rastreadores |

**El 84 % del tráfico es basura.** Origen "direct", escritorio, países a los que ni
siquiera se envía, y cero interacción con la página. Es la firma exacta de los bots
que rastrean dominios nuevos.

### La cuenta que cierra el caso

- Visitantes españoles reales: **37 en 30 días ≈ 1,2 al día**
- Conversión normal de una tienda nueva sin marca: **1 %**
- Ventas esperables: **0,37 al mes**

**Cero ventas no es una anomalía: es exactamente lo que predice la aritmética.** No
hay nada que arreglar en la conversión porque no ha habido a quién convertir.

---

## 3. Por qué no entra gente

```
patitascalidas.com — palabras clave indexadas: 0
```

Probadas 8 palabras contra Google en vivo:

| Palabra | Posición |
|---|---|
| `patitascalidas` (la marca) | **2** |
| `cama para perro donut` | sin aparecer |
| `collar perro airtag` | sin aparecer |
| `rascador para gatos carton` | sin aparecer |
| `comedero puzzle perro` | sin aparecer |
| `alfombra olfativa perro` | sin aparecer |
| `bozal silicona perro` | sin aparecer |
| `correa nailon perro 150 cm` | sin aparecer |

**Tráfico orgánico estimado: 0 al mes.** Google solo sabe que la tienda existe si ya
sabes su nombre.

**Y esto es normal, no un fallo.** La tienda tiene dos semanas de vida real: de las
389 sesiones, **386 son de septiembre** y antes de agosto no había ninguna. Un dominio
nuevo tarda semanas en indexarse y meses en coger posiciones. El catálogo y las fichas
están bien hechos; lo que falta es tiempo y enlaces.

---

## 4. Tres cosas que encontré de paso, y que cuestan dinero

### 4.1 El plan de Shopify es el caro

`shop.plan.displayName` = **Advanced**. Es el plan de ~289-384 € al mes, pensado para
tiendas con volumen e informes avanzados. Con cero ventas, eso sale de bolsillo cada
mes sin devolver nada. El plan **Basic** hace exactamente lo mismo para esta tienda.

**Es, con diferencia, el ahorro más grande y más rápido disponible ahora mismo.**

### 4.2 Cinco borradores con SKU inventados que no se podrían servir

Hay cinco productos en borrador de una sesión anterior —comedero automático,
alfombrilla refrescante, fuente de gato, coche interactivo y bebedero antivuelco— con
SKU construidos a mano añadiendo sufijos al SKU base:

```
CJMY205863301AZ-INOX-MARRON     SIN MAPEO
CJYD240093301AZ-M               SIN MAPEO
CJYD228449801AZ-BLANCO          SIN MAPEO
CJYD228449801AZ-FILTROS6        SIN MAPEO
CJMY187079002BY                 SIN MAPEO
CJGY102545413MN                 SIN MAPEO

6 SKU, 6 sin mapeo
```

Los SKU de CJ nunca tienen esa forma: son `CJXX########AZ` y **cada variante tiene el
suyo** (`01AZ`, `02BY`, `03CX`…), no un sufijo descriptivo pegado. **Si alguien
activa esos productos y los compran, el pedido no se puede pasar a CJ.**

Menos mal que están en borrador. Además llevan `inventoryPolicy: DENY` con inventario
0, así que ni siquiera se podrían añadir al carrito.

### 4.3 Dos de esos borradores delatan al proveedor

Las descripciones **públicas** del coche interactivo y del bebedero terminan así:

> *"Producto basado en el artículo de CJdropshipping SKU CJMY187079002BY"*

Eso le está diciendo al cliente dónde comprarlo más barato. Hay que borrarlo antes de
que ninguno de los dos se publique.

---

## 5. Qué hacer, por orden de impacto

1. **Bajar de plan Advanced a Basic.** Ahorro inmediato y sin ninguna contrapartida.
2. **Conseguir visitas.** Es el único cuello de botella real. El SEO ya está sembrado
   y tardará meses; lo que da tráfico esta semana es TikTok —hay 32 vídeos verticales
   renderizados y sin publicar— y, si se quiere acelerar, una campaña pequeña.
3. **No tocar la conversión todavía.** Con 37 visitas no se puede medir nada: cualquier
   cambio que se haga ahora es una corazonada, no una mejora. Cuando haya 500 visitas
   al mes, los datos dirán dónde se cae la gente.
4. **Arreglar o borrar los cinco borradores** antes de que alguien los active.
5. **Ignorar el tráfico de Estados Unidos.** No es un público a captar: es ruido que
   además ensucia todas las métricas. Conviene mirar siempre las sesiones filtradas
   por España.
