---
name: oficio-tienda-online
description: Lo aprendido montando y llevando una tienda online de dropshipping (Shopify + proveedor en China + Meta), escrito para que sirva en CUALQUIER tienda o proyecto nuevo. Úsala SIEMPRE antes de subir productos, calcular precios o márgenes, retocar fotos, estudiar el mercado, preparar anuncios o redes, o dar algo por terminado. Cada regla sale de un error real.
---

# El oficio de llevar una tienda online

Escrita el 30-09-2026 a partir de un mes de trabajo con Pablo en su primera
tienda. Aquí no hay datos de esa tienda: ni productos, ni precios, ni
direcciones. Solo el método y los errores que no hay que repetir, para que
sirva igual en otra tienda, en otras páginas o en otro chat.

**Copia maestra:** repositorio `lope200007/Shopify`, rama `main`,
`.claude/skills/oficio-tienda-online/SKILL.md`. Hay una copia en
`lope200007/libre`. Si cambias una, cambia la otra.

**Cómo se mantiene.** Cuando un error nuevo deje una regla que valga para
cualquier tienda (y no solo para la de ese proyecto), se añade también aquí, en
su sección, sin nombres de productos ni datos privados.

---

## 1. Cómo trabajar con Pablo

- **Todo en español y sin tecnicismos**: los avances, las preguntas, las
  descripciones de las órdenes y los informes. No solo el informe final.
- **Cada tarea para él lleva un enlace directo** que abra la pantalla exacta.
  No vale «ve a Configuración → …».
- **Ninguna cifra sin fuente y sin fecha.** Si es una estimación, se dice que
  lo es.
- **Antes de pedirle un dato, buscarlo** en las notas del proyecto
  (`research/`, el `CLAUDE.md`, la memoria). Una vez se le pidió durante dos
  días un dato que ya estaba apuntado.
- **Lo reversible se hace y se cuenta.** Se explica qué se ha decidido y por qué,
  y cómo se deshace.
- **Se pregunta SIEMPRE antes de:**
  - borrar o despublicar;
  - hacer reembolsos;
  - recargar saldos;
  - lanzar publicidad de pago o subir un presupuesto;
  - gastar más de 20 €;
  - tocar el dominio, los pagos o el plan.

  Los anuncios se crean en pausa y solo se encienden cuando él dice «sí».
- **Un «no» se dice en una frase**, y acto seguido se ofrece la forma legítima
  de conseguir lo que quería.
- **Si algo se deja fuera o queda a medias, se dice con su motivo.** No se omite.
- **Si me equivoqué, se corrige en una frase y se sigue.** Y se apunta en el
  registro de errores del proyecto en el momento, no al final.
- **Terminar entero: comprobar, apuntar, guardar en git y subir.** El
  contenedor se borra; lo que no está subido no existe.

## 2. Verificar: no dar por hecho lo que no se ha comprobado

**Antes de actuar, buscar cómo puede salir mal.** Pablo, el 30-09-2026: «antes
de hacer este tipo de cosas tienes que analizar que no salgan mal, porque si
no me estás generando un problema en vez de ayudarme». Antes de todo lo que toca
dinero, precios, costes, pedidos, cobros o lo que ve el cliente:

1. **Saber de dónde sale cada número:** el campo exacto y si es el que se cobra
   de verdad (base o total, con o sin impuestos, con o sin envío).
2. **Escribir al menos dos formas concretas en que podría salir mal** y
   comprobar cada una.
3. **Probar con el caso más pequeño y real posible** y comparar lo calculado
   con lo que pasó. Si no cuadra, parar antes de aplicarlo a todo.
4. **Lo no comprobado se dice que no está comprobado.**

- **Tres pasos y en este orden:** simulación → ejecutar → volver a leer el
  resultado. Si un script nuevo no tiene modo de prueba, se le pone.
- **Lo que contesta un sistema externo no es una prueba.** Un proveedor llegó a
  responder «¡Enhorabuena!» sin guardar nada: de 74 envíos se perdieron 7. La
  prueba es leer el estado después.
- **Mínimo dos barridos.** El segundo compara lo guardado con lo esperado,
  campo por campo.
