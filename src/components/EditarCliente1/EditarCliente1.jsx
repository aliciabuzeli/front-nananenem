import { useState, useEffect } from 'react'
import css from './EditarCliente1.module.css'
import Sidebar from '../SidebarVen/SidebarVen.jsx'

const API_URL = 'http://localhost:5000'

export default function EditarCliente() {
    const [clientes, setClientes] = useState([])
    const [clienteSelecionado, setClienteSelecionado] = useState(null)
    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] = useState('')
    const [carregando, setCarregando] = useState(false)
    const [autorizado, setAutorizado] = useState(false)

    // Estados para os campos solicitados do formulário
    const [nome, setNome] = useState('')
    const [endereco, setEndereco] = useState('')
    const [telefone, setTelefone] = useState('')
    const [cnpj, setCnpj] = useState('')

    // Ler payload do JWT salvo no localStorage
    function lerPayloadToken(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch {
            return null;
        }
    }

    // Alinhado ao padrão de recebimento de tuplas/vetores do seu banco de dados
    const mapearUsuario = (userArray) => {
        return {
            idUsuario: userArray[0],
            email: userArray[1],
            cnpj: userArray[2], // Armazenado na coluna de documento fiscal
            nome: userArray[3],
            telefone: userArray[4],
            tipo: userArray[5],
            endereco: userArray[6] || '' // Garantindo o mapeamento da nova propriedade
        };
    };

    // Máscaras em tempo de digitação
    const aplicarMascaraCnpj = (valor) => {
        const numeros = valor.replace(/\D/g, '');
        return numeros
            .substring(0, 14)
            .replace(/^(\d{2})(\d)/, '$1.$2')
            .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2');
    };

    const aplicarMascaraTelefone = (valor) => {
        const numeros = valor.replace(/\D/g, '');
        if (numeros.length <= 10) {
            return numeros.substring(0, 10).replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
        }
        return numeros.substring(0, 11).replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    };

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            window.location.href = '/login';
            return;
        }
        const payload = lerPayloadToken(token);
        if (!payload || (payload.tipo !== 1 && payload.tipo !== 0)) {
            alert('Acesso negado. Área restrita para funcionários.');
            window.location.href = '/login';
            return;
        }
        setAutorizado(true);
        carregarClientes();
    }, []);

    async function carregarClientes() {
        setErro('')
        setCarregando(true)
        try {
            const resposta = await fetch(`${API_URL}/`, {
                method: 'GET',
                credentials: 'include',
            })
            const dados = await resposta.json()
            if (!resposta.ok) {
                setErro(dados.error || 'Erro ao carregar Clientes.');
                return
            }
            const listaRaw = dados.usuarios ?? dados
            if (Array.isArray(listaRaw)) {
                // Filtra apenas usuários do tipo Cliente (tipo === 2)
                const apenasClientes = listaRaw.filter(userArray => mapearUsuario(userArray).tipo === 2);
                setClientes(apenasClientes);
            }
        } catch {
            setErro('Não foi possível conectar ao servidor.')
        } finally {
            setCarregando(false)
        }
    }

    const selecionarCliente = (userArray) => {
        const cliente = mapearUsuario(userArray);
        setClienteSelecionado(cliente.idUsuario);
        setNome(cliente.nome || '');
        setEndereco(cliente.endereco || '');
        setTelefone(aplicarMascaraTelefone(cliente.telefone || ''));
        setCnpj(aplicarMascaraCnpj(cliente.cnpj || ''));
        setErro('');
        setSucesso('');
    };

    async function handleSalvarEdicao(e) {
        e.preventDefault();
        setErro('');
        setSucesso('');

        if (!nome) {
            setErro('O campo Nome é obrigatório.');
            return;
        }

        // Usando FormData idêntico ao processo padrão estruturado
        const formData = new FormData();
        formData.append('nome', nome.trim());
        formData.append('endereco', endereco.trim());
        formData.append('telefone', telefone.replace(/\D/g, '')); // Remove formatação antes de enviar
        formData.append('cpf', cnpj.replace(/\D/g, '')); // Alinhado com o campo de documento do banco

        try {
            const resposta = await fetch(`${API_URL}/editar_usuario/${clienteSelecionado}`, {
                method: 'PUT',
                body: formData,
                credentials: 'include',
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                setErro(dados.error || 'Erro ao atualizar dados do cliente.');
                return;
            }

            setSucesso('Cliente atualizado com sucesso!');
            setClienteSelecionado(null);
            carregarClientes();
        } catch {
            setErro('Erro de conexão com o servidor.');
        }
    }

    if (!autorizado) return null;

    return (
        <div className={css.container}>
            <Sidebar />

            <div className={css.conteudo}>
                <h1 className={css.mainTitle}>Edição de Cliente</h1>

                {erro && <p className={css.errorText}>{erro}</p>}
                {sucesso && <p className={css.successAlert}>{sucesso}</p>}

                {clienteSelecionado ? (
                    /* Formulário de edição ativo */
                    <form onSubmit={handleSalvarEdicao} className={css.formEdicao}>
                        <h2>Editando Dados do Cliente</h2>

                        <div className={css.formGroup}>
                            <label>Nome:</label>
                            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
                        </div>

                        <div className={css.formGroup}>
                            <label>Endereço:</label>
                            <input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
                        </div>

                        <div className={css.formGroup}>
                            <label>Telefone:</label>
                            <input
                                type="text"
                                value={telefone}
                                onChange={(e) => setTelefone(aplicarMascaraTelefone(e.target.value))}
                                placeholder="(00) 00000-0000"
                            />
                        </div>

                        <div className={css.formGroup}>
                            <label>CNPJ:</label>
                            <input
                                type="text"
                                value={cnpj}
                                onChange={(e) => setCnpj(aplicarMascaraCnpj(e.target.value))}
                                placeholder="00.000.000/0000-00"
                            />
                        </div>

                        <div className={css.formBtns}>
                            <button type="submit" className={css.btnSalvar}>Salvar Alterações</button>
                            <button type="button" className={css.btnCancelar} onClick={() => setClienteSelecionado(null)}>Cancelar</button>
                        </div>
                    </form>
                ) : (
                    /* Grid de Seleção baseada no layout azul-claro enviado na imagem */
                    <div className={css.clientesGrid}>
                        {carregando ? (
                            <p className={css.statusText}>Carregando lista...</p>
                        ) : clientes.length === 0 ? (
                            <p className={css.statusText}>Nenhum cliente cadastrado no sistema.</p>
                        ) : (
                            clientes.map((userArray, index) => {
                                const c = mapearUsuario(userArray);
                                return (
                                    <div className={css.clienteCard} key={c.idUsuario || index}>
                                        <div className={css.avatarContainer}>
                                            <div className={css.avatarPlaceholder}>
                                                <svg viewBox="0 0 24 24" className={css.avatarIcon}>
                                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-3-8-3z" />
                                                </svg>
                                            </div>
                                        </div>

                                        <div className={css.clienteInfo}>
                                            <p><strong>Nome:</strong> {c.nome}</p>
                                            <p><strong>Endereço:</strong> {c.endereco || 'Não informado'}</p>
                                            <p><strong>Telefone:</strong> {aplicarMascaraTelefone(c.telefone)}</p>
                                            <p><strong>CNPJ:</strong> {aplicarMascaraCnpj(c.cnpj)}</p>
                                        </div>

                                        <button className={css.btnEditarCard} onClick={() => selecionarCliente(userArray)}>
                                            Editar
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}