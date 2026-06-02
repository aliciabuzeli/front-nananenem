import css from "./EditarCliente1.module.css";

export default function EditarCliente() {
    return (
        <div className={css.container}>
            <div className={css.editarbox}>
                <h1 className={css.titulo}>Editar Cliente</h1>

                <div className={css.formgrid}>

                    <div className={css.campo}>
                        <label className={css.label}>Nome</label>
                        <input className={css.input} type="text" />
                    </div>

                    <div className={css.campo}>
                        <label className={css.label}>Endereço</label>
                        <input className={css.input}  type="text" />
                    </div>

                    <div className={css.campo}>
                        <label className={css.label}>Telefone</label>
                        <input className={css.input} type="number" />
                    </div>

                    <div className={css.campo}>
                        <label className={css.label}>CNPJ</label>
                        <input className={css.input} type="number" />
                    </div>

                </div>

                <button className={css.btneditar}>
                    Editar
                </button>
            </div>
        </div>
    )
}