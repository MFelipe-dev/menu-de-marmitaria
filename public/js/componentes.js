
// Funções reaproveitadas pelas listagens e pelos formulários.

function criarElemento(tag, classe, texto) {
  const elemento = document.createElement(tag);

  if (classe) elemento.className = classe;
  if (texto) elemento.textContent = texto;

  return elemento;
}

function criarLink(texto, href, classe = 'botao botao-pequeno') {
  const link = criarElemento('a', classe, texto);
  link.href = href;
  return link;
}

function criarBotao(texto, classe, aoClicar) {
  const botao = criarElemento('button', classe, texto);
  botao.type = 'button';
  botao.addEventListener('click', aoClicar);
  return botao;
}

function criarAcoes(...botoes) {
  const acoes = criarElemento('div', 'acoes');
  acoes.append(...botoes);
  return acoes;
}

function mostrarListaVazia(container, texto) {
  container.replaceChildren(criarElemento('p', 'lista-vazia', texto));
}

function lerParametroUrl(nome) {
  return new URLSearchParams(window.location.search).get(nome);
}

async function confirmarExclusao({ pergunta, excluir, mensagemSucesso, aoConcluir }) {
  if (!window.confirm(pergunta)) return;

  try {
    await excluir();
    mostrarMensagem(mensagemSucesso);
    await aoConcluir();
  } catch (erro) {
    mostrarErro(erro);
  }
}

function exibirModoEdicao(formulario, titulo, subtitulo) {
  document.getElementById('titulo-formulario').textContent = titulo;
  document.querySelector('#titulo-formulario + p').textContent = subtitulo;
  document.title = `${titulo} - Sabor da Casa`;
  document.querySelector('.navegacao [aria-current]')?.removeAttribute('aria-current');
  formulario.querySelector('button[type="submit"]').textContent = 'Salvar alterações';
}

function definirEnvioEmAndamento(formulario, emAndamento) {
  formulario.querySelector('button[type="submit"]').disabled = emAndamento;
}

function bloquearFormulario(formulario) {
  formulario
    .querySelectorAll('input, textarea, select, button')
    .forEach((campo) => { campo.disabled = true; });
}
