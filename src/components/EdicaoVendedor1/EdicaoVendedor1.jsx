import { useState } from 'react'
import css from './EdicaoVendedor1.module.css'

const API_URL = 'http://127.0.0.1:5000'

export default function EdicaoVendedor1({ idUsuario }) {
    const [form, setForm] = useState({
        nome: '',
        email: '',
        telefone: '',
        cpf: '',
        senha: '',
        confirmar_senha: '',
    })
    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] = useState('')
    const [carregando, setCarregando] = useState(false)

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleEditar() {
        setErro('')
        setSucesso('')

        const { nome, email, telefone, cpf, senha, confirmar_senha } = form

        if (!nome || !email) {
            setErro('Nome e e-mail são obrigatórios.')
            return
        }

        if (senha && senha !== confirmar_senha) {
            setErro('As senhas não coincidem.')
            return
        }

        setCarregando(true)

        try {
            const body = { nome, email, telefone, cpf }

            if (senha) {
                body.senha = senha
                body.confirmar_senha = confirmar_senha
            }

            const resposta = await fetch(`${API_URL}/editar_usuario/${idUsuario}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // 🔥 IMPORTANTE
                body: JSON.stringify(body),
            })

            let dados = {}

            try {
                dados = await resposta.json()
            } catch {
                dados = {}
            }

            if (!resposta.ok) {
                if (resposta.status === 401) {
                    setErro('Sessão expirada. Faça login novamente.')
                } else {
                    setErro(dados.error || 'Erro ao atualizar usuário.')
                }
                return
            }

            setSucesso('Usuário atualizado com sucesso!')
            setForm(f => ({ ...f, senha: '', confirmar_senha: '' }))

        } catch {
            setErro('Não foi possível conectar ao servidor.')
        } finally {
            setCarregando(false)
        }
    }

    return (
        <div className={css.container}>
            <h1 className={css.titulo}>Edição Vendedor</h1>

            <div className={css.form}>
                <div className={css.col}>
                    <label className={css.label}>Nome</label>
                    <input
                        className={css.input}
                        type="text"
                        name="nome"
                        value={form.nome}
                        onChange={handleChange}
                        disabled={carregando}
                    />

                    <label className={css.label}>Telefone</label>
                    <input
                        className={css.input}
                        type="text"
                        name="telefone"
                        value={form.telefone}
                        onChange={handleChange}
                        disabled={carregando}
                    />

                    <label className={css.label}>CPF</label>
                    <input
                        className={css.input}
                        type="text"
                        name="cpf"
                        value={form.cpf}
                        onChange={handleChange}
                        disabled={carregando}
                    />
                </div>

                <div className={css.col}>
                    <label className={css.label}>E-mail</label>
                    <input
                        className={css.input}
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        disabled={carregando}
                    />

                    <label className={css.label}>Nova Senha</label>
                    <input
                        className={css.input}
                        type="password"
                        name="senha"
                        value={form.senha}
                        onChange={handleChange}
                        disabled={carregando}
                        placeholder="Deixe em branco para não alterar"
                    />

                    <label className={css.label}>Confirmar Senha</label>
                    <input
                        className={css.input}
                        type="password"
                        name="confirmar_senha"
                        value={form.confirmar_senha}
                        onChange={handleChange}
                        disabled={carregando}
                        placeholder="Deixe em branco para não alterar"
                    />
                </div>
            </div>

            {erro && <p className={css.erro}>{erro}</p>}
            {sucesso && <p className={css.sucesso}>{sucesso}</p>}

            <button
                className={css.btn}
                onClick={handleEditar}
                disabled={carregando}
            >
                {carregando ? 'Salvando...' : 'Editar'}
            </button>
        </div>
    )
}