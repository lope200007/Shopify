# Categoria estandar de Shopify: los 29 productos activos

Fecha: 2026-09-05.

## Que faltaba

Los 29 productos activos tenian el campo `category` a null. No es lo mismo
que la coleccion: la coleccion es el menu que ve el cliente, la categoria
es la taxonomia estandar de Shopify y alimenta:

- el calculo automatico de impuestos por tipo de producto
- el canal Shop y los feeds de Google Shopping / Meta (hara falta para
  la publicidad de pago)
- los atributos y filtros que Shopify sugiere en la ficha

Todas las colecciones estaban bien: ningun producto activo estaba huerfano.

## Mapa aplicado

Todo cuelga de `Productos para mascotas y animales > Productos para mascotas`.

| Producto | Categoria |
|---|---|
| Pack bano y lluvia | Productos de higiene |
| Manopla de bano y secado | Productos de higiene |
| Albornoz de secado | Productos de higiene |
| Toalla de secado rapido | Productos de higiene |
| Cepillo autolimpiable | Peines y cepillos > Escobillas |
| Guante quitapelo | Peines y cepillos > Guantes |
| Lima electrica de unas | Herramientas de manicura |
| Cortapelo de patas | Cortapelos > Recortadoras |
| Alfombrilla de lamer | Cuencos > Alimentacion lenta |
| Comedero lento 2 en 1 | Cuencos > Alimentacion lenta |
| Comedero puzzle 3 capas | Cuencos > Alimentacion lenta |
| Dispensador por gravedad | Cuencos > Alimentadores por gravedad |
| Botella de paseo 3 en 1 | Cuencos > Cuencos de viaje |
| Manta impermeable | Accesorios de cama |
| Colchoneta de asiento | Accesorios de cama |
| Peluche con chirriador | Productos para perros > Juguetes |
| Dinosaurio de peluche | Productos para perros > Juguetes |
| Tentetieso dispensador | Productos para perros > Juguetes |
| Boton grabable | Kits de adiestramiento |
| Funda de collar AirTag | Cascabeles y colgantes > Dijes |
| Chubasquero | Ropa > Impermeables |
| Chaleco antiestres | Ropa > Abrigos |
| Conjunto arnes + correa | Arneses y collares > Arneses |
| Bozal de nailon | Bozales |
| Cinturon de seguridad coche | Extensiones para correas |
| Cubremaletero | Barreras para vehiculos > Maletero |
| Parque plegable | Contencion > Parques de juego |
| Barrera enrollable | Contencion > Cercas y puertas |
| Escalera de espuma | Escalones y rampas |

### Dos encajes imperfectos, a proposito

La taxonomia de Shopify no tiene hoja exacta para estos dos. En ambos casos
se ha elegido quedarse dentro de la rama de mascotas en lugar de saltar a
"Vehiculos y recambios": mantiene el producto agrupado con el resto del
catalogo en los feeds y no cambia su tratamiento fiscal.

- **Cubremaletero** -> "Barreras del maletero". Es una funda, no una barrera.
- **Cinturon de seguridad de coche** -> "Extensiones para correas". Es un
  arnes de retencion, no una extension de correa.

## Lo que quedo sin categoria, y por que

4 productos: 2 en borrador (comedero rotativo y bola dispensadora, sin ruta
de envio CN->ES) y 2 archivados (lima y cepillo antiguos, sustituidos). No
salen en la web, asi que no procede.

## Problema de estructura que esto ha destapado

`Casa, coche y paseo` acumula **14 de los 29 productos**: manta, colchoneta,
AirTag, chubasquero, chaleco, cinturon, bozal, arnes, botella, dispensador,
cubremaletero, parque, barrera y escalera. Es un cajon de sastre, el fallo
clasico de arquitectura de informacion: la categoria mas grande de la tienda
no le dice nada al cliente.

Con las categorias ya puestas, la division natural sale sola:

| Coleccion propuesta | Productos |
|---|---|
| Paseo y seguridad | arnes+correa, bozal, cinturon, AirTag, botella, chubasquero, chaleco |
| Casa y descanso | manta, parque, barrera, escalera, dispensador |
| Coche y viaje | cubremaletero, colchoneta, cinturon |

Sin decidir todavia: cambia el menu principal.

## Riesgo a vigilar

Las colecciones son automaticas por etiqueta. Un producto nuevo al que se le
olvide la etiqueta correcta **no aparece en ningun sitio del menu** y nadie
se entera. Los productos antiguos llevan ademas `mascotas` y `perro`, que
los nuevos ya no llevan: no rompe nada hoy porque ninguna regla los usa,
pero conviene no fiarse. Antes de publicar un producto, comprobar que sale
en la coleccion que le toca.
