
const listaPratos = document.getElementById('lista-pratos');
const categoriaId = lerParametroUrl('categoria');

function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

// Pratos indisponíveis continuam visíveis para que possam ser editados e reativados.
function criarCardPrato(prato) {
  const classe = prato.disponivel ? 'card card-prato' : 'card card-prato indisponivel';
  const card = criarElemento('article', classe);

  if (!prato.disponivel) {
    card.append(criarElemento('span', 'etiqueta', 'Indisponível'));
  }

  card.append(
    criarElemento('h3', null, prato.nome),
    criarElemento('p', null, prato.descricao || 'Uma deliciosa opção da casa.'),
    criarElemento('strong', null, formatarPreco(prato.preco)),
    criarAcoes(
      criarLink('Editar', `prato-form.html?id=${prato.id}`, 'botao botao-pequeno botao-secundario'),
      criarBotao('Excluir', 'botao botao-pequeno botao-perigo', () => excluirPrato(prato))
    )
  );

  return card;
}

function excluirPrato(prato) {
  return confirmarExclusao({
    pergunta: `Deseja excluir o prato "${prato.nome}"?`,
    excluir: () => api.excluirPrato(prato.id),
    mensagemSucesso: `Prato "${prato.nome}" excluído com sucesso.`,
    aoConcluir: carregarPratos,
  });
}

function exibirResumo(pratos) {
  const indisponiveis = pratos.filter((prato) => !prato.disponivel).length;
  let resumo = `${pratos.length} ${pratos.length === 1 ? 'prato' : 'pratos'}`;

  if (indisponiveis > 0) {
    resumo += ` · ${indisponiveis} ${indisponiveis === 1 ? 'indisponível' : 'indisponíveis'}`;
  }

  document.getElementById('resumo-pratos').textContent = resumo;
}

async function carregarPratos() {
  const titulo = document.getElementById('titulo-categoria');

  if (!categoriaId || !/^[1-9]\d*$/.test(categoriaId)) {
    mostrarListaVazia(listaPratos, 'Categoria inválida.');
    document.getElementById('novo-prato').hidden = true;
    return;
  }

  document.getElementById('novo-prato').href = `prato-form.html?categoria=${categoriaId}`;

  try {
    const [categoria, pratos] = await Promise.all([
      api.buscarCategoria(categoriaId),
      api.listarPratos(categoriaId)
    ]);

    titulo.textContent = categoria.nome;
    document.title = `${categoria.nome} - Sabor da Casa`;
    exibirResumo(pratos);

    if (pratos.length === 0) {
      mostrarListaVazia(listaPratos, 'Nenhum prato cadastrado nesta categoria.');
      return;
    }

    listaPratos.replaceChildren(...pratos.map(criarCardPrato));

  } catch (erro) {
    mostrarListaVazia(listaPratos, 'Não foi possível carregar os pratos.');
    mostrarErro(erro);
  }
}

document.addEventListener('DOMContentLoaded', carregarPratos);
