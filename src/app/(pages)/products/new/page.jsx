"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaMinus, FaPencilAlt, FaPlus } from "react-icons/fa";
import { IoMdNotifications, IoMdPhotos } from "react-icons/io";
// import { IoMdNotifications } from "react-icons/io";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from "react-icons/md";
import ImageUploading from "react-images-uploading";
import { Editor } from "@tinymce/tinymce-react";
import { useFormik } from "formik";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { usePathname, useSearchParams } from 'next/navigation'


const AddNewProducts = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [arrowshowDropdown, setArrowShowDropdown] = useState(false);
  const [brandArrow, setBrandArrow] = useState(false);
  const [approVal, setApproVal] = useState(false); // Dropdown visibility state
  const [selectedValue, setSelectedValue] = useState(""); // Selected value state
  const [brand, setBrand] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false); // To control category dropdown
  const [conditionDropdownOpen, setConditionDropdownOpen] = useState(false); // To control condition dropdown
  const [categories, setCategories] = useState([]); // Categories for the dropdown
  const [conditions, setConditions] = useState([]); // Categories for the dropdown


  const params = useSearchParams();
  const productId = params.get('id');
  console.log(productId);

  const user = JSON.parse(localStorage.getItem('user'))

  console.log(user)

  useEffect(() => {
    if (productId) {
      // API কল করা
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${user?.token}`);
      myHeaders.append("Content-Type", "application/json");
      const requestOptions = {
        method: "GET",
        headers: myHeaders,

        redirect: "follow"
      };

      fetch(`https://upfrica-staging.herokuapp.com/api/v1/products/${productId}`, requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log(data); // ডাটা স্টেটে সেট করা

          // if (data) {
          //   // সমস্ত ফিল্ড আপডেট করুন
          //   formik.setFieldValue('title', data.title || '');
          //   formik.setFieldValue('description', data.description || '');
          //   formik.setFieldValue('image', data.image || '');
          //   formik.setFieldValue('category', data.category || '');
          //   formik.setFieldValue('condition', data.condition || '');
          // }
        })
        .catch(error => {
          console.error('Error fetching product:', error);
        });
    }
  }, [productId]);

  // Fetch data from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://upfrica-staging.herokuapp.com/api/v1/categories"); // Replace with your API URL
        const data = await response.json();
        setCategories(data.categories); // Assuming data is an array of categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };


    const fetchConditaions = async () => {
      try {
        const response = await fetch("https://upfrica-staging.herokuapp.com/api/v1/conditions"); // Replace with your API URL
        const data = await response.json();
        setConditions(data.conditions); // Assuming data is an array of categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };


    fetchConditaions();
    fetchCategories(); // Call the fetch function when component mounts
  }, []); // Empty dependency array means this will run once when the component mounts



  // টগল করার ফাংশন
  const toggleForm = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };



  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  // image uploading
  const [images, setImages] = React.useState([]);
  const [files, setFiles] = React.useState([]);
  const [result, setResult] = React.useState(null);
  const maxNumber = 69;

  const onChange = async (imageList, addUpdateIndex) => {
    // formik.setFieldValue("product_image", await convertImageListToBase64(imageList));
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };
  const onFilesChange = (imageList, addUpdateIndex) => {
    formik.setFieldValue("product_files", imageList);
    // data for submit
    console.log(imageList, addUpdateIndex);
    setFiles(imageList);
  };

  // Utility function for converting images
  const convertImageListToBase64 = (imageFiles) => {
    return Promise.all(
      imageFiles.map((imageFile) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(imageFile);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      })
    );
  };

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
      


    },

    onSubmit: async (values) => {
      console.log(values, "values")
      const user = JSON.parse(localStorage.getItem("user"));
      console.log(user, "user")



      const product = values;
      console.log(product, values)
      // product["product_images"] = [images[0]?.data_url];

      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${user?.token}`);
      myHeaders.append("Content-Type", "application/json");

      product["user_id"] = user?.user?.id;

      const productObj = {
        product,
      };

      console.log((productObj));

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
          setResult(result);
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
          <div>
            <h2 className="text-2xl font-bold mb-2">Your Title Here</h2>

            <p className="text-gray-600 mb-4">
              This is your paragraph text here.
            </p>

            <hr className="border-gray-300 mb-4" />

            <input
              id="title"
              name="title"
              type="text"
              value={formik.values.title}
              onChange={formik.handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Type something here..."
            />
            <p className="text-gray-500 mt-2">
              {formik.values.title.length} / 80
            </p>
          </div>

          {/* *Item description */}
          <div>
            <h2 className="text-2xl font-bold mb-2">*Item description</h2>

            <p className="text-gray-600 mb-4">
              Usually in bullet points{" "}
              <span className="text-red-500">
                {" "}
                Phone numbers or external links are not allowed in the
                decription
              </span>
            </p>

            <hr className="border-gray-300 mb-4" />
            <Editor
              apiKey="wlfjcowajns1o44b16c3vyk0lmxnctw5pehcbmo9070i2f4x"
              onInit={(_evt, editor) => (editorRef.current = editor)}
              value={formik.values.description}
              onEditorChange={(description) =>
                formik.setFieldValue(description)
              }
              // initialValue=""
              init={{
                height: 200,
                menubar: false,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "product_images",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | " +
                  "bold italic forecolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />

            <p className="">Add accurate and concise details of your product</p>
          </div>

          {/* *Category */}
          <div className="py-4">
            <h2 className="text-2xl font-bold mb-2">*Category</h2>

            <hr className="border-gray-300 mb-4" />
            <div className="relative flex items-center justify-between border rounded-md group focus-within:border-purple-500">
              <input
                className="w-full border-none focus:outline-none focus:ring-0 py-2 ps-3 hover:cursor-pointer"
                type="text"
                placeholder="Search Upfrica BD"
                value={formik.values.category_name} // Formik value
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)} // Toggle dropdown on click
                onChange={formik.handleChange} // Handle input change
                name="category_name" // Set the name for formik
              />
              <button
                type="button"
                className="bg-purple-500 text-white h-[45px] px-6 rounded-tr-md rounded-br-md"
              >
                More
              </button>

              {/* Dropdown list */}
              {categoryDropdownOpen && (
                <div className="absolute top-full left-0 w-full bg-white border rounded shadow-lg mt-2 z-10">
                  <ul className="py-2">
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <li
                          key={category.id} // Assuming each category has an id
                          className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                          onClick={() => {
                            formik.setFieldValue("category_id", category.id); // Set the selected value to Formik field
                            formik.setFieldValue("category_name", category.name); // Set the selected value to Formik field
                            setCategoryDropdownOpen(false); // Hide dropdown after selection
                          }}
                        >
                          {category.name}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-gray-500">Loading...</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            <p className="">Select or tap on more</p>
          </div>

          {/* *Condition */}
          <div className="py-4">
            <h2 className="text-2xl font-bold mb-2">*Condition</h2>
            <p>
              Use keywords people would search for when looking for your item.
              Include details such as colour, size, brand & model.
            </p>
            <hr className="border-gray-300 mb-4" />

            <div className="relative flex items-center justify-between border rounded-md group focus-within:border-purple-500">
              <input
                id="condition_id"
                className="w-full border-none focus:outline-none focus:ring-0 py-2 ps-3 hover:cursor-pointer"
                type="text"
                placeholder="Search Upfrica BD"
                value={formik.values.condition_name} // Set Formik value
                onChange={formik.handleChange}
                readOnly // Input is read-only to prevent typing
                onClick={() => setConditionDropdownOpen(!conditionDropdownOpen)} // Toggle dropdown on click
                name="condition_name"
              />
              {arrowshowDropdown ? (
                <button className="h-[45px] px-6 rounded-tr-md rounded-br-md">
                  <MdOutlineArrowDropUp />
                </button>
              ) : (
                <button className="h-[45px] px-6 rounded-tr-md rounded-br-md">
                  <MdOutlineArrowDropDown />
                </button>
              )}

              {/* Dropdown list */}
              {conditionDropdownOpen && (
                <div className="absolute top-full left-0 w-full bg-white border rounded shadow-lg mt-2 z-10">
                  <ul className="py-2">
                    {conditions.length > 0 ? (
                      conditions.map((condision) => (
                        <li
                          key={condision.id} // Assuming each category has an id
                          className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                          onClick={() => {
                            formik.setFieldValue("condition_id", condision.id); // Set the selected value to Formik field
                            formik.setFieldValue("condition_name", condision.name); // Set the selected value to Formik field
                            setConditionDropdownOpen(false); // Hide dropdown after selection
                          }}
                        >
                          {condision.name}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-gray-500">Loading...</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Brand  */}
          <div className="py-4">
            <h2 className="text-2xl font-bold mb-2">*Brand</h2>
            <p>
              Use keywords people would search for when looking for your item.
              Include details such as colour, size, brand & model.
            </p>
            <hr className="border-gray-300 mb-4" />

            <div className="relative flex items-center justify-between border rounded-md group focus-within:border-purple-500">
              <input
                id="brand"
                name="brand"
                className="w-full border-none focus:outline-none focus:ring-0 py-2 ps-3"
                type="text"
                placeholder="Search Upfrica BD"
                value={formik.values.brand} // Set Formik value
                onChange={formik.handleChange}
                readOnly // Input is read-only to prevent typing
                onClick={() => setArrowShowDropdown(!arrowshowDropdown)} // Toggle dropdown
              />
              {brand ? (
                <button className="h-[45px] px-6 rounded-tr-md rounded-br-md">
                  <MdOutlineArrowDropUp />
                </button>
              ) : (
                <button className="h-[45px] px-6 rounded-tr-md rounded-br-md">
                  <MdOutlineArrowDropDown />
                </button>
              )}

              {/* Dropdown list */}
              {arrowshowDropdown && (
                <div className="absolute top-full left-0 w-full bg-white border rounded shadow-lg mt-2 z-10">
                  <ul className="py-2">
                    <li
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        formik.setFieldValue("brand", "Option 1"); // Set selected value
                        setArrowShowDropdown(false); // Hide dropdown after selection
                      }}
                    >
                      Option 1
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        formik.setFieldValue("brand", "Option 2"); // Set selected value
                        setArrowShowDropdown(false); // Hide dropdown after selection
                      }}
                    >
                      Option 2
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        formik.setFieldValue("brand", "Option 3"); // Set selected value
                        setArrowShowDropdown(false); // Hide dropdown after selection
                      }}
                    >
                      Option 3
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* *Photos & Video */}
          <div>
            <div className="space-y-2 py-4">
              <h1 className="text-2xl font-bold">*Photos & Video</h1>
              <p>Phone numbers are not allowed on photos</p>
            </div>
            <hr />
            <div className="space-y-4 m-4">
              <p>Supported files: *.jpg and *.png</p>
              <div className="App">
                <ImageUploading
                  multiple
                  value={images}
                  onChange={onChange}
                  maxNumber={maxNumber}
                  dataURLKey="data_url"
                >
                  {({
                    imageList,
                    onImageUpload,
                    onImageRemoveAll,
                    onImageUpdate,
                    onImageRemove,
                    isDragging,
                    dragProps,
                  }) => (
                    // write your building UI
                    <div className="upload__image-wrapper">
                      <button
                        type="button"
                        className="h-40 w-40 border"
                        style={isDragging ? { color: "red" } : undefined}
                        onClick={onImageUpload}
                        {...dragProps}
                      >
                        <span>
                          <IoMdPhotos className="h-8 w-8 mx-auto" />
                        </span>
                        Add Photos
                      </button>
                      &nbsp;
                      {/* <button onClick={onImageRemoveAll}>
                        Remove all images
                      </button> */}
                      {imageList.map((image, index) => (
                        <div key={index} className="image-item">
                          <img src={image["data_url"]} alt="" width="100" />
                          <div className="image-item__btn-wrapper">
                            <button onClick={() => onImageUpdate(index)}>
                              Update
                            </button>
                            <button onClick={() => onImageRemove(index)}>
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ImageUploading>
              </div>
            </div>
            <hr />

            <div className="py-6 space-y-2">
              <p>YouTube video link - optional</p>
              <input
                id="youTubeLink"
                name="youTubeLink"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.youTubeLink}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://www.youtube.com/watch?v=nLl0z0YC6hk"
              />
            </div>
            <div className="space-y-2">
              <p className="text-base font-bold">
                Upload mp4 product video - <small>optional</small>
              </p>
              <div className="App">
                <ImageUploading
                  multiple
                  value={files}
                  onChange={onFilesChange}
                  maxNumber={maxNumber}
                  dataURLKey="data_url"
                >
                  {({
                    imageList,
                    onImageUpload,
                    onImageRemoveAll,
                    onImageUpdate,
                    onImageRemove,
                    isDragging,
                    dragProps,
                  }) => (
                    // write your building UI
                    <div className="upload__image-wrapper flex space-x-4 items-center">
                      <button
                        className="px-4 py-2 border font-bold rounded"
                        style={isDragging ? { color: "red" } : undefined}
                        onClick={onImageUpload}
                        {...dragProps}
                      >
                        Choose File
                      </button>
                      <p>No file Chosen</p>
                      &nbsp;
                      {imageList.map((image, index) => (
                        <div key={index} className="image-item">
                          <img src={image["data_url"]} alt="" width="100" />
                          <div className="image-item__btn-wrapper">
                            <button onClick={() => onImageUpdate(index)}>
                              Update
                            </button>
                            <button onClick={() => onImageRemove(index)}>
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ImageUploading>
              </div>
            </div>

            {/* Pricing */}

            <div className="my-6">
              <h1 className="text-2xl font-bold">*Pricing</h1>
              <hr className="my-4" />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                <div>
                  <h1 className="text-gray-700 text-base">*item Price</h1>
                  <div className="flex items-center space-x-2 border-b pb-1 text-xl font-bold">
                    <h3 className="underline text-blue-600">USD</h3>
                    <input
                      className="border-none text-xl font-bold focus:outline-none focus:ring-0"
                      type="text"
                      name="productPrice"
                      id="price"
                      onChange={formik.handleChange}
                      value={formik.values.productPrice}
                      placeholder="Price"
                    />
                  </div>
                </div>
                <div>
                  <h1 className="text-gray-700 text-base">Unit value</h1>
                  <div className="flex  md:items-center space-x-2  text-xl font-bold">
                    <input
                      id="unitValue"
                      name="unitValue"
                      type="number"
                      onChange={formik.handleChange}
                      value={formik.values.unitValue}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <h1 className="text-gray-700 text-base">Unit of measure</h1>
                  <div className="flex items-center space-x-2  text-xl font-bold">
                    <input
                      id="unitOf"
                      name="unitOf"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      type="text"
                      onChange={formik.handleChange}
                      value={formik.values.unitOf}
                      placeholder="each"
                      onClick={() => setBrandArrow(!brandArrow)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Approval notes */}
            <div className="my-4">
              <h1 className="text-2xl font-bold">Approval notes</h1>
              <hr className="my-6" />
              <div className="relative flex items-center justify-between border rounded-md group focus-within:border-purple-500">
                <input
                  id="approval"
                  name="approval"
                  className="w-full border-none focus:outline-none focus:ring-0 py-2 ps-3"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.approval} // Formik's field value
                  readOnly
                  placeholder="Select"
                  onClick={() => setApproVal(!approVal)} // Toggle dropdown on click
                />

                {/* Dropdown list */}
                {approVal && (
                  <div className="absolute top-full left-0 w-full bg-white border rounded shadow-lg mt-2 z-10">
                    <ul className="py-2">
                      <li
                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => {
                          setSelectedValue("Option 1");
                          formik.setFieldValue("approval", "Option 1"); // Set value to Formik field
                          setApproVal(false); // Close dropdown after selection
                        }}
                      >
                        Option 1
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => {
                          setSelectedValue("Option 2");
                          formik.setFieldValue("approval", "Option 2"); // Set value to Formik field
                          setApproVal(false); // Close dropdown after selection
                        }}
                      >
                        Option 2
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => {
                          setSelectedValue("Option 3");
                          formik.setFieldValue("approval", "Option 3");
                          setApproVal(false); // Close dropdown after selection
                        }}
                      >
                        Option 3
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between text-xl font-bold p-4">
          <button
            type="submit"
            className="bg-purple-500 text-white px-4 py-2 rounded-md"
          >
            Save and continue
          </button>
          <button>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddNewProducts;
