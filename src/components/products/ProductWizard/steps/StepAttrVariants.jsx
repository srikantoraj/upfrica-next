// "use client";

// import { useEffect, useState } from "react";
// import { Formik, Form, Field, FieldArray } from "formik";

// // Helpers
// const asList = (x) => (Array.isArray(x) ? x : Array.isArray(x?.results) ? x.results : []);
// const toNum = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);
// async function safeJson(res) {
//   try { return await res.json(); } catch { return null; }
// }
// const normValueOut = (v) => ({ value: String(v?.value ?? "").trim(), active: v?.active !== false });

// // Component
// export default function StepAttrVariants({ productId }) {
//   const [loading, setLoading] = useState(true);
//   const [variants, setVariants] = useState([]); // [{id,label,values:[{id,value,active}], ui:{...}}]
//   const [error, setError] = useState("");
//   const [msg, setMsg] = useState("");

//   // ---------- load ----------
//   async function loadVariants() {
//     if (!productId) return;
//     setLoading(true);
//     setError("");
//     setMsg("");
//     try {
//       const res = await fetch(`/api/products/${productId}/variants/`, {
//         credentials: "include",
//         headers: { Accept: "application/json" },
//         cache: "no-store",
//       });
//       if (!res.ok) throw new Error(`Failed to load variants (${res.status})`);
//       const payload = await safeJson(res);
//       const list = asList(payload)
//         .map((v) => ({
//           id: toNum(v?.id ?? v?.pk),
//           label: String(v?.label ?? v?.name ?? "").trim(),
//           values: asList(v?.values).map((vv) => ({
//             id: toNum(vv?.id),
//             value: (vv?.value ?? vv?.label ?? "").toString(),
//             active: vv?.active !== false,
//           })),
//           ui: { renaming: false, renameText: String(v?.label ?? v?.name ?? "").trim(), addingText: "" },
//         }))
//         .filter((v) => v.id > 0);
//       setVariants(list);
//     } catch (e) {
//       setVariants([]);
//       setError(e?.message || "Failed to load variants");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => { loadVariants(); /* eslint-disable-next-line */ }, [productId]);

//   // ---------- API: PATCH & DELETE ----------
//   async function patchVariant(variantId, patchBody) {
//     const res = await fetch(`/api/products/${productId}/variants/${variantId}/`, {
//       method: "PATCH",
//       credentials: "include",
//       headers: { "Content-Type": "application/json", Accept: "application/json" },
//       body: JSON.stringify(patchBody),
//     });
//     if (!res.ok) {
//       const body = await safeJson(res);
//       throw new Error((body && JSON.stringify(body)) || `Update failed (${res.status})`);
//     }
//     return res.json();
//   }

//   async function deleteVariant(variantId) {
//     const res = await fetch(`/api/products/${productId}/variants/${variantId}/`, {
//       method: "DELETE",
//       credentials: "include",
//       headers: { Accept: "application/json" },
//     });
//     if (!res.ok && res.status !== 204) {
//       const body = await safeJson(res);
//       throw new Error((body && JSON.stringify(body)) || `Delete failed (${res.status})`);
//     }
//   }

//   // ---------- Axis ops ----------
//   async function renameAxis(variantId, newLabel) {
//     const label = String(newLabel || "").trim();
//     if (!label) return;
//     setError(""); setMsg("");
//     try {
//       const server = await patchVariant(variantId, { label });
//       setVariants((prev) =>
//         prev.map((v) =>
//           v.id === variantId
//             ? { ...v, label: server?.label || label, ui: { ...v.ui, renaming: false, renameText: server?.label || label } }
//             : v
//         )
//       );
//       setMsg("Axis renamed.");
//     } catch (e) {
//       setError(e?.message || "Failed to rename axis");
//     }
//   }

//   async function removeAxis(variantId) {
//     setError(""); setMsg("");
//     try {
//       await deleteVariant(variantId);
//       setVariants((prev) => prev.filter((v) => v.id !== variantId));
//       setMsg("Axis deleted.");
//     } catch (e) {
//       setError(e?.message || "Failed to delete axis");
//     }
//   }

//   // ---------- Value ops (PATCH full values set each time) ----------
//   // Add a value
//   async function addValue(variantId, label) {
//     const val = String(label || "").trim();
//     if (!val) return;
//     setError(""); setMsg("");
//     try {
//       const variant = variants.find((v) => v.id === variantId);
//       const nextValues = [...(variant?.values || []), { value: val, active: true }];
//       const server = await patchVariant(variantId, { values: nextValues.map(normValueOut) });
//       syncValuesFromServer(variantId, server);
//       setVariants((prev) =>
//         prev.map((v) =>
//           v.id === variantId ? { ...v, ui: { ...v.ui, addingText: "" } } : v
//         )
//       );
//       setMsg("Value added.");
//     } catch (e) {
//       setError(e?.message || "Failed to add value");
//     }
//   }

//   // Edit/rename a single value (by index)
//   async function editValue(variantId, index, newLabel) {
//     const txt = String(newLabel || "").trim();
//     setError(""); setMsg("");
//     try {
//       const variant = variants.find((v) => v.id === variantId);
//       const nextValues = (variant?.values || []).map((vv, i) => ({
//         value: i === index ? txt : vv.value,
//         active: vv.active !== false,
//       }));
//       const server = await patchVariant(variantId, { values: nextValues });
//       syncValuesFromServer(variantId, server);
//       setMsg("Value updated.");
//     } catch (e) {
//       setError(e?.message || "Failed to update value");
//     }
//   }

