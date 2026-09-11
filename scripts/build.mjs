import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const projects = JSON.parse(await readFile(path.join(root, 'data/projects.json'), 'utf8'));
const site = JSON.parse(await readFile(path.join(root, 'data/site.json'), 'utf8'));
const experience = JSON.parse(await readFile(path.join(root, 'data/experience.json'), 'utf8'));
const version = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8')).version;
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const paths = {
 'arrow-up-right':'<path d="M6 18 18 6M6 6h12v12"/>',
 'arrow-right':'<path d="M4 12h16m-6-6 6 6-6 6"/>',
 'arrow-left':'<path d="M20 12H4m6-6-6 6 6 6"/>',
 'arrow-down':'<path d="M12 4v16m-6-6 6 6 6-6"/>',
 'arrow-up':'<path d="M12 20V4m-6 6 6-6 6 6"/>',
 'expand':'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
 'menu':'<path d="M4 8h16M4 16h16"/>',
 'close':'<path d="m6 6 12 12M6 18 18 6"/>',
 'search':'<circle cx="10.7" cy="10.7" r="6.7"/><path d="m16 16 4.5 4.5"/>',
 'play':'<path d="m8 5 11 7-11 7Z"/>',
 'check':'<path d="m5 12 4 4L19 6"/>',
 'copy':'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M15 8V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h4"/>',
 'lock':'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4M12 14v3"/>',
 'chart':'<path d="M4 3v17h17M8 15v-4m5 4V6m5 9v-7"/>',
 'code':'<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18"/>',
 'database':'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v7c0 4 16 4 16 0V5M4 12v7c0 4 16 4 16 0v-7"/>',
 'bolt':'<path d="m13 2-9 12h7l-1 8 10-13h-8Z"/>',
 'route':'<circle cx="5" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 6h10a4 4 0 0 1 0 8H7a2 2 0 0 0 0 4h10"/>',
 'spark':'<path d="M12 2v20M2 12h20M5 5l14 14M5 19 19 5"/>'
};
const icon = name => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name] || paths['arrow-up-right']}</svg>`;
const toolDefinitions = [
 ['python','Python'], ['sql','SQL'], ['java','Java'], ['javascript','JavaScript'], ['looker','Looker Studio'], ['appsscript','Apps Script']
];
const svgByKey = Object.fromEntries(await Promise.all([...toolDefinitions.map(([key])=>key),'linkedin','github'].map(async key=> {
 const svg = (await readFile(path.join(root, `assets/icons/${key}.svg`),'utf8')).trim();
 if (!svg.startsWith('<svg') || /<script|foreignObject|onload=/.test(svg)) throw Error(`SVG inválido: ${key}`);
 return [key, svg.replace('<svg ', `<svg class="tool-icon" data-tool="${key}" aria-hidden="true" focusable="false" `)];
})));
const toolIcon = key => { if(!svgByKey[key]) throw Error(`Ícone desconhecido: ${key}`); return svgByKey[key]; };
const rotator = key => `<span class="tool-rotator" data-tool-rotator="${key}" aria-hidden="true">${toolIcon(key)}</span>`;
const toolList = `<ul class="tool-list" aria-label="Ferramentas de trabalho">${toolDefinitions.map(([key,label])=>`<li>${toolIcon(key)}<span>${label}</span></li>`).join('')}</ul>`;
const toolMarqueeGroup = `<div>${toolDefinitions.map(([key,label])=>`<span class="marquee-item">${toolIcon(key)}<span>${label}</span></span>`).join('')}</div>`;

const externalLinks = p => p.links.map(l=>`<a href="${escape(l.href)}" target="_blank" rel="noopener noreferrer">${escape(l.label)} ${icon('arrow-up-right')}</a>`).join('');
const featured = projects.filter(p=>p.featured).map((p,i)=>`<article class="work-card work-card--${i+1}" data-reveal>
<a href="#caso-${p.id}" data-open-project="${p.id}" aria-label="Conhecer o projeto ${escape(p.title)}">
 <div class="work-art art-${i+1}"><div class="art-label"><span>${String(i+1).padStart(2,'0')} / ${escape(p.categoryLabel)}</span><span>PROJETO REAL</span></div><div class="work-browser"><div class="mini-browser-bar"><span class="window-dots" aria-hidden="true"><i></i><i></i><i></i></span><span>${escape(p.client)}</span></div><img src="${p.preview}" alt="Tela do projeto ${escape(p.title)}" width="1200" height="760" loading="lazy" decoding="async"></div><span class="work-open">${icon('arrow-up-right')}</span></div>
 <div class="work-info"><div><p>${escape(p.client)}</p><h3>${escape(p.title)}</h3></div><span class="work-label">${escape(p.labels[0])}</span></div><p class="work-summary">${escape(p.summary)}</p></a></article>`).join('\n');
const catalog = projects.map(p=>`<article class="catalog-card" id="caso-${p.id}" data-project-id="${p.id}" data-category="${p.category}">
 <a class="catalog-image" href="#caso-${p.id}" data-open-project="${p.id}" aria-label="Ver detalhes de ${escape(p.title)}"><img src="${p.thumbnail}" alt="Prévia de ${escape(p.title)}" width="640" height="400" loading="lazy" decoding="async"><span class="catalog-type">${p.video ? icon('play') : icon('expand')} ${p.video ? 'VER DEMONSTRAÇÃO' : 'EXPLORAR PROJETO'}</span></a>
 <div class="catalog-body"><p class="catalog-client">${escape(p.client)}</p><h3><a href="#caso-${p.id}" data-open-project="${p.id}">${escape(p.title)}</a></h3><p class="catalog-summary">${escape(p.summary)}</p><div class="catalog-card-footer"><span>${escape(p.categoryLabel)}</span><a href="#caso-${p.id}" data-open-project="${p.id}" aria-label="Abrir case ${escape(p.title)}">${icon('arrow-up-right')}</a></div><details class="nojs-details"><summary>Detalhes e links</summary><p>${escape(p.description)}</p>${p.video ? `<video src="${p.playback || p.video}" controls preload="none" poster="${p.thumbnail}"></video>` : ''}${externalLinks(p)}</details></div></article>`).join('\n');
const categories = [['todos','Todos'],['dashboard','Dashboards'],['aplicacao','Aplicações'],['automacao','Automações']];
const filters = categories.filter(([key])=>key==='todos'||projects.some(p=>p.category===key)).map(([key,label],i)=>`<button type="button" class="filter-button${i===0?' is-active':''}" data-filter="${key}" aria-pressed="${i===0}">${label}<span>${key==='todos'?projects.length:projects.filter(p=>p.category===key).length}</span></button>`).join('');
const json = data => JSON.stringify(data).replace(/</g, '\\u003c');
const structured = {'@context':'https://schema.org','@type':'Person',name:site.name,alternateName:site.alternateName,jobTitle:site.role,url:site.url,image:site.url+'assets/optimized/foto-henriques.webp',sameAs:[site.linkedin,site.github],knowsAbout:['Python','SQL','Looker Studio','JavaScript','Apps Script','Business Intelligence','Análise de dados']};
let html = await readFile(path.join(root, 'src/index.template.html'), 'utf8');
const storyTabs = experience.selected.map((id,i)=>`<button type="button" data-story-index="${i}" aria-pressed="${i===0}"><span>${String(i+1).padStart(2,'0')}</span>${escape(experience.labels[i])}<i></i></button>`).join('');
const tokens={PROJECT_COUNT:projects.length,DASHBOARD_COUNT:projects.filter(p=>p.category==='dashboard').length,TOOL_DATA:json(toolDefinitions.map(([key,label])=>({key,label,svg:toolIcon(key)}))),TOOL_LIST:toolList,TOOL_MARQUEE:toolMarqueeGroup.repeat(2),STORY_TABS:storyTabs,EXPERIENCE_DATA:json(experience),FEATURED:featured,CATALOG:catalog,FILTERS:filters,PROJECT_DATA:json(projects),SITE_DATA:json(site),STRUCTURED_DATA:json(structured),...Object.fromEntries(Object.entries(site).map(([k,v])=>[k.toUpperCase(),escape(v)]))};
html = html.replace(/\{\{rotator:([\w-]+)\}\}/g,(_,name)=>rotator(name)).replace(/\{\{t:([\w-]+)\}\}/g,(_,name)=>toolIcon(name)).replace(/\{\{i:([\w-]+)\}\}/g,(_,name)=>icon(name)).replace(/\{\{([A-Z_]+)\}\}/g,(_,key)=>{if(!(key in tokens))throw Error(`Unknown template token: ${key}`);return tokens[key];});
await writeFile(path.join(root,'index.html'),html);
if (!process.argv.includes('--html-only')) {
 await rm(path.join(root,'dist'),{force:true,recursive:true});
 await mkdir(path.join(root,'dist/scripts'),{recursive:true});
 for(const file of ['index.html','styles.css','script.js','robots.txt','sitemap.xml']) await cp(path.join(root,file),path.join(root,'dist',file));
 for (const file of ['catalog-core.js','motion-core.js','experience.js','tools.js']) await cp(path.join(root,'scripts',file),path.join(root,'dist/scripts',file));
 await cp(path.join(root,'assets'),path.join(root,'dist/assets'),{recursive:true});
}
console.log(`Build concluído: ${projects.length} projetos no catálogo. ${process.argv.includes('--html-only')?'index.html atualizado.':'Publicação em dist/.'}`);
