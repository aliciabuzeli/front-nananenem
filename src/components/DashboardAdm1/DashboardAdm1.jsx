import css from "./DashboardAdm1.module.css"
import Sidebar from "../Sidebar/Sidebar.jsx";

export default function DashboardAdm1() {
    return(
        <div className={css.container}>

            <Sidebar />

            <main className={css.main}>
                <h1>
                    Olá, <span>ADM!</span>
                </h1>

                <h2>Ações rápidas</h2>

                <div className={css.acoes}>
                    <button className={css.botao}>
                        <span className={css.blue}></span> Vendedor
                    </button>

                    <button className={css.botao}>
                        <span className={css.pink}></span> Produtos
                    </button>

                    <button className={css.botao}>
                        <span className={css.green}></span> Coleções
                    </button>

                    <button className={css.botao}>
                        <span className={css.yellow}></span> Pedidos
                    </button>
                </div>
            </main>

        </div>
    )
}