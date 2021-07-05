import {useState, ChangeEvent, FormEvent} from 'react'
import Head from 'next/head'
import {GetServerSideProps, NextPage} from 'next'
import Image from 'next/image'
import axios from 'axios'
import {useRouter} from 'next/router'
import {useDispatch} from 'react-redux'
import { signIn, getSession } from 'next-auth/client'

// Icons
import { MdClose } from 'react-icons/md'
import { FaGoogle } from 'react-icons/fa'

// Redux
import { authorized, userLoggedIn } from '../../redux/actions/action'

// Styles & Static Files
import styles from  './Login.module.scss'
import moneyCalculatorImg from '../../public/Mar-Business_11.jpg'

export const getServerSideProps: GetServerSideProps = async ({req}) => {

    const session = await getSession({req})

    if (session || req.cookies.token) {
        return {
            props: {},
            redirect: {
                destination: '/home',
                permanent: false
            }
        }
    }

    return {
        props: { session }
    }

}

const Login: NextPage = () => {

    const router = useRouter()
    const dispatch = useDispatch()
    const [errors, setErrors] = useState([] as string[])
    const [login, setLogin] = useState({
        email: "" as string,
        password: "" as string
    })

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
                <meta charSet="utf-8"/>
                <meta name="description" content="Login to your account." />
                <meta name="keywords" content="login moneytrack, login moneytrack, money, track, track expenses, money tracker" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://image.freepik.com/free-vector/dollars-illustration-set_74855-4404.jpg" />
                <meta property="og:title" content="Login to MoneyTrack." />
                <meta property="og:description" content="Login to MoneyTrack - A platform to track you expenses." />
            </Head>

            <main className={styles.container} >
                <div className={styles.loginform}>
                    <div id={styles.form}>
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
                        <button onClick={loginSubmit} > Login </button>
                        <button className={styles.google} onClick={() => signIn("google", {callbackUrl: 'http://localhost:3000/login'})}> Sign In with Google <FaGoogle style={{marginLeft: '0.2rem'}} /> </button>   
                    
                    </div>
                    {/* <button onClick={() => signIn("google", {callbackUrl: 'http://localhost:3000/login'})}> Sign In with Google </button> */}
                    {/* <button onClick={() => signIn("facebook")}> Sign In with Facebook </button> */}
                </div>

                <div className={styles.loginimg}>
                    <Image src={moneyCalculatorImg} alt="calculating money" />
                </div>
            </main>
        </div>
    )
}

export default Login