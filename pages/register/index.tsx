import Head from 'next/head'
import {GetServerSideProps} from 'next'
import {useState, ChangeEvent, FormEvent} from 'react'
import axios from 'axios'
import {getSession} from 'next-auth/client'
import router from 'next/router'

// Icons
import { MdClose } from 'react-icons/md'

// Styles & Static Files 
import styles from './Register.module.scss'

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

const Register = () => {

    const [errors, setErrors] = useState([] as string[])
    const [register, setRegister] = useState({
        firstName: "" as string,
        lastName: "" as string,
        email: "" as string,
        password: "" as string
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {

        const {name, value} = e.target

        setRegister({
            ...register,
            [name]: value
        })
    }

    const registerSubmit = async (e: FormEvent) => {
        e.preventDefault()

        const {data} = await axios.post<{status: string, msg: string}>('/api/register', register)
        
        if (data.status === 'fail') {
            return setErrors([data.msg])
        }

        router.push('/login')

    }

    const closeError = () => {
        setErrors([])
    }

    return (
        <div>
            <Head>
                <title> MoneyTrack | Register </title>
                <meta charSet="utf-8"/>
                <meta name="description" content="Sign up for an account today." />
                <meta name="keywords" content="register moneytrack, register moneytrack, money, track, track expenses, money tracker" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://image.freepik.com/free-vector/dollars-illustration-set_74855-4404.jpg" />
                <meta property="og:title" content="Register to MoneyTrack." />
                <meta property="og:description" content="Register to MoneyTrack - A platform to track you expenses." />
            </Head>

            <main className={styles.container} >
                <form onSubmit={registerSubmit} method="post">
                    <h1> Register </h1>

                    <div>
                        { errors.length > 0 ? errors.map(item => {
                            return <div key={item} className={styles.alert}>
                                <p> {item} <MdClose style={{cursor: 'pointer'}} onClick={closeError} /> </p>
                            </div>
                        }) : "" }
                    </div>

                    <input type="text" placeholder="First Name" onChange={handleChange} name="firstName"/>
                    <input type="text" placeholder="Last Name" onChange={handleChange} name="lastName"/>
                    <input type="email" placeholder="Email Address" onChange={handleChange} name="email"/>
                    <input type="password" placeholder="Password" onChange={handleChange} name="password"/>
                    <button type="submit"> Register </button>
                </form>
            </main>
        </div>
    )
}

export default Register