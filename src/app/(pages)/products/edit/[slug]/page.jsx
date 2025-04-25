
// "use client";
// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { useFormik } from "formik";
// import { FaMinus, FaPlus } from "react-icons/fa";
// import { IoMdNotifications } from "react-icons/io";

// import Title from "@/components/inpute/Title";
// import Description from "@/components/inpute/Description";
// import Categore from "@/components/inpute/Categore";
// import Conditon from "@/components/inpute/Conditon";
// import Brand from "@/components/inpute/Brand";
// import PriceSection from "@/components/inpute/PriceSection";
// import Promotions from "@/components/inpute/Promotions";
// import DeliverySection from "@/components/inpute/DeliverySection";
// import CancellationReturns from "@/components/inpute/CancellationReturns";
// import ApprovalNotesSelect from "@/components/inpute/ApprovalNotesSelect";

// import PhotoUploader from "@/components/inpute/Photo";

// export default function EditProductPage({ params }) {
//     const { slug } = params;
//     const { user, token } = useSelector((state) => state.auth);

//     const [product, setProduct] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [positionsOpen, setPositionsOpen] = useState(false);
//     const [isOpen, setIsOpen] = useState(false);
//     const [selectedImages, setSelectedImages] = useState([]);
//     const [multi, setMulti] = useState([])

//     // ─── Fetch the existing product ───────────────────────────────────────────────
//     useEffect(() => {
//         async function fetchProduct() {
//             try {
//                 const res = await fetch(
//                     `https://media.upfrica.com/api/products/${slug}/`
//                 );
//                 const data = await res.json();
//                 setProduct(data);
//                 const temp_multi_buy_tiers =JSON.parse(data?.secondary_data?.multi_buy_tiers) || [{}]
                
//                 setMulti(temp_multi_buy_tiers)
//                 // preload existing images into uploader
//                 setSelectedImages(
//                     (data.product_images || []).map((url) => ({ data_url: url }))
//                 );
//             } catch (err) {
//                 console.error("Failed to load product:", err);
//             } finally {
//                 setLoading(false);
//             }
//         }
//         fetchProduct();
//     }, [slug]);

//     // ─── Formik setup ──────────────────────────────────────────────────────────────
//     const formik = useFormik({
//         enableReinitialize: true,
//         initialValues: {
//             title: product?.title || "",
//             description: product?.description || "",
//             product_quantity: product?.product_quantity || 1,
//             price_cents: product?.price_cents?.toString() || "0",
//             price_currency: product?.price_currency || "GHS",
//             status: product?.status || "",

//             on_sales: product?.on_sales ? "yes" : "no",
//             sale_price_cents: product?.sale_price_cents || 0,
//             sale_start_date: product?.sale_start_date || "",
//             sale_end_date: product?.sale_end_date || "",

//             postage_fee_cents: product?.postage_fee_cents || 0,
//             secondary_postage_fee_cents: product?.secondary_postage_fee_cents || 0,

//             multi_buy: product?.secondary_data?.multi_buy ? "yes" : "no",
//             multi_buy_tiers: multi?.length > 1 ? multi : [{}],

//             supplierLink: product?.supplierLink || "",
//             backupSupplier: product?.backupSupplier || "",
//             supplerName: product?.supplerName || "",
//             supplerNumber: product?.supplerNumber || "",
//             productPrice: product?.productPrice || "",
//             vPrice: product?.vPrice || "",
//             Vshipping: product?.Vshipping || "",
//             L: product?.L || "",
//             W: product?.W || "",
//             H: product?.H || "",
//             CBM: product?.CBM || "",
//             rate: product?.rate || "",
//             cmb: product?.cmb || "",
//             shoppingCost: product?.shoppingCost || "",
//             productCost: product?.productCost || "",
//             totalCost: product?.totalCost || "",

//             cancellable: product?.secondary_data?.cancellable || false,
//             cancellationWindowHours: product?.cancellation_policy?.cancellationWindowHours || 2,
//             sellerResponseSLA: product?.cancellation_policy?.sellerResponseSLA || "24h",
//             denyIfShippedOrCustom: product?.cancellation_policy?.denyIfShippedOrCustom || false,
//             autoCancelUnpaidHours: product?.cancellation_policy?.autoCancelUnpaidHours || 48,
//             abuseFlagThreshold: product?.cancellation_policy?.abuseFlagThreshold || 5,

