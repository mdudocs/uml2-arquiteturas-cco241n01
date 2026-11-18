// Log no formato: [data] [CAMADA] ação  (RNF03)
const CAMADA = 'NEGOCIO';

function log(acao) {
  console.log(`[${new Date().toISOString()}] [${CAMADA}] ${acao}`);
}

module.exports = { log };
