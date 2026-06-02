import css from "./Vendedor1.module.css"
import Sidebar from "../Sidebar/Sidebar.jsx";

export default function Vendedor1() {
    return (
        <div className={css.container}>

            <Sidebar />

            <h1>Vendedor</h1>

            <div className={css.buttons}>
                <button className={css.btn}>
                    <span className={css.circle}></span>
                    Cadastro Vendedor
                </button>

                <button className={css.btn}>
                    <span className={css.circle}></span>
                    Edição Vendedor
                </button>

                <button className={css.btn}>
                    <span className={css.circle}></span>
                    Excluir Vendedor
                </button>
            </div>

        </div>

    )
}