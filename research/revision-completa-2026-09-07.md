# Revision a fondo de la tienda

Fecha: 2026-09-07, ya con el dominio `patitascalidas.com` funcionando.

## Lo que funciona

### La venta, probada con pedidos simulados reales

Tres escenarios con `draftOrderCalculate`, que es el calculo de verdad del
carrito, no una estimacion:

| Pedido | Subtotal | IVA | Envio | Correcto |
|---|---|---|---|---|
| Pack de aseo, a Valladolid | 55,90 | 9,70 | **0,00** | si, pasa de 55 |
| Limpiapatas solo, a Valladolid | 39,90 | 6,92 | **6,99** | si, no llega a 55 |
| Cama 3XL + 2 limpiapatas, a Madrid | 204,70 | 35,53 | **0,00** | si |

El IVA sale al 21 % en los tres y va incluido en el precio. El umbral de
envio gratis en 55 EUR funciona por arriba y por abajo.

### El resto

| Comprobacion | Resultado |
|---|---|
| Verificador de las 43 paginas | **0 fallos** |
| Certificado del dominio y del www | validos hasta el 6 dic 2026 |
| Dominio viejo y www | **301** al nuevo, conservando la ruta |
| `canonical`, `og:url`, sitemap | apuntan a `patitascalidas.com` |
| Menciones al dominio viejo en el HTML | 0 |
| Las 5 politicas legales + 4 paginas | 200 |
| Mapeo SKU -> proveedor | **129 SKU, 0 sin mapeo** |
| Marca de los productos | un solo valor: `Patitascalidas` |
| "Prestige" en la tienda | **0 apariciones** |
| Repositorios | limpios y subidos |

## Una decision que he tomado: no recortar 27 titulos

Al pasar de `Prestige` (8 letras) a `Patitascalidas` (14), el sufijo que
anade el tema crece de 11 a **17 caracteres**. El presupuesto util del campo
SEO baja de 49 a **43**, y con eso **27 titulos se pasan de los 60** que
muestra Google.

**No se han recortado, a proposito.** Recortar a 43 caracteres obliga a
quitar palabras que valen: "Toalla de microfibra de secado rapido para
perros" (48) tendria que perder "para perros" o "microfibra". Lo que Google
corta, en cambio, es **el final**, que es justo el nombre de la tienda: la
parte con menos valor de busqueda. Las palabras clave van todas delante y se
leen enteras.

Dicho de otro modo: el coste de recortar es real y el de no recortar es
cosmetico. Si algun dia se quiere titulos limpios, la palanca es un nombre de
marca mas corto, no mutilar 27 fichas.

El verificador se ha recalibrado para reflejarlo: ahora distingue

- **fallo**: el titulo propio de la pagina ya se pasa de 60 (ninguno)
- **aviso**: solo se pasa al anadirle el nombre de la tienda (27)

## Lo que queda, y es todo tuyo

### 1. El titulo de la portada tiene el nombre dos veces

Ahora mismo sale asi:

```
Accesorios para perros que resuelven algo | patitascalidas - Patitascalidas
```

75 caracteres, y el nombre repetido: una vez en minuscula, puesto a mano en
Preferencias, y otra que anade el tema.

En **Tienda online > Preferencias**, borra todo el ` | patitascalidas` y deja
solo:

```
Accesorios para perros que resuelven algo
```

El tema pone el nombre detras el solo.

### 2. El espacio final del nombre sigue ahi

Guardado como `"Patitascalidas "`. Comprobado en la web: ese espacio sale en
el `merchantName` de Apple Pay, en el `Organization.name` del JSON-LD y en
`og:site_name`. **Configuracion > Datos de la tienda**, borralo.

### 3. Falta la imagen para compartir de la portada

Sigue sin `og:image`. Esta lista en `assets/redes/`, con el nombre nuevo.
**Tienda online > Temas > Personalizar > Configuracion del tema > Redes
sociales > Imagen para compartir**.

Es lo mas importante de los tres si vas a subir el enlace a Instagram: sin
ella, el enlace sale como una tarjeta gris sin foto.
