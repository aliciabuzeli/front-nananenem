import { useState } from 'react'
import css from './CadastroVendedor1.module.css'

const API_URL = 'http://localhost:5000'

export default function CadastroVendedor1() {
    const [form, setForm] = useState({
        nome: '',
        telefone: '',
        cpf: '',
        email: '',
        senha: '',
        confirmar_senha: '',
    })

    const [imagem, setImagem] = useState(null)
    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] = useState('')
    const [carregando, setCarregando] = useState(false)

    function handleChange(e) {
        const { name, value } = e.target

        // 🔒 Validação de limite de caracteres e apenas números para CPF e Telefone
        if (name === 'cpf') {
            const apenasNumeros = value.replace(/\D/g, '') // Remove o que não for número
            if (apenasNumeros.length > 11) return // Bloqueia se passar de 11 dígitos
            setForm({ ...form, [name]: apenasNumeros })
            return
        }

        if (name === 'telefone') {
            const apenasNumeros = value.replace(/\D/g, '') // Remove o que não for número
            if (apenasNumeros.length > 11) return // Bloqueia se passar de 11 dígitos (DDD + 9 dígitos)
            setForm({ ...form, [name]: apenasNumeros })
            return
        }

        // Comportamento normal para os outros campos
        setForm({ ...form, [name]: value })
    }

    function handleImagem(e) {
        setImagem(e.target.files[0] || null)
    }

    async function handleCadastrar() {
        setErro('')
        setSucesso('')

        const { nome, telefone, cpf, email, senha, confirmar_senha } = form

        if (!nome || !telefone || !cpf || !email || !senha || !confirmar_senha) {
            setErro('Preencha todos os campos obrigatórios.')
            return
        }

        if (senha !== confirmar_senha) {
            setErro('As senhas não coincidem.')
            return
        }

        const token = localStorage.getItem('access_token')

        const formData = new FormData()
        formData.append('nome', nome)
        formData.append('telefone', telefone)
        formData.append('cpf', cpf)
        formData.append('email', email)
        formData.append('senha', senha)
        formData.append('confirmar_senha', confirmar_senha)

        if (imagem) {
            formData.append('imagem', imagem)
        }

        setCarregando(true)

        try {
            const resposta = await fetch(`${API_URL}/cadastro_vendedor`, {
                method: 'POST',
                headers: token
                    ? { Authorization: `Bearer ${token}` }
                    : {},
                credentials: 'include',
                body: formData,
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
                    setErro(dados.error || 'Erro ao realizar cadastro.')
                }
                return
            }

            setSucesso('Vendedor cadastrado com sucesso!')

            setForm({
                nome: '',
                telefone: '',
                cpf: '',
                email: '',
                senha: '',
                confirmar_senha: '',
            })

            setImagem(null)

        } catch (err) {
            console.error('Erro:', err)
            setErro('Não foi possível conectar ao servidor.')
        } finally {
            setCarregando(false)
        }
    }

    return (
        <div className={css.container}>
            <h1 className={css.h1}>Cadastro Vendedor</h1>

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
                        maxLength={11} // impede visualmente de digitar mais que 11 no HTML
                        placeholder="Ex: 11999998888"
                    />

                    <label className={css.label}>CPF</label>
                    <input
                        className={css.input}
                        type="text"
                        name="cpf"
                        value={form.cpf}
                        onChange={handleChange}
                        disabled={carregando}
                        maxLength={11} // impede visualmente de digitar mais que 11 no HTML
                        placeholder="Apenas números"
                    />

                    <label className={css.label}>Foto (opcional)</label>
                    <input
                        className={css.input}
                        type="file"
                        accept="image/*"
                        onChange={handleImagem}
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

                    <label className={css.label}>Senha</label>
                    <input
                        className={css.input}
                        type="password"
                        name="senha"
                        value={form.senha}
                        onChange={handleChange}
                        disabled={carregando}
                        placeholder="Mín. 8 caracteres"
                    />

                    <label className={css.label}>Confirmar Senha</label>
                    <input
                        className={css.input}
                        type="password"
                        name="confirmar_senha"
                        value={form.confirmar_senha}
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