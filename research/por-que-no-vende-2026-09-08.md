# Por qué nadie compra — y qué cambia eso

8 septiembre 2026. Todo lo de aquí sale de las analíticas de Shopify y de la
API de CJ, no de suposiciones.

## 1. No son 300 visitas. Son 35

| | Sesiones |
| --- | ---: |
| Total que marca Shopify (60 días) | 215 |
| **Directas** (sin procedencia) | **180** |
| Desde Google | 22 |
| Desde Instagram | 12 |
| Desde Bing | 1 |

Y por país y dispositivo:

| | Sesiones |
| --- | ---: |
| **Estados Unidos, escritorio** | **171** |
| España, móvil | 23 |
| Estados Unidos, móvil | 13 |
| Resto (DE, PL, SE, CA, KR) | 8 |

Las 171 sesiones de Estados Unidos en escritorio **son mías**. El contenedor
donde trabajo está en Virginia, y las fechas cuadran exactamente con los días
que he estado tocando la tienda: 42 el 4 de septiembre, 34 el 5, 118 el 7
—el día de la auditoría de imágenes, con decenas de renderizados— y 14 hoy.
Antes del 3 de septiembre: 3 sesiones en dos meses.

**Visitantes reales, desconocidos: unos 35.** Veintidós de Google y doce de
Instagram.

## 2. Con 35 visitas, cero ventas es lo normal

Cero. No es «poca conversión», es la ausencia de muestra.

Una tienda nueva convierte entre el 0,5 % y el 2 %. Con 35 visitas, lo
esperable son **entre 0,2 y 0,7 pedidos**. Cero entra dentro de lo normal sin
que nada esté roto.

Para que el primer pedido sea probable hacen falta **150-300 visitas reales**.
Vamos por 35.

## 3. Y la tienda sí puede vender

Comprobado hoy de punta a punta:

- Añadir al carrito: **funciona** (`/cart/add.js` devuelve 200 y el carrito
  suma 24,90 €).
- Pantalla de pago: **carga**, con España seleccionada y las 48 provincias.
- Métodos de pago exprés activos: Shop Pay, Apple Pay y Google Pay.
- Las 126 variantes son comprables; ninguna bloqueada.
- Tiempo de respuesta del servidor: 0,44-0,93 s. Bien.

No hay ningún tapón técnico. **El problema es que no entra gente.**

## 4. Los márgenes reales, por fin con números de verdad

Calculado producto a producto con el coste real de CJ, el porte real a Madrid
(`/logistic/freightCalculate`) y la comisión de tarjeta. Datos completos en
`margenes-2026-09-08.json`, script en `scripts/cj/margenes.js`.

| | PVP medio | Margen | % |
| --- | ---: | ---: | ---: |
| Producto suelto (31) | 23,87 € | **9,13 €** | 45 % |
| Pack (4) | 52,90 € | **21,87 €** | 49 % |

Esto corrige el pesimismo de `precio-mercado-espana.md`, que trabajaba con
estimaciones. **Los márgenes son sanos.** El catálogo no pierde dinero.

## 5. El hallazgo logístico: el porte es el 64 % del coste

En un artículo suelto, el transporte cuesta más que el producto:

| Producto | Cuesta | Porte | Porte sobre el coste |
| --- | ---: | ---: | ---: |
| Guante quitapelo | 0,59 € | 3,28 € | **85 %** |
| Cinturón de coche | 1,23 € | 4,99 € | 80 % |
| Cubremaletero | 3,23 € | 10,92 € | 77 % |
| Funda AirTag | 0,92 € | 2,87 € | 76 % |
| Barrera de malla | 1,85 € | 5,57 € | 75 % |

Y el segundo artículo del mismo paquete casi no paga porte:

| Pack | Porte junto | Porte por separado | Ahorro |
| --- | ---: | ---: | ---: |
| Aseo en casa (3 art.) | 8,12 € | 14,00 € | **5,88 €** |
| Cachorro (3 art.) | 11,67 € | 18,37 € | **6,70 €** |
| Comer despacio (3 art.) | 11,49 € | 19,14 € | **7,65 €** |

**Cada artículo que añades a un mismo pedido vale entre 6 y 7,50 € más que
venderlo por separado.** Eso, y no el precio, es la palanca del negocio.
Los packs y el envío gratis a partir de 55 € están bien planteados.

## 6. El proveedor europeo: los números dicen que todavía no

BigBuy es el candidato obvio en España (Valencia, 180.000 referencias, 2-5
días). Cuesta **120 €/mes** y exige alta como empresa o autónomo con IVA.

Con un margen medio de 10,58 € por pedido:

```
120 € / 10,58 € = 11,3 pedidos al mes SOLO para pagar la cuota
```

Y lo que se gana a cambio: pasar de 5-11 días a 2-5. Cinco días.

**Veredicto: no ahora.** Se replantea cuando la tienda haga 30 pedidos al mes.
Hasta entonces son 1.440 €/año de pérdida garantizada contra una mejora que
todavía no tiene a quién importarle.

## 7. Lo corregido hoy

- **Canarias, Ceuta y Melilla estaban en la zona de envío a 6,99 €** mientras
  la política de envío dice «solo España peninsular». Peor: el IVA de
  importación por IOSS no cubre Canarias, así que un cliente de Las Palmas
  habría pagado IGIC y gestión de aduana en destino después de que le
  dijéramos que no pagaría nada más. Zona corregida a las 48 provincias
  peninsulares más Baleares.

## 8. Lo que hay que hacer, por orden

1. **El formato del precio.** La tienda muestra `€24,90`. En España se escribe
   `24,90 €`. Un comprador español lee el símbolo delante y piensa «esto no es
   una tienda de aquí». Es un minuto en Configuración → Datos de la tienda →
   Formato de moneda, y no lo puedo tocar por API.
2. **Traer gente.** Es lo único que falta. 35 visitas no son una prueba.
3. **Empujar el pack, no el producto suelto.** Cada artículo extra en el mismo
   paquete vale 6-7,50 €.
4. **Revisar precios de lo comparable.** Un comedero de plástico se compara en
   diez segundos contra Tiendanimal; una barrera de malla, no. Ahí sí manda
   `precio-mercado-espana.md`.
