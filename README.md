# Trabalho de Análise e Projeto de Sistemas: Arquiteturas de Software

**Disciplina:** Análise e Projeto de Sistemas (Ciência da Computação)  
**Prazo:** 18/11/2026

## Equipe
**Nome do time:** Sistema acadêmico em arquitetura de Camadas (3-tier).
**Modelo escolhido:** 3

| Nome          | Usuário do GitHub |
| --- | --- |
| Maria Eduarda | mdudocs |
| Joao Pedroza | jpedrorosa85-hub |
| Lucas Dias | lucasrrafael |
 
## Hoje: dia de planejamento

1. Um integrante clica em **Fork** (canto superior direito) e depois em **Create fork**.
2. No fork, em **Settings → Collaborators → Add people**, adicione os colegas.
3. No fork, edite este README (lápis ✏️): nome do time, modelo escolhido e integrantes. Clique em **Commit changes**.
4. Dividam o trabalho e comecem os requisitos em `docs/requisitos.md`.

⚠️ Não editem o repositório do professor, só o fork da equipe.

## O que entregar

| Arquivo | Conteúdo |
| --- | --- |
| `README.md` | Equipe, modelo e **como rodar** o sistema (um comando) |
| `docs/requisitos.md` | 5 requisitos funcionais e 3 não funcionais |
| `docs/arquitetura.png` | Diagrama da arquitetura |
| `docs/sequencia.png` | Diagrama de sequência do fluxo principal |
| `LOGS.md` | Logs do fluxo principal, copiados do terminal |
| `docker-compose.yml` | Ou um script de execução descrito neste README |
| `servicos/` | Uma pasta por componente |

**Cada integrante deve ter pelo menos 3 commits** com mensagens claras.

## Como rodar

O sistema tem 3 camadas, cada uma em uma pasta de `servicos/`:

| Camada | Pasta | Porta | Função |
| --- | --- | --- | --- |
| Apresentação | `servicos/apresentacao` | 3000 | Interface web; repassa `/api/*` ao negócio |
| Negócio | `servicos/negocio` | 3001 | Regras (vagas, média, situação) |
| Dados | `servicos/dados` | 3002 | Banco SQLite e acesso aos dados |

A interface nunca acessa o banco: o fluxo é sempre apresentação → negócio → dados.

### Opção 1: Docker (recomendada)

```bash
docker compose up --build
```

### Opção 2: sem Docker (Node.js 22.5 ou superior)

```bash
npm start
```

Nas duas opções, abra **http://localhost:3000**. Para encerrar, use `Ctrl+C`.

### Executar o fluxo principal

Pela interface, siga as seções na ordem: cadastrar aluno, cadastrar disciplina, matricular, lançar nota e consultar o boletim.

Ou automaticamente, com o sistema já rodando, em outro terminal:

```bash
npm run demo
```

O fluxo executado cadastra aluno e disciplina, matricula, tenta matricular um segundo aluno sem vaga, lança duas notas e consulta o boletim. Os logs de cada camada (`[data] [CAMADA] ação`) aparecem no terminal onde o sistema foi iniciado.

Detalhes:
- Com `npm start`, o banco fica em `data/academico.db`. Com Docker, fica no volume `dados-db`. Em ambos os casos os dados persistem entre reinícios.
- Com Docker, só a apresentação (porta 3000) é exposta; negócio e dados ficam na rede interna.
- Aprovação: média aritmética das notas igual ou maior que 6.

## Entrega

No fork, clique em **Contribute → Open pull request**, preencha o modelo que aparece e clique em **Create pull request**. Um Pull Request por equipe. Cada novo `git push` no fork atualiza o mesmo Pull Request até o prazo.
