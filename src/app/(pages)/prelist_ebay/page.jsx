'use client'
import React, { useState } from "react";
import { FaChevronDown, FaEdit } from "react-icons/fa";


const filters = [
    "Brand",
    "Screen Size",
    "Processor",
    "Model",
    "Operating System",
    "Storage Type",
    "Features",
    "SSD Capacity",
    "Type: Notebook/Laptop",
];

// const products = [
//     {
//         title: "Acer Aspire 5 14 in i5 11th Gen 8GB RAM 512GB SSD Laptop - Grey",
//         brand: "Acer",
//         screenSize: "14 in",
//         processor: "Intel Core i5 11th Gen.",
//         image: "https://i.ebayimg.com/images/g/05oAAOSwObJkXJHW/s-l640.jpg",
//     },
//     {
//         title: "Asus E410 14in Celeron N4020, 4GB, 64GB eMMC Laptop - Blue",
//         brand: "ASUS",
//         screenSize: "14 in",
//         processor: "Intel Celeron",
//         image: "https://i.ebayimg.com/images/g/JMUAAOSwfyljBiJt/s-l640.jpg",
//     },
// ];


const products = [
    {
        title: "Acer Aspire 5 14 in i5 11th Gen 8GB RAM 512GB SSD Laptop - Grey (NXK5BEK005)",
        image: "https://i.ebayimg.com/images/g/05oAAOSwObJkXJHW/s-l640.jpg",
        brand: "Acer",
        screenSize: "14 in",
        processor: "Intel Core i5 11th Gen."
    },
    {
        title: "Asus E410 14in ( 64GB eMMC, Intel Celeron N4020, 1.10GHz, 4GB) Laptop - Blue - 90NB0Q11-M44000",
        image: "https://i.ebayimg.com/images/g/JMUAAOSwfyljBiJt/s-l640.jpg",
        brand: "ASUS",
        screenSize: "14 in",
        processor: "Intel Celeron"
    },
    {
        title: "Lenovo IdeaPad 3 15IAU7 15.6\" (128GB SSD, Intel Core i3-1215U, 3.3GHz, 4GB RAM) Notebook - Abyss Blue (82RK009TUK)",
        image: "https://i.ebayimg.com/images/g/DxsAAOSwG11kGWFO/s-l640.jpg",
        brand: "Lenovo",
        screenSize: "15.6 in",
        processor: "Intel Core i3 12th Gen."
    },
    {
        title: "ASUS E510MA 15.6\" (64GB eMMC, Intel Celeron N4020, 1.1 GHz, 4GB RAM) Laptop - Black (E510MA-EJ040WS)",
        image: "https://i.ebayimg.com/images/g/ZEAAAOSwDDJjhcOM/s-l640.jpg",
        brand: "ASUS",
        screenSize: "15.6 in",
        processor: "Intel Celeron N"
    },
    {
        title: "HP ProBook 430 G8 15.6\" (256GB SSD, Intel Core i5 10th Gen., 1.00 GHz, 8GB) Laptop -Silver",
        image: "https://i.ebayimg.com/images/g/blwAAOSwhMhjV~EV/s-l640.jpg",
        brand: "HP",
        screenSize: "15.6 in",
        processor: "Intel Core i5-1035G1"
    },
    {
        title: "Dell 14 in Intel i3 8GB RAM 128GB SSD Laptop - Refurbished",
        image: "https://i.ebayimg.com/images/g/ByoAAOSwARJlgB9v/s-l1600.jpg",
        brand: "Dell",
        screenSize: "14 in",
        processor: "Intel Core i3"
    },
    {
        title: "Lenovo Yoga Pro 7 14IRH8 14.5\" (512GB SSD, Intel Core i7 13th Gen., 5.00 GHz, 16GB) Laptop - Storm Grey - 82Y7002GUK",
        image: "https://i.ebayimg.com/images/g/70kAAOSw5JxkqFUh/s-l640.jpg",
        brand: "Lenovo",
        screenSize: "14.5 in",
        processor: "Intel Core i7 13th Gen."
    }
];



