import type {NextApiRequest, NextApiResponse} from 'next'
import uniqid from 'uniqid'
import { db } from '../../../../helpers/db'
// import mysql from 'mysql'

// export const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'samsungj2prime',
//     database: 'moneytrack_db'
// })


db.connect((err) => {
    if (err) {
        return console.log(err)
    }

    console.log('connected')
})

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    
    const userEmail = req.query.userid
    const {description, amount} = req.body as {description: string, amount: string}
    const convertedAmount = parseInt(amount)

    try {

        const itemID = uniqid(uniqid.process(), uniqid.time())

        if (req.method === "POST") {

            if (!description || !amount) {
                return res.json({
                    status: 'fail',
                    msg: 'All inputs must be provided.'
                })
            }

            db.query(`INSERT INTO list (itemID, email, description, amount) VALUES (?, ?, ?, ?)`, 
            [itemID, userEmail, description, convertedAmount], (err, result) => {

                if (err) {
                    return res.json({
                        status: 'fail',
                        msg: `Something's wrong please try again later.`
                    })
                }

                // db.end()
                return res.status(201).json({
                    status: 'ok',
                    msg: 'Successfully added.'
                })

            })
            
        }
        
    } catch (err) {
        throw Error ('Please try again.')
    }

}