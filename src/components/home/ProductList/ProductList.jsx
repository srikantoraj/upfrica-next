// app/components/ProductList.jsx
import ProductListClient from './ProductListClient';
import { BASE_API_URL } from '@/app/constants';

export default async function ProductList({ title }) {
  try {
    const res = await fetch(`${BASE_API_URL}/api/products/`, {
      next: { revalidate: 120 }, // ISR: revalidate every 2 mins
    });

    if (!res.ok) {
      const errorText = await res.text();
      return (
        <div className="container mx-auto p-4">
          <h1 className="text-xl font-bold text-red-600">Error fetching products</h1>
          <p className="text-base">Status Code: {res.status}</p>
          <pre className="text-sm bg-gray-100 p-2">{errorText}</pre>
        </div>
      );
    }

    const data = await res.json();
    return <ProductListClient title={title} productsData={data} />;
  } catch (err) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold text-red-600">Network Error</h1>
        <p className="text-base">Unable to fetch products.</p>
        <pre className="text-sm bg-gray-100 p-2">{err.message}</pre>
      </div>
    );
  }
}