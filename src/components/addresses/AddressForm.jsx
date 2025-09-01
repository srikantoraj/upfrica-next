// src/components/addresses/AddressForm.jsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { parsePhoneNumberFromString, getCountryCallingCode } from 'libphonenumber-js/min';
import { BASE_API_URL } from '@/app/constants';
import GoogleAddressInput from '@/components/addresses/GoogleAddressInput';
import GoogleMapsLoader from '@/components/GoogleMapsLoader';
import PhoneInput from '@/components/input/phoneInput';

export default function AddressForm({
  token,
  onSave,
  initialData = null,
  editId = null,
  onCancel,
  defaultCountry = 'GH', // <-- NEW: prefer page’s defaultCountry
}) {
  const [formData, setFormData] = useState({
    full_name: '',
    address_line_1: '',
    address_line_2: '',
    town: '',
    state_or_region: '',
    country: '', // ISO-2 for address
    postcode: '',
    default: false,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [countries, setCountries] = useState([]);

  // --- Phone state (internationalized) ---
  const [phoneIso, setPhoneIso] = useState('');   // ISO-2 chosen in the phone selector
  const [phoneVal, setPhoneVal] = useState('');   // raw typed value (digits/pretty)
  const [hasFocus, setHasFocus] = useState(false);
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const phoneIsoTouchedRef = useRef(false);

  const fullNamePrefilledRef = useRef(false);
  const priorityOrder = ['GB', 'GH', 'NG'];





  /* ---------------- helpers ---------------- */
  const toIso2 = (val) => {
    if (!val) return '';
    const v = String(val).trim().toUpperCase();
    return v === 'UK' ? 'GB' : v;
  };

  const isGhanaGps = (s) => {
    if (!s) return false;
    const v = s.trim().toUpperCase();
    return /^[A-Z]{2}-?\d{3}-?\d{4}$/.test(v);
  };

  const phoneMetaForIso = (iso) => {
    const code = toIso2(iso);
    const row = countries.find((c) => toIso2(c.code) === code);
    const dial = (row?.phone_code || '').toString().replace(/[^\d]/g, '');
    return { dial, flag: row?.flag_emoji || '', name: row?.name || code, iso: code };
  };

  const guessIsoFromE164 = (e164) => {
    if (!e164?.startsWith('+')) return '';
    const digits = e164.slice(1).replace(/[^\d]/g, '');
    const allDials = countries
      .map((c) => ({ iso: toIso2(c.code), dial: (c.phone_code || '').toString().replace(/[^\d]/g, '') }))
      .filter((x) => x.dial);
    let best = '', bestLen = 0;
    for (const x of allDials) {
      if (digits.startsWith(x.dial) && x.dial.length > bestLen) {
        best = x.iso; bestLen = x.dial.length;
      }
    }
    return best;
  };

  /* --------- prefill from initialData/user --------- */
  useEffect(() => {
    if (initialData) {
      const iso = toIso2(
        initialData.country || initialData.country_code || initialData.country_fk?.code
      );
      setFormData((prev) => ({ ...prev, ...initialData, country: iso }));

      // seed phone fields
      const pn = (initialData.phone_number || initialData.phone_e164 || '').toString().trim();
      if (pn) {
        const guessedIso = guessIsoFromE164(pn) || iso || toIso2(defaultCountry) || 'GH';
        setPhoneIso(guessedIso);
        // let the PhoneInput display raw value; we pass pn to validate later
        setPhoneVal(pn);
      }
      return;
    }

    (async () => {
      try {
        let res = await fetch(`${BASE_API_URL}/api/me/`, { headers: { Authorization: `Token ${token}` } });
        if (!res.ok) res = await fetch(`${BASE_API_URL}/api/users/me/`, { headers: { Authorization: `Token ${token}` } });
        if (!res.ok) return;

        const user = await res.json();

        const code = toIso2(
          user?.country_fk?.code || user?.country || user?.country_code || user?.listing_country_code || defaultCountry
        );

        const firstName = user.first_name?.trim() || '';
        const lastName = user.last_name?.trim() || '';
        const joined = [firstName, lastName].filter(Boolean).join(' ').trim();
        const fullName =
          !joined || (user.username && joined.toLowerCase().includes(user.username.toLowerCase()))
            ? user.username
            : joined;

        setFormData((prev) => ({
          ...prev,
          country: code || prev.country,
          full_name: !fullNamePrefilledRef.current ? (fullName || prev.full_name) : prev.full_name,
        }));

        const upn = (user.phone_number || '').toString().trim();
        if (upn) {
          const guessed = guessIsoFromE164(upn) || code || toIso2(defaultCountry) || 'GH';
          setPhoneIso(guessed);
          setPhoneVal(upn);
        } else {
          setPhoneIso(code || toIso2(defaultCountry) || 'GH');
        }
      } catch {}
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, initialData, countries.length, defaultCountry]);

  /* --------- load countries + sensible defaults --------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/api/countries/`, {
          headers: { Authorization: `Token ${token}` },
        });
        const data = await res.json();
        if (!Array.isArray(data)) return;

        setCountries(data);

        if (!formData.country) {
          const apiDefault = data.find((c) => c.is_default) || null;
          setFormData((prev) => ({ ...prev, country: toIso2(apiDefault?.code || defaultCountry || 'GH') }));
        }
        if (!phoneIso) {
          const addrIso =
            formData.country ||
            toIso2((data.find((c) => c.is_default)?.code) || defaultCountry || 'GH');
          setPhoneIso(addrIso);
        }
      } catch {
        if (!formData.country) setFormData((p) => ({ ...p, country: toIso2(defaultCountry) || 'GH' }));
        if (!phoneIso) setPhoneIso(toIso2(defaultCountry) || 'GH');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, defaultCountry]);

  // Keep phone ISO synced to address country until user touches phone selector
  useEffect(() => {
    if (!phoneIsoTouchedRef.current && formData.country && !phoneIso) {
      setPhoneIso(formData.country);
    }
  }, [formData.country, phoneIso]);

  // Sort country dropdown
  const sortedCountries = useMemo(() => {
    const list = [...countries];
    return list.sort((a, b) => {
      const A = toIso2(a.code), B = toIso2(b.code);
      const ia = priorityOrder.indexOf(A), ib = priorityOrder.indexOf(B);
      if (ia !== -1 || ib !== -1) {
        if (ia === -1) return 1;
        if (ib === -1) return -1;
        return ia - ib;
      }
      return a.name.localeCompare(b.name);
    });
  }, [countries]);

  // Feed <PhoneInput> a non-empty list (maps API shape → component shape)
const phoneCountries = useMemo(() => {
  if (sortedCountries.length) {
    return sortedCountries.map(c => ({
      code: toIso2(c.code),
      name: c.name,
      flag_emoji: c.flag_emoji || '',
    }));
  }
  // Fallback so the dropdown isn't blank before /api/countries loads
  return [
    { code: 'GH', name: 'Ghana',          flag_emoji: '🇬🇭' },
    { code: 'NG', name: 'Nigeria',        flag_emoji: '🇳🇬' },
    { code: 'GB', name: 'United Kingdom', flag_emoji: '🇬🇧' },
    { code: 'US', name: 'United States',  flag_emoji: '🇺🇸' },
  ];
}, [sortedCountries]);


  const inputClass = (field) =>
    `w-full p-2 rounded border ${
      errors[field] ? 'border-red-500' : 'border-gray-300'
    } bg-white dark:bg-gray-900 dark:border-gray-700`;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'full_name') fullNamePrefilledRef.current = true;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  /* --------- phone validation (same logic style as Seller sheet) --------- */
  const SOFT_MIN_DIGITS = { GH: 7, NG: 7, KE: 7, ZA: 7, GB: 7, US: 7 };
  const validatePhone = (raw, iso) => {
    const s0 = String(raw || '').trim();
    let digits = s0.replace(/\D/g, '');
    const ccISO = toIso2(iso) || 'GH';

    if (!digits) return { state: 'empty' };

    try {
      const cc = getCountryCallingCode(ccISO); // "233"
      if (!s0.startsWith('+') && digits.startsWith(cc)) {
        digits = digits.slice(cc.length);
      }
    } catch {}

    const min = SOFT_MIN_DIGITS[ccISO] ?? 7;
    if (digits.length < min) return { state: 'typing' };

    try {
      const pn = parsePhoneNumberFromString(digits, ccISO); // treat as national
      if (!pn) return { state: 'typing' };
      if (pn.isValid()) {
        return { state: 'valid', e164: pn.format('E.164'), national: pn.formatNational() };
      }
      return pn.isPossible() ? { state: 'typing' } : { state: 'invalid' };
    } catch {
      return { state: 'typing' };
    }
  };

  const v = validatePhone(phoneVal, phoneIso || formData.country || defaultCountry);
  const digits = (phoneVal || '').replace(/\D/g, '');
  const minLen = SOFT_MIN_DIGITS[toIso2(phoneIso || formData.country || defaultCountry)] ?? 7;

  const showError = !hasFocus && (touched || submitted) && digits.length >= minLen && v.state === 'invalid';
  const showHint  =  hasFocus && digits.length > 0 && digits.length <  minLen;
  const phoneOk   = v.state === 'valid';

  /* --------- postcode/Ghana GPS helpers (unchanged) --------- */
  const handlePostcodeChange = async (e) => {
    const value = e.target.value.toUpperCase().trim();
    setFormData((prev) => ({ ...prev, postcode: value }));

    if (formData.country === 'GB' && value.length >= 5) {
      try {
        const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(value)}`);
        const data = await res.json();
        if (data.status === 200) {
          setFormData((prev) => ({
            ...prev,
            town: data.result.admin_district || prev.town || '',
            state_or_region: data.result.region || prev.state_or_region || '',
          }));
        }
      } catch {}
    }

    if (formData.country === 'GH' && isGhanaGps(value)) {
      try {
        const url = new URL(`${BASE_API_URL}/api/ghana-gps/resolve/`);
        url.searchParams.set('code', value);
        const res = await fetch(url, { headers: { Authorization: `Token ${token}` } });
        if (res.ok) {
          const d = await res.json();
          setFormData((prev) => ({
            ...prev,
            address_line_1:
              (d.address_line_1 && d.address_line_1.toLowerCase() !== 'ghana')
                ? d.address_line_1
                : (prev.address_line_1 || value),
            town: d.town || prev.town,
            state_or_region: d.state_or_region || prev.state_or_region,
            postcode: d.postcode || prev.postcode || value,
            country: prev.country || 'GH',
          }));
        }
      } catch {}
    }
  };

  useEffect(() => {
    const v = formData.address_line_1?.trim();
    if (formData.country !== 'GH' || !isGhanaGps(v)) return;
    (async () => {
      try {
        const url = new URL(`${BASE_API_URL}/api/ghana-gps/resolve/`);
        url.searchParams.set('code', v.toUpperCase());
        const res = await fetch(url, { headers: { Authorization: `Token ${token}` } });
        if (res.ok) {
          const d = await res.json();
          setFormData((prev) => ({
            ...prev,
            address_line_1:
              (d.address_line_1 && d.address_line_1.toLowerCase() !== 'ghana')
                ? d.address_line_1
                : prev.address_line_1,
            town: d.town || prev.town,
            state_or_region: d.state_or_region || prev.state_or_region,
            postcode: d.postcode || prev.postcode || v.toUpperCase(),
            country: prev.country || 'GH',
          }));
        }
      } catch {}
    })();
  }, [formData.address_line_1, formData.country, token]);

  /* --------- validation + submit --------- */
  const validate = () => {
    const newErrors = {};
    const { country, full_name, address_line_1, town, state_or_region, postcode } = formData;

    if (!country) newErrors.country = 'Country is required';
    if (!full_name) newErrors.full_name = 'Full name is required';
    if (!address_line_1) newErrors.address_line_1 = 'Address Line 1 is required';
    if (!town) newErrors.town = 'Town / City is required';
    if (!state_or_region) newErrors.state_or_region = 'Region / State is required';
    if (!postcode) newErrors.postcode = 'Postcode is required';

    if (v.state === 'empty' || v.state === 'invalid') {
      newErrors.phone_number = v.state === 'empty'
        ? 'Phone number is required'
        : 'Number doesn’t look valid for this country';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!validate()) return;

    setSubmitting(true);
    try {
      // Build E.164 (prefer parsed)
      let e164 = v.e164;
      if (!e164) {
        const { dial } = phoneMetaForIso(phoneIso || formData.country || defaultCountry || 'GH');
        const digitsOnly = String(phoneVal || '').replace(/[^\d]/g, '');
        e164 = dial ? `+${dial}${digitsOnly}` : digitsOnly;
      }

      const method = editId ? 'PATCH' : 'POST';
      const url = editId
        ? `${BASE_API_URL}/api/addresses/${editId}/`
        : `${BASE_API_URL}/api/addresses/`;

      // Send country_code for address + phone_number (E.164) + phone_region (ISO-2)
      const payload = {
        ...formData,
        country_code: formData.country,
        phone_number: e164,
        phone_region: toIso2(phoneIso || formData.country || defaultCountry || 'GH'),
      };

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save address');

      // reset
      setFormData({
        full_name: '',
        address_line_1: '',
        address_line_2: '',
        town: '',
        state_or_region: '',
        country: '',
        postcode: '',
        default: false,
      });
      setPhoneIso('');
      setPhoneVal('');
      setErrors({});
      setSubmitted(false);
      onSave?.();
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <>
      <GoogleMapsLoader onLoad={() => setScriptLoaded(true)} />

      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        {/* Country (address) */}
        <select
          name="country"
          value={formData.country}
          onChange={handleChange}
          required
          className={inputClass('country')}
        >
          <option value="">🌍 Select Country</option>
          {sortedCountries.map((c) => (
            <option key={c.code} value={toIso2(c.code)}>
              {c.flag_emoji} {c.name}
            </option>
          ))}
        </select>
        {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}

        {/* Address line 1 (Google) */}
        {scriptLoaded ? (
          <>
            <GoogleAddressInput
              country={formData.country}
              initialValue={formData.address_line_1}
              onSelect={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  address_line_1: selected.address_line_1 || '',
                  town: selected.town || prev.town,
                  state_or_region: selected.state_or_region || prev.state_or_region,
                  postcode: selected.postcode || prev.postcode,
                  country: prev.country || toIso2(selected.country),
                }))
              }
            />
            <p className="text-sm text-gray-500 -mt-1 mb-1">
              Start typing Address Line 1 and select a suggestion.
            </p>
          </>
        ) : (
          <input
            type="text"
            name="address_line_1"
            placeholder="Address Line 1"
            value={formData.address_line_1}
            onChange={handleChange}
            required
            className={inputClass('address_line_1')}
          />
        )}
        {errors.address_line_1 && <p className="text-red-500 text-sm">{errors.address_line_1}</p>}

        {/* Postcode / Ghana GPS */}
        <input
          type="text"
          name="postcode"
          placeholder="Postcode"
          value={formData.postcode}
          onChange={handlePostcodeChange}
          required
          className={inputClass('postcode')}
        />
        {errors.postcode && <p className="text-red-500 text-sm">{errors.postcode}</p>}

        <input
          type="text"
          name="address_line_2"
          placeholder="Address Line 2 (optional)"
          value={formData.address_line_2}
          onChange={handleChange}
          className={inputClass('address_line_2')}
        />

        <input
          type="text"
          name="town"
          placeholder="Town / City"
          value={formData.town}
          onChange={handleChange}
          required
          className={inputClass('town')}
        />
        {errors.town && <p className="text-red-500 text-sm">{errors.town}</p>}

        <input
          type="text"
          name="state_or_region"
          placeholder="Region / State"
          value={formData.state_or_region}
          onChange={handleChange}
          required
          className={inputClass('state_or_region')}
        />
        {errors.state_or_region && <p className="text-red-500 text-sm">{errors.state_or_region}</p>}

        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={handleChange}
          required
          className={inputClass('full_name')}
        />
        {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name}</p>}

        {/* Phone (international) */}
<PhoneInput
  countries={phoneCountries}
  selectedCountry={phoneIso || formData.country || defaultCountry || 'GH'}
  value={phoneVal}
  onCountryChange={(iso) => {
    phoneIsoTouchedRef.current = true;
    setPhoneIso(toIso2(iso));
    setTouched(false);
    setSubmitted(false);
  }}
  onChange={(val) => {
    setPhoneVal(val);
    setTouched(false);
    setSubmitted(false);
  }}
  onFocus={() => {
    setHasFocus(true);
    setTouched(false);
  }}
  onBlur={() => {
    setHasFocus(false);
    setTouched(true);
  }}
  invalid={!!showError}
/>
        {showError ? (
          <p className="text-xs text-red-700 dark:text-red-400" aria-live="polite">
            Number doesn’t look valid for this country.
          </p>
        ) : showHint ? (
          <p className="text-xs text-gray-500 dark:text-gray-400" aria-live="polite">
            Keep typing… we’ll validate when you’re done.
          </p>
        ) : null}
        {errors.phone_number && <p className="text-red-500 text-sm">{errors.phone_number}</p>}

        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            name="default"
            id="default"
            checked={formData.default}
            onChange={handleChange}
          />
          <label htmlFor="default" className="text-sm">Set as Default Address</label>
        </div>

        {editId && (
          <button type="button" onClick={onCancel} className="text-sm text-gray-500 underline">
            Cancel Edit
          </button>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
          disabled={submitting}
        >
          {submitting ? 'Saving...' : editId ? 'Update Address' : 'Save Address'}
        </button>
      </form>
    </>
  );
}