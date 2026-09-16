// Construye las variables de productSet para cada ficha de la tanda 3
// y comprueba ANTES de enviarlas que todo cuadra. Regla de Pablo: probar
// primero, subir despues.
const fs = require('fs');
const path = require('path');
const { COL, fichas } = require('./tanda3-datos');

const CJ = require('/tmp/claude-0/-home-user-libre/917f3732-f020-5fa4-b126-7adc8cf2b4f6/scratchpad/fichas3.json');
const SALIDA = '/tmp/claude-0/-home-user-libre/917f3732-f020-5fa4-b126-7adc8cf2b4f6/scratchpad/tanda3-vars';

const porClave = {};
for (const k of Object.keys(CJ)) porClave[k] = CJ[k];

function imagenes(clave) {
  const a = porClave[clave];
  let imgs = [];
  try { imgs = typeof a.productImage === 'string' ? JSON.parse(a.productImage) : (a.productImage || []); } catch (e) {}
  if (!imgs.length && a.productImageSet) imgs = a.productImageSet;
  return imgs.filter(u => /^https:\/\//.test(u)).slice(0, 10);
}

const fallos = [];
const todo = [];

for (const f of fichas) {
  const cj = porClave[f.clave];
  if (!cj) { fallos.push(`${f.clave}: no esta en fichas3.json`); continue; }
  if (cj.pid !== f.pid) fallos.push(`${f.clave}: pid distinto (ficha ${f.pid} / CJ ${cj.pid})`);

  const vidsCJ = new Set(cj.variants.map(v => String(v.vid)));
  const nombresOpcion = f.opciones.map(o => o.nombre);
  const vistos = new Set();

  for (const v of f.variantes) {
    if (!vidsCJ.has(String(v.vid))) fallos.push(`${f.clave}: vid ${v.vid} no existe en CJ`);
    if (v.valores.length !== f.opciones.length) fallos.push(`${f.clave}/${v.vid}: ${v.valores.length} valores para ${f.opciones.length} opciones`);
    v.valores.forEach((val, i) => {
      if (!f.opciones[i].valores.includes(val)) fallos.push(`${f.clave}/${v.vid}: valor "${val}" no declarado en la opcion "${nombresOpcion[i]}"`);
    });
    const clave = v.valores.join(' / ');
    if (vistos.has(clave)) fallos.push(`${f.clave}: combinacion duplicada "${clave}"`);
    vistos.add(clave);
  }

  // Shopify exige que exista una variante por cada combinacion declarada.
  const combos = f.opciones.reduce((acc, o) => acc.flatMap(p => o.valores.map(val => [...p, val])), [[]]);
  if (combos.length !== f.variantes.length) {
    fallos.push(`${f.clave}: ${f.opciones.length} opciones dan ${combos.length} combinaciones pero hay ${f.variantes.length} variantes`);
  }

  const imgs = imagenes(f.clave);
  if (imgs.length < 3) fallos.push(`${f.clave}: solo ${imgs.length} fotos`);
  if (/CJ|cjdropshipping|\b\d{19}\b/i.test(f.html)) fallos.push(`${f.clave}: la descripcion menciona al proveedor o un id interno`);

  const skus = f.variantes.map((v, i) => `${f.sku}-${String(i + 1).padStart(2, '0')}`);

  const input = {
    title: f.titulo,
    descriptionHtml: f.html.trim(),
    vendor: 'Patitascalidas',
    productType: f.tipo,
    tags: f.etiquetas,
    status: 'ACTIVE',
    seo: { title: f.seoTitulo, description: f.seoDesc },
    collections: f.colecciones.map(c => {
      if (!COL[c]) fallos.push(`${f.clave}: coleccion desconocida "${c}"`);
      return COL[c];
    }),
    metafields: [
      { namespace: 'global', key: 'title_tag',       value: f.seoTitulo, type: 'single_line_text_field' },
      { namespace: 'global', key: 'description_tag', value: f.seoDesc,   type: 'single_line_text_field' },
    ],
    files: imgs.map((u, i) => ({ originalSource: u, contentType: 'IMAGE', alt: `${f.titulo.split('|')[0].trim()} — foto ${i + 1}` })),
    productOptions: f.opciones.map((o, i) => ({ name: o.nombre, position: i + 1, values: o.valores.map(v => ({ name: v })) })),
    variants: f.variantes.map((v, i) => ({
      sku: skus[i],
      price: v.precio,
      inventoryPolicy: 'CONTINUE',
      inventoryItem: { tracked: false, countryCodeOfOrigin: 'CN', requiresShipping: true },
      optionValues: v.valores.map((val, j) => ({ optionName: f.opciones[j].nombre, name: val })),
    })),
  };

  todo.push({ clave: f.clave, pid: f.pid, titulo: f.titulo, input, mapa: f.variantes.map((v, i) => [skus[i], v.vid]) });
}

if (process.argv[2] === '--escribir') {
  fs.mkdirSync(SALIDA, { recursive: true });
  for (const t of todo) fs.writeFileSync(path.join(SALIDA, `${t.clave}.json`), JSON.stringify({ input: t.input }, null, 1));
  fs.writeFileSync(path.join(SALIDA, '_mapa.json'), JSON.stringify(Object.fromEntries(todo.map(t => [t.clave, t.mapa])), null, 1));
  fs.writeFileSync(path.join(SALIDA, '_indice.json'), JSON.stringify(todo.map(t => ({ clave: t.clave, pid: t.pid, titulo: t.titulo, variantes: t.input.variants.length, fotos: t.input.files.length })), null, 1));
}

console.log(`fichas: ${todo.length}   variantes: ${todo.reduce((n, t) => n + t.input.variants.length, 0)}   fotos: ${todo.reduce((n, t) => n + t.input.files.length, 0)}`);
if (fallos.length) { console.log('\nFALLOS (' + fallos.length + '):'); fallos.forEach(x => console.log('  - ' + x)); process.exit(1); }
console.log('\nTodo cuadra: vids reales, combinaciones completas, fotos y colecciones correctas.');
