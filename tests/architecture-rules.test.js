// Testes unitarios de arquitetura: verificam as regras de dependencia
// de Vertical Slice e Clean Architecture lendo os imports do codigo.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join, relative, resolve, dirname, sep } from 'node:path';

const SRC = resolve('src');

async function listJs(folder) {
  const files = [];
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const full = join(folder, entry.name);
    if (entry.isDirectory()) files.push(...await listJs(full));
    else if (entry.name.endsWith('.js')) files.push(full);
  }
  return files;
}

// Retorna os imports de um arquivo: relativos ja resolvidos (caminho a partir de src/)
// e pacotes externos pelo nome.
async function importsOf(file) {
  const code = await readFile(file, 'utf8');
  const found = [...code.matchAll(/^\s*import\s[^'"]*['"]([^'"]+)['"]/gm)].map(m => m[1]);
  return found.map(spec => spec.startsWith('.')
    ? relative(SRC, resolve(dirname(file), spec)).split(sep).join('/')
    : spec);
}

const rel = (file) => relative(SRC, file).split(sep).join('/');
const sliceOf = (path) => path.match(/^slices\/([^/]+\/[^/]+)\//)?.[1] ?? null;

const files = await listJs(SRC);
const graph = await Promise.all(files.map(async f => ({ file: rel(f), imports: await importsOf(f) })));
const inSlices = graph.filter(g => g.file.startsWith('slices/'));

test('Vertical Slice: um slice nao importa outro slice', () => {
  for (const { file, imports } of inSlices) {
    const own = sliceOf(file);
    for (const target of imports.filter(i => i.startsWith('slices/'))) {
      assert.equal(sliceOf(target), own, `${file} importa ${target}`);
    }
  }
});

test('Clean Architecture: shared (infraestrutura) nao depende de slices', () => {
  for (const { file, imports } of graph.filter(g => g.file.startsWith('shared/'))) {
    assert.ok(!imports.some(i => i.startsWith('slices/')), `${file} depende de um slice`);
  }
});

test('route.js cuida so de HTTP: nao acessa banco nem integracoes', () => {
  for (const { file, imports } of inSlices.filter(g => g.file.endsWith('/route.js'))) {
    const proibidos = imports.filter(i => i.startsWith('shared/db/') || i.startsWith('shared/integrations/') || i === 'pg');
    assert.deepEqual(proibidos, [], `${file} importa ${proibidos.join(', ')}`);
  }
});

test('useCase.js nao conhece Express nem o registro de rotas', () => {
  for (const { file, imports } of inSlices.filter(g => /\/(useCase|repository)\.js$/.test(g.file))) {
    const proibidos = imports.filter(i => i === 'express' || i === 'shared/http/register.js');
    assert.deepEqual(proibidos, [], `${file} importa ${proibidos.join(', ')}`);
  }
});

test('Clean Architecture: o domínio (Entities) não depende de nenhuma outra camada', () => {
  const domain = graph.filter(g => g.file.startsWith('domain/'));
  assert.ok(domain.length > 0, 'src/domain nao encontrado');
  for (const { file, imports } of domain) {
    const proibidos = imports.filter(i => !i.startsWith('domain/') && i !== 'decimal.js');
    assert.deepEqual(proibidos, [], `${file} importa ${proibidos.join(', ')}`);
  }
});

// Núcleo financeiro: casos de uso que mudam abastecimento e pagamento.
const CORE = ['fuelings/create', 'fuelings/approve', 'payments/pay', 'payments/reconcile'];

test('DIP no núcleo financeiro: casos de uso dependem só do domínio e recebem as portas por injeção', () => {
  for (const slice of CORE) {
    const alvo = graph.find(g => g.file === `slices/${slice}/useCase.js`);
    assert.ok(alvo, `slices/${slice}/useCase.js nao encontrado`);
    const proibidos = alvo.imports.filter(i => !i.startsWith('domain/'));
    assert.deepEqual(proibidos, [], `${slice}/useCase.js importa ${proibidos.join(', ')}`);
  }
});

test('Composition root: só app.js e server.js criam os adaptadores de integração', () => {
  for (const { file, imports } of graph) {
    if (file === 'app.js' || file === 'server.js' || file.startsWith('shared/integrations/')) continue;
    const proibidos = imports.filter(i => i.startsWith('shared/integrations/'));
    assert.deepEqual(proibidos, [], `${file} importa ${proibidos.join(', ')}`);
  }
});

test('todo slice tem route.js como ponto de entrada', async () => {
  for (const domain of await readdir(join(SRC, 'slices'), { withFileTypes: true })) {
    if (!domain.isDirectory()) continue;
    for (const action of await readdir(join(SRC, 'slices', domain.name), { withFileTypes: true })) {
      if (!action.isDirectory()) continue;
      const names = await readdir(join(SRC, 'slices', domain.name, action.name));
      assert.ok(names.includes('route.js'), `slices/${domain.name}/${action.name} sem route.js`);
    }
  }
});
