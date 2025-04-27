


'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { AiOutlineLeft, AiOutlineRight, AiOutlineCheck } from 'react-icons/ai'

const PAGE_SIZE = 20

////////////////////////////////////////////////////////////////////////////////
// Pagination component
////////////////////////////////////////////////////////////////////////////////
function Pagination({ currentPage, totalPages, onPageChange }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page)
    }
  }

  const getPageNumbers = () => {
    if (isMobile) {
      if (totalPages <= 2) return [1, ...(totalPages === 2 ? [2] : [])]
      return [1, 2, '...']
    }
    if (totalPages <= 5) {
      return [...Array(totalPages).keys()].map((i) => i + 1)
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages]
    }
    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
  }

  return (
    <div className="mt-8 flex justify-center overflow-x-auto">
      <div className="inline-flex items-center space-x-2 whitespace-nowrap px-2">
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 flex items-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
        >
          <AiOutlineLeft className="mr-1" />
          <span>Prev</span>
        </button>

        {getPageNumbers().map((page, i) =>
          typeof page === 'number' ? (
            <button
              key={i}
              onClick={() => handlePageClick(page)}
              className={`px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 ${page === currentPage
                  ? 'bg-violet-700 text-white font-semibold'
                  : ''
                }`}
            >
              {page}
            </button>
          ) : (
            <span key={i} className="px-3 py-1 text-gray-500">
              …
            </span>
          )
        )}

        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 flex items-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
        >
          <span>Next</span>
          <AiOutlineRight className="ml-1" />
        </button>
      </div>
    </div>
  )
}

////////////////////////////////////////////////////////////////////////////////
// Orders list page
////////////////////////////////////////////////////////////////////////////////
export default function OrdersPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = useSelector((state) => state.auth.token)

  const pageParam = parseInt(searchParams.get('page') || '1', 10)
  const [orders, setOrders] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!token) return
    setLoading(true)
    fetch(
      `https://media.upfrica.com/api/buyer/orders/?page=${pageParam}`,
      {
        headers: { Authorization: `Token ${token}` },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => {
        setOrders(data.results)
        setCount(data.count)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [token, pageParam])

  const totalPages = Math.ceil(count / PAGE_SIZE)
  const statuses = ['Ordered', 'Processing', 'Shipped', 'Delivered']

  const handlePageChange = (page) => {
    router.push(`/orders?page=${page}`)
  }

  if (loading)
    return <p className="p-6 text-center text-gray-500">Loading…</p>
  if (error)
    return (
      <p className="p-6 text-center text-red-600">
        Error fetching orders: {error}
      </p>
    )

  return (
    <main className="space-y-8 max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => {
          const placedDate = new Date(order.created_at)
          const formattedPlaced = placedDate.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })

          // dummy: assume all orders currently in "Processing" (index 1)
          const currentStepIndex = 1
          const progressPercent = ((currentStepIndex + 1) / statuses.length) * 100

          return (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow p-6 space-y-6"
            >
              {/* header */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">
                    Order #{String(order.id).padStart(5, '0')}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Placed{' '}
                    <time dateTime={order.created_at}>
                      {formattedPlaced}
                    </time>
                  </p>
                </div>
                <a
                  href={`/dashboard/all-orders/${order.id}/`}
                  className="text-indigo-600 hover:underline text-sm font-medium"
                >
                  View details&nbsp;→
                </a>
              </div>

              {/* products thumbnail */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {order.order_items.map((item) => (
                  <div
                    key={item.id}
                    className="flex space-x-3 items-center"
                  >
                    <img
                      src={item.product.product_images[0]}
                      alt={item.product.title}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div>
                      <h3 className="text-sm font-medium">
                        {item.product.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        ${(item.price_cents / 100).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* delivery & shipping */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
                <dl className="space-y-1">
                  <dt className="font-medium">Delivery address</dt>
                  <dd>Floyd Miles</dd>
                  <dd>7363 Cynthia Pass</dd>
                  <dd>Toronto, ON N3Y 4H8</dd>
                </dl>
                <dl className="space-y-1">
                  <dt className="font-medium">Shipping updates</dt>
                  <dd>f•••@example.com</dd>
                  <dd>1•••••••••40</dd>
                  <button className="mt-2 text-indigo-600 hover:underline text-xs font-medium">
                    Edit
                  </button>
                </dl>
              </div>

              {/* status bar */}
              <div>
                <h4 className="text-sm font-medium mb-1">Status</h4>
                <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-1">
                  {statuses.map((status, idx) => (
                    <span
                      key={status}
                      className={`flex items-center ${idx === currentStepIndex
                          ? 'text-indigo-600 font-semibold'
                          : 'text-gray-500'
                        }`}
                    >
                      {idx === currentStepIndex && (
                        <AiOutlineCheck className="mr-1  h-4 w-4 stroke-4"   style={{ strokeWidth: 2 }} />
                      )}
                      {status}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={pageParam}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </main>
  )
}
