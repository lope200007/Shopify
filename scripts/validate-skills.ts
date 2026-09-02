/**
 * Valida los skills de .claude/skills/.
 *
 * Comprueba el contrato de formato (frontmatter YAML con name y description)
 * y, lo mas importante, que los ejemplos de codigo que los skills ensenan sean
 * correctos: todo bloque {% schema %} tiene que ser JSON valido, porque un
 * skill que ensena un ejemplo roto propaga el error a cada uso.
 *
 * Ejecutar:  npm run validate:skills
 */
import fs from 'fs';
import path from 'path';

const SKILLS_DIR = path.join(__dirname, '..', '.claude', 'skills');

interface Problem {
  skill: string;
  message: string;
}

const problems: Problem[] = [];
let checks = 0;

function check(skill: string, condition: boolean, message: string): void {
  checks++;
  if (!condition) problems.push({ skill, message });
}

/** Extrae el frontmatter YAML delimitado por --- al principio del archivo. */
function parseFrontmatter(content: string): {
  raw: string;
  fields: Record<string, string>;
} | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const fields: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^([a-zA-Z_-]+):\s*(.*)$/);
    if (kv) fields[kv[1]] = kv[2].trim();
  }
  return { raw: match[0], fields };
}

/** Saca el JSON de cada bloque {% schema %} ... {% endschema %} del markdown. */
function extractSchemas(content: string): string[] {
  const schemas: string[] = [];
  const re = /\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) schemas.push(m[1]);
  return schemas;
}

function main(): void {
  if (!fs.existsSync(SKILLS_DIR)) {
    console.error(`No existe ${SKILLS_DIR}`);
    process.exit(1);
  }

  // Solo directorios reales. Los skills instalados con `npx skills add` entran
  // como enlaces simbolicos a .agents/skills/ y se saltan a proposito: son de
  // terceros, no siguen nuestras convenciones y no nos toca corregirlos.
  const dirs = fs
    .readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.isSymbolicLink())
    .map((d) => d.name);

  console.log(`\nValidando ${dirs.length} skills\n`);

  for (const dir of dirs) {
    const file = path.join(SKILLS_DIR, dir, 'SKILL.md');

    if (!fs.existsSync(file)) {
      problems.push({ skill: dir, message: 'falta SKILL.md' });
      continue;
    }

    const content = fs.readFileSync(file, 'utf8');
    const fm = parseFrontmatter(content);

    check(dir, fm !== null, 'sin frontmatter YAML delimitado por ---');
    if (!fm) continue;

    check(dir, Boolean(fm.fields.name), 'frontmatter sin campo name');
    check(dir, Boolean(fm.fields.description), 'frontmatter sin campo description');

    check(
      dir,
      fm.fields.name === dir,
      `name "${fm.fields.name}" no coincide con el directorio "${dir}"`
    );

    check(
      dir,
      /^[a-z0-9-]+$/.test(fm.fields.name ?? ''),
      `name "${fm.fields.name}" debe ser solo minusculas, numeros y guiones`
    );

    check(
      dir,
      (fm.fields.description ?? '').startsWith('Use when'),
      'description debe empezar por "Use when" (condiciones de uso, no el proceso)'
    );

    check(
      dir,
      fm.raw.length <= 1024,
      `frontmatter de ${fm.raw.length} caracteres, el maximo es 1024`
    );

    // Los ejemplos de codigo tienen que funcionar.
    const schemas = extractSchemas(content);
    for (const [i, schema] of schemas.entries()) {
      let parsed: Record<string, unknown> | null = null;
      try {
        parsed = JSON.parse(schema);
      } catch (err) {
        problems.push({
          skill: dir,
          message: `el bloque {% schema %} #${i + 1} no es JSON valido: ${
            err instanceof Error ? err.message : err
          }`,
        });
        continue;
      }
      checks++;

      if (parsed && Array.isArray(parsed.blocks)) {
        check(
          dir,
          content.includes('shopify_attributes'),
          'el ejemplo define blocks pero no muestra block.shopify_attributes'
        );
        check(
          dir,
          Array.isArray(parsed.presets),
          'el ejemplo define blocks pero no incluye presets (seria invisible en el editor)'
        );
      }
    }

    const words = content.split(/\s+/).length;
    console.log(`  ${dir}  (${words} palabras, ${schemas.length} schemas)`);
  }

  console.log('');
  if (problems.length === 0) {
    console.log(`${checks} comprobaciones correctas, 0 problemas\n`);
    return;
  }

  console.error(`${problems.length} problemas:\n`);
  for (const p of problems) console.error(`  ${p.skill}: ${p.message}`);
  console.error('');
  process.exit(1);
}

main();
