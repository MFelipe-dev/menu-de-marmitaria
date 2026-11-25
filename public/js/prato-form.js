
const formularioPrato = document.getElementById('form-prato');
const campoCategoria = document.getElementById('categoria');
const campoNome = document.getElementById('nome');
const campoDescricao = document.getElementById('descricao');
const campoPreco = document.getElementById('preco');
const campoDisponivel = document.getElementById('disponivel');

// ?id=5 edita o prato 5; ?categoria=2 já deixa a categoria 2 selecionada no cadastro.
const pratoId = lerParametroUrl('id');
const categoriaDaUrl = lerParametroUrl('categoria');

function urlListaDePratos() {
  return campoCategoria.value
    ? `pratos.html?categoria=${campoCategoria.value}`
    : 'index.html';
}

function atualizarLinksDeVolta() {
  document.querySelectorAll('.link-voltar-pratos').forEach((link) => {
    link.href = urlListaDePratos();
  });
}

async function carregarCategoriasSelect() {
  try {
    const categorias = await api.listarCategorias();

    if (categorias.length === 0) {
      mostrarMensagem('Cadastre uma categoria antes de cadastrar pratos.', 'erro');
      bloquearFormulario(formularioPrato);
      return;
    }

    categorias.forEach((categoria) => {
      const opcao = document.createElement('option');

      opcao.value = categoria.id;
      opcao.textContent = categoria.nome;

      campoCategoria.appendChild(opcao);
    });

  } catch (erro) {
    mostrarErro(erro);
    bloquearFormulario(formularioPrato);
  }
}

function preencherFormulario(prato) {
  campoCategoria.value = String(prato.categoriaId);
  campoNome.value = prato.nome;
  campoDescricao.value = prato.descricao || '';
  campoPreco.value = Number(prato.preco).toFixed(2);
  campoDisponivel.checked = prato.disponivel;

  // A API não permite mover um prato para outra categoria.
  campoCategoria.disabled = true;
  document.getElementById('dica-categoria').hidden = false;
}

async function carregarPratoParaEdicao() {
  exibirModoEdicao(formularioPrato, 'Editar prato', 'Atualize as informações, o preço ou a disponibilidade do prato.');

  try {
    preencherFormulario(await api.buscarPrato(pratoId));
  } catch (erro) {
    mostrarErro(erro);
    bloquearFormulario(formularioPrato);
  }
}

function lerFormulario() {
  return {
    nome: campoNome.value.trim(),
    descricao: campoDescricao.value.trim(),
    // O preço vai como texto: a validação (maior que zero) é feita pela API.
    preco: campoPreco.value,
    disponivel: campoDisponivel.checked
  };
}

async function salvarPrato(dados) {
  if (pratoId) {
    await api.atualizarPrato(pratoId, dados);
    return 'Prato atualizado com sucesso!';
  }

  await api.criarPrato(campoCategoria.value, dados);
  return 'Prato cadastrado com sucesso!';
}

formularioPrato.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  limparMensagem();

  if (!campoCategoria.value) {
    mostrarMensagem('Selecione uma categoria.', 'erro');
    return;
  }

  definirEnvioEmAndamento(formularioPrato, true);

  try {
    const mensagemSucesso = await salvarPrato(lerFormulario());
    redirecionarComMensagem(urlListaDePratos(), mensagemSucesso);

  } catch (erro) {
    mostrarErro(erro);
    definirEnvioEmAndamento(formularioPrato, false);
  }
});

async function iniciarFormulario() {
  await carregarCategoriasSelect();

  if (pratoId) {
    await carregarPratoParaEdicao();
  } else if (categoriaDaUrl) {
    campoCategoria.value = categoriaDaUrl;
  }

  atualizarLinksDeVolta();
}

campoCategoria.addEventListener('change', atualizarLinksDeVolta);
document.addEventListener('DOMContentLoaded', iniciarFormulario);