- **Los barridos de textos se hacen contra la página que ve el cliente**, no
  contra la base de datos. Un precio viejo vivía en la plantilla común y no
  en ningún producto.
- **Una comprobación de dirección web sin mirar el código de respuesta no es
  una comprobación.** Una página 404 puede traer la web entera y «contener» el
  texto buscado. Hay que exigir un 200.
- **Las direcciones, identificadores y nombres internos se copian de una
  respuesta completa de la API.** Nunca se escriben de memoria ni se sacan de
  un listado recortado.
- **Los cambios tardan en verse.** Colecciones automáticas, precios en la web,
  cachés: si la API ya dice lo nuevo y la web lo viejo, se vuelve a mirar
  pasados unos minutos, antes de tocar nada. Tampoco se da por bueno sin esa
  segunda mirada.
- **Al partir un lote de cambios en varios grupos, se cuentan los campos por
  elemento antes y después.** Así se perdieron cambios una vez.
- **No se construye sobre un dato sin mirar de dónde viene.** Un pedido solo es
  una venta si no es de prueba, no está cancelado ni reembolsado y no es de
  alguien de la casa.
- **Un «no encontrado» de una herramienta no prueba que no exista.** Un OCR
  vacío no es una foto limpia, y un buscador que falla no es un mercado vacío.
  Se comprueba de otra forma antes de concluir.
- **Antes de dar un fallo por bueno, se mira el caso concreto.** El rastreo
  marcó como errores cosas que no lo eran: texto en una plantilla oculta,
  palabras españolas tomadas por inglés y límites de peticiones tomados por
  enlaces rotos.

## 3. Números: precios, costes y márgenes

- **Antes de restar un coste, averiguar qué incluye.** El coste apuntado ya
  llevaba el envío del proveedor, y restarlo otra vez daba márgenes falsos.
- **El envío del proveedor se calcula con lo que cobra de verdad, impuestos y
  aduana incluidos, no con su precio base.** El transporte más barato se elige
  también por ese total. Un pedido de prueba cobró 8,50 $ de envío cuando el
  presupuesto base decía 5 $, y otro transporte cobraba 5,50 $ en total. La
  venta pasó de ganar a perder.
- **Antes de anunciar, un pedido de prueba real de punta a punta**: cobro,
  paso al proveedor y lo que el proveedor cobra. Es la única forma de ver
  estas diferencias.
- **Antes de copiar una cifra, mirar en qué moneda la imprime el script.** Una
  vez se pasaron a euros costes que ya estaban en euros.
- **Comprobar una fila entera:** precio sin IVA − coste − envío − comisión tiene
  que dar la ganancia de esa misma fila.
- **Fórmula de ganancia por venta (España, IVA 21 %):**

  ```
  ganancia = precio/1,21 − coste del proveedor − envío del proveedor − (precio×0,018 + 0,25)
  ```

  - Si el cliente paga el envío, ese envío se suma al precio.
  - Si se regala el envío a partir de cierto importe, se calcula también sin
    él: es el peor caso.
  - Por debajo de unos 8 € de ganancia no se puede pagar publicidad.
- **Un pack u oferta que nombra una talla se compara con esa variante
  exacta**, no con la más barata.
- **Solo se comparan productos equivalentes:** mismo tipo, mismo formato y misma
  talla. Lo que no es equivalente se quita antes de sacar medias o medianas.
- **Precios tachados solo si son reales.** En España, el precio anterior
  anunciado tiene que ser el más bajo de los últimos 30 días.
- **Nunca se inventa un código de barras (EAN/GTIN):** puede costar la
  suspensión en Google.

## 4. Mercado: qué vender

- **El estudio de mercado se hace fuera de la tienda.** Mientras no haya
  tráfico pagado, las visitas de la tienda no dicen nada del mercado. Se
  consultan:
  - las búsquedas de Google del país;
  - los más vendidos y las novedades de Amazon, por subcategoría fina;
  - las tiendas grandes del sector (el orden «más vendidos» de su propia web);
  - la Biblioteca de anuncios de Meta;
  - las tendencias de TikTok.

  Cada dato con su fuente y su fecha.
