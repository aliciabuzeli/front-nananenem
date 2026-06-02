import css from "./CadastroVendedor1.module.css";

export default function CadastroVendedor1() {
    return (
        <div className={css.container}>

            <h1 className={css.h1}>Cadastro Vendedor</h1>

            <form className={css.form}>

                <div className={css.col}>
                    <label>Nome</label>
                    <input type={css.text} />

                    <label>Telefone</label>
                    <input type={css.text} />

                    <label>CPF</label>
                    <input type={css.text} />
                </div>

                <div className={css.col}>
                    <label>E-mail</label>
                    <input type={css.email} />

                    <label>Senha</label>
                    <input type={css.password} />

                    <label>Confirmar Senha</label>
                    <input type={css.password} />
                </div>

            </form>

            <button className={css.btn}>Cadastrar</button>

        </div>
    );
}