/**
 * Valida un archivo de seccion .liquid de Shopify antes de subirlo al tema.
 *
 * Comprueba las reglas que rompen el editor de temas en silencio: schema que
 * no es JSON valido, falta de presets (la seccion se vuelve invisible),
 * bloques sin shopify_attributes, settings declarados que nadie usa, y los
 * limites de la plataforma.
 *
 * Ejecutar:  npm run validate:section -- ruta/a/seccion.liquid
 */
import fs from 'fs';

const VALID_TAGS = ['article', 'aside', 'div', 'footer', 'header', 'section'];
const MAX_BLOCKS = 50;

interface Setting {
  type?: string;
  id?: string;
  min?: unknown;
  max?: unknown;
  step?: unknown;
  default?: unknown;
  options?: unknown;
}

interface Schema {
  name?: string;
  tag?: string;
  limit?: number;
  max_blocks?: number;
  settings?: Setting[];
  blocks?: Array<{ type?: string; name?: string; settings?: Setting[] }>;
  presets?: unknown;
  enabled_on?: unknown;
  disabled_on?: unknown;
}

let passed = 0;
const failures: string[] = [];

function check(name: string, ok: boolean, detail = ''): void {
  if (ok) {
    passed++;
    console.log(`  ok   ${name}`);
  } else {
    failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
    console.log(`  FALLO ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

function main(): void {
  const file = process.argv[2];
  if (!file) {
    console.error('Uso: npm run validate:section -- ruta/a/seccion.liquid');
    process.exit(1);
  }
  if (!fs.existsSync(file)) {
    console.error(`No existe el archivo: ${file}`);
    process.exit(1);
  }

  const content = fs.readFileSync(file, 'utf8');
  console.log(`\nValidando ${file}\n`);

  const schemaTags = content.match(/\{%-?\s*schema\s*-?%\}/g) ?? [];
  check('tiene exactamente un bloque {% schema %}', schemaTags.length === 1,
    `encontrados: ${schemaTags.length}`);
  if (schemaTags.length !== 1) return report();

  const match = content.match(/\{%-?\s*schema\s*-?%\}([\s\S]*?)\{%-?\s*endschema\s*-?%\}/);
  if (!match) {
    check('el schema esta cerrado con {% endschema %}', false);
    return report();
  }

  check('no hay Liquid dentro del schema', !/\{\{|\{%/.test(match[1]),
    'el schema es JSON plano, el Liquid no se evalua');

  let schema: Schema;
  try {
    schema = JSON.parse(match[1]) as Schema;
    check('el schema es JSON valido', true);
  } catch (err) {
    check('el schema es JSON valido', false, err instanceof Error ? err.message : String(err));
    return report();
  }

  const markup = content.slice(0, content.indexOf(match[0]));

  check('tiene name', Boolean(schema.name));
  check('tiene presets', Array.isArray(schema.presets) && schema.presets.length > 0,
    'sin presets el comerciante no puede anadir la seccion desde el editor');
  check('tag valido o ausente',
    schema.tag === undefined || VALID_TAGS.includes(schema.tag), String(schema.tag));
  check('limit ausente o 1 o 2',
    schema.limit === undefined || schema.limit === 1 || schema.limit === 2, String(schema.limit));
  check(`max_blocks <= ${MAX_BLOCKS}`,
    schema.max_blocks === undefined || schema.max_blocks <= MAX_BLOCKS, String(schema.max_blocks));
  check('enabled_on y disabled_on no coexisten',
    !(schema.enabled_on !== undefined && schema.disabled_on !== undefined));

  const sectionSettings = schema.settings ?? [];
  const blockSettings = (schema.blocks ?? []).flatMap((b) => b.settings ?? []);

  for (const s of [...sectionSettings, ...blockSettings]) {
    if (s.type === 'range') {
      check(`range "${s.id}" tiene min, max y default`,
        s.min !== undefined && s.max !== undefined && s.default !== undefined);
      check(`range "${s.id}" no usa valores string`,
        (['min', 'max', 'step', 'default'] as const).every(
          (k) => s[k] === undefined || typeof s[k] === 'number'
        ));
    }
    if (s.type === 'select') {
      check(`select "${s.id}" tiene options`,
        Array.isArray(s.options) && s.options.length > 0);
    }
  }

  for (const s of sectionSettings) {
    if (s.id) {
      check(`section.settings.${s.id} se usa en el markup`,
        markup.includes(`section.settings.${s.id}`));
    }
  }

  if ((schema.blocks ?? []).length > 0) {
    check('itera section.blocks',
      /\{%-?\s*for\s+block\s+in\s+section\.blocks/.test(markup));
    check('emite block.shopify_attributes', markup.includes('block.shopify_attributes'),
      'sin esto el editor no puede seleccionar ni reordenar bloques');

    for (const s of blockSettings) {
      if (s.id) {
        check(`block.settings.${s.id} se usa en el markup`,
          markup.includes(`block.settings.${s.id}`));
      }
    }
  }

  report();
}

function report(): void {
  console.log('');
  if (failures.length === 0) {
    console.log(`${passed} comprobaciones correctas, 0 problemas\n`);
    return;
  }
  console.error(`${passed} correctas, ${failures.length} problemas\n`);
  process.exit(1);
}

main();