- **Copiar los más vendidos de Amazon casi nunca funciona con un proveedor en
  China.** El envío por pieza (de 4 a 20 €) se come la diferencia, y Amazon
  entrega en uno o dos días. Donde sí se compite:
  - **en packs**, porque pagan un solo envío y Amazon no los vende juntos;
  - **en lo que Amazon vende caro**;
  - **en novedades** que llaman la atención en un anuncio y no se buscan
    comparando.
- **Si el precio no puede ganar a Amazon, el anuncio no presume de precio.**
  Vende lo que otros no dan: el conjunto, la comodidad, la imagen. El plazo de
  entrega se dice claro.
- **Que un competidor lleve meses con el mismo anuncio indica que le funciona.**
  Que no haya nadie anunciando algo indica un hueco, o un producto que no se
  vende: hay que mirar si se vende en otro sitio.

## 5. Productos y proveedor (dropshipping)

- **Un producto no está subido hasta que se puede SERVIR.** Una ficha perfecta
  que no está conectada con el proveedor cobra y no entrega.
- **Antes de publicar, comprobar:**
  - desde qué almacén del proveedor sale el stock;
  - que hay transporte desde ESE almacén al país de venta;
  - que el envío se mide con la medida real del paquete: a menudo manda el lado
    más largo, no el peso;
  - que las pilas y baterías tienen su propio transporte, más caro.

  El stock cambia de almacén con el tiempo, así que esto se vuelve a mirar en
  cada repaso de costes.
- **Si un producto se queda sin ruta de envío,** se busca el mismo modelo en otro
  almacén antes de proponer despublicarlo.
- **Antes de subir, anunciar o cambiar de precio un producto, se cruzan tres
  cosas:**
  - el nombre y la categoría en el proveedor;
  - las fotos del proveedor;
  - el texto de la ficha.

  Si no coinciden, no se anuncia y se avisa a Pablo. Una vez se descubrió que un
  «abrigo» era en realidad un pijama, y que una «mochila» era un bolso.
- **Toda medida, peso o capacidad publicada tiene que tener fuente**: una foto,
  el proveedor o las notas. Si no hay fuente, no se escribe y se pide el dato.
  Tampoco se ponen materiales ni cualidades «razonables» que nadie ha comprobado.
- **Un pack no está terminado hasta que el sistema de pedidos sabe qué piezas
  pedir.** El proveedor no entiende de packs.
- **El código del proveedor nunca se ve desde fuera:**
  - en el código de la página no aparece su SKU;
  - en las descripciones no quedan sus enlaces ni frases como «haz el pedido
    aquí».
- **Publicar no es solo ponerlo activo.** Se comprueba que aparece en cada canal
  de venta y que está en alguna colección.
- **Las herramientas del proveedor se usan por su API, no por su web.** La web
  pide verificación humana; la API funciona. Antes de decir «no se puede», se
  leen las instrucciones y los scripts del proyecto.
- **Para buscar en un catálogo grande, mejor por categoría que por texto.** Hay
  que respetar su límite de peticiones y reintentar esperando cada vez más.
- **Saldo del proveedor ≠ pago de un pedido.** Pueden admitir métodos distintos.
  Lo que Pablo verá en una pantalla que no he comprobado se dice como «debería
  salir», y se pide una captura.

## 6. Fotos

- **Se revisan a tamaño real, esquinas incluidas.** Nunca en miniatura. La foto
  principal sobre todo.
- **El OCR sirve para encontrar texto, no para descartarlo.** Una vez no leyó un
  rótulo enorme. Antes de un lote de OCR, comprobar que las herramientas
  existen y que cada archivo intermedio se ha creado.
- **Fuera de las fotos principales:**
  - las que llevan marca de IA;
  - las que llevan texto en otro idioma;
  - las que enseñan un producto distinto del que se vende.

  Una marca no se tapa en la foto principal: se cambia el orden de las fotos y se
  avisa.
- **Pablo da permiso para corregir y reordenar fotos, con una condición: que no
  parezca hecho con IA.** Una foto retocada solo se sube si el producto se ve
  entero y natural a tamaño real. Si el parche toca el producto, se cambia de
  método:
  1. copiar esa zona de una foto gemela de la misma toma;
  2. reconstruir solo las letras con una máscara (inpaint);
  3. recortar el encuadre sin cortar el producto ni al animal.

  Si ninguno queda bien, esa foto no se sube. No se avisa de un defecto que se
  puede arreglar: se arregla.
