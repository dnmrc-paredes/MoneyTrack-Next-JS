import type { NextApiRequest, NextApiResponse } from 'next'
// import mysql from 'mysql'
import {compare} from 'bcrypt'
import {sign} from 'jsonwebtoken'
import { db } from '../../../helpers/db'

// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'samsungj2prime',
//     database: 'moneytrack_db'
// })

// connection.connect()

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
  
  const {email, password} = req.body as {email: string, password: string}

  try {

    if (req.method === 'POST') {
      
      if (!email || !password) {
        res.json({
          status: 'fail',
          msg: 'All inputs must be provided.'
        })
      }

      db.query('SELECT * FROM local_users WHERE email = ?', email, async (err, result) => {

        if (err) {
          console.log(err)
          throw Error ('Yawa')
        }

        if (result.length === 0) {
          return res.json({
            status: 'fail',
            msg: 'User not found.'
          })
        }

        const isSame = await compare(password, result[0].password)
        
        if (isSame) {

          const token = sign({id: result[0].uniq_id}, 'secret')

          // db.end()
          return res.status(200).json({
            status: 'ok',
            msg: 'Successfully Logged In.',
            data: result,
            token
          })

        } else {

          return res.json({
            status: 'fail',
            msg: 'Invalid Email/Password'
          })

        }

      })

    }
    
  } catch (err) {
    throw Error ('Please try again.')
  }

}
