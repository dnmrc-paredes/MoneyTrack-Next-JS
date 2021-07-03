import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
    providers: [
        Providers.Google({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        }),
        Providers.Facebook({
            clientId: process.env.FB_ID,
            clientSecret: process.env.FB_SECRET
        })
    ],
    database: {
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'samsungj2prime',
        database: 'moneytrack_db',
    }
})
