const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = f => fs.readFileSync(path.join(root,f), 'utf8');
const removed = ['hefesto-distribuicao','resultados-copa-energia','resultados-boticario','painel-gerencial-santander','painel-operacional-santander','painel-gerencial-zurich','painel-individual-zurich'];
test('catálogo de origem contém exatamente os 14 projetos mantidos', () => {
  const projects = JSON.parse(read('data/projects.json'));
  assert.equal(projects.length,14);
  for (const id of removed) assert.ok(!projects.some(p=>p.id===id),id);
  assert.equal(projects.filter(p=>p.category==='dashboard').length,10);
  assert.equal(projects.filter(p=>p.category==='aplicacao').length,4);
});
test('removidos não são pré-renderizados nem constam nos destaques', () => {
  for(const file of ['index.html','src/index.template.html','data/experience.json'])
    for(const id of removed) assert.ok(!read(file).includes(id),`${file}: ${id}`);
  assert.doesNotMatch(read('index.html'), /<video\b/);
});
test('caixa de ferramentas é lista estática de nomes e SVGs, não botões', () => {
  const html = read('index.html');
  const list = html.match(/<ul class="tool-list"[\s\S]*?<\/ul>/)?.[0];
  assert.ok(list, 'Falta a lista semântica de ferramentas');
  assert.doesNotMatch(list, /<button|role="button"|tabindex|data-skill-pill/);
  assert.equal((list.match(/<li\b/g)||[]).length,6);
  assert.equal((list.match(/<svg\b/g)||[]).length,6);
});
test('seis logotipos locais monocromáticos distintos, sem retângulo de fundo', () => {
  const keys=['python','sql','java','javascript','looker','appsscript'];
  const seen = new Set();
  for(const key of keys) {
    const file=path.join(root,`assets/icons/${key}.svg`);
    assert.ok(fs.existsSync(file),key);
    const svg=fs.readFileSync(file,'utf8');
    assert.match(svg, /<svg/);
    assert.match(svg, /fill="#ffffff"/);
    assert.doesNotMatch(svg, /<(?:rect|image|script|foreignObject)\b|linearGradient|radialGradient/);
    const ds=[...svg.matchAll(/ d="([^"]+)"/g)].map(m=>m[1]).join('');
    assert.ok(ds.length>150,`Símbolo ${key} incompleto`);
    seen.add(ds);
  }
  assert.equal(seen.size,6);
});
test('sparks substituídos por cinco alternadores compactos, sem fita na foto', () => {
  const html=read('index.html');
  assert.equal((html.match(/data-tool-rotator=/g)||[]).length,5);
  assert.doesNotMatch(html, /✳|portrait-tech-carousel|portrait-tech-track/);
  assert.doesNotMatch(html, /<path d="M12 2v20M2 12h20M5 5l14 14M5 19 19 5"/);
});
test('vitrine contém etiquetas originais, sem botão de pausa', () => {
 const html=read('index.html');
 assert.match(html,/class="data-label"/);
 assert.match(html,/class="insight-sticker"/);
 assert.doesNotMatch(html,/id="slidePause"|Pausar animações|Ativar animações/);
});
test('ícones sociais usam as silhuetas brancas da versão aprovada', () => {
 const html=read('index.html');
 assert.match(html,/M6\.94 8\.5H3\.56V20h3\.38V8\.5Z/);
 assert.match(html,/M12 \.5a12 12 0 0 0-3\.79 23\.39/);
 assert.match(html,/https:\/\/www.linkedin.com\/in\/lestarangelo\//);
 assert.match(html,/https:\/\/github.com\/lestardeangelo/);
});
