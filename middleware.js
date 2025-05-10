import { NextResponse } from 'next/server';

export function middleware(request) {
    const country = request.geo?.country || 'US'; // fallback to 'US'
    const url = request.nextUrl.clone();

    if (url.pathname === '/') {
        if (country === 'BD') {
            url.pathname = '/bd';
            return NextResponse.redirect(url);
        } else if (country === 'US') {
            url.pathname = '/us';
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/'], // Apply only to the homepage
};
