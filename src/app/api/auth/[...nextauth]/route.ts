import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "mock-client-id-needs-to-be-set",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-client-secret-needs-to-be-set",
        })
    ],
    callbacks: {
        async jwt({ token, user, account }: any) {
            if (account && user) {
                const cookieStore = await cookies();
                const roleCookie = cookieStore.get('involution_role');
                token.role = roleCookie?.value || "investor";
            }
            return token;
        },
        async session({ session, token }: any) {
            if (session.user) {
                (session.user as any).role = token.role;
                // Expose user ID just in case
                (session.user as any).id = token.sub;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt" as const,
    },
    secret: process.env.NEXTAUTH_SECRET || "inVolution_mock_secret_key_12345",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
