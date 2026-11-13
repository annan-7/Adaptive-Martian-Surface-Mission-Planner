import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = 'dist';
assert.ok(existsSync(join(root, 'index.html')), 'Run npm run build first');
const assets = readdirSync(join(root, 'assets'));
const workers = assets.filter(name => /^maplibre-gl-worker-.*\.js$/.test(name));
assert.equal(workers.length, 1, 'One self-contained Vite worker must be emitted');
const scripts = assets.filter(name => name.endsWith('.js') && !workers.includes(name))
  .map(name => readFileSync(join(root, 'assets', name), 'utf8')).join('\n');
assert.ok(scripts.includes(workers[0]), 'App must reference the emitted worker');
const worker = readFileSync(join(root, 'assets', workers[0]), 'utf8');
assert.doesNotMatch(worker, /(?:^|[;\n])\s*(?:import\s|export\s*\{)/, 'Worker should be bundled, not a copied ESM entry');
for (const file of ['map-metadata.json', 'jezero-themis.png', 'geology.geojson'])
  assert.ok(existsSync(join(root, 'data', file)), `Missing local map asset: ${file}`);
for (const file of ['facilitator', 'key.json', 'docs', 'data/scenarios'])
  assert.ok(!existsSync(join(root, file)), `Private/repository path should not be copied to dist: ${file}`);
for (const answer of Object.values(JSON.parse(readFileSync('facilitator/key.json', 'utf8'))))
  assert.ok(!scripts.includes(answer), 'Facilitator answer must not enter participant bundle');
console.log('PASS: bundled MapLibre worker, local map assets and facilitator-key exclusion. Browser rendering is a separate check.');
