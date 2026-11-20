
async function carregarCategorias() {
  const container = document.getElementById('lista-categorias');

  if (!container) return;

  try {
    const categorias = await api.listarCategorias();

    container.innerHTML = '';

    if (categorias.length === 0) {
      container.textContent = 'Nenhuma categoria cadastrada.';
      return;
    }

    categorias.forEach((categoria) => {
      const card = document.createElement('article');
      card.className = 'card-categoria';

      const titulo = document.createElement('h3');
      titulo.textContent = categoria.nome;

      const descricao = document.createElement('p');
      descricao.textContent =
        categoria.descricao || 'Confira nossos pratos.';

      const botao = document.createElement('a');
      botao.href = `pratos.html?categoria=${categoria.id}`;
      botao.className = 'botao';
      botao.textContent = 'Ver pratos';

      card.append(titulo, descricao, botao);
      container.appendChild(card);
    });

  } catch (erro) {
    container.textContent = 'Não foi possível carregar as categorias.';
    mostrarErro(erro);
  }
}

document.addEventListener('DOMContentLoaded', carregarCategorias);

