'use client'

import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'

export default function PaymentSuccess({ searchParams }) {
  const orderId = searchParams.order_id
  const token = useSelector(state => state.auth.token)
  const router = useRouter()

  const [order, setOrder] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDrawer, setShowDrawer] = useState(false)

  useEffect(() => {
    if (!orderId) {
      setLoading(false)
      return
    }

    async function loadOrder() {
      try {
        const res = await fetch(
          `https://media.upfrica.com/api/buyer/orders/${orderId}/`,
          {
            headers: {
              Authorization: `Token ${token}`,
              'Content-Type': 'application/json',
            },
            cache: 'no-store',
          }
        )
        if (!res.ok) throw new Error(res.statusText)
        const data = await res.json()
        setOrder(data)
      } catch (err) {
        setError(err.message || 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [orderId, token])

  useEffect(() => {
    if (!loading && order && !error) {
      setShowDrawer(true)
    }
  }, [loading, order, error])

  if (loading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <p className="text-lg text-gray-600">Loading your order…</p>
      </div>
    )
  }

  if (!orderId) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-2xl font-semibold text-red-600">
          No order ID provided
        </h1>
        <p className="mt-4 text-gray-700">
          Please check your payment confirmation link.
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-2xl font-semibold text-red-600">
          Something went wrong
        </h1>
        <p className="mt-4 text-gray-700">{error}</p>
      </div>
    )
  }

  return (
    <>
      <OrderConfirmationDrawer
        isOpen={showDrawer}
        onClose={() => { setShowDrawer(false); router.push('/') }}
        order={order}
        router={router}
      />
    </>
  )
}

function OrderConfirmationDrawer({ isOpen, onClose, order, router }) {
  if (!order) return null

  return (
    <div
      id="orderConfirmationDrawer"
      className={`
        fixed inset-0 z-50 flex items-start justify-center overflow-auto
        bg-black bg-opacity-40 transition-opacity
        ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-label"
      tabIndex={-1}
    >
      <div
        className="
          my-10 w-full
                  /* base: up to ~28rem */
          sm:max-w-lg      /* ≥640px: ~32rem */
          md:max-w-lg      /* ≥768px: ~36rem */
          lg:max-w-lg    /* ≥1024px: ~42rem */
          xl:max-w-3xl     /* ≥1280px: ~48rem */
          h-[95vh] bg-white rounded-lg shadow-lg flex flex-col
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4 flex-shrink-0">
          <h2 id="drawer-label" className="text-xl font-semibold">
            Order confirmation
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="px-6 py-4 overflow-y-auto flex-1">
          {/* Success Message */}
          <div className="flex items-center space-x-3 mb-4">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h3 className="text-lg font-medium">Thanks for your order!</h3>
          </div>
          <p className="mb-6 text-gray-600">
            Your order will be processed within 24 hours during working days. We will notify you by email once it’s shipped.
          </p>

          {/* Order Summary */}
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Order Summary</h3>
          <Detail label="Order number" value={`#${order.id}`} />
          <Detail label="Buyer ID" value={order.buyer} />
          <Detail label="Shipping Addr. ID" value={order.address} />
          <Detail
            label="Total Paid"
            value={`${(order.total_fee_cents / 100).toFixed(2)} ${order.total_fee_currency.toUpperCase()}`}
          />
          <Detail
            label="Order Date"
            value={new Date(order.created_at).toLocaleString()}
          />

          {/* Items Purchased */}
          <div className="mt-6 bg-gray-50 p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Items Purchased</h3>
            <div className="space-y-4">
              {order.order_items.map(item => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img
                    src={item.product.product_images[0]}
                    alt={item.product.title}
                    className="w-16 h-16 object-cover rounded-md border"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{item.product.title}</p>
                    <p className="text-gray-700">Qty: {item.quantity}</p>
                    <p className="text-gray-700">
                      ${(item.price_cents / 100).toFixed(2)} {item.product.price_currency.toUpperCase()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer & Delivery Details */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Customer & Delivery</h3>
            <Detail label="Payment Method" value={order.payment_method || '—'} />
            <Detail label="Name" value={order.buyer_name || order.buyer} />
            <Detail label="Address" value={order.shipping_address || order.address} />
            <Detail label="Phone" value={order.buyer_phone || '—'} />
            <Detail label="Email" value={order.buyer_email || '—'} />
            <Detail label="Estimated Delivery" value={order.estimated_delivery || '—'} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 border-t px-6 py-3 flex-shrink-0 bg-white">
          
        
           
            <button
              onClick={()=>router.push(`/dashboard/all-orders/${order.id}`)}
              className="btn-base btn-primary w-full py-3" >
              Track your order
            </button>  
         
          <button
            onClick={() => router.push('/')}
            className="btn-base btn-outline w-full py-3">
            Return to shopping
          </button>
        </div>
      </div>
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <dl className="flex justify-between text-gray-700 py-1">
      <dt className="font-medium">{label}</dt>
      <dd>{value}</dd>
    </dl>
  )
}

