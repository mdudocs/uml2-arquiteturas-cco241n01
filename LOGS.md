# Logs do fluxo principal

**Fluxo:** cadastrar um aluno e uma disciplina com 1 vaga, matricular o aluno, tentar matricular um segundo aluno (recusado por falta de vagas), lançar duas notas (8 e 5,5) e consultar o boletim (média 6,75, aprovado).

Os logs abaixo foram copiados do terminal onde o sistema foi iniciado com `npm start`, durante a execução de `npm run demo`. Cada linha segue o formato `[data] [CAMADA] ação` (RNF03) e mostra o caminho da requisição: APRESENTACAO → NEGOCIO → DADOS.

```
[2026-11-18T18:40:04.457Z] [NEGOCIO] Serviço de negócio ouvindo na porta 3001
[2026-11-18T18:40:04.457Z] [APRESENTACAO] Interface disponível em http://localhost:3000
[2026-11-18T18:40:04.502Z] [DADOS] Banco inicializado (data/academico.db)
[2026-11-18T18:40:04.511Z] [DADOS] Serviço de dados ouvindo na porta 3002
[2026-11-18T18:40:08.470Z] [APRESENTACAO] POST /api/alunos
[2026-11-18T18:40:08.471Z] [APRESENTACAO] -> NEGOCIO POST /alunos
[2026-11-18T18:40:08.629Z] [NEGOCIO] POST /alunos
[2026-11-18T18:40:08.638Z] [NEGOCIO] -> DADOS POST /alunos
[2026-11-18T18:40:08.775Z] [DADOS] POST /alunos
[2026-11-18T18:40:08.822Z] [NEGOCIO] Aluno cadastrado: Ana Souza (matrícula 2026208219)
[2026-11-18T18:40:08.859Z] [APRESENTACAO] POST /api/disciplinas
[2026-11-18T18:40:08.863Z] [APRESENTACAO] -> NEGOCIO POST /disciplinas
[2026-11-18T18:40:08.870Z] [NEGOCIO] POST /disciplinas
[2026-11-18T18:40:08.871Z] [NEGOCIO] -> DADOS POST /disciplinas
[2026-11-18T18:40:08.874Z] [DADOS] POST /disciplinas
[2026-11-18T18:40:08.904Z] [NEGOCIO] Disciplina cadastrada: CCO208219 - Analise e Projeto de Sistemas (1 vagas)
[2026-11-18T18:40:08.924Z] [APRESENTACAO] POST /api/matriculas
[2026-11-18T18:40:08.926Z] [APRESENTACAO] -> NEGOCIO POST /matriculas
[2026-11-18T18:40:08.939Z] [NEGOCIO] POST /matriculas
[2026-11-18T18:40:08.941Z] [NEGOCIO] -> DADOS GET /alunos/1
[2026-11-18T18:40:08.952Z] [DADOS] GET /alunos/1
[2026-11-18T18:40:08.957Z] [NEGOCIO] -> DADOS GET /disciplinas/CCO208219
[2026-11-18T18:40:08.973Z] [DADOS] GET /disciplinas/CCO208219
[2026-11-18T18:40:08.983Z] [NEGOCIO] -> DADOS GET /matriculas?disciplinaCodigo=CCO208219
[2026-11-18T18:40:08.991Z] [DADOS] GET /matriculas?disciplinaCodigo=CCO208219
[2026-11-18T18:40:09.004Z] [NEGOCIO] -> DADOS POST /matriculas
[2026-11-18T18:40:09.008Z] [DADOS] POST /matriculas
[2026-11-18T18:40:09.040Z] [NEGOCIO] Matrícula realizada: aluno 1 em CCO208219 (1/1 vagas)
[2026-11-18T18:40:09.076Z] [APRESENTACAO] POST /api/alunos
[2026-11-18T18:40:09.081Z] [APRESENTACAO] -> NEGOCIO POST /alunos
[2026-11-18T18:40:09.096Z] [NEGOCIO] POST /alunos
[2026-11-18T18:40:09.103Z] [NEGOCIO] -> DADOS POST /alunos
[2026-11-18T18:40:09.112Z] [DADOS] POST /alunos
[2026-11-18T18:40:09.150Z] [NEGOCIO] Aluno cadastrado: Beto Lima (matrícula 2027208219)
[2026-11-18T18:40:09.172Z] [APRESENTACAO] POST /api/matriculas
[2026-11-18T18:40:09.174Z] [APRESENTACAO] -> NEGOCIO POST /matriculas
[2026-11-18T18:40:09.187Z] [NEGOCIO] POST /matriculas
[2026-11-18T18:40:09.190Z] [NEGOCIO] -> DADOS GET /alunos/2
[2026-11-18T18:40:09.193Z] [DADOS] GET /alunos/2
[2026-11-18T18:40:09.203Z] [NEGOCIO] -> DADOS GET /disciplinas/CCO208219
[2026-11-18T18:40:09.208Z] [DADOS] GET /disciplinas/CCO208219
[2026-11-18T18:40:09.219Z] [NEGOCIO] -> DADOS GET /matriculas?disciplinaCodigo=CCO208219
[2026-11-18T18:40:09.224Z] [DADOS] GET /matriculas?disciplinaCodigo=CCO208219
[2026-11-18T18:40:09.237Z] [NEGOCIO] Matrícula recusada: CCO208219 sem vagas (1/1)
[2026-11-18T18:40:09.240Z] [NEGOCIO] Erro 409: Disciplina sem vagas disponíveis
[2026-11-18T18:40:09.265Z] [APRESENTACAO] POST /api/notas
[2026-11-18T18:40:09.266Z] [APRESENTACAO] -> NEGOCIO POST /notas
[2026-11-18T18:40:09.269Z] [NEGOCIO] POST /notas
[2026-11-18T18:40:09.271Z] [NEGOCIO] -> DADOS GET /matriculas?alunoId=1&disciplinaCodigo=CCO208219
[2026-11-18T18:40:09.273Z] [DADOS] GET /matriculas?alunoId=1&disciplinaCodigo=CCO208219
[2026-11-18T18:40:09.274Z] [NEGOCIO] -> DADOS POST /notas
[2026-11-18T18:40:09.281Z] [DADOS] POST /notas
[2026-11-18T18:40:09.295Z] [NEGOCIO] Nota lançada: aluno 1, CCO208219, nota 8
[2026-11-18T18:40:09.299Z] [APRESENTACAO] POST /api/notas
[2026-11-18T18:40:09.300Z] [APRESENTACAO] -> NEGOCIO POST /notas
[2026-11-18T18:40:09.303Z] [NEGOCIO] POST /notas
[2026-11-18T18:40:09.303Z] [NEGOCIO] -> DADOS GET /matriculas?alunoId=1&disciplinaCodigo=CCO208219
[2026-11-18T18:40:09.305Z] [DADOS] GET /matriculas?alunoId=1&disciplinaCodigo=CCO208219
[2026-11-18T18:40:09.305Z] [NEGOCIO] -> DADOS POST /notas
[2026-11-18T18:40:09.307Z] [DADOS] POST /notas
[2026-11-18T18:40:09.316Z] [NEGOCIO] Nota lançada: aluno 1, CCO208219, nota 5.5
[2026-11-18T18:40:09.320Z] [APRESENTACAO] GET /api/alunos/1/boletim
[2026-11-18T18:40:09.320Z] [APRESENTACAO] -> NEGOCIO GET /alunos/1/boletim
[2026-11-18T18:40:09.321Z] [NEGOCIO] GET /alunos/1/boletim
[2026-11-18T18:40:09.321Z] [NEGOCIO] -> DADOS GET /alunos/1
[2026-11-18T18:40:09.323Z] [DADOS] GET /alunos/1
[2026-11-18T18:40:09.323Z] [NEGOCIO] -> DADOS GET /matriculas?alunoId=1
[2026-11-18T18:40:09.324Z] [DADOS] GET /matriculas?alunoId=1
[2026-11-18T18:40:09.326Z] [NEGOCIO] -> DADOS GET /disciplinas/CCO208219
[2026-11-18T18:40:09.327Z] [NEGOCIO] -> DADOS GET /notas?matriculaId=1
[2026-11-18T18:40:09.328Z] [DADOS] GET /disciplinas/CCO208219
[2026-11-18T18:40:09.330Z] [DADOS] GET /notas?matriculaId=1
[2026-11-18T18:40:09.331Z] [NEGOCIO] Boletim consultado: aluno 1 (1 disciplinas)
```
