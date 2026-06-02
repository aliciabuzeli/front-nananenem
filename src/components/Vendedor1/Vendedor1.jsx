import { useState, useEffect } from 'react'
import css from './Vendedor1.module.css'
import Sidebar from '../Sidebar/Sidebar.jsx'

const API_URL = 'http://localhost:5000'

export default function Vendedor1() {
    const [vendedores, setVendedores] = useState([])
    const [busca, setBusca] = useState('')
    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] = useState('')
    const [carregando, setCarregando] = useState(false)
    const [confirmandoId, setConfirmandoId] = useState(null)

    const token = localStorage.getItem('access_token')

    async function carregarVendedores() {
        setErro('')
        setCarregando(true)
        try {
            const resposta = await fetch(`${API_URL}/`, {
                headers: { 'Authorization': `Bearer ${token}` },
            })
            const dados = await resposta.json()
            if (!resposta.ok) {
                setErro(dados.error || 'Erro ao carregar vendedores.')
                return
            }
            const lista = dados.usuarios ?? dados
            setVendedores(Array.isArray(lista) ? lista : [])
        } catch {
            setErro('Não foi possível conectar ao servidor.')
        } finally {
            setCarregando(false)
        }
    }

    async function buscarPorNome() {
        if (!busca.trim()) {
            carregarVendedores()
            return
        }
        setErro('')
        setCarregando(true)
        try {
            const resposta = await fetch(
                `${API_URL}/buscar_usuario?nome=${encodeURIComponent(busca)}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            )
            const dados = await resposta.json()
            if (!resposta.ok) {
                setErro(dados.error || 'Erro ao buscar.')
                return
            }
            const lista = dados.usuarios ?? dados
            setVendedores(Array.isArray(lista) ? lista : [])
        } catch {
            setErro('Não foi possível conectar ao servidor.')
        } finally {
            setCarregando(false)
        }
    }

    async function excluirVendedor(id) {
        setErro('')
        setSucesso('')
        try {
            const resposta = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            })
            const dados = await resposta.json()
            if (!resposta.ok) {
                setErro(dados.error || 'Erro ao excluir.')
                return
            }
            setSucesso('Vendedor excluído com sucesso!')
            setVendedores(v => v.filter(u => u.ID_USUARIO !== id))
        } catch {
            setErro('Não foi possível conectar ao servidor.')
        } finally {
            setConfirmandoId(null)
        }
    }

    useEffect(() => {
        carregarVendedores()
    }, [])

    return (
        <div className={css.container}>
            <Sidebar />

            <div className={css.conteudo}>
                <h1>Vendedores</h1>

                <div className={css.buttons}>
                    <button
                        className={css.btn}
                        onClick={() => window.location.href = '/cadastro-vendedor'}
                    >
                        <span className={css.circle}></span>
                        Cadastro Vendedor
                    </button>
                </div>

                {/* Busca */}
                <div className={css.buscaContainer}>
                    <input
                        className={css.inputBusca}
                        type="text"
                        placeholder="Buscar por nome..."
                        value={busca}
                        onChange={e => setBusca(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && buscarPorNome()}
                    />
                    <button className={css.btnBusca} onClick={buscarPorNome}>
                        Buscar
                    </button>
                </div>

                {erro && <p className={css.erro}>{erro}</p>}
                {sucesso && <p className={css.sucesso}>{sucesso}</p>}

                {/* Tabela de vendedores */}
                {carregando ? (
                    <p className={css.info}>Carregando...</p>
                ) : vendedores.length === 0 ? (
                    <p className={css.info}>Nenhum vendedor encontrado.</p>
                ) : (
                    <table className={css.tabela}>
                        <thead>
                        <tr>
                            <th>Nome</th>
                            <th>E-mail</th>
                            <th>Telefone</th>
                            <th>CPF</th>
                            <th>Ações</th>
                        </tr>
                        </thead>
                        <tbody>
                        {vendedores.map(v => (
                            <tr key={v.ID_USUARIO}>
                                <td>{v.NOME}</td>
                                <td>{v.EMAIL}</td>
                                <td>{v.TELEFONE}</td>
                                <td>{v.CPF}</td>
                                <td className={css.acoes}>
                                    <button
                                        className={css.btnEditar}
                                        onClick={() => window.location.href = `/edicao-vendedor/${v.ID_USUARIO}`}
                                    >
                                        Editar
                                    </button>

                                    {confirmandoId === v.ID_USUARIO ? (
                                        <>
                                            <span className={css.confirmarTexto}>Confirmar?</span>
                                            <button
                                                className={css.btnConfirmar}
                                                onClick={() => excluirVendedor(v.ID_USUARIO)}
                                            >
                                                Sim
                                            </button>
                                            <button
                                                className={css.btnCancelar}
                                                onClick={() => setConfirmandoId(null)}
                                            >
                                                Não
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            className={css.btnExcluir}
                                            onClick={() => setConfirmandoId(v.ID_USUARIO)}
                                        >
                                            Excluir
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}