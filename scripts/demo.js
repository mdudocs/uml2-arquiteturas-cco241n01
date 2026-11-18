// Executa o fluxo principal contra o sistema já em execução (apresentação na porta 3000).
// Uso: npm run demo   (com o sistema rodando em outro terminal)
// Cadastra aluno e disciplina -> matricula -> lança notas -> consulta o boletim.
const BASE = process.env.BASE_URL || 'http://localhost:3000/api';
const sufixo = Date.now().toString().slice(-6); // evita conflito se rodar mais de uma vez

async function chamar(metodo, caminho, corpo) {
  const resp = await fetch(BASE + caminho, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: corpo ? JSON.stringify(corpo) : undefined,
  });
  const json = await resp.json();
  console.log(`\n>>> ${metodo} ${caminho} -> ${resp.status}`);
  console.log(JSON.stringify(json));
  return { status: resp.status, json };
}

(async () => {
  const aluno = await chamar('POST', '/alunos', {
    nome: 'Ana Souza', matricula: `2026${sufixo}`, email: 'ana@exemplo.com',
  });
  const codigo = `CCO${sufixo}`;
  await chamar('POST', '/disciplinas', { codigo, nome: 'Analise e Projeto de Sistemas', professor: 'Prof. Agnaldo', vagas: 1 });
  const id = aluno.json.id;
  await chamar('POST', '/matriculas', { alunoId: id, disciplinaCodigo: codigo });

  const outro = await chamar('POST', '/alunos', {
    nome: 'Beto Lima', matricula: `2027${sufixo}`, email: 'beto@exemplo.com',
  });
  await chamar('POST', '/matriculas', { alunoId: outro.json.id, disciplinaCodigo: codigo }); // esperado: sem vagas

  await chamar('POST', '/notas', { alunoId: id, disciplinaCodigo: codigo, valor: 8 });
  await chamar('POST', '/notas', { alunoId: id, disciplinaCodigo: codigo, valor: 5.5 });
  await chamar('GET', `/alunos/${id}/boletim`);
})().catch((e) => {
  console.error('Falha ao executar o fluxo. O sistema está rodando? (npm start)', e.message);
  process.exit(1);
});
