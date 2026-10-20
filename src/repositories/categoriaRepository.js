const { query } = require('../database');

const COLUNAS = 'id, nome, descricao';

async function listar() {
  const { rows } = await query(`SELECT ${COLUNAS} FROM categorias ORDER BY nome`);
  return rows;
}

async function buscarPorId(id) {
  const { rows } = await query(`SELECT ${COLUNAS} FROM categorias WHERE id = $1`, [id]);
  return rows[0] || null;
}

// ignora a Id pra que seja permitido editar categorias sem conflitar com elas mesmas
async function buscarPorNome(nome, ignorarId = null) {
  const { rows } = await query(
    `SELECT ${COLUNAS} FROM categorias
     WHERE LOWER(nome) = LOWER($1) AND ($2::int IS NULL OR id <> $2)`,
    [nome, ignorarId]
  );
  return rows[0] || null;
}

async function criar({ nome, descricao }) {
  const { rows } = await query(
    `INSERT INTO categorias (nome, descricao) VALUES ($1, $2) RETURNING ${COLUNAS}`,
    [nome, descricao]
  );
  return rows[0];
}

async function atualizar(id, { nome, descricao }) {
  const { rows } = await query(
    `UPDATE categorias SET nome = $1, descricao = $2 WHERE id = $3 RETURNING ${COLUNAS}`,
    [nome, descricao, id]
  );
  return rows[0] || null;
}

async function excluir(id) {
  await query('DELETE FROM categorias WHERE id = $1', [id]);
}

module.exports = { listar, buscarPorId, buscarPorNome, criar, atualizar, excluir };