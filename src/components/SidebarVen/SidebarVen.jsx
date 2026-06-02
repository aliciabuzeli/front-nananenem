import css from './SidebarVen.module.css'

const itens = [
    { label: 'Cliente',    cor: css.blue,   href: '/clientes'  },
    { label: 'Produtos',   cor: css.pink,   href: '/produtos'  },
    { label: 'Coleções',   cor: css.green,  href: '/colecoes'  },
    { label: 'Pedidos',    cor: css.yellow, href: '/pedidos'   },
    { label: 'Dashboard',  cor: css.red,    href: '/dashboard-vendedor' },
]

export default function SidebarVen() {
    function handleLogout() {
        localStorage.removeItem('access_token')
        window.location.href = '/login'
    }

    return (
        <aside className={css.sidebar}>
            {itens.map(({ label, cor, href }) => (
                <div
                    key={label}
                    className={css.item}
                    onClick={() => window.location.href = href}
                    style={{ cursor: 'pointer' }}
                >
                    <span className={cor}></span>
                    <p>{label}</p>
                </div>
            ))}

            <div
                className={css.item}
                onClick={handleLogout}
                style={{ cursor: 'pointer', marginTop: 'auto' }}
            >
                <span className={css.logout}></span>
                <p>Sair</p>
            </div>
        </aside>
    )
}