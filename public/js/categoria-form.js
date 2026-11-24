
const formulario = document.getElementById('form-categoria');
const campoNome = document.getElementById('nome');
const campoDescricao = document.getElementById('descricao');

// Com ?id=3 na URL, o formulário edita a categoria 3; sem ele, cadastra uma nova.
const categoriaId = lerParametroUrl('id');

function lerFormulario() {
  return {
    nome: campoNome.value.trim(),
    descricao: campoDescricao.value.trim(),
  };
}

async function carregarCategoriaParaEdicao() {
  exibirModoEdicao(formulario, 'Editar categoria', 'Altere o nome ou a descrição da categoria.');

  try {
    const categoria = await api.buscarCategoria(categoriaId);

    campoNome.value = categoria.nome;
    campoDescricao.value = categoria.descricao || '';

  } catch (erro) {
    mostrarErro(erro);
    bloquearFormulario(formulario);
  }
}

async function salvarCategoria(dados) {
  if (categoriaId) {
    await api.atualizarCategoria(categoriaId, dados);
    return 'Categoria atualizada com sucesso!';
  }

  await api.criarCategoria(dados);
  return 'Categoria cadastrada com sucesso!';
}

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  limparMensagem();

  const dados = lerFormulario();

  if (!dados.nome) {
    mostrarMensagem('Informe o nome da categoria.', 'erro');
    return;
  }

  definirEnvioEmAndamento(formulario, true);

  try {
    const mensagemSucesso = await salvarCategoria(dados);
    redirecionarComMensagem('index.html', mensagemSucesso);

  } catch (erro) {
    mostrarErro(erro);
    definirEnvioEmAndamento(formulario, false);
  }
});

if (categoriaId) {
  carregarCategoriaParaEdicao();
}
