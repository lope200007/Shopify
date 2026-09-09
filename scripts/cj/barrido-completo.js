/**
 * Barrido de TODAS las categorias que pueden viajar planas, para dejar una
 * cola de candidatos lista. No mide portes: eso se hace producto a producto
 * justo antes de subir, y es el filtro que decide.
 *
 * Lo que sí hace aqui es descartar de entrada lo que ya sabemos que no vale:
 * bulto, producto regulado, aversivo, y lo que es de gato/pajaro/roedor.
 */
const fs = require('fs');
const cj = require('./cj');

const ZONAS = [
  ['Correas',        '2410110352471611400', 'correa perro',        3600],
  ['Arneses',        '2410110352591600400', 'arnes para perros',   4400],
  ['Collares',       '2410110352331629800', 'collares para perros',3600],
  ['Chapas',         '2410110354301620700', 'collar perro',        4400],
  ['Bozales',        '2410110353131601000', 'bozal perro',          880],
  ['Panuelos',       '2410110350591620800', 'panuelo perro',        390],
  ['Juegos',         '2410110340411608400', 'juguetes para perros',1900],
  ['Mordedores',     '2410110339451623300', 'juguete mordedor',     880],
  ['Educativos',     '2410110340031614900', 'juguetes interactivos',720],
  ['Perseguir',      '2410110339311602900', 'pelota perro',         720],
  ['Sonoros',        '2410110340161623400', 'juguetes para perros',1900],
  ['Comederos',      '2410110341061612000', 'comedero perro',      1900],
  ['Bebederos',      '2410110341331606800', 'bebedero para perros',1900],
  ['Alimentacion',   '2410110341451628800', 'comedero perro',      1900],
  ['Cepillos',       '2410110354491625800', 'cepillo para perros',  880],
  ['Bano',           '2410110355151622300', 'champu perro',         590],
  ['Toallas',        '2410110355321622400', 'toalla perro',         320],
  ['Cinturones',     '2410110343091603200', 'cinturon perro coche', 590],
  ['Alfombrillas',   '2410110343211625200', 'funda coche perro',   1000],
  ['Bolsas',         '2410110342571606700', 'bolsa transporte perro',720],
  ['Abrigos',        '2410110349061619800', 'abrigo para perros',   880],
  ['Impermeables',   '2410110350021615300', 'chubasquero perro',    590],
  ['Jerseis',        '2410110348401611500', 'ropa para perros',    1300],
];

// Lo que no se sube nunca, aprendido a golpes
const VETO = /antiparasit|flea|tick|seresto|scalibor|shock|bark control|anti-?bark|electric.*(collar|train)|pheromone|calming collar|\bcat only\b|kitten|parrot|bird|reptile|hamster|guinea pig|rabbit/i;
const SOLO_GATO = /^cat |cat toy|cat collar|cat bed|cat scratch|cat litter/i;

(async () => {
  const out = [];
  for (const [zona, id, termino, volumen] of ZONAS) {
    let n = 0;
    for (let p = 1; p <= 3; p++) {
      let r;
      try { r = await cj.buscar({ categoryId: id, pageNum: p, pageSize: 50 }); }
      catch (e) { console.error(zona, 'error', e.message); break; }
      const lista = r.list || [];
      for (const x of lista) {
        const nombre = x.productNameEn || '';
        if (VETO.test(nombre) || SOLO_GATO.test(nombre)) continue;
        const usd = parseFloat(String(x.sellPrice).split('--')[0]) || 0;
        const pesos = String(x.packWeight || x.productWeight || '').match(/\d+(\.\d+)?/g) || [];
        const g = pesos.length ? Math.min(...pesos.map(Number)) : 99999;
        if (usd < 0.8 || usd > 16 || g > 600) continue;   // plano, ligero y con recorrido de precio
        out.push({ zona, termino, volumen, pid: x.pid, nombre, usd, g });
        n++;
      }
      if (lista.length < 50) break;
    }
    console.error(`${zona.padEnd(14)} ${String(n).padStart(3)} candidatos  (${termino}, ${volumen}/mes)`);
  }
  // se ordena por lo que mas se busca, y dentro de eso por precio
  out.sort((a, b) => b.volumen - a.volumen || a.usd - b.usd);
  fs.writeFileSync('research/cola-candidatos.json', JSON.stringify(out, null, 1));
  console.error('\ntotal', out.length, 'candidatos en', ZONAS.length, 'categorias');
})();
