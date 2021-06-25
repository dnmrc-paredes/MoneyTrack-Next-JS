import Head from 'next/head'
import Image from 'next/image'
import {useRouter} from 'next/router'

// Styles & Static Files
import styles from '../styles/Home.module.scss'
import familySaving from '../public/fam-couple-saving.jpg'

const Root = () => {

  const router = useRouter()

  const toLogin = () => {
    router.push('/login')
  }

  return (
    <div className={styles.container} >
      <Head>
        <title> MoneyTrack - A platform to track you expenses. </title>
        <meta name="description" content="A platform to track you expenses." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main} >
        <div className={styles.introduction}>

          <div className={styles.introinfo}>
            <h1> Welcome to <span id={styles.logo}> MoneyTrack </span> </h1>
            <p> A platform to track you expenses. </p>
            <button onClick={toLogin} > Get started </button>
          </div>

          <div className={styles.introimg}>
            <Image src={familySaving} alt="family saving money" />
          </div>

        </div>
      </main>

    </div>
  )

}

export default Root
