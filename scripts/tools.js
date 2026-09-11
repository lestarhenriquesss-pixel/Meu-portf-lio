/* Local SVGs only. Lists are informational; only the four map nodes are controls. */
window.PortfolioTools = (() => {
  'use strict';
  function init() {
    const source = document.getElementById('toolData');
    if (!source) return;
    const tools = JSON.parse(source.textContent);
    if (!Array.isArray(tools) || tools.length === 0) return;
    const positions = new Map();
    const rotators = [...document.querySelectorAll('[data-tool-rotator]')];
    rotators.forEach(el => positions.set(el, Math.max(0, tools.findIndex(t => t.key === el.dataset.toolRotator))));
    // Each slot contains exactly one SVG; no sliding line, extra label or icon badge.
    function cycle() {
      if (document.hidden) return;
      for (const el of rotators) {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) continue;
        const next = (positions.get(el) + 1) % tools.length;
        positions.set(el, next);
        el.innerHTML = tools[next].svg;
        el.dataset.toolRotator = tools[next].key;
        const icon = el.firstElementChild;
        if (icon?.animate) icon.animate([{opacity:.15, transform:'scale(.87)'},{opacity:1,transform:'scale(1)'}], {duration:360,easing:'cubic-bezier(.22,1,.36,1)'});
      }
    }
    setInterval(cycle, 2800);
    const descriptions = {
      sql: ['SQL · Da origem à consistência','Consultas, cruzamentos e regras de negócio para organizar a base que alimenta indicadores e aplicações.'],
      python: ['Python · Da rotina à automação','Tratamento de arquivos, integração de dados e rotinas que reduzem tarefas repetitivas na operação.'],
      looker: ['Looker Studio · Do indicador ao contexto','Dashboards que combinam métricas, filtros e detalhamento para apoiar a leitura dos resultados.'],
      javascript: ['JavaScript · Dos dados à interação','Interfaces web que conectam as informações a ações, registros e fluxos usados no dia a dia.']
    };
    const nodes = [...document.querySelectorAll('button[data-skill]')];
    const title = document.getElementById('systemTooltipTitle');
    const text = document.getElementById('systemTooltipText');
    const map = document.querySelector('.system-visual');
    function select(key) {
      if (!descriptions[key] || !title || !text) return;
      title.textContent = descriptions[key][0]; text.textContent = descriptions[key][1];
      nodes.forEach(el => el.setAttribute('aria-pressed', String(el.dataset.skill === key)));
      if (map) { map.classList.remove('is-linked'); void map.offsetWidth; map.classList.add('is-linked'); }
    }
    nodes.forEach(el => el.addEventListener('click', () => select(el.dataset.skill)));
  }
  return Object.freeze({init});
})();
