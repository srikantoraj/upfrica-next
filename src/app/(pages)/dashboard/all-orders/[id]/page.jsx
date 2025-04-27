'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
// import { AiFillCheck } from 'react-icons/ai'

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
        const res = await fetch(`https://media.upfrica.com/api/buyer/orders/${id}/`, {
          method: 'GET',
          headers: myHeaders
        })
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

  if (loading) return <div className="p-6 text-center">Loading…</div>
  if (!order) return <div className="p-6 text-center text-red-500">Failed to load order.</div>

  const steps = ['Order placed', 'Processing', 'Shipped', 'Delivered']

  return (
    <main className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg">
      {/* header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Order #{order.id}</h1>
        <time className="text-sm text-gray-600" dateTime={order.created_at}>
          Placed on {new Date(order.created_at).toLocaleDateString()}
        </time>
      </header>

      {/* status timeline */}
      <div className="relative mb-10">
        {/* horizontal line */}
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-1 bg-gray-200" />
        </div>
        {/* steps */}
        <div className="relative z-10 flex justify-between">
          {steps.map((label, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => setCurrentStep(idx)}
            >
              <div
                className={`
                  w-8 h-8 flex items-center justify-center rounded-full
                  ${idx === currentStep ? 'bg-violet-700 text-white' : 'bg-gray-200 text-gray-500'}
                `}
              >
                {/* {idx === currentStep && <AiFillCheck className="h-5 w-5" />} */}
              </div>
              <span className="mt-2 text-sm text-center">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* products */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {order.order_items.map(item => (
            <div key={item.id} className="flex bg-gray-50 p-4 rounded-lg shadow">
              <img
                src={item.product.product_images[0]}
                alt={item.product.title}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="ml-4 flex-1">
                <h3 className="font-semibold">{item.product.title}</h3>
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
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Delivery address</h2>
        <address className="not-italic text-gray-700 space-y-1">
          <div>Floyd Miles</div>
          <div>7363 Cynthia Pass</div>
          <div>Toronto, ON N3Y 4H8</div>
        </address>
      </section>

      {/* shipping updates */}
      <section className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Shipping updates</h2>
          <button className="text-sm text-violet-700 hover:underline">Edit</button>
        </div>
        <p className="text-gray-700">f•••@example.com</p>
        <p className="text-gray-700">1•••••••••40</p>
      </section>
    </main>
  )
}
