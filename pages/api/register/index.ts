import type { NextApiRequest, NextApiResponse } from 'next'
import uniqid from 'uniqid'
import {hash} from 'bcrypt'
import { db } from '../../../helpers/db'

db.connect()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const {firstName, lastName, email, password} = req.body as {firstName: string, lastName: string, email: string, password: string}

    try {

        const uniqueID = uniqid(uniqid.process(), uniqid.time())

        if (!firstName || !lastName || !email || !password) {
            return res.json({
                status: 'fail',
                msg: 'All inputs must be provided.'
            })
        }

        if (password.length < 8) {
            return res.json({
                status: 'fail',
                msg: 'Password must be 8 characters long.'
            })
        }

        const hashedPassword = await hash(password, 10)

        db.query(`INSERT INTO local_users (uniq_id, first_name, last_name, email, password) VALUES (?, ?, ?, ?, ?)`, [uniqueID, firstName, lastName, email, hashedPassword], (err, result) => {

            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.json({
                        status: 'fail',
                        msg: 'Email already exists.'
                    })
                }
                throw err
            }

            db.end()
            return res.status(200).json({
                status: 'ok',
                msg: 'Successfully Created.'
            })

        })
        
    } catch (err) {
        throw Error ('Please try again.')
    }



}

export default handler