import Link from 'next/link'
import { useEffect, useState } from 'react'
import {useRouter} from 'next/router'
import {useSelector, useDispatch} from 'react-redux'
import {useSession, signOut} from 'next-auth/client'

// Typescript Interfaces
import { IrootState } from '../../interfaces/rootState'
import { unauthorized, userLogout } from '../../redux/actions/action'

// Styles & Static Files
import styles from './Header.module.scss'
import { MdMenu } from 'react-icons/md'

export const Header = () => {

    const [currW, setCurrW] = useState(window.innerWidth)
    const [dropdown, setDropdown] = useState(false)
    const [session] = useSession()
    const router = useRouter()
    const dispatch = useDispatch()
    const username = useSelector((state: IrootState) => state.user.first_name)
    const isAuth = useSelector((state: IrootState) => state.auth)
    const toRoot = () => {
        router.push('/')
    }

    useEffect(() => {
        window.onresize = () => {
            setCurrW(window.innerWidth)
        }   
    })

    const logout = async () => {
        document.cookie = `token=`
        dispatch(userLogout())
        dispatch(unauthorized())
        await router.push('/login')
    }

    const logoutOauth = async () => {
        signOut()
        dispatch(userLogout())
        dispatch(unauthorized())
        await router.push('/login')
    }

    return (
        <nav className={styles.navbar} >
            <div className={styles.navlogo}>
                <h1 onClick={toRoot} > MoneyTrack </h1>
            </div>

            { session || isAuth ? currW < 700 ? <div className={styles.menu}>
                <MdMenu className={styles.cursor} onClick={() => setDropdown(!dropdown)} style={{margin: 'auto'}} size={35} />
                { dropdown ? <div className={styles.menulinks}>
                    <ul>
                        <li onClick={() => router.push('/home')} > Home </li>
                        <li> { session ? session.user?.name : username } </li>
                        <li onClick={() => session ? logoutOauth() : logout() } > Logout </li>
                    </ul>
                </div> : null }
            </div> : <div className={styles.navlinks} >
                <Link href="/home"> Home </Link>
                <p onClick={() => session ? logoutOauth() : logout() } > Logout </p>
            </div> : <div className={styles.navlinks} >
                <Link href="/login" > Login </Link>
                <Link href="/register" > Sign Up </Link>
            </div> }

            {/* { session || isAuth ? <div className={styles.navlinks} >
                <Link href="/home"> Home </Link>
                <p onClick={() => session ? logoutOauth() : logout() } > Logout </p>
            </div> : <div className={styles.navlinks} >
                <Link href="/login" > Login </Link>
                <Link href="/register" > Sign Up </Link>
            </div> } */}
        </nav>
    )

}