- **Las imágenes de marca de Pablo (logo, fondos) no se recortan ni se
  retocan.** Si hace falta otra versión, se le pide a él.
- **La imagen de un pack enseña TODAS sus piezas.** Pregunta de control: sin el
  texto, ¿la imagen dice lo que compra el cliente?
- **Las fotos descargadas se guardan como `.jpg` o `.png`.** Con otra extensión,
  el lector no las muestra.

## 7. Anuncios y redes

- **Primero se anuncia un producto que lleve a su propia ficha.** El
  reimpacto con el catálogo viene después. Se empieza con presupuesto bajo y
  un solo conjunto de anuncios con varias creatividades.
- **El píxel de Meta no se prueba con un navegador automático:** descarta esas
  visitas. Se prueba con una acción real desde el móvil, o con «Probar eventos»,
  y las estadísticas se miran horas después.
- **De la API de Meta se imprime solo `data`.** Los enlaces de `paging` llevan
  la clave dentro.
- **Antes de planificar volumen en una herramienta gratuita, mirar el límite de
  su plan.** Dejar programadas no es publicar: el tope salta al publicar. Por
  ejemplo, en Metricool gratuito son 20 publicaciones al mes; hay que
  repartirlas y dejar el resto en borrador.
- **La validez, el tipo y los permisos de una clave se consultan a la propia
  API** (en Meta, `debug_token`). No se suponen.
- **Borrar una publicación de foto en las páginas nuevas de Facebook** se hace
  por el id de la foto, no por el de la publicación. Solo con permiso.

## 8. Seguridad

- **Las claves solo se leen de variables de entorno o del `.env`.** Nunca se
  imprimen, nunca se escriben en documentos y nunca se suben a git. Tampoco se
  sacan del historial de la conversación ni de archivos sueltos.
- **Si una clave se cuela en una salida,** se avisa a Pablo y se le recomienda
  regenerarla.
- **Nunca se piden contraseñas ni códigos de verificación.**
- **Si el modo automático bloquea algo, no se rodea.** Esto vale para editar los
  ajustes de Claude, instalar complementos o leer credenciales: se explica qué
  hace el cambio y decide Pablo.
- **Instalar complementos de terceros necesita su autorización escrita**,
  nombrando cada uno.
- **Nunca se debilita el detector de claves de git.** Si da una falsa alarma
  con código ajeno, se deja fuera esa pieza. En las notas se describe el texto
  sospechoso sin copiarlo.

## 9. Herramientas: trampas técnicas

- **Rutas absolutas siempre.** Los archivos temporales van al scratchpad, nunca
  dentro del repositorio.
- **Los trabajos largos van en segundo plano, con la salida a un archivo.** Por
  ejemplo, repasar un catálogo entero a una petición por segundo. El aviso llega
  solo al terminar.
- **Para parar un proceso:** primero `pgrep -f`, luego `kill <pid>`, en una orden
  aparte. `pkill -f` en la misma línea que otro trabajo puede matarse a sí mismo.
- **Las herramientas diferidas se cargan antes con `ToolSearch`.**
- **Los campos de una API GraphQL se comprueban en su esquema** antes de pedirlos
  en un tipo nuevo. Un campo que no existe tumba la consulta entera. En APIs
  externas, si hay duda, se piden los campos de uno en uno.
- **Las cadenas largas se generan desde un archivo con un script**, no se copian
  a mano. Esto vale para firmas, URLs firmadas y HTML largo; después se validan.
- **Para leer webs sin pagar buscadores:**
  - `curl --compressed` con un navegador de escritorio como agente, y pausas de
    varios segundos;
  - mirar siempre el código de respuesta antes de leer el contenido;
  - para ver qué se busca, el autocompletar de Google;
  - los buscadores de pago y los de cuota gratuita, solo para lo que `curl` no
    puede leer (páginas con JavaScript, anuncios de Meta).

  Si se acaba el saldo o el cupo, no se recarga: se avisa.
- **Con la web de la tienda, pocas lecturas y espaciadas.** Lo guardado se
  comprueba por la API de administración. Para capturas: una página cada vez,
  esperando a `load` y no a `networkidle`.
