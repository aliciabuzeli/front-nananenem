import { useState, useEffect } from 'react'
import css from './header.module.css'

function parseJwt(token) {
    try {
        const parts = token.split('.')
        if (parts.length !== 3) return null

        const decoded = atob(parts[1])
        return JSON.parse(decoded)
    } catch {
        return null
    }
}

export default function Header() {
    const [nomeUsuario, setNomeUsuario] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('access_token')

        if (!token || typeof token !== 'string') return

        const payload = parseJwt(token)

        if (!payload || typeof payload !== 'object') return

        const agora = Math.floor(Date.now() / 1000)

        if (payload.exp && payload.exp < agora) {
            localStorage.removeItem('access_token')
            return
        }

        const nome = payload?.nome || payload?.sub || 'Usuário'

        // 🔥 atualização segura
        setNomeUsuario(nome)

    }, [])

    function handleLogout() {
        localStorage.removeItem('access_token')
        setNomeUsuario('')
        window.location.href = '/login'
    }

    function handleLogin() {
        window.location.href = '/login'
    }

    return (
        <header className={css.Header}>
            <div className={css.img}>
                <img src="/image%204.png" alt="logo" />
            </div>

            <div className={css.botao}>
                {nomeUsuario ? (
                    <>
                        <span className={css.bemVindo}>
                            Olá, {nomeUsuario}!
                        </span>
                        <button className={css.btn} onClick={handleLogout}>
                            Sair
                        </button>
                    </>
                ) : (
                    <button className={css.btn} onClick={handleLogin}>
                        Login
                    </button>
                )}
            </div>
        </header>
    )
}