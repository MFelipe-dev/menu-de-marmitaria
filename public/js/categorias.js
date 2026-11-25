
const listaCategorias = document.getElementById('lista-categorias');

function criarCardCategoria(categoria) {
  const card = criarElemento('article', 'card card-categoria');

  card.append(
    criarElemento('h3', null, categoria.nome),
    criarElemento('p', null, categoria.descricao || 'Confira nossos pratos.'),
    criarAcoes(
      criarLink('Ver pratos', `pratos.html?categoria=${categoria.id}`),
      criarLink('Editar', `categoria-form.html?id=${categoria.id}`, 'botao botao-pequeno botao-secundario'),
      criarBotao('Excluir', 'botao botao-pequeno botao-perigo', () => excluirCategoria(categoria))
    )
  );

  return card;
}

function excluirCategoria(categoria) {
  return confirmarExclusao({
    pergunta: `Deseja excluir a categoria "${categoria.nome}"?`,
    excluir: () => api.excluirCategoria(categoria.id),
    mensagemSucesso: `Categoria "${categoria.nome}" excluída com sucesso.`,
    aoConcluir: carregarCategorias,
  });
}

async function carregarCategorias() {
  try {
    const categorias = await api.listarCategorias();

    if (categorias.length === 0) {
      mostrarListaVazia(listaCategorias, 'Nenhuma categoria cadastrada ainda.');
      return;
    }

    listaCategorias.replaceChildren(...categorias.map(criarCardCategoria));

  } catch (erro) {
    mostrarListaVazia(listaCategorias, 'Não foi possível carregar as categorias.');
    mostrarErro(erro);
  }
}

document.addEventListener('DOMContentLoaded', carregarCategorias);
