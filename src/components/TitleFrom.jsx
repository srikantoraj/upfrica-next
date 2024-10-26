import { Editor } from '@tinymce/tinymce-react';
import React, { useState } from 'react';
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from "react-icons/md";
import ImageUploading from "react-images-uploading";
import { Editor } from "@tinymce/tinymce-react";


const TitleFrom = ({ formik, categories }) => {
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false); // To control category dropdown
    const [conditionDropdownOpen, setConditionDropdownOpen] = useState(false); // To control condition dropdown
    const [arrowshowDropdown, setArrowShowDropdown] = useState(false);
    const [brandArrow, setBrandArrow] = useState(false);
    const [approVal, setApproVal] = useState(false); // Dropdown visibility state
    const [selectedValue, setSelectedValue] = useState(""); // Selected value state
    const [brand, setBrand] = useState(false);
    return (
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
    );
};

export default TitleFrom;