//   // Delete a value (by index)
//   async function deleteValue(variantId, index) {
//     setError(""); setMsg("");
//     try {
//       const variant = variants.find((v) => v.id === variantId);
//       const nextValues = (variant?.values || [])
//         .filter((_, i) => i !== index)
//         .map((vv) => ({ value: vv.value, active: vv.active !== false }));
//       const server = await patchVariant(variantId, { values: nextValues });
//       syncValuesFromServer(variantId, server);
//       setMsg("Value removed.");
//     } catch (e) {
//       setError(e?.message || "Failed to remove value");
//     }
//   }

//   function syncValuesFromServer(variantId, serverVariant) {
//     const normalized = asList(serverVariant?.values).map((vv) => ({
//       id: toNum(vv?.id),
//       value: (vv?.value ?? vv?.label ?? "").toString(),
//       active: vv?.active !== false,
//       ui: { editing: false, editText: (vv?.value ?? vv?.label ?? "").toString() },
//     }));
//     setVariants((prev) =>
//       prev.map((v) =>
//         v.id === variantId
//           ? {
//             ...v,
//             values: normalized.length
//               ? normalized
//               : (v.values || []).map((vv) => ({
//                 ...vv,
//                 ui: { editing: false, editText: vv.value },
//               })),
//           }
//           : v
//       )
//     );
//   }

//   // ---------- UI ----------
//   if (loading) return <div className="text-sm text-gray-500">Loading…</div>;

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center gap-3">
//         <h2 className="text-2xl font-semibold">Attributes &amp; Variants</h2>
//       </div>

//       {error && <div className="text-sm text-red-600 break-words">{error}</div>}
//       {msg && !error && <div className="text-sm text-emerald-600">{msg}</div>}

//       {/* Create axis + values */}
//       <CreateAxisForm productId={productId} onCreated={loadVariants} />

//       {/* Existing axes */}
//       <div className="space-y-4">
//         <h3 className="text-sm font-medium">Existing variant axes</h3>
//         {variants.length === 0 ? (
//           <div className="text-sm text-gray-500">No variant axes yet.</div>
//         ) : (
//           variants.map((v) => (
//             <AxisCard
//               key={v.id}
//               v={v}
//               setVariants={setVariants}
//               onRename={(newLabel) => renameAxis(v.id, newLabel)}
//               onDelete={() => removeAxis(v.id)}
//               onAddValue={(label) => addValue(v.id, label)}
//               onEditValue={(index, txt) => editValue(v.id, index, txt)}
//               onDeleteValue={(index) => deleteValue(v.id, index)}
//             />
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// /* ---------------- subcomponents ---------------- */

// function CreateAxisForm({ productId, onCreated }) {
//   return (
//     <div className="border rounded p-4">
//       <h3 className="text-sm font-medium mb-3">Create a new variant axis</h3>
//       <Formik
//         initialValues={{ label: "", values: [{ value: "" }] }}
//         validate={(vals) => {
//           const errs = {};
//           const label = (vals.label || "").trim();
//           if (!label) errs.label = "Axis name is required.";
//           const clean = (vals.values || []).map((v) => (v?.value ?? "").trim());
//           if (clean.length === 0 || clean.every((s) => !s)) {
//             errs.values = "Add at least one non-empty value.";
//           }
//           const uniq = new Set(clean.filter(Boolean).map((s) => s.toLowerCase()));
//           if (uniq.size !== clean.filter(Boolean).length) {
//             errs.values = "Duplicate values are not allowed.";
//           }
//           return errs;
//         }}
//         onSubmit={async (vals, helpers) => {
//           const { setSubmitting, resetForm, setStatus } = helpers;
//           setSubmitting(true);
//           setStatus(null);
//           try {
//             const body = {
//               label: (vals.label || "").trim(),
//               values: (vals.values || [])
//                 .map((v) => ({ value: String(v?.value ?? "").trim() }))
//                 .filter((v) => v.value.length > 0),
//             };
//             const res = await fetch(`/api/products/${productId}/variants/`, {
//               method: "POST",
//               credentials: "include",
//               headers: { "Content-Type": "application/json", Accept: "application/json" },
//               body: JSON.stringify(body),
//             });
//             const text = await res.text();
//             if (!res.ok) {
//               let msg = text;
//               try { msg = JSON.stringify(JSON.parse(text)); } catch { }
//               throw new Error(msg || `Create variant failed (${res.status})`);
//             }
//             resetForm();
//             setStatus({ ok: true, message: "Created." });
//             onCreated?.();
//           } catch (e) {
//             setStatus({ ok: false, message: e?.message || "Failed to create variant" });
//           } finally {
//             setSubmitting(false);
//           }
//         }}
//       >
//         {({ values, errors, touched, isSubmitting, status }) => (
//           <Form className="space-y-3">
//             <div>
//               <label className="block text-sm font-medium mb-1">Axis name</label>
//               <Field
//                 name="label"
//                 placeholder='e.g., "Color" or "Size"'
//                 className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
//               />
//               {touched.label && errors.label && (
//                 <div className="text-xs text-red-600 mt-1">{errors.label}</div>
//               )}
//             </div>

