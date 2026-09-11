"""Render actual shipped HTML/CSS/JS in memory; Chromium policy blocks all URL navigation.
Only localStorage is supplied by the harness (about:blank has an opaque origin).
HTTP is checked separately with Python requests against the actual Node server.
"""
import re,json,base64,os,shutil
from functools import lru_cache
from pathlib import Path

@lru_cache(maxsize=3)
def html_bundle(root):
 root=Path(root)
 content=(root/'index.html').read_text()
 content=re.sub(r'<script defer src="[^"]+"></script>','',content)
 content=re.sub(r'<link[^>]+(?:preconnect|fonts\.googleapis|stylesheet|preload)[^>]*>','',content)
 content=content.replace('</head>','<style>'+(root/'styles.css').read_text()+'</style></head>')
 content=re.sub(r'"(assets/[^"#]+)"',lambda m:m.group(0) if m.group(1).endswith('.mp4') else '"'+asset_uri(root/m.group(1))+'"',content)
 scripts=['scripts/catalog-core.js','scripts/motion-core.js','scripts/experience.js','scripts/tools.js','script.js']
 content=content.replace('</body>',''.join('<script>\n'+(root/s).read_text()+'\n</script>' for s in scripts)+'</body>')
 return content

@lru_cache(maxsize=150)
def asset_uri(path):
 mime={'.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'}.get(path.suffix,'application/octet-stream')
 return 'data:'+mime+';base64,'+base64.b64encode(path.read_bytes()).decode()

def load(page,root,stored=None,query=''):
 page.goto('about:blank'+query)
 page.evaluate('''entries=>{
 const values = new Map(Object.entries(entries));
 Object.defineProperty(window, 'localStorage', {configurable:true,value:{getItem:k=>values.has(k)?values.get(k):null,setItem:(k,v)=>values.set(k,String(v)),removeItem:k=>values.delete(k),clear:()=>values.clear()}});
 }''',stored or {})
 page.set_content(html_bundle(root),wait_until='load')

def launch(playwright):
 executable = os.environ.get('PORTFOLIO_BROWSER') or shutil.which('chromium') or shutil.which('google-chrome')
 options = {'headless': True, 'args': ['--no-sandbox']} if os.name != 'nt' else {'headless': True}
 if executable: options['executable_path'] = executable
 return playwright.chromium.launch(**options)
