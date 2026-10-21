const categoriaRepository = require('../repositories/categoriaRepository');
const pratoRepository = require('../repositories/pratoRepository');
const AppError = require('../errors/AppError');
const { validarId, validarTexto } = require('./validacoes');

function lerDados(dados) {
  return {
    nome: validarTexto(dados.nome, 'nome', 80, true),
    descricao: validarTexto(dados.descricao, 'descrição', 200) || null,
  };
}

async function validarNomeUnico(nome, ignorarId = null) {
  const existente = await categoriaRepository.buscarPorNome(nome, ignorarId);
  if (existente) {
    throw new AppError('Já existe uma categoria com esse nome.', 409);
  }
}

async function buscar(id) {
  const categoria = await categoriaRepository.buscarPorId(validarId(id));
  if (!categoria) {
    throw new AppError('Categoria não encontrada.', 404);
  }
  return categoria;
}

function listar() {
  return categoriaRepository.listar();
}

async function criar(dados) {
  const categoria = lerDados(dados);
  await validarNomeUnico(categoria.nome);
  return categoriaRepository.criar(categoria);
}

async function atualizar(id, dados) {
  const existente = await buscar(id);
  const categoria = lerDados(dados);
  await validarNomeUnico(categoria.nome, existente.id);
  return categoriaRepository.atualizar(existente.id, categoria);
}

async function excluir(id) {
  const existente = await buscar(id);
  const totalPratos = await pratoRepository.contarPorCategoria(existente.id);
  if (totalPratos > 0) {
    throw new AppError('Não é possível excluir: a categoria ainda possui pratos.', 409);
  }
  await categoriaRepository.excluir(existente.id);
}

module.exports = { listar, buscar, criar, atualizar, excluir };