//             <div>
//               <div className="flex items-center justify-between">
//                 <label className="block text-sm font-medium mb-1">Values</label>
//               </div>
//               <FieldArray name="values">
//                 {({ push, remove }) => (
//                   <div className="space-y-2">
//                     {values.values.map((row, idx) => (
//                       <div key={idx} className="flex items-center gap-2">
//                         <Field
//                           name={`values.${idx}.value`}
//                           placeholder={idx === 0 ? 'e.g., "Red"' : 'e.g., "Blue"'}
//                           className="flex-1 rounded border px-3 py-2 bg-white dark:bg-gray-900"
//                         />
//                         <button
//                           type="button"
//                           className="px-2 py-2 rounded border"
//                           onClick={() => remove(idx)}
//                           disabled={values.values.length <= 1}
//                           title="Remove value"
//                         >
//                           −
//                         </button>
//                         <button
//                           type="button"
//                           className="px-2 py-2 rounded border"
//                           onClick={() => push({ value: "" })}
//                           title="Add value"
//                         >
//                           +
//                         </button>
//                       </div>
//                     ))}
//                     {touched.values && errors.values && (
//                       <div className="text-xs text-red-600">{errors.values}</div>
//                     )}
//                   </div>
//                 )}
//               </FieldArray>
//             </div>

//             <div className="pt-2">
//               <button
//                 type="submit"
//                 className="px-3 py-2 rounded border bg-white dark:bg-gray-900"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? "Creating…" : "Create axis + values"}
//               </button>
//               {status?.message && (
//                 <span className={`ml-3 text-xs ${status.ok ? "text-emerald-600" : "text-red-600"}`}>
//                   {status.message}
//                 </span>
//               )}
//             </div>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   );
// }

// function AxisCard({ v, setVariants, onRename, onDelete, onAddValue, onEditValue, onDeleteValue }) {
//   const [local, setLocal] = useState(v); // keep a local copy for UI toggles

//   // keep local in sync if parent updates
//   useEffect(() => { setLocal(v); }, [v]);

//   return (
//     <div className="border rounded p-3 space-y-3">
//       {/* Axis header (rename + delete) */}
//       <div className="flex items-center justify-between gap-3">
//         <div className="flex-1">
//           {local.ui?.renaming ? (
//             <div className="flex items-center gap-2">
//               <input
//                 className="flex-1 rounded border px-3 py-2 bg-white dark:bg-gray-900"
//                 value={local.ui.renameText}
//                 onChange={(e) =>
//                   setLocal((prev) => ({ ...prev, ui: { ...prev.ui, renameText: e.target.value } }))
//                 }
//               />
//               <button
//                 className="px-3 py-2 rounded border"
//                 onClick={() => onRename?.(local.ui.renameText)}
//               >
//                 Save
//               </button>
//               <button
//                 className="px-3 py-2 rounded border"
//                 onClick={() =>
//                   setVariants((prev) =>
//                     prev.map((x) =>
//                       x.id === local.id
//                         ? { ...x, ui: { ...x.ui, renaming: false, renameText: x.label } }
//                         : x
//                     )
//                   )
//                 }
//               >
//                 Cancel
//               </button>
//             </div>
//           ) : (
//             <div className="flex items-center gap-3">
//               <div className="text-sm font-medium">{local.label}</div>
//               <button
//                 className="px-2 py-1 text-xs rounded border"
//                 onClick={() =>
//                   setVariants((prev) =>
//                     prev.map((x) =>
//                       x.id === local.id
//                         ? { ...x, ui: { ...x.ui, renaming: true, renameText: x.label } }
//                         : x
//                     )
//                   )
//                 }
//               >
//                 Rename
//               </button>
//             </div>
//           )}
//         </div>
//         <button className="px-2 py-1 text-xs rounded border" onClick={() => onDelete?.()}>
//           Delete axis
//         </button>
//       </div>

//       {/* Values list (edit / delete) */}
//       <div className="space-y-2">
//         {(local.values || []).length === 0 ? (
//           <div className="text-xs text-gray-500">No values yet.</div>
//         ) : (
//           (local.values || []).map((vv, idx) => (
//             <ValueRow
//               key={vv.id ?? `${local.id}-${idx}`}
//               valueObj={vv}
//               onSave={(txt) => onEditValue?.(idx, txt)}
//               onDelete={() => onDeleteValue?.(idx)}
//             />
//           ))
//         )}
//       </div>

//       {/* Add new value */}
//       <div className="flex items-end gap-2">
//         <div className="flex-1">
//           <label className="block text-xs font-medium mb-1">Add value</label>
//           <input
//             className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
//             placeholder='e.g., "Red", "XL"'
//             value={local.ui?.addingText || ""}
//             onChange={(e) =>
//               setVariants((prev) =>
//                 prev.map((x) =>
//                   x.id === local.id ? { ...x, ui: { ...x.ui, addingText: e.target.value } } : x
//                 )
//               )
//             }
//           />
//         </div>
//         <button
//           className="px-3 py-2 rounded border bg-white dark:bg-gray-900"
//           onClick={() => onAddValue?.(local.ui?.addingText || "")}
//           disabled={!(local.ui?.addingText || "").trim()}
//         >
//           Add
//         </button>
//       </div>
//     </div>
//   );
// }

