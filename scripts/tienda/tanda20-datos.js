// Tanda de 20 productos — septiembre 2026.
// Precios cerrados tras medir el porte con la VARIANTE REAL del producto
// (no con el recambio ni el accesorio: ese error costo dos calculos malos).
// Formula: margen = pvp/1.21 - coste_usd*0.92 - porte - (pvp*0.0175 + 0.25)

const COL = {
  juguetes:  'gid://shopify/Collection/697866715484',
  comederos: 'gid://shopify/Collection/697866682716',
  higiene:   'gid://shopify/Collection/697866748252',
  casa:      'gid://shopify/Collection/697931694428',
  gatos:     'gid://shopify/Collection/698130727260',
  ropa:      'gid://shopify/Collection/698287325532',
  novedades: 'gid://shopify/Collection/698323140956',
  regalos:   'gid://shopify/Collection/698327368028',
  navidad:   'gid://shopify/Collection/698367115612',
};

const PLAZO_RAPIDO = '<p>Llega a España en una o dos semanas. Sale de nuestro proveedor en Asia: de 1 a 3 días laborables de preparación y luego el transporte, siempre con número de seguimiento.</p>';
const PLAZO_LENTO  = '<p>Llega a España en dos o tres semanas. Por su tamaño viaja en una línea de transporte más lenta, siempre con número de seguimiento.</p>';

