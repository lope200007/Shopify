// Tanda del 30 de septiembre de 2026 (2.ª vuelta): lo que más se vende a la vez
// en Amazon DE, IT y ES y en Kiwoko, y que el proveedor tiene.
//
// Pedido de Pablo: «un análisis mucho más profundo, en los sitios más famosos;
// si lo tenemos en el proveedor, súbelo. Si una foto está mal, organízala y
// corrígela, sin que parezca hecha con IA». Cifras en research/tanda-2026-09-30b.md.
//
//   node scripts/tienda/tanda3009b.js <carpeta-cj>             # comprueba
//   node scripts/tienda/tanda3009b.js <carpeta-cj> --escribir  # y deja las variables
//
// En `fotos`, un número es la posición en la lista de fotos de CJ y un texto es
// una foto retocada (sin rótulos en inglés) servida desde assets/tienda/2026-09/.
const fs = require('fs');
const path = require('path');

const RAW = 'https://raw.githubusercontent.com/lope200007/Shopify/main/assets/tienda/2026-09/';
const COL_ROPA = 'gid://shopify/Collection/698287325532';
const USD = 0.92;

const PLAZO = '<p>Llega a España en dos o tres semanas: de 1 a 3 días laborables de preparación y luego el transporte, siempre con número de seguimiento.</p>';

