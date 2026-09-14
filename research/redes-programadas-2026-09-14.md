# Auditoría del calendario de redes

**Fecha:** 14 de septiembre de 2026 · Marca Metricool `patitascalidas` (6914116)

## Lo que había

**72 publicaciones programadas** del 14 de septiembre al 25 de noviembre,
creadas el 10 de septiembre. Casi todas solo en TikTok (39 de las 40 primeras),
y **solo 2 de 40 llevaban vídeo**: el resto son imágenes.

Los 32 vídeos de `assets/video/` siguen sin usarse.

## Dos fallos encontrados

### 1. Un enlace que llevaba a una página que no existe

La publicación del **22 de septiembre** enlazaba a
`/products/alas-murcielago-halloween`, que devolvía **404**.

Causa: el producto estaba `ACTIVE` pero **sin publicar en la tienda online**
(`onlineStoreUrl: null`). Es la trampa de siempre: activo no es lo mismo que
publicado. Le pasaba lo mismo al **gorro de Halloween**.

**Arreglado**: los dos publicados en los 4 canales y comprobados, ahora
responden 200. Además toca: la temporada de Halloween empieza a mediados de
septiembre, así que era el momento de encenderlos igualmente.

### 2. Todos los enlaces apuntaban al dominio interno

**67 de las 72** publicaciones llevaban `g5d031-ir.myshopify.com` en vez de
`patitascalidas.com`.

Los enlaces **funcionan** (Shopify redirige con un 301), pero en un pie de
TikTok se lee como spam, y el clic es la métrica número uno de esta cuenta.

**Corregidas 44** hasta ahora, verificadas leyendo de Metricool. Quedan 28,
todas entre el 29 de octubre y el 25 de noviembre.

## Pendiente de verdad

- Terminar las 28 restantes.
- **Meter los 32 vídeos.** Un calendario de imágenes en TikTok rinde mucho menos
  que uno de vídeo, y los vídeos ya están grabados y subidos al repositorio.
- Instagram y Facebook están casi vacíos: 3 y 2 publicaciones de 72.
