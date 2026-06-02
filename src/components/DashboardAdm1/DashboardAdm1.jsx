import { useState, useEffect } from 'react'
import css from './DashboardAdm1.module.css'
import Sidebar from '../Sidebar/Sidebar.jsx'

const API_URL = 'http://localhost:5000'

// Função segura para ler o token
function parseJwt(token) {
    try {
        if (!token) return null

        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        )

        return JSON.parse(jsonPayload)
    } catch (e) {
        console.error('Erro ao decodificar token:', e)
        return null
    }
}

export default function DashboardAdm1() {
    const [nomeAdm, setNomeAdm] = useState('')
    const [totalUsuarios, setTotalUsuarios] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem('access_token')

        if (!token) {
            console.warn('Sem token, usuário não autenticado')
            return
        }

        const payload = parseJwt(token)

        if (payload?.nome) setNomeAdm(payload.nome)
        else if (payload?.sub) setNomeAdm(payload.sub)

        async function carregarTotais() {
            try {
                const resposta = await fetch(`${API_URL}/usuarios`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                })

                if (!resposta.ok) {
                    console.error('Erro na resposta da API')
                    return
                }

                const dados = await resposta.json()

                // aceita vários formatos de retorno
                if (Array.isArray(dados)) {
                    setTotalUsuarios(dados.length)
                } else if (Array.isArray(dados.usuarios)) {
                    setTotalUsuarios(dados.usuarios.length)
                } else {
                    setTotalUsuarios(0)
                }

            } catch (e) {
                console.error('Erro ao buscar usuários:', e)
            }
        }

        carregarTotais()
    }, [])

    const acoes = [
        { label: 'Vendedor', cor: css.blue, href: '/vendedor' },
        { label: 'Produtos', cor: css.pink, href: '/produtos' },
        { label: 'Coleções', cor: css.green, href: '/colecoes' },
        { label: 'Pedidos', cor: css.yellow, href: '/pedidos' },
    ]

    function navegar(href) {
        window.location.href = href
    }

    return (
        <div className={css.container}>
            <Sidebar />

            <main className={css.main}>
                <h1>
                    Olá, <span>{nomeAdm || 'ADM'}!</span>
                </h1>

                {totalUsuarios !== null && (
                    <p className={css.info}>
                        Total de usuários cadastrados: <strong>{totalUsuarios}</strong>
                    </p>
                )}

                <h2>Ações rápidas</h2>

                <div className={css.acoes}>
                    {acoes.map((item) => (
                        <button
                            key={item.label}
                            className={css.botao}
                            onClick={() => navegar(item.href)}
                        >
                            <span className={item.cor}></span>
                            {item.label}
                        </button>
                    ))}
                </div>
            </main>
        </div>
    )
}