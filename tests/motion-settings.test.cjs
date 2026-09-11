const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const core = require('../scripts/motion-core.js');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');

const expected = { mode: 'on', source: 'site', reduced: false };
test('animações ficam ativas por política fixa do site', () => {
  assert.deepEqual(core.resolveMotion(), expected);
});
test('preferência de redução do dispositivo não desliga os efeitos', () => {
  assert.deepEqual(core.resolveMotion({ systemReduced: true }), expected);
});
test('escolhas salvas de versões anteriores não desativam animações', () => {
  for (const savedMode of ['off', 'auto', 'on', null]) {
    assert.deepEqual(core.resolveMotion({ systemReduced: true, savedMode, legacyPaused: true }), expected);
  }
});
test('parâmetros antigos de URL não criam um modo de pausa', () => {
  for (const requestedMode of ['off', 'auto', 'on', 'invalid']) {
    assert.deepEqual(core.resolveMotion({ systemReduced: true, savedMode: 'off', requestedMode }), expected);
  }
});
test('o objeto de política fixa é imutável', () => {
  const policy = core.resolveMotion();
  assert.equal(Object.isFrozen(policy), true);
  assert.equal(Reflect.set(policy, 'reduced', true), false);
  assert.equal(policy.reduced, false);
});
test('fonte e HTML gerado não possuem controles de pausa ou preferências', () => {
  for (const file of ['src/index.template.html', 'index.html']) {
    const html = read(file);
    for (const id of ['motionQuick', 'motionToggle', 'motionSystem', 'motionStatus', 'slidePause']) {
      assert.equal(html.includes(`id="${id}"`), false, `${file}: ${id}`);
    }
    assert.doesNotMatch(html, /Pausar animações|Ativar animações|Pausar carrossel|Usar preferência do sistema/);
  }
});
test('faixa de tecnologias não pausa no hover', () => {
  assert.doesNotMatch(read('styles.css'), /\.tech-marquee:hover\s+\.marquee-track\s*\{[^}]*paused/);
});
test('a página não consulta nem grava preferências de animação do visitante', () => {
  assert.doesNotMatch(read('script.js'), /lestar-motion|prefers-reduced-motion|setMode\s*\(/);
  assert.doesNotMatch(read('styles.css'), /prefers-reduced-motion/);
});