export default function ProductFilterSection() {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedProduct(null);
        setShowModal(false);
    };


    return (
        <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">

            <div className="grid md:grid-cols-3 gap-10">
                {/* filter section  */}

                <div className="col-span-1 md:sticky md:top-10 self-start h-fit">
                    {/* Heading Section */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Find a match</h1>
                        <p className="text-gray-500 text-sm mt-1">for 'laptop'</p>
                        <div className="flex items-center gap-2 mt-2">
                            <button className="text-blue-900 underline text-sm">
                                Computers &gt; Laptops &gt; PC Laptops &gt; Netbooks
                            </button>
                            <FaEdit className="text-blue-900" />
                        </div>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap gap-3 border-t pt-6">
                        {filters.map((filter, i) => (
                            <button
                                key={i}
                                className="px-4 py-2 border rounded-full text-sm text-gray-700 flex items-center gap-1 hover:bg-gray-100"
                            >
                                {filter}
                                <FaChevronDown className="text-xs" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Cards */}

                <div className="col-span-2">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Top picks from the product library
                    </h2>
                    <ul className="flex flex-col gap-4">
                        {products.map((product, index) => (
                            <li key={index} className="w-full">
                                <button
                                    onClick={() => handleOpenModal(product)}
                                    type="button"
                                    className="flex flex-col sm:flex-row items-start sm:items-center bg-white shadow-sm hover:shadow-md transition rounded-lg overflow-hidden w-full text-left"
                                >
                                    {/* Image Section */}
                                    <div className="w-full sm:w-40 md:w-52 flex-shrink-0">
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>

                                    {/* Text Content Section */}
                                    <div className="p-4 sm:px-6 flex flex-col justify-center text-sm">
                                        <div className="font-semibold text-gray-800 mb-2">{product.title}</div>
                                        <div className="text-gray-500">Brand: {product.brand}</div>
                                        <div className="text-gray-500">Screen Size: {product.screenSize}</div>
                                        <div className="text-gray-500">Processor: {product.processor}</div>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>



            </div>


            {/* {showModal && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative max-h-min">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
                        >
                            &times;
                        </button>

                        <div className="p-6">
                            <div className="flex gap-6">
                                <img
                                    src={selectedProduct.image}
                                    alt={selectedProduct.title}
                                    className="w-40 h-40 object-cover rounded"
                                />
                                <div>
                                    <h2 className="text-xl font-bold">{selectedProduct.title}</h2>
                                    <p className="text-gray-600">Brand: {selectedProduct.brand}</p>
                                    <p className="text-gray-600">Screen Size: {selectedProduct.screenSize}</p>
                                    <p className="text-gray-600">Processor: {selectedProduct.processor}</p>
                                </div>
                            </div>

                            <div className="mt-4">
                                <h3 className="text-md font-semibold mb-2">Select Condition:</h3>
                                <div className="space-y-2">
                                    {[
                                        "New",
                                        "Opened – never used",
                                        "Seller refurbished",
                                        "Used",
                                        "For parts or not working",
                                    ].map((condition, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <input type="radio" name="condition" id={condition} />
                                            <label htmlFor={condition}>{condition}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 text-right">
                                <button className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800" disabled>
                                    Continue to listing
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            )} */}

            {showModal && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative h-[80vh] flex flex-col overflow-hidden">
                        {/* Close Button */}
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-2xl"
                        >
                            &times;
                        </button>

                        {/* Scrollable Body */}
                        <div className="p-6 flex-1 overflow-y-auto">
                            {/* Top Section */}
                            <div className="flex flex-col md:flex-row gap-6">
                                <img
                                    src={selectedProduct.image}
                                    alt={selectedProduct.title}
                                    className="w-full md:w-40 h-40 object-cover rounded"
                                />
                                <div>
                                    <h2 className="text-xl font-bold">{selectedProduct.title}</h2>
                                    <p className="text-gray-600">Brand: {selectedProduct.brand}</p>
                                    <p className="text-gray-600">Screen Size: {selectedProduct.screenSize}</p>
                                    <p className="text-gray-600">Processor: {selectedProduct.processor}</p>
                                </div>
                            </div>

                            {/* Condition Selector */}
                            <div className="mt-6">
                                <h3 className="text-md font-semibold mb-2">Select Condition:</h3>
                                <div className="space-y-2">
                                    {[
                                        "New",
                                        "Opened – never used",
                                        "Seller refurbished",
                                        "Used",
                                        "For parts or not working",
                                    ].map((condition, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <input type="radio" name="condition" id={condition} />
                                            <label htmlFor={condition}>{condition}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Fixed Bottom Button */}
                        <div className="border-t p-4 flex justify-center">
                            <button className="px-6 py-2 bg-blue-900 text-white rounded hover:bg-blue-800">
                                Continue to listing
                            </button>
                        </div>
                    </div>
                </div>
            )}




            {/* Continue Button */}
            <div className="text-center">
                <button className="px-6 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100">
                    Continue without match
                </button>
            </div>
        </div>
    );
}
