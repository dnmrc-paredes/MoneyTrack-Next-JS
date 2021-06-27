// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'samsungj2prime',
//     database: 'moneytrack_db'
// })

// connection.connect()

// connection.query('INSERT INTO users (first_name, last_name, email, password, money) VALUES ("dinmarc", "paredes", "admin@gmail.com", "admin", 500)')

import type { NextApiRequest, NextApiResponse } from 'next'
import mysql from 'mysql'
import {compare} from 'bcrypt'

// type Data = {
//   name: string
// }

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'samsungj2prime',
    database: 'moneytrack_db'
})

connection.connect()

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

      connection.query('SELECT * FROM `users` WHERE email = ?', email, async (err, result) => {

        if (err) {
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

          return res.status(200).json({
            status: 'ok',
            msg: 'Successfully Logged In.',
            data: result
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
