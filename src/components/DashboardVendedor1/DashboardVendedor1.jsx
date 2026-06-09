import { useState, useEffect } from "react";
import css from "./DashboardVendedor1.module.css";
import SidebarVen from "../SidebarVen/SidebarVen.jsx";

export default function DashboardVendedor1() {
    const [nomeVendedor, setNomeVendedor] = useState('')
    const [erro, setErro] = useState(null);
    const [sucesso, setSucesso] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('access_token')
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]))
                if (payload?.nome) setNomeVendedor(payload.nome)
                else if (payload?.sub) setNomeVendedor(payload.sub)
            } catch {
                setNomeVendedor('')
            }
        }
    }, [])

    const acoes = [
        { label: 'Cliente',  cor: css.blue,   href: '/Cliente' },
        { label: 'Produtos', cor: css.pink,   href: null },
        { label: 'Coleções', cor: css.green,  href: null },
        { label: 'Pedidos',  cor: css.yellow, href: null },
    ]

    return (
        <div className={css.container}>
            <SidebarVen />

            <main className={css.main}>
                <h1>
                    Olá, <span>{nomeVendedor || 'Vendedor'}!</span>
                </h1>

                {erro    && <div className={css.alerta}        role="alert">⚠ {erro}</div>}
                {sucesso && <div className={css.alertaSucesso} role="status">✓ {sucesso}</div>}

                <h2>Ações rápidas</h2>
                <div className={css.acoes}>
                    {acoes.map(item => (
                        <button
                            key={item.label}
                            className={css.botao}
                            onClick={() => item.href && (window.location.href = item.href)}
                        >
                            <span className={item.cor}></span>
                            {item.label}
                        </button>
                    ))}
                </div>
            </main>
        </div>
    );
}