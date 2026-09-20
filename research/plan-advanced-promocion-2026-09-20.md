# El plan Advanced está en promoción de 1 € — lo que eso cambia y lo que no

**20 de septiembre de 2026.** Este documento corrige una premisa que estaba mal
en nueve documentos de esta carpeta. Si un documento de `research/` dice que
bajar de Advanced a Basic es la mejora más rentable que se puede hacer hoy, está
escrito con la premisa vieja y manda aquí.

---

## 1. Lo que pasó

Durante dos días le dije a Pablo que bajar a Basic era, con diferencia, la
decisión de más impacto del negocio, y lo apoyé en un número: Advanced cuesta
384 € al mes, y con 13 € de margen por pedido eso obliga a vender 30 pedidos al
mes antes de ganar un euro, frente a 3 pedidos con Basic.

El 17 de septiembre Pablo contó el dato que faltaba:

> «tengo Advanced por un euro durante tres meses, y solo han pasado 15 días»

Con eso, la cuenta se cae sola. No hay 352 € que ahorrar hoy. Hay 1 €.

**Cómo se llegó al error:** leí `shop.plan.displayName` = `Advanced` del API y
le puse encima el precio de la página de tarifas de Shopify. El API dice qué
plan tienes; no dice cuánto te cobran por él. Es exactamente el fallo que la
primera regla de la casa («no des por hecho lo que no has verificado») existe
para evitar, y lo cometí durante dos días seguidos.

---

## 2. Los números corregidos

| | Premisa vieja (mal) | Realidad (17/09/2026) |
| --- | ---: | ---: |
| Coste del plan hoy | 384 €/mes | **≈1 €/mes** |
| Pedidos/mes para cubrirlo | 30 | **≈0** (lo cubre el primer pedido) |
| Ahorro por bajar a Basic hoy | 352 €/mes | **0 €** (bajar cuesta dinero: pierde la promo) |
| Punto de equilibrio real | 2.000 visitas/mes | **≈200 visitas/mes**, igual que con Basic |

---

## 3. Las fechas (deducidas, NO verificadas en el panel)

Pablo dijo el 17/09/2026 que llevaba «unos 15 días».

- Inicio de la promoción: **alrededor del 2 de septiembre de 2026**.
- Fin de los tres meses: **alrededor del 2 de diciembre de 2026**.

**Esto es una deducción de una frase suya, no un dato leído.** La fecha exacta
está en el panel, en **Ajustes → Plan**, en el bloque de facturación. Antes de
tomar cualquier decisión que dependa de esa fecha, hay que abrirlo y mirarlo.

Pablo ya tiene una alarma puesta para bajar de plan unos días antes de que
empiecen a cobrar. Esta nota es la copia de seguridad de esa alarma: si la
alarma falla y nadie mira, el 2 de diciembre empiezan a salir ~384 € al mes de
una tienda con cero ventas.

---

## 4. Lo que sí sigue siendo verdad

La conclusión cambió; el razonamiento que había debajo, no:

- **El coste fijo sigue siendo la primera pregunta** antes de hablar de tráfico
  o de conversión. Lo que ha cambiado es la respuesta: hoy está bien.
- **Advanced no aporta nada que esta tienda necesite para vender.** Sigue
  siendo cierto. Que sea gratis no lo convierte en útil; solo lo convierte en
  inofensivo mientras dure.
- **El día que se acabe la promoción, Basic es el plan correcto.** Esa parte del
  consejo era buena; lo que estaba mal era el «hazlo hoy».

---

## 5. Cómo aprovechar Advanced mientras cuesta 1 €

La regla que separa lo que merece la pena de lo que es una trampa:

> Lo que desaparece el día que bajemos de plan, **no se monta**.
> Lo que queda después de bajar, **se aprovecha ahora**.

**No montar** (se rompe al bajar a Basic):

- Tarifas de envío calculadas por el transportista (`carrierServiceCreate`).
  Si el escaparate acaba dependiendo de esto, el día de la bajada los clientes
  se quedan sin poder elegir envío. Es la trampa más cara de las que hay aquí.
- Cualquier automatización o informe que la tienda necesite **en marcha** y que
  Basic no soporte.

**Sí aprovechar** (queda después):

- **Comisión de tarjeta más baja**: 1,6 % + 0,30 € en Advanced frente a 2,1 % +
  0,30 € en Basic. Cada venta que ocurra antes de diciembre se lleva esa
  diferencia. Con el volumen actual (0 pedidos) vale casi nada, pero no cuesta
  nada tampoco.
- **Informes y datos**: cualquier análisis que se extraiga ahora se queda
  extraído. Si hay un informe que Basic no da, este es el momento de sacarlo y
  guardarlo en el repositorio, no de acostumbrarse a mirarlo cada semana.

---

## 6. Documentos de esta carpeta que llevan la premisa vieja

Todos llevan ya un aviso en la cabecera que apunta aquí:

- `analisis-negocio-2026-09-05.md`
- `auditoria-tienda-2026-09-04.md`
- `auditoria-ventas-2026-09-13.md`
- `cambios-ejecutados-2026-09-16.md`
- `diseno-portada-2026-09-05.md`
- `estado-para-vender-2026-09-04.md`
- `estructura-negocio-2026-09-16.md`
- `plan-google-2026-09-14.md`
- `plan-shopify-y-fiscalidad.md`

No se han reescrito: un documento fechado cuenta lo que se sabía ese día, y
borrarlo esconde el error en vez de corregirlo. Lo que se ha hecho es marcarlos.
