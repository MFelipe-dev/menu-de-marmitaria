
const formularioPrato = document.getElementById('form-prato');
const campoCategoria = document.getElementById('categoria');
const mensagemPrato = document.getElementById('mensagem');

async function carregarCategoriasSelect() {
  try {
    const categorias = await api.listarCategorias();

    if (categorias.length === 0) {
      mensagemPrato.textContent =
        'Cadastre uma categoria antes de cadastrar pratos.';

      campoCategoria.disabled = true;
      return;
    }

    categorias.forEach((categoria) => {
      const opcao = document.createElement('option');

      opcao.value = categoria.id;
      opcao.textContent = categoria.nome;

      campoCategoria.appendChild(opcao);
    });

  } catch (erro) {
    mensagemPrato.textContent = 'Não foi possível carregar as categorias.';
    mostrarErro(erro);
  }
}

formularioPrato.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const id = document.getElementById('prato-id').value;

  const dados = {
    nome: document.getElementById('nome').value.trim(),
    descricao: document.getElementById('descricao').value.trim(),
    preco: Number(
      document.getElementById('preco').value.replace(',', '.')
    ),
    disponivel: document.getElementById('disponivel').checked
  };

  try {
    if (id) {
      await api.atualizarPrato(id, dados);
      mensagemPrato.textContent = 'Prato atualizado com sucesso!';
    } else {
      await api.criarPrato(campoCategoria.value, dados);
      mensagemPrato.textContent = 'Prato cadastrado com sucesso!';
    }

    formularioPrato.reset();

  } catch (erro) {
    mensagemPrato.textContent = erro.message;
    mostrarErro(erro);
  }
});

document.addEventListener('DOMContentLoaded', carregarCategoriasSelect);
