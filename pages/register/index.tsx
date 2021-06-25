import styles from './Register.module.scss'

const Register = () => {
    return (
        <main className={styles.container} >
            <form method="post">
                <h1> Register </h1>
                <input type="text" placeholder="First Name" name="firstName"/>
                <input type="text" placeholder="Last Name" name="lastName"/>
                <input type="email" placeholder="Email Address" name="email"/>
                <input type="password" placeholder="Password" name="password"/>
                <button type="submit"> Register </button>
            </form>
        </main>
    )
}

export default Register