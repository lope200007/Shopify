/**
 * Envoltorio de ahorro para linkfox-dld-product-search.
 *
 * EL PROBLEMA: cada busqueda cuesta 9 creditos. El script de linkfox cachea,
 * pero solo 24 horas: pasado ese plazo vuelve a cobrarte por la MISMA pregunta.
 *
 * LA SOLUCION: el archivo de cache sigue en disco despues de caducar; lo unico
 * que caduca es el permiso para reutilizarlo. Esto lo lee igualmente, sin
 * limite de antiguedad. Nunca pagas dos veces por la misma pregunta.
 *
 * No es saltarse el cobro: son datos que ya compraste. Una consulta nueva se
 * paga como debe ser.
 *
 * Uso:
 *   npm run linkfox -- search '{"keyWord":"yoga mat","cycle":"30","pageSize":20}'
 *   npm run linkfox -- report
 *   npm run linkfox -- list
 */
import { createHash } from 'crypto';
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const SLUG = 'linkfox-dld-product-search';
const CREDITS_PER_SEARCH = 9;
const ROOT = path.join(process.cwd(), 'linkfox');
const CACHE_DIR = path.join(ROOT, '.cache', SLUG);
const LEDGER = path.join(ROOT, 'ledger.jsonl');
const SCRIPT = path.join(
  process.cwd(),
  '.agents',
  'skills',
  SLUG,
  'scripts',
  'dld_product_search.py'
);

/**
 * Reproduce exactamente `json.dumps(params, ensure_ascii=False, sort_keys=True)`
 * de Python, que es como linkfox calcula su clave de cache.
 *
 * Python separa con ", " y ": " (con espacio); JSON.stringify no pone ninguno.
 * Si no se replica al byte, el hash no coincide y el archivo no se encuentra.
 */
function pythonJsonDumps(value: unknown): string {
  if (value === null) return 'null';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return JSON.stringify(value);
  if (Array.isArray(value)) {
    return `[${value.map(pythonJsonDumps).join(', ')}]`;
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const parts = Object.keys(obj)
      .sort()
      .map((k) => `${JSON.stringify(k)}: ${pythonJsonDumps(obj[k])}`);
    return `{${parts.join(', ')}}`;
  }
  throw new Error(`Tipo no serializable: ${typeof value}`);
}

export function cacheKey(params: unknown): string {
  return createHash('sha256')
    .update(pythonJsonDumps(params), 'utf8')
    .digest('hex')
    .slice(0, 16);
}

function cachePath(params: unknown): string {
  return path.join(CACHE_DIR, `${SLUG}-${cacheKey(params)}.json`);
}

interface LedgerEntry {
  key: string;
  params: unknown;
  firstPaidAt: string;
  reuses: number;
}

function readLedger(): LedgerEntry[] {
  if (!fs.existsSync(LEDGER)) return [];
  return fs
    .readFileSync(LEDGER, 'utf8')
    .split('\n')
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l) as LedgerEntry);
}

function writeLedger(entries: LedgerEntry[]): void {
  fs.mkdirSync(ROOT, { recursive: true });
  fs.writeFileSync(LEDGER, entries.map((e) => JSON.stringify(e)).join('\n') + '\n');
}

/** Busca reutilizando el archivo permanente; solo paga si la pregunta es nueva. */
function search(rawParams: string): void {
  let params: unknown;
  try {
    params = JSON.parse(rawParams);
  } catch (err) {
    throw new Error(`Los parametros no son JSON valido: ${String(err)}`);
  }

  const key = cacheKey(params);
  const file = cachePath(params);
  const ledger = readLedger();
  const known = ledger.find((e) => e.key === key);

  if (fs.existsSync(file)) {
    const age = Math.round((Date.now() - fs.statSync(file).mtimeMs) / 86400000);
    console.log(`Ya compramos esta busqueda (hace ${age} dias). 0 creditos.\n`);
    if (known) {
      known.reuses += 1;
      writeLedger(ledger);
    }
    console.log(fs.readFileSync(file, 'utf8'));
    return;
  }

  if (!fs.existsSync(SCRIPT)) {
    throw new Error(
      `No encuentro el script de linkfox en ${SCRIPT}.\n` +
        'Instalalo con: npx skills add linkfox-ai/linkfox-skills@linkfox-dld-product-search'
    );
  }
  if (!process.env.LINKFOX_AGENT_API_KEY && !process.env.LINKFOXAGENT_API_KEY) {
    throw new Error(
      'Falta LINKFOX_AGENT_API_KEY en el entorno.\n' +
        'Obtenla en https://agent.linkfox.com/ (no hace falta dar el telefono).'
    );
  }

  console.log(`Busqueda nueva: cuesta ${CREDITS_PER_SEARCH} creditos.\n`);
  const out = execFileSync('python3', [SCRIPT, JSON.stringify(params)], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  });
  console.log(out);

  ledger.push({
    key,
    params,
    firstPaidAt: new Date().toISOString(),
    reuses: 0,
  });
  writeLedger(ledger);
}

/** Cuanto hemos gastado y cuanto nos hemos ahorrado. */
function report(): void {
  const ledger = readLedger();
  const paid = ledger.length;
  const reuses = ledger.reduce((sum, e) => sum + e.reuses, 0);

  console.log('\nCreditos de linkfox\n');
  console.log(`  Busquedas pagadas:     ${paid}`);
  console.log(`  Creditos gastados:     ${paid * CREDITS_PER_SEARCH}`);
  console.log(`  Reutilizaciones:       ${reuses}`);
  console.log(`  Creditos ahorrados:    ${reuses * CREDITS_PER_SEARCH}`);

  if (paid === 0) {
    console.log('\n  Todavia no se ha gastado nada.\n');
    return;
  }
  const eff = Math.round((reuses / paid) * 100);
  console.log(`\n  Reutilizacion: ${eff}% sobre lo pagado\n`);
}

/** Que preguntas ya tenemos compradas. */
function list(): void {
  const ledger = readLedger();
  if (ledger.length === 0) {
    console.log('\nNo hay busquedas archivadas todavia.\n');
    return;
  }
  console.log(`\n${ledger.length} busquedas ya compradas (reutilizables gratis):\n`);
  for (const e of ledger) {
    const exists = fs.existsSync(path.join(CACHE_DIR, `${SLUG}-${e.key}.json`));
    console.log(
      `  ${e.firstPaidAt.slice(0, 10)}  ${JSON.stringify(e.params)}` +
        `  [reusada ${e.reuses}x]${exists ? '' : '  (ARCHIVO BORRADO)'}`
    );
  }
  console.log('');
}

function main(): void {
  const [cmd, ...rest] = process.argv.slice(2);
  switch (cmd) {
    case 'search':
      if (!rest[0]) throw new Error("Falta el JSON: search '{\"keyWord\":\"...\"}'");
      search(rest[0]);
      break;
    case 'report':
      report();
      break;
    case 'list':
      list();
      break;
    default:
      console.log(
        'Uso:\n' +
          '  npm run linkfox -- search \'{"keyWord":"yoga mat","cycle":"30"}\'\n' +
          '  npm run linkfox -- report\n' +
          '  npm run linkfox -- list\n'
      );
      process.exit(cmd ? 1 : 0);
  }
}

if (require.main === module) {
  try {
    main();
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  }
}
