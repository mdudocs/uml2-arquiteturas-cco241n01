const http = require('node:http');
const regras = require('./regras');
const { ErroNegocio } = require('./dadosClient');
const { log } = require('./logger');

const PORT = process.env.PORT || 3001;

function enviar(res, status, corpo) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(corpo));
}

function lerCorpo(req) {
  return new Promise((resolve, reject) => {
    let dados = '';
    req.on('data', (c) => (dados += c));
    req.on('end', () => {
      try { resolve(dados ? JSON.parse(dados) : {}); }
      catch { reject(new ErroNegocio(400, 'JSON inválido')); }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const partes = url.pathname.split('/').filter(Boolean);
  const [recurso, id, sub] = partes;
  log(`${req.method} ${url.pathname}`);

  try {
    if (recurso === 'health') return enviar(res, 200, { status: 'ok' });

    if (recurso === 'alunos') {
      if (req.method === 'POST' && !id)
        return enviar(res, 201, await regras.cadastrarAluno(await lerCorpo(req)));
      if (req.method === 'GET' && !id) return enviar(res, 200, await regras.listarAlunos());
      if (req.method === 'GET' && id && sub === 'boletim')
        return enviar(res, 200, await regras.boletim(Number(id)));
    }

    if (recurso === 'disciplinas' && !id) {
      if (req.method === 'POST')
        return enviar(res, 201, await regras.cadastrarDisciplina(await lerCorpo(req)));
      if (req.method === 'GET') return enviar(res, 200, await regras.listarDisciplinas());
    }

    if (recurso === 'matriculas' && req.method === 'POST')
      return enviar(res, 201, await regras.matricular(await lerCorpo(req)));

    if (recurso === 'notas' && req.method === 'POST')
      return enviar(res, 201, await regras.lancarNota(await lerCorpo(req)));

    enviar(res, 404, { erro: 'Rota não encontrada' });
  } catch (e) {
    if (e instanceof ErroNegocio) {
      log(`Erro ${e.status}: ${e.message}`);
      return enviar(res, e.status, { erro: e.message });
    }
    log(`ERRO: ${e.message}`);
    enviar(res, 500, { erro: 'Erro interno' });
  }
});

server.listen(PORT, () => log(`Serviço de negócio ouvindo na porta ${PORT}`));
