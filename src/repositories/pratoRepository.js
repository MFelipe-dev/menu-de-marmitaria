const { query } = require('../database');

// preco::float8 evita que o pg devolva NUMERIC como texto
const COLUNAS = 'id, nome, descricao, preco::float8 AS preco, disponivel, categoria_id AS "categoriaId"';

async function listarPorCategoria(categoriaId) {
  const { rows } = await query(
    `SELECT ${COLUNAS} FROM pratos WHERE categoria_id = $1 ORDER BY nome`,
    [categoriaId]
  );
  return rows;
}

async function buscarPorId(id) {
  const { rows } = await query(`SELECT ${COLUNAS} FROM pratos WHERE id = $1`, [id]);
  return rows[0] || null;
}

async function criar({ nome, descricao, preco, disponivel, categoriaId }) {
  const { rows } = await query(
    `INSERT INTO pratos (nome, descricao, preco, disponivel, categoria_id)
     VALUES ($1, $2, $3, $4, $5) RETURNING ${COLUNAS}`,
    [nome, descricao, preco, disponivel, categoriaId]
  );
  return rows[0];
}

async function atualizar(id, { nome, descricao, preco, disponivel }) {
  const { rows } = await query(
    `UPDATE pratos SET nome = $1, descricao = $2, preco = $3, disponivel = $4
     WHERE id = $5 RETURNING ${COLUNAS}`,
    [nome, descricao, preco, disponivel, id]
  );
  return rows[0] || null;
}

async function excluir(id) {
  await query('DELETE FROM pratos WHERE id = $1', [id]);
}

async function contarPorCategoria(categoriaId) {
  const { rows } = await query(
    'SELECT COUNT(*)::int AS total FROM pratos WHERE categoria_id = $1',
    [categoriaId]
  );
  return rows[0].total;
}

module.exports = { listarPorCategoria, buscarPorId, criar, atualizar, excluir, contarPorCategoria };