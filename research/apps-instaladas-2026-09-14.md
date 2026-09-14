# Auditoría de las apps instaladas

**Fecha:** 14 de septiembre de 2026 · Tienda `g5d031-ir` (patitascalidas.com)

## Cómo se comprobó (no es una opinión)

- **Inventario**: `locations` devuelve **una sola ubicación real**, "Sucursal de
  la tienda". Las 7 apps de dropshipping crearon cada una su ubicación de
  servicio, pero **ninguna tiene stock asignado**. Quitarlas no deja productos
  huérfanos.
- **Tema**: los 15 ficheros de plantilla y `layout/theme.liquid` no contienen
  **ni una sola** referencia `shopify://apps/`. Cero bloques de app.
- **Secciones**: las 41 secciones del tema son las estándar de Horizon más
  `patitas-home.liquid`, que es nuestra. Ninguna viene de Section Store.
- **Portada real** (cargada como un cliente): los únicos dominios que carga son
  de Shopify. Ningún script de terceros.
- **Píxeles**: **PagePilot sí tiene un píxel activo** que envía datos de tus
  visitantes a `stats.pagepilot.ai`.

## Se pueden quitar sin riesgo (9)

Duplicados de CJ que no hacen nada, o restos:

| App | Por qué |
| --- | --- |
| Syncee AI Dropship | proveedor alternativo, sin usar |
| Dropshipper-ai | ídem |
| DSers-AliExpress Dropshipping | ídem |
| Aliexpress Dropshipping Center | ídem |
| TeemDrop-Dropshipping | ídem |
| Zopi Dropshipping | ídem |
| Optima Connecter | conector de proveedor, sin usar |
| Section Store | ninguna sección suya está en el tema |
| **PagePilot: AI Page Builder** | **además te está rastreando a los visitantes** |

## A decidir (4)

| App | Situación |
| --- | --- |
| TikTok Shop — SPL | vender *dentro* de TikTok. Tú publicas en TikTok con Metricool, que es otra cosa. Si no vas a abrir tienda en TikTok, sobra. |
| Canva Connect | solo sirve para mandar diseños de Canva a la tienda. Inofensiva. |
| Cloud: Claude Ai Assistant | chatbot de terceros, NO es la conexión de Claude. Si no lo usas, fuera. |
| Shopify ChatGPT MCP App | conecta ChatGPT con la tienda. Si no lo usas, fuera. |

## NO tocar (3)

- **Shopify Claude Connector App** — es por donde trabajo yo.
- **CJdropshipping: Much Faster** — el proveedor real.
- **Google & YouTube** — además de Merchant Center, **sostiene la verificación
  de Search Console**. Si se quita, se pierde.

Las de Shopify (Messaging, Knowledge Base, Shop, Point of Sale) no se tocan.

## Nota técnica

La mutación `appUninstall` de la Admin API **no sirve para esto**: no acepta
argumentos porque desinstala la app que la llama, o sea la conexión de Claude.
Desinstalar otras apps solo se puede desde el panel:
`https://admin.shopify.com/store/g5d031-ir/settings/apps`
