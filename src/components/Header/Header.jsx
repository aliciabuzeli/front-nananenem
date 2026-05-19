import css from './Header.module.css'

export default function Header() {
    return (
        <div className={css.Header}>
            <div className={css.img}>
                <img src="./image 4.png" alt="logo" />
            </div>
            <div className={css.botao}>
                <button className={css.btn}>Login</button>
            </div>
        </div>


    )
}