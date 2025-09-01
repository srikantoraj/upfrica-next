//src/hooks/useCountries.js
import { useEffect, useState } from 'react';
import { BASE_API_URL } from '@/app/constants';

export function useCountries(token) {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/api/countries/`, {
          headers: token ? { Authorization: `Token ${token}` } : {},
        });
        const data = await res.json();
        if (mounted && Array.isArray(data)) setCountries(data);
      } catch (_) {
        if (mounted) setCountries([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [token]);

  return { countries, loading };
}