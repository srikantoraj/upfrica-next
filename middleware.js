// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
    // Grab the country code from Vercel’s geo lookup (e.g. "BD"), default to "us"
    const country = request.geo?.country?.toLowerCase() || 'us';
    const { pathname } = request.nextUrl;

    // If someone from BD hits "/", send them to "/bd"
    if (pathname === '/' && country === 'bd') {
        const url = request.nextUrl.clone();
        url.pathname = '/bd';
        return NextResponse.redirect(url);
    }

    // If someone outside BD hits "/bd" (or any sub-path), kick them back to "/"
    if (pathname.startsWith('/bd') && country !== 'bd') {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    // Otherwise, let the request through
    return NextResponse.next();
}

// Only run this middleware on "/" and all "/bd/*" routes
export const config = {
    matcher: ['/', '/bd/:path*'],
};
