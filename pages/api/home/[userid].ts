import type {NextApiRequest, NextApiResponse} from 'next'
import { getSession } from 'next-auth/client'
// import mysql from 'mysql'
import { db } from '../../../helpers/db'

// // const db = mysql.createConnection({
// //     host: 'localhost',
// //     user: 'root',
// //     password: 'samsungj2prime',
// //     database: 'moneytrack_db'
// // })

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

    const userID = req.query.userid
    // const session = await getSession({req})

    try {

        if (req.method === "GET") {

            db.query(`
                SELECT description, amount, itemID
                FROM local_users
                JOIN local_list ON local_list.userID = local_users.uniq_id WHERE local_users.uniq_id = ?;
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