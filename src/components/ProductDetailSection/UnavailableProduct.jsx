// components/ProductDetailSection/UnavailableProduct.jsx
export default function UnavailableProduct({ statusCode = 404 }) {
  return (
    <div className="w-full max-w-3xl mx-auto py-12 px-4 text-center">
      <div className="bg-yellow-100 border border-yellow-300 rounded-md p-6">
        <p className="text-yellow-800 text-xl font-semibold flex items-center justify-center gap-2">
          ⚠️ This product is currently unavailable on Upfrica
        </p>
        <p className="mt-2 text-gray-700">
          Due to platform or policy guidelines, this product cannot be displayed or purchased at this time.
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-block bg-white border border-gray-300 rounded-lg px-5 py-2 text-purple-600 font-medium hover:underline"
          >
            Continue shopping
          </a>
        </div>
        <p className="text-sm text-gray-400 mt-4">Error code: {statusCode}</p>
      </div>
    </div>
  );
}