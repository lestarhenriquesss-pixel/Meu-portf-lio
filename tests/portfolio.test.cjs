const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const original = JSON.parse(fs.readFileSync(path.join(__dirname, 'source-projects.json')));
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const exists = p => fs.existsSync(path.join(root, p));
const normalize = text => text.replace(/\s+/g, ' ').trim();
function projects() { assert.ok(exists('data/projects.json'), 'Catálogo refatorado deve existir'); return JSON.parse(read('data/projects.json')); }
function core() { assert.ok(exists('scripts/catalog-core.js'), 'Lógica de catálogo deve existir'); return require('../scripts/catalog-core.js'); }
test('preserva os 14 projetos mantidos, títulos, descrições completas e URLs originais', () => {
 const data = projects(); assert.equal(data.length, 14);
 for (let i=0; i<original.length; i++) {
  assert.equal(data[i].title, original[i].title);
  assert.equal(normalize(data[i].description), normalize(original[i].description));
  assert.deepEqual(data[i].links, original[i].links);
 }
});
test('todos os cases têm ID único, enquadramento editorial e mídia local', () => {
 const data=projects(); assert.equal(new Set(data.map(p=>p.id)).size, 14);
 for (const p of data) {
  for(const field of ['id','summary','challenge','solution','value','category']) assert.ok(p[field]?.trim(), `${p.title}: ${field}`);
  assert.ok(['dashboard','automacao','aplicacao'].includes(p.category));
  assert.ok(exists(p.image || p.video), p.title);
  assert.ok(exists(p.thumbnail), `${p.title}: thumbnail`);
 }
});
test('busca desconsidera caixa e acentos', () => { const c=core(); assert.equal(c.normalizeSearch('  Boticário  '),'boticario'); assert.equal(c.filterProjects(projects(),'todos','boticario').length,1); });
test('filtros combinam categoria e texto e preservam a ordem', () => {
 const c=core(), data=projects();
 assert.equal(c.filterProjects(data,'todos','').length,14);
 assert.equal(c.filterProjects(data,'automacao','python').length,0);
 assert.equal(c.filterProjects(data,'aplicacao','').length,4);
 assert.equal(c.filterProjects(data,'dashboard','').length,10);
 assert.equal(c.filterProjects(data,'automacao','santander').length,0);
 assert.equal(c.filterProjects(data,'todos','')[0].title,original[0].title);
});
test('busca encontra competências das tags, não apenas títulos', () => {const c=core();assert.ok(c.filterProjects(projects(),'todos','Apps Script').length>=3);assert.ok(c.filterProjects(projects(),'todos','sql').length>=5);});
test('HTML pré-renderiza todos os projetos para leitura sem JavaScript', () => {
 assert.ok(exists('index.html'),'Página gerada deve existir'); const html=read('index.html');
 assert.equal((html.match(/class="catalog-card"/g)||[]).length,14);
 for(const p of projects()) assert.ok(html.includes(`id="caso-${p.id}"`),p.title);
 assert.ok(html.includes('lang="pt-BR"')); assert.equal((html.match(/<h1\b/g)||[]).length,1);
 assert.ok(!html.includes('href="#"')); assert.ok(!html.includes('{{'));
});
test('todos os links externos abrem com isolamento de contexto', () => {
 const html=read('index.html');
 for(const anchor of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) assert.match(anchor[0],/rel="noopener noreferrer"/);
});
