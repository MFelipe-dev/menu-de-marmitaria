const pratoRepository = require('../repositories/pratoRepository');
const categoriaService = require('./categoriaService');
const AppError = require('../errors/AppError');
const { validarId, validarTexto, validarPreco } = require('./validacoes');

function lerDados(dados) {
  return {
    nome: validarTexto(dados.nome, 'nome', 100, true),
    descricao: validarTexto(dados.descricao, 'descrição', 300) || null,
    preco: validarPreco(dados.preco),
    disponivel: dados.disponivel !== false,
  };
}

async function buscar(id) {
  const prato = await pratoRepository.buscarPorId(validarId(id));
  if (!prato) {
    throw new AppError('Prato não encontrado.', 404);
  }
  return prato;
}

async function listarPorCategoria(categoriaId) {
  const categoria = await categoriaService.buscar(categoriaId);
  return pratoRepository.listarPorCategoria(categoria.id);
}

async function criar(categoriaId, dados) {
  const categoria = await categoriaService.buscar(categoriaId);
  const prato = lerDados(dados);
  return pratoRepository.criar({ ...prato, categoriaId: categoria.id });
}

async function atualizar(id, dados) {
  const existente = await buscar(id);
  return pratoRepository.atualizar(existente.id, lerDados(dados));
}

async function excluir(id) {
  const existente = await buscar(id);
  await pratoRepository.excluir(existente.id);
}

module.exports = { buscar, listarPorCategoria, criar, atualizar, excluir };