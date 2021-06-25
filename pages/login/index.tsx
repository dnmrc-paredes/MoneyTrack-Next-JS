import {useState, ChangeEvent, FormEvent} from 'react'
import Image from 'next/image'

// Styles & Static Files
import styles from  './Login.module.scss'
import moneyCalculatorImg from '../../public/Mar-Business_11.jpg'

const Login = () => {

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

    const loginSubmit = (e: FormEvent) => {
        e.preventDefault()
        console.log(login)
    }

    return (
        <main className={styles.container} >
            <div className={styles.loginform}>
                <form onSubmit={loginSubmit} method="post">
                    <h1> Login </h1>
                    <input type="email" placeholder="Email" onChange={handleChange} name="email"/>
                    <input type="password" placeholder="Password" onChange={handleChange} name="password"/>
                    <button type="submit"> Login </button>
                </form>
            </div>

            <div className={styles.loginimg}>
                <Image src={moneyCalculatorImg} alt="calculating money" />
            </div>
        </main>
    )
}

export default Login