import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Mock Google Auth",
            credentials: {},
            async authorize() {
                // Return a mock user imitating a successful Google OAuth callback
                return {
                    id: "go_192837465",
                    name: "Rahul Investor",
                    email: "rahul.invests@gmail.com",
                    image: "https://i.pravatar.cc/150?u=rahul"
                };
            }
        })
    ],
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET || "inVolution_mock_secret_key_12345",
});

export { handler as GET, handler as POST };