//             approval_notes: product?.secondary_data?.approval_notes || "",
//             brand: product?.brand?.id || "",
//             category: product?.category?.id || "",
//             condition: product?.condition?.id || "",
//         },
//         onSubmit: async (values) => {
//             const formData = new FormData();

//             // ─── Core product info ─────────────────────────────
//             formData.append("title", values.title);
//             formData.append("description", values.description);
//             formData.append(
//                 "product_quantity",
//                 values.product_quantity.toString()
//             );
//             formData.append("price_cents", values.price_cents);
//             formData.append("price_currency", values.price_currency);
//             formData.append("user_id", user?.user?.id);
//             formData.append("brand", values.brand);
//             formData.append("category", values.category);
//             formData.append("condition", values.condition);
//             // missing in original: status
//             formData.append("status", values.status);

//             // ─── Sales & promotions ───────────────────────────
//             if (values.on_sales === "yes") {
//                 formData.append("on_sales", "yes");
//                 formData.append(
//                     "sale_price_cents",
//                     values.sale_price_cents.toString()
//                 );
//                 formData.append(
//                     "sale_price_currency",
//                     values.price_currency
//                 );
//                 formData.append("sale_start_date", values.sale_start_date);
//                 formData.append("sale_end_date", values.sale_end_date);
//             } else {
//                 // explicitly clear any existing sale
//                 formData.append("on_sales", "no");
//             }

//             // ─── Shipping fees ────────────────────────────────
//             formData.append(
//                 "postage_fee_cents",
//                 values.postage_fee_cents.toString()
//             );
//             formData.append(
//                 "postage_fee_cents_currency",
//                 values.price_currency
//             );
//             formData.append(
//                 "secondary_postage_fee_cents",
//                 values.secondary_postage_fee_cents.toString()
//             );
//             formData.append(
//                 "secondary_postage_fee_cents_currency",
//                 values.price_currency
//             );

//             // ─── Multi-buy ────────────────────────────────────
//             if (values.multi_buy === "yes") {
//                 formData.append("multi_buy", "yes");
//                 formData.append("multi_buy_tiers", JSON.stringify(values.multi_buy_tiers));
//             }

//             // ─── Supplier & costing ───────────────────────────
//             formData.append("supplierLink", values.supplierLink);
//             formData.append("backupSupplier", values.backupSupplier);
//             formData.append("supplerName", values.supplerName);
//             formData.append("supplerNumber", values.supplerNumber);
//             formData.append("productPrice", values.productPrice);
//             formData.append("vPrice", values.vPrice);
//             formData.append("Vshipping", values.Vshipping);
//             formData.append("L", values.L);
//             formData.append("W", values.W);
//             formData.append("H", values.H);
//             formData.append("CBM", values.CBM);
//             formData.append("rate", values.rate);
//             formData.append("cmb", values.cmb);
//             formData.append("shoppingCost", values.shoppingCost);
//             formData.append("productCost", values.productCost);
//             formData.append("totalCost", values.totalCost);

//             // ─── Cancellation policy ─────────────────────────
//             const cancelFlag = values.cancellable ? "yes" : "no";
//             formData.append("cancellable", cancelFlag);
//             formData.append(
//                 "cancellation_policy",
//                 cancelFlag === "yes"
//                     ? JSON.stringify({
//                         cancellable: values.cancellable,
//                         cancellationWindowHours: values.cancellationWindowHours,
//                         sellerResponseSLA: values.sellerResponseSLA,
//                         denyIfShippedOrCustom: values.denyIfShippedOrCustom,
//                         autoCancelUnpaidHours: values.autoCancelUnpaidHours,
//                         abuseFlagThreshold: values.abuseFlagThreshold,
//                     })
//                     : ""
//             );

//             // ─── Approval notes ───────────────────────────────
//             formData.append("approval_notes", values.approval_notes);

//             // ─── Images (mix of URLs & new files) ────────────
//             const existingUrls = selectedImages
//                 .filter((img) => !img.file)
//                 .map((img) => img.data_url);
//             if (existingUrls.length > 0) {
//                 formData.append(
//                     "existing_image_urls",
//                     JSON.stringify(existingUrls)
//                 );
//             }
//             selectedImages
//                 .filter((img) => img.file)
//                 .forEach((img) =>
//                     formData.append("images", img.file, img.file.name)
//             );
            
