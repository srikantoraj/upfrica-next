'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MdCheck } from 'react-icons/md'

export default function Order({ params }) {
  const { id } = params
  const router = useRouter()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const myHeaders = new Headers()
        myHeaders.append('Authorization', 'Token aSJ36UapeFH5YARFamDTYhnJ')
        const res = await fetch(
          `https://media.upfrica.com/api/buyer/orders/${id}/`,
          { method: 'GET', headers: myHeaders }
        )
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setOrder(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  const steps = ['Order placed', 'Processing', 'Shipped', 'Delivered']
  const lastStepIndex = steps.length - 1

  if (loading) {
    return (
      <div className="p-6 text-center">Loading…</div>
    )
  }

  if (!order) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load order.
      </div>
    )
  }

  const handleStepClick = (idx) => {
    if (idx <= lastStepIndex) setCurrentStep(idx)
  }

  const markDelivered = async () => {
    try {
      await fetch(
        `https://media.upfrica.com/api/buyer/orders/${id}/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token aSJ36UapeFH5YARFamDTYhnJ',
          },
          body: JSON.stringify({ status: 'delivered' }),
        }
      )
      setCurrentStep(lastStepIndex)
    } catch (err) {
      console.error('Failed to mark delivered:', err)
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg space-y-8">
      {/* header */}
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Order #{order.id}</h1>
        <time
          className="text-sm text-gray-600"
          dateTime={order.created_at}
        >
          Placed on {new Date(order.created_at).toLocaleDateString()}
        </time>
      </header>

      {/* status timeline */}
      <div className="relative mb-10">
        {/* 1) horizontal line exactly at circle-center */}
        <div className="absolute inset-x-0" style={{ top: '1rem' /* half of circle height = 8px /2 = 4px, but using rem to align */ }}>
          <div className="h-1 bg-gray-200 w-full rounded" />
        </div>

        {/* 2) circles row (fixed height = 2rem = 32px so center is at 1rem) */}
        <div className="relative z-10 flex justify-between items-center h-8">
          {steps.map((label, idx) => {
            const isDone = idx < currentStep
            const isCurrent = idx === currentStep
            const circleClass = isDone
              ? 'bg-green-500 text-white'
              : isCurrent
                ? 'bg-violet-700 text-white'
                : 'bg-gray-200 text-gray-500'

            return (
              <div
                key={idx}
                className="flex flex-col items-center cursor-pointer"
                onClick={() => handleStepClick(idx)}
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full ${circleClass}`}
                >
                  {(isDone || isCurrent) && (
                    <MdCheck className="h-5 w-5 font-bold" />
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* 3) labels under circles */}
        <div className="relative z-10 flex justify-between mt-2 text-sm">
          {steps.map((label, idx) => (
            <span key={idx} className="text-center w-16">
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* “Mark as Delivered” button */}
      {currentStep < lastStepIndex && (
        <button
          onClick={markDelivered}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Mark as Delivered
        </button>
      )}

      {/* products */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {order.order_items.map((item) => (
            <div
              key={item.id}
              className="flex bg-gray-50 p-4 rounded-lg shadow"
            >
              <img
                src={item.product.product_images[0]}
                alt={item.product.title}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="ml-4 flex-1">
                <h3 className="font-semibold">
                  {item.product.title}
                </h3>
                <p className="text-gray-700 mt-1">
                  ${(item.product.price_cents / 100).toFixed(2)}
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  Qty: {item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* delivery address */}
      <section>
        <h2 className="text-lg font-semibold mb-2">
          Delivery address
        </h2>
        <address className="not-italic text-gray-700 space-y-1">
          <div>Floyd Miles</div>
          <div>7363 Cynthia Pass</div>
          <div>Toronto, ON N3Y 4H8</div>
        </address>
      </section>

      {/* shipping updates */}
      <section>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Shipping updates</h2>
          <button className="text-sm text-violet-700 hover:underline">
            Edit
          </button>
        </div>
        <p className="text-gray-700">f•••@example.com</p>
        <p className="text-gray-700">1•••••••••40</p>
      </section>
    </main>
  )
}
