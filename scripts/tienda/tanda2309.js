// Tanda del 23 de septiembre de 2026: seis productos que el catálogo no tenía.
//
// Pedido de Pablo: "analiza productos y súbelos a la tienda, como mínimo 6,
// bien, sin errores". Selección, márgenes y descartes en
// research/tanda-2026-09-23.md.
//
//   node scripts/tienda/tanda2309.js <carpeta-cj>             # comprueba
//   node scripts/tienda/tanda2309.js <carpeta-cj> --escribir  # y deja las variables
//
// <carpeta-cj> tiene el detalle de CJ de cada producto (<clave>.json), bajado
// con /product/query. Las fotos se eligen A MANO por su posición en la lista de
// fotos de CJ, después de mirarlas a tamaño real: nada de "las 10 primeras".
const fs = require('fs');
const path = require('path');

const RAW = 'https://raw.githubusercontent.com/lope200007/Shopify/main/assets/tienda/2026-09/';
const COL_ROPA = 'gid://shopify/Collection/698287325532'; // «Ropa y abrigos» es manual; el resto va por etiquetas
const USD = 0.92;

const PLAZO = '<p>Llega a España en dos o tres semanas: de 1 a 3 días laborables de preparación y luego el transporte, siempre con número de seguimiento.</p>';
const NAVIDAD = '<p><strong>Si lo quieres para Navidad, pídelo antes del 1 de diciembre.</strong></p>';

