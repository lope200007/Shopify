# Políticas legales de Prestige

Textos legales para la tienda **Prestige** (`prestige-12657.myshopify.com`),
tienda española que vende a consumidores en España, UE e internacional.

## Por qué existe esta carpeta

El conector de Shopify tiene `read_legal_policies` pero **no
`write_legal_policies`**. No se pueden publicar por API: hay que pegarlos a
mano una vez.

## Cómo publicarlos

Para cada archivo, en el admin de Shopify:

**Ajustes → Políticas** → elegir la política → pulsar el botón `<>` de la barra
de herramientas para entrar en modo HTML → pegar el contenido → **Guardar**.

| Archivo | Dónde va |
|---|---|
| `1-devoluciones.html` | Política de reembolsos |
| `2-envios.html` | Política de envío |
| `3-terminos.html` | Términos del servicio |
| `4-aviso-legal.html` | Aviso legal — **completar antes de publicar** |

Empezar por `1-devoluciones.html`: es la que cierra el riesgo mayor.

## El riesgo que cierra la primera

Sin política de desistimiento publicada, la Directiva 2011/83/UE extiende el
plazo de devolución de **14 días a 12 meses**. Un cliente podría devolver una
compra casi un año después y tener razón legalmente.

## `4-aviso-legal.html` está incompleto a propósito

Faltan tres datos que solo tiene el socio, y que el artículo 10 de la LSSI-CE
exige:

1. Nombre y apellidos completos como figuran en Hacienda
2. NIF
3. Domicilio fiscal completo

**No publicarlo con los corchetes visibles.** Un aviso legal a medias no cumple
la ley y además queda fatal en una tienda real.

## Variables de Shopify

Los textos usan `{{ shop_name }}` y `{{ email }}`. Shopify las sustituye sola
por los datos de la tienda, igual que hace la política de privacidad que ya
estaba publicada. Si cambia el email de contacto, los textos se actualizan
solos: no hay que tocarlos.

## Base legal

- RDL 1/2007 (TRLGDCU), arts. 66 bis, 71, 103, 107 y 108
- Directiva 2011/83/UE de derechos de los consumidores
- Ley 34/2002 (LSSI-CE), art. 10
- Garantía de conformidad de 3 años (desde el 1 de enero de 2022), con
  presunción de falta de conformidad los 2 primeros
- Reglamento (UE) 524/2013, plataforma ODR

Verificado en septiembre de 2026. Si pasa mucho tiempo, reconfirmar antes de
reutilizar estos textos en otra tienda.
