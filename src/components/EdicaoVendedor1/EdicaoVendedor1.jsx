import React, { useState, useEffect } from 'react';
import css from './EdicaoVendedor1.module.css'; // 💡 Importado como objeto 'css'

export default function EdicaoVendedor() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Estados para o controle do Modal de Edição
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
        cpf: '',
        senha: '',
        confirmar_senha: '',
        imagem: null
    });

    const [msgSucesso, setMsgSucesso] = useState('');
    const [msgErroModal, setMsgErroModal] = useState('');

    // Busca a lista de usuários ao carregar a página
    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/', {
                method: 'GET',
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao carregar os vendedores.');
            }

            setUsuarios(data.usuarios || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const mapearUsuario = (userArray) => {
        return {
            id_usuario: userArray[0],
            email: userArray[1],
            cpf: userArray[2],
            nome: userArray[3],
            telefone: userArray[4]
        };
    };

    const handleOpenModal = (userArray) => {
        const user = mapearUsuario(userArray);
        setSelectedUser(user);
        setFormData({
            nome: user.nome || '',
            email: user.email || '',
            telefone: user.telefone || '',
            cpf: user.cpf || '',
            senha: '',
            confirmar_senha: '',
            imagem: null
        });
        setMsgSucesso('');
        setMsgErroModal('');
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, imagem: e.target.files[0] });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setMsgErroModal('');
        setMsgSucesso('');

        if (formData.senha !== formData.confirmar_senha) {
            setMsgErroModal('As senhas digitadas não coincidem.');
            return;
        }

        try {
            const dataToSend = new FormData();
            dataToSend.append('nome', formData.nome);
            dataToSend.append('email', formData.email);
            dataToSend.append('telefone', formData.telefone);
            dataToSend.append('cpf', formData.cpf);
            dataToSend.append('senha', formData.senha);
            dataToSend.append('confirmar_senha', formData.confirmar_senha);
            if (formData.imagem) {
                dataToSend.append('imagem', formData.imagem);
            }

            const response = await fetch(`http://localhost:5000/editar_usuario/${selectedUser.id_usuario}`, {
                method: 'PUT',
                credentials: 'include',
                body: dataToSend
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.message || 'Erro ao atualizar dados.');
            }

            setMsgSucesso('Vendedor atualizado com sucesso!');
            fetchUsuarios();

            setTimeout(() => handleCloseModal(), 1500);
        } catch (err) {
            setMsgErroModal(err.message);
        }
    };

    return (
        <div className={css.editarVendedorContainer}>
            <h1 className={css.mainTitle}>Editar Vendedor</h1>

            {loading && <p className={css.statusText}>Carregando vendedores...</p>}
            {error && <p className={`${css.statusText} ${css.errorText}`}>Erro: {error}</p>}

            {!loading && !error && (
                <div className={css.vendedoresGrid}>
                    {usuarios.map((userArray, index) => {
                        const user = mapearUsuario(userArray);
                        return (
                            <div key={user.id_usuario || index} className={css.vendedorCard}>
                                <div className={css.avatarContainer}>
                                    <div className={css.avatarPlaceholder}>
                                        <svg viewBox="0 0 24 24" className={css.avatarIcon}>
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-3-8-3z" />
                                        </svg>
                                    </div>
                                </div>

                                <div className={css.vendedorInfo}>
                                    <p><strong>Nome:</strong> {user.nome}</p>
                                    <p><strong>Telefone:</strong> {user.telefone}</p>
                                    <p><strong>CPF:</strong> {user.cpf}</p>
                                    <p><strong>E-mail:</strong> {user.email}</p>
                                </div>

                                <button className={css.btnEditar} onClick={() => handleOpenModal(userArray)}>
                                    Editar
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal Suspenso para Formulário de Edição */}
            {selectedUser && (
                <div className={css.modalOverlay}>
                    <div className={css.modalContent}>
                        <h2>Editar Cadastro</h2>
                        <form onSubmit={handleFormSubmit} className={css.editForm}>

                            <div className={css.formGroup}>
                                <label>Nome:</label>
                                <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} required />
                            </div>

                            <div className={css.formGroup}>
                                <label>E-mail:</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                            </div>

                            <div className={css.formGroup}>
                                <label>Telefone:</label>
                                <input type="text" name="telefone" value={formData.telefone} onChange={handleInputChange} />
                            </div>

                            <div className={css.formGroup}>
                                <label>CPF:</label>
                                <input type="text" name="cpf" value={formData.cpf} onChange={handleInputChange} />
                            </div>

                            <div className={css.formGroup}>
                                <label>Nova Senha:</label>
                                <input type="password" name="senha" value={formData.senha} onChange={handleInputChange} placeholder="Mínimo de 8 caracteres" required />
                            </div>

                            <div className={css.formGroup}>
                                <label>Confirmar Senha:</label>
                                <input type="password" name="confirmar_senha" value={formData.confirmar_senha} onChange={handleInputChange} required />
                            </div>

                            <div className={css.formGroup}>
                                <label>Foto do Vendedor (Opcional):</label>
                                <input type="file" accept="image/*" onChange={handleFileChange} />
                            </div>

                            {msgErroModal && <p className={`${css.modalMsg} ${css.errorMsg}`}>{msgErroModal}</p>}
                            {msgSucesso && <p className={`${css.modalMsg} ${css.successMsg}`}>{msgSucesso}</p>}

                            <div className={css.modalActions}>
                                <button type="button" className={css.btnCancelar} onClick={handleCloseModal}>
                                    Cancelar
                                </button>
                                <button type="submit" className={css.btnSalvar}>
                                    Salvar Alterações
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}