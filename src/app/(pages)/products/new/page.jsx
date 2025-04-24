"use client";
import React, { useState } from "react";
import { FaMinus, FaPencilAlt, FaPlus } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
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

const AddNewProducts = () => {
  // Get user information and token from Redux store
  const { user, token } = useSelector((state) => state.auth);

  // State for collapsible panels
  const [positionsOpen, setPositionsOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // State for images coming from the Photo component
  const [selectedImages, setSelectedImages] = useState([]);

  // Toggle handlers
  const togglePositions = (e) => {
    e.preventDefault();
    setPositionsOpen((open) => !open);
  };
  const toggleForm = (e) => {
    e.preventDefault();
    setIsOpen((open) => !open);
  };

  // Using Formik to manage form state
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      product_quantity: 1,
      price_cents: "0",
      on_sales: 'no',
      sale_price_cents: 0,
      sale_start_date: '',  // will hold ISO string
      sale_end_date: '',
      postage_fee_cents: 0,
      secondary_postage_fee_cents: 0,
      price_currency: "GHS",
      status: "",
      multi_buy: false,              // checkbox: Multi‑Buy on/off
      multi_buy_tiers: [{}],
      // Supplier information
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
    },
    onSubmit: async (values) => {
      const formData = new FormData();

      // Append primary product fields
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("product_quantity", values.product_quantity.toString());
      formData.append("price_cents", values.price_cents);
      formData.append("price_currency", values.price_currency);
      formData.append("user_id", user?.user?.id);
      formData.append("brand", values?.brand);
      formData.append("category", values?.category);
      formData.append("condition", values?.condition);

      // Append sale & status fields
      if (values.on_sales === 'yes') {
        formData.append("on_sales", values.on_sales);
        formData.append("sale_price_cents", values.sale_price_cents.toString());
        formData.append("sale_price_currency", values.price_currency);
        formData.append("sale_start_date", values.sale_start_date);
        formData.append("sale_end_date", values.sale_end_date);
        // formData.append("status", values.status);
      }

      // Append postage fees
      formData.append("postage_fee_cents", values.postage_fee_cents.toString());
      formData.append("postage_fee_cents_currency", values.price_currency);
      formData.append("secondary_postage_fee_cents", values.secondary_postage_fee_cents.toString());
      formData.append("secondary_postage_fee_cents_currency", values.price_currency);

      // Append multi‑buy options


      // Append supplier fields
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

      let cancellationPolicy = {
        cancellable: values.cancellable,
        cancellationWindowHours: values.cancellationWindowHours,
        sellerResponseSLA: values.sellerResponseSLA,
        denyIfShippedOrCustom: values.denyIfShippedOrCustom,
        autoCancelUnpaidHours: values.autoCancelUnpaidHours,
        abuseFlagThreshold: values.abuseFlagThreshold,
      };


      // secondary data
      if (values.multi_buy == 'yes') {
        formData.append("multi_buy", values.multi_buy);
        formData.append("multi_buy_tiers", JSON.stringify(values.multi_buy_tiers));
      }
      formData.append(
        "approval_notes",
        values.approval_notes
      );
    
      let cancel = values?.cancellable? 'yes' : 'no';
      formData.append(
        "cancellable",
        cancel
      );

      formData.append(
        "cancellation_policy", cancel =='no'?'':JSON.stringify(cancellationPolicy)
      );

      // Append images
      if (selectedImages.length > 0) {
        formData.append(
          "images",
          selectedImages[0].file,
          "upload_image.png"
        );
        if (selectedImages.length > 1) {
          formData.append(
            "images",
            selectedImages[1].file,
            "background_image.png"
          );
        }
      }


      console.log("Form Data:", formData);
      console.log("Form Values:", values);
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // return;
      // Set up headers with Authorization
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Token ${token}`);
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formData,
      };
      try {
        const response = await fetch(
          "https://media.upfrica.com/api/product/create/",
          requestOptions
        );
        const result = await response.json();
        console.log("API Result:", result);
      } catch (error) {
        console.error("Error:", error);
      }
    },
  });

  return (
    <div className="flex justify-center md:pt-20 bg-slate-50 px-2 md:px-4">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full lg:max-w-5xl py-5"
      >
        {/* Page Title */}
        <div className="text-center space-y-4 pb-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide">
            Add New Listing
          </h1>
        </div>

        {/* Homepage Positions (Admin) Section */}
        <div className="p-4 bg-white shadow-md rounded-xl mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <IoMdNotifications />
              <h1 className="text-base font-bold text-center">
                Homepage Positions (Admin)
              </h1>
            </div>
            <button
              onClick={togglePositions}
              className="focus:outline-none"
            >
              {positionsOpen ? <FaMinus /> : <FaPlus />}
            </button>
          </div>
          {positionsOpen && (
            <>
              <hr className="py-2" />
              {/* Position Checkboxes */}
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
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="bulk"
                      value="no"
                      className="mr-2"
                    />
                    No
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="bulk"
                      value="yes"
                      className="mr-2"
                    />
                    Yes
                  </label>
                </div>
              </div>
              {/* Available Promo? */}
              <div className="mb-4">
                <p className="font-bold">Available Promo?</p>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="available_promo"
                      value="no"
                      className="mr-2"
                    />
                    No
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="available_promo"
                      value="yes"
                      className="mr-2"
                    />
                    Yes
                  </label>
                </div>
              </div>
              {/* Preorder Promo? */}
              <div className="mb-4">
                <p className="font-bold">Preorder Promo?</p>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="preorder_promo"
                      value="no"
                      className="mr-2"
                    />
                    No
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="preorder_promo"
                      value="yes"
                      className="mr-2"
                    />
                    Yes
                  </label>
                </div>
              </div>
              {/* Promoted? */}
              <div className="mb-4">
                <p className="font-bold">Promoted?</p>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="promoted"
                      value="no"
                      className="mr-2"
                    />
                    No
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="promoted"
                      value="yes"
                      className="mr-2"
                    />
                    Yes
                  </label>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Admin Inputs for Supplier Information */}
        <div className="p-4 bg-white shadow-md rounded-xl mb-4">
          <div className="flex items-center justify-between text-base font-bold">
            <div className="flex items-center justify-left space-x-2 flex-grow">
              <IoMdNotifications />
              <span>Admin Inputs</span>
            </div>
            <button onClick={toggleForm} className="ml-4 focus:outline-none">
              {isOpen ? <FaMinus /> : <FaPlus />}
            </button>
          </div>
          {isOpen && (
            <div className="p-4">
              <h1 className="text-2xl font-bold mb-4">
                Supplier Information
              </h1>
              <div className="space-y-4 text-base text-[#3c4858]">
                {/* Supplier Link or GPS */}
                <div>
                  <label className="block font-bold mb-2">
                    Supplier Link or GPS*
                  </label>
                  <input
                    id="supplierLink"
                    name="supplierLink"
                    type="text"
                    placeholder="Link"
                    onChange={formik.handleChange}
                    value={formik.values.supplierLink}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                  />
                </div>
                {/* Backup Supplier Link */}
                <div>
                  <label className="block font-bold mb-2">
                    Backup Supplier Link
                  </label>
                  <input
                    id="backupSupplier"
                    name="backupSupplier"
                    type="text"
                    placeholder="2nd Supplier link"
                    onChange={formik.handleChange}
                    value={formik.values.backupSupplier}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                  />
                </div>
                {/* Supplier Name */}
                <div>
                  <label className="block font-bold mb-2">
                    Supplier Name
                  </label>
                  <input
                    id="supplerName"
                    name="supplerName"
                    type="text"
                    placeholder="Supplier Name"
                    onChange={formik.handleChange}
                    value={formik.values.supplerName}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                  />
                </div>
                {/* Supplier Phone Number */}
                <div>
                  <label className="block font-bold mb-2">
                    Supplier Phone Number
                  </label>
                  <input
                    id="supplerNumber"
                    name="supplerNumber"
                    type="text"
                    placeholder="Supplier phone number"
                    onChange={formik.handleChange}
                    value={formik.values.supplerNumber}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                  />
                </div>
                {/* Product Costing */}
                <div>
                  <p className="font-bold">Product Costing (USD)</p>
                  <p className="flex items-center">
                    Price $
                    <span className="font-bold">
                      <input
                        id="productPrice"
                        name="productPrice"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.productPrice}
                        className="w-full px-3 py-2 border-none focus:ring-0"
                      />
                    </span>
                  </p>
                  <hr />
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
                      <label htmlFor={id}>
                        {label}
                        <input
                          id={id}
                          name={id}
                          type="text"
                          onChange={formik.handleChange}
                          value={formik.values[id]}
                          className="w-full px-3 py-6 border rounded-md text-center"
                        />
                      </label>
                    </div>
                  ))}
                </div>
                {/* Total Cost Details */}
                <div className="space-y-2 mb-4">
                  {[
                    { id: "cmb", label: "CBM:" },
                    { id: "shoppingCost", label: "Shipping Cost:" },
                    { id: "productCost", label: "Product cost:" },
                    { id: "totalCost", label: "Total cost:" },
                  ].map(({ id, label }) => (
                    <p key={id} className="text-base flex items-center">
                      {label}{" "}
                      <input
                        id={id}
                        name={id}
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values[id]}
                        className="w-full px-3 py-2 border-none"
                        placeholder="0.0"
                      />
                    </p>
                  ))}
                </div>
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
            </div>
          )}
        </div>

        {/* Main Product Details Section */}
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
        <div className="flex justify-between text-xl font-bold p-4">
          {!formik?.isSubmitting && <button
            type="submit"
            className="bg-purple-500 text-white px-4 py-2 rounded-md"
          >
            Save and continue
          </button>}
          {formik.isSubmitting && (
            <button
              type="submit"
              className=" text-xl px-20 py-2 bg-[#A435F0] text-white rounded-md font-bold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={formik.isSubmitting}
            >
              <div className="flex space-x-2 justify-center items-center h-6">
                <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="h-2 w-2 bg-white rounded-full animate-bounce" />
              </div>
            </button>
          )}

          <button type="button">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddNewProducts;
