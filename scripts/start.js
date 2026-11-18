// Alternativa ao Docker: sobe as 3 camadas com um único comando (npm start).
// Cada camada roda como um processo separado, igual aos containers.
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const raiz = path.join(__dirname, '..');
const dirDados = path.join(raiz, 'data');
fs.mkdirSync(dirDados, { recursive: true });

const camadas = [
  {
    nome: 'dados',
    args: ['--disable-warning=ExperimentalWarning', 'server.js'],
    env: { PORT: '3002', DB_PATH: path.join(dirDados, 'academico.db') },
  },
  { nome: 'negocio', args: ['server.js'], env: { PORT: '3001', DADOS_URL: 'http://localhost:3002' } },
  { nome: 'apresentacao', args: ['server.js'], env: { PORT: '3000', NEGOCIO_URL: 'http://localhost:3001' } },
];

const processos = camadas.map((c) =>
  spawn(process.execPath, c.args, {
    cwd: path.join(raiz, 'servicos', c.nome),
    env: { ...process.env, ...c.env },
    stdio: 'inherit',
  })
);

let encerrando = false;
function encerrar(codigo = 0) {
  if (encerrando) return;
  encerrando = true;
  processos.forEach((p) => p.kill());
  setTimeout(() => process.exit(codigo), 200);
}

processos.forEach((p, i) =>
  p.on('exit', (code) => {
    if (!encerrando) {
      console.error(`Camada ${camadas[i].nome} encerrou (código ${code}). Encerrando o sistema.`);
      encerrar(1);
    }
  })
);
process.on('SIGINT', () => encerrar(0));
process.on('SIGTERM', () => encerrar(0));
