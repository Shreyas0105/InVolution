import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('next-auth.session-token') || request.cookies.get('__Secure-next-auth.session-token');
    const isAuthPage = request.nextUrl.pathname.startsWith('/login');

    const protectedRoutes = ['/messages', '/startups/publish', '/investors/search', '/investors/dashboard', '/kyc'];
    const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (isAuthPage && token) {
        return NextResponse.redirect(new URL('/kyc', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
};
