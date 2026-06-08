import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import css from './Login1.module.css'

const API_URL = 'http://127.0.0.1:5000'

export default function Login() {
    const [email, setEmail]           = useState('')
    const [senha, setSenha]           = useState('')
    const [erro, setErro]             = useState('')
    const [carregando, setCarregando] = useState(false)

    const navigate = useNavigate()

    async function handleLogin() {
        setErro('')

        if (!email || !senha) {
            setErro('Preencha o e-mail e a senha.')
            return
        }

        setCarregando(true)
        try {
            const resposta = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha }),
                credentials: 'include'
            })

            const dados = await resposta.json()

            if (!resposta.ok) {
                setErro(dados.error || 'Erro ao fazer login.')
                return
            }

            const token = dados.token

            // Salva no localStorage para os componentes que usam Authorization header
            localStorage.setItem('access_token', token)

            const payload = JSON.parse(atob(token.split('.')[1]))
            const tipo = payload.tipo  // 0 = Admin | 1 = Vendedor

            if (tipo === 0) {
                navigate('/DashboardAdm')
            } else if (tipo === 1) {
                navigate('/DashboardVendedor')
            } else {
                setErro('Tipo de usuário não autorizado.')
            }

        } catch {
            setErro('Não foi possível conectar ao servidor.')
        } finally {
            setCarregando(false)
        }
    }

    function handleEsqueciSenha() {
        navigate('/esqueci-senha')
    }

    return (
        <div className={css.Container}>
            <div className={css.FormSection}>
                <h1 className={css.Titulo}>Faça seu login</h1>

                <div className={css.Campo}>
                    <label className={css.Label}>E-mail</label>
                    <input
                        className={css.Input}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        disabled={carregando}
                    />
                </div>

                <div className={css.Campo}>
                    <label className={css.Label}>Senha</label>
                    <input
                        className={css.Input}
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        disabled={carregando}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                    <span className={css.Esqueci} onClick={handleEsqueciSenha}>
                        Esqueci minha senha
                    </span>
                </div>

                {erro && <p className={css.Erro}>{erro}</p>}

                <div>
                    <button
                        className={css.BtnLogin}
                        onClick={handleLogin}
                        disabled={carregando}
                    >
                        {carregando ? 'Entrando...' : 'Login'}
                    </button>
                </div>
            </div>

            <div className={css.ImageSection}>
                <img src="./image 2.png" alt="crianças" className={css.Foto} />
            </div>
        </div>
    )
}