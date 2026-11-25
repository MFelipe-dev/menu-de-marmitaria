
const CHAVE_MENSAGEM_PENDENTE = 'mensagemPendente';

function obterContainerMensagens() {
  let container = document.getElementById('mensagens');

  if (!container) {
    container = document.createElement('div');
    container.id = 'mensagens';
    container.setAttribute('role', 'status');
    container.setAttribute('aria-live', 'polite');
    document.body.prepend(container);
  }

  return container;
}

function mostrarMensagem(texto, tipo = 'sucesso') {
  const container = obterContainerMensagens();

  container.textContent = texto;
  container.className = `mensagem mensagem-${tipo}`;
  container.hidden = false;
  container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function mostrarErro(erro) {
  mostrarMensagem(
    erro.message || 'Ocorreu um erro inesperado.',
    'erro'
  );
}

function limparMensagem() {
  const container = document.getElementById('mensagens');

  if (container) {
    container.textContent = '';
    container.hidden = true;
  }
}

// Guarda a mensagem para ser exibida na próxima página, após o redirecionamento.
function redirecionarComMensagem(url, texto) {
  try {
    sessionStorage.setItem(CHAVE_MENSAGEM_PENDENTE, texto);
  } catch {
    // Sem sessionStorage, o redirecionamento acontece sem a mensagem.
  }

  window.location.href = url;
}

function exibirMensagemPendente() {
  let texto = null;

  try {
    texto = sessionStorage.getItem(CHAVE_MENSAGEM_PENDENTE);
    sessionStorage.removeItem(CHAVE_MENSAGEM_PENDENTE);
  } catch {
    return;
  }

  if (texto) {
    mostrarMensagem(texto);
  }
}

document.addEventListener('DOMContentLoaded', exibirMensagemPendente);
