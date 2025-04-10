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

const AddNewProducts = () => {
  // Get user information and token from Redux store
  const { user, token } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  // State for images coming from the Photo component
  const [selectedImages, setSelectedImages] = useState([]);

  // Toggle the Admin Inputs (supplier information) section
  const toggleForm = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  // Using Formik to manage form state
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      product_quantity: 1,
      price_cents: "5000",
      sale_price_cents: 0,
      postage_fee_cents: 0,
      secondary_postage_fee_cents: 0,
      price_currency: "USD",
      status: "",
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
      // Additional fields can be added as needed
    },

    onSubmit: async (values) => {
     
      const formData = new FormData();

      // Append primary product fields
      formData.append("title", values.title);
      formData.append("price_cents", values.price_cents);
      formData.append("price_currency", values.price_currency);
      formData.append("user_id", user?.user?.id);

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

      // Append images from Photo component (using custom file names)
      if (selectedImages && selectedImages.length > 0) {
        formData.append(
          "images",
          selectedImages[0].file,
          "authenticator_app.png"
        );
        if (selectedImages.length > 1) {
          formData.append(
            "images",
            selectedImages[1].file,
            "background_image.png"
          );
        }
      }

      // console.log("Form Data:", formData);
      // return;
      // Set up headers with Authorization (omit "Content-Type" for FormData)
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
        const result = await response.text();
        console.log("API Result:", result);
      } catch (error) {
        console.error("Error:", error);
      }
    },
  });

  return (
    <div className="flex justify-center pt-5 md:pt-20 bg-slate-50 px-2 md:px-4">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full lg:w-3/5 2xl:w-1/2 py-5"
      >
        <div className="text-center space-y-4 py-5">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide">
            Add New Listing
          </h1>
          <p className="flex items-center justify-center space-x-2 text-[#0063d1]">
            <span className="text-base">
              *Your location: Dhaka, Bangladesh
            </span>
            <span>
              <FaPencilAlt />
            </span>
          </p>
        </div>

        {/* Homepage Positions (Admin) Section */}
        <div className="p-4 bg-white shadow-md rounded-xl mb-4">
          <h1 className="text-2xl font-bold mb-4">Homepage Positions (Admin)</h1>
          <hr className="py-2" />
          {/* Position Checkboxes */}
          <div className="mb-4 text-base font-bold">
            <div className="flex items-center mb-2">
              <input type="checkbox" className="mr-2" />
              <p>Add to position 1</p>
            </div>
            <div className="flex items-center mb-2">
              <input type="checkbox" className="mr-2" />
              <p>Add to position 2</p>
            </div>
            <div className="flex items-center mb-2">
              <input type="checkbox" className="mr-2" />
              <p>Add to position 3</p>
            </div>
            <div className="flex items-center mb-2">
              <input type="checkbox" className="mr-2" />
              <p>Add to position 4</p>
            </div>
            <div className="flex items-center mb-2">
              <input type="checkbox" className="mr-2" />
              <p>Add to position 5</p>
            </div>
          </div>
          {/* Radio Buttons for Bulk/Promo Options */}
          <div className="mb-4">
            <p className="font-bold">Bulk?</p>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input type="radio" name="bulk" value="no" className="mr-2" />
                No
              </label>
              <label className="flex items-center">
                <input type="radio" name="bulk" value="yes" className="mr-2" />
                Yes
              </label>
            </div>
          </div>
          <div className="mb-4">
            <p className="font-bold">Available Promo?</p>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input type="radio" name="available_promo" value="no" className="mr-2" />
                No
              </label>
              <label className="flex items-center">
                <input type="radio" name="available_promo" value="yes" className="mr-2" />
                Yes
              </label>
            </div>
          </div>
          <div className="mb-4">
            <p className="font-bold">Preorder Promo?</p>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input type="radio" name="preorder_promo" value="no" className="mr-2" />
                No
              </label>
              <label className="flex items-center">
                <input type="radio" name="preorder_promo" value="yes" className="mr-2" />
                Yes
              </label>
            </div>
          </div>
          <div className="mb-4">
            <p className="font-bold">Promoted?</p>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input type="radio" name="promoted" value="no" className="mr-2" />
                No
              </label>
              <label className="flex items-center">
                <input type="radio" name="promoted" value="yes" className="mr-2" />
                Yes
              </label>
            </div>
          </div>
        </div>

        {/* Admin Inputs for Supplier Information */}
        <div className="p-4 bg-white shadow-md rounded-xl mb-4">
          <div className="flex items-center justify-between text-base font-bold">
            <div className="flex items-center justify-center space-x-2 flex-grow">
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
                        placeholder=""
                        onChange={formik.handleChange}
                        value={formik.values.productPrice}
                        className="w-full px-3 py-2 border-none focus:ring-0"
                      />
                    </span>
                  </p>
                  <hr />
                </div>
                {/* Additional Costing Fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
                    <div>
                      <label htmlFor="vPrice">
                        Vprice ($)
                        <input
                          id="vPrice"
                          name="vPrice"
                          type="text"
                          placeholder="ver"
                          onChange={formik.handleChange}
                          value={formik.values.vPrice}
                          className="w-full px-3 py-6 border rounded-md text-center"
                        />
                      </label>
                    </div>
                    <div>
                      <label htmlFor="Vshipping">
                        Vshipping
                        <input
                          id="Vshipping"
                          name="Vshipping"
                          type="text"
                          placeholder="ven"
                          onChange={formik.handleChange}
                          value={formik.values.Vshipping}
                          className="w-full px-3 py-6 border rounded-md text-center"
                        />
                      </label>
                    </div>
                    <div>
                      <label htmlFor="L">
                        L
                        <input
                          id="L"
                          name="L"
                          type="text"
                          placeholder="L"
                          onChange={formik.handleChange}
                          value={formik.values.L}
                          className="w-full px-3 py-6 border rounded-md"
                        />
                      </label>
                    </div>
                    <div>
                      <label htmlFor="W">
                        W
                        <input
                          id="W"
                          name="W"
                          type="text"
                          placeholder="W"
                          onChange={formik.handleChange}
                          value={formik.values.W}
                          className="w-full px-3 py-6 border rounded-md"
                        />
                      </label>
                    </div>
                    <div>
                      <label htmlFor="H">
                        H
                        <input
                          id="H"
                          name="H"
                          type="text"
                          placeholder="H"
                          onChange={formik.handleChange}
                          value={formik.values.H}
                          className="w-full px-3 py-6 border rounded-md"
                        />
                      </label>
                    </div>
                    <div>
                      <label htmlFor="CBM">
                        1CBM
                        <input
                          id="CBM"
                          name="CBM"
                          type="text"
                          placeholder="e.g."
                          onChange={formik.handleChange}
                          value={formik.values.CBM}
                          className="w-full px-3 py-6 border rounded-md"
                        />
                      </label>
                    </div>
                    <div>
                      <label htmlFor="rate">
                        Rate ($ to GHS)
                        <input
                          id="rate"
                          name="rate"
                          type="text"
                          placeholder="Rate ($ to GHS)"
                          onChange={formik.handleChange}
                          value={formik.values.rate}
                          className="w-full px-3 py-6 border rounded-md"
                        />
                      </label>
                    </div>
                  </div>
                </div>
                {/* Total Cost Details */}
                <div className="space-y-2 mb-4">
                  <p className="text-base flex items-center">
                    CBM:{" "}
                    <span>
                      <input
                        id="cmb"
                        name="cmb"
                        type="text"
                        placeholder="00"
                        onChange={formik.handleChange}
                        value={formik.values.cmb}
                        className="w-full px-3 py-2 border-none"
                      />
                    </span>
                  </p>
                  <p className="text-base flex items-center">
                    Shipping Cost:{" "}
                    <span>
                      <input
                        id="shoppingCost"
                        name="shoppingCost"
                        type="text"
                        placeholder="0.0"
                        onChange={formik.handleChange}
                        value={formik.values.shoppingCost}
                        className="w-full px-3 py-2 border-none"
                      />
                    </span>
                  </p>
                  <p className="text-base flex items-center">
                    Product cost:{" "}
                    <span>
                      <input
                        id="productCost"
                        name="productCost"
                        type="text"
                        placeholder="0.0"
                        onChange={formik.handleChange}
                        value={formik.values.productCost}
                        className="w-full px-3 py-2 border-none"
                      />
                    </span>
                  </p>
                  <p className="text-base flex items-center">
                    Total cost:{" "}
                    <span>
                      <input
                        id="totalCost"
                        name="totalCost"
                        type="text"
                        placeholder="0.0"
                        onChange={formik.handleChange}
                        value={formik.values.totalCost}
                        className="w-full px-3 py-2 border-none"
                      />
                    </span>
                  </p>
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
          {/* Photo component handles image selection and lifts the list via onImagesSelect */}
          <Photo onImagesSelect={setSelectedImages} />
        </div>

        <div className="flex justify-between text-xl font-bold p-4">
          <button
            type="submit"
            className="bg-purple-500 text-white px-4 py-2 rounded-md"
          >
            Save and continue
          </button>
          <button type="button">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddNewProducts;
