# Segunda tanda de gatos, y Halloween montado con fecha

10 de septiembre de 2026.

## Gatos: dos que sí pasan

De los tres frentes que quedaban abiertos en `research/gatos-2026-09-10.md`
(red de balcón, fuente de agua, arenero plegable), se han barrido tres
categorías nuevas —hamacas, protectores de muebles y barreras— y han salido dos.

| Producto | Coste | Porte | PVP | Margen |
|---|---:|---:|---:|---:|
| **Hamaca de ventana con ventosas**, 54 × 30 cm, aguanta 18 kg | 2,88 $ | 7,10 € | **24,90 €** | 10,14 € (41 %) |
| **Protector de sofá antiarañazos**, rollo 100 × 40 cm, 7 colores | 1,92 $ | 4,54 € | **18,90 €** | 8,73 € (46 %) |

La hamaca la tienen listada **105 vendedores** de CJ, que es el número más alto
de todo lo mirado hoy, y publica medidas y aguante en una foto de especificación.
El protector publica 100 × 40 × 0,5 cm y lo listan 30.

### Lo que se ha caído

- **La "red de protección"** (`2504010751441618300`), que parecía cubrir
  `red para gatos` (2.900/mes), resultó ser **una barrera de puerta**, no una
  red de balcón. Y ya tenemos esa: `barrera-seguridad-perro` a 24,90 €.
  Descartada por duplicada. La palabra `red para gatos` sigue sin cubrir: lo que
  se busca es malla de balcón, y eso CJ no lo tiene en estas categorías.
- **Hamaca de 220 g a 1,00 $**: la lista de contenido del proveedor dice
  "Mesh Laundry Cover x1pc". Es **solo la funda de repuesto**, no la hamaca.
  Se habría vendido un recambio como si fuera el producto.
- **Capucha de murciélago para gato**: talla única y fotos limpias, pero la
  única medida es "bufanda 30 cm", que no dice a qué gato le vale, y las fotos
  son caseras y desentonan con el resto del catálogo.

## Halloween

Dos productos, los dos con medida publicada, que es lo raro en disfraces:

| Producto | Coste | Porte | PVP | Margen |
|---|---:|---:|---:|---:|
| **Alas de murciélago luminosas**, S/M/L, pecho de 44 a 95 cm | 3,65-4,39 $ | 3,50-4,05 € | **19,90 €** | 7,76-8,99 € |
| **Gorro de Halloween**, seis diseños, talla única | 1,00 $ | 2,94 € | **12,90 €** | 6,33 € (49 %) |

Las alas traen tabla de tallas de verdad: contorno de pecho, contorno de cuello
y envergadura, por talla. Venía dentro de una foto en inglés y en pulgadas, así
que se ha redibujado en español con la herramienta nueva
`scripts/fotos/tabla-tallas.py`. **Las listan 128 vendedores.**

Sobre el brillo: el fabricante las vende como luminosas y dice que llevan
pintura fosforescente, pero no dice cuánto dura el brillo ni con cuánta luz se
cargan. La ficha lo cuenta así, atribuido, y avisa de que **no son un
reflectante de seguridad**. La única foto donde se ve el brillo verde llevaba un
rótulo en inglés sobre la luna y los murciélagos: al borrarlo quedaba un parche
gris que cortaba el fondo, así que la foto se descarta en vez de taparla.

### Lo que se ha caído en Halloween

- **Esqueleto que brilla en la oscuridad** (`1837332373017874432`): lo listan
  **223 vendedores**, el más popular de toda la búsqueda, y aun así fuera:
  S/M/L/XL y ni un centímetro en la ficha, la descripción ni las fotos.
- **Jersey de punto, disfraz de Papá Noel, alas sin tabla, pañuelos**: lo mismo.

### Un dato que corrige la regla del porte

Las alas talla L tienen un bulto de **605 mm de lado mayor** y aun así pagan
**4,04 €**, no la tarifa de sobredimensionado. El umbral de los 600 mm de la
skill es orientativo, no un muro: por encima **hay que medir**, no descartar.

## El encendido y el apagado

Pablo pidió que Halloween se encienda en octubre y se apague el 1 de noviembre.

**Lo que Shopify sabe hacer solo:** `publishablePublish` acepta `publishDate`.
Los dos productos y la colección están programados para el
**30/9/2026 22:00 UTC** = 1 de octubre a las 00:00 de España. Comprobado con
`resourcePublicationsV2(onlyPublished: false)`: la fecha está guardada.

**Lo que no:**
1. **Solo el canal Tienda online acepta fecha programada.** Shop y TikTok
   descartan el `publishDate` en silencio: el producto se queda sin publicar en
   esos dos canales y no se publicará solo. Hay que marcarlos a mano el 1 de
   octubre.
2. **No existe despublicación programada.** Shopify no sabe apagar en una fecha.

Para las dos cosas hay Routines creados (`trig_017wWZ1oMALfy8xYtn9NfiG9` el 1 de
octubre y `trig_01Y68y8xbw5wf3Nr9KsiAQ7b` el 1 de noviembre), pero **se crearon
sin el conector de Shopify**: la API de Routines solo puede pasar conectores que
tenga la sesión que los crea, y esta no los tenía en un formato transferible.
Así que llegan como aviso con los pasos, no como automatismo. Para que sea
automático de verdad, los Routines hay que crearlos desde claude.ai adjuntando
el conector de Shopify.

Los productos **no se borran** el 1 de noviembre, solo se despublican: el año que
viene se encienden otra vez sin rehacer fotos, tabla de tallas ni mapeo de SKU.
