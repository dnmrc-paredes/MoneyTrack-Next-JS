import Head from 'next/head'
import {useState, MouseEvent, MouseEventHandler, ChangeEvent} from 'react'
import axios from 'axios'
import {GetServerSideProps, NextPage} from 'next'
import publicIp from 'public-ip'
import geoip from 'geoip-country'
import currency from 'country-to-currency'
import getSymbolFromCurrency from 'currency-symbol-map'
 
// Styles & Static
import { MdLibraryAdd } from 'react-icons/md'
import styles from './Home.module.scss'

// Components
import {ModalForm} from '../../layout/modalForm/modalForm'
import { FormEventHandler } from 'react'
import { useSelector } from 'react-redux'
import { IrootState } from '../../interfaces/rootState'
import {verify} from 'jsonwebtoken'

// Interface
import {Iitem} from '../../interfaces/item'
import React from 'react'

export const getServerSideProps: GetServerSideProps = async ({req}) => {
    
    if (!req.cookies.token) {
        return {
            redirect: {
                destination: '/login',
                permanent: false
            }
        }
    }
    
    // Will find the country with ipv4
    const geo = geoip.lookup(await publicIp.v4())
    const country = geo?.country as string
    // Converting the object of key value pairs to array of object with key value pair
    const countryList = Object.entries(currency).map(([cty, value]) => ({cty, value}))
    // Filter and return the match item into an array
    const final = countryList.filter(item => {
        return item.cty === country.toString()
    })
    const curr = final[0].value
    // Convert the country currency to country symbol
    const symbol = getSymbolFromCurrency(curr)

    const verifiedToken = verify(req.cookies.token, 'secret') as {id: string, iat: number}
    const {data} = await axios.get<{data: Iitem[]}>(`http://localhost:3000/api/home/${verifiedToken.id}`)

    const amounts = [] as number[]
    data.data.map(item => {
        amounts.push(item.amount)
    })
    const totalAmount = amounts.reduce((prev, curr) => {
        return prev+curr
    }, 0)


    return {
        props: {
            items: data.data,
            symbol,
            totalAmount
        }
    }
}

const Home: NextPage<{items: Iitem[], symbol: string, totalAmount: number}> = ({items, symbol, totalAmount}) => {

    const myID = useSelector((state: IrootState) => state.user.uniq_id)
    const [modalState, setModalState] = useState<boolean>(false)
    const [details, setDetails] = useState({
        description: "" as string,
        amount: "" as string
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {value, name} = e.target

        setDetails({
            ...details,
            [name]: value
        })
    }

    const submitForm: FormEventHandler = async (e) => {
        e.preventDefault()
        const {data} = await axios.post(`/api/addexpense/${myID}`, details)
        
        if (data.status === "ok") {
            return setModalState(!modalState)
        }
    }

    const deleteList = async (itemID: string) => {
        await axios.delete(`/api/deleteexpense/${itemID}`)
    }

    const toggleModal: MouseEventHandler = (e: MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
        setModalState(!modalState)
    }

    return (
        <div>
            <Head>
                <title> Home </title>
            </Head>

            <main className={styles.main}>
                <div className={styles.container} >
                    <div className={styles.addbtn}>
                        <p> Total: {symbol}{totalAmount} </p>
                        <button onClick={toggleModal} > <MdLibraryAdd size={15} /> New </button>
                    </div>
                </div>

                <div className={styles.itemsbox}>
                    {items.map(item => {
                        return <div className={styles.items} key={item.itemID}>
                            <div className={styles.item} >
                                <div className={styles.details}>
                                    <h3> {item.description} </h3>
                                    <p> {symbol}{item.amount} </p>
                                </div>

                                <div className={styles.btns}>
                                    <button id={styles.edit}> Edit </button>
                                    <button onClick={() => {
                                        deleteList(item.itemID)
                                    }} id={styles.delete}> Delete </button>
                                </div>
                            </div>
                        </div>
                    })}
                </div>

                { modalState ? <ModalForm toggleModal={toggleModal} >
                    <div className={styles.rootform}>
                        <form onSubmit={submitForm} method="post">
                            <h1> Add expense </h1>
                            <input type="text" placeholder="Description" onChange={handleChange} name="description"/>
                            <input type="text" placeholder="Amount" onChange={handleChange} name="amount"/>
                            <div className={styles.groupbtns}>
                                <button type="submit"> Confirm </button>
                                <button className={styles.cancel} onClick={toggleModal}> Cancel </button>
                            </div>
                        </form>
                    </div>
                </ModalForm> : null }

            </main>
        </div>
    )
}

export default Home


// SELECT first_name, last_name, description, amount
// FROM users
// JOIN list ON list.userID = users.uniq_id;

// import type { NextApiRequest, NextApiResponse } from 'next'
// import mysql from 'mysql'

// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'samsungj2prime',
//     database: 'moneytrack_db'
// })

// db.connect()

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {

//     const userID = req.query.userid

//     try {

//         if (req.method === 'GET') {
//             return console.log(userID)
//         }
        
//     } catch (err) {
//         throw Error ('Please try again.')
//     }

// }