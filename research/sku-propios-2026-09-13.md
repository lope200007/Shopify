# El SKU de la tienda deja de ser el del proveedor

13 de septiembre de 2026.

## Por qué

Shopify publica el `sku` de cada variante en el JSON de la ficha y en el
endpoint `/products/<handle>.js`. Mirando el código fuente de cualquier
producto salía tal cual:

```
"sku":"CJCT257892301AZ","title":"Rojo"
```

Con ese código, pegarlo en Google lleva al artículo en CJdropshipping.
Y en cada ficha aparecían además los SKU de los productos recomendados,
así que no bastaba con cuidar uno.

## Qué se ha hecho

Las 388 variantes del catálogo pasan a llevar un SKU propio,
`PTC-<producto>-<nn>`. La traducción a `vid` de CJ —lo único que CJ acepta
para servir un pedido— vive en el `manual` de `scripts/cj/mapa.js`, que no
sale a la web.

Antes de renombrar nada se comprobó que **las 388 resolvían** con el SKU
viejo, y después que **las 388 resuelven al mismo `vid`** con el nuevo. No se
ha perdido la trazabilidad de ninguna: la tabla de abajo guarda el SKU viejo.

Los cinco packs (`PACK-COCHE`, `PACK-CACHORRO`…) ya eran propios y no se
tocan: el mapa los descompone en sus piezas.

## Lo que queda expuesto y conviene saber

El repositorio `lope200007/Shopify` es **público** —tiene que serlo para que
Shopify pueda descargar las fotos de `raw.githubusercontent.com`— y dentro
están `proveedores/cj/*.json` con los volcados del proveedor y el propio
`mapa.js`. Desde la tienda no se llega: Shopify se queda una copia de cada
foto y sirve desde `patitascalidas.com/cdn/`, así que la URL de GitHub no
aparece en ninguna parte. Pero si alguien encuentra el repositorio, lo ve
todo. Si eso preocupa, la solución es mover las fotos a un bucket propio y
poner el repositorio en privado.

## La tabla

