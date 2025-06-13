'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import classNames from 'classnames';
import useAuth from '@/components/useAuth';
import { BASE_API_URL } from '@/app/constants';

export default function PayoutSettings() {
  const { user, token: rawToken, refreshUser } = useAuth();
  const token = rawToken?.replace(/^"|"$/g, '') || '';

  const [loading, setLoading] = useState(true);
  const [formLocked, setFormLocked] = useState(false);
  const [method, setMethod] = useState('bank');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [network, setNetwork] = useState('');
  const [accountValidated, setAccountValidated] = useState(false);
  const [maskedAccount, setMaskedAccount] = useState('');

  const [bankList, setBankList] = useState([]);
  const [momoList, setMomoList] = useState([]);

  useEffect(() => {
    if (!token) return;
    const fetchInitialData = async () => {
      try {
        const banksRes = await fetch(`${BASE_API_URL}/api/paystack/banks/`, {
          headers: { Authorization: `Token ${token}` },
        });
        const allBanks = await banksRes.json();
        setBankList(allBanks.filter((b) => b.type === 'ghipss'));
        setMomoList(allBanks.filter((b) => b.type === 'mobile_money'));

        const payoutRes = await fetch(`${BASE_API_URL}/api/payout-info/`, {
          headers: { Authorization: `Token ${token}` },
        });
        if (!payoutRes.ok) throw new Error('Failed to fetch payout info');
        const saved = await payoutRes.json();

        if (saved?.account_number) {
          setFormLocked(true);
          setMethod(saved.method);
          setAccountName(saved.account_name);
          setAccountNumber(saved.account_number);
          setMaskedAccount(saved.masked_account_number || `****${saved.account_number.slice(-4)}`);
          setBankCode(saved.method === 'bank' ? saved.bank_code : '');
          setNetwork(saved.method === 'momo' ? saved.bank_code : '');
          setAccountValidated(saved.validated);
        }
      } catch (err) {
        toast.error('Could not load payout settings');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [token]);

  useEffect(() => {
    if (
      accountNumber.length >= 8 &&
      ((method === 'bank' && bankCode) || (method === 'momo' && network)) &&
      token
    ) {
      const validateAccount = async () => {
        try {
          const res = await fetch(
            `${BASE_API_URL}/api/paystack/validate-account/?account_number=${accountNumber}&bank_code=${method === 'bank' ? bankCode : network}`,
            {
              headers: { Authorization: `Token ${token}` },
            }
          );
          const data = await res.json();
          if (!res.ok) throw new Error();
          setAccountName(data.account_name || '');
          setAccountValidated(true);
          toast.success('✅ Account validated');
        } catch {
          setAccountName('');
          setAccountValidated(false);
          toast.error('❌ Could not validate account');
        }
      };

      validateAccount();
    }
  }, [accountNumber, bankCode, network, method, token]);

  const handleBankChange = (e) => {
    const code = e.target.value;
    if (accountNumber && !confirm('Change will reset account number. Continue?')) return;
    setBankCode(code);
    setAccountNumber('');
    setAccountName('');
    setAccountValidated(false);
  };

  const handleNetworkChange = (e) => {
    const code = e.target.value;
    if (accountNumber && !confirm('Change will reset account number. Continue?')) return;
    setNetwork(code);
    setAccountNumber('');
    setAccountName('');
    setAccountValidated(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      method,
      account_name: accountName,
      account_number: accountNumber,
      bank_code: method === 'bank' ? bankCode : network,
    };

    try {
      if (!token) throw new Error('Missing authentication token');

      const userRes = await fetch(`${BASE_API_URL}/api/users/me/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payout_info: payload }),
      });

      const userData = await userRes.json();
      if (!userRes.ok) {
        throw new Error(userData?.detail || 'Failed to update user info');
      }

      const payoutRes = await fetch(`${BASE_API_URL}/api/payout-info/`, {
        method: formLocked ? 'PATCH' : 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const payoutData = await payoutRes.json();
      if (!payoutRes.ok) {
        throw new Error(payoutData?.detail || 'Failed to save payout info');
      }

      toast.success('✅ Payout info saved!');
      setFormLocked(true);
      refreshUser?.();
    } catch (err) {
      console.error('❌ Submit error:', err);
      toast.error(err.message || '❌ Could not save payout info.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto p-6 text-center text-gray-500">
        Loading payout settings...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6">Set Your Payout Method</h2>

      {formLocked ? (
        <>
          <div className="mb-4 p-4 bg-green-50 border border-green-300 rounded text-green-800">
            ✅ You’ve already added your payout method.
          </div>
          <div className="mb-6 space-y-2 text-sm">
            <p><strong>Method:</strong> {method === 'bank' ? 'Bank Account' : 'Mobile Money'}</p>
            <p><strong>Account Name:</strong> {accountName}</p>
            <p><strong>Account Number:</strong> {maskedAccount}</p>
            <p><strong>{method === 'bank' ? 'Bank Code' : 'MoMo Network'}:</strong> {method === 'bank' ? bankCode : network}</p>
            <p><strong>Validated:</strong> {accountValidated ? '✅ Yes' : '❌ No'}</p>
          </div>
          <button className="text-blue-600 underline text-sm" onClick={() => setFormLocked(false)}>
            Edit payout info
          </button>
        </>
      ) : (
        <>
          <div className="mb-6">
            <label className="block font-semibold mb-2">Select Method</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="method"
                  value="bank"
                  checked={method === 'bank'}
                  onChange={() => {
                    setMethod('bank');
                    setAccountNumber('');
                    setAccountName('');
                    setNetwork('');
                    setAccountValidated(false);
                  }}
                />
                Bank Account
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="method"
                  value="momo"
                  checked={method === 'momo'}
                  onChange={() => {
                    setMethod('momo');
                    setAccountNumber('');
                    setAccountName('');
                    setBankCode('');
                    setAccountValidated(false);
                  }}
                />
                Mobile Money (MoMo)
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Select Bank or MoMo First */}
            {method === 'bank' ? (
              <div>
                <label className="block mb-1 font-medium">Select Bank</label>
                <select
                  value={bankCode}
                  onChange={handleBankChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">-- Choose a bank --</option>
                  {bankList.map((bank) => (
                    <option key={bank.id} value={bank.code}>
                      {bank.name} ({bank.code})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block mb-1 font-medium">MoMo Network</label>
                <select
                  value={network}
                  onChange={handleNetworkChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">-- Choose MoMo network --</option>
                  {momoList.map((item) => (
                    <option key={item.id} value={item.code}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Then Account Number */}
            <div>
              <label className="block mb-1 font-medium">Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            {/* Account Name (Read-Only) */}
            <div>
              <label className="block mb-1 font-medium flex items-center gap-2">
                Account Name
                <span className="text-gray-400 cursor-help" title="Auto-filled after validation">🔒</span>
                {accountValidated && (
                  <span className="text-green-600 text-sm font-medium">✅ Validated</span>
                )}
              </label>
              <input
                type="text"
                value={accountName}
                readOnly
                className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-700 pointer-events-none cursor-not-allowed"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={classNames(
                "bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded",
                {
                  "opacity-50 cursor-not-allowed":
                    !accountNumber || !accountName || (method === 'bank' ? !bankCode : !network),
                }
              )}
              disabled={!accountNumber || !accountName || (method === 'bank' ? !bankCode : !network)}
            >
              Save Payout Info
            </button>
          </form>
        </>
      )}
    </div>
  );
}