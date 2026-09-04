# Limpieza de la tienda — 4 septiembre 2026

Auditoria completa del estado real de la tienda y correccion de lo que se
puede tocar por API. Nada de esto dependia de CJ.

## Lo que estaba mal

### 1. Seis colecciones de la etapa de bolsos, llenas de productos archivados

| Coleccion | Productos | Todos archivados |
|---|---|---|
| Bolsos | 9 | si |
| Bandoleras | 5 | si |
| Riñoneras y carteras | 4 | si |
| Complementos | 5 | si |
| Ropa | 3 | si |
| Hecho a mano | 15 | si |

No estaban en el menu, pero seguian existiendo con su URL propia y
entrando en el sitemap. Una tienda de mascotas con `/collections/bolsos`
viva es incoherente y ademas ensucia el SEO.

**Corregido: las seis eliminadas.** Los productos no se han borrado, siguen
archivados; solo desaparece la agrupacion.

### 2. La coleccion "Página de inicio" contenia el pijama de demostracion

Es la coleccion `frontpage`, que varios temas usan como escaparate. Dentro
habia un unico producto: el pijama de monstruo, archivado, resto de la
plantilla de demostracion.

**Corregido: vaciada.**

### 3. "Packs y ahorro" (esta en el menu principal) arrastraba 6 packs de bolsos

Es una coleccion **automatica** con la regla `etiqueta = pack`, asi que no
se pueden quitar productos a mano: hay que quitarles la etiqueta.

**Corregido: quitada la etiqueta `pack` a los seis packs de bolsos.** El
contador de Shopify tarda unos minutos en recalcularse.

Matiz honesto: un cliente no llegaba a verlos, porque el escaparate solo
muestra productos activos y publicados. Era ruido de administracion, no un
error visible. Pero deja el contador mintiendo y reaparecerian si alguien
desarchivara.

## Lo que estaba BIEN y yo sospechaba que no

Los enlaces del menu principal. Comprobe los identificadores reales y los
cuatro coinciden: `comederos`, `juguetes`, `higiene-y-cuidado`, `packs`.
Ninguno da 404.

## Lo que NO he tocado y hay que vigilar

### Perfiles de envio a 0,00 EUR creados por las apps

| Perfil | Zona | Precio | Variantes dentro |
|---|---|---|---|
| Dropshipper-AI Shipping | Todo el mundo | **0,00** | 0 |
| Grozavu | Europa / Norteamerica / Sudamerica | **0,00** | 12 |
| Hecho a mano | España, Portugal, Francia | **0,00** | 8 |
| Nicole Lee | España, Portugal | 6,00 | 22 |

Hoy **no** hay riesgo: las 42 variantes que contienen son todas de bolsos
archivados, y los cinco productos de mascotas estan en el "Perfil general",
que si cobra (6,99 España, 8,99 UE, 12,99 internacional, gratis desde 55).

El riesgo es futuro y concreto: **si CJ o Syncee crean un producto nuevo y
lo asignan a uno de esos perfiles, se envia gratis a medio mundo y lo
pagamos nosotros.** Hay que revisarlo la primera vez que CJ cree algo.

No los borro por mi cuenta porque son de las apps y borrarlos puede
romperles el funcionamiento.

### El nombre de la tienda sigue siendo "Prestige"

Resto de la etapa de bolsos. No se puede cambiar por API, es un ajuste del
panel: Ajustes → Datos de la tienda.

### La tienda envia a mas de 200 paises

El perfil general cubre España, la UE y 14 paises internacionales. Con un
proveedor chino y una promesa de entrega ya publicada, vender a Japon o
Australia es pedir problemas. Decision de negocio, no error tecnico.

## Sigue bloqueado y es lo unico grave

**No hay pasarela de pago.** `supportedDigitalWallets` esta vacio. Con
productos o sin ellos, hoy la tienda no puede cobrar un solo pedido.
