import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

async function walk(folder) {
  const items = [];
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const full = join(folder, entry.name);
    if (entry.isDirectory()) items.push(...await walk(full));
    else items.push(full);
  }
  return items;
}

test('all source, database and document filenames are English-style ASCII', async () => {
  const roots = ['src', 'database', 'scripts', 'tests', 'docs'];
  for (const root of roots) {
    for (const file of await walk(resolve(root))) {
      // User-provided reference documents retain their original filenames.
      if (relative(process.cwd(), file).replaceAll('\\', '/').startsWith('docs/codex/')) continue;
      const parts = relative(process.cwd(), file).split(/[\\/]/);
      assert.ok(parts.every(part => /^[A-Za-z0-9_.-]+$/.test(part)), `Invalid path: ${file}`);
    }
  }
});

test('schema contains no obsolete Portuguese table names and no Portuguese payment enums', async () => {
  const schema = await readFile(resolve('database/migrations/001_initial.sql'), 'utf8');
  assert.doesNotMatch(schema, /\b(?:usuario|transportadora|gerente|caminhoneiro|veiculo|viagem|posto|preco_combustivel|abastecimento|pagamento|denuncia|notificacao)\b/i);
  assert.match(schema, /'PROCESSING','APPROVED','REJECTED','UNKNOWN'/);
  assert.match(schema, /'PENDING','PROCESSING','SENT','SIMULATED','FAILED'/);
});

test('Compose orchestrates database, migration/seed, API in order', async () => {
  const compose = await readFile(resolve('compose.yaml'), 'utf8');
  assert.match(compose, /npm run db:migrate && npm run db:seed:admin/);
  assert.match(compose, /service_completed_successfully/);
});
