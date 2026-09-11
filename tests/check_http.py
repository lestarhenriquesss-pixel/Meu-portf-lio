"""Real Node HTTP resource checks, separate from browser rendering in memory."""
from pathlib import Path
import json,subprocess,os,time,urllib.request,urllib.error,hashlib,re
R=Path(__file__).resolve().parents[1];O=R/'test-output';O.mkdir(exist_ok=True)
results=[]
def check(name,ok,detail=None):
    results.append({'test':name,'pass':bool(ok),'detail':detail})
    assert ok,(name,detail)
port=int(os.environ.get('PORTFOLIO_TEST_PORT','4198'));url=f'http://127.0.0.1:{port}/'
with (O/'http-server.log').open('w') as log:
    server=subprocess.Popen(['node','scripts/serve.mjs'],cwd=R,env={**os.environ,'PORT':str(port)},stdout=log,stderr=log)
    try:
        for _ in range(50):
            try:
                with urllib.request.urlopen(url,timeout=2) as res:body=res.read()
                break
            except OSError:time.sleep(.1)
        else:raise RuntimeError('Servidor de teste não iniciou.')
        check('Node serves exact final index.html bytes',body==(R/'index.html').read_bytes())
        check('HTTP page identifies v3.2.1',b'content="3.2.1"' in body)
        files=['styles.css','script.js','scripts/catalog-core.js','scripts/motion-core.js','scripts/experience.js','scripts/tools.js']
        files += [str(p.relative_to(R)).replace('\\','/') for p in (R/'assets').rglob('*') if p.is_file()]
        for name in files:
            with urllib.request.urlopen(url+urllib.parse.quote(name)+('?v=3.2.1' if name.endswith(('.css','.js')) else ''),timeout=3) as res:
                data=res.read();mime=res.headers.get('Content-Type')
                check('HTTP resource '+name,res.status==200 and data==(R/name).read_bytes(),mime)
                if name.endswith('.svg'):check('SVG MIME '+name,mime=='image/svg+xml')
        with urllib.request.urlopen(urllib.request.Request(url+'assets/icons/python.svg',method='HEAD'),timeout=2) as res:
            check('HEAD has no body',res.status==200 and res.read()==b'')
        with urllib.request.urlopen(urllib.request.Request(url+'styles.css',headers={'Range':'bytes=0-63'}),timeout=2) as res:
            check('byte-range response',res.status==206 and res.read()==(R/'styles.css').read_bytes()[:64])
        for name in ['assets/hefesto-distribuicao.mp4','assets/copa-resultados.jpg']:
            try:urllib.request.urlopen(url+name,timeout=2);status=200
            except urllib.error.HTTPError as error:status=error.code
            check('removed media is unavailable '+name,status==404)
        check('all remaining project references point to shipped assets',all((R/p[field]).is_file() for p in json.loads((R/'data/projects.json').read_text()) for field in ['image','thumbnail','preview']))
        for name in ['index.html','styles.css','script.js','scripts/tools.js']:
            check('build includes identical runtime '+name,(R/name).read_bytes()==(R/'dist'/name).read_bytes())
    finally:
        server.terminate();server.wait(timeout=5)
(O/'http-results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
print('HTTP CHECKS:',len(results),'PASS')
