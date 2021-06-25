import '../styles/globals.scss'
import type { AppProps } from 'next/app'

// Components
import {Header} from './components/header/Header'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Header/>
      <Component {...pageProps} />
    </div>
  )
}
export default MyApp