| Producto | SKU nuevo | SKU viejo | vid de CJ |
|---|---|---|---|
| comedero-rotativo-antivoracidad | `PTC-COMROT-01` | `CJPB29867110001` | `2077407482368778242` |
| comedero-rotativo-antivoracidad | `PTC-COMROT-02` | `CJPB29867110002` | `2077407482368778243` |
| comedero-rotativo-antivoracidad | `PTC-COMROT-03` | `CJPB29867110003` | `2077407482368778244` |
| alfombrilla-de-lamer-con-ventosas | `PTC-ALFLAM-01` | `CJFT303204901AZ` | `2084198472767287297` |
| alfombrilla-de-lamer-con-ventosas | `PTC-ALFLAM-02` | `CJFT303204902BY` | `2084198472767287298` |
| alfombrilla-de-lamer-con-ventosas | `PTC-ALFLAM-03` | `CJFT303204905EV` | `2084198472767287301` |
| alfombrilla-de-lamer-con-ventosas | `PTC-ALFLAM-04` | `CJFT303204906FU` | `2084198472767287302` |
| bola-dispensadora-de-premios | `PTC-BOLAPRE-01` | `CJCT291495601AZ` | `2060273902021038082` |
| bola-dispensadora-de-premios | `PTC-BOLAPRE-02` | `CJCT291495602BY` | `2060273902021038083` |
| manopla-de-bano-y-secado | `PTC-MANOPLA-01` | `CJGY137221901AZ` | `1467402060050862080` |
| albornoz-de-secado-para-perro | `PTC-ALBORNOZ-01` | `CJPT224333908HS` | `1867764905823588359` |
| albornoz-de-secado-para-perro | `PTC-ALBORNOZ-02` | `CJPT224333909IR` | `1867764905823588360` |
| albornoz-de-secado-para-perro | `PTC-ALBORNOZ-03` | `CJPT224333910JQ` | `1867764905823588361` |
| albornoz-de-secado-para-perro | `PTC-ALBORNOZ-04` | `CJPT224333911KP` | `1867764905823588362` |
| albornoz-de-secado-para-perro | `PTC-ALBORNOZ-05` | `CJPT224333912LO` | `1867764905823588363` |
| toalla-de-secado-rapido-para-perro | `PTC-TOALLA-01` | `CJYD280148201AZ` | `2603240357051635000` |
| toalla-de-secado-rapido-para-perro | `PTC-TOALLA-02` | `CJYD280148202BY` | `2603240357051635300` |
| toalla-de-secado-rapido-para-perro | `PTC-TOALLA-03` | `CJYD280148203CX` | `2603240357051635600` |
| manta-impermeable-para-sofa-y-cama | `PTC-MANTAIMP-01` | `CJYD216461901AZ` | `2410190544541601000` |
| manta-impermeable-para-sofa-y-cama | `PTC-MANTAIMP-02` | `CJYD216461902BY` | `2410190544541601100` |
| manta-impermeable-para-sofa-y-cama | `PTC-MANTAIMP-03` | `CJYD216461903CX` | `2410190544541601300` |
| manta-impermeable-para-sofa-y-cama | `PTC-MANTAIMP-04` | `CJYD216461904DW` | `2410190544541601400` |
| funda-de-asiento-coche-para-perro | `PTC-FUNDASIE-01` | `CJCM299120801AZ` | `2078058480552665089` |
| funda-de-asiento-coche-para-perro | `PTC-FUNDASIE-02` | `CJCM299120802BY` | `2078058480552665090` |
| funda-de-asiento-coche-para-perro | `PTC-FUNDASIE-03` | `CJCM299120803CX` | `2078058480552665091` |
| cepillo-autolimpiable-para-perro | `PTC-CEPAUTO-01` | `CJHR306129801AZ` | `2088184366503477249` |
| cepillo-autolimpiable-para-perro | `PTC-CEPAUTO-02` | `CJHR306129802BY` | `2088184366503477250` |
| cepillo-autolimpiable-para-perro | `PTC-CEPAUTO-03` | `CJHR306129803CX` | `2088184366507671554` |
| cepillo-autolimpiable-para-perro | `PTC-CEPAUTO-04` | `CJHR306129804DW` | `2088184366507671555` |
| cepillo-autolimpiable-para-perro | `PTC-CEPAUTO-05` | `CJHR306129809IR` | `2088184366507671560` |
| cepillo-autolimpiable-para-perro | `PTC-CEPAUTO-06` | `CJHR306129810JQ` | `2088184366507671561` |
| cepillo-autolimpiable-para-perro | `PTC-CEPAUTO-07` | `CJHR306129805EV` | `2088184366507671556` |
| cepillo-autolimpiable-para-perro | `PTC-CEPAUTO-08` | `CJHR306129806FU` | `2088184366507671557` |
| cepillo-autolimpiable-para-perro | `PTC-CEPAUTO-09` | `CJHR306129807GT` | `2088184366507671558` |
| cepillo-autolimpiable-para-perro | `PTC-CEPAUTO-10` | `CJHR306129808HS` | `2088184366507671559` |
| comedero-lento-y-alfombrilla-de-lamer | `PTC-COMLENTO-01` | `CJTE305824401AZ` | `2087805699045380098` |
| comedero-lento-y-alfombrilla-de-lamer | `PTC-COMLENTO-02` | `CJTE305824402BY` | `2087805699045380099` |
| lima-de-unas-electrica-para-perros | `PTC-LIMAVIEJ-01` | `CJYD229040401AZ` | `2502130413411612100` |
| lima-de-unas-electrica-para-perros | `PTC-LIMAVIEJ-02` | `CJYD229040402BY` | `2502130413411612300` |
| lima-de-unas-electrica-para-perros | `PTC-LIMAVIEJ-03` | `CJYD229040403CX` | `2502130413411612400` |
| boton-grabable-para-perros | `PTC-BOTON-01` | `CJYD232561601AZ` | `2503121315271620500` |
| boton-grabable-para-perros | `PTC-BOTON-02` | `CJYD232561602BY` | `2503121315271620701` |
| boton-grabable-para-perros | `PTC-BOTON-03` | `CJYD232561603CX` | `2503121315271620900` |
| boton-grabable-para-perros | `PTC-BOTON-04` | `CJYD232561604DW` | `2503121315271621001` |
| funda-collar-airtag-perro | `PTC-FUNDAIRT-01` | `CJYD224733901AZ` | `2412180936151613000` |
| funda-collar-airtag-perro | `PTC-FUNDAIRT-02` | `CJYD224733903CX` | `2412180936151613400` |
| funda-collar-airtag-perro | `PTC-FUNDAIRT-03` | `CJYD224733904DW` | `2412180936151613700` |
| funda-collar-airtag-perro | `PTC-FUNDAIRT-04` | `CJYD224733908HS` | `2412180936151614600` |
| peluche-con-chirriador-para-perro | `PTC-PELUCHIR-01` | `CJST219013201AZ` | `1855535301356572672` |
| peluche-con-chirriador-para-perro | `PTC-PELUCHIR-02` | `CJST219013202BY` | `1855535301356572673` |
| chubasquero-para-perro | `PTC-CHUBAS-01` | `CJGD170305806FU` | `1634111067125198848` |
| chubasquero-para-perro | `PTC-CHUBAS-02` | `CJGD170305807GT` | `1634111067179724800` |
| chubasquero-para-perro | `PTC-CHUBAS-03` | `CJGD170305808HS` | `1634111067234250752` |
| chubasquero-para-perro | `PTC-CHUBAS-04` | `CJGD170305809IR` | `1634111067288776704` |
| chubasquero-para-perro | `PTC-CHUBAS-05` | `CJGD170305810JQ` | `1634111067343302656` |
| chubasquero-para-perro | `PTC-CHUBAS-06` | `CJGD170305811KP` | `1634111067402022912` |
| chubasquero-para-perro | `PTC-CHUBAS-07` | `CJGD170305812LO` | `1634111067456548864` |
| chubasquero-para-perro | `PTC-CHUBAS-08` | `CJGD170305813MN` | `1634111067515269120` |
| chaleco-antiestres-para-perro | `PTC-CHALECO-01` | `CJGD208667402BY` | `2407180220271602000` |
| chaleco-antiestres-para-perro | `PTC-CHALECO-02` | `CJGD208667403CX` | `2407180220271602400` |
| chaleco-antiestres-para-perro | `PTC-CHALECO-03` | `CJGD208667404DW` | `2407180220271602500` |
| chaleco-antiestres-para-perro | `PTC-CHALECO-04` | `CJGD208667405EV` | `2407180220271602700` |
| chaleco-antiestres-para-perro | `PTC-CHALECO-05` | `CJGD208667406FU` | `2407180220271602800` |
| cinturon-seguridad-coche-perro | `PTC-CINTURON-01` | `CJGX134691101AZ` | `1457908873263452160` |
| bozal-de-nailon-para-perro | `PTC-BOZALNAI-01` | `CJGY168458005EV` | `1625734112738816000` |
| bozal-de-nailon-para-perro | `PTC-BOZALNAI-02` | `CJGY168458006FU` | `1625734112755593216` |
| bozal-de-nailon-para-perro | `PTC-BOZALNAI-03` | `CJGY168458007GT` | `1625734112772370432` |
| bozal-de-nailon-para-perro | `PTC-BOZALNAI-04` | `CJGY168458008HS` | `1625734112784953344` |
| conjunto-arnes-correa-reflectante | `PTC-CONJARN-01` | `CJGX131815-SET-S-NEG` | `2601110812321604800` |
| conjunto-arnes-correa-reflectante | `PTC-CONJARN-02` | `CJGX131815-SET-S-NAR` | `2601110812321605500` |
| conjunto-arnes-correa-reflectante | `PTC-CONJARN-03` | `CJGX131815-SET-S-ROJ` | `2601110812321606200` |
| conjunto-arnes-correa-reflectante | `PTC-CONJARN-04` | `CJGX131815-SET-M-NEG` | `2601110812321604600` |
| conjunto-arnes-correa-reflectante | `PTC-CONJARN-05` | `CJGX131815-SET-M-NAR` | `2601110812321605300` |
| conjunto-arnes-correa-reflectante | `PTC-CONJARN-06` | `CJGX131815-SET-M-ROJ` | `2601110812321606000` |
| conjunto-arnes-correa-reflectante | `PTC-CONJARN-07` | `CJGX131815-SET-L-NEG` | `2601110812321604500` |
| conjunto-arnes-correa-reflectante | `PTC-CONJARN-08` | `CJGX131815-SET-L-NAR` | `2601110812321605100` |
| conjunto-arnes-correa-reflectante | `PTC-CONJARN-09` | `CJGX131815-SET-L-ROJ` | `2601110812321605800` |
| conjunto-arnes-correa-reflectante | `PTC-CONJARN-10` | `CJGX131815-SET-XL-NEG` | `2601110812321605000` |
| conjunto-arnes-correa-reflectante | `PTC-CONJARN-11` | `CJGX131815-SET-XL-NAR` | `2601110812321605700` |
| conjunto-arnes-correa-reflectante | `PTC-CONJARN-12` | `CJGX131815-SET-XL-ROJ` | `2601110812321606300` |
| botella-paseo-3-en-1 | `PTC-BOT3EN1-01` | `CJMY179795-IND` | `1678644524677079040` |
| botella-paseo-3-en-1 | `PTC-BOT3EN1-02` | `CJMY179795-VER` | `1678644524953903104` |
| botella-paseo-3-en-1 | `PTC-BOT3EN1-03` | `CJMY179795-GRI` | `1678644525016817664` |
| botella-paseo-3-en-1 | `PTC-BOT3EN1-04` | `CJMY179795-BLA` | `1678644525079732224` |
| cepillo-autolimpiable-pulverizador | `PTC-CEPPULV-01` | `CJMY171222-BLA` | `1637798503055372288` |
| cepillo-autolimpiable-pulverizador | `PTC-CEPPULV-02` | `CJMY171222-ROS` | `1650372877348249600` |
| cepillo-autolimpiable-pulverizador | `PTC-CEPPULV-03` | `CJMY171222-VER` | `1650372877394386944` |
| guante-quitapelo-silicona | `PTC-GUANTEQP-01` | `CJYD233200-1U` | `2503191148021601500` |
| guante-quitapelo-silicona | `PTC-GUANTEQP-02` | `CJYD233200-2U` | `2505200823161622300` |
| dispensador-gravedad-pienso-agua | `PTC-DISPGRAV-01` | `CJMY163699-S-GRI` | `1602564551311110144` |
| dispensador-gravedad-pienso-agua | `PTC-DISPGRAV-02` | `CJMY163699-S-ROS` | `1602564551315304448` |
| dispensador-gravedad-pienso-agua | `PTC-DISPGRAV-03` | `CJMY163699-D-GRI` | `1602564551311110145` |
| dispensador-gravedad-pienso-agua | `PTC-DISPGRAV-04` | `CJMY163699-D-ROS` | `1602564551315304449` |
| lima-electrica-unas-perro | `PTC-LIMAELEC-01` | `CJGY200835-VER` | `1778298416821448704` |
| lima-electrica-unas-perro | `PTC-LIMAELEC-02` | `CJGY200835-BLA` | `1778298416888557568` |
| cortapelo-patas-perro | `PTC-CORTAPEL-01` | `CJMY206336-BLA` | `2406181119581626900` |
| cubremaletero-perro-coche | `PTC-CUBREMAL-01` | `CJGY200603-NEG` | `2502060218301618100` |
| comedero-puzzle-tres-capas | `PTC-COMPUZZ-01` | `CJMY191848-3C` | `1734125879615295488` |
| tentetieso-dispensador-premios | `PTC-TENTE-01` | `CJYD196025-ROJ` | `1752236157204705280` |
| tentetieso-dispensador-premios | `PTC-TENTE-02` | `CJYD196025-VER` | `1752236157309562880` |
| parque-plegable-perro | `PTC-PARQUE-01` | `CJGY00115-74-AZU` | `2660E0F1-05D7-44A8-BD83-9324CF4317E2` |
| parque-plegable-perro | `PTC-PARQUE-02` | `CJGY00115-74-GRI` | `403543B2-25D8-4267-8541-3D1E42EC4712` |
| parque-plegable-perro | `PTC-PARQUE-03` | `CJGY00115-91-AZU` | `9870FA19-E5D6-4330-AFD2-D2BACB052F90` |
| parque-plegable-perro | `PTC-PARQUE-04` | `CJGY00115-91-GRI` | `5E6A1E93-F102-448B-9E97-023F4E532E6B` |
| barrera-seguridad-perro | `PTC-BARRSEG-01` | `CJGY00196-NEG` | `17FC23FE-6B44-417C-84EF-91E4F79C65C3` |
| escalera-plegable-perro | `PTC-ESCALERA-01` | `CJGY00016-P-VER` | `01E6DCFB-A0AE-470B-8E65-390E9A62E0FA` |
| escalera-plegable-perro | `PTC-ESCALERA-02` | `CJGY00016-G-GRI` | `1E873F78-24BF-43C1-B736-1AC9E7A4D3C1` |
| escalera-plegable-perro | `PTC-ESCALERA-03` | `CJGY00016-G-VER` | `84DDDF49-6F8A-4940-AC6C-C1A006B315F7` |
| dinosaurio-peluche-perro | `PTC-DINO-01` | `CJWJ01315-25-VER` | `67946CA5-A108-4CBC-91CF-69D04209C065` |
| dinosaurio-peluche-perro | `PTC-DINO-02` | `CJWJ01315-25-NAR` | `EA69EEB4-EEE2-4EEC-85C6-1BF4C0B05BC1` |
| dinosaurio-peluche-perro | `PTC-DINO-03` | `CJWJ01315-50-VER` | `C7EC971B-D0ED-472B-B4F3-82C8398D957C` |
| dinosaurio-peluche-perro | `PTC-DINO-04` | `CJWJ01315-50-NAR` | `5F97E480-EB45-4F02-A5E5-21A53034426D` |
| limpiapatas-electrico-perro | `PTC-LIMPIAPA-01` | `CJSP312686201AZ` | `2095790355726299138` |
| limpiapatas-electrico-perro | `PTC-LIMPIAPA-02` | `CJSP312686202BY` | `2095790355726299139` |
| limpiapatas-electrico-perro | `PTC-LIMPIAPA-03` | `CJSP312686203CX` | `2095790355726299140` |
| lanzapelotas-muelle-dispensador | `PTC-LANZAPEL-01` | `CJTE312678401AZ` | `2095785486630088706` |
| lanzapelotas-muelle-dispensador | `PTC-LANZAPEL-02` | `CJTE312678402BY` | `2095785486630088707` |
| lanzapelotas-muelle-dispensador | `PTC-LANZAPEL-03` | `CJTE312678403CX` | `2095785486630088708` |
| barrera-malla-coche-perro | `PTC-BARRMALL-01` | `CJ-BARCOCHE-NEG` | `2078422303778316290` |
| bolso-transportin-bandolera | `PTC-TRANSPOR-01` | `CJ-TRANSP-CRU-S` | `2607040559551604400` |
| bolso-transportin-bandolera | `PTC-TRANSPOR-02` | `CJ-TRANSP-CRU-M` | `2607040559551604800` |
| bolso-transportin-bandolera | `PTC-TRANSPOR-03` | `CJ-TRANSP-ROS-S` | `2607040559551605300` |
| bolso-transportin-bandolera | `PTC-TRANSPOR-04` | `CJ-TRANSP-ROS-M` | `2607040559551605700` |
| bolso-transportin-bandolera | `PTC-TRANSPOR-05` | `CJ-TRANSP-VER-S` | `2607040559551606200` |
| bolso-transportin-bandolera | `PTC-TRANSPOR-06` | `CJ-TRANSP-VER-M` | `2607040559551606700` |
| correa-extensible-5-metros-linterna | `PTC-CORREAEX-01` | `CJPL305720504DW` | `2087741273234759685` |
| correa-extensible-5-metros-linterna | `PTC-CORREAEX-02` | `CJPL305720505EV` | `2087741273234759686` |
| correa-extensible-5-metros-linterna | `PTC-CORREAEX-03` | `CJPL305720506FU` | `2087741273234759687` |
| capucha-orejeras-perro | `PTC-CAPUCHA-01` | `CJPS305294401AZ` | `2087114944874561538` |
| capucha-orejeras-perro | `PTC-CAPUCHA-02` | `CJPS305294402BY` | `2087114944874561539` |
| capucha-orejeras-perro | `PTC-CAPUCHA-03` | `CJPS305294403CX` | `2087114944874561540` |
| capucha-orejeras-perro | `PTC-CAPUCHA-04` | `CJPS305294404DW` | `2087114944874561541` |
| capucha-orejeras-perro | `PTC-CAPUCHA-05` | `CJPS305294405EV` | `2087114944874561542` |
| capucha-orejeras-perro | `PTC-CAPUCHA-06` | `CJPS305294406FU` | `2087114944874561543` |
| capucha-orejeras-perro | `PTC-CAPUCHA-07` | `CJPS305294407GT` | `2087114944874561544` |
| capucha-orejeras-perro | `PTC-CAPUCHA-08` | `CJPS305294408HS` | `2087114944874561545` |
| alfombra-olfativa-perro | `PTC-ALFOLFA-01` | `CJYD292279301AZ` | `2606050638531609600` |
| alfombra-olfativa-perro | `PTC-ALFOLFA-02` | `CJYD292279302BY` | `2606050638541600200` |
| alfombra-olfativa-perro | `PTC-ALFOLFA-03` | `CJYD292279303CX` | `2608300555571628600` |
| collar-isabelino-espuma-perro | `PTC-ISABELIN-01` | `CJGX165563901AZ` | `1610539827701755904` |
| collar-isabelino-espuma-perro | `PTC-ISABELIN-02` | `CJGX165563902BY` | `1610539827701755905` |
| collar-isabelino-espuma-perro | `PTC-ISABELIN-03` | `CJGX165563904DW` | `1610539827701755906` |
| collar-isabelino-espuma-perro | `PTC-ISABELIN-04` | `CJGX165563913MN` | `1610539827710144514` |
| collar-isabelino-espuma-perro | `PTC-ISABELIN-05` | `CJGX165563914NM` | `1610539827710144515` |
| collar-isabelino-espuma-perro | `PTC-ISABELIN-06` | `CJGX165563916PK` | `1610539827714338816` |
| collar-isabelino-espuma-perro | `PTC-ISABELIN-07` | `CJGX165563905EV` | `1610539827705950208` |
| collar-isabelino-espuma-perro | `PTC-ISABELIN-08` | `CJGX165563906FU` | `1610539827705950209` |
| collar-isabelino-espuma-perro | `PTC-ISABELIN-09` | `CJGX165563908HS` | `1610539827705950210` |
| collar-isabelino-espuma-perro | `PTC-ISABELIN-10` | `CJGX165563909IR` | `1610539827705950211` |
| collar-isabelino-espuma-perro | `PTC-ISABELIN-11` | `CJGX165563910JQ` | `1610539827710144512` |
| collar-isabelino-espuma-perro | `PTC-ISABELIN-12` | `CJGX165563912LO` | `1610539827710144513` |
| collar-inflable-perro | `PTC-INFLABLE-01` | `CJJJCWGX00883-Bule-XS` | `2B42D906-58F7-44FD-8D12-338FC8F72375` |
| collar-inflable-perro | `PTC-INFLABLE-02` | `CJJJCWGX00883-Bule-S` | `0C70AC19-8D64-4C1E-8169-DC2D0F13C367` |
| collar-inflable-perro | `PTC-INFLABLE-03` | `CJJJCWGX00883-Bule-M` | `63102D77-CE7A-4114-8995-396296C85D67` |
| collar-inflable-perro | `PTC-INFLABLE-04` | `CJJJCWGX00883-Bule-L` | `DB927759-CBD9-40C7-A72E-9E7DA524BA6D` |
| collar-inflable-perro | `PTC-INFLABLE-05` | `CJJJCWGX00883-Bule-XL` | `54940D7C-FF65-463C-B15B-01D10922DAEA` |
| collar-inflable-perro | `PTC-INFLABLE-06` | `CJJJCWGX00883-Grey-XS` | `1C86A205-8E4A-4ED1-8CD8-7C72C5440859` |
| collar-inflable-perro | `PTC-INFLABLE-07` | `CJJJCWGX00883-Grey-S` | `E8C966E3-91D2-4CDE-BE86-C178797585C0` |
| collar-inflable-perro | `PTC-INFLABLE-08` | `CJJJCWGX00883-Grey-M` | `3639D627-9A7F-404F-BB6C-EB30757366AA` |
| collar-inflable-perro | `PTC-INFLABLE-09` | `CJJJCWGX00883-Grey-L` | `305A8857-7AFB-4E8D-A7B1-866C0D2A888F` |
| collar-inflable-perro | `PTC-INFLABLE-10` | `CJJJCWGX00883-Grey-XL` | `2452D115-BCE2-438B-AADF-846140C4EFC2` |
| capa-impermeable-perro-grande | `PTC-CAPALLUV-01` | `CJ-CAPA-AMA-XS` | `1853701148780679168` |
| capa-impermeable-perro-grande | `PTC-CAPALLUV-02` | `CJ-CAPA-AMA-S` | `1853701148780679169` |
| capa-impermeable-perro-grande | `PTC-CAPALLUV-03` | `CJ-CAPA-AMA-M` | `1853701148780679170` |
| capa-impermeable-perro-grande | `PTC-CAPALLUV-04` | `CJ-CAPA-AMA-L` | `1853701148780679171` |
| capa-impermeable-perro-grande | `PTC-CAPALLUV-05` | `CJ-CAPA-AMA-XL` | `1853701148780679172` |
| capa-impermeable-perro-grande | `PTC-CAPALLUV-06` | `CJ-CAPA-AMA-2XL` | `1853701148780679173` |
| capa-impermeable-perro-grande | `PTC-CAPALLUV-07` | `CJ-CAPA-AMA-3XL` | `1853701148780679174` |
| capa-impermeable-perro-grande | `PTC-CAPALLUV-08` | `CJ-CAPA-NAR-XS` | `1853701148780679182` |
| capa-impermeable-perro-grande | `PTC-CAPALLUV-09` | `CJ-CAPA-NAR-S` | `1853701148780679183` |
| capa-impermeable-perro-grande | `PTC-CAPALLUV-10` | `CJ-CAPA-NAR-M` | `1853701148780679184` |
| capa-impermeable-perro-grande | `PTC-CAPALLUV-11` | `CJ-CAPA-NAR-L` | `1853701148780679185` |
| capa-impermeable-perro-grande | `PTC-CAPALLUV-12` | `CJ-CAPA-NAR-XL` | `1853701148780679186` |
| capa-impermeable-perro-grande | `PTC-CAPALLUV-13` | `CJ-CAPA-NAR-2XL` | `1853701148780679187` |
| capa-impermeable-perro-grande | `PTC-CAPALLUV-14` | `CJ-CAPA-NAR-3XL` | `1853701148780679188` |
| abrigo-reflectante-perro | `PTC-ABRIGOREF-01` | `CJ-ABRREF-XS` | `1649222194947428352` |
| abrigo-reflectante-perro | `PTC-ABRIGOREF-02` | `CJ-ABRREF-S` | `1649222194964205568` |
| abrigo-reflectante-perro | `PTC-ABRIGOREF-03` | `CJ-ABRREF-M` | `1649222194989371392` |
| abrigo-reflectante-perro | `PTC-ABRIGOREF-04` | `CJ-ABRREF-L` | `1649222195010342912` |
| abrigo-reflectante-perro | `PTC-ABRIGOREF-05` | `CJ-ABRREF-XL` | `1649222195031314432` |
| abrigo-reflectante-perro | `PTC-ABRIGOREF-06` | `CJ-ABRREF-2XL` | `1649222195048091648` |
| abrigo-reflectante-perro | `PTC-ABRIGOREF-07` | `CJ-ABRREF-3XL` | `1649222195064868864` |
| abrigo-reflectante-perro | `PTC-ABRIGOREF-08` | `CJ-ABRREF-4XL` | `1649222195081646080` |
| abrigo-reflectante-perro | `PTC-ABRIGOREF-09` | `CJ-ABRREF-5XL` | `1649222195098423296` |
| abrigo-reflectante-perro | `PTC-ABRIGOREF-10` | `CJ-ABRREF-6XL` | `1649222195115200512` |
| abrigo-reflectante-perro | `PTC-ABRIGOREF-11` | `CJ-ABRREF-7XL` | `1649222195131977728` |
| plumifero-perro-pequeno | `PTC-PLUMIF-01` | `CJ-PLUMA-AZU-XS` | `2410100913191624500` |
| plumifero-perro-pequeno | `PTC-PLUMIF-02` | `CJ-PLUMA-AZU-S` | `2410100913191624600` |
| plumifero-perro-pequeno | `PTC-PLUMIF-03` | `CJ-PLUMA-AZU-M` | `2410100913191624800` |
| plumifero-perro-pequeno | `PTC-PLUMIF-04` | `CJ-PLUMA-AZU-L` | `2410100913191624900` |
| plumifero-perro-pequeno | `PTC-PLUMIF-05` | `CJ-PLUMA-AZU-XL` | `2410100913191625100` |
| plumifero-perro-pequeno | `PTC-PLUMIF-06` | `CJ-PLUMA-AZU-XXL` | `2410100913191625200` |
| plumifero-perro-pequeno | `PTC-PLUMIF-07` | `CJ-PLUMA-ROJ-XS` | `2410100913191625400` |
| plumifero-perro-pequeno | `PTC-PLUMIF-08` | `CJ-PLUMA-ROJ-S` | `2410100913191625600` |
| plumifero-perro-pequeno | `PTC-PLUMIF-09` | `CJ-PLUMA-ROJ-M` | `2410100913191625700` |
| plumifero-perro-pequeno | `PTC-PLUMIF-10` | `CJ-PLUMA-ROJ-L` | `2410100913191625900` |
| plumifero-perro-pequeno | `PTC-PLUMIF-11` | `CJ-PLUMA-ROJ-XL` | `2410100913191626100` |
| plumifero-perro-pequeno | `PTC-PLUMIF-12` | `CJ-PLUMA-ROJ-XXL` | `2410100913191626200` |
| plumifero-perro-pequeno | `PTC-PLUMIF-13` | `CJ-PLUMA-ROS-XS` | `2410100913191626400` |
| plumifero-perro-pequeno | `PTC-PLUMIF-14` | `CJ-PLUMA-ROS-S` | `2410100913191626600` |
| plumifero-perro-pequeno | `PTC-PLUMIF-15` | `CJ-PLUMA-ROS-M` | `2410100913191626700` |
| plumifero-perro-pequeno | `PTC-PLUMIF-16` | `CJ-PLUMA-ROS-L` | `2410100913191626900` |
| plumifero-perro-pequeno | `PTC-PLUMIF-17` | `CJ-PLUMA-ROS-XL` | `2410100913191627000` |
| plumifero-perro-pequeno | `PTC-PLUMIF-18` | `CJ-PLUMA-ROS-XXL` | `2410100913191627200` |
| cama-sofa-perro-funda-desmontable | `PTC-CAMASOFA-01` | `CJYD274010801AZ` | `2601230715561605500` |
| cama-sofa-perro-funda-desmontable | `PTC-CAMASOFA-02` | `CJYD274010802BY` | `2601230715561605800` |
| cama-sofa-perro-funda-desmontable | `PTC-CAMASOFA-03` | `CJYD274010803CX` | `2601230715561606100` |
| cama-sofa-perro-funda-desmontable | `PTC-CAMASOFA-04` | `CJYD274010804DW` | `2601230715561606400` |
| cama-sofa-perro-funda-desmontable | `PTC-CAMASOFA-05` | `CJYD274010805EV` | `2601230715561606600` |
| cama-sofa-perro-funda-desmontable | `PTC-CAMASOFA-06` | `CJYD274010806FU` | `2601230715561607300` |
| cama-sofa-perro-funda-desmontable | `PTC-CAMASOFA-07` | `CJYD274010807GT` | `2601230715561607600` |
| cama-sofa-perro-funda-desmontable | `PTC-CAMASOFA-08` | `CJYD274010808HS` | `2601230715561607900` |
| cama-sofa-perro-funda-desmontable | `PTC-CAMASOFA-09` | `CJYD274010809IR` | `2601230715561608100` |
| cama-sofa-perro-funda-desmontable | `PTC-CAMASOFA-10` | `CJYD274010810JQ` | `2601230715561608400` |
| cama-sofa-perro-funda-desmontable | `PTC-CAMASOFA-11` | `CJYD274010811KP` | `2601230715561608700` |
| cama-sofa-perro-funda-desmontable | `PTC-CAMASOFA-12` | `CJYD274010812LO` | `2601230715561609000` |
| cama-sofa-perro-funda-desmontable | `PTC-CAMASOFA-13` | `CJYD274010813MN` | `2601230715561609300` |
| cama-sofa-perro-funda-desmontable | `PTC-CAMASOFA-14` | `CJYD274010814NM` | `2601230715561609600` |
| cama-sofa-perro-funda-desmontable | `PTC-CAMASOFA-15` | `CJYD274010815OL` | `2601230715561609900` |
| cama-sofa-perro-funda-desmontable | `PTC-CAMASOFA-16` | `CJYD274010816PK` | `2601230715571600200` |
| cama-sofa-perro-funda-desmontable | `PTC-CAMASOFA-17` | `CJYD274010817QJ` | `2601230715571600500` |
| cama-sofa-perro-funda-desmontable | `PTC-CAMASOFA-18` | `CJYD274010818RI` | `2601230715571600800` |
| cama-sofa-perro-funda-desmontable | `PTC-CAMASOFA-19` | `CJYD274010819SH` | `2601230715571601001` |
| cama-sofa-perro-funda-desmontable | `PTC-CAMASOFA-20` | `CJYD274010820TG` | `2601230715571601300` |
| cama-sofa-perro-funda-desmontable | `PTC-CAMASOFA-21` | `CJYD274010821UF` | `2601230715571601600` |
| cama-sofa-perro-funda-desmontable | `PTC-CAMASOFA-22` | `CJYD274010822VE` | `2601230715571601900` |
| cama-sofa-perro-funda-desmontable | `PTC-CAMASOFA-23` | `CJYD274010823WD` | `2601230715571602200` |
| cama-sofa-perro-funda-desmontable | `PTC-CAMASOFA-24` | `CJYD274010824XC` | `2601230715571602400` |
| arnes-acolchado-reflectante-perro | `PTC-ARNESACO-01` | `CJPH313621501AZ` | `2096911781092425729` |
| arnes-acolchado-reflectante-perro | `PTC-ARNESACO-02` | `CJPH313621502BY` | `2096911781092425730` |
| arnes-acolchado-reflectante-perro | `PTC-ARNESACO-03` | `CJPH313621503CX` | `2096911781092425731` |
| arnes-acolchado-reflectante-perro | `PTC-ARNESACO-04` | `CJPH313621504DW` | `2096911781092425732` |
| arnes-acolchado-reflectante-perro | `PTC-ARNESACO-05` | `CJPH313621505EV` | `2096911781092425733` |
| arnes-acolchado-reflectante-perro | `PTC-ARNESACO-06` | `CJPH313621506FU` | `2096911781092425734` |
| arnes-acolchado-reflectante-perro | `PTC-ARNESACO-07` | `CJPH313621507GT` | `2096911781092425735` |
| arnes-acolchado-reflectante-perro | `PTC-ARNESACO-08` | `CJPH313621508HS` | `2096911781092425736` |
| arnes-acolchado-reflectante-perro | `PTC-ARNESACO-09` | `CJPH313621509IR` | `2096911781092425737` |
| arnes-acolchado-reflectante-perro | `PTC-ARNESACO-10` | `CJPH313621510JQ` | `2096911781092425738` |
| arnes-acolchado-reflectante-perro | `PTC-ARNESACO-11` | `CJPH313621511KP` | `2096911781092425739` |
| arnes-acolchado-reflectante-perro | `PTC-ARNESACO-12` | `CJPH313621512LO` | `2096911781092425740` |
| arnes-acolchado-reflectante-perro | `PTC-ARNESACO-13` | `CJPH313621513MN` | `2096911781092425741` |
| arnes-acolchado-reflectante-perro | `PTC-ARNESACO-14` | `CJPH313621514NM` | `2096911781092425742` |
| arnes-acolchado-reflectante-perro | `PTC-ARNESACO-15` | `CJPH313621515OL` | `2096911781092425743` |
| mordedor-dental-perro | `PTC-MORDENTA-01` | `CJCT307551302BY` | `2090009947064786947` |
| mordedor-dental-perro | `PTC-MORDENTA-02` | `CJCT307551304DW` | `2090009947064786949` |
| cepillo-spray-agua-perro | `PTC-CEPSPRAY-01` | `CJHR306054202BY` | `2088152671353700355` |
| cepillo-spray-agua-perro | `PTC-CEPSPRAY-02` | `CJHR306054203CX` | `2088152671353700356` |
| cepillo-spray-agua-perro | `PTC-CEPSPRAY-03` | `CJHR306054206FU` | `2088152671353700359` |
| cepillo-spray-agua-perro | `PTC-CEPSPRAY-04` | `CJHR306054207GT` | `2088152671353700360` |
| cepillo-spray-agua-perro | `PTC-CEPSPRAY-05` | `CJHR306054204DW` | `2088152671353700357` |
| cepillo-spray-agua-perro | `PTC-CEPSPRAY-06` | `CJHR306054205EV` | `2088152671353700358` |
| portabolsas-paseo-perro | `PTC-PORTABOL-01` | `CJYD297908602BY` | `2607101002501619900` |
| portabolsas-paseo-perro | `PTC-PORTABOL-02` | `CJYD297908601AZ` | `2607101002501619400` |
| portabolsas-paseo-perro | `PTC-PORTABOL-03` | `CJYD297908603CX` | `2607101002511610500` |
| anilla-flotante-perro | `PTC-ANILLA-01` | `CJYD290329702BY` | `2605250925121631100` |
| anilla-flotante-perro | `PTC-ANILLA-02` | `CJYD290329703CX` | `2605250925121631700` |
| anilla-flotante-perro | `PTC-ANILLA-03` | `CJYD290329704DW` | `2605250925121632400` |
| anilla-flotante-perro | `PTC-ANILLA-04` | `CJYD290329705EV` | `2605250925121633200` |
| frisbee-blando-perro | `PTC-FRISBEE-01` | `CJYD285980901AZ` | `2604290649151607900` |
| frisbee-blando-perro | `PTC-FRISBEE-02` | `CJYD285980902BY` | `2604290649151608500` |
| frisbee-blando-perro | `PTC-FRISBEE-03` | `CJYD285980903CX` | `2604290649151609100` |
| comedero-plegable-viaje | `PTC-COMPLEG-01` | `CJYD310339913MN` | `2608280130211610512` |
| comedero-plegable-viaje | `PTC-COMPLEG-02` | `CJYD310339914NM` | `2608280130211610513` |
| comedero-plegable-viaje | `PTC-COMPLEG-03` | `CJYD310339915OL` | `2608280130211610514` |
| comedero-plegable-viaje | `PTC-COMPLEG-04` | `CJYD310339916PK` | `2608280130211610515` |
| comedero-plegable-viaje | `PTC-COMPLEG-05` | `CJYD310339909IR` | `2608280130211610508` |
| comedero-plegable-viaje | `PTC-COMPLEG-06` | `CJYD310339910JQ` | `2608280130211610509` |
| comedero-plegable-viaje | `PTC-COMPLEG-07` | `CJYD310339911KP` | `2608280130211610510` |
| comedero-plegable-viaje | `PTC-COMPLEG-08` | `CJYD310339912LO` | `2608280130211610511` |
| alfombrilla-bajo-comedero | `PTC-ALFCOMED-01` | `CJYD309333402BY` | `2608250338091611001` |
| alfombrilla-bajo-comedero | `PTC-ALFCOMED-02` | `CJYD309333405EV` | `2608250338091611004` |
| alfombrilla-bajo-comedero | `PTC-ALFCOMED-03` | `CJYD309333408HS` | `2608250338091611007` |
| alfombrilla-bajo-comedero | `PTC-ALFCOMED-04` | `CJYD309333411KP` | `2608250338091611010` |
| alfombrilla-bajo-comedero | `PTC-ALFCOMED-05` | `CJYD309333414NM` | `2608250338091611013` |
| alfombrilla-bajo-comedero | `PTC-ALFCOMED-06` | `CJYD309333417QJ` | `2608250338091611016` |
| alfombrilla-bajo-comedero | `PTC-ALFCOMED-07` | `CJYD309333403CX` | `2608250338091611002` |
| alfombrilla-bajo-comedero | `PTC-ALFCOMED-08` | `CJYD309333406FU` | `2608250338091611005` |
| alfombrilla-bajo-comedero | `PTC-ALFCOMED-09` | `CJYD309333409IR` | `2608250338091611008` |
| alfombrilla-bajo-comedero | `PTC-ALFCOMED-10` | `CJYD309333412LO` | `2608250338091611011` |
| alfombrilla-bajo-comedero | `PTC-ALFCOMED-11` | `CJYD309333415OL` | `2608250338091611014` |
| alfombrilla-bajo-comedero | `PTC-ALFCOMED-12` | `CJYD309333418RI` | `2608250338091611017` |
| bozal-silicona-cesta-perro | `PTC-BOZALSIL-01` | `CJYD193605107GT` | `1741674560417705984` |
| bozal-silicona-cesta-perro | `PTC-BOZALSIL-02` | `CJYD193605108HS` | `1741674560505786368` |
| bozal-silicona-cesta-perro | `PTC-BOZALSIL-03` | `CJYD193605109IR` | `1741674560593866752` |
| bozal-silicona-cesta-perro | `PTC-BOZALSIL-04` | `CJYD193605110JQ` | `1741674560736473088` |
| bozal-silicona-cesta-perro | `PTC-BOZALSIL-05` | `CJYD193605111KP` | `1741674560828747776` |
| bozal-silicona-cesta-perro | `PTC-BOZALSIL-06` | `CJYD193605112LO` | `1741674560921022464` |
| bozal-silicona-cesta-perro | `PTC-BOZALSIL-07` | `CJYD193605119SH` | `1741674561541779456` |
| bozal-silicona-cesta-perro | `PTC-BOZALSIL-08` | `CJYD193605120TG` | `1741674561625665536` |
| bozal-silicona-cesta-perro | `PTC-BOZALSIL-09` | `CJYD193605121UF` | `1741674561713745920` |
| bozal-silicona-cesta-perro | `PTC-BOZALSIL-10` | `CJYD193605122VE` | `1741674561801826304` |
| bozal-silicona-cesta-perro | `PTC-BOZALSIL-11` | `CJYD193605123WD` | `1741674561889906688` |
| bozal-silicona-cesta-perro | `PTC-BOZALSIL-12` | `CJYD193605124XC` | `1741674561977987072` |
| bozal-silicona-cesta-perro | `PTC-BOZALSIL-13` | `CJYD193605113MN` | `1741674561009102848` |
| bozal-silicona-cesta-perro | `PTC-BOZALSIL-14` | `CJYD193605114NM` | `1741674561101377536` |
| bozal-silicona-cesta-perro | `PTC-BOZALSIL-15` | `CJYD193605115OL` | `1741674561189457920` |
| bozal-silicona-cesta-perro | `PTC-BOZALSIL-16` | `CJYD193605116PK` | `1741674561277538304` |
| bozal-silicona-cesta-perro | `PTC-BOZALSIL-17` | `CJYD193605117QJ` | `1741674561365618688` |
| bozal-silicona-cesta-perro | `PTC-BOZALSIL-18` | `CJYD193605118RI` | `1741674561453699072` |
| cepillo-carda-redondo-perro | `PTC-CEPCARDA-01` | `CJYD303107202BY` | `2608030601051637000` |
| cepillo-carda-redondo-perro | `PTC-CEPCARDA-02` | `CJYD303107205EV` | `2608030601051638800` |
| cepillo-carda-redondo-perro | `PTC-CEPCARDA-03` | `CJYD303107201AZ` | `2608030601051636600` |
| cepillo-carda-redondo-perro | `PTC-CEPCARDA-04` | `CJYD303107203CX` | `2608030601051637600` |
| cepillo-carda-redondo-perro | `PTC-CEPCARDA-05` | `CJYD303107204DW` | `2608030601051638200` |
| cama-donut-perro | `PTC-CAMADONU-01` | `CJYD293216001AZ` | `2606121112351615200` |
| cama-donut-perro | `PTC-CAMADONU-02` | `CJYD293216008HS` | `2606121112361611800` |
| cama-donut-perro | `PTC-CAMADONU-03` | `CJYD293216015OL` | `2606121112361619300` |
| cama-donut-perro | `PTC-CAMADONU-04` | `CJYD293216029CX` | `2606121112381613000` |
| cama-donut-perro | `PTC-CAMADONU-05` | `CJYD293216064LO` | `2606121112401619600` |
| cama-donut-perro | `PTC-CAMADONU-06` | `CJYD293216071SH` | `2606121112411614900` |
| cama-donut-perro | `PTC-CAMADONU-07` | `CJYD293216002BY` | `2606121112351615800` |
| cama-donut-perro | `PTC-CAMADONU-08` | `CJYD293216009IR` | `2606121112361612600` |
| cama-donut-perro | `PTC-CAMADONU-09` | `CJYD293216016PK` | `2606121112361619900` |
| cama-donut-perro | `PTC-CAMADONU-10` | `CJYD293216030DW` | `2606121112381615200` |
| cama-donut-perro | `PTC-CAMADONU-11` | `CJYD293216065MN` | `2606121112411610200` |
| cama-donut-perro | `PTC-CAMADONU-12` | `CJYD293216072TG` | `2606121112411615500` |
| cama-donut-perro | `PTC-CAMADONU-13` | `CJYD293216003CX` | `2606121112351616900` |
| cama-donut-perro | `PTC-CAMADONU-14` | `CJYD293216010JQ` | `2606121112361614500` |
| cama-donut-perro | `PTC-CAMADONU-15` | `CJYD293216017QJ` | `2606121112371610900` |
| cama-donut-perro | `PTC-CAMADONU-16` | `CJYD293216031EV` | `2606121112381615900` |
| cama-donut-perro | `PTC-CAMADONU-17` | `CJYD293216066NM` | `2606121112411610800` |
| cama-donut-perro | `PTC-CAMADONU-18` | `CJYD293216073UF` | `2606121112411616000` |
| cama-donut-perro | `PTC-CAMADONU-19` | `CJYD293216004DW` | `2606121112351617900` |
| cama-donut-perro | `PTC-CAMADONU-20` | `CJYD293216011KP` | `2606121112361615300` |
| cama-donut-perro | `PTC-CAMADONU-21` | `CJYD293216018RI` | `2606121112371611600` |
| cama-donut-perro | `PTC-CAMADONU-22` | `CJYD293216032FU` | `2606121112381616400` |
| cama-donut-perro | `PTC-CAMADONU-23` | `CJYD293216067OL` | `2606121112411611400` |
| cama-donut-perro | `PTC-CAMADONU-24` | `CJYD293216074VE` | `2606121112411616800` |
| cama-donut-perro | `PTC-CAMADONU-25` | `CJYD293216005EV` | `2606121112351618600` |
| cama-donut-perro | `PTC-CAMADONU-26` | `CJYD293216012LO` | `2606121112361616400` |
| cama-donut-perro | `PTC-CAMADONU-27` | `CJYD293216019SH` | `2606121112371612700` |
| cama-donut-perro | `PTC-CAMADONU-28` | `CJYD293216033GT` | `2606121112381617000` |
| cama-donut-perro | `PTC-CAMADONU-29` | `CJYD293216068PK` | `2606121112411612300` |
| cama-donut-perro | `PTC-CAMADONU-30` | `CJYD293216075WD` | `2606121112411617500` |
| bufanda-gorro-navidad-perro | `PTC-BUFNAV-01` | `CJYD208104307GT` | `2407110815231616900` |
| bufanda-gorro-navidad-perro | `PTC-BUFNAV-02` | `CJYD208104305EV` | `2407110815231616600` |
| bufanda-gorro-navidad-perro | `PTC-BUFNAV-03` | `CJYD208104302BY` | `2407110815231616000` |
| bufanda-gorro-navidad-perro | `PTC-BUFNAV-04` | `CJYD208104304DW` | `2407110815231616400` |
| bufanda-gorro-navidad-perro | `PTC-BUFNAV-05` | `CJYD208104306FU` | `2407110815231616800` |
| bufanda-gorro-navidad-perro | `PTC-BUFNAV-06` | `CJYD208104303CX` | `2407110815231616200` |
| bufanda-gorro-navidad-perro | `PTC-BUFNAV-07` | `CJYD208104308HS` | `2407110815231617100` |
| bufanda-gorro-navidad-perro | `PTC-BUFNAV-08` | `CJYD208104301AZ` | `2407160157061602700` |
| rascador-redondo-carton-gato | `PTC-RASCCART-01` | `CJSP305689801AZ` | `2087728213929652225` |
| rascador-redondo-carton-gato | `PTC-RASCCART-02` | `CJSP305689802BY` | `2087728213929652226` |
| rascador-redondo-carton-gato | `PTC-RASCCART-03` | `CJSP305689803CX` | `2087728213929652227` |
| rascador-pared-gato | `PTC-RASCPARE-01` | `CJYD301459901AZ` | `2607280913391615200` |
| rascador-pared-gato | `PTC-RASCPARE-02` | `CJYD301459902BY` | `2607280913391615700` |
| rascador-pared-gato | `PTC-RASCPARE-03` | `CJYD301459903CX` | `2607280913391616100` |
| correa-nailon-reflectante | `PTC-CORREANA-01` | `CJYD304027403CX` | `2608060551221618800` |
| correa-nailon-reflectante | `PTC-CORREANA-02` | `CJYD304027401AZ` | `2608060551221618000` |
| correa-nailon-reflectante | `PTC-CORREANA-03` | `CJYD304027405EV` | `2608060551221619700` |
| correa-nailon-reflectante | `PTC-CORREANA-04` | `CJYD304027404DW` | `2608060551221619300` |
| correa-nailon-reflectante | `PTC-CORREANA-05` | `CJYD304027402BY` | `2608060551221618400` |
| correa-nailon-reflectante | `PTC-CORREANA-06` | `CJYD304027406FU` | `2608060551231610100` |
| calendario-adviento-gato | `PTC-ADVIENTO-01` | `CJYD312740501AZ` | `2609041107331619000` |
| comedero-puzzle-arbol-navidad | `PTC-ARBOLNAV-01` | `CJTE305869101AZ` | `2087833648178917377` |
| comedero-puzzle-arbol-navidad | `PTC-ARBOLNAV-02` | `CJTE305869102BY` | `2087833648178917378` |
| mordedor-peluche-navidad | `PTC-MORDNAV-01` | `CJYD308723703CX` | `2608230601101630802` |
| mordedor-peluche-navidad | `PTC-MORDNAV-02` | `CJYD308723701AZ` | `2608230601101630800` |
| mordedor-peluche-navidad | `PTC-MORDNAV-03` | `CJYD308723702BY` | `2608230601101630801` |
| hamaca-ventana-gato | `PTC-HAMACA-01` | `CJYD205065301AZ` | `1796451426621722624` |
| hamaca-ventana-gato | `PTC-HAMACA-02` | `CJYD205065302BY` | `1796451426684637184` |
| hamaca-ventana-gato | `PTC-HAMACA-03` | `CJYD205065303CX` | `1796451426751746048` |
| hamaca-ventana-gato | `PTC-HAMACA-04` | `CJYD205065304DW` | `1796451426814660608` |
| protector-sofa-gato | `PTC-PROTSOFA-01` | `CJFP291731204DW` | `2061383790936424453` |
| protector-sofa-gato | `PTC-PROTSOFA-02` | `CJFP291731201AZ` | `2061383790936424450` |
| protector-sofa-gato | `PTC-PROTSOFA-03` | `CJFP291731202BY` | `2061383790936424451` |
| protector-sofa-gato | `PTC-PROTSOFA-04` | `CJFP291731203CX` | `2061383790936424452` |
| protector-sofa-gato | `PTC-PROTSOFA-05` | `CJFP291731205EV` | `2061383790936424454` |
| protector-sofa-gato | `PTC-PROTSOFA-06` | `CJFP291731206FU` | `2061383790936424455` |
| protector-sofa-gato | `PTC-PROTSOFA-07` | `CJFP291731207GT` | `2061383790936424456` |
| alas-murcielago-halloween | `PTC-ALASMUR-01` | `CJGD208302201AZ` | `1812070291104223232` |
| alas-murcielago-halloween | `PTC-ALASMUR-02` | `CJGD208302202BY` | `1812070291104223233` |
| alas-murcielago-halloween | `PTC-ALASMUR-03` | `CJGD208302203CX` | `1812070291104223234` |
| gorro-halloween-mascota | `PTC-GORROHW-01` | `CJYD214926602BY` | `2409290154541626200` |
| gorro-halloween-mascota | `PTC-GORROHW-02` | `CJYD214926603CX` | `2409290154541626300` |
| gorro-halloween-mascota | `PTC-GORROHW-03` | `CJYD214926604DW` | `2409290154541626500` |
| gorro-halloween-mascota | `PTC-GORROHW-04` | `CJYD214926605EV` | `2409290154541626700` |
| gorro-halloween-mascota | `PTC-GORROHW-05` | `CJYD214926606FU` | `2409290154541626900` |
| gorro-halloween-mascota | `PTC-GORROHW-06` | `CJYD214926607GT` | `2409290154541627100` |
| mariposa-electrica-gato | `PTC-MARIPOSA-01` | `CJCT305756401AZ` | `2087775901745074178` |
| guante-marioneta-gato | `PTC-GUANTEMA-01` | `CJPT296468701AZ` | `2072615360907239425` |
| pez-movil-gato | `PTC-PEZMOVIL-01` | `CJTS302574901AZ` | `2083117652449595394` |
| secador-cepillo-perro-gato | `PTC-SECACEP-01` | `CJHR283748704DW` | `2604160711301605800` |
| secador-cepillo-perro-gato | `PTC-SECACEP-02` | `CJHR283748712LO` | `2604160711301609400` |
| collar-airtag-perro | `PTC-COLAIRTA-01` | `CJPN218261001AZ` | `1853701129163919360` |
| collar-airtag-perro | `PTC-COLAIRTA-02` | `CJPN218261002BY` | `1853701129163919361` |
| collar-airtag-perro | `PTC-COLAIRTA-03` | `CJPN218261003CX` | `1853701129163919362` |
