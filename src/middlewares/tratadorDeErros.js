const AppError = require('../errors/AppError');

const CODIGO_VIOLACAO_UNICIDADE = '23505';
const CODIGO_VIOLACAO_CHAVE_ESTRANGEIRA = '23503';

function traduzirErroDoBanco(erro) {
  if (erro.code === CODIGO_VIOLACAO_UNICIDADE) {
    return new AppError('Já existe uma categoria com esse nome.', 409);
  }
  if (erro.code === CODIGO_VIOLACAO_CHAVE_ESTRANGEIRA) {
    return new AppError('Operação não permitida: existem registros relacionados.', 409);
  }
  return null;
}

function erroDeJsonInvalido(erro) {
  return erro.type === 'entity.parse.failed';
}

function tratadorDeErros(erro, req, res, next) {
  if (erroDeJsonInvalido(erro)) {
    return res.status(400).json({ erro: 'JSON inválido na requisição.' });
  }

  const erroConhecido = erro instanceof AppError ? erro : traduzirErroDoBanco(erro);
  if (erroConhecido) {
    return res.status(erroConhecido.status).json({ erro: erroConhecido.message });
  }

  console.error(erro);
  return res.status(500).json({ erro: 'Erro interno do servidor.' });
}

module.exports = tratadorDeErros;