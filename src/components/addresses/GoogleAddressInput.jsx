// components/addresses/GoogleAddressInput.jsx
// components/addresses/GoogleAddressInput.jsx
import { useEffect, useRef } from 'react';

export default function GoogleAddressInput({ onSelect, initialValue = '', country = '' }) {
  const inputRef = useRef(null);

  const normalizeCountry = (countryNameOrCode) => {
    const map = { 'United Kingdom': 'GB', UK: 'GB' };
    const v = (countryNameOrCode || '').toString();
    return map[v] || v;
  };

  useEffect(() => {
    if (inputRef.current && initialValue) inputRef.current.value = initialValue;
  }, [initialValue]);

  useEffect(() => {
    if (!window.google?.maps) return;

    const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      componentRestrictions: country
        ? { country: normalizeCountry(country).toLowerCase() } // 👈 dynamic
        : undefined,
    });

    ac.setFields(['address_components', 'formatted_address']);

    const listener = ac.addListener('place_changed', () => {
      const place = ac.getPlace();
      if (!place.address_components) return;

      const get = (type) =>
        place.address_components.find((c) => c.types.includes(type))?.long_name || '';

      onSelect({
        address_line_1: `${get('street_number')} ${get('route')}`.trim(),
        town: get('postal_town') || get('locality'),
        state_or_region: get('administrative_area_level_1'),
        postcode: get('postal_code'),
        country: normalizeCountry(get('country')),
      });
    });

    return () => {
      if (listener?.remove) listener.remove();
    };
  }, [country]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Address Line 1"
      autoComplete="off"
      className="w-full p-2 rounded border bg-white dark:bg-gray-900 dark:border-gray-700"
    />
  );
}