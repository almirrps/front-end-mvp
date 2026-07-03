// Configuração do Endpoint da API
const API_URL = 'http://127.0.0.1:5000';

// Estado da Aplicação
let clienteSelecionado = null;
let enderecoSelecionadoIndex = null;

// Elementos do Bloco Cliente
const cpfInput = document.getElementById('cpf');
const clienteForm = document.getElementById('clienteForm');
const btnBuscarCliente = document.getElementById('btnBuscarCliente');
const btnCadastrarCliente = document.getElementById('btnCadastrarCliente');
const btnAtualizarCliente = document.getElementById('btnAtualizarCliente');
const btnDeletarCliente = document.getElementById('btnDeletarCliente');
const btnCancelarCliente = document.getElementById('btnCancelarCliente');

// Elementos do Bloco Endereço
const enderecoId = document.getElementById('enderecoId');
const enderecoForm = document.getElementById('enderecoForm');
const inputsEndereco = enderecoForm.querySelectorAll('input');
const btnCadastrarEndereco = document.getElementById('btnCadastrarEndereco');
const btnAtualizarEndereco = document.getElementById('btnAtualizarEndereco');
const btnDeletarEndereco = document.getElementById('btnDeletarEndereco');
const btnCancelarEndereco = document.getElementById('btnCancelarEndereco');
const tabelaEnderecosBody = document.querySelector('#tabelaEnderecos tbody');

// Elementos do DOM - Segunda Tela (Modal)
const btnBuscarListaCliente = document.getElementById('btnBuscarListaCliente');
const modalListaClientes = document.getElementById('modalListaClientes');
const btnFecharModal = document.getElementById('btnFecharModal');
const tabelaListaGeralBody = document.querySelector('#tabelaListaGeral tbody');

// --- Máscara e Formatação do CPF ---
cpfInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    
    e.target.value = value;
});

// --- Funções Auxiliares da Tela ---
function limparFormularioCliente() {
    clienteForm.reset();
    clienteSelecionado = null;
    btnAtualizarCliente.disabled = true;
    btnDeletarCliente.disabled = true;
    toggleInputsEndereco(false);
    limparFormularioEndereco();
    renderizarEnderecos();
}

function limparFormularioEndereco() {
    enderecoForm.reset();
    enderecoId.value = '';
    enderecoSelecionadoIndex = null;
    btnCadastrarEndereco.disabled = true;
    btnAtualizarEndereco.disabled = true;
    btnDeletarEndereco.disabled = true;
    const rows = tabelaEnderecosBody.querySelectorAll('tr');
    rows.forEach(r => r.classList.remove('selected-row'));
}

function toggleInputsEndereco(habilitar) {
    inputsEndereco.forEach(input => input.disabled = !habilitar);
    btnCadastrarEndereco.disabled = !habilitar;
}

// --- FUNÇÃO PARA INJETAR CLIENTE SELECIONADO NA TELA PRINCIPAL ---
function carregarClienteNaTelaPrincipal(cliente) {
    clienteSelecionado = cliente;
    if (!clienteSelecionado.enderecos) clienteSelecionado.enderecos = [];

    document.getElementById('nome').value = cliente.nome;
    document.getElementById('sexo').value = cliente.sexo;
    cpfInput.value = cliente.cpf;
    document.getElementById('idade').value = cliente.idade;

    btnEditarCliente.disabled = false;
    btnDeletarCliente.disabled = false;
    toggleInputsEndereco(true);
    limparFormularioEndereco();
    renderizarEnderecos();
}

// --- SEGUNDA TELA: CONTROLE E REQUISIÇÃO ---

