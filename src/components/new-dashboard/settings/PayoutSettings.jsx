"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import classNames from "classnames";
import { useAuth } from "@/contexts/AuthContext";
import { BASE_API_URL } from "@/app/constants";
import { getCleanToken } from "@/lib/getCleanToken";

export default function PayoutSettings() {
  const { user, token: rawToken, refreshUser } = useAuth();
  const token = getCleanToken(rawToken);

  const [loading, setLoading] = useState(true);
  const [formLocked, setFormLocked] = useState(false);
  const [method, setMethod] = useState("bank");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  // store the code we will SEND to Paystack
  const [bankCode, setBankCode] = useState("");
  // store a separate display code (ghipss) for UI only
  const [bankDisplayCode, setBankDisplayCode] = useState("");
  const [network, setNetwork] = useState("");
  const [accountValidated, setAccountValidated] = useState(false);
  const [maskedAccount, setMaskedAccount] = useState("");
  const [bankList, setBankList] = useState([]);
  const [momoList, setMomoList] = useState([]);
  const [savedPayout, setSavedPayout] = useState(null);

  // ✅ NEW: Load allowed payout methods from API
  const [allowedMethods, setAllowedMethods] = useState(["bank", "momo"]);

  useEffect(() => {
    if (!token) return;
    fetch(`${BASE_API_URL}/api/users/me/payout-methods/`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setAllowedMethods(data.available_methods || ["bank"]);
      })
      .catch(() => {
        toast.warning("Could not fetch payout methods. Defaulting to bank.");
      });
  }, [token]);

  // Load banks/momo + existing payout
  useEffect(() => {
    if (!token) return;

    const fetchInitialData = async () => {
      try {
        // 🏦 Load banks and MoMo networks
        const banksRes = await fetch(`${BASE_API_URL}/api/paystack/banks/`, {
          headers: { Authorization: `Token ${token}` },
        });
        const raw = await banksRes.json();

        // Normalize to ensure we hold both display and paystack codes
        const banks = (Array.isArray(raw) ? raw : []).filter((b) => b.type === "ghipss")
          .map((b) => ({
            id: b.id,
            name: b.name,
            // what we show alongside the name (often ghipss long code)
            displayCode: b.longcode || b.code || "",
            // what we SEND to Paystack /bank/resolve (prefer explicit paystack_code if provided)
            paystackCode: b.paystack_code || b.code_ps || b.code || "",
          }));

        const momos = (Array.isArray(raw) ? raw : []).filter((b) => b.type === "mobile_money")
          .map((b) => ({
            id: b.id,
            name: b.name,
            code: b.code, // Paystack expects MTN / VOD / ATL etc.
          }));

        setBankList(banks);
        setMomoList(momos);

        // 💸 Load user payout info
        const payoutRes = await fetch(`${BASE_API_URL}/api/payout-info/`, {
          headers: { Authorization: `Token ${token}` },
        });

        if (!payoutRes.ok) {
          if (payoutRes.status === 404) {
            toast.info("No payout info found.");
          } else {
            toast.error("Failed to fetch payout info.");
          }
          return;
        }

        const saved = await payoutRes.json();
        setSavedPayout(saved);

        if (saved?.account_number) {
          setFormLocked(true);
          setMethod(saved.method);
          setAccountName(saved.account_name);
          setAccountNumber(saved.account_number);
          setMaskedAccount(
            saved.masked_account_number || `****${saved.account_number.slice(-4)}`
          );

          if (saved.method === "bank") {
            // We don't know if saved.bank_code is paystack or ghipss; assume it's what we should send back
            setBankCode(saved.bank_code || "");
            // try to find bank to show a nice display code
            const found = banks.find(
              (b) =>
                b.paystackCode === saved.bank_code ||
                b.displayCode === saved.bank_code
            );
            setBankDisplayCode(found?.displayCode || saved.bank_code || "");
          } else {
            // ✅ bug fix: this was using saved.bank_code before
            setNetwork(saved.network || "");
          }

          setAccountValidated(!!saved.validated);

          if (saved.locked_after_payout) {
            toast.warning("🔒 This payout info is locked after use and cannot be edited.");
          }
        }
      } catch (err) {
        console.error("❌ Error loading payout data:", err);
        toast.error("Could not load payout settings");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [token]);

  // Validate account whenever number + (bank or network) present
  useEffect(() => {
    const ready =
      accountNumber.length >= 8 &&
      ((method === "bank" && bankCode) || (method === "momo" && network)) &&
      token;

    if (!ready) return;

    const validateAccount = async () => {
      try {
        const params = new URLSearchParams({
          account_number: accountNumber,
          bank_code: method === "bank" ? bankCode : network, // send Paystack bank code or MoMo code
        });

        const res = await fetch(
          `${BASE_API_URL}/api/paystack/validate-account/?${params.toString()}`,
          { headers: { Authorization: `Token ${token}` } }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Validation failed");

        setAccountName(data.account_name || "");
        setAccountValidated(true);
        toast.success("✅ Account validated");
      } catch (e) {
        setAccountName("");
        setAccountValidated(false);
        toast.error(
          e?.message?.includes("invalid_bank_code")
            ? "❌ Invalid bank code for Paystack. Pick a different bank."
            : "❌ Could not validate account"
        );
      }
    };

    validateAccount();
  }, [accountNumber, bankCode, network, method, token]);

  const handleBankChange = (e) => {
    const selected = bankList.find((b) => (b.paystackCode || "") === e.target.value);
    if (accountNumber && !confirm("Change will reset account number. Continue?")) return;

    setBankCode(selected?.paystackCode || "");
    setBankDisplayCode(selected?.displayCode || "");
    setAccountNumber("");
    setAccountName("");
    setAccountValidated(false);
  };

  const handleNetworkChange = (e) => {
    const code = e.target.value;
    if (accountNumber && !confirm("Change will reset account number. Continue?")) return;
    setNetwork(code);
    setAccountNumber("");
    setAccountName("");
    setAccountValidated(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      method,
      account_name: accountName,
      account_number: accountNumber,
      // send the exact value Paystack needs (bank) or the MoMo network code
      bank_code: method === "bank" ? bankCode : network,
      // (optional) if you want to persist what the user saw in the UI
      // ui_display_code: method === "bank" ? bankDisplayCode : undefined,
      network: method === "momo" ? network : undefined,
    };

    try {
      if (!token) throw new Error("Missing authentication token");

      const payoutRes = await fetch(`${BASE_API_URL}/api/payout-info/`, {
        method: formLocked ? "PATCH" : "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const payoutData = await payoutRes.json();
      if (!payoutRes.ok)
        throw new Error(payoutData?.detail || "Failed to save payout info");

      toast.success("✅ Payout info saved!");
      setFormLocked(true);
      refreshUser?.();
    } catch (err) {
      console.error("❌ Submit error:", err);
      toast.error(err.message || "❌ Could not save payout info.");
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
            <p>
              <strong>Method:</strong>{" "}
              {method === "bank" ? "Bank Account" : "Mobile Money"}
            </p>
            <p>
              <strong>Account Name:</strong> {accountName}
            </p>
            <p>
              <strong>Account Number:</strong> {maskedAccount}
            </p>
            <p>
              <strong>{method === "bank" ? "Bank Code (Paystack)" : "MoMo Network"}:</strong>{" "}
              {method === "bank" ? bankCode : network}
            </p>
            {method === "bank" && bankDisplayCode ? (
              <p>
                <strong>Bank Code (Display):</strong> {bankDisplayCode}
              </p>
            ) : null}
            <p>
              <strong>Validated:</strong>{" "}
              {accountValidated ? "✅ Yes" : "❌ No"}
            </p>
          </div>

          {savedPayout?.locked_after_payout ? (
            <p className="text-sm text-gray-500 mt-2">
              🔒 Locked after payout. Contact support to update.
            </p>
          ) : (
            <div className="flex gap-4 mt-2">
              <button
                className="text-blue-600 underline text-sm"
                onClick={() => setFormLocked(false)}
              >
                Edit payout info
              </button>
              <button
                onClick={async () => {
                  const confirmDelete = confirm(
                    "Deleting this payout method will prevent withdrawals until you add a new one. Continue?"
                  );
                  if (!confirmDelete) return;
                  try {
                    const res = await fetch(`${BASE_API_URL}/api/payout-info/`, {
                      method: "DELETE",
                      headers: { Authorization: `Token ${token}` },
                    });
                    if (!res.ok) throw new Error();
                    toast.success("Payout info deleted.");
                    window.location.reload();
                  } catch {
                    toast.error("Could not delete payout info.");
                  }
                }}
                className="text-red-600 underline text-sm"
              >
                Delete payout info
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="mb-6">
            <label className="block font-semibold mb-2">Select Method</label>
            <div className="flex gap-4">
              {allowedMethods.includes("bank") && (
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="method"
                    value="bank"
                    checked={method === "bank"}
                    onChange={() => {
                      setMethod("bank");
                      setAccountNumber("");
                      setAccountName("");
                      setNetwork("");
                      setAccountValidated(false);
                    }}
                  />
                  Bank Account
                </label>
              )}
              {allowedMethods.includes("momo") && (
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="method"
                    value="momo"
                    checked={method === "momo"}
                    onChange={() => {
                      setMethod("momo");
                      setAccountNumber("");
                      setAccountName("");
                      setBankCode("");
                      setBankDisplayCode("");
                      setAccountValidated(false);
                    }}
                  />
                  Mobile Money (MoMo)
                </label>
              )}
            </div>

            {allowedMethods.length === 0 && (
              <p className="text-sm text-red-600 mt-2">
                ❌ No payout methods are currently available for your account.
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {method === "bank" ? (
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
                    <option key={bank.id} value={bank.paystackCode}>
                      {bank.name}
                      {bank.displayCode ? ` (${bank.displayCode})` : ""}
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

            <button
              type="submit"
              className={classNames(
                "bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded",
                {
                  "opacity-50 cursor-not-allowed":
                    !accountNumber ||
                    !accountName ||
                    (method === "bank" ? !bankCode : !network),
                }
              )}
              disabled={
                !accountNumber ||
                !accountName ||
                (method === "bank" ? !bankCode : !network)
              }
            >
              Save Payout Info
            </button>
          </form>
        </>
      )}
    </div>
  );
}