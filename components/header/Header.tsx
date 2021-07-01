import Link from 'next/link'
import {useRouter} from 'next/router'
import {useSelector, useDispatch} from 'react-redux'
import {useSession, signOut} from 'next-auth/client'

// Typescript Interfaces
import { IrootState } from '../../interfaces/rootState'
import { unauthorized, userLogout } from '../../redux/actions/action'

// Styles & Static Files
import styles from './Header.module.scss'

export const Header = () => {

    const [session, loading] = useSession()
    console.log(session)
    const router = useRouter()
    const dispatch = useDispatch()
    const isAuth = useSelector((state: IrootState) => state.auth)
    const toRoot = () => {
        router.push('/')
    }

    const logout = async () => {
        document.cookie = `token=`
        dispatch(userLogout())
        dispatch(unauthorized())
        await router.push('/login')
    }

    return (
        <nav className={styles.navbar} >
            <div className={styles.navlogo}>
                <h1 onClick={toRoot} > MoneyTrack </h1>
            </div>

            { session || isAuth ? <div className={styles.navlinks} >
                <Link href="/home"> Home </Link>
                <p onClick={() => session ? signOut() : logout() } > Logout </p>
            </div> : <div className={styles.navlinks} >
                <Link href="/login" > Login </Link>
                <Link href="/register" > Sign Up </Link>
            </div> }
        </nav>
    )

}