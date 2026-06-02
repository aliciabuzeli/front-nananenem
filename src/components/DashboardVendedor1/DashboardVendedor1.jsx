import { useState } from "react";
import css from "./DashboardVendedor1.module.css";
import SidebarVen from "../SidebarVen/SidebarVen.jsx";

const API_BASE = "http://127.0.0.1:5000";

async function apiFetch(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        credentials: "include", // envia cookie a
        // ss_token automaticamente
        ...options,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro na requisição");
    return data;
}

export default function DashboardVendedor1() {
    const [usuarios, setUsuarios] = useState([]);
    const [busca, setBusca] = useState("");
    const [erro, setErro] = useState(null);
    const [sucesso, setSucesso] = useState(null);
    const [carregando, setCarregando] = useState(false);

    // Modal de cadastro de vendedor
    const [modalAberto, setModalAberto] = useState(false);
    const [formVendedor, setFormVendedor] = useState({
        nome: "",
        email: "",
        cpf: "",
        senha: "",
        confirmar_senha: "",
        telefone: "",
        imagem: null,
    });

    // Modal de cadastro de cliente
    const [modalClienteAberto, setModalClienteAberto] = useState(false);
    const [formCliente, setFormCliente] = useState({
        nome: "",
        email: "",
        cpf: "",
        telefone: "",
        endereco: "",
    });

    // ── Listar usuários ──────────────────────────────────────────
    async function listarUsuarios() {
        setCarregando(true);
        setErro(null);
        try {
            const data = await apiFetch("/");
            setUsuarios(data.usuarios || []);
        } catch (e) {
            setErro(e.message);
        } finally {
            setCarregando(false);
        }
    }

    // ── Buscar usuário por nome ──────────────────────────────────
    async function buscarUsuario() {
        if (!busca.trim()) return listarUsuarios();
        setCarregando(true);
        setErro(null);
        try {
            const data = await apiFetch(`/buscar_usuario?nome=${encodeURIComponent(busca)}`);
            setUsuarios(data.usuarios || []);
        } catch (e) {
            setErro(e.message);
        } finally {
            setCarregando(false);
        }
    }

    // ── Excluir usuário ──────────────────────────────────────────
    async function excluirUsuario(id) {
        if (!window.confirm("Confirmar exclusão?")) return;
        setErro(null);
        try {
            await apiFetch(`/${id}`, { method: "DELETE" });
            mostrarSucesso("Usuário excluído com sucesso.");
            listarUsuarios();
        } catch (e) {
            setErro(e.message);
        }
    }

    // ── Cadastrar vendedor ───────────────────────────────────────
    async function cadastrarVendedor(e) {
        e.preventDefault();
        setErro(null);
        const fd = new FormData();
        Object.entries(formVendedor).forEach(([k, v]) => {
            if (v !== null && v !== "") fd.append(k, v);
        });
        try {
            await apiFetch("/cadastro_vendedor", { method: "POST", body: fd });
            mostrarSucesso("Vendedor cadastrado! Verifique o e-mail para confirmação.");
            setModalAberto(false);
            setFormVendedor({ nome: "", email: "", cpf: "", senha: "", confirmar_senha: "", telefone: "", imagem: null });
            listarUsuarios();
        } catch (e) {
            setErro(e.message);
        }
    }

    // ── Cadastrar cliente ────────────────────────────────────────
    async function cadastrarCliente(e) {
        e.preventDefault();
        setErro(null);
        try {
            await apiFetch("/cadastro_cliente", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formCliente),
            });
            mostrarSucesso("Cliente cadastrado com sucesso!");
            setModalClienteAberto(false);
            setFormCliente({ nome: "", email: "", cpf: "", telefone: "", endereco: "" });
            listarUsuarios();
        } catch (e) {
            setErro(e.message);
        }
    }

    function mostrarSucesso(msg) {
        setSucesso(msg);
        setTimeout(() => setSucesso(null), 3500);
    }

    // useEffect(() => {
    //     listarUsuarios();
    // }, []);

    // ── Helpers de label ────────────────────────────────────────
    const tipoLabel = (t) => ({ 0: "Admin", 1: "Vendedor", 2: "Cliente" }[t] ?? "—");

    return (
        <div className={css.container}>
            <SidebarVen />

            <main className={css.main}>
                <h1>
                    Olá, <span>ADM!</span>
                </h1>

                {/* ── Notificações ── */}
                {erro && <div className={css.alerta} role="alert">⚠ {erro}</div>}
                {sucesso && <div className={css.alertaSucesso} role="status">✓ {sucesso}</div>}

                {/* ── Ações rápidas ── */}
                <h2>Ações rápidas</h2>
                <div className={css.acoes}>
                    <button className={css.botao} onClick={() => setModalClienteAberto(true)}>
                        <span className={css.blue}></span> Cliente
                    </button>
                    <button className={css.botao} onClick={() => {}}>
                        <span className={css.pink}></span> Produtos
                    </button>
                    <button className={css.botao} onClick={() => {}}>
                        <span className={css.green}></span> Coleções
                    </button>
                    <button className={css.botao} onClick={() => {}}>
                        <span className={css.yellow}></span> Pedidos
                    </button>
                    <button className={css.botao} onClick={() => setModalAberto(true)}>
                        <span className={css.purple}></span> Novo Vendedor
                    </button>
                </div>

                {/* ── Busca e listagem de usuários ── */}
                <h2>Usuários</h2>
                <div className={css.barBusca}>
                    <input
                        type="text"
                        placeholder="Buscar por nome…"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && buscarUsuario()}
                        className={css.input}
                    />
                    <button className={css.btnBusca} onClick={buscarUsuario}>Buscar</button>
                    <button className={css.btnSecundario} onClick={listarUsuarios}>Atualizar</button>
                </div>

                {carregando ? (
                    <p className={css.carregando}>Carregando…</p>
                ) : (
                    <div className={css.tabelaWrapper}>
                        <table className={css.tabela}>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>E-mail</th>
                                <th>Tipo</th>
                                <th>Ações</th>
                            </tr>
                            </thead>
                            <tbody>
                            {usuarios.length === 0 ? (
                                <tr><td colSpan={5} style={{ textAlign: "center", padding: "1rem" }}>Nenhum usuário encontrado.</td></tr>
                            ) : (
                                usuarios.map((u) => (
                                    <tr key={u[0]}>
                                        <td>{u[0]}</td>
                                        <td>{u[3]}</td>
                                        <td>{u[1]}</td>
                                        <td><span className={css[`badge${u[5]}`]}>{tipoLabel(u[5])}</span></td>
                                        <td>
                                            <button
                                                className={css.btnPerigo}
                                                onClick={() => excluirUsuario(u[0])}
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {/* ── Modal: Cadastro de Vendedor ── */}
            {modalAberto && (
                <div className={css.overlay} onClick={() => setModalAberto(false)}>
                    <div className={css.modal} onClick={(e) => e.stopPropagation()}>
                        <h3>Cadastrar Vendedor</h3>
                        <form onSubmit={cadastrarVendedor} encType="multipart/form-data">
                            {[
                                ["nome", "Nome *", "text"],
                                ["email", "E-mail *", "email"],
                                ["cpf", "CPF", "text"],
                                ["telefone", "Telefone", "text"],
                                ["senha", "Senha *", "password"],
                                ["confirmar_senha", "Confirmar Senha *", "password"],
                            ].map(([campo, label, tipo]) => (
                                <label key={campo} className={css.label}>
                                    {label}
                                    <input
                                        type={tipo}
                                        value={formVendedor[campo]}
                                        onChange={(e) => setFormVendedor({ ...formVendedor, [campo]: e.target.value })}
                                        className={css.input}
                                        required={label.includes("*")}
                                    />
                                </label>
                            ))}
                            <label className={css.label}>
                                Foto de perfil
                                <input
                                    type="file"
                                    accept="image/*"
                                    className={css.input}
                                    onChange={(e) => setFormVendedor({ ...formVendedor, imagem: e.target.files[0] || null })}
                                />
                            </label>
                            <div className={css.modalAcoes}>
                                <button type="submit" className={css.btnPrimario}>Cadastrar</button>
                                <button type="button" className={css.btnSecundario} onClick={() => setModalAberto(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Modal: Cadastro de Cliente ── */}
            {modalClienteAberto && (
                <div className={css.overlay} onClick={() => setModalClienteAberto(false)}>
                    <div className={css.modal} onClick={(e) => e.stopPropagation()}>
                        <h3>Cadastrar Cliente</h3>
                        <form onSubmit={cadastrarCliente}>
                            {[
                                ["nome", "Nome *", "text"],
                                ["email", "E-mail *", "email"],
                                ["cpf", "CPF *", "text"],
                                ["telefone", "Telefone *", "text"],
                                ["endereco", "Endereço *", "text"],
                            ].map(([campo, label, tipo]) => (
                                <label key={campo} className={css.label}>
                                    {label}
                                    <input
                                        type={tipo}
                                        value={formCliente[campo]}
                                        onChange={(e) => setFormCliente({ ...formCliente, [campo]: e.target.value })}
                                        className={css.input}
                                        required
                                    />
                                </label>
                            ))}
                            <div className={css.modalAcoes}>
                                <button type="submit" className={css.btnPrimario}>Cadastrar</button>
                                <button type="button" className={css.btnSecundario} onClick={() => setModalClienteAberto(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}