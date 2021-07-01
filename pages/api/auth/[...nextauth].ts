import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
    providers: [
        Providers.Google({
            clientId: '696269015133-278tg36iufm1vr0sjqb7qcn5oqueqen3.apps.googleusercontent.com',
            clientSecret: 'raUn9I7-nGDAuPrTZEeXeAxB'

        }),
        Providers.GitHub({
            clientId: 'bf9d0ee85ba75d8d861c',
            clientSecret: 'f22af457c096cdca827c7196c49839c3bfb5007e'
        })
    ]
})