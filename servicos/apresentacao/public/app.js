// Interface: só fala com /api/* (camada de negócio), nunca com o banco.
const $ = (id) => document.getElementById(id);

async function api(metodo, caminho, corpo) {
  const resp = await fetch('/api' + caminho, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: corpo ? JSON.stringify(corpo) : undefined,
  });
  const json = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(json.erro || 'Erro inesperado');
  return json;
}

function aviso(texto, tipo) {
  const el = $('aviso');
  el.textContent = texto;
  el.className = tipo;
  el.hidden = false;
  clearTimeout(aviso.t);
  aviso.t = setTimeout(() => (el.hidden = true), 5000);
}

// Monta linhas de tabela com textContent (evita injeção de HTML)
function preencherTabela(tbody, linhas) {
  tbody.replaceChildren(
    ...linhas.map((cols) => {
      const tr = document.createElement('tr');
      cols.forEach((c) => {
        const td = document.createElement('td');
        td.textContent = c;
        tr.appendChild(td);
      });
      return tr;
    })
  );
}

function preencherSelect(select, itens, valor, rotulo, vazio) {
  const opcoes = itens.map((i) => new Option(rotulo(i), valor(i)));
  select.replaceChildren(new Option(vazio, ''), ...opcoes);
}

async function atualizar() {
  const [alunos, disciplinas] = await Promise.all([api('GET', '/alunos'), api('GET', '/disciplinas')]);

  preencherTabela($('lista-alunos'), alunos.map((a) => [a.id, a.nome, a.matricula, a.email]));
  preencherTabela(
    $('lista-disciplinas'),
    disciplinas.map((d) => [d.codigo, d.nome, d.professor, `${d.vagasDisponiveis} de ${d.vagas}`])
  );

  document.querySelectorAll('select[name=alunoId]').forEach((s) =>
    preencherSelect(s, alunos, (a) => a.id, (a) => `${a.nome} (${a.matricula})`, 'Selecione o aluno')
  );
  document.querySelectorAll('select[name=disciplinaCodigo]').forEach((s) =>
    preencherSelect(s, disciplinas, (d) => d.codigo, (d) => `${d.codigo} - ${d.nome}`, 'Selecione a disciplina')
  );
}

function dadosDoForm(form) {
  return Object.fromEntries(new FormData(form));
}

// Cada formulário: monta o corpo, chama a API, mostra o resultado e atualiza as listas
function ligar(id, acao) {
  $(id).addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const msg = await acao(dadosDoForm(e.target));
      if (msg) aviso(msg, 'ok');
      if (id !== 'form-boletim') e.target.reset();
      await atualizar();
    } catch (err) {
      aviso(err.message, 'erro');
    }
  });
}

ligar('form-aluno', async (d) => {
  await api('POST', '/alunos', d);
  return 'Aluno cadastrado com sucesso';
});

ligar('form-disciplina', async (d) => {
  await api('POST', '/disciplinas', { ...d, vagas: Number(d.vagas) });
  return 'Disciplina cadastrada com sucesso';
});

ligar('form-matricula', async (d) => {
  await api('POST', '/matriculas', { ...d, alunoId: Number(d.alunoId) });
  return 'Matrícula realizada com sucesso';
});

ligar('form-nota', async (d) => {
  await api('POST', '/notas', { ...d, alunoId: Number(d.alunoId), valor: Number(d.valor) });
  return 'Nota lançada com sucesso';
});

ligar('form-boletim', async (d) => {
  const { aluno, disciplinas } = await api('GET', `/alunos/${d.alunoId}/boletim`);
  const box = $('boletim');
  const titulo = document.createElement('h3');
  titulo.textContent = `${aluno.nome} - matrícula ${aluno.matricula}`;

  if (disciplinas.length === 0) {
    const p = document.createElement('p');
    p.textContent = 'Aluno sem disciplinas matriculadas.';
    box.replaceChildren(titulo, p);
    return;
  }

  const tabela = document.createElement('table');
  tabela.innerHTML = '<thead><tr><th>Disciplina</th><th>Notas</th><th>Média</th><th>Situação</th></tr></thead><tbody></tbody>';
  preencherTabela(
    tabela.tBodies[0],
    disciplinas.map((x) => [
      `${x.codigo} - ${x.nome}`,
      x.notas.join(', ') || '-',
      x.media === null ? '-' : x.media.toFixed(2),
      x.situacao,
    ])
  );
  tabela.tBodies[0].querySelectorAll('tr').forEach((tr, i) => {
    const s = disciplinas[i].situacao;
    if (s === 'Aprovado') tr.lastChild.className = 'aprovado';
    if (s === 'Reprovado') tr.lastChild.className = 'reprovado';
  });
  box.replaceChildren(titulo, tabela);
});

atualizar().catch((err) => aviso(err.message, 'erro'));
