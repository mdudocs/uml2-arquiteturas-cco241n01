const http = require('node:http');
const db = require('./db');
const { log } = require('./logger');

const PORT = process.env.PORT || 3002;

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
      catch { reject(new Error('JSON inválido')); }
    });
  });
}

// Traduz erros do SQLite em respostas HTTP
function tratarErro(res, e) {
  const msg = String(e.message);
  if (msg.includes('UNIQUE')) return enviar(res, 409, { erro: 'Registro já existe' });
  if (msg.includes('FOREIGN KEY')) return enviar(res, 404, { erro: 'Referência inexistente' });
  if (msg.includes('CHECK') || msg.includes('NOT NULL') || msg.includes('JSON'))
    return enviar(res, 400, { erro: 'Dados inválidos' });
  log(`ERRO: ${msg}`);
  return enviar(res, 500, { erro: 'Erro interno' });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const [recurso, id] = url.pathname.split('/').filter(Boolean);
  log(`${req.method} ${url.pathname}${url.search}`);

  try {
    if (recurso === 'health') return enviar(res, 200, { status: 'ok' });

    if (recurso === 'alunos') {
      if (req.method === 'POST') return enviar(res, 201, db.alunos.criar(await lerCorpo(req)));
      if (req.method === 'GET' && id) {
        const a = db.alunos.buscar(Number(id));
        return a ? enviar(res, 200, a) : enviar(res, 404, { erro: 'Aluno não encontrado' });
      }
      if (req.method === 'GET') return enviar(res, 200, db.alunos.listar());
    }

    if (recurso === 'disciplinas') {
      if (req.method === 'POST') return enviar(res, 201, db.disciplinas.criar(await lerCorpo(req)));
      if (req.method === 'GET' && id) {
        const d = db.disciplinas.buscar(id);
        return d ? enviar(res, 200, d) : enviar(res, 404, { erro: 'Disciplina não encontrada' });
      }
      if (req.method === 'GET') return enviar(res, 200, db.disciplinas.listar());
    }

    if (recurso === 'matriculas') {
      if (req.method === 'POST') return enviar(res, 201, db.matriculas.criar(await lerCorpo(req)));
      if (req.method === 'GET') {
        const q = url.searchParams;
        return enviar(res, 200, db.matriculas.listar({
          alunoId: q.get('alunoId') ? Number(q.get('alunoId')) : undefined,
          disciplinaCodigo: q.get('disciplinaCodigo') || undefined,
        }));
      }
    }

    if (recurso === 'notas') {
      if (req.method === 'POST') return enviar(res, 201, db.notas.criar(await lerCorpo(req)));
      if (req.method === 'GET') {
        const m = Number(url.searchParams.get('matriculaId'));
        return enviar(res, 200, db.notas.listarPorMatricula(m));
      }
    }

    enviar(res, 404, { erro: 'Rota não encontrada' });
  } catch (e) {
    tratarErro(res, e);
  }
});

server.listen(PORT, () => log(`Serviço de dados ouvindo na porta ${PORT}`));
