"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { MdCheck, MdChat } from "react-icons/md";
import {
  AiOutlineArrowLeft,
  AiOutlineHome,
  AiOutlineMail,
  AiOutlinePhone,
} from "react-icons/ai";

const STATUSES = ["Ordered", "Processing", "Shipped", "Received"];

function OrderDetailsSkeleton() {
  return (
    <main className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow space-y-8 animate-pulse">
      {/* header */}
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>

      {/* two seller sections */}
      {Array.from({ length: 2 }).map((_, s) => (
        <section key={s} className="space-y-6 border-b border-gray-200 pb-6">
          {/* seller header */}
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>

          {/* products */}
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center bg-gray-50 p-4 rounded-lg"
            >
              <div className="w-24 h-24 bg-gray-300 rounded"></div>
              <div className="ml-4 flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              </div>
              <div className="w-24 h-8 bg-gray-300 rounded-full"></div>
            </div>
          ))}

          {/* status bar */}
          <div className="relative">
            <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 rounded"></div>
            <div className="relative flex justify-between z-10">
              {STATUSES.map((_, i) => (
                <div key={i} className="w-8 h-8 bg-gray-300 rounded-full"></div>
              ))}
            </div>
            <div className="relative flex justify-between mt-2 text-sm text-center">
              {STATUSES.map((_, i) => (
                <div key={i} className="w-16 h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* address & contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-200">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function OrderDetails({ params }) {
  const { id } = params;
  const router = useRouter();
  const token = useSelector((state) => state.auth.token);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statuses, setStatuses] = useState({});
  const [loadingReceive, setLoadingReceive] = useState({});

  // fetch order
  useEffect(() => {
    if (!token) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.upfrica.com/api/buyer/orders/${id}/`,
          { headers: { Authorization: `Token ${token}` } },
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, token]);

  // init statuses
  useEffect(() => {
    if (!order) return;
    const init = {};
    order.order_items.forEach((item) => {
      const sid = item.product.user;
      if (!(sid in init)) {
        init[sid] = item.receive_status === 1 ? STATUSES.length - 1 : 0;
      }
    });
    setStatuses(init);
  }, [order]);

  // handle receive
  const handleReceive = async (sellerId) => {
    if (statuses[sellerId] === STATUSES.length - 1) return;
    if (
      !window.confirm("Confirm you have received all items from this seller.")
    ) {
      return;
    }
    setLoadingReceive((p) => ({ ...p, [sellerId]: true }));
    try {
      const items = order.order_items.filter(
        (i) => i.product.user === sellerId,
      );
      const headers = new Headers({
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      });
      const body = JSON.stringify({ receive_status: 1 });
      await Promise.all(
        items.map((it) =>
          fetch(`https://api.upfrica.com/api/buyer/order-item/${it.id}/`, {
            method: "PATCH",
            headers,
            body,
          }).then((r) => {
            if (!r.ok) throw new Error(`Item ${it.id} failed`);
            return r.json();
          }),
        ),
      );
      setStatuses((p) => ({ ...p, [sellerId]: STATUSES.length - 1 }));
      alert("Items marked as received.");
    } catch (err) {
      console.error(err);
      alert("Failed to mark received: " + err.message);
    } finally {
      setLoadingReceive((p) => ({ ...p, [sellerId]: false }));
    }
  };

  if (loading) return <OrderDetailsSkeleton />;
  if (!order) {
    return (
      <div className="p-6 text-center text-red-600">Unable to load order.</div>
    );
  }

  // group by seller
  const bySeller = order.order_items.reduce((acc, item) => {
    const sid = item.product.user;
    (acc[sid] ||= []).push(item);
    return acc;
  }, {});

  return (
    <main className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow space-y-8">
      {/* back + header */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => router.push("/dashboard/all-orders")}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <AiOutlineArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">
          Order #{String(order.id).padStart(6, "0")}
        </h1>
      </div>

      {Object.entries(bySeller).map(([sellerId, items]) => {
        const idx = statuses[sellerId] ?? 0;
        return (
          <section
            key={sellerId}
            className="space-y-6 border-b border-gray-200 pb-6"
          >
            {/* header */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Seller #{sellerId}</h2>
              <button
                // onClick={() => router.push(`/chat/${sellerId}`)}
                className="flex items-center space-x-1 px-4 py-2 bg-violet-600 text-white rounded-full hover:bg-violet-700 transition"
              >
                <MdChat size={18} />
                <span>Contact Seller</span>
              </button>
            </div>

            {/* products */}
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm"
                >
                  <img
                    src={item.product.product_images[0]}
                    alt={item.product.title}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-lg">
                      {item.product.title}
                    </h3>
                    <p className="text-gray-700 mt-1">
                      ${(item.price_cents / 100).toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <button
                    onClick={() => handleReceive(item.product.user)}
                    disabled={
                      statuses[item.product.user] === STATUSES.length - 1 ||
                      loadingReceive[item.product.user]
                    }
                    className={`px-4 py-2 rounded-full font-medium transition ${statuses[item.product.user] === STATUSES.length - 1
                        ? "bg-gray-300 text-gray-600 cursor-default"
                        : "bg-violet-600 text-white hover:bg-violet-700"
                      }`}
                  >
                    {loadingReceive[item.product.user]
                      ? "Receiving…"
                      : statuses[item.product.user] === STATUSES.length - 1
                        ? "Received"
                        : "Mark Received"}
                  </button>
                </div>
              ))}
            </div>

            {/* status bar */}
            <div className="relative my-6">
              <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 rounded"></div>
              <div className="relative flex justify-between z-10">
                {STATUSES.map((_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${i <= idx
                          ? "bg-violet-600 text-white"
                          : "bg-gray-200 text-gray-400"
                        }`}
                    >
                      {i <= idx && <MdCheck />}
                    </div>
                  </div>
                ))}
              </div>
              <div className="relative flex justify-between mt-2 text-sm text-center">
                {STATUSES.map((label, i) => (
                  <span key={i} className="w-16">
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* address & contact */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-200">
        <div className="flex items-start space-x-3">
          <AiOutlineHome size={24} className="text-violet-600 mt-1" />
          <div>
            <h4 className="font-semibold">Delivery Address</h4>
            <p className="text-gray-700">
              {order.address.address_data.address_line_1}
              {order.address.address_data.address_line_2 &&
                `, ${order.address.address_data.address_line_2}`}
            </p>
            <p className="text-gray-700">
              {order.address.address_data.local_area},{" "}
              {order.address.address_data.town}
            </p>
            <p className="text-gray-700">
              {order.address.address_data.country}
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <AiOutlineMail size={24} className="text-violet-600" />
            <span className="text-gray-700">{order.buyer.email}</span>
          </div>
          <div className="flex items-center space-x-3">
            <AiOutlinePhone size={24} className="text-violet-600" />
            <span className="text-gray-700">
              {order.address.address_data.phone_number}
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
