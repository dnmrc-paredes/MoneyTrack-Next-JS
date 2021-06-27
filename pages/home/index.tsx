import Head from 'next/head'
import {GetStaticProps, NextPage} from 'next'
// import {FC} from 'react'
// import { wrapper } from '../../redux/store';
// import { useSelector } from 'react-redux';
// import { IrootState } from '../../interfaces/rootState';

export const getStaticProps: GetStaticProps = async () => {
    
    return {
        props: {
            id: 'asdfasdf'
        },
        revalidate: 1
    }
}

// export const getStaticProps = wrapper.getStaticProps(store =>
//     ({preview: bo}) => {
//         console.log('2. Page.getStaticProps uses the store to dispatch things');
//     }
// );

const Home: NextPage<{id: string}> = ({id}) => {
    return (
        <div>
            <Head>
                <title> Home </title>
            </Head>

            <main>
                <h1> {id} </h1>
            </main>
        </div>
    )
}

export default Home