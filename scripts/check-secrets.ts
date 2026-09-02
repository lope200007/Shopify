/**
 * Impide que un secreto llegue al repositorio.
 *
 * Se ejecuta solo antes de cada commit (hook pre-commit) y tambien a mano:
 *   npm run check:secrets          revisa lo que esta en el indice (staged)
 *   npm run check:secrets -- --all revisa todo el arbol de trabajo
 *
 * Un token de Shopify en el historial de git es publico para siempre aunque
 * borres el commit despues: hay forks, caches y clones. La unica defensa que
 * funciona es no dejar que entre.
 */
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';

interface Pattern {
  name: string;
  re: RegExp;
}

const PATTERNS: Pattern[] = [
  { name: 'token de Shopify Admin API', re: /shpat_[a-fA-F0-9]{32}/ },
  { name: 'secreto compartido de Shopify', re: /shpss_[a-fA-F0-9]{32}/ },
  { name: 'token de Shopify (custom app)', re: /shpca_[a-fA-F0-9]{32}/ },
  { name: 'token de Shopify (partner)', re: /shppa_[a-fA-F0-9]{32}/ },
  { name: 'clave de Groq', re: /gsk_[A-Za-z0-9]{20,}/ },
  { name: 'clave estilo OpenAI', re: /\bsk-[A-Za-z0-9]{20,}/ },
  { name: 'clave de acceso de AWS', re: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: 'clave privada', re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { name: 'token de GitHub', re: /\bgh[pousr]_[A-Za-z0-9]{30,}/ },
  {
    name: 'asignacion de secreto con valor real',
    re: /\b(SECRET|TOKEN|PASSWORD|PASSWD|API_?KEY|CLIENT_SECRET|ACCESS_KEY)\w*\s*[=:]\s*["'][^"'\s]{16,}["']/i,
  },
];

/** Valores de ejemplo que no son secretos: no deben disparar la alarma. */
const PLACEHOLDER = /x{6,}|<your|your[_-]|example|placeholder|dummy|fake|test|aqui|xxxx|\.\.\./i;

/** Archivos donde los ejemplos son legitimos. */
const ALLOWLIST = [
  '.env.example',
  'scripts/check-secrets.ts',
  'scripts/selftest.ts',
  'CLAUDE.md',
  'README.md',
];

interface Finding {
  file: string;
  line: number;
  pattern: string;
  excerpt: string;
}

function git(args: string[]): string {
  return execFileSync('git', args, { encoding: 'utf8' });
}

function filesToCheck(all: boolean): string[] {
  const out = all
    ? git(['ls-files'])
    : git(['diff', '--cached', '--name-only', '--diff-filter=ACM']);
  return out.split('\n').filter((f) => f.trim());
}

function isBinary(buf: Buffer): boolean {
  return buf.subarray(0, 8000).includes(0);
}

function scan(file: string): Finding[] {
  const findings: Finding[] = [];
  const full = path.resolve(file);
  if (!fs.existsSync(full)) return findings;

  // git ls-files lista tambien los symlinks de skills, que apuntan a
  // directorios. lstat sin seguir el enlace: solo archivos regulares.
  const st = fs.lstatSync(full);
  if (!st.isFile()) return findings;

  const buf = fs.readFileSync(full);
  if (isBinary(buf)) return findings;

  const allowed = ALLOWLIST.some((a) => file === a || file.endsWith(`/${a}`));

  buf
    .toString('utf8')
    .split('\n')
    .forEach((line, i) => {
      for (const p of PATTERNS) {
        const m = p.re.exec(line);
        if (!m) continue;
        // En archivos de ejemplo, un valor claramente ficticio no cuenta.
        if (allowed && PLACEHOLDER.test(line)) continue;
        if (PLACEHOLDER.test(m[0])) continue;
        findings.push({
          file,
          line: i + 1,
          pattern: p.name,
          excerpt: m[0].slice(0, 12) + '…',
        });
      }
    });

  return findings;
}

function main(): void {
  const all = process.argv.includes('--all');
  const files = filesToCheck(all);

  const findings: Finding[] = [];
  const envFiles: string[] = [];

  for (const f of files) {
    const base = path.basename(f);
    if (base === '.env' || (base.startsWith('.env.') && base !== '.env.example')) {
      envFiles.push(f);
    }
    findings.push(...scan(f));
  }

  if (envFiles.length === 0 && findings.length === 0) {
    console.log(
      `check-secrets: ${files.length} archivo(s) revisado(s), nada sospechoso.`
    );
    return;
  }

  console.error('\n  SECRETOS DETECTADOS — commit abortado\n');

  for (const f of envFiles) {
    console.error(`  ${f}`);
    console.error('    Un archivo .env nunca se commitea. Quitalo del indice:');
    console.error(`      git restore --staged ${f}\n`);
  }

  for (const f of findings) {
    console.error(`  ${f.file}:${f.line}  ${f.pattern}  (${f.excerpt})`);
  }

  if (findings.length > 0) {
    console.error(
      '\n  Si alguno es un secreto real, NO basta con borrarlo del archivo:\n' +
        '  hay que ROTARLO en el proveedor. Una vez commiteado se considera\n' +
        '  comprometido para siempre.\n' +
        '\n  Si es un valor de ejemplo, hazlo obviamente ficticio (xxxx, <your…>).\n'
    );
  }

  process.exit(1);
}

main();
