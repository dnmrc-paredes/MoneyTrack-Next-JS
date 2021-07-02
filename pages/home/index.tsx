import Head from 'next/head'
import React from 'react'
import {useState, MouseEvent, MouseEventHandler, ChangeEvent} from 'react'
import axios from 'axios'
import {GetServerSideProps, NextPage} from 'next'
import { FormEventHandler } from 'react'
import { useSelector } from 'react-redux'
import publicIp from 'public-ip'
import geoip from 'geoip-country'
import currency from 'country-to-currency'
import getSymbolFromCurrency from 'currency-symbol-map'
import {verify} from 'jsonwebtoken'
import {useRouter} from 'next/router'
import { getSession, useSession } from 'next-auth/client'
 
// Styles & Static
import { MdLibraryAdd } from 'react-icons/md'
import styles from './Home.module.scss'
import 'react-toastify/dist/ReactToastify.css';

// Components
import {ModalForm} from '../../layout/modalForm/modalForm'
import {ToastContainer, toast} from 'react-toastify'

// Interface
import {Iitem} from '../../interfaces/item'
import { IrootState } from '../../interfaces/rootState'

export const getServerSideProps: GetServerSideProps = async ({req}) => {

    // db.connect()

    // if (!req.cookies.token) {
    //     return {
    //         redirect: {
    //             destination: '/login',
    //             permanent: false
    //         }
    //     }    
    // }

    // db.query(`SELECT * FROM users WHERE email = ?`, [session?.user?.email], (err, result) => {
    //     if (err) {
    //         return console.log(err)
    //     }

    //     else {
    //         console.log(result)
    //     }
    // })

    // const session = await getSession({req})

    // if (!session || !req.cookies.token) {
    //     return {
    //         props: {},
    //         redirect: {
    //             destination: '/login',
    //             permanent: false
    //         }
    //     }
    // }
    
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
    // console.log(data)

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

    // return {
    //     props: {
    //         items: 'sdfsafsa'
    //     }
    // }
}

const Home: NextPage<{items: Iitem[], symbol: string, totalAmount: number}> = ({items, symbol, totalAmount}) => {

    const router = useRouter()
    const [session] = useSession()
    const isAuth = useSelector((state: IrootState) => state.auth)
    const myID = useSelector((state: IrootState) => state.user.uniq_id)
    const [createState, setCreateState] = useState<boolean>(false)
    const [editState, setEditState] = useState<boolean>(false)
    const [details, setDetails] = useState({
        description: "" as string,
        amount: 0 as number
    })

    // Edit State
    const [selectedItem, setSelectedItem] = useState("")
    const [selectedDetails, setSelectedDetails] = useState({
        description: "",
        amount: 0 as number
    })

    // Toasts Notifications
    const notifyError = () => toast.warn('All inputs required')
    const notifyError2 = () => toast.warn('Must be a number')
    const notifyAdded = () => toast.success('Successfully Added')
    const notifyEdited = () => toast.success('Successfully Edited')
    const notifyDeleted = () => toast.info('Successfully Deleted')

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {value, name} = e.target

        setDetails({
            ...details,
            [name]: value
        })
    }

    const handleChange2 = (e: ChangeEvent<HTMLInputElement>) => {
        const {value, name} = e.target

        setSelectedDetails({
            ...selectedDetails,
            [name]: value
        })
    }

    const submitForm: FormEventHandler = async (e) => {
        e.preventDefault()
        const {data} = await axios.post(`/api/addexpense/${myID}`, details)

        if (!details.description || !details.amount) {
            return notifyError()
        }

        if (isNaN(details.amount)) {
            return notifyError2()
        }
        
        if (data.status === "ok") {
            notifyAdded()
            refreshData()
            return setCreateState(!createState)
        }
    }

    const submitEdit: FormEventHandler = async (e) => {
        e.preventDefault()
        const {data} = await axios.patch(`/api/editexpense/${selectedItem}`, selectedDetails)

        if (!selectedDetails.description || !selectedDetails.amount) {
            return notifyError()
        }

        if (isNaN(selectedDetails.amount)) {
            return notifyError2()
        }
        
        if (data.status === "ok") {
            notifyEdited()
            refreshData()
            return setEditState(!editState)
        }
    }

    const deleteList = async (itemID: string) => {
        const {data} = await axios.delete(`/api/deleteexpense/${itemID}`)
        console.log(data)
        if (data.status === "ok") {
            refreshData()
            return notifyDeleted()
        }
    }

    const toggleModal: MouseEventHandler = (e: MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
        setCreateState(!createState)
    }

    const toggleEditModal = (itemID: string) => {
        setSelectedItem(itemID)
        const toBeEdited = items.filter(item => item.itemID === itemID)
        setSelectedDetails({
            description: toBeEdited[0].description,
            amount: toBeEdited[0].amount
        })
        setEditState(!editState)
    }

    const refreshData = () => {
        // window.location.reload()
        router.replace(router.asPath)
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
                    { items.length > 0 ? items.map(item => {
                        return <div className={styles.items} key={item.itemID}>
                            <div className={styles.item} >
                                <div className={styles.details}>
                                    <h3> {item.description} </h3>
                                    <p> {symbol}{item.amount} </p>
                                </div>

                                <div className={styles.btns}>
                                    <button onClick={() => toggleEditModal(item.itemID)} id={styles.edit}> Edit </button>
                                    <button onClick={() => {
                                        deleteList(item.itemID)
                                    }} id={styles.delete}> Delete </button>
                                </div>
                            </div>
                        </div>
                    }) : <h3 className={styles.noitems}> Add Items. </h3> }
                </div>

                { createState ? <ModalForm toggleModal={toggleModal} >
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

                { editState ? <ModalForm toggleModal={setEditState} >
                    <div className={styles.rootform}>
                        <form onSubmit={submitEdit} method="post">
                            <h1> Edit expense </h1>
                            <input type="text" placeholder="Description" value={selectedDetails.description} onChange={handleChange2} name="description"/>
                            <input type="text" placeholder="Amount" value={selectedDetails.amount} onChange={handleChange2} name="amount"/>
                            <div className={styles.groupbtns}>
                                <button type="submit"> Confirm </button>
                                <button className={styles.cancel} onClick={() => setEditState(!editState)}> Cancel </button>
                            </div>
                        </form>
                    </div>
                </ModalForm> : "" }

                
                <ToastContainer position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover />

            </main>

            {/* { session || isAuth ? <h1> Auth </h1> : <h1> Not Auth </h1> } */}
        </div>
    )
}

export default Home