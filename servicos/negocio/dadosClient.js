// Cliente HTTP da camada de dados. A camada de negócio só acessa dados por aqui.
const { log } = require('./logger');

const DADOS_URL = process.env.DADOS_URL || 'http://localhost:3002';

class ErroNegocio extends Error {
  constructor(status, mensagem) {
    super(mensagem);
    this.status = status;
  }
}

async function chamar(metodo, caminho, corpo) {
  log(`-> DADOS ${metodo} ${caminho}`);
  let resp;
  try {
    resp = await fetch(DADOS_URL + caminho, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
  } catch {
    throw new ErroNegocio(503, 'Camada de dados indisponível');
  }
  const json = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new ErroNegocio(resp.status, json.erro || 'Erro na camada de dados');
  return json;
}

module.exports = {
  ErroNegocio,
  get: (caminho) => chamar('GET', caminho),
  post: (caminho, corpo) => chamar('POST', caminho, corpo),
};
