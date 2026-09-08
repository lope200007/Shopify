# Plan visual con Higgsfield

8 septiembre 2026. Prompts escritos y listos para lanzar.

## La regla que no se salta

**Higgsfield no toca ni una sola foto de producto.**

Un cliente que ve una imagen generada y recibe el objeto físico recibe otra
cosa. Eso es exactamente el engaño clásico del dropshipping, y es lo contrario
de lo que hemos construido: en esta misma tienda hemos quitado «envío desde
Europa», «barrera enrollable», el logotipo de un competidor y una garantía de
tres años que no existía.

| Dónde SÍ | Por qué |
| --- | --- |
| Portada (hero) | Es ambiente, no promete ningún producto |
| Banners de colección | Igual: una categoría, no un artículo |
| Portadas de blog | Ilustración editorial |
| Instagram | Contenido, no catálogo |
| Fondos y texturas | No representan nada vendible |

| Dónde NO | Por qué |
| --- | --- |
| Galería de producto | El cliente recibiría algo distinto |
| Cualquier imagen con nuestro producto reconocible | Aunque sea de ambiente, insinúa cómo es |

**Corolario:** en las imágenes de ambiente, el producto no aparece. Perro y
casa, no perro usando algo que parece lo nuestro pero no lo es.

## Dirección de arte

Para que no salga la estampa genérica de IA que se reconoce a un kilómetro:

- **Luz natural de tarde**, cálida, entrando por una ventana. Nada de estudio.
- **Casa española de verdad**: suelo de gres o parquet, persiana, terraza
  pequeña. No la cocina americana de revista estadounidense.
- **Perros mestizos** y razas que se ven aquí. No siempre un golden retriever.
- **Paleta de la marca**: crema `#fbf7f1`, verde `#1f4a37`, terracota
  `#a94f1e`, tinta `#23261f`.
- **Sin texto dentro de la imagen.** Los modelos lo escriben mal y en inglés.
- **Sin producto reconocible.**

## Lo que cuesta

Preflight real con `get_cost`, sin gastar nada: **8 créditos por imagen** a 2k
con Recraft V4.1. La cuenta tiene **0 créditos** y plan gratuito, y no hay bolsa
de generaciones gratis (`unlim: false`).

| Lote | Imágenes | Créditos |
| --- | ---: | ---: |
| Portada | 1 | 8 |
| Banners de colección | 7 | 56 |
| **Primer lote** | **8** | **64** |
| Margen para repetir las que no salgan | ~2 | 16 |
| **Total realista** | | **~80** |

## Los prompts

Modelo `recraft_v4_1`, `model_type: standard`, `resolution: 2k`.

### Portada — 16:9

> Warm late-afternoon sunlight through a window in a real Spanish flat, terrazzo
> and light oak floor, a calm medium-sized mixed-breed dog lying on a woven rug,
> cream and sage-green interior, soft natural shadows, shallow depth of field,
> photographed on 35mm film, no products visible, no text

### Banners de colección — 4:3

| Colección | Prompt |
| --- | --- |
| Comederos y bebederos | *A mixed-breed dog waiting patiently on a tiled kitchen floor in a Spanish home, warm morning light, empty floor in the foreground, cream and terracotta tones, 35mm film, no bowls or products visible, no text* |
| Juguetes | *A young mixed-breed dog mid-play on a living room rug, motion blur in the tail, warm afternoon light through a balcony door, sage green sofa, 35mm film, no toys visible, no text* |
| Higiene y cuidado | *A small long-haired dog sitting calmly on a bathroom floor after a bath, damp fur, soft window light, white tiles and cream towels out of focus, 35mm film, no products visible, no text* |
| Lluvia y barro | *A wet mixed-breed dog standing at the door of a Spanish flat after a rainy walk, wet paw prints on the tiles, grey daylight, muted tones, 35mm film, no clothing or products, no text* |
| Camas y descanso | *An older dog asleep curled on a rug in a quiet living room, late golden light, cream and sage tones, deep calm, 35mm film, no bed or products visible, no text* |
| Casa, coche y paseo | *A dog looking out of a car's open boot in a Spanish street, late afternoon sun, warm dust in the air, blurred façades behind, 35mm film, no covers or products visible, no text* |
| También para gatos | *A cat and a dog resting on the same sunlit floor of a Spanish flat, calm coexistence, warm light, cream tones, 35mm film, no products visible, no text* |

## Después de generar

1. Descargar, recortar y meter en `assets/fotos/`.
2. Subir con `collectionUpdate` (banners) y `themeFilesUpsert` sobre el tema
   duplicado (portada), que en el tema en vivo está bloqueado.
3. Alt en castellano y descriptivo: en este tema **el alt se ve como pie de
   foto**.
4. Comprobar la portada y una colección renderizando, no solo por API.
