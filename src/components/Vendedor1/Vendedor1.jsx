import { useState, useEffect } from 'react'
import css from './Vendedor1.module.css'
import Sidebar from '../Sidebar/Sidebar.jsx'

const API_URL = 'http://127.0.0.1:5000'

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
        if (!busca.trim()) { carregarVendedores(); return }
        setErro('')
        setCarregando(true)
        try {
            const resposta = await fetch(
                `${API_URL}/buscar_usuario?nome=${encodeURIComponent(busca)}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            )
            const dados = await resposta.json()
            if (!resposta.ok) { setErro(dados.error || 'Erro ao buscar.'); return }
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
            if (!resposta.ok) { setErro(dados.error || 'Erro ao excluir.'); return }
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
                <h1>Vendedor</h1>

                <div className={css.buttons}>
                    <button className={css.btn} onClick={() => window.location.href = '/CadastroVendedor'}>
                        <span className={css.circle}></span>
                        Cadastro Vendedor
                    </button>
                    <button className={css.btn} onClick={() => window.location.href = '/EdicaoVendedor'}>
                        <span className={css.circle}></span>
                        Edição Vendedor
                    </button>
                    <button className={`${css.btn} ${css.btnDelete}`} onClick={() => window.location.href = '/Excluir'}>
                        <span className={`${css.circle} ${css.circleRed}`}></span>
                        Excluir Vendedor
                    </button>
                </div>

                {erro && <p className={css.erro}>{erro}</p>}
                {sucesso && <p className={css.sucesso}>{sucesso}</p>}
            </div>
        </div>
    )
}