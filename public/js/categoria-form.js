
const formulario = document.getElementById('form-categoria');
const mensagem = document.getElementById('mensagem');

let enviando = false;

function exibirMensagemFormulario(texto, tipo = 'sucesso') {
  mensagem.textContent = texto;
  mensagem.style.color = tipo === 'erro' ? '#a51f1f' : '#23723c';
}

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  if (enviando) return;

  const id = document.getElementById('categoria-id').value;

  const dados = {
    nome: document.getElementById('nome').value.trim(),
    descricao: document.getElementById('descricao').value.trim()
  };

  if (!dados.nome) {
    exibirMensagemFormulario('Informe o nome da categoria.', 'erro');
    return;
  }

  enviando = true;

  try {
    if (id) {
      await api.atualizarCategoria(id, dados);
      exibirMensagemFormulario('Categoria atualizada com sucesso!');
    } else {
      await api.criarCategoria(dados);
      exibirMensagemFormulario('Categoria cadastrada com sucesso!');
    }

    formulario.reset();
    document.getElementById('categoria-id').value = '';

  } catch (erro) {
    exibirMensagemFormulario(erro.message, 'erro');
    mostrarErro(erro);

  } finally {
    enviando = false;
  }
});