//             console.log("Form Values:", values);
//             for (let [key, value] of formData.entries()) {
//                 console.log(`${key}:`, value);
//             }
//             // return;


//             // ─── Send PATCH ───────────────────────────────────
//             const myHeaders = new Headers();
//             myHeaders.append("Authorization", `Token ${token}`);

//             try {
//                 const res = await fetch(
//                     `https://media.upfrica.com/api/product/${product.id}/`,
//                     {
//                         method: "PATCH",
//                         headers: myHeaders,
//                         body: formData,
//                     }
//                 );
//                 const result = await res.json();
//                 console.log("Update result:", result);
//                 // TODO: navigate or show success message
//             } catch (err) {
//                 console.error("Update failed:", err);
//             }
//         },
//     });

//     if (loading) return <div>Loading…</div>;

//     return (
//         <div className="flex justify-center md:pt-20 bg-slate-50 px-2 md:px-4">
//             <form
//                 onSubmit={formik.handleSubmit}
//                 className="w-full lg:max-w-5xl py-5"
//             >
//                 {/* ─── Page Title ───────────────────────────── */}
//                 <div className="text-center space-y-4 pb-10">
//                     <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
//                         Edit Listing: {product.title}
//                     </h1>
//                 </div>

//                 {/* ─── Homepage Positions ───────────────────── */}
//                 <div className="p-4 bg-white shadow-md rounded-xl mb-4">
//                     <div className="flex justify-between items-center">
//                         <h2 className="font-bold">Homepage Positions</h2>
//                         <button
//                             onClick={(e) => {
//                                 e.preventDefault();
//                                 setPositionsOpen(!positionsOpen);
//                             }}
//                         >
//                             {positionsOpen ? <FaMinus /> : <FaPlus />}
//                         </button>
//                     </div>
//                     {positionsOpen && (
//                         <div className="pt-2 space-y-2">
//                             {[1, 2, 3, 4, 5].map((pos) => (
//                                 <label key={pos} className="flex items-center">
//                                     <input type="checkbox" className="mr-2 rounded" />
//                                     Position {pos}
//                                 </label>
//                             ))}
//                         </div>
//                     )}
//                 </div>

