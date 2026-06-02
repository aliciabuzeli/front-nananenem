import css from "./SidebarVen.module.css"

export default function SidebarVen() {
    return (
        <aside className={css.sidebar}>
            <div className={css.item}>
                <span className={css.blue}></span>
                <p>Cliente</p>
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
        </aside>

    )
}