// Abrir Segunda Tela e carregar lista total da API
btnBuscarListaCliente.addEventListener('click', async () => {
    tabelaListaGeralBody.innerHTML = `<tr><td colspan="3" style="text-align:center;">Carregando lista de clientes...</td></tr>`;
    modalListaClientes.classList.add('active');

    try {
        const response = await fetch(`${API_URL}/clientes`);
        if (!response.ok) throw new Error('Falha ao obter dados.');

        const listaClientes = await response.json();
        tabelaListaGeralBody.innerHTML = '';

        if (listaClientes.length === 0) {
            tabelaListaGeralBody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:#999;">Nenhum cliente cadastrado no sistema.</td></tr>`;
            return;
        }

        // Renderiza as linhas na ordem exata solicitada: Nome, CPF, Idade
        listaClientes.forEach(cliente => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${cliente.nome}</td>
                <td>${cliente.cpf || 'Não informado'}</td>
                <td>${cliente.idade} anos</td>
            `;

            // FUNCIONALIDADE PRINCIPAL: Duplo clique (dblclick) seleciona, fecha a tela e carrega dados
            tr.addEventListener('dblclick', () => {
                carregarClienteNaTelaPrincipal(cliente);
                modalListaClientes.classList.remove('active'); // Fecha a segunda tela
            });

            tabelaListaGeralBody.appendChild(tr);
        });

    } catch (error) {
        console.error(error);
        tabelaListaGeralBody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:red;">Erro ao conectar com a API.</td></tr>`;
    }
});

// Fechar segunda tela manualmente pelo botão X
btnFecharModal.addEventListener('click', () => {
    modalListaClientes.classList.remove('active');
});

// --- Funcao de busca de cliente (Reaproveitável) ---
async function executarBuscaPorNome(nomeBusca) {

    if (!nomeBusca) return;

    try {
        // Codifica o nome para garantir que espaços e acentos não quebrem a URL
        const nomeUrl = encodeURIComponent(nomeBusca.trim());
        
        // Faz a requisição direto no novo endpoint com o parâmetro query string
        const response = await fetch(`${API_URL}/cliente?nome=${nomeUrl}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Cliente não encontrado na base de dados da API.');
            }
            throw new Error('Erro ao buscar o cliente na API.');
        }

        const cliente = await response.json();

        if (cliente) {
            clienteSelecionado = cliente;
            // Garante que a estrutura interna de endereços exista
            if (!clienteSelecionado.enderecos) clienteSelecionado.enderecos = [];

            // Preenche os campos do formulário
            document.getElementById('nome').value = cliente.nome;
            document.getElementById('sexo').value = cliente.sexo;
            cpfInput.value = cliente.cpf;
            document.getElementById('idade').value = cliente.idade;

            // Habilita os botões e renderiza endereços
            btnCadastrarCliente.disabled = true;
            btnAtualizarCliente.disabled = false;
            btnDeletarCliente.disabled = false;
            btnCancelarCliente.disabled = false;
            toggleInputsEndereco(true);
            limparFormularioEndereco();
            renderizarEnderecos();
        } else {
            alert('Cliente não encontrado.');
        }
    } catch (error) {
        console.error(error);
        alert(error.message || 'Erro ao buscar clientes na API.');
    }
};

// Buscar Cliente por Nome Específico (GET com parâmetro na URL)
btnBuscarCliente.addEventListener('click', async () => {
    const nomeCliente = prompt('Digite o nome exato do cliente que deseja buscar:');
    
    executarBuscaPorNome(nomeCliente);
});

// Cadastrar Cliente (POST)
btnCadastrarCliente.addEventListener('click', async () => {
    const nome = document.getElementById('nome').value;
    const cpf = cpfInput.value;

    if (!nome || cpf.length < 14) {
        alert('Por favor, preencha os campos nome e cpf do cliente corretamente.');
        return;
    }

    // Capturando valores
    const formData = new FormData();
    formData.append('nome', document.getElementById('nome').value);
    formData.append('sexo', document.getElementById('sexo').value);
    formData.append('cpf', cpfInput.value);
    formData.append('idade', document.getElementById('idade').value);

    // Enviando valores ao Endpoint de Cadastro de Cliente
    try {
        const response = await fetch(`${API_URL}/cliente`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Cliente cadastrado com sucesso na API!');
            limparFormularioCliente();
        } else {
            const erro = await response.json().catch(() => ({}));
            alert(`Erro ao cadastrar cliente: ${erro.mensagem || response.statusText}`);
        }
    } catch (error) {
        console.error(error);
        alert('Erro de conexão com o servidor da API.');
    }

});

// Atualizar Dados do Cliente (PUT)
btnAtualizarCliente.addEventListener('click', async () => {
    const nome = document.getElementById('nome').value;
    const cpf = cpfInput.value;

    if (!nome || cpf.length < 14) {
        alert('Por favor, preencha os campos nome e cpf do cliente corretamente.');
        return;
    }

    // Capturando valores
    const formData = new FormData();
    formData.append('nome', document.getElementById('nome').value);
    formData.append('sexo', document.getElementById('sexo').value);
    formData.append('cpf', cpfInput.value);
    formData.append('idade', document.getElementById('idade').value);

    try {
        // Codifica o nome para garantir que espaços e acentos não quebrem a URL
        const nomeUrl = encodeURIComponent(nome.trim());
        
        // Faz a requisição direto no novo endpoint com o parâmetro query string
        const response = await fetch(`${API_URL}/cliente?nome=${nomeUrl}`, {
            method: 'PUT',
            body: formData
        });

        if (response.ok) {
            alert('Cliente atualizado com sucesso na API!');

            // Habilita os botões e renderiza endereços
            btnCadastrarCliente.disabled = false;
            btnAtualizarCliente.disabled = true;
            btnDeletarCliente.disabled = true;
            btnCancelarCliente.disabled = true;
            limparFormularioCliente();
            toggleInputsEndereco(true);
            limparFormularioEndereco();
            renderizarEnderecos();
        } else {
            const erro = await response.json().catch(() => ({}));
            alert(`Erro ao atualizar cliente: ${erro.mensagem || response.statusText}`);
        }
    } catch (error) {
        console.error(error);
        alert(error.message || 'Erro ao atualizar cliente na API.');
    }
});

//Cancela atualizacao de cadastro de cliente
btnCancelarCliente.addEventListener('click', async () => {
    // Habilita os botoes e renderiza enderecos
    btnCadastrarCliente.disabled = false;
    btnAtualizarCliente.disabled = true;
    btnDeletarCliente.disabled = true;
    btnCancelarCliente.disabled = true;
    limparFormularioCliente();
    toggleInputsEndereco(true);
    limparFormularioEndereco();
});

// Deletar Cliente (DELETE via Query Parameter de Nome)
btnDeletarCliente.addEventListener('click', async () => {
    if (!clienteSelecionado) return;

    if (confirm(`Tem certeza que deseja excluir o cliente ${clienteSelecionado.nome} do servidor?`)) {
        try {
            // Converte o nome para formato de URL válido seguro (Ex: "João Silva" -> "Jo%C3%A3o%20Silva")
            const nomeParam = encodeURIComponent(clienteSelecionado.nome);
            const response = await fetch(`${API_URL}/cliente?nome=${nomeParam}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Cliente removido com sucesso da API.');

                btnCadastrarCliente.disabled = false;
                btnAtualizarCliente.disabled = true;
                btnDeletarCliente.disabled = true;
                btnCancelarCliente.disabled = true;
                limparFormularioCliente();
                toggleInputsEndereco(true);
                limparFormularioEndereco();
            } else {
                alert('Erro ao remover o cliente da base da API.');
            }
        } catch (error) {
            console.error(error);
            alert('Erro de conexão ao tentar deletar o cliente.');
        }
    }
});

