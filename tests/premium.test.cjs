const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const core = () => { assert.ok(fs.existsSync(path.join(root,'scripts/motion-core.js')), 'Controlador de rolagem deve existir'); return require('../scripts/motion-core.js'); };
test('Premium Escuro aplica a paleta aprovada sem controles de laboratório', () => {
 assert.match(read('styles.css'), /--bg:\s*#0a0d16/);
 assert.match(read('styles.css'), /--accent:\s*#a3acff/);
 assert.match(read('index.html'), /id="ambientCanvas"/);
 assert.ok(!read('index.html').includes('data-theme-choice'));
});
test('progresso de rolagem é finito, limitado e estável com seção curta', () => {
 const {scrollProgress}=core();
 assert.equal(scrollProgress(0,400,1200,800,100),0);
 assert.equal(scrollProgress(500,400,1200,800,100),.4);
 assert.equal(scrollProgress(1400,400,1200,800,100),1);
 assert.equal(scrollProgress(100,400,300,800,100),0);
});
test('índice do case inclui os extremos sem extrapolar e valida total', () => {
 const {stepIndex}=core();
 assert.equal(stepIndex(-1,5),0); assert.equal(stepIndex(0,5),0);
 assert.equal(stepIndex(.42,5),2); assert.equal(stepIndex(1,5),4);
 assert.equal(stepIndex(9,5),4); assert.equal(stepIndex(NaN,5),0);
 assert.equal(stepIndex(.5,0),0);
});
test('converte cada etapa em posição de rolagem selecionável', () => {
 const {stepPosition,scrollProgress,stepIndex}=core();
 for(let i=0;i<5;i++) {
  const y=stepPosition(i,5,400,2800,800,100);
  assert.equal(stepIndex(scrollProgress(y,400,2800,800,100),5),i);
 }
});
test('vitrine editorial usa cases existentes em dashboards e aplicações', () => {
 const all=JSON.parse(read('data/projects.json'));
 const config=JSON.parse(read('data/experience.json'));
 assert.equal(config.selected.length,5);
 for(const id of config.selected) assert.ok(all.some(p=>p.id===id));
 assert.equal(new Set(config.selected.map(id=>all.find(p=>p.id===id).category)).size,2);
 const html=read('index.html');
 for(const name of ['storySection','storyTitle','storyImage','storyOpen','storyNext','storyPrev','caseShare']) assert.ok(html.includes(`id="${name}"`),name);
});
