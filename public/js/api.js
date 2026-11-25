
const API_URL = '/api';

async function requisicao(endpoint, opcoes = {}) {
  let resposta;

  try {
    resposta = await fetch(`${API_URL}${endpoint}`, {
      ...opcoes,
      headers: {
        'Content-Type': 'application/json',
        ...opcoes.headers,
      },
    });
  } catch {
    throw new Error(
      'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.'
    );
  }

  if (resposta.status === 204) {
    return null;
  }

  // Respostas que não são JSON (ex.: página de erro do servidor) não quebram a tela.
  const dados = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    throw new Error(dados.erro || 'Erro ao comunicar com o servidor.');
  }

  return dados;
}

const api = {
  listarCategorias() {
    return requisicao('/categorias');
  },

  buscarCategoria(id) {
    return requisicao(`/categorias/${id}`);
  },

  criarCategoria(dados) {
    return requisicao('/categorias', {
      method: 'POST',
      body: JSON.stringify(dados),
    });
  },

  atualizarCategoria(id, dados) {
    return requisicao(`/categorias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    });
  },

  excluirCategoria(id) {
    return requisicao(`/categorias/${id}`, {
      method: 'DELETE',
    });
  },

  listarPratos(categoriaId) {
    return requisicao(`/categorias/${categoriaId}/pratos`);
  },

  buscarPrato(id) {
    return requisicao(`/pratos/${id}`);
  },

  criarPrato(categoriaId, dados) {
    return requisicao(`/categorias/${categoriaId}/pratos`, {
      method: 'POST',
      body: JSON.stringify(dados),
    });
  },

  atualizarPrato(id, dados) {
    return requisicao(`/pratos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    });
  },

  excluirPrato(id) {
    return requisicao(`/pratos/${id}`, {
      method: 'DELETE',
    });
  },
};
