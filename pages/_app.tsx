import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import {Provider} from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import {store, persistor} from '../redux/store'

// Components
import {Header} from '../components/header/Header'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Header/>
          <Component {...pageProps}/>
        </PersistGate>
      </Provider>
    </div>
  )
}
export default MyApp
