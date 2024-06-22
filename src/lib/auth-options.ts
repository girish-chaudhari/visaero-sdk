import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialProvider from "next-auth/providers/credentials";
import axios from "@/config";
import API from "@/services/api";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialProvider({
      name: "Anonymous",
      credentials: {
        user_id: { label: "User ID", type: "text" },
        host: { label: "Host", type: "text" },
        user_type: { label: "User Type", type: "text" },
        session_id: { label: "Session ID", type: "text" },
        role_name: { label: "Role Name", type: "text" },
        access_token: { label: "Access Token", type: "text" },
        refresh_token: { label: "Refresh Token", type: "text" },
      },
      // @ts-expect-error
      async authorize(credentials, req) {
       const request = await axios.get(API.getAnonymouseUser, {
          params: {
            host: "visaero",
          },
        });
        console.log("request from auth", request.data)
        const userData = request?.data?.data === 'success' ? request.data.dataobj : null;
        // const user = { id: "1", name: "John", email: credentials?.email };
        if (userData) {
          // Any object returned will be saved in `user` property of the JWT
          return {
            user_id: userData.user_id,
            host: userData.host,
            user_type: userData.user_type,
            session_id: userData.session_id,
            role_name: userData.role_name,
            access_token: userData.access_token,
            refresh_token: userData.refresh_token,
          };
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.user_id = user.id;
        token.host = account?.host;
        token.user_type = account?.user_type;
        token.session_id = account?.session_id;
        token.role_name = account?.role_name;
        token.access_token = account?.access_token;
        token.refresh_token = account?.refresh_token;
      }
      return token;
    },
    async session({ session, token }) {
      // @ts-expect-error
      session.user_id = token.user_id;
      // @ts-expect-error
      session.host = token.host;
      // @ts-expect-error
      session.user_type = token.user_type;
      // @ts-expect-error
      session.session_id = token.session_id;
      // @ts-expect-error
      session.role_name = token.role_name;
      // @ts-expect-error
      session.access_token = token.access_token;
      // @ts-expect-error
      session.refresh_token = token.refresh_token;
      return session;
    },
  },
  pages: {
    signIn: "/", //sigin page
  },
};