// --- Carregando Enderecos do Cliente Selecionado ---
function renderizarEnderecos() {
    tabelaEnderecosBody.innerHTML = '';
    
    if (!clienteSelecionado || !clienteSelecionado.enderecos || clienteSelecionado.enderecos.length === 0) {
        tabelaEnderecosBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#999;">Nenhum endereço cadastrado para este cliente.</td></tr>`;
        return;
    }

    clienteSelecionado.enderecos.forEach((end, index) => {
        const tr = document.createElement('tr');
        if (enderecoSelecionadoIndex === index) tr.classList.add('selected-row');

        if (end.id) {
            tr.setAttribute('data-id', end.id);
        }

        tr.innerHTML = `
            <td>${end.logradouro}</td>
            <td>${end.bairro}</td>
            <td>${end.cidade}</td>
            <td>${end.estado}</td>
        `;

        tr.addEventListener('click', () => selecionarEndereco(index, end));
        tabelaEnderecosBody.appendChild(tr);
    });

    btnCadastrarEndereco.disabled = false;
}

function selecionarEndereco(index, endereco) {
    enderecoSelecionadoIndex = index;
    enderecoId.value = endereco.id || ''; 
    document.getElementById('enderecoId').value;
    document.getElementById('logradouro').value = endereco.logradouro;
    document.getElementById('bairro').value = endereco.bairro;
    document.getElementById('cidade').value = endereco.cidade;
    document.getElementById('estado').value = endereco.estado;

    renderizarEnderecos();
    btnCadastrarEndereco.disabled = true;
    btnAtualizarEndereco.disabled = false;
    btnDeletarEndereco.disabled = false;
    btnCancelarEndereco.disabled = false;
}

