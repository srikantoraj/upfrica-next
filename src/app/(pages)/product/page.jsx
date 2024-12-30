import React from 'react';

const Products = () => {
    const products = [
        {
            id: 1,
            title: "Product 1",
            published: true,
            brand: "Brand A",
            price: 100,
            oldPrice: 120,
            location: "New York, USA",
            image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBN0JLQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--db7b9417205794b63b35a34da1a302a3bdd1bd79/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQWZwcEFmbzZER052Ym5abGNuUTZDWGRsWW5BPSIsImV4cCI6bnVsbCwicHVyIjoidmFyaWF0aW9uIn19--9e32e45ba8c99d3e515807419773adcbdf4a3373/1.jpg"
        },
        {
            id: 2,
            title: "Product 2",
            published: false,
            brand: "Brand B",
            price: 80,
            oldPrice: 100,
            location: "California, USA",
            image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBOVJMQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--c8df1acb57d66d558f68c886c3dbc16be2058d39/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQWZwcEFmbzZER052Ym5abGNuUTZDWGRsWW5BPSIsImV4cCI6bnVsbCwicHVyIjoidmFyaWF0aW9uIn19--9e32e45ba8c99d3e515807419773adcbdf4a3373/1%20(3).jpg"
        },
        {
            id: 3,
            title: "Product 3",
            published: true,
            brand: "Brand C",
            price: 200,
            oldPrice: 250,
            location: "Texas, USA",
            image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBOWhMQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--d1975287c85beea0819fa6acbee92d3e472cfca0/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQWZwcEFmbzZER052Ym5abGNuUTZDWGRsWW5BPSIsImV4cCI6bnVsbCwicHVyIjoidmFyaWF0aW9uIn19--9e32e45ba8c99d3e515807419773adcbdf4a3373/2%20(2).jpg"
        },
        {
            id: 4,
            title: "Product 4",
            published: false,
            brand: "Brand D",
            price: 50,
            oldPrice: 70,
            location: "Florida, USA",
            image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBcDh5IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--a95ab0e5ad831cdb83b967f320f101c04e1e3357/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lKZDJWaWNBWTZCa1ZVT2hOeVpYTnBlbVZmZEc5ZlptbHNiRnNIYVFINmFRSDZPZ3hqYjI1MlpYSjBPZ2wzWldKdyIsImV4cCI6bnVsbCwicHVyIjoidmFyaWF0aW9uIn19--cea2ea15b8d310341c92ff16415b9797e494c8c9/H818d97491c7845f4ac151d83bb5b07364.jpg_720x720q50.webp"
        },
        {
            id: 5,
            title: "Product 5",
            published: true,
            brand: "Brand E",
            price: 150,
            oldPrice: 180,
            location: "Chicago, USA",
            image: "https://www.upfrica.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBODhtQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--8fca3719c334d75a3563f4142026785e46c778af/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQWZwcEFmbzZER052Ym5abGNuUTZDWGRsWW5BPSIsImV4cCI6bnVsbCwicHVyIjoidmFyaWF0aW9uIn19--9e32e45ba8c99d3e515807419773adcbdf4a3373/robust-meat-saw.jpg"
        }
    ];

    return (
        <div className='bg-gray-100 py-10'>
        <div className="container mx-auto space-y-6 px-4">
            {products.map((product) => (
                <div
                    key={product.id}
                    className="flex items-center shadow-2xl rounded-lg p-4 space-x-4 py-6 bg-white"
                >
                    {/* Left Side: Image */}
                    <div className="w-1/3 flex justify-center items-center">
                        <img
                            src={product.image}
                            alt={product.title}
                            className="max-w-full max-h-full rounded-lg object-cover"
                        />
                    </div>

                    {/* Right Side: Text */}
                    <div className="w-2/3 flex flex-col space-y-2">
                        <h2 className="text-lg font-semibold text-gray-800">
                            {product.title}
                        </h2>
                        <p className="text-sm text-gray-600">
                            {product.published ? "Published" : "Unpublished"}
                        </p>
                        <p className="text-sm text-gray-600">
                            Brand: <span className="font-medium">{product.brand}</span>
                        </p>
                        <div className="text-lg text-gray-800 font-bold">
                            Price: ${product.price}
                        </div>
                        <div className="text-sm text-gray-500 line-through">
                            Old Price: ${product.oldPrice}
                        </div>
                        <button className="text-blue-500 font-bold text-left hover:underline">
                            Buy It Now
                        </button>
                        <p className="text-sm text-gray-600 mt-2">
                            Location:{" "}
                            <span className="font-medium">{product.location}</span>
                        </p>
                        <div className="flex space-x-2 mt-4">
                            <button className="text-purple-500  py-2 rounded hover:text-purple-700 transition">
                                Publish
                            </button>
                            <button className="text-purple-500 py-2 rounded hover:text-purple-700 transition">
                                Edit
                            </button>
                            <button className="text-red-500 py-2 rounded hover:text-red-700 transition">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        </div>


    );
};

export default Products;