module.exports = { COL, PLAZO_RAPIDO, PLAZO_LENTO, fichas: [

// ─────────────────────────────────────────── 1
{
  clave: 'fuente', pid: '2601100740171632100',
  titulo: 'Fuente de agua para gato con filtro | Agua en movimiento, 2,4 litros',
  tipo: 'Comederos y bebederos',
  etiquetas: ['gato', 'bebedero', 'fuente', 'agua', 'perro'],
  colecciones: ['comederos', 'gatos', 'novedades'],
  sku: 'PTC-FUENTE',
  opciones: [{ nombre: 'Color', valores: ['Negro', 'Azul', 'Verde', 'Rosa', 'Morado'] }],
  variantes: [
    { vid: '2601100740171632400', valores: ['Negro'],  precio: '29.90' },
    { vid: '2601100740171632700', valores: ['Azul'],   precio: '29.90' },
    { vid: '2601100740171633000', valores: ['Verde'],  precio: '29.90' },
    { vid: '2601100740171633200', valores: ['Rosa'],   precio: '29.90' },
    { vid: '2601100740171633500', valores: ['Morado'], precio: '29.90' },
  ],
  seoTitulo: 'Fuente de agua para gato con filtro | 2,4 L, silenciosa',
  seoDesc: 'Fuente de agua con filtro de carbón y bomba silenciosa. 2,4 litros, cinco colores. Para gatos que beben poco. Envío a España.',
  html: `
<p>Hay gatos que beben poquísimo en el bebedero de toda la vida y en cambio se pasan el día bebiendo del grifo. No es manía: el gato desconfía del agua quieta, porque en la naturaleza el agua quieta es agua mala. El agua que se mueve le parece limpia.</p>
<p>Esta fuente hace circular el agua todo el rato a través de un filtro de carbón, así que sale fresca, sin pelos, sin restos de comida y sin ese sabor a plástico del cuenco que lleva ahí desde ayer. El depósito es de 2,4 litros: llenas y te olvidas varios días.</p>
<p>La bomba es sumergible y va por debajo del agua, así que casi no se oye. La usan también perros pequeños.</p>
<h3>Características</h3>
<ul>
<li>Depósito de 2,4 litros — varios días sin rellenar</li>
<li>Filtro de carbón activo que retiene pelos y restos</li>
<li>Bomba sumergible silenciosa</li>
<li>Se desmonta entera para lavarla</li>
<li>Cinco colores</li>
</ul>
<h3>Por qué importa que beba</h3>
<p>El gato es un animal de origen desértico y bebe menos de lo que le conviene. La falta de agua está detrás de buena parte de los problemas de riñón y de vías urinarias que aparecen con los años. Una fuente no cura nada, pero consigue que beba más, y eso sí cuenta.</p>
<h3>Antes de comprar</h3>
${PLAZO_LENTO}
<p><strong>Necesita enchufe.</strong> Funciona con cable USB: hay que tenerla cerca de una toma o de un cargador. No va con pilas.</p>
<p>El filtro se cambia cada tres o cuatro semanas. Es una pieza de recambio barata y fácil de encontrar.</p>
<p>Al principio muchos gatos la miran de lejos. Déjala encendida junto a su bebedero de siempre unos días y no le quites el viejo hasta que use la fuente.</p>
<p>No es un aparato médico. Si tu gato ha dejado de beber de golpe, o bebe muchísimo más de lo normal, eso lo mira el veterinario.</p>`,
},

// ─────────────────────────────────────────── 2
{
  clave: 'coche', pid: '2608170459031619400',
  titulo: 'Coche teledirigido para gato | Juguete eléctrico con mando, plumas incluidas',
  tipo: 'Juguetes',
  etiquetas: ['gato', 'juguete', 'interactivo', 'teledirigido'],
  colecciones: ['juguetes', 'gatos', 'novedades', 'regalos'],
  sku: 'PTC-COCHEGATO',
  opciones: [{ nombre: 'Color', valores: ['Rosa', 'Blanco', 'Azul', 'Naranja'] }],
  variantes: [
    { vid: '2608170459041610400', valores: ['Rosa'],    precio: '24.90' },
    { vid: '2608170459041610401', valores: ['Blanco'],  precio: '24.90' },
    { vid: '2608170459041610402', valores: ['Azul'],    precio: '24.90' },
    { vid: '2608170459041610403', valores: ['Naranja'], precio: '24.90' },
  ],
  seoTitulo: 'Coche teledirigido para gato con mando | Juguete eléctrico',
  seoDesc: 'Coche con mando a distancia y plumas para gatos. Recargable por USB, cambia de dirección solo al chocar. Envío a España.',
  html: `
<p>El problema del juguete de gato normal es que el gato se aburre en tres días. Lo que no se aburre de perseguir es algo que se escapa de verdad, que cambia de dirección y que no repite el mismo movimiento dos veces.</p>
<p>Este es un coche pequeño con una pluma atada detrás. Lleva mando a distancia, así que puedes conducirlo tú desde el sofá y hacerle fintas; y también tiene modo automático, en el que se mueve solo y rebota al chocar con una pared o con una pata de silla. El gato no llega a averiguar el patrón, que es justo lo que le mantiene enganchado.</p>
<p>Se recarga por USB. Y viene con plumas de recambio, porque la primera dura lo que dura.</p>
<h3>Características</h3>
<ul>
<li>Mando a distancia + modo automático</li>
<li>Cambia de dirección solo al chocar</li>
<li>Pluma trasera intercambiable, con recambios incluidos</li>
<li>Recargable por USB</li>
<li>Cuatro colores</li>
</ul>
<h3>Antes de comprar</h3>
${PLAZO_RAPIDO}
<p>Va mejor en suelo liso —parquet, baldosa, tarima—. Sobre alfombra gruesa le cuesta avanzar.</p>
<p>Lleva batería, así que viaja en una línea de transporte especial. Es la razón de que tarde algo más que un juguete de tela.</p>
<p>Las plumas son el consumible: un gato decidido se lleva una por delante en unas cuantas sesiones. Por eso vienen de repuesto.</p>
<p>No lo dejes funcionando sin nadie delante. Es un juguete para jugar con el gato, no para dejarlo encendido y marcharte.</p>`,
},

// ─────────────────────────────────────────── 3
{
  clave: 'bicho', pid: '2608170503571620500',
  titulo: 'Bicho eléctrico para gato | Se mueve solo y brilla en la oscuridad',
  tipo: 'Juguetes',
  etiquetas: ['gato', 'juguete', 'interactivo', 'barato'],
  colecciones: ['juguetes', 'gatos', 'novedades', 'regalos'],
  sku: 'PTC-BICHO',
  opciones: [
    { nombre: 'Forma', valores: ['Ratón', 'Mariquita'] },
    { nombre: 'Color', valores: ['Rojo y negro', 'Verde y negro', 'Azul y verde', 'Rosa y verde'] },
  ],
  variantes: [
    { vid: '2608170503571621401', valores: ['Ratón', 'Rojo y negro'],     precio: '16.90' },
    { vid: '2608170503571621403', valores: ['Ratón', 'Verde y negro'],    precio: '16.90' },
    { vid: '2608170503571621407', valores: ['Ratón', 'Azul y verde'],     precio: '16.90' },
    { vid: '2608170503571621413', valores: ['Ratón', 'Rosa y verde'],     precio: '16.90' },
    { vid: '2608170503571621415', valores: ['Mariquita', 'Rojo y negro'], precio: '16.90' },
    { vid: '2608170503571621417', valores: ['Mariquita', 'Verde y negro'],precio: '16.90' },
    { vid: '2608170503571621421', valores: ['Mariquita', 'Azul y verde'], precio: '16.90' },
    { vid: '2608170503571621427', valores: ['Mariquita', 'Rosa y verde'], precio: '16.90' },
  ],
  seoTitulo: 'Bicho eléctrico para gato que se mueve solo | Brilla',
  seoDesc: 'Juguete diminuto que vibra y corretea solo por el suelo. Brilla en la oscuridad. Ratón o mariquita, cuatro colores. Envío a España.',
  html: `
<p>Es un bicho del tamaño de una moneda grande. Lo enciendes, lo sueltas en el suelo y sale disparado dando tumbos, como un insecto de verdad. Se mete debajo del sofá, rebota contra el rodapié y vuelve a salir.</p>
<p>El truco está en que el movimiento es caótico: no gira siempre igual, no va en línea recta, no hace un patrón. Para el gato es una presa, no un juguete. Y esa diferencia es la que hace que lo persiga hoy y lo vuelva a perseguir la semana que viene.</p>
<p>Además brilla en la oscuridad, así que sirve para las sesiones de las once de la noche, que es cuando el gato quiere jugar.</p>
<h3>Características</h3>
<ul>
<li>Se mueve solo, con recorrido impredecible</li>
<li>Brilla en la oscuridad</li>
<li>Muy pequeño y ligero: cabe por cualquier hueco</li>
<li>Dos formas —ratón y mariquita— y cuatro colores</li>
<li>Funciona con pila de botón, incluida</li>
</ul>
<h3>Antes de comprar</h3>
${PLAZO_RAPIDO}
<p><strong>Es pequeño y lleva una pila de botón.</strong> No lo dejes tirado cuando termines de jugar: guárdalo en un cajón. Una pila de botón tragada es una urgencia veterinaria seria, y lo mismo vale si hay niños en casa.</p>
<p>Funciona bien en suelo duro. En alfombra se atasca.</p>
<p>Es un juguete barato y pequeño: acaba debajo de un mueble más pronto que tarde. Forma parte del trato.</p>`,
},

// ─────────────────────────────────────────── 4
{
  clave: 'tunel_alt', pid: '2082397464573378561',
  titulo: 'Túnel interactivo para gato | Se enciende al tocarlo, con cola y mariposa',
  tipo: 'Juguetes',
  etiquetas: ['gato', 'juguete', 'interactivo', 'tunel'],
  colecciones: ['juguetes', 'gatos', 'novedades', 'regalos'],
  sku: 'PTC-TUNELINT',
  opciones: [{ nombre: 'Color', valores: ['Azul', 'Verde'] }],
  variantes: [
    { vid: '2082397464690819074', valores: ['Azul'],  precio: '34.90' },
    { vid: '2082397464690819075', valores: ['Verde'], precio: '34.90' },
  ],
  seoTitulo: 'Túnel interactivo para gato | Se enciende al tocarlo',
  seoDesc: 'Túnel con sensor táctil: la cola y la mariposa se mueven cuando el gato se acerca. Recargable. Para gatos que se aburren solos.',
  html: `
<p>Este no es el túnel de tela de siempre. Lleva sensor: cuando el gato se acerca o lo toca, la cola peluda que asoma por un extremo empieza a moverse y la mariposa del otro lado se agita. Se para sola al rato y se vuelve a activar cuando el gato la busca otra vez.</p>
<p>Es un juguete de esconderse y cazar, que son las dos cosas que un gato hace sin que nadie se lo enseñe. El túnel le da el escondite y el sensor le da la presa.</p>
<p>Está pensado para el gato que pasa muchas horas solo en casa. No sustituye a que juegues con él, pero le da algo que hacer a media mañana.</p>
<h3>Características</h3>
<ul>
<li>Sensor táctil: se activa cuando el gato se acerca</li>
<li>Cola peluda móvil y mariposa en el otro extremo</li>
<li>Se apaga solo para no gastar batería</li>
<li>Recargable por USB</li>
<li>Dos colores</li>
</ul>
<h3>Antes de comprar</h3>
${PLAZO_RAPIDO}
<p>Lleva batería recargable, así que viaja en una línea de transporte especial: una o dos semanas.</p>
<p>Es un juguete de gato, no de perro grande. Un perro que se tumbe encima lo rompe.</p>
<p>La mariposa y la cola son piezas de tela: con un gato muy bruto acaban desgastándose. El túnel y el motor aguantan; el plumero es lo que se gasta.</p>
<p>Hay gatos a los que los juguetes con motor les dan respeto los primeros días. Déjalo apagado en el suelo un par de días para que entre y salga a su aire, y enciéndelo después.</p>`,
},

// ─────────────────────────────────────────── 5
{
  clave: 'hierba', pid: '2609090236291637700',
  titulo: 'Hierba gatera hidropónica | Kit para cultivarla en casa, sin tierra',
  tipo: 'Higiene y cuidado',
  etiquetas: ['gato', 'hierba gatera', 'digestion', 'bolas de pelo'],
  colecciones: ['higiene', 'gatos', 'novedades'],
  sku: 'PTC-HIERBA',
  opciones: [{ nombre: 'Color', valores: ['Gris', 'Verde', 'Rosa', 'Amarillo'] }],
  variantes: [
    { vid: '2609090236291638501', valores: ['Gris'],     precio: '16.90' },
    { vid: '2609090236291638503', valores: ['Verde'],    precio: '16.90' },
    { vid: '2609090236291638505', valores: ['Rosa'],     precio: '16.90' },
    { vid: '2609090236291638507', valores: ['Amarillo'], precio: '16.90' },
  ],
  seoTitulo: 'Hierba gatera hidropónica | Kit sin tierra para casa',
  seoDesc: 'Kit de hierba gatera que crece en agua, sin tierra y sin mosquitas. Ayuda con las bolas de pelo. Cuatro colores. Envío a España.',
  html: `
<p>La hierba gatera de maceta tiene un problema: la tierra. Se vuelca, el gato escarba, y a la semana tienes mosquitas revoloteando por la cocina.</p>
<p>Este kit crece en agua. Pones las semillas en la bandeja, echas agua hasta la marca y en cuatro o cinco días tienes hierba de verdad. Sin tierra, sin mosquitas y sin suciedad al cambiarla.</p>
<p>La hierba le ayuda a hacer bajar las bolas de pelo y a muchos gatos les vicia como una golosina. Y para el gato de piso, que no sale nunca, es el único verde que va a tener.</p>
<h3>Características</h3>
<ul>
<li>Crece en agua: sin tierra y sin mosquitas</li>
<li>Lista en cuatro o cinco días</li>
<li>Bandeja reutilizable — solo repones semillas</li>
<li>Base estable, difícil de volcar</li>
<li>Cuatro colores</li>
</ul>
<h3>Antes de comprar</h3>
${PLAZO_LENTO}
<p><strong>Lleva semillas, y las semillas son producto vegetal.</strong> Por eso viaja en una línea de transporte más lenta que un juguete.</p>
<p>La hierba dura dos o tres semanas desde que crece. Luego se tira y se siembra otra vez.</p>
<p>Esto es hierba de trigo o de cebada, que es lo que se come el gato. No es lo mismo que la <em>catnip</em> (menta de gato), que es la que les pone eufóricos.</p>
<p>Si tu gato vomita a menudo, esto le ayuda, pero no lo arregla. Vómitos frecuentes los mira el veterinario.</p>`,
},

// ─────────────────────────────────────────── 6
{
  clave: 'mochilagato', pid: '2607010317231632700',
  titulo: 'Mochila transportín para gato | Ventilada, tres tallas',
  tipo: 'Casa, coche y paseo',
  etiquetas: ['gato', 'transportin', 'mochila', 'viaje', 'perro pequeño'],
  colecciones: ['casa', 'gatos', 'novedades'],
  sku: 'PTC-MOCHIGATO',
  opciones: [
    { nombre: 'Talla', valores: ['S', 'M', 'L'] },
    { nombre: 'Color', valores: ['Blanco', 'Flores', 'Azul'] },
  ],
  variantes: [
    { vid: '2607010317231633400', valores: ['S', 'Blanco'], precio: '34.90' },
    { vid: '2607010317231633900', valores: ['S', 'Flores'], precio: '34.90' },
    { vid: '2607010317231634400', valores: ['S', 'Azul'],   precio: '34.90' },
    { vid: '2607010317231636700', valores: ['M', 'Blanco'], precio: '34.90' },
    { vid: '2607010317231637200', valores: ['M', 'Flores'], precio: '34.90' },
    { vid: '2607010317231637600', valores: ['M', 'Azul'],   precio: '34.90' },
    { vid: '2607010317241630000', valores: ['L', 'Blanco'], precio: '34.90' },
    { vid: '2607010317241630400', valores: ['L', 'Flores'], precio: '34.90' },
    { vid: '2607010317241630900', valores: ['L', 'Azul'],   precio: '34.90' },
  ],
  seoTitulo: 'Mochila transportín para gato ventilada | Tres tallas',
  seoDesc: 'Mochila transportín con malla en los cuatro lados, tres tallas y tres colores. Para el veterinario y para viajar. Envío a España.',
  html: `
<p>El transportín rígido de toda la vida se lleva en la mano, te desequilibra al andar y el gato va dando tumbos dentro. Una mochila va a la espalda, con el peso repartido, y las dos manos te quedan libres.</p>
<p>Esta lleva malla en los cuatro lados, así que el animal ve lo que pasa y corre el aire. La base es rígida para que no se le hunda el suelo bajo las patas, que es lo que más les agobia.</p>
<p>Sirve para el viaje al veterinario, para el metro y para llevarlo de fin de semana. También la usan perros pequeños de hasta cinco o seis kilos.</p>
<h3>Características</h3>
<ul>
<li>Malla en los cuatro lados: ventilación real</li>
<li>Base rígida, no se hunde</li>
<li>Tirantes acolchados y cinturón de pecho</li>
<li>Correa interior de seguridad para engancharle el arnés</li>
<li>Tres tallas y tres colores</li>
</ul>
<h3>Qué talla coger</h3>
<p>Mide a tu gato <strong>sentado</strong>, de las patas a la cabeza, y de morro a nacimiento de la cola. Tiene que poder darse la vuelta dentro y tumbarse. La S es para gato pequeño o cachorro; la M para el gato normal de casa, de 4 a 5 kg; la L para gatos grandes o perros pequeños. Las medidas exactas están en las fotos. Si dudas, coge la grande.</p>
<h3>Antes de comprar</h3>
${PLAZO_LENTO}
<p><strong>No sirve para llevar al gato en cabina de avión</strong> salvo que compruebes las medidas con tu compañía. Cada aerolínea tiene las suyas y cambian.</p>
<p>Un gato no se mete en una mochila el primer día. Déjala abierta en el salón una semana, con una manta suya dentro, antes de usarla de verdad.</p>
<p>No la dejes cerrada al sol ni dentro del coche parado. Aunque tenga malla, se calienta.</p>`,
},

// ─────────────────────────────────────────── 7
{
  clave: 'mochilagrande', pid: '2606060301511601800',
  titulo: 'Mochila transportín grande y acolchada | Para gato o perro pequeño',
  tipo: 'Casa, coche y paseo',
  etiquetas: ['gato', 'transportin', 'mochila', 'viaje', 'perro pequeño'],
  colecciones: ['casa', 'gatos', 'novedades'],
  sku: 'PTC-MOCHIGRANDE',
  opciones: [{ nombre: 'Color', valores: ['Marrón visón'] }],
  variantes: [
    { vid: '2606060301511602300', valores: ['Marrón visón'], precio: '39.90' },
  ],
  seoTitulo: 'Mochila transportín grande acolchada para gato y perro',
  seoDesc: 'Mochila transportín amplia, acolchada y ventilada, con bandolera y tirantes. Para gato adulto o perro pequeño. Envío a España.',
  html: `
<p>Esta es la versión grande y blanda: más espacio dentro, tejido acolchado por fuera y suelo mullido. Para el animal que ya conoce el transportín y lo que necesita es sitio para tumbarse del todo.</p>
<p>Se lleva de tres maneras: a la espalda con los tirantes, cruzada con la bandolera, o de la mano por las asas de arriba. En un viaje largo se agradece poder cambiar.</p>
<p>Los laterales son de malla, así que el animal ve y respira. Y al ser blanda se pliega cuando no la usas, en vez de ocupar medio armario como un transportín rígido.</p>
<h3>Características</h3>
<ul>
<li>Amplia: el animal se tumba estirado</li>
<li>Exterior acolchado y suelo mullido</li>
<li>Laterales de malla</li>
<li>Tirantes de mochila + bandolera + asas</li>
<li>Se pliega para guardar</li>
</ul>
<h3>Antes de comprar</h3>
${PLAZO_LENTO}
<p>Viene en un solo color, marrón visón. Es el único que el fabricante mantiene con stock estable; si saca más, los añadimos aquí.</p>
<p>Al ser voluminosa viaja en una línea de transporte más lenta: dos o tres semanas.</p>
<p>Es blanda, no rígida. Para un perro de más de seis o siete kilos no da: ahí hace falta transportín duro.</p>
<p>Las medidas están en las fotos. Mídelo tumbado antes de pedirla.</p>`,
},

// ─────────────────────────────────────────── 8
{
  clave: 'antitirones', pid: '2607140844131605400',
  titulo: 'Correa antitirones para perro | Con amortiguador elástico, 1,5 m',
  tipo: 'Casa, coche y paseo',
  etiquetas: ['perro', 'correa', 'paseo', 'antitirones'],
  colecciones: ['casa', 'novedades'],
  sku: 'PTC-ANTITIRON',
  opciones: [{ nombre: 'Color', valores: ['Negro', 'Rojo', 'Naranja', 'Azul'] }],
  variantes: [
    { vid: '2607140844131606000', valores: ['Negro'],   precio: '19.90' },
    { vid: '2607140844131606400', valores: ['Rojo'],    precio: '19.90' },
    { vid: '2607140844131606800', valores: ['Naranja'], precio: '19.90' },
    { vid: '2607140844131607200', valores: ['Azul'],    precio: '19.90' },
  ],
  seoTitulo: 'Correa antitirones para perro con amortiguador | 1,5 m',
  seoDesc: 'Correa de 1,5 m con tramo elástico que absorbe los tirones. Asa acolchada y mosquetón reforzado. Cuatro colores. Envío a España.',
  html: `
<p>Cuando un perro pega un tirón con una correa rígida, el golpe se lo lleva entero: él en el cuello o el pecho, y tú en el hombro. Esta correa lleva un tramo elástico que se estira y absorbe el tirón, como un muelle.</p>
<p>No es un adiestrador: no enseña al perro a no tirar. Lo que hace es que el tirón deje de doler, mientras tanto. Y en un perro que reacciona de golpe a una moto o a un gato, eso son muchos tirones al día menos.</p>
<p>Mide metro y medio, que es la medida cómoda de ciudad: suficiente para que husmee, corta para que no se te cruce.</p>
<h3>Características</h3>
<ul>
<li>Tramo elástico que amortigua los tirones</li>
<li>1,5 m de largo, 2 cm de ancho</li>
<li>Asa acolchada</li>
<li>Mosquetón metálico reforzado</li>
<li>Cuatro colores</li>
</ul>
<h3>Antes de comprar</h3>
${PLAZO_LENTO}
<p>Va con arnés, no con collar. Con un perro que tira, el collar le carga todo el tirón en la garganta.</p>
<p>Amortigua el tirón, no lo elimina. Un perro de treinta kilos que se lanza sigue siendo treinta kilos que se lanzan.</p>
<p>No es una correa extensible: no se alarga a voluntad.</p>`,
},

// ─────────────────────────────────────────── 9
{
  clave: 'premios', pid: '2607121000221620800',
  titulo: 'Bolsa de premios para adiestrar | Se abre con una mano, cierre magnético',
  tipo: 'Casa, coche y paseo',
  etiquetas: ['perro', 'adiestramiento', 'premios', 'paseo'],
  colecciones: ['casa', 'novedades'],
  sku: 'PTC-PREMIOS',
  opciones: [{ nombre: 'Color', valores: ['Verde oscuro', 'Verde claro', 'Beige'] }],
  variantes: [
    { vid: '2607121000221621400', valores: ['Verde oscuro'], precio: '18.90' },
    { vid: '2607121000221621900', valores: ['Verde claro'],  precio: '18.90' },
    { vid: '2607121000221622400', valores: ['Beige'],        precio: '18.90' },
  ],
  seoTitulo: 'Bolsa de premios para adiestrar perro | Cierre magnético',
  seoDesc: 'Riñonera de premios con boca que se abre con una mano y cierre magnético. Interior lavable. Tres colores. Envío a España.',
  html: `
<p>Adiestrar va de tiempos. El premio tiene que llegar en el segundo siguiente a lo que quieres reforzar, no cuando consigues abrir el bolsillo del pantalón con la otra mano ocupada por la correa.</p>
<p>Esta bolsa tiene la boca abierta y rígida: metes la mano sin mirar. El cierre es magnético, así que se cierra solo de un golpe y no se te vuelcan los premios al agacharte.</p>
<p>Se lleva al cinturón, en bandolera o colgada del pantalón. Dentro cabe un puñado generoso de premios, y en el bolsillo de fuera caben las bolsas de caca y las llaves.</p>
<h3>Características</h3>
<ul>
<li>Boca rígida: se abre con una sola mano</li>
<li>Cierre magnético, se cierra solo</li>
<li>Interior plastificado y lavable</li>
<li>Bolsillo exterior y clip de cinturón</li>
<li>11,3 × 9,5 × 6 cm — tres colores</li>
</ul>
<h3>Antes de comprar</h3>
${PLAZO_LENTO}
<p>Es de tamaño bolsillo, no una mochila. Cabe un puñado de premios y las bolsas, no la merienda.</p>
<p>El interior es lavable, pero la comida húmeda deja olor. Vacíala al llegar a casa.</p>
<p>La bolsa no adiestra: la usa quien ya sabe qué quiere premiar. Si estás empezando, una sesión con un educador vale más que cualquier accesorio.</p>`,
},

// ─────────────────────────────────────────── 10
{
  clave: 'zanahoria', pid: '2607300900071633500',
  titulo: 'Zanahoria mordedor para perro | Goma resistente, flota y rebota',
  tipo: 'Juguetes',
  etiquetas: ['perro', 'juguete', 'mordedor', 'resistente'],
  colecciones: ['juguetes', 'novedades', 'regalos'],
  sku: 'PTC-ZANAHORIA',
  opciones: [{ nombre: 'Color', valores: ['Naranja'] }],
  variantes: [
    { vid: '2607300900071639500', valores: ['Naranja'], precio: '19.90' },
  ],
  seoTitulo: 'Zanahoria mordedor para perro | Goma resistente y flota',
  seoDesc: 'Mordedor de goma y nailon con forma de zanahoria. Resiste mordidas fuertes, flota en el agua y rebota. Envío a España.',
  html: `
<p>Los peluches duran una tarde. Esta zanahoria es de goma reforzada con nailon: está pensada para el perro que destroza todo lo que le das.</p>
<p>La superficie tiene relieve, así que al morderla le frota los dientes y le rasca las encías. No sustituye al cepillado, pero ayuda con el sarro más que un juguete liso.</p>
<p>Flota y rebota descontrolada, así que vale para el agua y para lanzarla en el parque. Y lo de la forma de zanahoria no es tontería: al ser irregular no rueda recta y el perro tiene que perseguirla de verdad.</p>
<h3>Características</h3>
<ul>
<li>Goma reforzada con nailon — para mordedores fuertes</li>
<li>Relieve que ayuda a limpiar los dientes</li>
<li>Flota en el agua</li>
<li>Rebota de forma impredecible</li>
<li>Se lava con agua y jabón</li>
</ul>
<h3>Antes de comprar</h3>
${PLAZO_LENTO}
<p><strong>Resistente no es indestructible.</strong> No existe el juguete que aguante a todos los perros. Revísala de vez en cuando y tírala en cuanto empiece a soltar trozos.</p>
<p>Tamaño medio. Para un perro muy grande —un mastín, un pastor alemán fuerte— se queda corta y es riesgo de atragantamiento.</p>
<p>Un perro que muerde no debe quedarse solo con ningún juguete de goma. Se juega con él delante.</p>`,
},

// ─────────────────────────────────────────── 11
{
  clave: 'cuerdadental', pid: '1985606756796379137',
  titulo: 'Cuerda con doble nudo para perro | Algodón trenzado, limpia los dientes',
  tipo: 'Juguetes',
  etiquetas: ['perro', 'juguete', 'cuerda', 'dientes'],
  colecciones: ['juguetes', 'novedades'],
  sku: 'PTC-CUERDA2N',
  opciones: [{ nombre: 'Color', valores: ['Azul', 'Naranja', 'Rojo', 'Rosa', 'Verde'] }],
  variantes: [
    { vid: '1985606756863488002', valores: ['Azul'],    precio: '16.90' },
    { vid: '1985606756863488003', valores: ['Naranja'], precio: '16.90' },
    { vid: '1985606756863488004', valores: ['Rojo'],    precio: '16.90' },
    { vid: '1985606756863488005', valores: ['Rosa'],    precio: '16.90' },
    { vid: '1985606756863488006', valores: ['Verde'],   precio: '16.90' },
  ],
  seoTitulo: 'Cuerda doble nudo para perro | Algodón, limpia dientes',
  seoDesc: 'Cuerda de algodón trenzado con dos nudos y bola central. Para tirar, morder y limpiar los dientes. Cinco colores. Envío a España.',
  html: `
<p>La cuerda de algodón es el juguete más viejo que existe y sigue funcionando por dos razones: el perro puede jugar contigo a tirar, y cuando se aburre se la queda mordiendo él solo.</p>
<p>Esta lleva dos nudos y una bola en medio, así que hay dónde agarrar por los dos extremos. Las fibras del algodón, al morderlas, pasan entre los dientes y arrastran algo de placa: es lo más parecido al hilo dental que va a aceptar un perro.</p>
<p>Y es de las pocas cosas que puedes lavar en la lavadora cuando huele a perro.</p>
<h3>Características</h3>
<ul>
<li>Algodón trenzado, sin tintes agresivos</li>
<li>Dos nudos y bola central</li>
<li>Para jugar a tirar y para morder solo</li>
<li>Lavable a máquina</li>
<li>Cinco colores</li>
</ul>
<h3>Antes de comprar</h3>
${PLAZO_LENTO}
<p><strong>La cuerda se deshilacha, y los hilos sueltos tragados pueden hacer daño de verdad.</strong> Revísala cada pocos días y tírala cuando empiece a soltar hebras largas. No es alarmismo: es la única pega real de este juguete.</p>
<p>Al jugar a tirar, no levantes al perro del suelo ni le des tirones secos: se hace daño en el cuello y en los dientes.</p>
<p>Tamaño medio. Para un cachorro pequeño es grande; para un perro muy grande, corta.</p>`,
},

// ─────────────────────────────────────────── 12
{
  clave: 'ventosa', pid: '2601290345451621600',
  titulo: 'Cuerda con ventosa para perro | Se pega al suelo y juega solo',
  tipo: 'Juguetes',
  etiquetas: ['perro', 'juguete', 'cachorro', 'dientes', 'solo'],
  colecciones: ['juguetes', 'novedades'],
  sku: 'PTC-VENTOSA',
  opciones: [{ nombre: 'Color', valores: ['Azul', 'Verde', 'Rojo'] }],
  variantes: [
    { vid: '2601290345451621900', valores: ['Azul'],  precio: '19.90' },
    { vid: '2601290345451622200', valores: ['Verde'], precio: '19.90' },
    { vid: '2601290345451622500', valores: ['Rojo'],  precio: '19.90' },
  ],
  seoTitulo: 'Cuerda con ventosa para perro | Juega solo, se pega al suelo',
  seoDesc: 'Juguete de cuerda con ventosa que se fija al suelo liso. El perro tira y el juguete resiste. Ideal para cachorros. Envío a España.',
  html: `
<p>Jugar a tirar de la cuerda hace falta ser dos. Este juguete resuelve la otra mitad: la ventosa se pega al suelo liso y el perro tira contra ella. El juguete aguanta, cede un poco, vuelve. El perro juega solo.</p>
<p>Es el juguete del cachorro que muerde todo mientras cambia los dientes, y el del perro que se aburre cuando no estás en casa. Además le ocupa la mandíbula, que es lo que necesita cuando está nervioso.</p>
<p>Se pega en el suelo de la cocina, en la bañera o en un azulejo. En parquet muy poroso o en alfombra, no agarra.</p>
<h3>Características</h3>
<ul>
<li>Ventosa fuerte para superficie lisa</li>
<li>Cuerda trenzada con pelota</li>
<li>El perro juega sin que estés tú</li>
<li>Bueno para cachorros que cambian los dientes</li>
<li>Tres colores</li>
</ul>
<h3>Antes de comprar</h3>
${PLAZO_LENTO}
<p><strong>La ventosa necesita suelo liso y limpio</strong>: baldosa, azulejo, cristal. En parquet rugoso, en corcho o en alfombra no se sujeta. Es la queja más habitual de este tipo de juguete y conviene saberlo antes.</p>
<p>Para perro pequeño y mediano. Un perro grande y fuerte la despega de un tirón.</p>
<p>La cuerda se deshilacha con el uso: revísala y tírala cuando suelte hebras.</p>`,
},

// ─────────────────────────────────────────── 13
{
  clave: 'oca', pid: '2603190904161622000',
  titulo: 'Peluche cabezón con sonido | Oca, perrito o pingüino, dos tamaños',
  tipo: 'Juguetes',
  etiquetas: ['perro', 'gato', 'juguete', 'peluche', 'regalo'],
  colecciones: ['juguetes', 'novedades', 'regalos'],
  sku: 'PTC-PELUCHE',
  opciones: [
    { nombre: 'Modelo', valores: ['Perrito', 'Oca cabezona', 'Pingüino'] },
    { nombre: 'Tamaño', valores: ['21 cm', '30 cm'] },
  ],
  variantes: [
    { vid: '2603190904161624400', valores: ['Perrito', '21 cm'],      precio: '19.90' },
    { vid: '2603190904161624900', valores: ['Perrito', '30 cm'],      precio: '22.90' },
    { vid: '2603190904161625200', valores: ['Oca cabezona', '21 cm'], precio: '19.90' },
    { vid: '2603190904161625900', valores: ['Oca cabezona', '30 cm'], precio: '22.90' },
    { vid: '2603190904161626200', valores: ['Pingüino', '21 cm'],     precio: '19.90' },
    { vid: '2603190904161626900', valores: ['Pingüino', '30 cm'],     precio: '22.90' },
  ],
  seoTitulo: 'Peluche cabezón con sonido para perro | Dos tamaños',
  seoDesc: 'Peluche blando con pitido interior. Oca, perrito o pingüino, en 21 y 30 cm. Para perros que no destrozan. Envío a España.',
  html: `
<p>No todos los perros destrozan. Muchos lo que quieren es algo blando que llevar de un lado a otro de la casa, dejar en su cama y volver a coger. Para esos está el peluche.</p>
<p>Este lleva un pitido dentro: al apretarlo suena, y ese sonido es medio juego en sí mismo. Vienen tres modelos —el perrito, la oca cabezona y el pingüino— en dos tamaños.</p>
<p>El de 21 cm es para perro pequeño o para gato. El de 30 cm es de abrazar, para perro mediano.</p>
<h3>Características</h3>
<ul>
<li>Tela suave con relleno blando</li>
<li>Pitido interior</li>
<li>Tres modelos y dos tamaños</li>
<li>Ligero: se lo lleva por toda la casa</li>
</ul>
<h3>Antes de comprar</h3>
${PLAZO_LENTO}
<p><strong>No es para perros que destrozan.</strong> Es un peluche: un mordedor decidido lo abre y saca el relleno en una tarde. Si tu perro es de esos, mira la zanahoria de goma.</p>
<p>El pitido es una pieza pequeña de plástico. Si el peluche se rompe, quítalo y tira el juguete: no debe quedarse suelto por el suelo.</p>
<p>Se lava a mano en agua fría y se seca al aire. En la lavadora se le va el relleno de sitio.</p>`,
},

// ─────────────────────────────────────────── 14
{
  clave: 'papel', pid: '2605040637151639600',
  titulo: 'Juguete de papel crujiente para perro | Suena al morder, con pelota',
  tipo: 'Juguetes',
  etiquetas: ['perro', 'juguete', 'crujiente', 'dientes'],
  colecciones: ['juguetes', 'novedades'],
  sku: 'PTC-PAPEL',
  opciones: [{ nombre: 'Color', valores: ['Azul zafiro', 'Verde', 'Naranja', 'Rosa'] }],
  variantes: [
    { vid: '2605040637161630400', valores: ['Azul zafiro'], precio: '18.90' },
    { vid: '2605040637161631100', valores: ['Verde'],       precio: '18.90' },
    { vid: '2605040637161631700', valores: ['Naranja'],     precio: '18.90' },
    { vid: '2605040637161632200', valores: ['Rosa'],        precio: '18.90' },
  ],
  seoTitulo: 'Juguete de papel crujiente para perro con pelota',
  seoDesc: 'Juguete con papel crujiente interior que suena al morder, más pelota. 24 cm, cuatro colores. Envío a España.',
  html: `
<p>Si tu perro persigue las bolsas de plástico y los paquetes de Amazon, no es por la bolsa: es por el ruido. El crujido activa algo que el peluche silencioso no toca.</p>
<p>Este juguete lleva papel crujiente dentro de la tela. Cada mordisco suena, y ese sonido le hace volver a morder. Además incluye una pelota, para el rato de lanzar y traer.</p>
<p>Mide 24 cm de alto, tamaño de perro pequeño y mediano.</p>
<h3>Características</h3>
<ul>
<li>Papel crujiente en el interior</li>
<li>Pelota incluida</li>
<li>24 cm de alto</li>
<li>Tejido resistente con costuras reforzadas</li>
<li>Cuatro colores</li>
</ul>
<h3>Antes de comprar</h3>
${PLAZO_LENTO}
<p>Es de tela, no de goma. Aguanta a un perro normal, no a uno que destroza por sistema.</p>
<p><strong>El crujido se apaga con el tiempo</strong>: el papel se va aplastando. Es normal y no tiene arreglo.</p>
<p>Si la tela se abre, tira el juguete. El papel interior no debe comérselo.</p>
<p>Se lava a mano. En la lavadora el papel se apelmaza y se queda mudo.</p>`,
},

// ─────────────────────────────────────────── 15
{
  clave: 'balsamo', pid: '2608240157081631900',
  titulo: 'Bálsamo para almohadillas de perro y gato | 50 g, para grietas y asfalto',
  tipo: 'Higiene y cuidado',
  etiquetas: ['perro', 'gato', 'almohadillas', 'cuidado', 'invierno'],
  colecciones: ['higiene', 'novedades'],
  sku: 'PTC-BALSAMO',
  opciones: [{ nombre: 'Formato', valores: ['50 g'] }],
  variantes: [
    { vid: '2608240157081633000', valores: ['50 g'], precio: '16.90' },
  ],
  seoTitulo: 'Bálsamo para almohadillas de perro | 50 g, hidratante',
  seoDesc: 'Bálsamo hidratante para almohadillas agrietadas por el frío, la sal o el asfalto. Tarro de 50 g. Envío a España.',
  html: `
<p>La almohadilla es piel, y la piel se agrieta. En invierno por el frío y la sal de las aceras; en verano por el asfalto caliente; y todo el año por el suelo áspero de la ciudad.</p>
<p>Cuando se agrieta, el animal cojea un poco, se lame las patas y a veces sangra por las hendiduras. Este bálsamo hidrata y forma una capa que protege del roce mientras la piel se recupera.</p>
<p>Se pone una capa fina y se le distrae cinco minutos para que no se lo lama de inmediato. Lo normal es aplicarlo por la noche, antes de que se duerma.</p>
<h3>Características</h3>
<ul>
<li>Tarro de 50 g — dura meses</li>
<li>Hidrata y protege las grietas</li>
<li>Para perro y para gato</li>
<li>Se absorbe sin dejar la pata resbaladiza</li>
</ul>
<h3>Cómo se usa</h3>
<p>Lávale la pata y sécala. Pon una capa fina en cada almohadilla y masajea unos segundos. Entretenlo un rato para que se absorba. Al principio, una vez al día unos días; después, dos o tres veces por semana.</p>
<h3>Antes de comprar</h3>
${PLAZO_RAPIDO}
<p>Es un cosmético, no un medicamento. <strong>Si la almohadilla tiene una herida abierta, sangra, huele mal o el animal cojea de verdad, eso lo ve el veterinario.</strong> El bálsamo es para prevenir y para grietas leves.</p>
<p>Al ser un producto en crema viaja en la línea de líquidos: una o dos semanas.</p>
<p>En verano, lo que más protege no es ningún bálsamo: es no sacarlo al asfalto a las tres de la tarde.</p>`,
},

// ─────────────────────────────────────────── 16
{
  clave: 'toallitas', pid: '2608261446101630200',
  titulo: 'Toallitas de dedo para los ojos | 50 unidades, perro y gato',
  tipo: 'Higiene y cuidado',
  etiquetas: ['perro', 'gato', 'ojos', 'higiene', 'lagrimas'],
  colecciones: ['higiene', 'novedades'],
  sku: 'PTC-TOALLITAS',
  opciones: [{ nombre: 'Formato', valores: ['50 unidades'] }],
  variantes: [
    { vid: '2608261446101631000', valores: ['50 unidades'], precio: '18.90' },
  ],
  seoTitulo: 'Toallitas para los ojos de perro y gato | 50 unidades',
  seoDesc: 'Toallitas de dedo para limpiar legañas y marcas de lágrima. 50 unidades, para perro y gato. Envío a España.',
  html: `
<p>Las marcas rojizas debajo del ojo salen sobre todo en perros de pelo claro —caniches, malteses, bichones— y en gatos de cara chata. Son lágrima seca, y si no se limpia se oscurece y se pega.</p>
<p>Estas toallitas van en forma de dedal: te la pones en el dedo índice y limpias justo el pliegue del ojo, con precisión. Es mucho más fácil que pelear con una toallita normal doblada en cuatro.</p>
<p>Vienen 50 en el bote, para el uso de cada día.</p>
<h3>Características</h3>
<ul>
<li>50 toallitas de dedo</li>
<li>Para el pliegue del ojo y las legañas secas</li>
<li>Textura suave, sin alcohol</li>
<li>Bote con tapa: no se secan</li>
<li>Perro y gato</li>
</ul>
<h3>Antes de comprar</h3>
${PLAZO_RAPIDO}
<p><strong>Se limpia alrededor del ojo, nunca dentro.</strong> Esto no es un colirio.</p>
<p>Al ser un producto húmedo viaja en la línea de líquidos: una o dos semanas.</p>
<p>Limpian la marca, no la quitan de raíz. La mancha de lágrima se va con constancia, en semanas.</p>
<p><strong>Si el ojo está rojo, si lagrimea de golpe mucho más que antes, o si el animal se lo frota, eso es del veterinario.</strong> Puede ser un pelo dentro, una úlcera o el lagrimal obstruido, y ninguna toallita lo arregla.</p>`,
},

// ─────────────────────────────────────────── 17
{
  clave: 'comedero', pid: '2609120406151603000',
  titulo: 'Comedero elevado de acero inoxidable | Soporte de metacrilato',
  tipo: 'Comederos y bebederos',
  etiquetas: ['gato', 'perro', 'comedero', 'elevado', 'acero'],
  colecciones: ['comederos', 'gatos', 'novedades'],
  sku: 'PTC-COMEDELEV',
  opciones: [{ nombre: 'Modelo', valores: ['Soporte + cuenco de acero'] }],
  variantes: [
    { vid: '2609120406151604100', valores: ['Soporte + cuenco de acero'], precio: '29.90' },
  ],
  seoTitulo: 'Comedero elevado de acero inoxidable con soporte',
  seoDesc: 'Comedero elevado con cuenco de acero inoxidable 304 y soporte inclinado de metacrilato. Mejor postura al comer. Envío a España.',
  html: `
<p>Comer con la cabeza en el suelo obliga al animal a doblar el cuello hacia abajo todo el rato. En gatos y en perros de cierta edad eso molesta, y además les hace tragar más aire.</p>
<p>Este comedero levanta el cuenco y lo deja inclinado hacia el animal, así que come con el cuello casi recto y llega al fondo sin rebañar con el morro aplastado contra el plato.</p>
<p>El cuenco es de acero inoxidable 304, que es el que se usa en cocina: no coge olores, no se raya con la lengua y no provoca el acné del mentón que da el plástico a muchos gatos. Se saca y va al lavavajillas. El soporte es de metacrilato de 5 mm.</p>
<h3>Características</h3>
<ul>
<li>Cuenco de acero inoxidable 304, apto para lavavajillas</li>
<li>Soporte elevado e inclinado de metacrilato de 5 mm</li>
<li>Mejor postura de cuello al comer</li>
<li>No coge olores ni sabores</li>
<li>Base antideslizante</li>
</ul>
<h3>Antes de comprar</h3>
${PLAZO_RAPIDO}
<p>Está pensado para gatos y perros pequeños. Para un perro grande la altura se queda corta.</p>
<p><strong>En perros grandes de pecho profundo, el comedero elevado es un tema discutido</strong> —se ha relacionado con la torsión de estómago—. Si tienes un perro así, pregúntale al veterinario antes de cambiarle la altura del plato.</p>
<p>Las medidas están en las fotos. Mídele la altura del codo antes de pedirlo.</p>
<p>Se vende el conjunto completo: soporte y cuenco.</p>`,
},

// ─────────────────────────────────────────── 18
{
  clave: 'arena', pid: '2604040616471624900',
  titulo: 'Alfombrilla atrapa-arena de doble capa | Recoge la arena del gato',
  tipo: 'Higiene y cuidado',
  etiquetas: ['gato', 'arenero', 'alfombrilla', 'limpieza'],
  colecciones: ['higiene', 'gatos', 'novedades'],
  sku: 'PTC-ALFARENA',
  opciones: [
    { nombre: 'Tamaño', valores: ['45 × 60 cm', '55 × 75 cm', '60 × 90 cm'] },
    { nombre: 'Color', valores: ['Gris oscuro', 'Beige', 'Verde', 'Negro'] },
  ],
  variantes: [
    { vid: '2604040616471626200', valores: ['45 × 60 cm', 'Gris oscuro'], precio: '19.90' },
    { vid: '2604040616471626600', valores: ['55 × 75 cm', 'Gris oscuro'], precio: '22.90' },
    { vid: '2604040616471626900', valores: ['60 × 90 cm', 'Gris oscuro'], precio: '25.90' },
    { vid: '2604040616471628500', valores: ['45 × 60 cm', 'Beige'],       precio: '19.90' },
    { vid: '2604040616471628900', valores: ['55 × 75 cm', 'Beige'],       precio: '22.90' },
    { vid: '2604040616471629300', valores: ['60 × 90 cm', 'Beige'],       precio: '25.90' },
    { vid: '2604040616481620900', valores: ['45 × 60 cm', 'Verde'],       precio: '19.90' },
    { vid: '2604040616481621300', valores: ['55 × 75 cm', 'Verde'],       precio: '22.90' },
    { vid: '2604040616481621600', valores: ['60 × 90 cm', 'Verde'],       precio: '25.90' },
    { vid: '2604040616481623100', valores: ['45 × 60 cm', 'Negro'],       precio: '19.90' },
    { vid: '2604040616481623500', valores: ['55 × 75 cm', 'Negro'],       precio: '22.90' },
    { vid: '2604040616481623800', valores: ['60 × 90 cm', 'Negro'],       precio: '25.90' },
  ],
  seoTitulo: 'Alfombrilla atrapa-arena para gato | Doble capa, 3 tamaños',
  seoDesc: 'Alfombrilla de doble capa que atrapa la arena entre las dos hojas. Se abre y se vacía. Tres tamaños y cuatro colores.',
  html: `
<p>El gato sale del arenero y va dejando arena por el pasillo. Las alfombrillas normales la retienen un poco y luego la sueltan; esta la guarda.</p>
<p>Son dos capas con agujeros: la de arriba deja caer la arena y la de abajo la recoge. Cuando está llena, se abre por un lado como un libro y se vuelca en la basura. Sin aspirador y sin sacudir nada por el balcón.</p>
<p>El material es EVA blando, así que no le molesta en las almohadillas —muchos gatos no pisan las alfombrillas de púas duras— y se limpia con un trapo húmedo. Es impermeable: si se sale pis, se queda arriba y no pasa al suelo.</p>
<h3>Características</h3>
<ul>
<li>Doble capa: la arena queda atrapada dentro</li>
<li>Se abre por un lado para vaciarla</li>
<li>EVA blando, cómodo de pisar</li>
<li>Impermeable y antideslizante</li>
<li>Tres tamaños y cuatro colores</li>
</ul>
<h3>Qué tamaño coger</h3>
<p>La alfombrilla tiene que ser más ancha que la boca del arenero y dejar un par de pasos por delante: es en esos pasos donde suelta la arena. Para un arenero normal cerrado, 45 × 60 cm llega. Si es abierto, o si tienes dos gatos, ve a 55 × 75. La de 60 × 90 es para arenero grande o zona de dos areneros.</p>
<h3>Antes de comprar</h3>
${PLAZO_LENTO}
<p>Al ser voluminosa viaja en una línea más lenta: dos o tres semanas.</p>
<p>Llega enrollada y tarda un día o dos en quedarse plana. Ponle un peso encima esa primera noche.</p>
<p>Recoge mucha arena, no toda. La arena muy fina siempre escapa algo.</p>
<p>Hay gatos a los que no les gusta pisar nada nuevo. Ponla unos días sin cambiar nada más de sitio.</p>`,
},

// ─────────────────────────────────────────── 19
{
  clave: 'gorro', pid: '2605310913451608000',
  titulo: 'Gorro de sol para perro y gato | Transpirable, con goma de barbilla',
  tipo: 'Ropa y calzado',
  etiquetas: ['perro', 'gato', 'gorro', 'verano', 'sol', 'regalo'],
  colecciones: ['ropa', 'novedades', 'regalos'],
  sku: 'PTC-GORROSOL',
  opciones: [{ nombre: 'Modelo', valores: ['Patito amarillo (M)', 'Gorra hip hop (M)', 'Osito (M)', 'Conejo luna rosa (M)', 'Dinosaurio naranja (S)', 'Dinosaurio naranja (M)', 'Dinosaurio naranja (L)', 'Multicolor (L)'] }],
  variantes: [
    { vid: '2605310913451608800', valores: ['Patito amarillo (M)'],    precio: '14.90' },
    { vid: '2605310913451609300', valores: ['Gorra hip hop (M)'],      precio: '14.90' },
    { vid: '2605310913451609800', valores: ['Osito (M)'],              precio: '14.90' },
    { vid: '2605310913461600300', valores: ['Conejo luna rosa (M)'],   precio: '14.90' },
    { vid: '2609010750581604601', valores: ['Dinosaurio naranja (S)'], precio: '14.90' },
    { vid: '2609010750581604600', valores: ['Dinosaurio naranja (M)'], precio: '14.90' },
    { vid: '2609010316401635800', valores: ['Dinosaurio naranja (L)'], precio: '14.90' },
    { vid: '2609010750581604602', valores: ['Multicolor (L)'],         precio: '14.90' },
  ],
  seoTitulo: 'Gorro de sol para perro y gato | Transpirable, con goma',
  seoDesc: 'Gorro transpirable con goma de barbilla ajustable y huecos para las orejas. Ocho modelos. Para el sol y para la foto.',
  html: `
<p>Medio gorro es para el sol y medio es para la foto, y no pasa nada por reconocerlo.</p>
<p>Lo del sol es real: en perros de morro largo y de pelo corto y claro, el puente de la nariz y la parte de arriba de la cabeza se queman. El ala del gorro da sombra justo ahí.</p>
<p>Lleva goma de barbilla ajustable, para que no se le caiga al agacharse, y huecos para que las orejas salgan por fuera, que es lo que hace que la mayoría lo tolere.</p>
<h3>Características</h3>
<ul>
<li>Tejido transpirable, no acumula calor</li>
<li>Goma de barbilla ajustable</li>
<li>Huecos para las orejas</li>
<li>Ocho modelos distintos</li>
<li>Se lava a mano</li>
</ul>
<h3>Qué modelo coger</h3>
<p>La mayoría son talla M, para animales de hasta unos 12 kg. El dinosaurio naranja está en S, M y L, y el multicolor solo en L. Mídele el contorno de la cabeza por encima de las orejas y compáralo con la tabla de las fotos.</p>
<h3>Antes de comprar</h3>
${PLAZO_RAPIDO}
<p><strong>No todos los animales aceptan un gorro</strong>, y los gatos menos que los perros. Pruébaselo un minuto en casa con un premio. Si se agobia, se le quita y ya está: no se insiste.</p>
<p>No es un accesorio para dejarle puesto toda la tarde. Para la foto, el paseo corto o el rato de terraza.</p>
<p>Da sombra, no es protección solar veterinaria. Si tu perro tiene la piel muy clara o ya ha tenido problemas de sol, pregunta al veterinario por una crema específica.</p>`,
},

// ─────────────────────────────────────────── 20
{
  clave: 'vestido', pid: '2605310623221609100',
  titulo: 'Vestido estilo colegial para perra o gata | Seis tallas, de XS a XXL',
  tipo: 'Ropa y calzado',
  etiquetas: ['perro', 'gato', 'ropa', 'vestido', 'regalo'],
  colecciones: ['ropa', 'novedades', 'regalos'],
  sku: 'PTC-VESTIDO',
  opciones: [{ nombre: 'Talla', valores: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] }],
  variantes: [
    { vid: '2605310623221609800', valores: ['XS'],  precio: '16.90' },
    { vid: '2605310623231600300', valores: ['S'],   precio: '16.90' },
    { vid: '2605310623231600800', valores: ['M'],   precio: '16.90' },
    { vid: '2605310623231601200', valores: ['L'],   precio: '16.90' },
    { vid: '2605310623231601600', valores: ['XL'],  precio: '16.90' },
    { vid: '2605310623231602100', valores: ['XXL'], precio: '16.90' },
  ],
  seoTitulo: 'Vestido colegial para perra pequeña y gata | XS a XXL',
  seoDesc: 'Vestido tipo chaleco de estilo colegial en azul zafiro. Seis tallas, de XS a XXL. Para perras y gatas pequeñas. Envío a España.',
  html: `
<p>Un vestido de tirantes, de estilo colegial, en azul zafiro. Es ropa de andar por casa y de foto, no de abrigo.</p>
<p>Va sin mangas, así que no le agarrota las patas delanteras, que es lo que hace que muchos animales rechacen la ropa. Se pone por la cabeza y se ajusta por la espalda.</p>
<p>Vale para perras pequeñas y para gatas. Seis tallas, de la XS a la XXL.</p>
<h3>Características</h3>
<ul>
<li>Vestido sin mangas, tipo chaleco</li>
<li>Azul zafiro con detalle colegial</li>
<li>Seis tallas: XS, S, M, L, XL, XXL</li>
<li>Tejido ligero, para entretiempo</li>
<li>Se lava a máquina en frío</li>
</ul>
<h3>Cómo elegir la talla</h3>
<p>Mide el <strong>contorno de pecho</strong> (la parte más ancha, justo detrás de las patas delanteras) y el <strong>largo del lomo</strong> (del cuello a la cola). Las medidas están en las fotos. <strong>Las tallas son asiáticas y tiran pequeñas: si tu medida cae entre dos, coge la grande.</strong> Es el fallo más común al comprar ropa de mascota por internet.</p>
<h3>Antes de comprar</h3>
${PLAZO_RAPIDO}
<p>Viene en un solo color, azul zafiro.</p>
<p>No abriga. Es ropa de entretiempo y de casa; para el frío de verdad hace falta un abrigo acolchado.</p>
<p>Déjaselo puesto un rato en casa antes de salir con él. Y si se queda quieto como un pasmarote o intenta quitárselo, no es para tu animal.</p>`,
},


// ─────────────────────────────────────────── 21
{
  clave: 'sudadera', pid: '1403920038016192512',
  titulo: 'Sudadera con capucha de frutas y animales | Siete diseños, seis tallas',
  tipo: 'Ropa y calzado',
  etiquetas: ['perro', 'gato', 'ropa', 'invierno', 'sudadera', 'disfraz', 'regalo'],
  colecciones: ['ropa', 'novedades', 'regalos', 'navidad'],
  sku: 'PTC-SUDAFRUTA',
  opciones: [
    { nombre: 'Diseño', valores: ['Manzana roja', 'Corazón', 'Zanahoria', 'Ajo tierno', 'Rana', 'Reno', 'Plátano'] },
    { nombre: 'Talla', valores: ['XS', 'S', 'M', 'L', 'XL', '2XL'] },
  ],
  variantes: [
    { vid: '1403920039480004608', valores: ['Manzana roja', 'XS'], precio: '19.90' },
    { vid: '1403920039488393216', valores: ['Manzana roja', 'S'], precio: '19.90' },
    { vid: '1403920039496781824', valores: ['Manzana roja', 'M'], precio: '19.90' },
    { vid: '1403920039505170432', valores: ['Manzana roja', 'L'], precio: '19.90' },
    { vid: '1403920039517753344', valores: ['Manzana roja', 'XL'], precio: '19.90' },
    { vid: '1403920039526141952', valores: ['Manzana roja', '2XL'], precio: '19.90' },
    { vid: '1403920039534530560', valores: ['Corazón', 'XS'], precio: '19.90' },
    { vid: '1403920039542919168', valores: ['Corazón', 'S'], precio: '19.90' },
    { vid: '1403920039551307776', valores: ['Corazón', 'M'], precio: '19.90' },
    { vid: '1403920039563890688', valores: ['Corazón', 'L'], precio: '19.90' },
    { vid: '1403920039580667904', valores: ['Corazón', 'XL'], precio: '19.90' },
    { vid: '1403920039589056512', valores: ['Corazón', '2XL'], precio: '19.90' },
    { vid: '1403920039601639424', valores: ['Zanahoria', 'XS'], precio: '19.90' },
    { vid: '1403920039610028032', valores: ['Zanahoria', 'S'], precio: '19.90' },
    { vid: '1403920039622610944', valores: ['Zanahoria', 'M'], precio: '19.90' },
    { vid: '1403920039630999552', valores: ['Zanahoria', 'L'], precio: '19.90' },
    { vid: '1403920039639388160', valores: ['Zanahoria', 'XL'], precio: '19.90' },
    { vid: '1403920039651971072', valores: ['Zanahoria', '2XL'], precio: '19.90' },
    { vid: '1403920039660359680', valores: ['Ajo tierno', 'XS'], precio: '19.90' },
    { vid: '1403920039672942592', valores: ['Ajo tierno', 'S'], precio: '19.90' },
    { vid: '1403920039681331200', valores: ['Ajo tierno', 'M'], precio: '19.90' },
    { vid: '1403920039689719808', valores: ['Ajo tierno', 'L'], precio: '19.90' },
    { vid: '1403920039698108416', valores: ['Ajo tierno', 'XL'], precio: '19.90' },
    { vid: '1403920039710691328', valores: ['Ajo tierno', '2XL'], precio: '19.90' },
    { vid: '1403920039719079936', valores: ['Rana', 'XS'], precio: '19.90' },
    { vid: '1403920039727468544', valores: ['Rana', 'S'], precio: '19.90' },
    { vid: '1403920039735857152', valores: ['Rana', 'M'], precio: '19.90' },
    { vid: '1403920039744245760', valores: ['Rana', 'L'], precio: '19.90' },
    { vid: '1403920039752634368', valores: ['Rana', 'XL'], precio: '19.90' },
    { vid: '1403920039761022976', valores: ['Rana', '2XL'], precio: '19.90' },
    { vid: '1403920039769411584', valores: ['Reno', 'XS'], precio: '19.90' },
    { vid: '1403920039781994496', valores: ['Reno', 'S'], precio: '19.90' },
    { vid: '1403920039790383104', valores: ['Reno', 'M'], precio: '19.90' },
    { vid: '1403920039798771712', valores: ['Reno', 'L'], precio: '19.90' },
    { vid: '1403920039807160320', valores: ['Reno', 'XL'], precio: '19.90' },
    { vid: '1403920039815548928', valores: ['Reno', '2XL'], precio: '19.90' },
    { vid: '1403920039823937536', valores: ['Plátano', 'XS'], precio: '19.90' },
    { vid: '1403920039832326144', valores: ['Plátano', 'S'], precio: '19.90' },
    { vid: '1403920039840714752', valores: ['Plátano', 'M'], precio: '19.90' },
    { vid: '1403920039849103360', valores: ['Plátano', 'L'], precio: '19.90' },
    { vid: '1403920039857491968', valores: ['Plátano', 'XL'], precio: '19.90' },
    { vid: '1403920039870074880', valores: ['Plátano', '2XL'], precio: '19.90' },
  ],
  seoTitulo: 'Sudadera con capucha para perro pequeño | 7 diseños',
  seoDesc: 'Sudadera de forro polar con capucha de fruta o animal. Siete diseños y seis tallas, de XS a 2XL. Para perro pequeño y gato. Envío a España.',
  html: `
<p>Es una sudadera de forro polar, de las de dos patas: se le pone por la cabeza, le cubre el lomo y el pecho y le deja las patas de atrás libres. Por dentro es suave y por fuera abriga de verdad, que es lo que hace falta a un perro pequeño en enero.</p>
<p>Lo de la capucha es lo que la hace distinta. Hay siete: manzana, zanahoria, plátano, ajo tierno, un corazón, una rana y un reno. La del reno es la de las fotos de Navidad, y la rana es la que más se ve en los vídeos.</p>
<p>La capucha se le puede bajar y queda como una sudadera normal. Se ata con un cordón por delante.</p>
<h3>Características</h3>
<ul>
<li>Forro polar por dentro, tejido abrigado por fuera</li>
<li>De dos patas: se pone por la cabeza, sin meterle las patas traseras</li>
<li>Capucha con forma, que se puede bajar</li>
<li>Siete diseños y seis tallas, de XS a 2XL</li>
<li>Se lava a máquina en frío</li>
</ul>
<h3>Cómo elegir la talla</h3>
<p>Mide el <strong>largo del lomo</strong> (del cuello a la base de la cola) y el <strong>contorno de pecho</strong> (la parte más ancha, detrás de las patas delanteras). Las medidas están en las fotos.</p>
<p><strong>Las tallas son asiáticas y tiran pequeñas.</strong> Si tu medida cae entre dos, coge la grande. Es el fallo más habitual comprando ropa de mascota por internet, y con una sudadera de meter por la cabeza se nota más.</p>
<p>Está pensada para perro pequeño y para gato. La 2XL llega a perro pequeño-mediano, no a uno grande.</p>
<h3>Antes de comprar</h3>
<p>Llega a España en dos o tres semanas. Sale de nuestro proveedor en Asia: de 1 a 3 días laborables de preparación y luego el transporte, siempre con número de seguimiento.</p>
<p>Abriga, pero no es impermeable. Con lluvia se cala.</p>
<p>No le cubre las patas ni la tripa. Si buscas eso, mira el mono acolchado de cuatro patas.</p>
<p>La capucha puesta molesta a algunos perros. Se puede llevar bajada perfectamente, y así sigue siendo una sudadera de abrigo.</p>`,
},

]};
