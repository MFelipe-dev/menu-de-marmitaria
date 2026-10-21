const AppError = require('../errors/AppError');

const PRECO_MAXIMO = 99999999.99;

function validarId(id) {
  const numero = Number(id);
  if (!Number.isInteger(numero) || numero <= 0) {
    throw new AppError('Identificador inválido.', 400);
  }
  return numero;
}

function validarTexto(valor, campo, tamanhoMaximo, obrigatorio = false) {
  const texto = String(valor ?? '').trim();
  if (obrigatorio && !texto) {
    throw new AppError(`O campo "${campo}" é obrigatório.`, 400);
  }
  if (texto.length > tamanhoMaximo) {
    throw new AppError(`O campo "${campo}" aceita no máximo ${tamanhoMaximo} caracteres.`, 400);
  }
  return texto;
}

function validarPreco(valor) {
  const texto = String(valor ?? '').trim().replace(',', '.');
  if (!texto) {
    throw new AppError('O preço é obrigatório.', 400);
  }
  const preco = Number(texto);
  if (!Number.isFinite(preco)) {
    throw new AppError('O preço deve ser um número.', 400);
  }
  if (preco <= 0) {
    throw new AppError('O preço deve ser maior que zero.', 400);
  }
  if (preco > PRECO_MAXIMO) {
    throw new AppError('O preço informado é alto demais.', 400);
  }
  return Math.round(preco * 100) / 100;
}

module.exports = { validarId, validarTexto, validarPreco };