// function ValueRow({ valueObj, onSave, onDelete }) {
//   const [editing, setEditing] = useState(false);
//   const [txt, setTxt] = useState(valueObj.value || "");

//   useEffect(() => { setTxt(valueObj.value || ""); }, [valueObj.value]);

//   return (
//     <div className="flex items-center gap-2">
//       {editing ? (
//         <>
//           <input
//             className="flex-1 rounded border px-3 py-2 bg-white dark:bg-gray-900"
//             value={txt}
//             onChange={(e) => setTxt(e.target.value)}
//           />
//           <button
//             className="px-2 py-2 rounded border"
//             onClick={() => { onSave?.(txt); setEditing(false); }}
//             disabled={!txt.trim()}
//           >
//             Save
//           </button>
//           <button
//             className="px-2 py-2 rounded border"
//             onClick={() => { setTxt(valueObj.value || ""); setEditing(false); }}
//           >
//             Cancel
//           </button>
//         </>
//       ) : (
//         <>
//           <span className="flex-1 text-xs border rounded-full px-2 py-1">{valueObj.value}</span>
//           <button className="px-2 py-1 text-xs rounded border" onClick={() => setEditing(true)}>
//             Edit
//           </button>
//           <button className="px-2 py-1 text-xs rounded border" onClick={() => onDelete?.()}>
//             Delete
//           </button>
//         </>
//       )}
//     </div>
//   );
// }



"use client";

import { useEffect, useMemo, useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";

/* ===================== helpers ===================== */
const asList = (x) => (Array.isArray(x) ? x : Array.isArray(x?.results) ? x.results : []);
const toNum = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);
async function safeJson(res) { try { return await res.json(); } catch { return null; } }
const normValueOut = (v) => ({ value: String(v?.value ?? "").trim(), active: v?.active !== false });

// money helpers (2 decimals)
const toCents = (major) => {
  if (major === null || major === undefined || major === "") return null;
  const n = Number(major);
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 100);
};
const fromCents = (cents) => {
  if (cents === null || cents === undefined) return "";
  const n = Number(cents);
  if (!Number.isFinite(n)) return "";
  return (n / 100).toFixed(2);
};

// cartesian product of arrays
function cartesianProduct(arrays) {
  if (!arrays.length) return [];
  return arrays.reduce((acc, arr) => acc.flatMap((x) => arr.map((y) => [...x, y])), [[]]);
}

// fingerprint of a combo (sorted ids)
const fp = (ids) => (ids || []).slice().sort((a, b) => a - b).join("-");

