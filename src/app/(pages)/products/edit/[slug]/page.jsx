"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { FaMinus, FaPlus, FaTimes, FaArrowLeft, FaEye } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { useRouter } from "next/navigation";

import LoaderButton from "@/components/LoaderButton";
import Title from "@/components/input/Title";
import Description from "@/components/input/Description";
import Categore from "@/components/input/Categore";
import Conditon from "@/components/input/Conditon";
import Brand from "@/components/input/Brand";
import PriceSection from "@/components/input/PriceSection";
import Promotions from "@/components/input/Promotions";
import SellersPaymentTerms from "@/components/input/SellersPaymentTerms";

import DeliverySection from "@/components/input/DeliverySection";
import CancellationReturns from "@/components/input/CancellationReturns";
import ApprovalNotesSelect from "@/components/input/ApprovalNotesSelect";
import PhotoUploader from "@/components/input/Photo";

// Skeleton loader for the edit form
function SkeletonLoader() {
  return (
    <div className="animate-pulse max-w-5xl mx-auto p-4 space-y-6">
      <div className="h-10 bg-gray-300 rounded w-1/3 mx-auto" />
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 bg-gray-300 rounded" />
        ))}
      </div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-40 bg-gray-300 rounded" />
        ))}
      </div>
      <div className="h-12 bg-gray-300 rounded" />
    </div>
  );
}

// Modal popup for success/error
function NotificationModal({ open, onClose, title, message, slug }) {
  const router = useRouter();
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full relative p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <FaTimes size={18} />
        </button>
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border rounded hover:bg-gray-100 flex items-center"
          >
            <FaArrowLeft className="mr-2" />
            Go Back
          </button>

          <button
            onClick={() => router.push(`/${slug}`)}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center"
          >
            <FaEye className="mr-2" />
            Preview
          </button>
        </div>
      </div>
    </div>
  );
}

const LoadingDots = ({ color = "white" }) => (
  <div className="flex space-x-2 justify-center py-2">
    <div className={`h-2 w-2 bg-${color} rounded-full animate-bounce`} />
    <div
      className={`h-2 w-2 bg-${color} rounded-full animate-bounce delay-150`}
    />
    <div
      className={`h-2 w-2 bg-${color} rounded-full animate-bounce delay-300`}
    />
  </div>
);

