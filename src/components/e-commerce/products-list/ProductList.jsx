'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import Pagination from '@/components/Pagination';

const DEFAULT_PAGE_SIZE = 10;
const SKELETON_ROWS = 10;
const DEBOUNCE_DELAY = 500;

export default function ProductList() {
  const { user, token } = useSelector(state => state.auth);
  const router = useRouter();

  // pagination & search
  const [perPage, setPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // data & loading
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // alerts
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [deletingId, setDeletingId] = useState(null);

  // Debounce the input before committing to searchQuery
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setCurrentPage(1);
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Fetch (or search) whenever token, page, perPage or searchQuery changes
  useEffect(() => {
    if (!token) return;

    setLoading(true);

    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Token ${token}`);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    const base = 'https://media.upfrica.com/api/seller/products';
    const params = new URLSearchParams({
      page: String(currentPage),
      page_size: String(perPage),
    });

    let url;
    if (searchQuery) {
      params.append('q', searchQuery);
      url = `${base}/search/?${params.toString()}`;
    } else {
      url = `${base}/?${params.toString()}`;
    }

    fetch(url, requestOptions)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(data => {
        setProducts(data.results || []);
        setTotalPages(Math.ceil((data.count || 0) / perPage));
      })
      .catch(err => {
        console.error(err);
        setAlert({ type: 'error', message: 'Could not load products.' });
      })
      .finally(() => setLoading(false));
  }, [token, currentPage, perPage, searchQuery]);

  // navigation & delete handlers
  const handleView = slug => router.push(`/products/${slug}`);
  const handleEdit = slug => router.push(`/products/edit/${slug}`);

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    setDeletingId(id);
    try {
      const res = await fetch(
        `https://media.upfrica.com/api/seller/products/${id}/`,
        {
          method: 'DELETE',
          headers: { Authorization: `Token ${token}` },
        }
      );
      if (!res.ok) throw new Error('Failed to delete product');
      setProducts(prev => prev.filter(p => p.id !== id));
      setAlert({ type: 'success', message: 'Product deleted successfully.' });
    } catch (err) {
      console.error(err);
      setAlert({ type: 'error', message: 'Could not delete product.' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Header + Search */}
        <header className="flex items-center space-x-6 mb-6">
          <div>
            <h1 className="text-3xl font-semibold">Hi {user?.username}</h1>
            <p className="text-gray-600">Welcome to seller dashboard</p>
          </div>
          <div className="relative flex-1 max-w-full">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products…"
              className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
          </div>
        </header>

        {/* Alert */}
        {alert.message && (
          <div
            className={`mb-4 px-4 py-3 border rounded ${alert.type === 'success'
                ? 'bg-green-100 border-green-400 text-green-700'
                : 'bg-red-100 border-red-400 text-red-700'
              }`}
          >
            <span>{alert.message}</span>
            <button
              onClick={() => setAlert({ type: '', message: '' })}
              className="float-right font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Table */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">All Products</h2>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>

          <table className="w-full table-fixed text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="w-[35%] pb-2">Product Info</th>
                <th className="w-[10%] pb-2">Date Added</th>
                <th className="w-[10%] pb-2">Price</th>
                <th className="w-[10%] pb-2">Status</th>
                <th className="w-[10%] pb-2">Viewed</th>
                <th className="w-[10%] pb-2">Sold</th>
                <th className="w-[15%] pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: SKELETON_ROWS }).map((_, idx) => (
                  <tr key={idx} className="even:bg-gray-50 animate-pulse">
                    <td className="py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded" />
                        <div className="flex-1 max-w-[40%]">
                          <div className="h-4 bg-gray-200 mb-2 rounded w-3/4" />
                          <div className="h-3 bg-gray-200 rounded w-1/2" />
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="h-4 bg-gray-200 rounded w-24 mx-auto" />
                    </td>
                    <td className="py-3">
                      <div className="h-4 bg-gray-200 rounded w-16 mx-auto" />
                    </td>
                    <td className="py-3">
                      <div className="h-4 bg-gray-200 rounded w-20 mx-auto" />
                    </td>
                    <td className="py-3">
                      <div className="h-4 bg-gray-200 rounded w-12 mx-auto" />
                    </td>
                    <td className="py-3">
                      <div className="h-4 bg-gray-200 rounded w-12 mx-auto" />
                    </td>
                    <td className="py-3">
                      <div className="h-4 bg-gray-200 rounded w-20 mx-auto" />
                    </td>
                  </tr>
                ))
                : products.length > 0
                  ? products.map(p => (
                    <tr key={p.id} className="even:bg-gray-50">
                      <td className="py-3">
                        <div className="flex items-center space-x-3">
                          {p.product_images?.[0] && (
                            <img
                              src={p.product_images[0]}
                              alt={p.title}
                              className="w-20 h-20 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <div>{p.title}</div>
                            <div className="text-gray-500 text-sm">
                              SKU: {p.u_pid}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        {(p.price_cents / 100).toFixed(2)} {p.price_currency}
                      </td>
                      <td className="py-3">
                        <span
                          className={
                            p.status === 1 ? 'text-green-600' : 'text-red-600'
                          }
                        >
                          {p.status === 1 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="py-3">{p.impressions_count ?? 0}</td>
                      <td className="py-3">{p.likes ?? 0}</td>
                      <td className="py-3 space-x-4">
                        <button
                          onClick={() => handleView(p.slug)}
                          title="View"
                        >
                          <FaEye className="h-4 w-4 text-[#2B3F6C]" />
                        </button>
                        <button
                          onClick={() => handleEdit(p.slug)}
                          title="Edit"
                        >
                          <FaEdit className="h-4 w-4 text-[#2B3F6C]" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deletingId === p.id}
                          title="Delete"
                          className={`transition duration-300 ${deletingId === p.id
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
                            }`}
                        >
                          <FaTrash className="h-4 w-4 text-[#2B3F6C]" />
                        </button>
                      </td>
                    </tr>
                  ))
                  : (
                    <tr>
                      <td colSpan={7} className="py-4 text-center text-gray-500">
                        No products found.
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
