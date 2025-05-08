import ProductCard from "../products/ProductCard";

// components/RelatedProducts.jsx
;

export default function RelatedProducts() {
    const products = [
        {
            id: 1,
            title: "Apple Watch - 4",
            image: "https://html.phoenixcoded.net/light-able/bootstrap/assets/images/application/img-prod-1.jpg",
            price: 299,
            oldPrice: 399,
            rating: 4.5,
            discount: 30,
        },
        {
            id: 2,
            title: "Black Heels",
            image: "https://html.phoenixcoded.net/light-able/bootstrap/assets/images/application/img-prod-2.jpg",
            price: 299,
            oldPrice: 399,
            rating: 4.5,
            discount: 20,
        },
        {
            id: 3,
            title: "Green Loafers",
            image: "https://html.phoenixcoded.net/light-able/bootstrap/assets/images/application/img-prod-3.jpg",
            price: 299,
            oldPrice: 399,
            rating: 4.5,
            discount: 0,
        },
        {
            id: 4,
            title: "Nike Air Jordan",
            image: "https://html.phoenixcoded.net/light-able/bootstrap/assets/images/application/img-prod-4.jpg",
            price: 299,
            oldPrice: 399,
            rating: 4.5,
            discount: 30,
        },
        // {
        //     id: 5,
        //     title: "Yellow Heels",
        //     image: "https://html.phoenixcoded.net/light-able/bootstrap/assets/images/application/img-prod-5.jpg",
        //     price: 299,
        //     oldPrice: 399,
        //     rating: 4.5,
        //     discount: 0,
        // },
        // {
        //     id: 6,
        //     title: "Golden Shoes",
        //     image: "https://html.phoenixcoded.net/light-able/bootstrap/assets/images/application/img-prod-6.jpg",
        //     price: 299,
        //     oldPrice: 399,
        //     rating: 4.5,
        //     discount: 30,
        // },
        // {
        //     id: 7,
        //     title: "Red Sneakers",
        //     image: "https://html.phoenixcoded.net/light-able/bootstrap/assets/images/application/img-prod-7.jpg",
        //     price: 299,
        //     oldPrice: 399,
        //     rating: 4.5,
        //     discount: 10,
        // },
        // {
        //     id: 8,
        //     title: "White Wedding Heels",
        //     image: "https://html.phoenixcoded.net/light-able/bootstrap/assets/images/application/img-prod-8.jpg",
        //     price: 299,
        //     oldPrice: 399,
        //     rating: 4.5,
        //     discount: 50,
        // },
        // {
        //     id: 9,
        //     title: "Pink Boots",
        //     image: "https://html.phoenixcoded.net/light-able/bootstrap/assets/images/application/img-prod-9.jpg",
        //     price: 299,
        //     oldPrice: 399,
        //     rating: 4.5,
        //     discount: 0,
        // },
    ];

    return (
        <div className="mt-8 bg-white shadow-md p-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
