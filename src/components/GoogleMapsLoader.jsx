// components/GoogleMapsLoader.jsx
'use client';

import { useEffect, useState } from 'react';

export default function GoogleMapsLoader({ onLoad }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Avoid double loading
    if (window.google?.maps?.places) {
      setLoaded(true);
      onLoad?.();
      return;
    }

    const existingScript = document.querySelector('#google-maps-script');
    if (existingScript) return;

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    }&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setLoaded(true);
      onLoad?.();
    };

    script.onerror = () => {
      console.error('Google Maps script failed to load');
    };

    document.body.appendChild(script);
  }, [onLoad]);

  return null;
}