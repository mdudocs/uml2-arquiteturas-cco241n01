const { DatabaseSync } = require('node:sqlite');
const { log } = require('./logger');

const DB_PATH = process.env.DB_PATH || ':memory:';
const db = new DatabaseSync(DB_PATH);

db.exec(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS alunos (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    nome      TEXT NOT NULL,
    matricula TEXT NOT NULL UNIQUE,
    email     TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS disciplinas (
    codigo    TEXT PRIMARY KEY,
    nome      TEXT NOT NULL,
    professor TEXT NOT NULL,
    vagas     INTEGER NOT NULL CHECK (vagas >= 0)
  );

  CREATE TABLE IF NOT EXISTS matriculas (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    aluno_id          INTEGER NOT NULL REFERENCES alunos(id),
    disciplina_codigo TEXT NOT NULL REFERENCES disciplinas(codigo),
    UNIQUE (aluno_id, disciplina_codigo)
  );

  CREATE TABLE IF NOT EXISTS notas (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    matricula_id INTEGER NOT NULL REFERENCES matriculas(id),
    valor        REAL NOT NULL CHECK (valor >= 0 AND valor <= 10)
  );
`);
log(`Banco inicializado (${DB_PATH})`);

// ---- Alunos ----
const alunos = {
  criar({ nome, matricula, email }) {
    const r = db
      .prepare('INSERT INTO alunos (nome, matricula, email) VALUES (?, ?, ?)')
      .run(nome, matricula, email);
    return alunos.buscar(Number(r.lastInsertRowid));
  },
  listar: () => db.prepare('SELECT * FROM alunos ORDER BY id').all(),
  buscar: (id) => db.prepare('SELECT * FROM alunos WHERE id = ?').get(id),
};

// ---- Disciplinas ----
const disciplinas = {
  criar({ codigo, nome, professor, vagas }) {
    db.prepare(
      'INSERT INTO disciplinas (codigo, nome, professor, vagas) VALUES (?, ?, ?, ?)'
    ).run(codigo, nome, professor, vagas);
    return disciplinas.buscar(codigo);
  },
  listar: () => db.prepare('SELECT * FROM disciplinas ORDER BY codigo').all(),
  buscar: (codigo) =>
    db.prepare('SELECT * FROM disciplinas WHERE codigo = ?').get(codigo),
};

// ---- Matrículas ----
const matriculas = {
  criar({ alunoId, disciplinaCodigo }) {
    const r = db
      .prepare('INSERT INTO matriculas (aluno_id, disciplina_codigo) VALUES (?, ?)')
      .run(alunoId, disciplinaCodigo);
    return matriculas.buscar(Number(r.lastInsertRowid));
  },
  buscar: (id) => db.prepare('SELECT * FROM matriculas WHERE id = ?').get(id),
  listar({ alunoId, disciplinaCodigo } = {}) {
    let sql = 'SELECT * FROM matriculas WHERE 1=1';
    const params = [];
    if (alunoId) { sql += ' AND aluno_id = ?'; params.push(alunoId); }
    if (disciplinaCodigo) { sql += ' AND disciplina_codigo = ?'; params.push(disciplinaCodigo); }
    return db.prepare(sql + ' ORDER BY id').all(...params);
  },
};

// ---- Notas ----
const notas = {
  criar({ matriculaId, valor }) {
    const r = db
      .prepare('INSERT INTO notas (matricula_id, valor) VALUES (?, ?)')
      .run(matriculaId, valor);
    return db.prepare('SELECT * FROM notas WHERE id = ?').get(Number(r.lastInsertRowid));
  },
  listarPorMatricula: (matriculaId) =>
    db.prepare('SELECT * FROM notas WHERE matricula_id = ? ORDER BY id').all(matriculaId),
};

module.exports = { alunos, disciplinas, matriculas, notas };
