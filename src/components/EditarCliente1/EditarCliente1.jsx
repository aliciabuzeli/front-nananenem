import { useState } from 'react'
import css from './EditarCliente1.module.css'

const API_URL = 'http://localhost:5000'

// Recebe o id do cliente via prop: <EditarCliente idUsuario={5} />
export default function EditarCliente({ idUsuario }) {
    const [form, setForm] = useState({
        nome: '',
        endereco: '',
        telefone: '',
        cpf: '',
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

        const { nome, endereco, telefone, cpf } = form

        if (!nome) {
            setErro('O nome é obrigatório.')
            return
        }

        const token = localStorage.getItem('access_token')
        if (!token) {
            setErro('Sessão expirada. Faça login novamente.')
            return
        }

        const formData = new FormData()
        formData.append('nome', nome)
        formData.append('endereco', endereco)
        formData.append('telefone', telefone)
        formData.append('cpf', cpf)

        setCarregando(true)
        try {
            const resposta = await fetch(`${API_URL}/editar_usuario/${idUsuario}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            })

            const dados = await resposta.json()

            if (!resposta.ok) {
                if (resposta.status === 401) {
                    setErro('Sessão expirada. Faça login novamente.')
                } else {
                    setErro(dados.error || 'Erro ao atualizar cliente.')
                }
                return
            }

            setSucesso('Cliente atualizado com sucesso!')

        } catch {
            setErro('Não foi possível conectar ao servidor.')
        } finally {
            setCarregando(false)
        }
    }

    return (
        <div className={css.container}>
            <div className={css.editarbox}>
                <h1 className={css.titulo}>Editar Cliente</h1>

                <div className={css.formgrid}>
                    <div className={css.campo}>
                        <label className={css.label}>Nome</label>
                        <input
                            className={css.input}
                            type="text"
                            name="nome"
                            value={form.nome}
                            onChange={handleChange}
                            disabled={carregando}
                        />
                    </div>

                    <div className={css.campo}>
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

                    <div className={css.campo}>
                        <label className={css.label}>Telefone</label>
                        <input
                            className={css.input}
                            type="text"
                            name="telefone"
                            value={form.telefone}
                            onChange={handleChange}
                            disabled={carregando}
                        />
                    </div>

                    <div className={css.campo}>
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
                </div>

                {erro && <p className={css.erro}>{erro}</p>}
                {sucesso && <p className={css.sucesso}>{sucesso}</p>}

                <button
                    className={css.btneditar}
                    onClick={handleEditar}
                    disabled={carregando}
                >
                    {carregando ? 'Salvando...' : 'Editar'}
                </button>
            </div>
        </div>
    )
}