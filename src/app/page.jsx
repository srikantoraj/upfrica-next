// src/app/page.jsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        let cc = 'gh';
        (async () => {
            try {
                const res = await fetch('https://api.upfrica.com/api/user-country/', { credentials: 'omit' });
                if (res.ok) {
                    const { country_code } = await res.json();
                    const code = (country_code || '').toLowerCase();
                    if (/^[a-z]{2}$/.test(code)) cc = code;
                }
            } catch { /* ignore, keep gh */ }
            router.replace(`/${cc}/`);
        })();
    }, [router]);

    // Optional tiny placeholder while redirecting
    return null; // or <p>Redirecting…</p>
}
