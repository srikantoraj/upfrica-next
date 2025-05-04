
// /app/components/ProductList.server.jsx
import ProductListClient from './ProductListClient';

export default async function ProductList({ title }) {
  const res = await fetch("https://media.upfrica.com/api/products/", {
    next: { revalidate: 120 }, // Revalidate every 2 minutes
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

  // console.log(' product list data',data);
  

  // Pass the fetched data (including exchange_rates) as props to the client component
  return <ProductListClient title={title} productsData={data} />;
}
