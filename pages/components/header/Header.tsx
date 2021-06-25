import Link from 'next/link'
import {useRouter} from 'next/router'

// Styles & Static Files
import styles from './Header.module.scss'

export const Header = () => {

    const router = useRouter()

    const toRoot = () => {
        router.push('/')
    }

    return (
        <nav className={styles.navbar} >
            <div className={styles.navlogo}>
                <h1 onClick={toRoot} > MoneyTrack </h1>
            </div>

            <div className={styles.navlinks}>
                <Link href="/login" > Login </Link>
                <Link href="/register" > Sign Up </Link>
            </div>
        </nav>
    )

}