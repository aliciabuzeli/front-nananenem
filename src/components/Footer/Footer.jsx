import css from './Footer.module.css'

export default function Footer() {
    return (
        <footer className={css.Footer}>
            <div className={css.nuvem}>
                <img src="./image 3 (1).png" alt="nuvem" />
            </div>
            <p className={css.texto}>© 2026 Todos os direitos a NanaNeném. Todos os direitos reservados.</p>
        </footer>
    )
}