const fichas = [
{
  clave: 'rodillo-b', pid: '1777181071063396352', porte: 4.60,
  handle: 'rodillo-quitapelos-sofa-ropa',
  titulo: 'Rodillo quitapelos reutilizable | Sofá, cama y ropa, sin recambios',
  tipo: 'Higiene y cuidado', categoria: 'gid://shopify/TaxonomyCategory/ap-2-26-1-1', sku: 'PTC-RODILLO',
  etiquetas: ['c-higiene', 'gato', 'perro', 'higiene', 'muda', 'pelo', 'hogar', 'mascotas'],
  seoTitulo: 'Rodillo quitapelos reutilizable para sofá y ropa',
  seoDesc: 'Lo pasas adelante y atrás por el sofá, la cama o el abrigo y el pelo del perro o del gato se queda en el depósito. Sin adhesivo ni recambios. 19,5 × 21 cm.',
  fotos: ['rodillo-quitapelos-principal.jpg', 'rodillo-quitapelos-ropa.jpg', 'rodillo-quitapelos-lavable.jpg', 7], extra: [],
  alts: ['Rodillo quitapelos blanco y gris con el depósito transparente', 'Pasando el rodillo quitapelos por una chaqueta de punto, con sus medidas: 19,5 × 21 × 5,5 cm', 'Rodillo quitapelos bajo el grifo: se lava con agua', 'Medidas del rodillo quitapelos: 19,5 cm de ancho, 21 cm de alto y 5,5 cm de fondo'],
  opciones: [{ nombre: 'Cantidad', valores: ['1 rodillo', '2 rodillos'] }],
  variantes: [
    { vid: '1777181071218585600', valores: ['1 rodillo'], precio: '12.90', porte: 4.60 },
    { vid: '2408060214251629700', valores: ['2 rodillos'], precio: '19.90', porte: 5.75 },
  ],
  html: `<p>El pelo del perro o del gato se queda pegado en el sofá, en la colcha y en el abrigo, y los rodillos de papel adhesivo se gastan en dos días. Este no tiene papel: lo pasas adelante y atrás y el pelo se queda dentro, en un depósito.</p>
<p>Cuando se llena, aprietas el botón, abres la tapa y lo vacías en la basura. Se lava con agua.</p>
<h3>Características</h3>
<ul>
<li>Sin adhesivo ni recambios: se vacía y se vuelve a usar</li>
<li>Depósito con tapa que se abre con un botón</li>
<li>Para sofá, cama, cojines, alfombra y ropa</li>
<li>19,5 cm de ancho, 21 cm de alto y 5,5 cm de fondo</li>
<li>Uno o dos rodillos, en blanco y gris con detalles naranjas</li>
</ul>
<h3>Antes de comprar</h3>
${PLAZO}
<p>Se usa pasándolo adelante y atrás, como indica el fabricante. Es para tela: sofás, mantas, cojines y ropa.</p>`,
},
{
  clave: 'correa-flota', pid: '2604100723451624700', porte: 4.99,
  handle: 'correa-larga-flotante-perro',
  titulo: 'Correa larga flotante para perro | 6 o 10 metros, para agua y adiestramiento',
  tipo: 'Paseo', categoria: 'gid://shopify/TaxonomyCategory/ap-2-31', sku: 'PTC-CORREAFLOTA',
  etiquetas: ['c-paseo', 'correa', 'mascotas', 'paseo', 'perro', 'playa'],
  seoTitulo: 'Correa larga flotante para perro | 6 o 10 metros',
  seoDesc: 'Correa larga que flota, para que tu perro nade en la playa o el río sin soltarlo, y para enseñarle a volver a la llamada. Naranja, 6 o 10 metros.',
  fotos: [0, 'correa-flotante-agua.jpg', 'correa-flotante-playa.jpg', 3, 2], extra: [],
  alts: ['Perro nadando en un lago con la correa larga naranja flotando detrás', 'Labrador en el agua con una pelota y la correa naranja enganchada al collar', 'Corgi en la playa y carlino en el agua, los dos con la correa larga naranja', 'Correa larga naranja enrollada, con asa acolchada negra y mosquetón', 'La correa en sus dos largos, 6 y 10 metros'],
  opciones: [{ nombre: 'Largo', valores: ['6 metros', '10 metros'] }],
  variantes: [
    { vid: '2604100723451625400', valores: ['6 metros'], precio: '16.90', porte: 4.99 },
    { vid: '2604100723451625800', valores: ['10 metros'], precio: '19.90', porte: 5.35 },
  ],
  html: `<p>Para dejar que el perro se meta en el agua o corra por la playa sin soltarlo. La correa flota: si la sueltas en el agua no se hunde y la recuperas sin problema.</p>
<p>Sirve también para enseñarle a venir a la llamada en el campo: le das libertad y, si no vuelve, la tienes a mano.</p>
<h3>Características</h3>
<ul>
<li>Flota en el agua, según el fabricante</li>
<li>Dos largos: 6 y 10 metros</li>
<li>Asa acolchada y mosquetón</li>
<li>Color naranja, fácil de ver en el agua y en la hierba</li>
</ul>
<h3>Antes de comprar</h3>
${PLAZO}
<p>Engánchala al arnés, no al collar: con una correa larga, un tirón a la carrera se lo lleva el cuello.</p>
<p>No es un chaleco salvavidas. Si tu perro nada poco o el agua es profunda, que lleve chaleco.</p>
<p>No es para la ciudad: una correa larga en la acera se enreda y hace tropezar.</p>`,
},
{
  clave: 'luz-colgante', pid: '1812065905397354496', porte: 3.31,
  handle: 'luz-led-colgante-collar-perro',
  titulo: 'Luz LED para el collar del perro | Recargable, para los paseos de noche',
  tipo: 'Paseo', categoria: 'gid://shopify/TaxonomyCategory/ap-2-10-2', sku: 'PTC-LUZCOLLAR',
  etiquetas: ['c-paseo', 'mascotas', 'noche', 'paseo', 'perro', 'luz'],
  seoTitulo: 'Luz LED recargable para el collar del perro',
  seoDesc: 'Una luz que se cuelga del collar, el arnés o la correa para que tu perro se vea de lejos en los paseos de noche. Recargable por USB. 8 × 3 cm y 32 g.',
  fotos: [0, 1, 3, 8, 6, 7], extra: [],
  alts: ['Perro de noche con la luz naranja encendida en el collar, junto a luces de varios colores', 'Dos luces LED naranjas con su tira para colgar', 'Luz LED abierta cargándose con el cable USB', 'Luz LED para collar en naranja', 'Luz LED para collar en rojo', 'Luz LED para collar en azul'],
  opciones: [{ nombre: 'Color', valores: ['Naranja', 'Rojo', 'Azul'] }],
  variantes: [
    { vid: '1812065905418326016', valores: ['Naranja'], precio: '12.90' },
    { vid: '1812065905418326017', valores: ['Rojo'], precio: '12.90' },
    { vid: '1812065905418326018', valores: ['Azul'], precio: '12.90' },
  ],
  html: `<p>En otoño e invierno el paseo de la tarde ya es de noche. Esta luz se cuelga del collar, del arnés o de la correa, y hace que tu perro se vea de lejos: los coches, las bicis y tú.</p>
<p>Se sujeta con su tira de silicona y se quita en un momento. Se recarga por USB: se abre la tapa y se enchufa.</p>
<h3>Características</h3>
<ul>
<li>Recargable por USB, como se ve en las fotos</li>
<li>8 × 3 × 1,3 cm y 32 g</li>
<li>Tira con agujero para colgarla del collar, el arnés o la correa</li>
<li>Tres colores: naranja, rojo y azul</li>
</ul>
<h3>Antes de comprar</h3>
${PLAZO}
<p>El proveedor no dice cuánto dura la carga, ni si aguanta la lluvia, ni si trae el cable, así que no te lo prometemos. Si llueve mucho, mejor no mojarla a propósito.</p>
<p>En la primera foto se ven luces de más colores: se venden en naranja, rojo y azul.</p>`,
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
  const urls = f.fotos.map((i) => (typeof i === 'string' ? RAW + i : todas[i])); // número = foto de CJ; texto = foto retocada en assets/
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
