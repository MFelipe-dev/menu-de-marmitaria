
function mostrarMensagem(texto, tipo = 'sucesso') {
  let container = document.getElementById('mensagens');

  if (!container) {
    container = document.createElement('div');
    container.id = 'mensagens';
    container.setAttribute('role', 'status');
    container.setAttribute('aria-live', 'polite');
    document.body.prepend(container);
  }

  container.textContent = texto;
  container.className = `mensagem mensagem-${tipo}`;
  container.hidden = false;
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
