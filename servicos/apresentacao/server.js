// Camada de apresentação: serve a interface web e repassa /api/* para a camada de negócio.
// Não conhece o banco de dados nem a camada de dados (RNF01).
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { log } = require('./logger');

const PORT = process.env.PORT || 3000;
const NEGOCIO_URL = process.env.NEGOCIO_URL || 'http://localhost:3001';
const PUBLIC_DIR = path.join(__dirname, 'public');

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
};

function lerCorpo(req) {
  return new Promise((resolve) => {
    const partes = [];
    req.on('data', (c) => partes.push(c));
    req.on('end', () => resolve(Buffer.concat(partes)));
  });
}

async function repassar(req, res, url) {
  const destino = NEGOCIO_URL + url.pathname.replace(/^\/api/, '') + url.search;
  log(`-> NEGOCIO ${req.method} ${destino.replace(NEGOCIO_URL, '')}`);
  try {
    const corpo = ['GET', 'HEAD'].includes(req.method) ? undefined : await lerCorpo(req);
    const resp = await fetch(destino, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
      body: corpo,
    });
    res.writeHead(resp.status, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(await resp.text());
  } catch {
    log('Camada de negócio indisponível');
    res.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ erro: 'Camada de negócio indisponível' }));
  }
}

function servirArquivo(res, url) {
  const nome = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
  const arquivo = path.join(PUBLIC_DIR, path.normalize(nome));
  if (!arquivo.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Acesso negado');
  }
  fs.readFile(arquivo, (err, conteudo) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Não encontrado');
    }
    res.writeHead(200, { 'Content-Type': TIPOS[path.extname(arquivo)] || 'application/octet-stream' });
    res.end(conteudo);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'ok' }));
  }
  if (url.pathname.startsWith('/api/')) {
    log(`${req.method} ${url.pathname}`);
    return repassar(req, res, url);
  }
  servirArquivo(res, url);
});

server.listen(PORT, () => log(`Interface disponível em http://localhost:${PORT}`));
