import {useState, ChangeEvent, FormEvent, useEffect} from 'react'
import Head from 'next/head'
import Image from 'next/image'
import axios from 'axios'
import {useRouter} from 'next/router'
import {useDispatch, useSelector} from 'react-redux'

// Icons
import { MdClose } from 'react-icons/md'

// Styles & Static Files
import styles from  './Login.module.scss'

import moneyCalculatorImg from '../../public/Mar-Business_11.jpg'
import { authorized, userLoggedIn } from '../../redux/actions/action'
import { IrootState } from '../../interfaces/rootState'

const Login = () => {

    const router = useRouter()
    const dispatch = useDispatch()
    const isAuth = useSelector((state: IrootState) => state.auth)
    const [errors, setErrors] = useState([] as string[])
    const [login, setLogin] = useState({
        email: "" as string,
        password: "" as string
    })

    useEffect(() => {
        if (isAuth) {
            router.push('/home')
        }
    },[isAuth,router])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target

        setLogin({
            ...login,
            [name]: value
        })
    }

    const loginSubmit = async (e: FormEvent) => {
        e.preventDefault()
        const {data} = await axios.post('/api/login', login)
        
        if (data.status === 'fail') {
            return setErrors([data.msg])
        }

        if (data.status === 'ok') {
            document.cookie = `token=${data.token}`
            dispatch(userLoggedIn(data.data[0]))
            dispatch(authorized())
            router.push({pathname: 'home'})
        }

    }

    const closeError = () => {
        return setErrors([])
    }

    return (
        <div>
            <Head>
                <title> MoneyTrack | Login </title>
                <meta name="description" content="Login to your account." />
            </Head>

            <main className={styles.container} >
                <div className={styles.loginform}>
                    <form onSubmit={loginSubmit} method="post">
                        <h1> Login </h1>

                        <div>
                            { errors.length > 0 ? errors.map(item => {
                                return <div key={item} className={styles.alert}>
                                    <p> {item} <MdClose style={{cursor: 'pointer'}} onClick={closeError} /> </p>
                                </div>
                            }) : "" }
                        </div>



                        <input type="email" placeholder="Email" onChange={handleChange} name="email"/>
                        <input type="password" placeholder="Password" onChange={handleChange} name="password"/>
                        <button type="submit"> Login </button>
                    </form>
                </div>

                <div className={styles.loginimg}>
                    <Image src={moneyCalculatorImg} alt="calculating money" />
                </div>
            </main>
        </div>
    )
}

export default Login