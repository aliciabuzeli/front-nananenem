import css from './header.module.css';

export default function Header() {
    return (
        <header className={css.Header}>

            <div className={css.img}>
                <img src="/image%204.png" alt="logo" />
            </div>

            <div className={css.botao}>
                <button className={css.btn}>Login</button>
            </div>

        </header>
    );
}