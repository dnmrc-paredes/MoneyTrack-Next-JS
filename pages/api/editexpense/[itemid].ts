import type {NextApiRequest, NextApiResponse} from 'next'
import { db } from '../../../helpers/db'

// db.connect()

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const itemID = req.query.itemid
    const {description, amount} = req.body as {description: string, amount: string}
    const convertedAmount = parseInt(amount)

    try {

        if (req.method === "PATCH") [

            db.query(`UPDATE local_list SET description = ?, amount = ? WHERE itemID = ?`, [description, convertedAmount, itemID], (err, result) => {

                if (err) {
                    return res.json({
                        status: 'fail',
                        msg: 'Please try again.'
                    })
                }

                // db.end()
                return res.status(202).json({
                    status: 'ok',
                    msg: 'Edited Successfully.'
                })

            })

        ]
        
    } catch (err) {
        throw Error ('Please try again.')
    }

}