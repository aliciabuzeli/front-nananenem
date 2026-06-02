import { useState } from "react";
import { useNavigate } from "react-router-dom";
import css from "./Sidebar.module.css";
import { apiFetch } from "../api/api.js";

export default function Sidebar() {
    const [saindo, setSaindo] = useState(false);
    const [erro, setErro]     = useState(null);
    const navigate            = useNavigate();

    async function handleLogout() {
        if (!window.confirm("Deseja realmente sair?")) return;
        setSaindo(true);
        setErro(null);

        try {
            // Tenta chamar /logout no backend caso exista (limpa cookie pelo servidor)
            await apiFetch("/logout", { method: "POST" });
        } catch {
            // Se a rota não existir, ignora — o cookie é apagado pelo frontend abaixo
        }

        // Apaga o cookie access_token pelo frontend (funciona quando httponly=False)
        // Para cookies httpOnly, a limpeza definitiva é feita pelo servidor.
        document.cookie =
            "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // Redireciona para o login
        navigate("/");
    }

    return (
        <aside className={css.sidebar}>
            <div className={css.item}>
                <span className={css.blue}></span>
                <p>Vendedor</p>
            </div>

            <div className={css.item}>
                <span className={css.pink}></span>
                <p>Produtos</p>
            </div>

            <div className={css.item}>
                <span className={css.green}></span>
                <p>Coleções</p>
            </div>

            <div className={css.item}>
                <span className={css.yellow}></span>
                <p>Pedidos</p>
            </div>

            <div className={css.item}>
                <span className={css.red}></span>
                <p>Dashboard</p>
            </div>

            {/* ── Logout ── */}
            <div className={`${css.item} ${css.itemLogout}`} onClick={handleLogout}>
                <span className={css.logout}></span>
                <p>{saindo ? "Saindo…" : "Sair"}</p>
            </div>

            {erro && <p className={css.erroLogout}>⚠ {erro}</p>}
        </aside>
    );
}