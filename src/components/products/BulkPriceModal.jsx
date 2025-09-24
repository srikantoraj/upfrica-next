// components/products/BulkPriceModal.jsx
'use client';

import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from '@/lib/axiosInstance';
import { b } from '@/lib/api-path';

const Schema = Yup.object({
  field: Yup.string().oneOf(['price_cents', 'sale_price_cents']).required('Required'),
  mode: Yup.string()
    .oneOf(['set', 'raise_pct', 'lower_pct', 'raise_amt', 'lower_amt'])
    .required('Required'),
  value: Yup.number()
    .typeError('Enter a number')
    .when('mode', (mode, s) =>
      mode === 'set'
        ? s.min(0, 'Enter 0 or more').required('Required') // allow 0 for "set"
        : s.moreThan(0, 'Enter a positive number').required('Required')
    ),
  rounding: Yup.string()
    .oneOf(['none', 'nearest_100', 'nearest_50', 'nearest_10', 'charm_99'])
    .required('Required'),
  affect_skus: Yup.boolean(),
});

function labelFor(field) {
  return field === 'sale_price_cents' ? 'Sale price' : 'Base price';
}

function triggerPlanGate() {
  try {
    window.dispatchEvent(
      new CustomEvent('upfrica:plan-gate', { detail: { feature: 'bulk_price' } })
    );
  } catch {
    // no-op (SSR or old browser)
  }
}

export default function BulkPriceModal({ productIds = [], onClose, onDone }) {
  const count = Array.isArray(productIds) ? productIds.length : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-white dark:bg-neutral-900 p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Bulk price update
          </h3>
          <button
            onClick={onClose}
            className="text-sm opacity-70 hover:opacity-100"
            aria-label="Close"
          >
            Close
          </button>
        </div>

        <p className="text-sm mb-4">
          Updating <strong>{count}</strong> product{count === 1 ? '' : 's'}.
        </p>

        <Formik
          initialValues={{
            field: 'price_cents',
            mode: 'raise_pct',
            value: 5, // 5% by default
            rounding: 'nearest_100',
            affect_skus: false,
          }}
          validationSchema={Schema}
          onSubmit={async (vals, { setSubmitting, setStatus }) => {
            setStatus(null);
            try {
              const payload = {
                ids: productIds,
                field: vals.field, // 'price_cents' | 'sale_price_cents'
                mode: vals.mode, // 'set' | 'raise_pct' | 'lower_pct' | 'raise_amt' | 'lower_amt'
                value: Number(vals.value), // for *_amt: major units; for *_pct: percent
                rounding: vals.rounding,
                affect_skus: !!vals.affect_skus,
              };

              const { status, data } = await axios.post(b('products/bulk-price'), payload, {
                withCredentials: true,
                validateStatus: () => true,
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
              });

              if (status >= 200 && status < 300) {
                onDone?.(data);
              } else if (status === 403 && data?.code === 'plan_upgrade_required') {
                // 🔒 Not on a plan with "bulk price update"
                setStatus('This action requires an upgraded plan.');
                triggerPlanGate();
              } else {
                setStatus(data?.detail || 'Update failed');
              }
            } catch {
              setStatus('Network error');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, values, errors, touched, status }) => {
            const isPct = values.mode === 'raise_pct' || values.mode === 'lower_pct';
            const valueLabel = isPct
              ? 'Percent'
              : values.mode === 'set'
              ? 'Amount (major units)'
              : 'Amount (major units)';
            const placeholder = isPct
              ? 'e.g. 5 → ±5%'
              : values.mode === 'set'
              ? 'e.g. 10.00'
              : 'e.g. 2.50';

            const showUpgradeCta =
              typeof status === 'string' && /upgrade/i.test(status);

            return (
              <Form className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-sm">
                    <span className="block mb-1">Field</span>
                    <Field
                      as="select"
                      name="field"
                      className="w-full border rounded-md px-3 py-2 bg-transparent"
                    >
                      <option value="price_cents">Base price</option>
                      <option value="sale_price_cents">Sale price</option>
                    </Field>
                  </label>

                  <label className="block text-sm">
                    <span className="block mb-1">Mode</span>
                    <Field
                      as="select"
                      name="mode"
                      className="w-full border rounded-md px-3 py-2 bg-transparent"
                    >
                      <option value="set">Set to exact amount</option>
                      <option value="raise_pct">Increase by %</option>
                      <option value="lower_pct">Decrease by %</option>
                      <option value="raise_amt">Increase by amount</option>
                      <option value="lower_amt">Decrease by amount</option>
                    </Field>
                  </label>
                </div>

                <label className="block text-sm">
                  <span className="block mb-1">{valueLabel}</span>
                  <Field
                    name="value"
                    type="number"
                    step="0.01"
                    min={values.mode === 'set' ? 0 : 0}
                    placeholder={placeholder}
                    className="w-full border rounded-md px-3 py-2 bg-transparent"
                  />
                  {touched.value && errors.value && (
                    <span className="text-red-600 text-xs">{errors.value}</span>
                  )}
                </label>

                <label className="block text-sm">
                  <span className="block mb-1">Rounding</span>
                  <Field
                    as="select"
                    name="rounding"
                    className="w-full border rounded-md px-3 py-2 bg-transparent"
                  >
                    <option value="none">No rounding</option>
                    <option value="nearest_100">Nearest 1.00</option>
                    <option value="nearest_50">Nearest 0.50</option>
                    <option value="nearest_10">Nearest 0.10</option>
                    <option value="charm_99">Charm pricing (… .99)</option>
                  </Field>
                </label>

                <label className="inline-flex items-center gap-2 text-sm">
                  <Field type="checkbox" name="affect_skus" />
                  Also update SKU price overrides (where present)
                </label>

                {status && (
                  <div
                    className={`text-sm ${
                      showUpgradeCta ? 'text-amber-600' : 'text-red-600'
                    }`}
                  >
                    {status}{' '}
                    {showUpgradeCta && (
                      <button
                        type="button"
                        onClick={triggerPlanGate}
                        className="underline decoration-dotted underline-offset-2 hover:opacity-90"
                      >
                        Upgrade
                      </button>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3 py-2 rounded-md border"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || count === 0}
                    className="px-3 py-2 rounded-md text-white bg-[var(--violet-600,#7c3aed)] hover:bg-[var(--violet-700,#6d28d9)] disabled:opacity-60"
                    title={count === 0 ? 'Select at least one product' : undefined}
                  >
                    {isSubmitting
                      ? 'Updating…'
                      : `Update ${count} item${count === 1 ? '' : 's'}`}
                  </button>
                </div>

                <p className="text-xs opacity-70">
                  Will modify {labelFor(values.field)} on the selected products.
                  {values.mode === 'set' && values.field === 'sale_price_cents' ? (
                    <>
                      {' '}
                      You can set it to <strong>0</strong> to clear sale pricing.
                    </>
                  ) : null}
                </p>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}