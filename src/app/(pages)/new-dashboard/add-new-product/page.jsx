'use client';

import React, { useState, useEffect } from "react";
import { FaMinus, FaPencilAlt, FaPlus, FaArrowLeft, FaListAlt } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { BASE_API_URL } from '@/app/constants';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import { useFormik } from "formik";
import Title from "@/components/inpute/Title";
import Description from "@/components/inpute/Description";
import Categore from "@/components/inpute/Categore";
import Conditon from "@/components/inpute/Conditon";
import Photo from "@/components/inpute/Photo";
import Brand from "@/components/inpute/Brand";
import { useSelector } from "react-redux";
import PriceSection from "@/components/inpute/PriceSection";
import Promotions from "@/components/inpute/Promotions";
import DeliverySection from "@/components/inpute/DeliverySection";
import CancellationReturns from "@/components/inpute/CancellationReturns";
import ApprovalNotesSelect from "@/components/inpute/ApprovalNotesSelect";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AddNewProducts = () => {
  const { user, token } = useSelector((state) => state.auth);
  const router = useRouter();

  // Collapsible panels
  const [positionsOpen, setPositionsOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Selected images from Photo component
  const [selectedImages, setSelectedImages] = useState([]);

  // Popup state
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupSuccess, setPopupSuccess] = useState(false);

  const togglePositions = (e) => {
    e.preventDefault();
    setPositionsOpen((open) => !open);
  };
  const toggleForm = (e) => {
    e.preventDefault();
    setIsOpen((open) => !open);
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      product_quantity: 1,
      price_cents: "0",
      on_sales: "no",
      sale_price_cents: 0,
      sale_start_date: "",
      sale_end_date: "",
      postage_fee_cents: 0,
      secondary_postage_fee_cents: 0,
      price_currency: "GHS",
      status: "",
      multi_buy: false,
      multi_buy_tiers: [{}],
      supplierLink: "",
      backupSupplier: "",
      supplerName: "",
      supplerNumber: "",
      productPrice: "",
      vPrice: "",
      Vshipping: "",
      L: "",
      W: "",
      H: "",
      CBM: "",
      rate: "",
      cmb: "",
      shoppingCost: "",
      productCost: "",
      totalCost: "",
      cancellable: false,
      cancellationWindowHours: 2,
      sellerResponseSLA: "24h",
      denyIfShippedOrCustom: false,
      autoCancelUnpaidHours: 48,
      abuseFlagThreshold: 5,
      approval_notes: "",
    },
    onSubmit: async (values) => {
      const formData = new FormData();
      // Primary fields
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("product_quantity", values.product_quantity.toString());
      formData.append("price_cents", values.price_cents);
      formData.append("price_currency", values.price_currency);
      formData.append("user_id", user?.user?.id);
      formData.append("brand", values.brand);
      formData.append("category", values.category);
      formData.append("condition", values.condition);
      // Sale fields
      if (values.on_sales === "yes") {
        formData.append("on_sales", values.on_sales);
        formData.append("sale_price_cents", values.sale_price_cents.toString());
        formData.append("sale_price_currency", values.price_currency);
        formData.append("sale_start_date", values.sale_start_date);
        formData.append("sale_end_date", values.sale_end_date);
      }
      // Postage fees
      formData.append("postage_fee_cents", values.postage_fee_cents.toString());
      formData.append("postage_fee_cents_currency", values.price_currency);
      formData.append(
        "secondary_postage_fee_cents",
        values.secondary_postage_fee_cents.toString()
      );
      formData.append(
        "secondary_postage_fee_cents_currency",
        values.price_currency
      );
      // Multi-buy
      if (values.multi_buy === "yes") {
        formData.append("multi_buy", values.multi_buy);
        formData.append(
          "multi_buy_tiers",
          JSON.stringify(values.multi_buy_tiers)
        );
      }
      // Approval notes
      formData.append("approval_notes", values.approval_notes);
      // Cancellation policy
      let cancel = values.cancellable ? "yes" : "no";
      formData.append("cancellable", cancel);
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
        cancel === "no" ? "" : JSON.stringify(cancellationPolicy)
      );
      // Supplier fields
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
      // Images
      selectedImages.forEach((img, idx) =>
        formData.append("images", img.file, img.file.name || `image_${idx}.png`)
      );

      // API request
      const headers = new Headers();
      headers.append("Authorization", `Token ${token}`);
      try {
        const response = await fetch(
          `${BASE_API_URL}/api/product/create/`,
          { method: "POST", headers, body: formData }
        );
        const result = await response.json();
        if (response.ok) {
          setPopupMessage("Product created successfully!");
          setPopupSuccess(true);
        } else {
          setPopupMessage(result.error || "Failed to create product.");
          setPopupSuccess(false);
        }
      } catch (err) {
        setPopupMessage("An error occurred while creating the product.");
        setPopupSuccess(false);
      } finally {
        setPopupVisible(true);
      }
    },
  });

  return (
    <div className="flex justify-center md:pt-20 bg-slate-50 px-2 md:px-4">
      <form onSubmit={formik.handleSubmit} className="w-full lg:max-w-5xl py-5">
        {/* Page Title */}
        <div className="text-center space-y-4 pb-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide">
            Add New Listing
          </h1>
        </div>

        {/* Homepage Positions (Admin) */}
        <div className="p-4 bg-white shadow-md rounded-xl mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <IoMdNotifications />
              <h1 className="text-base font-bold">Homepage Positions (Admin)</h1>
            </div>
            <button onClick={togglePositions} className="focus:outline-none">
              {positionsOpen ? <FaMinus /> : <FaPlus />}
            </button>
          </div>
          {positionsOpen && (
            <>
              <hr className="py-2" />
              {/* Positions */}
              <div className="mb-4 text-base font-bold">
                {[1, 2, 3, 4, 5].map((pos) => (
                  <div key={pos} className="flex items-center mb-2">
                    <input type="checkbox" className="mr-2 rounded" />
                    <p>Add to position {pos}</p>
                  </div>
                ))}
              </div>
              {/* Bulk? */}
              <div className="mb-4">
                <p className="font-bold">Bulk?</p>
                <div className="flex space-x-4">
                  {["no", "yes"].map((v) => (
                    <label key={v} className="flex items-center">
                      <input type="radio" name="bulk" value={v} className="mr-2" />
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
              {/* Available Promo? */}
              <div className="mb-4">
                <p className="font-bold">Available Promo?</p>
                <div className="flex space-x-4">
                  {["no", "yes"].map((v) => (
                    <label key={v} className="flex items-center">
                      <input
                        type="radio"
                        name="available_promo"
                        value={v}
                        className="mr-2"
                      />
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
              {/* Preorder Promo? */}
              <div className="mb-4">
                <p className="font-bold">Preorder Promo?</p>
                <div className="flex space-x-4">
                  {["no", "yes"].map((v) => (
                    <label key={v} className="flex items-center">
                      <input
                        type="radio"
                        name="preorder_promo"
                        value={v}
                        className="mr-2"
                      />
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
              {/* Promoted? */}
              <div className="mb-4">
                <p className="font-bold">Promoted?</p>
                <div className="flex space-x-4">
                  {["no", "yes"].map((v) => (
                    <label key={v} className="flex items-center">
                      <input
                        type="radio"
                        name="promoted"
                        value={v}
                        className="mr-2"
                      />
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Admin Inputs (Supplier) */}
        <div className="p-4 bg-white shadow-md rounded-xl mb-4">
          <div className="flex items-center justify-between text-base font-bold">
            <div className="flex items-center space-x-2">
              <IoMdNotifications />
              <span>Admin Inputs</span>
            </div>
            <button onClick={toggleForm} className="focus:outline-none">
              {isOpen ? <FaMinus /> : <FaPlus />}
            </button>
          </div>
          {isOpen && (
            <div className="p-4 space-y-4 text-base text-[#3c4858]">
              <h1 className="text-2xl font-bold mb-4">Supplier Information</h1>
              {/* Supplier fields (link, backup, name, phone) */}
              {[
                { id: "supplierLink", label: "Supplier Link or GPS*", placeholder: "Link" },
                { id: "backupSupplier", label: "Backup Supplier Link", placeholder: "2nd Supplier link" },
                { id: "supplerName", label: "Supplier Name", placeholder: "Supplier Name" },
                { id: "supplerNumber", label: "Supplier Phone Number", placeholder: "Supplier phone number" }
              ].map(({ id, label, placeholder }) => (
                <div key={id}>
                  <label className="block font-bold mb-2">{label}</label>
                  <input
                    id={id}
                    name={id}
                    type="text"
                    placeholder={placeholder}
                    onChange={formik.handleChange}
                    value={formik.values[id]}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                  />
                </div>
              ))}

              {/* Product Costing */}
              <div>
                <p className="font-bold">Product Costing (USD)</p>
                <div className="flex items-center">
                  Price $
                  <input
                    id="productPrice"
                    name="productPrice"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.productPrice}
                    className="flex-1 px-3 py-2 border-none focus:ring-0"
                  />
                </div>
                <hr className="my-2" />
              </div>

              {/* Additional Costing Fields */}
              <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
                {[
                  { id: "vPrice", label: "Vprice ($)" },
                  { id: "Vshipping", label: "Vshipping" },
                  { id: "L", label: "L" },
                  { id: "W", label: "W" },
                  { id: "H", label: "H" },
                  { id: "CBM", label: "1CBM" },
                  { id: "rate", label: "Rate ($ to GHS)" },
                ].map(({ id, label }) => (
                  <div key={id}>
                    <label htmlFor={id} className="block text-center">
                      {label}
                      <input
                        id={id}
                        name={id}
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values[id]}
                        className="w-full px-3 py-2 border rounded-md text-center"
                      />
                    </label>
                  </div>
                ))}
              </div>

              {/* Total Cost Details */}
              {[
                { id: "cmb", label: "CBM:" },
                { id: "shoppingCost", label: "Shipping Cost:" },
                { id: "productCost", label: "Product cost:" },
                { id: "totalCost", label: "Total cost:" },
              ].map(({ id, label }) => (
                <p key={id} className="flex items-center space-x-2">
                  <span className="font-bold">{label}</span>
                  <input
                    id={id}
                    name={id}
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values[id]}
                    className="flex-1 px-3 py-2 border-none"
                    placeholder="0.0"
                  />
                </p>
              ))}

              {/* Payment Terms */}
              <div className="mt-6">
                <p className="font-bold mb-2">*Select Payment Terms</p>
                <div className="flex flex-col space-y-2">
                  <label className="font-bold">Delivery</label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Payment before delivery
                  </label>
                  <label className="font-bold">Click & Collect</label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Payment on collection
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Product Details */}
        <div className="my-4 bg-white shadow-md rounded-md p-4 space-y-2">
          <Title formik={formik} />
          <Description formik={formik} />
          <Categore formik={formik} />
          <Conditon formik={formik} />
          <Brand formik={formik} />
          <Photo onImagesSelect={setSelectedImages} />
        </div>

        {/* Other Sections */}
        <PriceSection formik={formik} />
        <DeliverySection formik={formik} />
        <Promotions formik={formik} />
        <CancellationReturns formik={formik} />
        <ApprovalNotesSelect formik={formik} />

        {/* Form Actions */}
        <div className="flex justify-between text-xl font-bold p-4 ">
          {!formik.isSubmitting ? (
            <button
              type="submit"
              className="bg-purple-500 text-white px-4 py-2 rounded-md"
            >
              Save and continue
            </button>
          ) : (
            <button
              type="submit"
              className=" py-2 bg-[#A435F0] text-white rounded-md font-bold flex justify-center items-center min-w-[215px]"
              disabled
            >
              <div className="flex space-x-2 py-2">
                <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="h-2 w-2 bg-white rounded-full animate-bounce" />
              </div>
            </button>
          )}
          <button type="button">Cancel</button>
        </div>
      </form>

      {popupVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg mx-4">
            {/* Close button */}
            <button
              aria-label="Close"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={() => setPopupVisible(false)}
            >
              <AiOutlineCloseCircle className="w-8 h-8" />
            </button>

            <div className="flex flex-col items-center text-center space-y-4">
              {/* Success / Error icon */}
              {popupSuccess ? (
                <AiOutlineCheckCircle className="w-12 h-12 text-green-500" />
              ) : (
                <AiOutlineCloseCircle className="w-12 h-12 text-red-500" />
              )}

              {/* Title */}
              <h2 className="text-2xl font-semibold">
                {popupSuccess ? "Product Created!" : "Oops, Something Went Wrong"}
              </h2>

              {/* Message */}
              <p className="text-gray-600">
                {popupMessage ||
                  (popupSuccess
                    ? "Your product has been successfully listed."
                    : "We couldn't create your product. Please try again.")}
              </p>

              {/* Action Buttons */}
              <div className="flex w-full justify-between pt-4 space-x-2">
                <button
                  onClick={() => {
                    setPopupVisible(false);
                    router.back();
                  }}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 border border-gray-200 rounded-md hover:bg-gray-200"
                >
                  <FaArrowLeft className="w-5 h-5 mr-2" />
                  Go Back
                </button>

                <Link href="/new-dashboard/porducts-list">
                  <span
                    onClick={() => setPopupVisible(false)}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    <FaListAlt className="w-5 h-5 mr-2" />
                    See Listed Products
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddNewProducts;
