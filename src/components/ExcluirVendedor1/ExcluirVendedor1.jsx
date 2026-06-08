import { useState, useEffect } from 'react'
import css from './ExcluirVendedor1.module.css'
import Sidebar from '/src/components/Sidebar/Sidebar.jsx'

const API_URL = 'http://127.0.0.1:5000'

export default function ExcluirVendedor() {
    const [vendedores, setVendedores] = useState([])
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
                credentials: 'include',
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

    async function excluirVendedor(id) {
        setErro('')
        setSucesso('')
        try {
            const resposta = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                credentials: 'include',
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

    useEffect(() => { carregarVendedores() }, [])

    return (
        <div className={css.container}>
            <Sidebar />

            <div className={css.conteudo}>
                <h1>Excluir Vendedor</h1>

                {erro && <p className={css.erro}>{erro}</p>}
                {sucesso && <p className={css.sucesso}>{sucesso}</p>}

                {carregando ? (
                    <p className={css.info}>Carregando...</p>
                ) : vendedores.length === 0 ? (
                    <p className={css.info}>Nenhum vendedor encontrado.</p>
                ) : (
                    <div className={css.grid}>
                        {vendedores.map(v => (
                            <div className={css.card} key={v.ID_USUARIO}>
                                <div className={css.avatarWrap}>
                                    <img
                                        src={`${API_URL}/uploads/Fotos/${v.ID_USUARIO}.jpg`}
                                        alt={v.NOME}
                                        className={css.avatar}
                                        onError={e => {
                                            e.target.onerror = null
                                            e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
                                        }}
                                    />
                                </div>

                                <div className={css.info}>
                                    <p><span>Nome:</span> {v.NOME}</p>
                                    <p><span>Telefone:</span> {v.TELEFONE}</p>
                                    <p><span>CPF:</span> {v.CPF}</p>
                                    <p><span>E-mail:</span> {v.EMAIL}</p>
                                </div>

                                {confirmandoId === v.ID_USUARIO ? (
                                    <div className={css.confirmar}>
                                        <p>Confirmar exclusão?</p>
                                        <div className={css.confirmarBtns}>
                                            <button className={css.btnSim} onClick={() => excluirVendedor(v.ID_USUARIO)}>Sim</button>
                                            <button className={css.btnNao} onClick={() => setConfirmandoId(null)}>Não</button>
                                        </div>
                                    </div>
                                ) : (
                                    <button className={css.btnExcluir} onClick={() => setConfirmandoId(v.ID_USUARIO)}>
                                        Excluir
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}