// Cadastrar Endereco do Cliente Selecionado (POST)
btnCadastrarEndereco.addEventListener('click', async () => {

    if ((!clienteSelecionado) || (!clienteSelecionado.id)) {
        alert('Nenhum cliente foi selecionado.');
        return;
    }

    const logradouro = document.getElementById('logradouro').value;
    const bairro = document.getElementById('bairro').value;
    const cidade = document.getElementById('cidade').value;
    const estado = document.getElementById('estado').value;

    if (!logradouro || !bairro || !cidade || !estado) {
        alert('Preencha todos os campos do endereço.');
        return;
    }

    // Capturando valores
    const formData = new FormData();
    formData.append('logradouro', logradouro);
    formData.append('bairro', bairro);
    formData.append('cidade', cidade);
    formData.append('estado', estado);
    formData.append('cliente_id', clienteSelecionado.id);

    // Enviando valores ao Endpoint de Cadastro de Endereco
    try {
        const response = await fetch(`${API_URL}/endereco`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Endereço cadastrado com sucesso na API!');

            // Garante que a estrutura interna de enderecos exista
            clienteSelecionado = await response.json();
            if (!clienteSelecionado.enderecos) clienteSelecionado.enderecos = [];

            // Habilita os botoes e renderiza enderecos
            btnCadastrarEndereco.disabled = false;
            btnAtualizarEndereco.disabled = true;
            btnDeletarEndereco.disabled = true;
            btnCancelarEndereco.disabled = true;
            toggleInputsEndereco(true);
            limparFormularioEndereco();
            renderizarEnderecos();
        } else {
            const erro = await response.json().catch(() => ({}));
            alert(`Erro ao cadastrar endereço: ${erro.mensagem || response.statusText}`);
        }
    } catch (error) {
        console.error(error);
        alert('Erro de conexão com o servidor da API.');
    }

});

// Atualizar Endereco do Cliente Selecionado (PUT)
btnAtualizarEndereco.addEventListener('click', async () => {

    if (!clienteSelecionado || enderecoSelecionadoIndex === null) {
        alert('Nenhum registro foi selecionado.');
        return;
    }

    const idEndereco = document.getElementById('enderecoId').value;
    const logradouro = document.getElementById('logradouro').value;
    const bairro = document.getElementById('bairro').value;
    const cidade = document.getElementById('cidade').value;
    const estado = document.getElementById('estado').value;

    if (!idEndereco || !logradouro || !bairro || !cidade || !estado) {
        alert('Os campos não podem ficar vazios.');
        return;
    }

    // Capturando valores
    const formData = new FormData();
    formData.append('id', idEndereco);
    formData.append('logradouro', logradouro);
    formData.append('bairro', bairro);
    formData.append('cidade', cidade);
    formData.append('estado', estado);
    formData.append('cliente_id', clienteSelecionado.id);

    // Enviando valores ao Endpoint de Atualizacao do Endereco
    try {
        const response = await fetch(`${API_URL}/endereco`, {
            method: 'PUT',
            body: formData
        });

        if (response.ok) {
            alert('Endereço cadastrado com sucesso na API!');

            // Garante que a estrutura interna de endereços exista
            clienteSelecionado = await response.json();
            if (!clienteSelecionado.enderecos) clienteSelecionado.enderecos = [];

            // Habilita os botões e renderiza endereços
            btnCadastrarEndereco.disabled = false;
            btnAtualizarEndereco.disabled = true;
            btnDeletarEndereco.disabled = true;
            btnCancelarEndereco.disabled = true;
            toggleInputsEndereco(true);
            limparFormularioEndereco();
            renderizarEnderecos();
        } else {
            const erro = await response.json().catch(() => ({}));
            alert(`Erro ao cadastrar endereço: ${erro.mensagem || response.statusText}`);
        }
    } catch (error) {
        console.error(error);
        alert('Erro de conexão com o servidor da API.');
    }
});

