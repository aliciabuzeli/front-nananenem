import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import css from './EdicaoVendedor1.module.css'

const API_URL = 'http://127.0.0.1:5000'

export default function EdicaoVendedor1() {
    const { id } = useParams() // 🔥 pega o ID da URL

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

    const token = localStorage.getItem('access_token')

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    // 🔥 CARREGAR DADOS DO USUÁRIO
    useEffect(() => {
        async function carregar() {
            try {
                const res = await fetch(`${API_URL}/usuario/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                const dados = await res.json()

                if (res.ok) {
                    setForm(f => ({
                        ...f,
                        nome: dados.NOME || '',
                        email: dados.EMAIL || '',
                        telefone: dados.TELEFONE || '',
                        cpf: dados.CPF || '',
                    }))
                }
            } catch {
                setErro('Erro ao carregar dados')
            }
        }

        if (id) carregar()
    }, [id])

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

            const resposta = await fetch(`${API_URL}/editar_usuario/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // 🔥 FALTAVA ISSO
                },
                body: JSON.stringify(body),
            })

            const dados = await resposta.json()

            if (!resposta.ok) {
                setErro(dados.error || 'Erro ao atualizar usuário.')
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
                    <label>Nome</label>
                    <input name="nome" value={form.nome} onChange={handleChange} />

                    <label>Telefone</label>
                    <input name="telefone" value={form.telefone} onChange={handleChange} />

                    <label>CPF</label>
                    <input name="cpf" value={form.cpf} onChange={handleChange} />
                </div>

                <div className={css.col}>
                    <label>Email</label>
                    <input name="email" value={form.email} onChange={handleChange} />

                    <label>Nova Senha</label>
                    <input type="password" name="senha" value={form.senha} onChange={handleChange} />

                    <label>Confirmar Senha</label>
                    <input type="password" name="confirmar_senha" value={form.confirmar_senha} onChange={handleChange} />
                </div>
            </div>

            {erro && <p className={css.erro}>{erro}</p>}
            {sucesso && <p className={css.sucesso}>{sucesso}</p>}

            <button onClick={handleEditar} disabled={carregando}>
                {carregando ? 'Salvando...' : 'Editar'}
            </button>
        </div>
    )
}