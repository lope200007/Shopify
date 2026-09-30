// Tanda del 30 de septiembre de 2026: éxitos de Amazon.es que el proveedor tiene.
//
// Pedido de Pablo: «si son productos ganadores y los tenemos en el proveedor,
// quiero que los subas; las imágenes las retoco yo, tú quita el texto en inglés».
// Selección y cifras en research/amazon-a-cj-2026-09-30.md.
//
//   node scripts/tienda/tanda3009.js <carpeta-cj>             # comprueba
//   node scripts/tienda/tanda3009.js <carpeta-cj> --escribir  # y deja las variables
//
// Porte por variante cuando cambia con la talla (rascador). Fotos elegidas a mano
// por su posición en la lista de CJ; las retocadas (sin texto) van desde assets/.
const fs = require('fs');
const path = require('path');

const RAW = 'https://raw.githubusercontent.com/lope200007/Shopify/main/assets/tienda/2026-09/';
const COL_ROPA = 'gid://shopify/Collection/698287325532';
const USD = 0.92;

const PLAZO = '<p>Llega a España en dos o tres semanas: de 1 a 3 días laborables de preparación y luego el transporte, siempre con número de seguimiento.</p>';

const fichas = [
{
  clave: 'cepillo-vapor', pid: '2505120724181601200', porte: 6.02,
  handle: 'cepillo-vapor-gato-perro',
  titulo: 'Cepillo con vaporizador para gato y perro | Quita el pelo suelto sin que vuele',
  tipo: 'Higiene y cuidado', categoria: 'gid://shopify/TaxonomyCategory/ap-2-26-1-1', sku: 'PTC-CEPVAPOR',
  etiquetas: ['c-higiene', 'cepillo', 'gato', 'perro', 'higiene', 'muda', 'pelo', 'mascotas'],
  seoTitulo: 'Cepillo con vaporizador para gato y perro | Pelo suelto',
  seoDesc: 'Cepillo de púas con depósito de agua que suelta una bruma fina mientras cepillas: el pelo muerto se queda en el cepillo y no vuela por casa. Tres colores.',
  fotos: [1, 0, 2, 3, 7, 8, 9], extra: ['cepillo-vapor-perro.jpg', 'cepillo-vapor-gato-rosa.jpg'],
  alts: ['Cepillo con vaporizador verde menta echando bruma, junto a un perro y un gatito', 'Cepillo blanco en la mano con la bruma saliendo entre las púas', 'Gato de pelo largo mientras le pasan el cepillo con bruma', 'Golden retriever cepillado con el cepillo de vapor', 'Cepillo con vaporizador en blanco', 'Cepillo con vaporizador en verde menta', 'Cepillo con vaporizador en rosa', 'Golden retriever con el cepillo verde echando bruma sobre el pecho', 'Gato mirando el cepillo rosa visto de lado'],
  opciones: [{ nombre: 'Color', valores: ['Blanco', 'Verde menta', 'Rosa'] }],
  variantes: [
    { vid: '2505120724181602000', valores: ['Blanco'], precio: '14.90' },
    { vid: '2505120724181602300', valores: ['Verde menta'], precio: '14.90' },
    { vid: '2505120724181602700', valores: ['Rosa'], precio: '14.90' },
  ],
  html: `<p>En época de muda, cepillar es llenar la casa de pelo. Este cepillo echa una bruma fina de agua mientras lo pasas: el pelo muerto se humedece, se queda enganchado en las púas y no sale volando.</p>
<p>Se rellena con agua y las púas son finas. El pelo que recoge se empuja fuera del cabezal de una vez, como se ve en las fotos.</p>
<h3>Características</h3>
<ul>
<li>Cabezal de púas finas con salida de bruma en el centro</li>
<li>Se rellena con agua</li>
<li>Toma de carga USB-C en el mango, a la vista en las fotos</li>
<li>Para gato y perro, de pelo corto o largo</li>
<li>Tres colores: blanco, verde menta y rosa</li>
</ul>
<h3>Antes de comprar</h3>
${PLAZO}
<p>Se llena solo con agua. En algunas fotos se ven frascos de esencia: no van incluidos. El proveedor solo pone el cepillo en la lista del paquete, así que tampoco te prometemos el cable de carga.</p>
<p>No es un secador ni echa vapor caliente: es agua pulverizada, a temperatura ambiente.</p>
<p>Si a tu gato le asusta el ruido o el agua, empieza sin bruma y actívala cuando se acostumbre al cepillo.</p>`,
},
{
  clave: 'rascador-adhesivo', pid: '1779106327466356736', porte: 4.23,
  handle: 'rascador-adhesivo-gato',
  titulo: 'Rascador adhesivo para gato | Se pega en la pared o el sofá, cuatro medidas',
  tipo: 'Rascadores', categoria: 'gid://shopify/TaxonomyCategory/ap-2-2-2-3', sku: 'PTC-RASCADH',
  etiquetas: ['c-rascadores', 'gato', 'hogar', 'rascador', 'sofá', 'mascotas'],
  seoTitulo: 'Rascador adhesivo para gato | Pared, sofá o esquina',
  seoDesc: 'Lámina de moqueta rascadora que se pega donde tu gato ya araña: pared, esquina del sofá o puerta. De 30 × 60 a 60 × 100 cm, en tres colores.',
  fotos: [4, 5, 7], extra: ['rascador-adhesivo-crema.jpg'],
  alts: ['Gato blanco y negro arañando el rascador adhesivo gris oscuro pegado en la pared', 'Textura del rascador en gris oscuro', 'Textura del rascador en gris claro', 'Textura del rascador en crema'],
  opciones: [
    { nombre: 'Medida', valores: ['30 × 60 cm', '30 × 100 cm', '40 × 100 cm', '60 × 100 cm'] },
    { nombre: 'Color', valores: ['Gris oscuro', 'Gris claro', 'Crema'] },
  ],
  variantes: [
    { vid: '1779106327768346624', valores: ['30 × 60 cm', 'Gris oscuro'], precio: '12.90', porte: 4.23 },
    { vid: '1779106327910952960', valores: ['30 × 60 cm', 'Gris claro'], precio: '12.90', porte: 4.23 },
    { vid: '1779106327839649792', valores: ['30 × 60 cm', 'Crema'], precio: '12.90', porte: 4.23 },
    { vid: '1779106327978061824', valores: ['30 × 100 cm', 'Gris oscuro'], precio: '14.90', porte: 4.68 },
    { vid: '1779106328129056768', valores: ['30 × 100 cm', 'Gris claro'], precio: '14.90', porte: 4.68 },
    { vid: '1779106328049364992', valores: ['30 × 100 cm', 'Crema'], precio: '14.90', porte: 4.68 },
    { vid: '2406220537521618800', valores: ['40 × 100 cm', 'Gris oscuro'], precio: '19.90', porte: 6.10 },
    { vid: '2406220537521619100', valores: ['40 × 100 cm', 'Gris claro'], precio: '19.90', porte: 6.10 },
    { vid: '2406220537521618600', valores: ['40 × 100 cm', 'Crema'], precio: '19.90', porte: 6.10 },
    { vid: '2406220537521619900', valores: ['60 × 100 cm', 'Gris oscuro'], precio: '24.90', porte: 6.84 },
    { vid: '2406220537531610100', valores: ['60 × 100 cm', 'Gris claro'], precio: '24.90', porte: 6.84 },
    { vid: '2406220537521619700', valores: ['60 × 100 cm', 'Crema'], precio: '24.90', porte: 6.84 },
  ],
  html: `<p>Si tu gato ya ha elegido la esquina del sofá o el trozo de pared del pasillo, no hace falta pelearse: pega esto justo ahí. Rasca en la lámina y deja en paz el mueble.</p>
<p>Es una moqueta de fibra rugosa con adhesivo por detrás. Según el fabricante se pega en pared, lateral del sofá, puerta, cristal o azulejo.</p>
<h3>Características</h3>
<ul>
<li>Cuatro medidas: 30 × 60, 30 × 100, 40 × 100 y 60 × 100 cm</li>
<li>Tres colores: gris oscuro, gris claro y crema</li>
<li>Fibra de polipropileno, según el proveedor</li>
<li>Adhesivo por detrás: se pega sin tornillos</li>
</ul>
<h3>Antes de comprar</h3>
${PLAZO}
<p>Es una sola lámina de la medida que elijas. En la primera foto se ven varias: son para enseñar el tamaño.</p>
<p><strong>Prueba el adhesivo en un trozo que no se vea</strong> antes de pegarlo en papel pintado, pintura delicada o tapicería fina: al despegarlo puede llevarse algo.</p>
<p>Es fibra: con el uso se desgasta y suelta algo de pelusa, como cualquier rascador.</p>`,
},
{
  clave: 'yoyo-gato', pid: '2510220931141600800', porte: 4.86,
  handle: 'juguete-colgante-electrico-gato',
  titulo: 'Juguete colgante eléctrico para gato | Sube y baja solo desde el marco de la puerta',
  tipo: 'Juguetes', categoria: 'gid://shopify/TaxonomyCategory/ap-2-2-5', sku: 'PTC-YOYO',
  etiquetas: ['c-juguetes', 'electrico', 'gato', 'juguete', 'mascotas', 'plumas'],
  seoTitulo: 'Juguete colgante eléctrico para gato | Sube y baja solo',
  seoDesc: 'Se pega en el marco de la puerta y sube y baja una oruga con plumas al azar para que tu gato salte y cace. Batería recargable por USB-C.',
  fotos: [0, 4, 5, 6, 7], extra: [],
  alts: ['Juguete colgante rosa con la oruga de colores y tres gatos saltando hacia ella', 'Dos juguetes colgantes, rosa y azul, en el marco de una puerta con dos gatos saltando', 'Juguete colgante en azul', 'Juguete colgante en rosa', 'Juguete colgante rosa con una oruga de recambio'],
  opciones: [{ nombre: 'Modelo', valores: ['Azul', 'Rosa', 'Rosa con oruga de recambio'] }],
  variantes: [
    { vid: '2510220931141601000', valores: ['Azul'], precio: '19.90', porte: 4.86 },
    { vid: '2510220931141601200', valores: ['Rosa'], precio: '19.90', porte: 4.86 },
    { vid: '2606190059271610600', valores: ['Rosa con oruga de recambio'], precio: '21.90', porte: 4.92 },
  ],
  html: `<p>Para el gato que se aburre solo en casa. Lo pegas en lo alto del marco de una puerta y, al encenderlo, el motor sube y baja una oruga con plumas y cascabel sin orden fijo. El gato salta, la atrapa y el juguete la vuelve a subir.</p>
<p>Va con una cuerda elástica que aguanta los tirones y se sujeta con cinta adhesiva de doble cara, sin agujeros.</p>
<h3>Características</h3>
<ul>
<li>Motor que sube y baja la cuerda de forma irregular</li>
<li>Batería de litio recargable de 300 mAh, con toma USB-C, piloto de carga e interruptor (según las fotos del fabricante)</li>
<li>Cuerda elástica de unos 1,8 m, con oruga de colores, cascabel y plumas</li>
<li>Incluye cinta de doble cara, cable de carga e instrucciones</li>
<li>Tres versiones: azul, rosa, y rosa con una oruga de recambio</li>
</ul>
<h3>Antes de comprar</h3>
${PLAZO}
<p>Las fotos son imágenes del fabricante hechas por ordenador, no fotos de estudio.</p>
<p>La cinta de doble cara puede dejar marca en pintura delicada o madera barnizada. Pégalo en una superficie lisa y limpia.</p>
<p>No lo dejes funcionando con el gato solo: los hilos y las plumas se pueden tragar si los arranca.</p>`,
},
{
  clave: 'mochila-burbuja', pid: '2505270729331601100', porte: 17.07,
  handle: 'mochila-burbuja-gato',
  titulo: 'Mochila burbuja para gato | Ventana transparente, hasta 6,5 kg, cinco colores',
  tipo: 'Casa, coche y paseo', categoria: 'gid://shopify/TaxonomyCategory/ap-2-16-2', sku: 'PTC-MOCHBURB',
  etiquetas: ['c-viaje', 'gato', 'mochila', 'perro', 'perro pequeño', 'transportin', 'viaje'],
  seoTitulo: 'Mochila burbuja para gato | Ventana transparente, 6,5 kg',
  seoDesc: 'Mochila transportín con cúpula transparente para que tu gato vea la calle. Para animales de hasta 6,5 kg, con agujeros de ventilación y cinco colores.',
  fotos: [0, 1, 2, 4, 5, 6, 7], extra: ['mochila-burbuja-azul.jpg'],
  alts: ['Chica de espaldas con la mochila burbuja verde y un gato mirando por la ventana', 'Gato saliendo por el lateral abierto de la mochila burbuja verde', 'Gato atigrado asomándose a la mochila verde sobre un banco', 'Mochila burbuja en negro', 'Mochila burbuja en gris', 'Mochila burbuja en verde', 'Mochila burbuja en caqui', 'Mochila burbuja en azul'],
  opciones: [{ nombre: 'Color', valores: ['Negro', 'Gris', 'Verde', 'Caqui', 'Azul'] }],
  variantes: [
    { vid: '2505270729331601500', valores: ['Negro'], precio: '42.90' },
    { vid: '2505270729331601700', valores: ['Gris'], precio: '42.90' },
    { vid: '2505270729331602000', valores: ['Verde'], precio: '42.90' },
    { vid: '2505270729331602100', valores: ['Caqui'], precio: '42.90' },
    { vid: '2505270729331602300', valores: ['Azul'], precio: '42.90' },
  ],
  html: `<p>Para llevar al gato al veterinario, de viaje o de paseo sin que vaya encerrado a oscuras. La cúpula transparente le deja ver la calle, y muchos gatos van más tranquilos viendo lo que pasa.</p>
<p>Es una mochila de tela resistente con la ventana de plástico transparente delante, agujeros de ventilación en los laterales y un bolsillo delantero.</p>
<h3>Características</h3>
<ul>
<li>Para gatos o perros pequeños de hasta 6,5 kg, según el proveedor</li>
<li>Tela 600D y ventana de policarbonato transparente</li>
<li>Agujeros de ventilación y un lateral de malla que se abre (se ve en las fotos)</li>
<li>Bolsillo delantero y asa de mano</li>
<li>Cinco colores: negro, gris, verde, caqui y azul</li>
</ul>
<h3>Antes de comprar</h3>
${PLAZO}
<p><strong>Pesa a tu gato antes</strong>: si pasa de 6,5 kg o es muy largo, irá justo. El proveedor da el peso máximo pero no las medidas de dentro.</p>
<p>No la dejes al sol con el gato dentro: la ventana de plástico hace efecto invernadero y el interior se calienta rápido.</p>
<p>No sirve para cabina de avión: cada aerolínea tiene sus medidas y esta mochila no está homologada.</p>
<p>La foto del color azul lleva un pequeño retoque en la parte de abajo para quitar una marca del fabricante.</p>`,
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
    const coste = +(costeUsd * USD + (v.porte || f.porte)).toFixed(2);
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
