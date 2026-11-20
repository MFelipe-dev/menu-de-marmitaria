
async function carregarPratos() {
  const parametros = new URLSearchParams(window.location.search);
  const categoriaId = parametros.get('categoria');

  const container = document.getElementById('lista-pratos');
  const titulo = document.getElementById('titulo-categoria');

  if (!categoriaId || !/^[1-9]\d*$/.test(categoriaId)) {
    container.textContent = 'Categoria inválida.';
    return;
  }

  try {
    const [categoria, pratos] = await Promise.all([
      api.buscarCategoria(categoriaId),
      api.listarPratos(categoriaId)
    ]);

    titulo.textContent = categoria.nome;
    container.innerHTML = '';

    if (pratos.length === 0) {
      container.textContent = 'Nenhum prato cadastrado nesta categoria.';
      return;
    }

    pratos.forEach((prato) => {
      if (!prato.disponivel) return;

      const card = document.createElement('article');
      card.className = 'card-prato';

      const nome = document.createElement('h3');
      nome.textContent = prato.nome;

      const descricao = document.createElement('p');
      descricao.textContent = prato.descricao || 'Uma deliciosa opção da casa.';

      const preco = document.createElement('strong');
      preco.textContent = Number(prato.preco).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });

      card.append(nome, descricao, preco);
      container.appendChild(card);
    });

    if (!container.children.length) {
      container.textContent = 'Nenhum prato disponível no momento.';
    }

  } catch (erro) {
    container.textContent = 'Não foi possível carregar os pratos.';
    mostrarErro(erro);
  }
}

document.addEventListener('DOMContentLoaded', carregarPratos);
