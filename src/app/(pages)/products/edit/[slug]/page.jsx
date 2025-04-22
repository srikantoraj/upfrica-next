"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import Title from "@/components/inpute/Title";
import Description from "@/components/inpute/Description";
import Categore from "@/components/inpute/Categore";
import Conditon from "@/components/inpute/Conditon";
import Photo from "@/components/inpute/Photo";
import Brand from "@/components/inpute/Brand";
import PriceSection from "@/components/inpute/PriceSection";
import Promotions from "@/components/inpute/Promotions";
import DeliverySection from "@/components/inpute/DeliverySection";
import CancellationReturns from "@/components/inpute/CancellationReturns";
import ApprovalNotesSelect from "@/components/inpute/ApprovalNotesSelect";
import { FaMinus, FaPlus } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";

export default function EditProductPage({ params }) {
    const { slug } = params;
    const { user, token } = useSelector((state) => state.auth);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [positionsOpen, setPositionsOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);

    // Fetch existing product
    useEffect(() => {
        async function fetchProduct() {
            try {
                const res = await fetch(
                    `https://media.upfrica.com/api/products/${slug}/`
                );
                const data = await res.json();
                setProduct(data);
            } catch (err) {
                console.error("Failed to load product:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [slug]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: product?.title || "",
            description: product?.description || "",
            product_quantity: product?.product_quantity || 1,
            price_cents: product?.price_cents?.toString() || "0",
            on_sales: product?.on_sales ? "yes" : "no",
            sale_price_cents: product?.sale_price_cents || 0,
            sale_start_date: product?.sale_start_date || "",
            sale_end_date: product?.sale_end_date || "",
            postage_fee_cents: product?.postage_fee_cents || 0,
            secondary_postage_fee_cents:
                product?.secondary_postage_fee_cents || 0,
            price_currency: product?.price_currency || "GHS",
            status: product?.status || "",
            multi_buy: product?.multi_buy ? "yes" : "no",
            multi_buy_tiers: product?.multi_buy_tiers || [{}],
            supplierLink: product?.supplierLink || "",
            backupSupplier: product?.backupSupplier || "",
            supplerName: product?.supplerName || "",
            supplerNumber: product?.supplerNumber || "",
            productPrice: product?.productPrice || "",
            vPrice: product?.vPrice || "",
            Vshipping: product?.Vshipping || "",
            L: product?.L || "",
            W: product?.W || "",
            H: product?.H || "",
            CBM: product?.CBM || "",
            rate: product?.rate || "",
            cmb: product?.cmb || "",
            shoppingCost: product?.shoppingCost || "",
            productCost: product?.productCost || "",
            totalCost: product?.totalCost || "",
            cancellable: product?.cancellation_policy?.cancellable || false,
            cancellationWindowHours:
                product?.cancellation_policy?.cancellationWindowHours || 2,
            sellerResponseSLA:
                product?.cancellation_policy?.sellerResponseSLA || "24h",
            denyIfShippedOrCustom:
                product?.cancellation_policy?.denyIfShippedOrCustom || false,
            autoCancelUnpaidHours:
                product?.cancellation_policy?.autoCancelUnpaidHours || 48,
            abuseFlagThreshold:
                product?.cancellation_policy?.abuseFlagThreshold || 5,
            approval_notes: product?.approval_notes || "",
            brand: product?.brand?.id || "",
            category: product?.category?.id || "",
            condition: product?.condition?.id || "",
        },
        onSubmit: async (values) => {
            // build FormData exactly like in create
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);
            formData.append(
                "product_quantity",
                values.product_quantity.toString()
            );
            formData.append("price_cents", values.price_cents);
            formData.append("price_currency", values.price_currency);
            formData.append("user_id", user?.user?.id);
            formData.append("brand", values.brand);
            formData.append("category", values.category);
            formData.append("condition", values.condition);

            if (values.on_sales === "yes") {
                formData.append("on_sales", values.on_sales);
                formData.append(
                    "sale_price_cents",
                    values.sale_price_cents.toString()
                );
                formData.append(
                    "sale_price_currency",
                    values.price_currency
                );
                formData.append("sale_start_date", values.sale_start_date);
                formData.append("sale_end_date", values.sale_end_date);
            }

            formData.append(
                "postage_fee_cents",
                values.postage_fee_cents.toString()
            );
            formData.append(
                "secondary_postage_fee_cents",
                values.secondary_postage_fee_cents.toString()
            );

            if (values.multi_buy === "yes") {
                formData.append(
                    "multi_buy_tiers",
                    JSON.stringify(values.multi_buy_tiers)
                );
            }

            formData.append("supplierLink", values.supplierLink);
            formData.append("backupSupplier", values.backupSupplier);
            formData.append("supplerName", values.supplerName);
            formData.append("supplerNumber", values.supplerNumber);
            formData.append("productPrice", values.productPrice);
            formData.append("vPrice", values.vPrice);
            formData.append("Vshipping", values.Vshipping);
            formData.append("L", values.L);
            formData.append("W", values.W);
            formData.append("H", values.H);
            formData.append("CBM", values.CBM);
            formData.append("rate", values.rate);
            formData.append("cmb", values.cmb);
            formData.append("shoppingCost", values.shoppingCost);
            formData.append("productCost", values.productCost);
            formData.append("totalCost", values.totalCost);

            const cancellationPolicy = {
                cancellable: values.cancellable,
                cancellationWindowHours: values.cancellationWindowHours,
                sellerResponseSLA: values.sellerResponseSLA,
                denyIfShippedOrCustom: values.denyIfShippedOrCustom,
                autoCancelUnpaidHours: values.autoCancelUnpaidHours,
                abuseFlagThreshold: values.abuseFlagThreshold,
            };
            formData.append(
                "cancellation_policy",
                JSON.stringify(cancellationPolicy)
            );
            formData.append("approval_notes", values.approval_notes);

            // images (if re‑uploading)
            selectedImages.forEach((img, i) =>
                formData.append("images", img.file, `image_${i}.png`)
            );

            const myHeaders = new Headers({
                Authorization: `Token ${token}`,
            });

            try {
                const res = await fetch(
                    `https://media.upfrica.com/api/product/update/${product.id}/`,
                    {
                        method: "PATCH",
                        headers: myHeaders,
                        body: formData,
                    }
                );
                const json = await res.json();
                console.log("Update result:", json);
                // maybe navigate back or show a toast
            } catch (err) {
                console.error("Update failed:", err);
            }
        },
    });

    if (loading) return <div>Loading…</div>;

    return (
        <div className="flex justify-center md:pt-20 bg-slate-50 px-2 md:px-4">
            <form
                onSubmit={formik.handleSubmit}
                className="w-full lg:max-w-3xl py-5"
            >
                <div className="text-center space-y-4 pb-10">
                    <h1 className="text-3xl font-bold">
                        Edit Listing: {product.title}
                    </h1>
                </div>

                {/* Homepage Positions */}
                <div className="p-4 bg-white shadow-md rounded-xl mb-4">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold">Homepage Positions</h2>
                        <button onClick={(e) => { e.preventDefault(); setPositionsOpen(!positionsOpen); }}>
                            {positionsOpen ? <FaMinus /> : <FaPlus />}
                        </button>
                    </div>
                    {positionsOpen && (
                        <div className="pt-2 space-y-2">
                            {[1, 2, 3, 4, 5].map((pos) => (
                                <label key={pos} className="flex items-center">
                                    <input type="checkbox" className="mr-2" />
                                    Position {pos}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Admin Inputs */}
                <div className="p-4 bg-white shadow-md rounded-xl mb-4">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold">Supplier & Costing</h2>
                        <button onClick={(e) => { e.preventDefault(); setIsOpen(!isOpen); }}>
                            {isOpen ? <FaMinus /> : <FaPlus />}
                        </button>
                    </div>
                    {isOpen && (
                        <div className="pt-4 space-y-4">
                            {/* ... all your supplier fields ... */}
                        </div>
                    )}
                </div>

                {/* Main Form Sections */}
                <div className="bg-white shadow-md rounded-md p-4 space-y-4">
                    <Title formik={formik} />
                    <Description formik={formik} />
                    <Categore formik={formik} />
                    <Conditon formik={formik} />
                    <Brand formik={formik} />
                    {/* <Photo onImagesSelect={setSelectedImages} /> */}
                    <Photo
                        initialImages={product.product_images}
                        onImagesSelect={(imgs) => setSelectedImages(imgs)}
                    />
                </div>

                <PriceSection formik={formik} />
                <DeliverySection formik={formik} />
                <Promotions formik={formik} />
                <CancellationReturns formik={formik} />
                <ApprovalNotesSelect formik={formik} />

                <div className="flex justify-between p-4">
                    <button
                        type="submit"
                        disabled={formik.isSubmitting}
                        className="bg-purple-500 text-white px-4 py-2 rounded-md"
                    >
                        {formik.isSubmitting ? "Saving…" : "Save Changes"}
                    </button>
                    <button type="button" onClick={() => window.history.back()}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
