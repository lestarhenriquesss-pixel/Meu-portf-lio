/** Local preview only. No dependencies, no upload endpoints, loopback binding. */
import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT || 4177);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('PORT deve ser um inteiro entre 1024 e 65535.');
const mime = { '.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.mp4':'video/mp4','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8' };
const server = http.createServer(async (request, response) => {
  if (!['GET','HEAD'].includes(request.method)) { response.writeHead(405, { Allow:'GET, HEAD' }); response.end(); return; }
  try {
    const pathname = decodeURIComponent(new URL(request.url,'http://127.0.0.1').pathname);
    const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root + path.sep) || pathname.includes('\\') || pathname.split('/').some(part => part.startsWith('.'))) { response.writeHead(403); response.end('Acesso não permitido.'); return; }
    const info = await stat(file);
    if (!info.isFile()) { response.writeHead(404); response.end('Arquivo não encontrado.'); return; }
    const headers = { 'Content-Type': mime[path.extname(file).toLowerCase()] || 'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff' };
    let start = 0, end = info.size - 1, status = 200;
    if (request.headers.range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(request.headers.range);
      if (!match || (!match[1] && !match[2])) { response.writeHead(416,{'Content-Range':`bytes */${info.size}`}); response.end(); return; }
      if (!match[1]) start = Math.max(0, info.size - Number(match[2]));
      else { start = Number(match[1]); if (match[2]) end = Math.min(Number(match[2]), end); }
      if (start > end || start >= info.size) { response.writeHead(416,{'Content-Range':`bytes */${info.size}`}); response.end(); return; }
      headers['Content-Range'] = `bytes ${start}-${end}/${info.size}`; status = 206;
    }
    headers['Content-Length'] = Math.max(0, end - start + 1);
    response.writeHead(status, headers);
    if (request.method === 'HEAD' || info.size === 0) { response.end(); return; }
    const stream = createReadStream(file, { start, end });
    stream.on('error', () => response.destroy());
    response.on('close', () => stream.destroy());
    stream.pipe(response);
  } catch (error) {
    if (!response.headersSent) response.writeHead(error.code === 'ENOENT' ? 404 : 400);
    response.end('Arquivo não encontrado ou caminho inválido.');
  }
});
server.on('error', error => { console.error(error.code === 'EADDRINUSE' ? `A porta ${port} está ocupada. Feche o outro servidor ou defina PORT.` : error.message); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => {
  const url = `http://127.0.0.1:${port}/`;
  console.log(`\n  Portfólio Lestar Henriques · Premium Escuro v3.2.1\n  ${url}\n\n  Pressione Ctrl+C para encerrar.\n`);
  if (process.argv.includes('--open')) {
    let child;
    if (process.platform === 'win32') child = spawn('cmd.exe',['/c','start','',url],{stdio:'ignore'});
    else child = spawn(process.platform === 'darwin' ? 'open' : 'xdg-open',[url],{stdio:'ignore'});
    child.on('error',()=>console.log(`Abra ${url} no navegador.`));
  }
});
