import css from './Login1.module.css'

export default function Login() {
    return (
        <div className={css.Container}>
            <div className={css.FormSection}>
                <h1 className={css.Titulo}>Faça seu login</h1>

                <div className={css.Campo}>
                    <label className={css.Label}>E-mail</label>
                    <input className={css.Input} type="email" />
                </div>

                <div className={css.Campo}>
                    <label className={css.Label}>Senha</label>
                    <input className={css.Input} type="password" />
                    <span className={css.Esqueci}>Esqueci minha senha</span>
                </div>

                <button className={css.BtnLogin}>Login</button>
            </div>

            <div className={css.ImageSection}>
                <img src="./image 2.png" alt="crianças" className={css.Foto} />
            </div>
        </div>
    )
}