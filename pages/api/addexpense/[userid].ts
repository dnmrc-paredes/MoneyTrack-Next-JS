import type {NextApiRequest, NextApiResponse} from 'next'
import uniqid from 'uniqid'
import { db } from '../../../helpers/db'

db.connect()

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    
    const userID = req.query.userid
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

            db.query(`INSERT INTO list (itemID, userID, description, amount) VALUES (?, ?, ?, ?)`, 
            [itemID, userID, description, convertedAmount], (err, result) => {

                if (err) {
                    return res.json({
                        status: 'fail',
                        msg: `Something's wrong please try again later.`
                    })
                }

                db.end()
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