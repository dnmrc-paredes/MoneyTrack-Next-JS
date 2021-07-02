import Head from 'next/head'
import Image from 'next/image'
import {useRouter} from 'next/router'
import {useEffect} from 'react'
import {GetServerSideProps} from 'next'
import {getSession} from 'next-auth/client'

// Styles & Static Files
import styles from '../styles/Home.module.scss'
import familySaving from '../public/fam-couple-saving.jpg'
import { useSelector } from 'react-redux'
import { IrootState } from '../interfaces/rootState'

export const getServerSideProps: GetServerSideProps = async ({req}) => {

  const session = await getSession({req})

  if (session) {
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

const Root = () => {

  const router = useRouter()
  const isAuth = useSelector((state: IrootState) => state.auth)

  useEffect(() => {
    if (isAuth) {
      router.push('/home')
    }
  })

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
            <p> A platform where you can track your expenses. </p>
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
