"use client";
import React, { useEffect, useState } from "react";
import { FaMinus, FaPencilAlt, FaPlus } from "react-icons/fa";
import { IoMdNotifications, IoMdPhotos } from "react-icons/io";
// import { IoMdNotifications } from "react-icons/io";
import { useFormik } from "formik";
import Categore from "@/components/inpute/Categore";
import Conditon from "@/components/inpute/Conditon";
import Brand from "@/components/inpute/Brand";
import Title from "@/components/inpute/Title";
import Description from "@/components/inpute/Description";
import Photo from "@/components/inpute/Photo";
import SubmitButton from "@/components/inpute/SubmitButton";
import useCategories from "@/components/api/data";

const NewProduct = ({ params }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [produt, setProduct] = useState();
  const [categorie, setCategorie] = useState([]);
  const [condition, setCondition] = useState([]);
  
  const { id } = params || {}; // Safely destructure id
//   console.log("Dynamic ID from params:", id); // দেখাচ্ছে ডাইনামিক id
//   console.log("Type of ID from params:", typeof id); // দেখাচ্ছে id এর টাইপ

  const { categories,conditions } = useCategories();
  console.log("Categories from useCategories:", categories); // দেখাচ্ছে 


  useEffect(() => {
    setCategorie(categories);
    setCondition(condition)
  }, [categories,conditions]);
  
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;
  
        if (!token) {
          console.error("User is not authenticated");
          setLoading(false);
          return;
        }
  
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
  
        const response = await fetch(
          `https://upfrica-staging.herokuapp.com/api/v1/products/${id}`,
          {
            method: "GET",
            headers: myHeaders,
          }
        );
  
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
  
        const data = await response.json();
        console.log(data);
        setProduct(data);
  
        // Matching category with product's category_id
        const matchedCategory = categories.find(
          (category) => category.id === data.category_id
        );
        const matchedCondition = conditions.find(
          (condition) => condition.id === data.condition_id
        );
  
        // Formik এ সেট করার সময় category_name এ matchedCategory.name সেট করা হচ্ছে
        formik.setValues({
          title: data.title || "",
          description: data.description.body || "",
          product_quantity: data.product_quantity || 1,
          price_cents: data.price_cents || 1,
          sale_price_cents: data.sale_price_cents || 0,
          postage_fee_cents: data.postage_fee_cents || 0,
          secondary_postage_fee_cents: data.secondary_postage_fee_cents || 0,
          price_currency: data.price_currency || "GHS",
          status: data.status || "",
          category_name: matchedCategory ? matchedCategory.name : '', // Set category name if matched
          condition_name: matchedCondition ? matchedCondition.name :  '',
        });
  
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };
  
    if (id) {
      fetchProduct();
    }
  }, [id, categories]);
  

