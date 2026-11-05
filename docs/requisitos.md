# Requisitos

## Requisitos funcionais

| ID | Requisito |
| --- | --- |
| RF01 | Cadastrar alunos (nome, matrícula, e-mail). |
| RF02 | Cadastrar disciplinas (código, nome, professor, vagas). |
| RF03 | Matricular um aluno em uma disciplina, respeitando o limite de vagas. |
| RF04 | Lançar notas de um aluno numa disciplina.|
| RF05 | Consultar o boletim do aluno, com notas, média e situação (aprovado/reprovado). |

## Requisitos não funcionais

| ID | Requisito |
| --- | --- |
| RNF01 | Arquitetura em 3 camadas (apresentação, negócio e dados), sem acesso direto da interface ao banco. |
| RNF02 | O sistema sobe com um único comando (docker compose up). |
| RNF03 | Toda operação registra logs no terminal (data, camada e ação).|
