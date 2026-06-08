import { useState } from 'react'
import css from './CadastroCliente1.module.css'

const API_URL = 'http://localhost:5000'

export default function CadastroCliente1() {
    const [form, setForm] = useState({
        nome: '',
        telefone: '',
        cpf: '',
        endereco: '',
        email: '',
    })

    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] = useState('')
    const [carregando, setCarregando] = useState(false)

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleCadastrar() {
        setErro('')
        setSucesso('')

        const { nome, telefone, cpf, endereco, email } = form

        if (!nome || !telefone || !cpf || !email) {
            setErro('Preencha todos os campos obrigatórios.')
            return
        }

        setCarregando(true)

        try {
            const resposta = await fetch(`${API_URL}/cadastro_cliente`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, telefone, cpf, endereco, email }),
            })


            let dados = {}

            try {
                dados = await resposta.json()
            } catch {
                throw new Error('Resposta inválida do servidor')
            }

            if (!resposta.ok) {
                setErro(dados.error || 'Erro ao realizar cadastro.')
                return
            }

            setSucesso('Cliente cadastrado com sucesso!')
            setForm({
                nome: '',
                telefone: '',
                cpf: '',
                endereco: '',
                email: ''
            })

        } catch (e) {
            console.error(e)
            setErro('Não foi possível conectar ao servidor.')
        } finally {
            setCarregando(false)
        }
    }

    return (
        <div className={css.container}>
            <h1 className={css.titulo}>Cadastro Cliente</h1>

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

                    <label className={css.label}>Endereço</label>
                    <input
                        className={css.input}
                        type="text"
                        name="endereco"
                        value={form.endereco}
                        onChange={handleChange}
                        disabled={carregando}
                    />
                </div>
            </div>

            {erro && <p className={css.erro}>{erro}</p>}
            {sucesso && <p className={css.sucesso}>{sucesso}</p>}

            <button
                className={css.btn}
                onClick={handleCadastrar}
                disabled={carregando}
            >
                {carregando ? 'Cadastrando...' : 'Cadastrar'}
            </button>
        </div>
    )
}