//                 {/* ─── Supplier & Costing (Admin) ───────────── */}
//                 <div className="p-4 bg-white shadow-md rounded-xl mb-4">
//                     <div className="flex justify-between items-center">
//                         <div className="flex items-center space-x-2">
//                             <IoMdNotifications />
//                             <span className="font-bold">Supplier & Costing</span>
//                         </div>
//                         <button
//                             onClick={(e) => {
//                                 e.preventDefault();
//                                 setIsOpen(!isOpen);
//                             }}
//                         >
//                             {isOpen ? <FaMinus /> : <FaPlus />}
//                         </button>
//                     </div>
//                     {isOpen && (
//                         <div className="p-4 space-y-4 text-base text-[#3c4858]">
//                             {/* Supplier Link */}
//                             <div>
//                                 <label className="block font-bold mb-2">
//                                     Supplier Link or GPS*
//                                 </label>
//                                 <input
//                                     id="supplierLink"
//                                     name="supplierLink"
//                                     type="text"
//                                     onChange={formik.handleChange}
//                                     value={formik.values.supplierLink}
//                                     className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
//                                 />
//                             </div>
//                             {/* Backup Supplier */}
//                             <div>
//                                 <label className="block font-bold mb-2">
//                                     Backup Supplier Link
//                                 </label>
//                                 <input
//                                     id="backupSupplier"
//                                     name="backupSupplier"
//                                     type="text"
//                                     onChange={formik.handleChange}
//                                     value={formik.values.backupSupplier}
//                                     className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
//                                 />
//                             </div>
//                             {/* Name & Phone */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block font-bold mb-2">Supplier Name</label>
//                                     <input
//                                         id="supplerName"
//                                         name="supplerName"
//                                         type="text"
//                                         onChange={formik.handleChange}
//                                         value={formik.values.supplerName}
//                                         className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block font-bold mb-2">
//                                         Supplier Phone Number
//                                     </label>
//                                     <input
//                                         id="supplerNumber"
//                                         name="supplerNumber"
//                                         type="text"
//                                         onChange={formik.handleChange}
//                                         value={formik.values.supplerNumber}
//                                         className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
//                                     />
//                                 </div>
//                             </div>
//                             {/* Product Costing */}
//                             <div>
//                                 <p className="font-bold">Product Costing (USD)</p>
//                                 <div className="flex items-center space-x-2">
//                                     <span>Price $</span>
//                                     <input
//                                         id="productPrice"
//                                         name="productPrice"
//                                         type="text"
//                                         onChange={formik.handleChange}
//                                         value={formik.values.productPrice}
//                                         className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
//                                     />
//                                 </div>
//                             </div>
//                             {/* Detailed breakdown */}
//                             <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
//                                 {[
//                                     { id: "vPrice", label: "Vprice ($)" },
//                                     { id: "Vshipping", label: "Vshipping" },
//                                     { id: "L", label: "L" },
//                                     { id: "W", label: "W" },
//                                     { id: "H", label: "H" },
//                                     { id: "CBM", label: "1CBM" },
//                                     { id: "rate", label: "Rate ($ → GHS)" },
//                                 ].map(({ id, label }) => (
//                                     <div key={id}>
//                                         <label className="flex flex-col items-center">
//                                             <span className="font-bold">{label}</span>
//                                             <input
//                                                 id={id}
//                                                 name={id}
//                                                 type="text"
//                                                 onChange={formik.handleChange}
//                                                 value={formik.values[id]}
//                                                 className="w-full px-2 py-1 border rounded-md text-center"
//                                             />
//                                         </label>
//                                     </div>
//                                 ))}
//                             </div>
//                             {/* Totals */}
//                             <div className="space-y-2">
//                                 {[
//                                     { id: "cmb", label: "CBM:" },
//                                     { id: "shoppingCost", label: "Shipping Cost:" },
//                                     { id: "productCost", label: "Product cost:" },
//                                     { id: "totalCost", label: "Total cost:" },
//                                 ].map(({ id, label }) => (
//                                     <div key={id} className="flex items-center space-x-2">
//                                         <span className="font-bold">{label}</span>
//                                         <input
//                                             id={id}
//                                             name={id}
//                                             type="text"
//                                             onChange={formik.handleChange}
//                                             value={formik.values[id]}
//                                             className="w-full px-3 py-2 border rounded-md"
//                                         />
//                                     </div>
//                                 ))}
//                             </div>
//                             {/* Payment Terms */}
//                             <div className="mt-4">
//                                 <p className="font-bold mb-2">*Select Payment Terms</p>
//                                 <div className="space-y-2">
//                                     <label className="flex items-center space-x-2">
//                                         <input type="checkbox" />
//                                         <span>Payment before delivery</span>
//                                     </label>
//                                     <label className="flex items-center space-x-2">
//                                         <input type="checkbox" />
//                                         <span>Payment on collection</span>
//                                     </label>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* ─── Main Product Sections ─────────────────────── */}
//                 <div className="bg-white shadow-md rounded-md p-4 space-y-4 mb-4">
//                     <PhotoUploader
//                         initialImages={product.product_images}
//                         onImagesSelect={setSelectedImages}
//                     />
//                     <Title formik={formik} />
//                     <Description formik={formik} />
//                     <Categore formik={formik} />
//                     <Conditon formik={formik} />
//                     <Brand formik={formik} />
//                 </div>

//                 <PriceSection formik={formik} />
//                 <DeliverySection formik={formik} />
//                 <Promotions formik={formik} />
//                 <CancellationReturns formik={formik} />
//                 <ApprovalNotesSelect formik={formik} />

//                 {/* ─── Form Actions ───────────────────────────── */}
//                 <div className="flex justify-between p-4">
//                     <button
//                         type="submit"
//                         disabled={formik.isSubmitting}
//                         className="bg-purple-500 text-white px-6 py-2 rounded-md"
//                     >
//                         {formik.isSubmitting ? "Saving…" : "Save Changes"}
//                     </button>
//                     <button
//                         type="button"
//                         onClick={() => window.history.back()}
//                         className="text-gray-700 hover:underline"
//                     >
//                         Cancel
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// }


'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { IoMdNotifications } from 'react-icons/io';

