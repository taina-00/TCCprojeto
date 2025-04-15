// URL base da API (ajuste conforme sua configuração)
const API_BASE_URL = 'http://localhost:3000/api';

// Funções auxiliares para chamadas API
async function apiRequest(endpoint, method = 'GET', data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    return await response.json();
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
}

// Funções de login
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

if (loginForm) {
  loginForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const { success, user } = await apiRequest('/login', 'POST', { email, password });

      if (success) {
        alert('Login bem-sucedido!');
        window.location.href = 'movimentacao.html';
      } else {
        alert('E-mail ou senha incorretos.');
      }
    } catch (error) {
      alert('Erro ao realizar login');
    }
  });
}

if (registerForm) {
  registerForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const newUsername = document.getElementById('newUsername').value;
    const newEmail = document.getElementById('newEmail').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!validateEmail(newEmail)) {
      alert('Por favor, insira um e-mail válido.');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    try {
      const response = await apiRequest('/usuarios', 'POST', {
        username: newUsername,
        email: newEmail,
        password: newPassword
      });

      if (response.success) {
        alert('Registro bem-sucedido!');
        window.location.href = 'login.html';
      } else {
        alert(response.message || 'Erro ao registrar');
      }
    } catch (error) {
      alert('Erro ao registrar usuário');
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // ... (mantenha todas as declarações de variáveis existentes)

  // Funções atualizadas para usar API
  async function carregarProdutosNoSelect() {
    try {
      const itens = await apiRequest('/itens');
      selectProduto.innerHTML = '<option value="">Selecione um produto</option>';
      
      itens.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id; // Agora usamos ID ao invés do nome
        option.textContent = item.nome_produto;
        option.setAttribute('data-codigo', item.codigo);
        selectProduto.appendChild(option);
      });
    } catch (error) {
      showCustomAlert('Erro ao carregar produtos');
    }
  }

  async function carregarItensParaExclusao() {
    try {
      const itens = await apiRequest('/itens');
      itemParaExcluirSelect.innerHTML = '<option value="">Selecione um item</option>';
      
      itens.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = `${item.codigo} - ${item.nome_produto}`;
        itemParaExcluirSelect.appendChild(option);
      });
    } catch (error) {
      showCustomAlert('Erro ao carregar itens para exclusão');
    }
  }

  async function atualizarEstoque() {
    try {
      const itens = await apiRequest('/itens');
      const corpoTabela = document.getElementById('corpoTabelaEstoque');
      corpoTabela.innerHTML = '';
      
      // ... (mantenha a mesma lógica de filtro e exibição, mas usando os dados da API)
      
      itensFiltrados.forEach(item => {
        // ... (mantenha a mesma estrutura de criação de linhas)
      });
      
    } catch (error) {
      showCustomAlert('Erro ao carregar estoque');
    }
  }

  async function atualizarListaMovimentacoes() {
    try {
      const movimentacoes = await apiRequest('/movimentacoes');
      const listaMovimentacoes = document.getElementById('listaMovimentacoes');
      listaMovimentacoes.innerHTML = '';
      
      // ... (aplicar filtros e ordenação como antes)
      
      movimentacoesFiltradas.forEach(mov => {
        // ... (criar linhas da tabela como antes)
      });
      
    } catch (error) {
      showCustomAlert('Erro ao carregar movimentações');
    }
  }

  // Atualização do evento de seleção de produto
  selectProduto.addEventListener('change', async function() {
    const itemId = this.value;
    if (!itemId) return;

    try {
      const item = await apiRequest(`/itens/${itemId}`);
      
      estoqueAtualInput.value = item.estoque_atual;
      tipoItemInput.value = item.tipo_item;
      codigoInput.value = item.codigo;
      
      // ... (restante da lógica de preenchimento dos campos)
      
    } catch (error) {
      showCustomAlert('Erro ao carregar detalhes do item');
    }
  });

  // Atualização do evento de salvar
  saveButton.addEventListener('click', async function(event) {
    event.preventDefault();
    const selectedValue = document.querySelector('input[name="registro"]:checked').value;

    if (selectedValue === 'entrada' || selectedValue === 'saida') {
      // ... (validações permanecem iguais)
      
      try {
        const movimentacao = {
          item_id: selectProduto.value,
          tipo: selectedValue,
          quantidade,
          data,
          empresa
        };

        await apiRequest('/movimentacoes', 'POST', movimentacao);
        
        // Atualiza a interface
        await Promise.all([
          carregarProdutosNoSelect(),
          atualizarEstoque(),
          atualizarListaMovimentacoes()
        ]);
        
        limparCamposMovimentacao();
        showCustomAlert('Movimentação registrada com sucesso!');
        
      } catch (error) {
        showCustomAlert('Erro ao registrar movimentação');
      }
      
    } else if (selectedValue === 'cadastro') {
      // ... (validações permanecem iguais)
      
      try {
        const item = {
          codigo: codigoCadastroInput.value,
          nome_produto: nomeProdutoCadastro,
          tipo_item: tipoItem,
          estoque_atual: estoqueAtual,
          estoque_critico: estoqueCritico,
          estoque_seguranca: estoqueSeguranca,
          estoque_maximo: estoqueMaximo,
          estoque_minimo: estoqueMinimo,
          // ... (campos específicos de EPI/Material)
        };

        await apiRequest('/itens', 'POST', item);
        
        // Limpa e atualiza
        formCadastroItem.reset();
        tipoItemCadastro.value = '';
        epiFields.style.display = 'none';
        materialFields.style.display = 'none';
        
        await Promise.all([
          gerarNovoCodigo(),
          carregarProdutosNoSelect(),
          carregarItensParaExclusao()
        ]);
        
        showCustomAlert('Item cadastrado com sucesso!');
        
      } catch (error) {
        showCustomAlert('Erro ao cadastrar item');
      }
    }
  });

  // Atualização da exclusão de itens
  deleteItemButton.addEventListener('click', async function() {
    const itemId = itemParaExcluirSelect.value;
    if (!itemId) return;

    if (confirm('Tem certeza que deseja excluir este item?')) {
      try {
        await apiRequest(`/itens/${itemId}`, 'DELETE');
        
        await Promise.all([
          carregarItensParaExclusao(),
          carregarProdutosNoSelect(),
          atualizarEstoque(),
          atualizarListaMovimentacoes()
        ]);
        
        showCustomAlert('Item excluído com sucesso!');
      } catch (error) {
        showCustomAlert('Erro ao excluir item');
      }
    }
  });

  // ... (mantenha o restante das funções auxiliares que não dependem do localStorage)

  // Inicialização
  Promise.all([
    atualizarListaMovimentacoes(),
    toggleContent()
  ]).catch(error => {
    console.error('Erro na inicialização:', error);
  });
});
