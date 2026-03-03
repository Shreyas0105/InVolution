import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    // Decode the NextAuth JWT to access custom fields like 'role'
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET || "inVolution_mock_secret_key_12345" });
    const isAuthPage = request.nextUrl.pathname.startsWith('/login');

    const protectedRoutes = ['/messages', '/startups/publish', '/startups/dashboard', '/investors/search', '/investors/dashboard', '/kyc', '/admin'];
    const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (token) {
        const role = token.role as string;
        const path = request.nextUrl.pathname;

        // Prevent cross-access based on roles
        if (role === 'startup' && path.startsWith('/investors')) {
            return NextResponse.redirect(new URL('/startups/dashboard', request.url));
        }

        if (role === 'investor' && path.startsWith('/startups/dashboard')) {
            return NextResponse.redirect(new URL('/investors/dashboard', request.url));
        }

        // Prevent investors from publishing pitches
        if (role === 'investor' && path.startsWith('/startups/publish')) {
            return NextResponse.redirect(new URL('/investors/dashboard', request.url));
        }

        if (isAuthPage) {
            // Default routing from login/auth pages
            if (role === 'startup') return NextResponse.redirect(new URL('/startups/dashboard', request.url));
            if (role === 'investor') return NextResponse.redirect(new URL('/investors/dashboard', request.url));
            return NextResponse.redirect(new URL('/kyc', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
};