const fichas = [
{
  clave: 'rascador-portatil', pid: '1782660933710516224', porte: 9.56,
  handle: 'rascador-portatil-gato',
  titulo: 'Rascador con forma de portátil para gato | Cartón, 34 × 29 cm',
  tipo: 'Rascadores', categoria: 'gid://shopify/TaxonomyCategory/ap-2-2-2-3', sku: 'PTC-RASCAPORTATIL',
  etiquetas: ['gato', 'c-rascadores', 'rascador', 'regalo', 'mascotas'],
  seoTitulo: 'Rascador con forma de portátil para gato | Cartón',
  seoDesc: 'Un ordenador portátil de cartón que tu gato sí puede arañar. Base de cartón corrugado para rascar y tapa con pantalla dibujada. 34 × 29 cm.',
  fotos: [2, 4], extra: ['rascador-portatil-medidas.jpg'],
  alts: ["Gatito atigrado junto al rascador con forma de portátil, visto desde detrás de la tapa", "Gatito arañando la base de cartón del rascador portátil, con la pantalla dibujada levantada", "Medidas del rascador portátil: 34 × 29 cm y 4 cm de grosor"],
  opciones: [{ nombre: 'Modelo', valores: ['Portátil blanco'] }],
  variantes: [{ vid: '1782660933806985216', valores: ['Portátil blanco'], precio: '24.90' }],
  html: `<p>Si tu gato se tumba encima del teclado cada vez que te sientas a trabajar, esto es para él: un portátil de cartón que sí puede arañar.</p>
<p>La base es cartón corrugado para rascar y la tapa hace de pantalla, con un gato dibujado. Lo pones al lado de tu ordenador y él tiene el suyo.</p>
<h3>Características</h3>
<ul>
<li>Cartón corrugado para rascar</li>
<li>Forma de ordenador portátil, con la tapa levantada</li>
<li>34 × 29 cm y 4 cm de grosor, según el proveedor</li>
<li>Blanco, con dibujos en negro y la pantalla en color</li>
</ul>
<h3>Antes de comprar</h3>
${PLAZO}
<p><strong>En las fotos se ven una pelota y un ratón de juguete.</strong> El proveedor solo pone el rascador en la lista del paquete, así que no te los prometemos.</p>
<p>Es cartón: con el uso suelta algo de viruta y se va gastando, como todos los rascadores de cartón.</p>
<p>La tapa lleva impresos, como parte del dibujo, algunos textos pequeños en inglés.</p>`,
},
{
  clave: 'tienda-reno', pid: 'B8C3BA65-DF81-4C3F-99FA-3A2652F9335C', porte: 7.20,
  handle: 'cama-iglu-reno-gato',
  titulo: 'Cama iglú de reno para gato | Peluche suave, dos tamaños',
  tipo: 'Camas y descanso', categoria: 'gid://shopify/TaxonomyCategory/ap-2-9', sku: 'PTC-IGLURENO',
  etiquetas: ['gato', 'c-cama', 'cama', 'descanso', 'navidad', 'invierno', 'regalo'],
  seoTitulo: 'Cama iglú de reno para gato | Peluche, dos tamaños',
  seoDesc: 'Cueva de peluche con cuernos de reno y nariz roja para el gato que duerme tapado. Forro polar por dentro. Base de 35 o 40 cm.',
  fotos: [0, 1, 3, 4, 2], extra: ['cama-reno-medidas.jpg'],
  alts: ["Gato blanco y gris asomado a la cama iglú de reno", "Las dos camas de reno, tamaño S y L, una al lado de la otra", "Cama de reno de frente, con la entrada de borreguito blanco", "Cama de reno vista de lado, con los cuernos y la nariz roja", "Parte de atrás de la cama de reno", "Medidas de la cama de reno: base de 35 cm en la S y de 40 cm en la L"],
  opciones: [{ nombre: 'Tamaño', valores: ['S · base de 35 cm', 'L · base de 40 cm'] }],
  variantes: [
    { vid: '5C76C3DD-BCB4-47B7-939A-85A310D18F54', valores: ['S · base de 35 cm'], precio: '29.90' },
    { vid: '756C9473-DF66-47E4-9E8C-69A14A395C3C', valores: ['L · base de 40 cm'], precio: '39.90' },
  ],
  html: `<p>Una cueva de peluche con cuernos de reno y nariz roja. Por dentro, cerrada y suave, para el gato que duerme mejor tapado. Por fuera, la decoración de Navidad que además se usa.</p>
<p>Por fuera es peluche corto muy suave y por dentro forro polar. Las paredes llevan espuma de 1,5 cm y relleno de algodón. La entrada es redonda, con el borde de borreguito blanco.</p>
<h3>Características</h3>
<ul>
<li>Tamaño S: base de 35 cm de diámetro y 35 cm de alto</li>
<li>Tamaño L: base de 40 cm de diámetro y 40 cm de alto</li>
<li>Color camel, con cuernos marrones y nariz roja</li>
<li>Peluche por fuera, forro polar por dentro, espuma de 1,5 cm</li>
</ul>
<h3>Antes de comprar</h3>
${PLAZO}
${NAVIDAD}
<p>Medidas del proveedor. Mira dónde duerme tu gato y elige el tamaño en el que quepa enroscado: si es grande o le gusta estirarse, la L.</p>
<p>El proveedor no dice si el cojín de dentro se saca para lavarlo, así que no te lo prometemos.</p>`,
},
{
  clave: 'arnes-gato', pid: '2080582126882021378', porte: 4.22,
  handle: 'arnes-gato-con-correa',
  titulo: 'Arnés de gato con correa | Chaleco reflectante que abraza el pecho, de S a XL',
  tipo: 'Arnés', categoria: 'gid://shopify/TaxonomyCategory/ap-2-17-4', sku: 'PTC-ARNESGATO',
  etiquetas: ['gato', 'paseo', 'arnes', 'correa', 'reflectante', 'c-viaje'],
  seoTitulo: 'Arnés de gato con correa de 150 cm | Chaleco reflectante',
  seoDesc: 'Chaleco de malla acolchada que rodea el pecho del gato, con bandas reflectantes y correa de 150 cm. Cuatro tallas por contorno de pecho, seis colores.',
  fotos: [0, 6, 8, 7, 10, 11, 9], extra: ['arnes-gato-tallas.jpg'],
  alts: ["Gato con el arnés azul puesto, junto a la correa y al arnés suelto", "Arnés y correa de gato en azul marino", "Arnés y correa de gato en azul", "Arnés y correa de gato en naranja", "Arnés y correa de gato en rosa", "Arnés y correa de gato en negro", "Arnés y correa de gato en rojo", "Tabla de tallas del arnés de gato por contorno de pecho"],
  opciones: [
    { nombre: 'Color', valores: ['Azul marino', 'Azul', 'Naranja', 'Rosa', 'Negro', 'Rojo'] },
    { nombre: 'Talla', valores: ['S', 'M', 'L', 'XL'] },
  ],
  variantes: (() => {
    const colores = [['Azul marino', 0], ['Azul', 4], ['Naranja', 8], ['Rosa', 12], ['Negro', 16], ['Rojo', 20]];
    const tallas = ['S', 'M', 'L', 'XL'];
    const base = 2080582126953324545n; // Navy Blue-S; el resto van seguidos (comprobado en CJ)
    const v = [];
    for (const [c, i] of colores) tallas.forEach((t, j) => v.push({ vid: String(base + BigInt(i + j)), valores: [c, t], precio: '19.90' }));
    return v;
  })(),
  html: `<p>Para sacar al gato al balcón, al jardín o llevarlo al veterinario con algo más seguro que un collar. El chaleco le rodea el pecho entero y reparte el agarre, así que es mucho más difícil que se escurra.</p>
<p>Es de malla transpirable acolchada, con bandas reflectantes en el borde para que se le vea de noche. Se ajusta por los dos lados y se cierra con un clic. Trae una correa de 150 cm a juego.</p>
<h3>Características</h3>
<ul>
<li>Chaleco de malla acolchada y transpirable</li>
<li>Bandas reflectantes</li>
<li>Dos anillas metálicas para enganchar la correa</li>
<li>Correa de 150 cm del mismo color</li>
<li>Cuatro tallas por contorno de pecho (tabla en las fotos) y seis colores</li>
</ul>
<h3>Antes de comprar</h3>
${PLAZO}
<p><strong>Mide el pecho</strong> por la parte más ancha, justo detrás de las patas delanteras: S de 30 a 34 cm, M de 35 a 40, L de 41 a 46 y XL de 47 a 52. Bien ajustado caben dos dedos entre el arnés y el cuerpo.</p>
<p>Si nunca ha llevado arnés, pónselo en casa unos días antes de salir, un rato cada vez.</p>
<p>Ningún arnés es a prueba de todo: un gato muy asustado puede encogerse y salir de cualquiera. No lo dejes atado solo ni sin vigilar.</p>`,
},
{
  clave: 'tumbona-gato', pid: '3FDB8E83-F628-42FA-B88A-22021B419CE5', porte: 4.53,
  handle: 'hamaca-bajo-silla-gato',
  titulo: 'Hamaca para debajo de la silla | Para gato, se ata a las cuatro patas',
  tipo: 'Cama para gato', categoria: 'gid://shopify/TaxonomyCategory/ap-2-2-2', sku: 'PTC-HAMSILLA',
  etiquetas: ['gato', 'c-cama', 'descanso', 'hamaca', 'hogar'],
  seoTitulo: 'Hamaca para debajo de la silla | Cama colgante para gato',
  seoDesc: 'Hamaca que se ata a las cuatro patas de una silla o un taburete y convierte el hueco de debajo en una cama colgante para el gato. 40 × 40 o 48 × 50 cm.',
  fotos: [3, 0, 12, 4, 10, 2, 1], extra: ['hamaca-silla-medidas.jpg'],
  alts: ["Gato en la hamaca negra atada a las patas de un taburete", "Gatito en la hamaca azul colgada bajo un taburete", "Gato en la hamaca crema bajo un taburete", "Gato sentado en la hamaca crema, bajo el asiento", "Hamaca negra con un gato dentro, vista de frente", "Las tres hamacas extendidas, negra, azul y crema, con sus cuatro cintas", "Hamaca azul extendida, con una cinta en cada esquina", "Medidas de la hamaca para silla: 40 × 40 y 48 × 50 cm"],
  opciones: [
    { nombre: 'Tamaño', valores: ['Mediana · 40 × 40 cm', 'Grande · 48 × 50 cm'] },
    { nombre: 'Color', valores: ['Negro', 'Azul', 'Crema'] },
  ],
  variantes: [
    { vid: 'A7E28A23-9C23-4FA6-9796-C7DC9E0DB985', valores: ['Mediana · 40 × 40 cm', 'Negro'], precio: '19.90' },
    { vid: 'D4521329-A334-43F7-AE3F-B4B05F699D7E', valores: ['Mediana · 40 × 40 cm', 'Azul'], precio: '19.90' },
    { vid: 'DB1997BF-FEA0-4D02-8178-281B27F0C4DF', valores: ['Mediana · 40 × 40 cm', 'Crema'], precio: '19.90' },
    { vid: '5EC6B2A1-082A-4928-8FB8-D3D3378D5D09', valores: ['Grande · 48 × 50 cm', 'Negro'], precio: '24.90' },
    { vid: '0360E10A-BCFF-4936-9841-AF88EBFD15C1', valores: ['Grande · 48 × 50 cm', 'Azul'], precio: '24.90' },
    { vid: '40FE8856-77E3-4201-8500-2BDBBE3661A8', valores: ['Grande · 48 × 50 cm', 'Crema'], precio: '24.90' },
  ],
  html: `<p>Muchos gatos se meten debajo de la silla o del taburete para vigilar sin que los vean. Esta hamaca aprovecha ese hueco: se ata a las cuatro patas y queda colgando, como una cama en el aire.</p>
<p>Lleva una cinta en cada esquina que se enrolla en la pata. Se pone en un momento y se quita igual de rápido para lavarla.</p>
<h3>Características</h3>
<ul>
<li>Dos tamaños: 40 × 40 cm y 48 × 50 cm</li>
<li>Tela de algodón, según el proveedor</li>
<li>Cuatro cintas, una por pata</li>
<li>Tres colores: negro, azul y crema</li>
</ul>
<h3>Antes de comprar</h3>
${PLAZO}
<p><strong>Mide la separación entre las patas</strong> de tu silla o taburete: la hamaca tiene que quedar tensa entre las cuatro, así que elige la medida que más se acerque a ese hueco.</p>
<p>Es para una silla o un taburete que no se muevan. En una silla con ruedas, no.</p>
<p>El proveedor no indica un peso máximo: es para un gato, no para un perro.</p>
<p>No es la hamaca con mosquetones para jaulas: esa la tenemos aparte.</p>`,
},
{
  clave: 'jersey-navidad-4', pid: '6482CE79-FE22-48A2-B98C-AD49885345F4', porte: 4.39,
  handle: 'jersey-navideno-reno-perro',
  titulo: 'Jersey navideño de reno para perro | Punto negro con nariz de pompón',
  tipo: 'Ropa y calzado', categoria: 'gid://shopify/TaxonomyCategory/ap-2-6-17', sku: 'PTC-JERSEYRENO',
  etiquetas: ['perro', 'ropa', 'invierno', 'navidad', 'regalo', 'punto'],
  coleccionRopa: true,
  seoTitulo: 'Jersey navideño de reno para perro | Nariz de pompón',
  seoDesc: 'Jersey de punto negro con cuello alto, copos de nieve y un reno con la nariz roja de pompón. Cuatro tallas con tabla en centímetros.',
  fotos: [4, 1, 2, 3, 0], extra: ['jersey-reno-tallas.jpg'],
  alts: ["Caniche con el jersey negro de reno, junto al jersey extendido", "Detalle del reno de punto con la nariz roja de pompón", "Caniche sentado con el jersey negro de reno", "Caniche con el jersey de reno, visto de lado", "Jersey de reno por delante y por detrás", "Tabla de tallas del jersey de reno en centímetros"],
  opciones: [{ nombre: 'Talla', valores: ['S', 'M', 'L', 'XL'] }],
  variantes: [
    { vid: '319B390C-1EFF-40CA-AF0B-932886AE4696', valores: ['S'], precio: '19.90' },
    { vid: '9391F76C-4B33-4C3C-9C29-33E21F7AD7E0', valores: ['M'], precio: '19.90' },
    { vid: '1FCC610D-6CB6-42A0-9F1C-86835F74A570', valores: ['L'], precio: '19.90' },
    { vid: 'DF02A2EE-CCF4-4F9A-9257-503E72AFF54D', valores: ['XL'], precio: '19.90' },
  ],
  html: `<p>El jersey de Navidad de toda la vida, en pequeño: punto negro, cuello alto, copos de nieve y un reno con la nariz roja de pompón.</p>
<p>Es de punto acrílico: abriga en casa y en el paseo corto de invierno, y queda perfecto en la foto de Nochebuena.</p>
<h3>Características</h3>
<ul>
<li>Punto acrílico, cuello alto</li>
<li>Reno con nariz de pompón, copos de nieve y cenefas verdes y rojas</li>
<li>Cuatro tallas: pecho de 33, 38, 43 y 48 cm (tabla completa en las fotos)</li>
</ul>
<h3>Antes de comprar</h3>
${PLAZO}
${NAVIDAD}
<p><strong>Elige por el pecho</strong>, midiendo por la parte más ancha. Son medidas de la prenda tomadas a mano: pueden variar 2 o 3 cm. Si dudas entre dos tallas, la grande.</p>
<p>La talla más grande tiene 48 cm de pecho: es para perros pequeños y medianos.</p>
<p>No es impermeable. Para la lluvia, mejor un chubasquero.</p>`,
},
{
  clave: 'jersey-navidad-5', pid: '1430758654105227264', porte: 4.39,
  handle: 'jersey-navideno-papa-noel-gato-perro',
  titulo: 'Jersey navideño de Papá Noel para gato y perro pequeño | Rojo, de XS a XL',
  tipo: 'Ropa y calzado', categoria: 'gid://shopify/TaxonomyCategory/ap-2-6-17', sku: 'PTC-JERSEYNOEL',
  etiquetas: ['gato', 'perro', 'ropa', 'invierno', 'navidad', 'regalo', 'punto'],
  coleccionRopa: true,
  seoTitulo: 'Jersey navideño de Papá Noel para gato y perro pequeño',
  seoDesc: 'Jersey rojo de punto con una banda de Papás Noel. Cinco tallas, de 0,5 a 7 kg, con tabla en centímetros. Para gato o perro pequeño.',
  fotos: [2, 0, 1, 4], extra: ['jersey-papanoel-tallas.jpg'],
  alts: ["Gato blanco con el jersey rojo de Papá Noel, apoyado en un sillón", "Gato tumbado con el jersey rojo de Papá Noel", "Gato con el jersey rojo de Papá Noel, mirando a cámara", "Espalda del jersey de Papá Noel puesto en un gato", "Tabla de tallas del jersey de Papá Noel en centímetros y kilos"],
  opciones: [{ nombre: 'Talla', valores: ['XS', 'S', 'M', 'L', 'XL'] }],
  variantes: [
    { vid: '1430758654256222208', valores: ['XS'], precio: '19.90' },
    { vid: '1430758654285582336', valores: ['S'], precio: '19.90' },
    { vid: '1430758654302359552', valores: ['M'], precio: '19.90' },
    { vid: '1430758654327525376', valores: ['L'], precio: '19.90' },
    { vid: '1430758654356885504', valores: ['XL'], precio: '19.90' },
  ],
  html: `<p>Rojo, de punto y con una fila de Papás Noel sobre fondo azul. El jersey de Navidad pensado para gatos y perros pequeños, de medio kilo a siete.</p>
<p>Es de punto acrílico, con el cuello, los puños y el bajo de canalé.</p>
<h3>Características</h3>
<ul>
<li>Punto acrílico rojo con banda de Papás Noel</li>
<li>Cinco tallas por pecho y peso orientativo (tabla en las fotos)</li>
<li>Para gato o perro pequeño, de 0,5 a 7 kg</li>
</ul>
<h3>Antes de comprar</h3>
${PLAZO}
${NAVIDAD}
<p><strong>Elige por el pecho</strong>: XS 30 cm, S 35, M 40, L 45 y XL 50. El peso es orientativo, porque un gato de pelo largo o un perro ancho de pecho necesitan una talla más. Son medidas de la prenda tomadas a mano: pueden variar 2 o 3 cm.</p>
<p>Muchos gatos no aguantan la ropa. Pónselo poco rato las primeras veces y quítaselo si ves que se agobia.</p>`,
},
];

