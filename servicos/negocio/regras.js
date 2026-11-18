// Regras de negócio do sistema acadêmico.
const dados = require('./dadosClient');
const { ErroNegocio } = dados;
const { log } = require('./logger');

const MEDIA_APROVACAO = 6;

const textoValido = (v) => typeof v === 'string' && v.trim().length > 0;

// RF01
async function cadastrarAluno({ nome, matricula, email }) {
  if (!textoValido(nome) || !textoValido(matricula) || !textoValido(email))
    throw new ErroNegocio(400, 'Nome, matrícula e e-mail são obrigatórios');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new ErroNegocio(400, 'E-mail inválido');
  const aluno = await dados.post('/alunos', {
    nome: nome.trim(), matricula: matricula.trim(), email: email.trim(),
  });
  log(`Aluno cadastrado: ${aluno.nome} (matrícula ${aluno.matricula})`);
  return aluno;
}

const listarAlunos = () => dados.get('/alunos');

// RF02
async function cadastrarDisciplina({ codigo, nome, professor, vagas }) {
  if (!textoValido(codigo) || !textoValido(nome) || !textoValido(professor))
    throw new ErroNegocio(400, 'Código, nome e professor são obrigatórios');
  if (!Number.isInteger(vagas) || vagas < 1)
    throw new ErroNegocio(400, 'Vagas deve ser um número inteiro maior que zero');
  const d = await dados.post('/disciplinas', {
    codigo: codigo.trim(), nome: nome.trim(), professor: professor.trim(), vagas,
  });
  log(`Disciplina cadastrada: ${d.codigo} - ${d.nome} (${d.vagas} vagas)`);
  return d;
}

// Lista disciplinas já com as vagas restantes
async function listarDisciplinas() {
  const lista = await dados.get('/disciplinas');
  return Promise.all(
    lista.map(async (d) => {
      const m = await dados.get(`/matriculas?disciplinaCodigo=${encodeURIComponent(d.codigo)}`);
      return { ...d, vagasDisponiveis: d.vagas - m.length };
    })
  );
}

// RF03 - respeita o limite de vagas
async function matricular({ alunoId, disciplinaCodigo }) {
  if (!Number.isInteger(alunoId) || !textoValido(disciplinaCodigo))
    throw new ErroNegocio(400, 'alunoId e disciplinaCodigo são obrigatórios');
  await dados.get(`/alunos/${alunoId}`);
  const disciplina = await dados.get(`/disciplinas/${encodeURIComponent(disciplinaCodigo)}`);
  const matriculas = await dados.get(`/matriculas?disciplinaCodigo=${encodeURIComponent(disciplinaCodigo)}`);
  if (matriculas.some((m) => m.aluno_id === alunoId))
    throw new ErroNegocio(409, 'Aluno já matriculado nesta disciplina');
  if (matriculas.length >= disciplina.vagas) {
    log(`Matrícula recusada: ${disciplinaCodigo} sem vagas (${matriculas.length}/${disciplina.vagas})`);
    throw new ErroNegocio(409, 'Disciplina sem vagas disponíveis');
  }
  const m = await dados.post('/matriculas', { alunoId, disciplinaCodigo });
  log(`Matrícula realizada: aluno ${alunoId} em ${disciplinaCodigo} (${matriculas.length + 1}/${disciplina.vagas} vagas)`);
  return m;
}

async function buscarMatricula(alunoId, disciplinaCodigo) {
  const lista = await dados.get(
    `/matriculas?alunoId=${alunoId}&disciplinaCodigo=${encodeURIComponent(disciplinaCodigo)}`
  );
  if (lista.length === 0) throw new ErroNegocio(404, 'Aluno não está matriculado nesta disciplina');
  return lista[0];
}

// RF04
async function lancarNota({ alunoId, disciplinaCodigo, valor }) {
  if (!Number.isInteger(alunoId) || !textoValido(disciplinaCodigo))
    throw new ErroNegocio(400, 'alunoId e disciplinaCodigo são obrigatórios');
  if (typeof valor !== 'number' || Number.isNaN(valor) || valor < 0 || valor > 10)
    throw new ErroNegocio(400, 'A nota deve ser um número entre 0 e 10');
  const matricula = await buscarMatricula(alunoId, disciplinaCodigo);
  const nota = await dados.post('/notas', { matriculaId: matricula.id, valor });
  log(`Nota lançada: aluno ${alunoId}, ${disciplinaCodigo}, nota ${valor}`);
  return nota;
}

// RF05 - média aritmética; aprovado se média >= 6
async function boletim(alunoId) {
  const aluno = await dados.get(`/alunos/${alunoId}`);
  const matriculas = await dados.get(`/matriculas?alunoId=${alunoId}`);
  const disciplinas = await Promise.all(
    matriculas.map(async (m) => {
      const [disc, notas] = await Promise.all([
        dados.get(`/disciplinas/${encodeURIComponent(m.disciplina_codigo)}`),
        dados.get(`/notas?matriculaId=${m.id}`),
      ]);
      const valores = notas.map((n) => n.valor);
      const media = valores.length
        ? Math.round((valores.reduce((a, b) => a + b, 0) / valores.length) * 100) / 100
        : null;
      const situacao = media === null ? 'Sem notas' : media >= MEDIA_APROVACAO ? 'Aprovado' : 'Reprovado';
      return { codigo: disc.codigo, nome: disc.nome, notas: valores, media, situacao };
    })
  );
  log(`Boletim consultado: aluno ${alunoId} (${disciplinas.length} disciplinas)`);
  return { aluno, disciplinas };
}

module.exports = {
  cadastrarAluno, listarAlunos, cadastrarDisciplina, listarDisciplinas,
  matricular, lancarNota, boletim,
};