import Title from '@/components/inpute/Title';
import Description from '@/components/inpute/Description';
import Categore from '@/components/inpute/Categore';
import Conditon from '@/components/inpute/Conditon';
import Brand from '@/components/inpute/Brand';
import PriceSection from '@/components/inpute/PriceSection';
import Promotions from '@/components/inpute/Promotions';
import DeliverySection from '@/components/inpute/DeliverySection';
import CancellationReturns from '@/components/inpute/CancellationReturns';
import ApprovalNotesSelect from '@/components/inpute/ApprovalNotesSelect';
import PhotoUploader from '@/components/inpute/Photo';

export default function EditProductPage({ params }) {
    const { slug } = params;
    const { user, token } = useSelector(state => state.auth);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [positionsOpen, setPositionsOpen] = useState(false);
    const [supplierOpen, setSupplierOpen] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [multiBuyTiers, setMultiBuyTiers] = useState([]);

    // Fetch existing product and parse multi_buy_tiers
    useEffect(() => {
        async function fetchProduct() {
            try {
                const res = await fetch(`https://media.upfrica.com/api/products/${slug}/`);
                const data = await res.json();

                // parse JSON-encoded tiers
                let tiers = [];
                if (data.secondary_data?.multi_buy_tiers) {
                    try {
                        const parsed = JSON.parse(data.secondary_data.multi_buy_tiers);
                        if (Array.isArray(parsed)) tiers = parsed;
                    } catch (e) {
                        console.warn('Could not parse multi_buy_tiers:', e);
                    }
                }
                // always have at least one tier object
                if (tiers.length === 0) tiers = [{ min_quantity: '', price_each: '' }];

                setProduct(data);
                setMultiBuyTiers(tiers);
                setSelectedImages(
                    (data.product_images || []).map(url => ({ data_url: url }))
                );
            } catch (err) {
                console.error('Failed to load product:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [slug]);

    // Initialize Formik
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: product?.title || '',
            description: product?.description || '',
            product_quantity: product?.product_quantity || 1,
            price_cents: product?.price_cents?.toString() || '0',
            price_currency: product?.price_currency || 'GHS',
            status: product?.status || '',

            on_sales: product?.on_sales === 'yes' ? 'yes' : 'no',
            sale_price_cents: product?.sale_price_cents || 0,
            sale_start_date: product?.sale_start_date || '',
            sale_end_date: product?.sale_end_date || '',

            postage_fee_cents: product?.postage_fee_cents || 0,
            secondary_postage_fee_cents: product?.secondary_postage_fee_cents || 0,

            multi_buy: product?.secondary_data?.multi_buy === 'yes' ? 'yes' : 'no',
            multi_buy_tiers: multiBuyTiers,

            cancellable: product?.secondary_data?.cancellable || false,
            cancellationWindowHours:
                product?.cancellation_policy?.cancellationWindowHours || 2,
            sellerResponseSLA:
                product?.cancellation_policy?.sellerResponseSLA || '24h',
            denyIfShippedOrCustom:
                product?.cancellation_policy?.denyIfShippedOrCustom || false,
            autoCancelUnpaidHours:
                product?.cancellation_policy?.autoCancelUnpaidHours || 48,
            abuseFlagThreshold:
                product?.cancellation_policy?.abuseFlagThreshold || 5,

            approval_notes: product?.secondary_data?.approval_notes || '',
            brand: product?.brand?.id || '',
            category: product?.category?.id || '',
            condition: product?.condition?.id || '',
        },
        onSubmit: async values => {
            const formData = new FormData();
            // Core fields
            formData.append('title', values.title);
            formData.append('description', values.description);
            formData.append('product_quantity', values.product_quantity.toString());
            formData.append('price_cents', values.price_cents);
            formData.append('price_currency', values.price_currency);
            formData.append('status', values.status);
            formData.append('user_id', user?.user?.id);
            formData.append('brand', values.brand);
            formData.append('category', values.category);
            formData.append('condition', values.condition);

            // Sales
            formData.append('on_sales', values.on_sales);
            if (values.on_sales === 'yes') {
                formData.append('sale_price_cents', values.sale_price_cents.toString());
                formData.append('sale_price_currency', values.price_currency);
                formData.append('sale_start_date', values.sale_start_date);
                formData.append('sale_end_date', values.sale_end_date);
            }

            // Shipping
            formData.append('postage_fee_cents', values.postage_fee_cents.toString());
            formData.append(
                'secondary_postage_fee_cents',
                values.secondary_postage_fee_cents.toString()
            );

            // Multi-buy
            formData.append('multi_buy', values.multi_buy);
            if (values.multi_buy === 'yes') {
                formData.append(
                    'multi_buy_tiers',
                    JSON.stringify(values.multi_buy_tiers)
                );
            }

            // Cancellation policy
            formData.append('cancellable', values.cancellable ? 'yes' : 'no');
            if (values.cancellable) {
                formData.append(
                    'cancellation_policy',
                    JSON.stringify({
                        cancellable: values.cancellable,
                        cancellationWindowHours: values.cancellationWindowHours,
                        sellerResponseSLA: values.sellerResponseSLA,
                        denyIfShippedOrCustom: values.denyIfShippedOrCustom,
                        autoCancelUnpaidHours: values.autoCancelUnpaidHours,
                        abuseFlagThreshold: values.abuseFlagThreshold,
                    })
                );
            }

            // Approval notes
            formData.append('approval_notes', values.approval_notes);

            // Images: existing URLs + new files
            const existingUrls = selectedImages
                .filter(img => !img.file)
                .map(img => img.data_url);
            if (existingUrls.length) {
                formData.append('existing_image_urls', JSON.stringify(existingUrls));
            }
            selectedImages
                .filter(img => img.file)
                .forEach(img => formData.append('images', img.file, img.file.name));

            // PATCH request
            try {
                const res = await fetch(
                    `https://media.upfrica.com/api/product/${product.id}/`,
                    {
                        method: 'PATCH',
                        headers: { Authorization: `Token ${token}` },
                        body: formData,
                    }
                );
                const result = await res.json();
                console.log('Update result:', result);
                // e.g. navigate or toast success
            } catch (err) {
                console.error('Update failed:', err);
            }
        },
    });

    if (loading) return <div>Loading…</div>;

    return (
        <div className="flex justify-center md:pt-20 bg-slate-50 px-2 md:px-4">
            <form
                onSubmit={formik.handleSubmit}
                className="w-full lg:max-w-5xl py-5 space-y-6"
            >
                {/* Header */}
                <div className="text-center pb-8">
                    <h1 className="text-3xl font-bold">
                        Edit Listing: {product.title}
                    </h1>
                </div>

                {/* Homepage Positions */}
                <div className="p-4 bg-white shadow-md rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="font-bold">Homepage Positions</h2>
                        <button
                            onClick={e => {
                                e.preventDefault();
                                setPositionsOpen(!positionsOpen);
                            }}
                        >
                            {positionsOpen ? <FaMinus /> : <FaPlus />}
                        </button>
                    </div>
                    {positionsOpen && (
                        <div className="space-y-2">
                            {[1, 2, 3, 4, 5].map(pos => (
                                <label key={pos} className="flex items-center">
                                    <input type="checkbox" className="mr-2 rounded" />
                                    Position {pos}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Supplier & Costing */}
                <div className="p-4 bg-white shadow-md rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-2">
                            <IoMdNotifications />
                            <span className="font-bold">Supplier & Costing</span>
                        </div>
                        <button
                            onClick={e => {
                                e.preventDefault();
                                setSupplierOpen(!supplierOpen);
                            }}
                        >
                            {supplierOpen ? <FaMinus /> : <FaPlus />}
                        </button>
                    </div>
                    {supplierOpen && (
                        <div className="pt-4 space-y-4 text-base text-gray-700">
                            {/* Your supplier & costing fields go here */}
                        </div>
                    )}
                </div>

                {/* Main Sections */}
                <div className="bg-white shadow-md rounded-md p-4 space-y-6">
                    <PhotoUploader
                        initialImages={product.product_images}
                        onImagesSelect={setSelectedImages}
                    />
                    <Title formik={formik} />
                    <Description formik={formik} />
                    <Categore formik={formik} />
                    <Conditon formik={formik} />
                    <Brand formik={formik} />
                </div>

                <PriceSection formik={formik} />
                <DeliverySection formik={formik} />
                <Promotions formik={formik} />
                <CancellationReturns formik={formik} />
                <ApprovalNotesSelect formik={formik} />

                {/* Actions */}
                <div className="flex justify-between p-4 bg-white shadow-md rounded-md">
                    <button
                        type="submit"
                        disabled={formik.isSubmitting}
                        className="bg-purple-500 text-white px-6 py-2 rounded-md"
                    >
                        {formik.isSubmitting ? 'Saving…' : 'Save Changes'}
                    </button>
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="text-gray-700 hover:underline"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