export default function EditProductPage({ params }) {
  const { slug } = params;
  const { user, token } = useSelector((state) => state.auth);
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [positionsOpen, setPositionsOpen] = useState(false);
  const [supplierOpen, setSupplierOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [multiBuyTiers, setMultiBuyTiers] = useState([]);
  const [modal, setModal] = useState({
    open: false,
    title: "",
    message: "",
  });

  // Fetch existing product
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(
          `https://api.upfrica.com/api/products/${slug}/`,
        );
        const data = await res.json();
        // let tiers = [];
        // if (data.secondary_data?.multi_buy_tiers) {
        //     try {
        //         tiers = JSON.parse(data.secondary_data.multi_buy_tiers) || [{}];
        //     } catch { tiers = []; }
        // }
        // if (!tiers.length) tiers = [{ min_quantity: '', price_each: '' }];
        // setProduct(data);
        // setMultiBuyTiers(tiers);

        let tiers = [];

        if (data.secondary_data?.multi_buy_tiers) {
          const rawTiers = data.secondary_data.multi_buy_tiers;

          if (typeof rawTiers === "string") {
            try {
              tiers = JSON.parse(rawTiers) || [{}];
            } catch {
              tiers = [];
            }
          } else if (Array.isArray(rawTiers)) {
            tiers = rawTiers;
          }
        }

        if (!tiers.length) {
          tiers = [{ min_quantity: "", price_each: "" }];
        }

        setProduct(data);
        setMultiBuyTiers(tiers);

        setSelectedImages(
          (data.product_images || []).map((url) => ({ data_url: url })),
        );
      } catch (err) {
        console.error(err);
        setModal({
          open: true,
          title: "Error Loading",
          message: "Could not load product data. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  // Formik setup
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: product?.title || "",
      description: product?.description || "",
      product_quantity: product?.product_quantity || 1,
      price_cents: product?.price_cents?.toString() || "0",
      price_currency: product?.price_currency || "GHS",
      status: product?.status || "",
      on_sales: product?.on_sales === "yes" ? "yes" : "no",
      sale_price_cents: product?.sale_price_cents || 0,
      sale_start_date: product?.sale_start_date || "",
      sale_end_date: product?.sale_end_date || "",
      postage_fee_cents: product?.postage_fee_cents || 0,
      secondary_postage_fee_cents: product?.secondary_postage_fee_cents || 0,
      multi_buy: product?.secondary_data?.multi_buy === "yes" ? "yes" : "no",
      multi_buy_tiers: multiBuyTiers,
      cancellable: product?.secondary_data?.cancellable || false,
      cancellationWindowHours:
        product?.cancellation_policy?.cancellationWindowHours || 2,
      sellerResponseSLA:
        product?.cancellation_policy?.sellerResponseSLA || "24h",
      denyIfShippedOrCustom:
        product?.cancellation_policy?.denyIfShippedOrCustom || false,
      autoCancelUnpaidHours:
        product?.cancellation_policy?.autoCancelUnpaidHours || 48,
      abuseFlagThreshold: product?.cancellation_policy?.abuseFlagThreshold || 5,
      approval_notes: product?.secondary_data?.approval_notes || "",
      brand: product?.brand?.id || "",
      category: product?.category?.id || "",
      condition: product?.condition?.id || "",
      seller_payment_terms: product?.seller_payment_terms || "",
    },
    onSubmit: async (values) => {
      const formData = new FormData();
      // Append all fields...
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("product_quantity", values.product_quantity.toString());
      formData.append("price_cents", values.price_cents);
      formData.append("price_currency", values.price_currency);
      formData.append("status", values.status);
      formData.append("user_id", user?.user?.id);
      formData.append("brand", values.brand);
      formData.append("category", values.category);
      formData.append("condition", values.condition);
      formData.append("on_sales", values.on_sales);
      if (values.on_sales === "yes") {
        formData.append("sale_price_cents", values.sale_price_cents.toString());
        formData.append("sale_price_currency", values.price_currency);
        formData.append("sale_start_date", values.sale_start_date);
        formData.append("sale_end_date", values.sale_end_date);
      }
      formData.append("postage_fee_cents", values.postage_fee_cents.toString());
      formData.append(
        "secondary_postage_fee_cents",
        values.secondary_postage_fee_cents.toString(),
      );
      formData.append("multi_buy", values.multi_buy);
      if (values.multi_buy === "yes") {
        formData.append(
          "multi_buy_tiers",
          JSON.stringify(values.multi_buy_tiers),
        );
      } else {
        formData.append("multi_buy_tiers", "");
      }
      formData.append("cancellable", values.cancellable ? "yes" : "no");
      if (values.cancellable) {
        formData.append(
          "cancellation_policy",
          JSON.stringify({
            cancellable: values.cancellable,
            cancellationWindowHours: values.cancellationWindowHours,
            sellerResponseSLA: values.sellerResponseSLA,
            denyIfShippedOrCustom: values.denyIfShippedOrCustom,
            autoCancelUnpaidHours: values.autoCancelUnpaidHours,
            abuseFlagThreshold: values.abuseFlagThreshold,
          }),
        );
      }
      formData.append("approval_notes", values.approval_notes);
      formData.append("seller_payment_terms", values.seller_payment_terms);
      const existingUrls = selectedImages
        .filter((img) => !img.file)
        .map((img) => img.data_url);
      if (existingUrls.length) {
        formData.append("existing_image_urls", JSON.stringify(existingUrls));
      }
      selectedImages
        .filter((img) => img.file)
        .forEach((img) => formData.append("images", img.file, img.file.name));

      // selectedImages.forEach((img, idx) => {
      // const identifier = img.data_url || (img.file && img.file.name) || 'unknown';
      // console.log(`Image position ${idx + 1}:`, identifier);
      // })

      selectedImages.forEach((img, idx) => {
        if (img.file) {
          // Local file: just the filename
          console.log(`Image position ${idx + 1}: ${img.file.name}`);
        } else {
          // Already-uploaded image: log its URL
          console.log(`Image position ${idx + 1}: ${img.data_url}`);
        }
      });
      const imageOrder = selectedImages.map((img) =>
        img.file ? img.file.name : img.data_url,
      );
      // …and log it
      console.log("Image order array:", imageOrder);

      // Now append that array (stringified) to your form data
      // return;
      formData.append("image_positions", JSON.stringify(imageOrder));

      try {
        const res = await fetch(
          `https://api.upfrica.com/api/product/${product.id}/`,
          {
            method: "PATCH",
            headers: { Authorization: `Token ${token}` },
            body: formData,
          },
        );
        if (!res.ok) throw new Error("Network response was not ok");
        const result = await res.json();
        setModal({
          open: true,
          title: "Update Successful",
          message: "Your product was updated successfully.",
        });
      } catch (err) {
        console.error(err);
        setModal({
          open: true,
          title: "Update Failed",
          message:
            "There was an error updating your product. Please try again.",
        });
      }
    },
  });

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <>
      <NotificationModal
        open={modal.open}
        title={modal.title}
        message={modal.message}
        slug={slug}
        onClose={() => setModal((m) => ({ ...m, open: false }))}
      />

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
                onClick={(e) => {
                  e.preventDefault();
                  setPositionsOpen(!positionsOpen);
                }}
              >
                {positionsOpen ? <FaMinus /> : <FaPlus />}
              </button>
            </div>
            {positionsOpen && (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((pos) => (
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
                onClick={(e) => {
                  e.preventDefault();
                  setSupplierOpen(!supplierOpen);
                }}
              >
                {supplierOpen ? <FaMinus /> : <FaPlus />}
              </button>
            </div>
            {supplierOpen && (
              <div className="pt-4 space-y-4 text-base text-gray-700">
                {/* supplier fields here */}
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
          {/* ← Insert Seller’s Payment Terms here */}
          <SellersPaymentTerms formik={formik} />
          <CancellationReturns formik={formik} />
          <ApprovalNotesSelect formik={formik} />

          {/* Actions */}
          <div className="flex justify-between p-4 bg-white shadow-md rounded-md">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="bg-purple-500 text-white px-6 py-2 min-w-[152px] rounded-md"
            >
              {formik.isSubmitting ? (
                <LoadingDots color="white" />
              ) : (
                "Save Changes"
              )}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="text-gray-700 hover:underline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
