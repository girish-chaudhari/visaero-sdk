// import NextAuth, { NextAuthOptions } from "next-auth"
// import CredentialsProvider from "next-auth/providers/credentials"
// import { getUserFromDb } from "@/utils/db"
// import { saltAndHashPassword } from "@/utils/password"

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         username: { label: "Username", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials) {
//           return null
//         }

//         const { username, password } = credentials
//         const pwHash = saltAndHashPassword(password)

//         const user = await getUserFromDb(username, pwHash)

//         if (user) {
//           return { id: user.id, name: user.name, email: user.email }
//         }
//         return null
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id
//         token.name = user.name
//         token.email = user.email
//       }
//       return token
//     },
//     async session({ session, token }) {
//       session.user.id = token.id
//       session.user.name = token.name
//       session.user.email = token.email
//       return session
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// }

// export default NextAuth(authOptions)