// Deletar Endereco (DELETE via Query Parameter de Id)
btnDeletarEndereco.addEventListener('click', async () => {

    if (!clienteSelecionado || enderecoSelecionadoIndex === null) {
        alert('Nenhum registro foi selecionado.');
        return;
    }
  
    const idEndereco = document.getElementById('enderecoId').value;

    if (!idEndereco) {
        alert('Informação IdEndereco não foi informado.');
        return;
    }

    if (confirm('Tem certeza que deseja excluir o endereço selecionado?')) {

        try {
            const response = await fetch(`${API_URL}/endereco?id=${idEndereco}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Endereço deletado com sucesso na API!');

                btnCancelarEndereco.disabled = true;
                clienteSelecionado.enderecos.splice(enderecoSelecionadoIndex, 1);
                limparFormularioEndereco();
                renderizarEnderecos();
            } else {
                const erro = await response.json().catch(() => ({}));
                alert(`Erro ao deletar endereço: ${erro.mensagem || response.statusText}`);
            }
        } catch (error) {
            console.error(error);
            alert('Erro de conexão com o servidor da API.');
        }
    }
  
});

//Cancela atualizacao de cadastro de endereco
btnCancelarEndereco.addEventListener('click', async () => {
    // Habilita os botões e renderiza endereços
    limparFormularioEndereco();
    btnCadastrarEndereco.disabled = false;
    btnAtualizarEndereco.disabled = true;
    btnDeletarEndereco.disabled = true;
    btnCancelarEndereco.disabled = true;
});

btnBuscarListaCliente.addEventListener('click', async () => {
    tabelaListaGeralBody.innerHTML = `<tr><td colspan="3" style="text-align:center;">Carregando dados da API...</td></tr>`;
    modalListaClientes.classList.add('active');

    try {
        const response = await fetch(`${API_URL}/clientes`);
        if (!response.ok) throw new Error('Não foi possível obter a lista de clientes.');

        // 1. Pegamos o conteúdo bruto como texto primeiro para inspecionar
        const textoBruto = await response.text();
        
        let listaClientes;
        try {
            // 2. Tentamos converter para JSON de forma segura
            listaClientes = JSON.parse(textoBruto);
        } catch (err) {
            // Se falhar, significa que a API mandou texto/HTML em vez de JSON
            console.error("O backend não retornou um JSON válido. Retornou:", textoBruto);
            tabelaListaGeralBody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:#dc3545;">Erro: O servidor não respondeu em formato JSON.</td></tr>`;
            return;
        }

        // 3. Ajuste de Estrutura: Se a API retornou um objeto que envelopa a lista (ex: { clientes: [...] })
        if (listaClientes && !Array.isArray(listaClientes) && listaClientes.clientes) {
            listaClientes = listaClientes.clientes;
        }

        tabelaListaGeralBody.innerHTML = '';

        if (!listaClientes || listaClientes.length === 0) {
            tabelaListaGeralBody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:#999;">Nenhum cliente cadastrado na base.</td></tr>`;
            return;
        }

        // 4. Renderização das linhas
        listaClientes.forEach(cliente => {
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td>${cliente.nome}</td>
                <td>${cliente.cpf || 'Não informado'}</td>
                <td>${cliente.idade} anos</td>
            `;

            tr.addEventListener('dblclick', async () => {
                modalListaClientes.classList.remove('active');

                // Executando o fluxo de busca
                await executarBuscaPorNome(cliente.nome);
            });

            tabelaListaGeralBody.appendChild(tr);
        });

    } catch (error) {
        console.error("Erro na requisição FETCH:", error);
        tabelaListaGeralBody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:#dc3545; font-weight:600;">Erro de conexão ou CORS com o servidor da API.</td></tr>`;
    }
});