# Pruebas exhaustivas de la tienda

Fecha: 2026-09-05. Todo lo de abajo esta comprobado ejecutando la prueba,
no leyendo la configuracion.

## Resumen

54 comprobaciones. 39 pasan, 10 defectos encontrados: 7 corregidos, 3 que
solo se pueden tocar a mano en el panel. Y una correccion a un aviso mio
anterior que era falso.

## PASA

### Venta
- Tienda publica, sin contrasena (`/password` redirige a la portada)
- **IVA 21% correcto.** Pedido de 29,90 EUR a Valladolid -> `ES IVA 21%`,
  5,19 EUR. La cuenta cuadra: 29,90 / 1,21 = 24,71, IVA 5,19
- **El envio tambien lleva IVA.** 29,90 + 6,99 = 36,89 con 6,40 de IVA.
  El IVA del producto solo son 5,19, asi que el envio aporta 1,21, que es
  exactamente el 21% de 6,99
- Envio gratis a partir de 55 EUR: cesta de 84,80 -> 0,00 de portes
- Tarifa estandar 6,99 EUR disponible en Espana
- 96 de 96 variantes vendibles: sin seguimiento de stock, politica
  CONTINUE, `availableForSale: true`. Nada bloquea una compra
- Las 96 llevan peso real (10 g la funda de AirTag, 1.500 g la manta XL)
- Una sola ubicacion, activa y sirviendo pedidos online

### Web
- 44 de 44 URLs devuelven 200: portada, 7 colecciones, 29 fichas,
  5 politicas, carrito, buscador, sitemap y robots
- Las 5 politicas legales existen y tienen contenido real: plazo maximo
  de 30 dias naturales (art. 66 bis TRLGDCU), 14 dias de desistimiento
- SEO de fichas correcto: titulos de 57 a 76 caracteres, descripciones de
  104 a 152, y esquema JSON-LD de tipo Product en todas
- 54 imagenes: **todas** con alt, **todas** con width y height, 49 en
  lazy y 5 en carga inmediata (las de arriba, que es lo correcto para el LCP)
- Ya no queda ningun hueco gris de imagen de relleno
- Sitemap coherente: 29 productos, 7 colecciones, 4 paginas

### Proveedor
- Mapa de SKU: **96 SKU, 0 sin mapeo**
- **29 de 29 productos tienen ruta China -> Espana.** Entre 10 y 20
  opciones de transporte cada uno. La mas barata va de 3,12 USD (funda de
  AirTag, 4-9 dias) a 12,23 USD (escalera, 8-15 dias)
- La automatizacion de pedidos funciona de punta a punta en simulacion:
  lee el pedido, traduce los SKU a vid, parte el pack en sus 3 articulos,
  elige el transporte mas barato y monta el payload con todos los campos
  obligatorios de CJ

## CORRECCION A UN AVISO MIO ANTERIOR

Dije que habia que activar "cobrar impuestos sobre las tarifas de envio"
porque si no el envio se facturaria sin IVA. **Era falso.** El campo
`taxShipping` sigue en false, pero el calculo real si aplica el 21% al
envio (comprobado arriba). Ese campo es de la epoca del sistema fiscal
antiguo y ya no manda. No hay nada que tocar.

## DEFECTOS CORREGIDOS

1. **Precio falso en el resultado de Google.** La meta descripcion del
   pack decia "39,90 en vez de 49,70 por separado". La suma real es
   54,70 y la ficha ya lo decia bien: solo estaba mal el texto que ve
   Google. Corregido.
2. **11 fichas con los acentos comidos en el SEO**: "Pack bano y lluvia",
   "sofa", "rapido", "Boton", "ensenale", "antiestres", "Cinturon",
   "arnes", "Circulacion", "presion", "absorcion", "tamanos", "liquidos",
   "maquina", "pate", "banera". Salian asi en Google. Corregidas todas.
3. **Cortapelo de patas sin titulo SEO** (`seo.title: null`). Puesto.
4. **Higiene y cuidado** se describia solo como manoplas y toallas, y
   tiene 10 productos incluidas lima de unas, cortapelo y cepillos.
5. **Casa, coche y paseo** se describia solo como mantas y fundas, y
   tiene 14 productos incluidos arnes, bozal, chubasquero y parque.
6. **Comederos** decia "14 dias para devolver" como relleno en vez de
   describir lo que hay. Reescrita con los productos reales.
7. **Packs** hablaba de "packs de comederos lentos" y el unico pack que
   hay es el de bano y lluvia.
8. **La pagina de envios prometia UE (8,99) e internacional (12,99)** y
   el checkout los rechaza. Reescrita a Espana peninsular, con el plazo
   real y diciendo claro que la mercancia sale de China y que el IVA de
   importacion va incluido por IOSS.

## DEFECTOS QUE NO PUEDO TOCAR

9. **La portada no tiene SEO.** El titulo y la meta descripcion son
   literalmente "Prestige". Es la etiqueta mas valiosa de la web.
   Texto listo para pegar en `research/textos/seo-portada.txt`.
10. **El checkout no muestra plazo de entrega** (`description: null` en
    las dos tarifas de Espana) mientras la portada promete que "el plazo
    de entrega real lo ves antes de pagar". La API lo rechaza porque la
    tarifa usa el sistema nuevo de condiciones de rango.
    Texto en `research/textos/plazo-checkout.txt`.
11. **La politica de envio sigue prometiendo UE e internacional.** No
    tengo permiso `write_legal_policies`. Texto completo listo para pegar
    en `research/textos/politica-envio.html`.

## CAUSA RAIZ DEL LIO DE LOS ENVIOS

El perfil de envio tiene zonas para 41 paises (UE a 8,99 e internacional
a 12,99) y `shipsToCountries` los lista. Pero **el unico mercado es
Espana y su unica region es ES**. Los mercados son los que mandan: un
cliente frances o estadounidense recibe cero metodos de envio y no puede
pagar. Comprobado con dos pedidos de prueba (Paris y Austin): ambos
devuelven `availableShippingRates: []`.

Las zonas sobran o falta el mercado. Decidir una de las dos:
- **Solo Espana** (lo que ya esta): borrar las zonas UE e internacional
  para que no confundan. Es lo coherente con una tienda nueva que aun no
  puede facturar bien.
- **Vender a la UE**: activar los mercados. Implica IVA por OSS al pasar
  de 10.000 EUR de ventas a distancia, y revisar que 8,99 cubra el porte
  real de CJ a cada pais.

## OTROS PUNTOS MENORES

- **Formato de moneda mezclado en la misma pagina**: Shopify pinta
  `39,90 EUR` como "€39,90" y el texto escrito a mano pone "39,90 €".
  En Espana se escribe el simbolo detras. Ajustes -> Datos de la tienda.
- **`/collections/frontpage` esta indexada y vacia** (0 productos).
  Pagina sin contenido en el sitemap.
- **El menu dice "Casa y coche" y la coleccion se llama "Casa, coche y
  paseo"**. Conviene que coincidan.
- **La direccion fiscal es "Calle Me Falta un Tornillo 3"**, Arroyo de la
  Encomienda. Va en las facturas y en la verificacion de Shopify
  Payments: conviene confirmar que es la direccion registrada real.