// ---------------------------------------------------------------------------

function fotosCJ(d) {
  let imgs = [];
  try { imgs = typeof d.productImage === 'string' ? JSON.parse(d.productImage) : (d.productImage || []); } catch (e) {}
  if (!imgs.length) imgs = d.productImageSet || [];
  const todas = [];
  for (const u of [...imgs, ...(d.variants || []).map((v) => v.variantImage).filter(Boolean)]) if (!todas.includes(u)) todas.push(u);
  return todas;
}

const carpeta = process.argv[2];
const escribir = process.argv.includes('--escribir');
const fallos = [];
const salida = [];
const margenes = [];

for (const f of fichas) {
  const d = JSON.parse(fs.readFileSync(path.join(carpeta, f.clave + '.json'), 'utf8'));
  if (d.pid !== f.pid) fallos.push(`${f.clave}: pid distinto (ficha ${f.pid} / CJ ${d.pid})`);
  const porVid = Object.fromEntries(d.variants.map((v) => [String(v.vid), v]));

  const vistos = new Set();
  for (const v of f.variantes) {
    if (!porVid[v.vid]) fallos.push(`${f.clave}: el vid ${v.vid} no existe en CJ`);
    v.valores.forEach((val, i) => { if (!f.opciones[i].valores.includes(val)) fallos.push(`${f.clave}: valor "${val}" no declarado`); });
    const k = v.valores.join(' / ');
    if (vistos.has(k)) fallos.push(`${f.clave}: combinación repetida "${k}"`);
    vistos.add(k);
  }
  const combos = f.opciones.reduce((n, o) => n * o.valores.length, 1);
  if (combos !== f.variantes.length) fallos.push(`${f.clave}: ${combos} combinaciones y ${f.variantes.length} variantes`);

  // Que cada variante del arnés sea de verdad su color y su talla en CJ.
  if (f.clave === 'arnes-gato') {
    const en = { 'Azul marino': 'Navy Blue', Azul: 'Blue', Naranja: 'Orange', Rosa: 'Pink', Negro: 'Black', Rojo: 'Red' };
    for (const v of f.variantes) {
      const nombre = porVid[v.vid] && (porVid[v.vid].variantNameEn || porVid[v.vid].variantKey);
      if (nombre !== `${en[v.valores[0]]}-${v.valores[1]}`) fallos.push(`arnes-gato: ${v.vid} es "${nombre}" y no ${v.valores.join('/')}`);
    }
  }

  const todas = fotosCJ(d);
  const urls = f.fotos.map((i) => todas[i]);
  if (urls.some((u) => !u)) fallos.push(`${f.clave}: foto fuera de rango`);
  const fuentes = [...urls, ...f.extra.map((x) => RAW + x)];
  if (!f.alts || f.alts.length !== fuentes.length) fallos.push(`${f.clave}: ${fuentes.length} fotos y ${f.alts ? f.alts.length : 0} textos alternativos`);
  const files = fuentes.map((u, i) => ({ originalSource: u, contentType: 'IMAGE', alt: (f.alts || [])[i] }));
  if (files.length < 3) fallos.push(`${f.clave}: solo ${files.length} fotos`);
  if (/cjdropshipping|\bCJ\b|\b\d{19}\b/i.test(f.html)) fallos.push(`${f.clave}: la descripción nombra al proveedor o un id`);
  if (f.seoDesc.length > 160) fallos.push(`${f.clave}: descripción SEO de ${f.seoDesc.length} letras`);
  if (f.seoTitulo.length > 70) fallos.push(`${f.clave}: título SEO de ${f.seoTitulo.length} letras`);

  const variants = f.variantes.map((v, i) => {
    const costeUsd = +porVid[v.vid].variantSellPrice;
    const coste = +(costeUsd * USD + f.porte).toFixed(2);
    const pvp = +v.precio;
    const solo = (pvp + (pvp < 39 ? 6.99 : 0)) / 1.21 - coste - (pvp * 0.018 + 0.25);
    const lleno = pvp / 1.21 - coste - (pvp * 0.018 + 0.25);
    margenes.push({ ficha: f.clave, variante: v.valores.join(' / '), pvp, coste, solo: +solo.toFixed(2), enPedidoGrande: +lleno.toFixed(2) });
    if (solo < 8) fallos.push(`${f.clave} ${v.valores.join('/')}: margen suelto ${solo.toFixed(2)} €`);
    return {
      sku: `${f.sku}-${String(i + 1).padStart(2, '0')}`,
      price: v.precio,
      inventoryPolicy: 'CONTINUE',
      inventoryItem: { tracked: false, cost: coste.toFixed(2), countryCodeOfOrigin: 'CN', requiresShipping: true },
      optionValues: v.valores.map((val, j) => ({ optionName: f.opciones[j].nombre, name: val })),
    };
  });

  const input = {
    title: f.titulo, handle: f.handle, descriptionHtml: f.html.trim(), vendor: 'Patitascalidas',
    productType: f.tipo, category: f.categoria, tags: f.etiquetas, status: 'ACTIVE',
    seo: { title: f.seoTitulo, description: f.seoDesc },
    files,
    productOptions: f.opciones.map((o, i) => ({ name: o.nombre, position: i + 1, values: o.valores.map((v) => ({ name: v })) })),
    variants,
  };
  if (f.coleccionRopa) input.collections = [COL_ROPA];
  salida.push({ clave: f.clave, input, mapa: f.variantes.map((v, i) => [variants[i].sku, v.vid]) });
}

console.table(margenes);
if (escribir) {
  const dir = path.join(carpeta, 'vars');
  fs.mkdirSync(dir, { recursive: true });
  for (const s of salida) fs.writeFileSync(path.join(dir, s.clave + '.json'), JSON.stringify({ input: s.input }, null, 1));
  fs.writeFileSync(path.join(dir, '_mapa.json'), JSON.stringify(Object.fromEntries(salida.map((s) => [s.clave, s.mapa])), null, 1));
}
console.log(`fichas ${salida.length} · variantes ${salida.reduce((n, s) => n + s.input.variants.length, 0)} · fotos ${salida.reduce((n, s) => n + s.input.files.length, 0)}`);
if (fallos.length) { console.log('\nFALLOS:\n  - ' + fallos.join('\n  - ')); process.exit(1); }
console.log('Todo cuadra: vids reales, combinaciones completas, fotos elegidas y margen suelto de 8 € o más.');