/* ===================== main component ===================== */
export default function StepAttrVariants({ productId }) {
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [product, setProduct] = useState(null);

  // variants: [{id,label,values:[{id,value,active}], ui: {...}}]
  const [variants, setVariants] = useState([]);

  // SKU map keyed by fingerprint "id-id-..."
  // value: { id?(skuId), value_ids:[], sku, barcode, quantity, price_major_override, sale_price_major_override }
  const [skuRows, setSkuRows] = useState({});

  /* -------- load product (for currency label, optional) -------- */
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!productId) return;
      try {
        const res = await fetch(`/api/products/${productId}/`, {
          credentials: "include", headers: { Accept: "application/json" }, cache: "no-store",
        });
        if (res.ok) {
          const p = await res.json();
          if (alive) setProduct(p);
        }
      } catch { }
    })();
    return () => { alive = false; };
  }, [productId]);

  /* -------- load variants -------- */
  async function loadVariants() {
    if (!productId) return;
    setLoading(true); setError(""); setMsg("");
    try {
      const res = await fetch(`/api/products/${productId}/variants/`, {
        credentials: "include", headers: { Accept: "application/json" }, cache: "no-store",
      });
      if (!res.ok) throw new Error(`Failed to load variants (${res.status})`);
      const payload = await safeJson(res);
      const list = asList(payload)
        .map((v) => ({
          id: toNum(v?.id ?? v?.pk),
          label: String(v?.label ?? v?.name ?? "").trim(),
          values: asList(v?.values).map((vv) => ({
            id: toNum(vv?.id),
            value: (vv?.value ?? vv?.label ?? "").toString(),
            active: vv?.active !== false,
          })),
          ui: { renaming: false, renameText: String(v?.label ?? v?.name ?? "").trim(), addingText: "" },
        }))
        .filter((v) => v.id > 0);
      setVariants(list);
    } catch (e) {
      setVariants([]); setError(e?.message || "Failed to load variants");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadVariants(); /* eslint-disable-next-line */ }, [productId]);

  /* -------- load SKUs and merge into skuRows -------- */
  async function loadSkusIntoRows(currentVariants) {
    if (!productId) return;
    try {
      const res = await fetch(`/api/products/${productId}/skus/`, {
        credentials: "include", headers: { Accept: "application/json" }, cache: "no-store",
      });
      const payload = res.ok ? await safeJson(res) : [];
      const existing = {};
      asList(payload).forEach((row) => {
        const valueIds = (row?.value_ids || []).map((x) => toNum(x));
        const key = fp(valueIds);
        existing[key] = {
          id: toNum(row?.id),
          value_ids: valueIds,
          sku: row?.sku || "",
          barcode: row?.barcode || "",
          quantity: toNum(row?.quantity, 0),
          price_major_override: fromCents(row?.price_cents_override),
          sale_price_major_override: fromCents(row?.sale_price_cents_override),
          primary_image_key: row?.primary_image_key || "",
        };
      });

      // also pre-build missing combos as blank rows so user can fill + save
      const combos = buildCombos(currentVariants);
      combos.forEach(({ ids }) => {
        const key = fp(ids);
        if (!existing[key]) {
          existing[key] = {
            id: null, value_ids: ids, sku: "", barcode: "", quantity: 0,
            price_major_override: "", sale_price_major_override: "", primary_image_key: "",
          };
        }
      });

      setSkuRows(existing);
    } catch (e) {
      // don’t block the page; show partial
    }
  }

  // whenever variants change (e.g., added values), recompute missing combos and merge
  useEffect(() => {
    if (!variants?.length) { setSkuRows({}); return; }
    loadSkusIntoRows(variants);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variants]);

  /* -------- API helpers for variants -------- */
  async function patchVariant(variantId, patchBody) {
    const res = await fetch(`/api/products/${productId}/variants/${variantId}/`, {
      method: "PATCH", credentials: "include",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(patchBody),
    });
    if (!res.ok) {
      const body = await safeJson(res);
      throw new Error((body && JSON.stringify(body)) || `Update failed (${res.status})`);
    }
    return res.json();
  }
  async function deleteVariant(variantId) {
    const res = await fetch(`/api/products/${productId}/variants/${variantId}/`, {
      method: "DELETE", credentials: "include", headers: { Accept: "application/json" },
    });
    if (!res.ok && res.status !== 204) {
      const body = await safeJson(res);
      throw new Error((body && JSON.stringify(body)) || `Delete failed (${res.status})`);
    }
  }

  /* -------- Axis ops -------- */
  async function renameAxis(variantId, newLabel) {
    const label = String(newLabel || "").trim(); if (!label) return;
    setMsg(""); setError("");
    try {
      const server = await patchVariant(variantId, { label });
      setVariants((prev) =>
        prev.map((v) =>
          v.id === variantId
            ? { ...v, label: server?.label || label, ui: { ...v.ui, renaming: false, renameText: server?.label || label } }
            : v
        )
      );
      setMsg("Axis renamed.");
    } catch (e) { setError(e?.message || "Failed to rename axis"); }
  }
  async function removeAxis(variantId) {
    setMsg(""); setError("");
    try {
      await deleteVariant(variantId);
      setVariants((prev) => prev.filter((v) => v.id !== variantId));
      // Remove SKU rows whose combos used that axis values
      setSkuRows((prev) => {
        const keep = {};
        const allValueIds = new Set(
          variants.filter(v => v.id !== variantId).flatMap(v => v.values.map(vv => vv.id))
        );
        Object.entries(prev).forEach(([k, row]) => {
          if (row.value_ids.every(id => allValueIds.has(id))) keep[k] = row;
        });
        return keep;
      });
      setMsg("Axis deleted.");
    } catch (e) { setError(e?.message || "Failed to delete axis"); }
  }

  /* -------- Value ops (replace full set each time) -------- */
  async function addValue(variantId, label) {
    const val = String(label || "").trim(); if (!val) return;
    setMsg(""); setError("");
    try {
      const variant = variants.find((v) => v.id === variantId);
      const nextValues = [...(variant?.values || []), { value: val, active: true }];
      const server = await patchVariant(variantId, { values: nextValues.map(normValueOut) });
      syncValuesFromServer(variantId, server);
      // also add placeholders for new combos in skuRows
      const updated = variants.map(v => v.id === variantId ? { ...v, values: asList(server?.values).map(x => ({ id: toNum(x?.id), value: String(x?.value ?? x?.label ?? ""), active: x?.active !== false })) } : v);
      const combos = buildCombos(updated);
      setSkuRows(prev => {
        const copy = { ...prev };
        combos.forEach(({ ids }) => {
          const key = fp(ids);
          if (!copy[key]) {
            copy[key] = { id: null, value_ids: ids, sku: "", barcode: "", quantity: 0, price_major_override: "", sale_price_major_override: "", primary_image_key: "" };
          }
        });
        return copy;
      });
      setMsg("Value added.");
    } catch (e) { setError(e?.message || "Failed to add value"); }
  }
  async function editValue(variantId, index, newLabel) {
    const txt = String(newLabel || "").trim();
    setMsg(""); setError("");
    try {
      const variant = variants.find((v) => v.id === variantId);
      const nextValues = (variant?.values || []).map((vv, i) => ({ value: i === index ? txt : vv.value, active: vv.active !== false }));
      const server = await patchVariant(variantId, { values: nextValues });
      syncValuesFromServer(variantId, server);
      setMsg("Value updated.");
    } catch (e) { setError(e?.message || "Failed to update value"); }
  }
  async function deleteValue(variantId, index) {
    setMsg(""); setError("");
    try {
      const variant = variants.find((v) => v.id === variantId);
      const removed = variant?.values?.[index];
      const nextValues = (variant?.values || []).filter((_, i) => i !== index).map(vv => ({ value: vv.value, active: vv.active !== false }));
      const server = await patchVariant(variantId, { values: nextValues });
      syncValuesFromServer(variantId, server);

      // purge skuRows that contained the removed value id
      if (removed?.id) {
        const removedId = removed.id;
        setSkuRows(prev => {
          const copy = {};
          Object.entries(prev).forEach(([k, row]) => {
            if (!row.value_ids.includes(removedId)) copy[k] = row;
          });
          return copy;
        });
      }
      setMsg("Value removed.");
    } catch (e) { setError(e?.message || "Failed to remove value"); }
  }
  function syncValuesFromServer(variantId, serverVariant) {
    const normalized = asList(serverVariant?.values).map((vv) => ({
      id: toNum(vv?.id),
      value: (vv?.value ?? vv?.label ?? "").toString(),
      active: vv?.active !== false,
      ui: { editing: false, editText: (vv?.value ?? vv?.label ?? "").toString() },
    }));
    setVariants((prev) =>
      prev.map((v) => (v.id === variantId ? { ...v, values: normalized } : v))
    );
  }

  /* -------- build all combos from current variants -------- */
  function buildCombos(list) {
    const axes = list
      .map((v) => ({
        variantId: v.id,
        variantLabel: v.label,
        values: (v.values || []).filter((vv) => vv.active !== false && vv.value && vv.id),
      }))
      .filter((x) => x.values.length > 0);
    if (axes.length === 0) return [];
    const grid = cartesianProduct(axes.map((a) => a.values.map((vv) => ({ ...vv, variantId: a.variantId, variantLabel: a.variantLabel }))));
    return grid.map((row) => ({
      ids: row.map((v) => toNum(v.id)),
      label: row.map((v) => `${v.variantLabel}: ${v.value}`).join(" • "),
    }));
  }

  const combos = useMemo(() => buildCombos(variants), [variants]);
  const currency = (product?.price_currency || "GHS").toUpperCase();

  /* -------- SKU save / upsert -------- */
  async function upsertAllSkus() {
    setMsg(""); setError("");
    try {
      let created = 0, updated = 0, failed = 0;
      for (const combo of combos) {
        const key = fp(combo.ids);
        const row = skuRows[key];
        if (!row) continue;

        const body = {
          value_ids: combo.ids,
          sku: row.sku || "",
          barcode: row.barcode || "",
          quantity: toNum(row.quantity, 0),
          price_cents_override: toCents(row.price_major_override),
          sale_price_cents_override: toCents(row.sale_price_major_override),
          primary_image_key: row.primary_image_key || "",
        };

        if (row.id) {
          // PATCH existing
          const res = await fetch(`/api/products/${productId}/skus/${row.id}/`, {
            method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(body),
          });
          if (res.ok) { updated++; }
          else { failed++; }
        } else {
          // POST new
          const res = await fetch(`/api/products/${productId}/skus/`, {
            method: "POST", credentials: "include", headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(body),
          });
          if (res.ok) { created++; }
          else { failed++; }
        }
      }
      setMsg(`SKUs saved • created ${created}, updated ${updated}${failed ? `, failed ${failed}` : ""}.`);
      // refresh from server to sync ids
      await loadSkusIntoRows(variants);
    } catch (e) {
      setError(e?.message || "Failed to save SKUs");
    }
  }

  /* ===================== UI ===================== */
  if (loading) return <div className="text-sm text-gray-500">Loading…</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-semibold">Attributes &amp; Variants</h2>
      </div>
      {error && <div className="text-sm text-red-600 break-words">{error}</div>}
      {msg && !error && <div className="text-sm text-emerald-600">{msg}</div>}

      {/* ===== Create axis + values ===== */}
      <CreateAxisForm productId={productId} onCreated={loadVariants} />

      {/* ===== Existing axes (rename/delete; add/edit/delete values) ===== */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Existing variant axes</h3>
        {variants.length === 0 ? (
          <div className="text-sm text-gray-500">No variant axes yet.</div>
        ) : (
          variants.map((v) => (
            <AxisCard
              key={v.id}
              v={v}
              setVariants={setVariants}
              onRename={(newLabel) => renameAxis(v.id, newLabel)}
              onDelete={() => removeAxis(v.id)}
              onAddValue={(label) => addValue(v.id, label)}
              onEditValue={(index, txt) => editValue(v.id, index, txt)}
              onDeleteValue={(index) => deleteValue(v.id, index)}
            />
          ))
        )}
      </div>

      {/* ===== SKU Matrix (price/stock per combination) ===== */}
      <div className="space-y-3 border-t pt-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">SKU Matrix (Price &amp; Stock)</h3>
          <button
            className="px-3 py-2 rounded border bg-white dark:bg-gray-900"
            onClick={upsertAllSkus}
            disabled={!combos.length}
          >
            Save all SKUs
          </button>
        </div>

        {!combos.length ? (
          <div className="text-sm text-gray-500">
            Add at least one axis with values to generate combinations.
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full text-sm border">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="px-3 py-2 text-left border">Combination</th>
                  <th className="px-3 py-2 text-left border">SKU</th>
                  <th className="px-3 py-2 text-left border">Barcode</th>
                  <th className="px-3 py-2 text-right border">Qty</th>
                  <th className="px-3 py-2 text-right border">Price Override ({currency})</th>
                  <th className="px-3 py-2 text-right border">Sale Override ({currency})</th>
                </tr>
              </thead>
              <tbody>
                {combos.map(({ ids, label }) => {
                  const key = fp(ids);
                  const row = skuRows[key] || { id: null, value_ids: ids, sku: "", barcode: "", quantity: 0, price_major_override: "", sale_price_major_override: "" };
                  return (
                    <tr key={key} className="border-t">
                      <td className="px-3 py-2 align-top border">{label}</td>
                      <td className="px-3 py-2 align-top border">
                        <input
                          className="w-40 rounded border px-2 py-1 bg-white dark:bg-gray-900"
                          value={row.sku}
                          onChange={(e) =>
                            setSkuRows((prev) => ({ ...prev, [key]: { ...row, sku: e.target.value } }))
                          }
                        />
                      </td>
                      <td className="px-3 py-2 align-top border">
                        <input
                          className="w-40 rounded border px-2 py-1 bg-white dark:bg-gray-900"
                          value={row.barcode}
                          onChange={(e) =>
                            setSkuRows((prev) => ({ ...prev, [key]: { ...row, barcode: e.target.value } }))
                          }
                        />
                      </td>
                      <td className="px-3 py-2 align-top border text-right">
                        <input
                          className="w-24 rounded border px-2 py-1 bg-white dark:bg-gray-900 text-right"
                          inputMode="numeric"
                          value={row.quantity}
                          onChange={(e) =>
                            setSkuRows((prev) => ({ ...prev, [key]: { ...row, quantity: e.target.value.replace(/[^\d-]/g, "") } }))
                          }
                        />
                      </td>
                      <td className="px-3 py-2 align-top border text-right">
                        <input
                          className="w-28 rounded border px-2 py-1 bg-white dark:bg-gray-900 text-right"
                          inputMode="decimal"
                          placeholder="—"
                          value={row.price_major_override}
                          onChange={(e) =>
                            setSkuRows((prev) => ({ ...prev, [key]: { ...row, price_major_override: e.target.value } }))
                          }
                          title="Leave blank to use base product price"
                        />
                      </td>
                      <td className="px-3 py-2 align-top border text-right">
                        <input
                          className="w-28 rounded border px-2 py-1 bg-white dark:bg-gray-900 text-right"
                          inputMode="decimal"
                          placeholder="—"
                          value={row.sale_price_major_override}
                          onChange={(e) =>
                            setSkuRows((prev) => ({ ...prev, [key]: { ...row, sale_price_major_override: e.target.value } }))
                          }
                          title="Leave blank to use base product sale price"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-2">
              Leave price fields blank to inherit the product’s base/sale price. Overrides are applied only when set.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===================== subcomponents ===================== */

function CreateAxisForm({ productId, onCreated }) {
  return (
    <div className="border rounded p-4">
      <h3 className="text-sm font-medium mb-3">Create a new variant axis</h3>
      <Formik
        initialValues={{ label: "", values: [{ value: "" }] }}
        validate={(vals) => {
          const errs = {};
          const label = (vals.label || "").trim();
          if (!label) errs.label = "Axis name is required.";
          const clean = (vals.values || []).map((v) => (v?.value ?? "").trim());
          if (clean.length === 0 || clean.every((s) => !s)) {
            errs.values = "Add at least one non-empty value.";
          }
          const uniq = new Set(clean.filter(Boolean).map((s) => s.toLowerCase()));
          if (uniq.size !== clean.filter(Boolean).length) {
            errs.values = "Duplicate values are not allowed.";
          }
          return errs;
        }}
        onSubmit={async (vals, helpers) => {
          const { setSubmitting, resetForm, setStatus } = helpers;
          setSubmitting(true); setStatus(null);
          try {
            const body = {
              label: (vals.label || "").trim(),
              values: (vals.values || [])
                .map((v) => ({ value: String(v?.value ?? "").trim() }))
                .filter((v) => v.value.length > 0),
            };
            const res = await fetch(`/api/products/${productId}/variants/`, {
              method: "POST", credentials: "include",
              headers: { "Content-Type": "application/json", Accept: "application/json" },
              body: JSON.stringify(body),
            });
            const text = await res.text();
            if (!res.ok) {
              let msg = text; try { msg = JSON.stringify(JSON.parse(text)); } catch { }
              throw new Error(msg || `Create variant failed (${res.status})`);
            }
            resetForm(); setStatus({ ok: true, message: "Created." });
            onCreated?.();
          } catch (e) {
            setStatus({ ok: false, message: e?.message || "Failed to create variant" });
          } finally { setSubmitting(false); }
        }}
      >
        {({ values, errors, touched, isSubmitting, status }) => (
          <Form className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Axis name</label>
              <Field
                name="label"
                placeholder='e.g., "Color" or "RAM"'
                className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
              />
              {touched.label && errors.label && (
                <div className="text-xs text-red-600 mt-1">{errors.label}</div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium mb-1">Values</label>
              </div>
              <FieldArray name="values">
                {({ push, remove }) => (
                  <div className="space-y-2">
                    {values.values.map((row, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Field
                          name={`values.${idx}.value`}
                          placeholder={idx === 0 ? 'e.g., "8GB"' : 'e.g., "16GB"'}
                          className="flex-1 rounded border px-3 py-2 bg-white dark:bg-gray-900"
                        />
                        <button type="button" className="px-2 py-2 rounded border" onClick={() => remove(idx)} disabled={values.values.length <= 1}>−</button>
                        <button type="button" className="px-2 py-2 rounded border" onClick={() => push({ value: "" })}>+</button>
                      </div>
                    ))}
                    {touched.values && errors.values && (
                      <div className="text-xs text-red-600">{errors.values}</div>
                    )}
                  </div>
                )}
              </FieldArray>
            </div>

            <div className="pt-2">
              <button type="submit" className="px-3 py-2 rounded border bg-white dark:bg-gray-900" disabled={isSubmitting}>
                {isSubmitting ? "Creating…" : "Create axis + values"}
              </button>
              {status?.message && (
                <span className={`ml-3 text-xs ${status.ok ? "text-emerald-600" : "text-red-600"}`}>{status.message}</span>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

function AxisCard({ v, setVariants, onRename, onDelete, onAddValue, onEditValue, onDeleteValue }) {
  const [local, setLocal] = useState(v);
  useEffect(() => { setLocal(v); }, [v]);

  return (
    <div className="border rounded p-3 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          {local.ui?.renaming ? (
            <div className="flex items-center gap-2">
              <input
                className="flex-1 rounded border px-3 py-2 bg-white dark:bg-gray-900"
                value={local.ui.renameText}
                onChange={(e) =>
                  setVariants((prev) =>
                    prev.map((x) =>
                      x.id === local.id ? { ...x, ui: { ...x.ui, renameText: e.target.value } } : x
                    )
                  )
                }
              />
              <button className="px-3 py-2 rounded border" onClick={() => onRename?.(local.ui.renameText)}>Save</button>
              <button
                className="px-3 py-2 rounded border"
                onClick={() =>
                  setVariants((prev) =>
                    prev.map((x) =>
                      x.id === local.id
                        ? { ...x, ui: { ...x.ui, renaming: false, renameText: x.label } }
                        : x
                    )
                  )
                }
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="text-sm font-medium">{local.label}</div>
              <button
                className="px-2 py-1 text-xs rounded border"
                onClick={() =>
                  setVariants((prev) =>
                    prev.map((x) =>
                      x.id === local.id ? { ...x, ui: { ...x.ui, renaming: true, renameText: x.label } } : x
                    )
                  )
                }
              >
                Rename
              </button>
            </div>
          )}
        </div>
        <button className="px-2 py-1 text-xs rounded border" onClick={() => onDelete?.()}>Delete axis</button>
      </div>

      {/* Values list with edit/delete */}
      <div className="space-y-2">
        {(local.values || []).length === 0 ? (
          <div className="text-xs text-gray-500">No values yet.</div>
        ) : (
          (local.values || []).map((vv, idx) => (
            <ValueRow
              key={vv.id ?? `${local.id}-${idx}`}
              valueObj={vv}
              onSave={(txt) => onEditValue?.(idx, txt)}
              onDelete={() => onDeleteValue?.(idx)}
            />
          ))
        )}
      </div>

      {/* Add new value */}
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <label className="block text-xs font-medium mb-1">Add value</label>
          <input
            className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-900"
            placeholder='e.g., "8GB", "16GB"'
            value={local.ui?.addingText || ""}
            onChange={(e) =>
              setVariants((prev) =>
                prev.map((x) =>
                  x.id === local.id ? { ...x, ui: { ...x.ui, addingText: e.target.value } } : x
                )
              )
            }
          />
        </div>
        <button
          className="px-3 py-2 rounded border bg-white dark:bg-gray-900"
          onClick={() => onAddValue?.(local.ui?.addingText || "")}
          disabled={!(local.ui?.addingText || "").trim()}
        >
          Add
        </button>
      </div>
    </div>
  );
}

function ValueRow({ valueObj, onSave, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [txt, setTxt] = useState(valueObj.value || "");
  useEffect(() => { setTxt(valueObj.value || ""); }, [valueObj.value]);

  return (
    <div className="flex items-center gap-2">
      {editing ? (
        <>
          <input className="flex-1 rounded border px-3 py-2 bg-white dark:bg-gray-900" value={txt} onChange={(e) => setTxt(e.target.value)} />
          <button className="px-2 py-2 rounded border" onClick={() => { onSave?.(txt); setEditing(false); }} disabled={!txt.trim()}>Save</button>
          <button className="px-2 py-2 rounded border" onClick={() => { setTxt(valueObj.value || ""); setEditing(false); }}>Cancel</button>
        </>
      ) : (
        <>
          <span className="flex-1 text-xs border rounded-full px-2 py-1">{valueObj.value}</span>
          <button className="px-2 py-1 text-xs rounded border" onClick={() => setEditing(true)}>Edit</button>
          <button className="px-2 py-1 text-xs rounded border" onClick={() => onDelete?.()}>Delete</button>
        </>
      )}
    </div>
  );
}
