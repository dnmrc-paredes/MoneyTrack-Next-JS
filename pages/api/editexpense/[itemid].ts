import type {NextApiRequest, NextApiResponse} from 'next'
import mysql from 'mysql'

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'samsungj2prime',
    database: 'moneytrack_db'
})

db.connect()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const itemID = req.query.itemid
    const {description, amount} = req.body as {description: string, amount: string}
    const convertedAmount = parseInt(amount)

    try {

        if (req.method === "PATCH") [

            db.query(`UPDATE list SET description = ?, amount = ? WHERE itemID = ?`, [description, convertedAmount, itemID], (err, result) => {

                if (err) {
                    return res.json({
                        status: 'fail',
                        msg: 'Please try again.'
                    })
                }

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