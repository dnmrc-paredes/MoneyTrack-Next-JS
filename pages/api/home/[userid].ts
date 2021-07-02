import type {NextApiRequest, NextApiResponse} from 'next'
// import mysql from 'mysql'
import { db } from '../../../helpers/db'

// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'samsungj2prime',
//     database: 'moneytrack_db'
// })

db.connect()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const userID = req.query.userid

    try {

        if (req.method === "GET") {

            db.query(`
                SELECT description, amount, itemID
                FROM local_users
                JOIN list ON list.userID = local_users.uniq_id WHERE local_users.uniq_id = ?;
            `, [userID], (err, result) => {

                if (err) {
                    return res.json({
                        status: 'fail',
                        msg: 'Please try again.'
                    })
                }

                // db.end()
                return res.status(200).json({
                    status: 'ok',
                    msg: 'Retrieved Successfully',
                    data: result
                })

            })
            
        }
        
    } catch (err) {
        throw Error ('Please try again.')
    }

}