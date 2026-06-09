import { useState, useEffect } from 'react'
import css from './ExcluirVendedor1.module.css'
import Sidebar from '/src/components/Sidebar/Sidebar.jsx'

const API_URL = 'http://localhost:5000'

export default function ExcluirVendedor() {
    const [vendedores, setVendedores] = useState([])
    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] = useState('')
    const [carregando, setCarregando] = useState(false)
    const [confirmandoId, setConfirmandoId] = useState(null)

    // Função interna para transformar a tupla do banco de dados em um objeto legível
    const mapearUsuario = (userArray) => {
        return {
            idUsuario: userArray[0],
            email: userArray[1],
            cpf: userArray[2],
            nome: userArray[3],
            telefone: userArray[4]
        };
    };

    async function carregarVendedores() {
        setErro('')
        setCarregando(true)
        try {
            const resposta = await fetch(`${API_URL}/`, {
                credentials: 'include',
            })
            const dados = await resposta.json()
            if (!resposta.ok) {
                setErro(dados.error || 'Erro ao carregar vendedores.')
                return
            }

            const lista = dados.usuarios ?? dados
            setVendedores(Array.isArray(lista) ? lista : [])
        } finally {
            setCarregando(false)
        }
    }

    async function excluirVendedor(id) {
        setErro('')
        setSucesso('')
        try {
            // 💡 Correção da rota: adicionado '/excluir_usuario/' antes do ID
            const resposta = await fetch(`${API_URL}/excluir_usuario/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            })
            const dados = await resposta.json()
            if (!resposta.ok) {
                setErro(dados.error || 'Erro ao excluir.')
                return
            }
            setSucesso('Vendedor excluído com sucesso!')

            // Remove o usuário deletado da lista comparando com a posição correta do array
            setVendedores(v => v.filter(userArray => userArray[0] !== id))

            setTimeout(() => setSucesso(''), 3000)
        } finally {
            setConfirmandoId(null)
        }
    }

    useEffect(() => { carregarVendedores() }, [])

    return (
        <div className={css.container}>
            <Sidebar />

            <div className={css.conteudo}>
                <h1 className={css.mainTitle}>Excluir Vendedor</h1>

                {erro && <p className={`${css.statusText} ${css.errorText}`}>{erro}</p>}
                {sucesso && <p className={css.successAlert}>{sucesso}</p>}

                {carregando ? (
                    <p className={css.statusText}>Carregando...</p>
                ) : vendedores.length === 0 ? (
                    <p className={css.statusText}>Nenhum vendedor encontrado.</p>
                ) : (
                    <div className={css.vendedoresGrid}>
                        {vendedores.map((userArray, index) => {
                            const v = mapearUsuario(userArray);
                            return (
                                <div className={css.vendedorCard} key={v.idUsuario || index}>
                                    <div className={css.avatarContainer}>
                                        <div className={css.avatarPlaceholder}>
                                            <svg viewBox="0 0 24 24" className={css.avatarIcon}>
                                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-3-8-3z" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className={css.vendedorInfo}>
                                        <p><strong>Nome:</strong> {v.nome}</p>
                                        <p><strong>Telefone:</strong> {v.telefone}</p>
                                        <p><strong>CPF:</strong> {v.cpf}</p>
                                        <p><strong>E-mail:</strong> {v.email}</p>
                                    </div>

                                    {confirmandoId === v.idUsuario ? (
                                        <div className={css.confirmarBox}>
                                            <p>Confirmar exclusão?</p>
                                            <div className={css.confirmarBtns}>
                                                <button className={css.btnSim} onClick={() => excluirVendedor(v.idUsuario)}>Sim</button>
                                                <button className={css.btnNao} onClick={() => setConfirmandoId(null)}>Não</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button className={css.btnExcluir} onClick={() => setConfirmandoId(v.idUsuario)}>
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