//   console.log("products", produt);

  const toggleForm = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  // useFormik hook usage here, outside of any condition
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      product_quantity: 1,
      price_cents: 1,
      sale_price_cents: 0,
      postage_fee_cents: 0,
      secondary_postage_fee_cents: 0,
      price_currency: "GHS",
      status: "",
      category_id: "",
      condition_id: "",
    },
    onSubmit: async (values) => {
      const user = JSON.parse(localStorage.getItem("user"));
      const productData = values;
      productData["user_id"] = user?.user?.id;

      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${user?.token}`);
      myHeaders.append("Content-Type", "application/json");

      const productObj = { product: productData };

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(productObj),
      };

      fetch(
        "https://upfrica-staging.herokuapp.com/api/v1/products",
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          console.log(result);
        })
        .catch((error) => console.error(error));
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
              *Your location: , Dhaka, Bangladesh{" "}
            </span>
            <span>
              <FaPencilAlt />
            </span>
          </p>
        </div>
        <div className="space-y-4">
          {/* Homepage Positions section  */}
          <div className="p-4 bg-white shadow-md rounded-xl">
            <h1 className="text-2xl font-bold mb-4">
              Homepage Positions (Admin)
            </h1>
            <hr className="py-2" />

            {/* Positions with checkbox */}
            <div className="mb-4 text-base font-bold">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  className="mr-2 text-purple-600 focus:ring-purple-500 checked:bg-purple-600 checked:border-purple-600"
                />
                <p>Add to position 1</p>
              </div>

              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  className="mr-2 text-purple-600 focus:ring-purple-500 checked:bg-purple-600 checked:border-purple-600"
                />
                <p>Add to position 2</p>
              </div>

              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  className="mr-2 text-purple-600 focus:ring-purple-500 checked:bg-purple-600 checked:border-purple-600"
                />
                <p>Add to position 3</p>
              </div>

              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  className="mr-2 text-purple-600 focus:ring-purple-500 checked:bg-purple-600 checked:border-purple-600"
                />
                <p>Add to position 4</p>
              </div>

              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  className="mr-2 text-purple-600 focus:ring-purple-500 checked:bg-purple-600 checked:border-purple-600"
                />
                <p>Add to position 5</p>
              </div>
            </div>

            {/* Bulk */}
            <div className="mb-4">
              <p className="font-bold">Bulk?</p>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="bulk"
                    value="no"
                    className="mr-2 text-purple-600 focus:ring-purple-500 checked:bg-purple-600 checked:border-purple-600"
                  />
                  No
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="bulk"
                    value="yes"
                    className="mr-2 text-purple-600 focus:ring-purple-500 checked:bg-purple-600 checked:border-purple-600"
                  />
                  Yes
                </label>
              </div>
            </div>

            {/* Available Promo */}
            <div className="mb-4">
              <p className="font-bold">Available Promo?</p>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="available_promo"
                    value="no"
                    className="mr-2 text-purple-600 focus:ring-purple-500 checked:bg-purple-600 checked:border-purple-600"
                  />
                  No
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="available_promo"
                    value="yes"
                    className="mr-2 text-purple-600 focus:ring-purple-500 checked:bg-purple-600 checked:border-purple-600"
                  />
                  Yes
                </label>
              </div>
            </div>

            {/* Preorder Promo */}
            <div className="mb-4">
              <p className="font-bold">Preorder Promo?</p>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="preorder_promo"
                    value="no"
                    className="mr-2 text-purple-600 focus:ring-purple-500 checked:bg-purple-600 checked:border-purple-600"
                  />
                  No
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="preorder_promo"
                    value="yes"
                    className="mr-2 text-purple-600 focus:ring-purple-500 checked:bg-purple-600 checked:border-purple-600"
                  />
                  Yes
                </label>
              </div>
            </div>

            {/* Promoted */}
            <div className="mb-4">
              <p className="font-bold">Promoted?</p>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="promoted"
                    value="no"
                    className="mr-2 text-purple-600 focus:ring-purple-500 checked:bg-purple-600 checked:border-purple-600"
                  />
                  No
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="promoted"
                    value="yes"
                    className="mr-2 text-purple-600 focus:ring-purple-500 checked:bg-purple-600 checked:border-purple-600"
                  />
                  Yes
                </label>
              </div>
            </div>
          </div>

          {/* Admin Inputs section  */}

          <div className="p-4 bg-white shadow-md rounded-xl">
            {/* Header Section */}
            <div className="flex items-center justify-between text-base font-bold">
              {/* Centered Content */}
              <div className="flex items-center justify-center space-x-2 flex-grow">
                <span>
                  <IoMdNotifications />
                </span>
                <span>Admin Inputs</span>
              </div>

              {/* Arrow Button on Right */}
              <button onClick={toggleForm} className="ml-4 focus:outline-none">
                {isOpen ? <FaMinus /> : <FaPlus />}
              </button>
            </div>

            {/* Toggling Form */}
            {isOpen && (
              <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">
                  Supplier Information
                </h1>

                <form className="space-y-4 text-base text-[#3c4858] ">
                  {/* Supplier Links */}
                  <div>
                    <label className="block  font-bold mb-2">
                      Supplier Link or GPS*
                    </label>
                    <input
                      id="supplierLink"
                      name="supplierLink"
                      type="text"
                      placeholder="Link"
                      onChange={formik.handleChange}
                      value={formik.values.supplierLink}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/*Backup Supplier Links */}
                  <div>
                    <label className="block  font-bold mb-2">
                      Backup Supplier Link
                    </label>
                    <input
                      id="backupSupplier"
                      name="backupSupplier"
                      type="text"
                      onChange={formik.handleChange}
                      value={formik.values.backupSupplier}
                      placeholder="2nd Supplier link"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* Supplier name */}
                  <div>
                    <label className="block  font-bold mb-2">
                      Supplier name
                    </label>
                    <input
                      id="supplerName"
                      name="supplerName"
                      type="text"
                      onChange={formik.handleChange}
                      value={formik.values.supplerName}
                      placeholder="Supplier name"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* Supplier phone number */}
                  <div>
                    <label className="block  font-bold mb-2">
                      Supplier phone number
                    </label>
                    <input
                      id="supplerNumber"
                      name="supplerNumber"
                      type="text"
                      onChange={formik.handleChange}
                      value={formik.values.supplerNumber}
                      placeholder="Supplier phone number"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* Product Costing */}
                  <div>
                    <p className="font-bold">Product Costing(USD)</p>
                    <p className="flex items-center">
                      Price $
                      <span className="font-bold">
                        <input
                          id="productPrice"
                          name="productPrice"
                          type="text"
                          onChange={formik.handleChange}
                          value={formik.values.productPrice}
                          placeholder=""
                          className="w-full px-3 py-2 border-none focus:ring-0 "
                        />
                      </span>
                    </p>
                    <hr />
                  </div>
                  {/* inpute filed  */}
                  <div className="space-y-4">
                    {/* Input fields */}
                    <div className="grid grid-cols-3  md:grid-cols-5 lg:grid-cols-7 gap-3 md:gap-5 xl:gap-10 ">
                      <div>
                        <label htmlFor="Vprice($)">
                          Vprice($)
                          <input
                            id="vPrice"
                            name="vPrice"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.vPrice}
                            placeholder="ver"
                            className="w-full px-3 py-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-center"
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
                            onChange={formik.handleChange}
                            value={formik.values.Vshipping}
                            placeholder="ven"
                            className="w-full px-3 py-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-center"
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
                            onChange={formik.handleChange}
                            value={formik.values.L}
                            placeholder="L"
                            className="w-full px-3 py-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 "
                          />
                        </label>
                      </div>

                      <div>
                        <label htmlFor="W">
                          w
                          <input
                            id="W"
                            name="W"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.W}
                            placeholder="W"
                            className="w-full px-3 py-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 "
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
                            onChange={formik.handleChange}
                            value={formik.values.H}
                            placeholder="H"
                            className="w-full px-3 py-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 "
                          />
                        </label>
                      </div>

                      <div>
                        <label htmlFor="1CBM">
                          1CBM
                          <input
                            id="CBM"
                            name="CBM"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.CBM}
                            placeholder="e.g"
                            className="w-full px-3 py-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 "
                          />
                        </label>
                      </div>

                      <div>
                        <label htmlFor="Rate ($ to GHS)">
                          Rate ($ to GHS)
                          <input
                            id="rate"
                            name="rate"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.rate}
                            placeholder="Rate ($ to GHS)"
                            className="w-full px-3 py-6 border rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 "
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  {/* total cosst detels  */}
                  <div className="space-y-2 mb-4">
                    <p className="text-base flex  items-center">
                      CBM:{" "}
                      <span>
                        <input
                          id="cbm"
                          name="cmb"
                          type="text"
                          onChange={formik.handleChange}
                          value={formik.values.cmb}
                          placeholder="00"
                          className="w-full px-3 py-2 border-none focus:ring-0 "
                        />
                      </span>
                    </p>

                    <p className="text-base flex  items-center">
                      Shipping Cost:{" "}
                      <span>
                        <input
                          id="shoppingCost"
                          name="shoppingCost"
                          type="text"
                          onChange={formik.handleChange}
                          value={formik.values.shoppingCost}
                          placeholder="0.0"
                          className="w-full px-3 py-2 border-none focus:ring-0 "
                        />
                      </span>
                    </p>
                    <p className="text-base flex  items-center">
                      Product cost:{" "}
                      <span>
                        <input
                          id="productCost"
                          name="productCost"
                          type="text"
                          onChange={formik.handleChange}
                          value={formik.values.productCost}
                          placeholder="0.0"
                          className="w-full px-3 py-2 border-none focus:ring-0 "
                        />
                      </span>
                    </p>
                    <p className="text-base flex  items-center">
                      Total cost::{" "}
                      <span>
                        <input
                          id="totalCost"
                          name="totalCost"
                          type="text"
                          onChange={formik.handleChange}
                          value={formik.values.totalCost}
                          placeholder="0.0"
                          className="w-full px-3 py-2 border-none focus:ring-0 "
                        />
                      </span>
                    </p>
                  </div>

                  <div className="mt-6">
                    <p className="font-bold mb-2">*Select Payment Terms</p>
                    <div className="flex flex-col space-y-2">
                      <label className="font-bold ">Delivery</label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2 text-purple-600 focus:ring-purple-500 checked:bg-purple-600 checked:border-purple-600"
                        />
                        Payment before delivery
                      </label>
                      <label className="font-bold">Click & Collect</label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2 text-purple-600 focus:ring-purple-500 checked:bg-purple-600 checked:border-purple-600"
                        />
                        Payment on collection
                      </label>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/*  title from  */}
        <div className="my-4 bg-white shadow-md  rounded-md p-4 space-y-2">
          {/* title  */}
          <Title formik={formik} />

          {/* *Item description */}
          <Description formik={formik} />

          {/* *Category */}
          <Categore formik={formik} />

          {/* *Condition */}
          <Conditon formik={formik} />

          {/* Brand  */}
          <Brand formik={formik} />

          {/* *Photos & Video */}
          <Photo />
        </div>
        <SubmitButton />
      </form>
    </div>
  );
};

export default NewProduct;
