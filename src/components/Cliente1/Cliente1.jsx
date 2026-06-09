import { useState, useEffect } from 'react'
import css from './Cliente1.module.css'
import Sidebar from '../SidebarVen/SidebarVen.jsx'

const API_URL = 'http://localhost:5000'

export default function Cliente1() {
    const [clientes, setClientes] = useState([])
    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] = useState('')
    const [carregando, setCarregando] = useState(false)
    const [confirmandoId, setConfirmandoId] = useState(null)
    const [autorizado, setAutorizado] = useState(false)

    // Formata o Telefone na exibição do Card
    const formatarTelefone = (valor) => {
        if (!valor) return '';
        const numeros = valor.replace(/\D/g, '');
        if (numeros.length <= 10) {
            return numeros.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
        }
        return numeros.substring(0, 11).replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    };

    // Formata o CPF/CNPJ na exibição do Card
    const formatarCPF = (valor) => {
        if (!valor) return '';
        const numeros = valor.replace(/\D/g, '');
        if (numeros.length <= 11) {
            return numeros.substring(0, 11).replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
        }
        return numeros.substring(0, 14).replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
    };

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

    const mapearUsuario = (userArray) => {
        return {
            idUsuario: userArray[0],
            email: userArray[1],
            cpf: userArray[2],
            nome: userArray[3],
            telefone: userArray[4],
            tipo: userArray[5]
        };
    };

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            window.location.href = '/login';
            return;
        }
        const payload = lerPayloadToken(token);
        if (!payload || (payload.tipo !== 1 && payload.tipo !== 0)) {
            alert('Acesso negado. Esta área é restrita para funcionários.');
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
                const apenasClientes = listaRaw.filter(userArray => {
                    const u = mapearUsuario(userArray);
                    return u.tipo === 2;
                });
                setClientes(apenasClientes);
            } else {
                setClientes([]);
            }
        } catch {
            setErro('Não foi possível conectar ao servidor para carregar a lista.')
        } finally {
            setCarregando(false)
        }
    }

    async function excluirCliente(id) {
        setErro('')
        setSucesso('')
        try {
            const resposta = await fetch(`${API_URL}/excluir_usuario/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            })
            const dados = await resposta.json()
            if (!resposta.ok) {
                setErro(dados.error || 'Erro ao excluir.');
                return
            }
            setSucesso('Cliente excluído com sucesso!')
            setClientes(c => c.filter(item => item[0] !== id))
            setTimeout(() => setSucesso(''), 3000)
        } catch {
            setErro('Não foi possível conectar ao servidor para executar a exclusão.')
        } finally {
            setConfirmandoId(null)
        }
    }

    if (!autorizado) return null;

    return (
        <div className={css.container}>
            <Sidebar />

            <div className={css.conteudo}>
                <h1 className={css.mainTitle}>Painel do Cliente</h1>

                <div className={css.buttons}>
                    <button className={css.btn} onClick={() => window.location.href = '/CadastroCliente'}>
                        <span className={css.circle}></span>
                        Cadastro Cliente
                    </button>

                    <button className={css.btn} onClick={() => window.location.href = '/EditarCliente'}>
                        <span className={css.circle}></span>
                        Edição Cliente
                    </button>

                    <button className={`${css.btn} ${css.btnDelete}`} onClick={() => window.location.href = '/ExcluirCliente'}>
                        <span className={`${css.circle} ${css.circleRed}`}></span>
                        Excluir Cliente
                    </button>
                </div>

                {erro && <p className={`${css.statusText} ${css.errorText}`}>{erro}</p>}
                {sucesso && <p className={css.successAlert}>{sucesso}</p>}

                {carregando ? (
                    <p className={css.statusText}>Carregando clientes...</p>
                ) : clientes.length === 0 ? (
                    <p className={css.statusText}>Nenhum cliente disponível para exibição.</p>
                ) : (
                    <div className={css.clientesGrid}>
                        {clientes.map((userArray, index) => {
                            const c = mapearUsuario(userArray);
                            return (
                                <div className={css.clienteCard} key={c.idUsuario || index}>

                                    {/* 💡 O bonequinho (avatarContainer) foi completamente removido daqui */}

                                    <div className={css.clienteInfo}>
                                        <p><strong>Nome:</strong> {c.nome}</p>
                                        <p><strong>Telefone:</strong> {formatarTelefone(c.telefone)}</p>
                                        <p><strong>CPF/CNPJ:</strong> {formatarCPF(c.cpf)}</p>
                                        <p><strong>E-mail:</strong> {c.email}</p>
                                    </div>

                                    {confirmandoId === c.idUsuario ? (
                                        <div className={css.confirmarBox}>
                                            <p>Confirmar exclusão?</p>
                                            <div className={css.confirmarBtns}>
                                                <button className={css.btnSim} onClick={() => excluirCliente(c.idUsuario)}>Sim</button>
                                                <button className={css.btnNao} onClick={() => setConfirmandoId(null)}>Não</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button className={css.btnExcluir} onClick={() => setConfirmandoId(c.idUsuario)}>
                                            Excluir
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}