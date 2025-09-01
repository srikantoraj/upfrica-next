"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { BASE_API_URL } from "@/app/constants";
import DeliveryTracker from "../components/DeliveryTracker";
import { AiOutlineHome, AiOutlineUser, AiOutlinePhone } from "react-icons/ai";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const token = useSelector((state) => state.auth.token);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullInfo, setShowFullInfo] = useState(false);

  // modal + form state
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [form, setForm] = useState({
    shipping_carrier: "",
    tracking_number: "",
    tracking_link: "",
    additional_info: "",
    // default dispatch time is now
    date_dispatched: new Date().toISOString().slice(0, 16),
    // 0 = not dispatched, 1 = dispatched
    dispatch_status: 0,
  });

  // fetch order
  useEffect(() => {
    if (!token || !id) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${BASE_API_URL}/api/seller/order-items/${id}/`,
          { headers: { Authorization: `Token ${token}` } },
        );
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, token]);

  // whenever order loads, seed the dispatch form
  useEffect(() => {
    if (!order) return;
    setForm({
      shipping_carrier: order.shipping_carrier || "",
      tracking_number: order.tracking_number || "",
      tracking_link: order.tracking_link || "",
      additional_info: order.additional_info || "",
      // if already dispatched, show that time; otherwise default to now
      date_dispatched: order.date_dispatched
        ? new Date(order.date_dispatched).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16),
      dispatch_status: order.dispatch_status || 0,
    });
  }, [order]);

  const openModal = () => setShowDispatchModal(true);
  const closeModal = () => setShowDispatchModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "dispatch_status" ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // build payload
    const payload = {
      dispatch_status: form.dispatch_status,
      date_dispatched: new Date(form.date_dispatched).toISOString(),
      shipping_carrier: form.shipping_carrier,
      tracking_number: form.tracking_number,
      tracking_link: form.tracking_link,
      additional_info: form.additional_info,
    };
    try {
      const res = await fetch(`${BASE_API_URL}/api/seller/order-items/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Update failed: ${res.status}`);
      const updated = await res.json();
      setOrder(updated);
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Failed to update dispatch info.");
    }
  };

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (!order)
    return <div className="text-center text-red-600 p-6">Order not found.</div>;

  const item = order;
  const product = order.product;

  return (
    <div className="bg-white shadow rounded-xl p-4 max-w-3xl mx-auto ">
      {/* Top Status Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-0 bg-gray-50 p-4 rounded-md">
        <div>
          <p className="text-green-700 font-bold text-lg">
            ✅ {item?.dispatch_status === 1 ? "Dispatched" : "Processing"}
          </p>
          <div className="text-sm mt-1 text-gray-700">
            <p>
              <strong>Order #</strong> {String(order.id).padStart(6, "0")}
            </p>
            <p>
              <strong>Order date #</strong>{" "}
              {new Date(order.order_date).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:items-end sm:text-right">
          {/* dispatch tick mark (readonly) */}

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={openModal}
              className="w-full sm:w-auto h-8 upfrica-btn-primary-outline-sm text-green-700"
            >
              Mark as Dispatch
            </button>
            {/* <button className="w-full sm:w-auto h-8 upfrica-btn-primary-outline-sm text-green-700">
              Write a review
            </button> */}
          </div>
        </div>
      </div>

      {/* Dispatch Modal */}
      {showDispatchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="relative bg-white rounded-lg p-6 w-full max-w-md space-y-4"
          >
            {/* close icon */}
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-2 right-2 text-2xl font-bold text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>

            <h2 className="text-xl font-semibold">Dispatch Info</h2>

            {/* dispatch status options */}
            <div className="flex items-center gap-6">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="dispatch_status"
                  value={0}
                  checked={form.dispatch_status === 0}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span className="ml-2 text-sm">Not Dispatched</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="dispatch_status"
                  value={1}
                  checked={form.dispatch_status === 1}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span className="ml-2 text-sm">Dispatched</span>
              </label>
            </div>

            <div>
              <label className="block text-sm">Carrier</label>
              <select
                name="shipping_carrier"
                value={form.shipping_carrier}
                onChange={handleChange}
                className="mt-1 block w-full border rounded px-2 py-1"
              >
                <option value="">Select Carrier</option>
                <option value="Local rider">Local rider</option>
                <option value="Customer collected">Customer collected</option>
                <option value="Bot">Bot</option>
                <option value="DHL">DHL</option>
                <option value="Post office">Post office</option>
                <option value="Public transport">Public transport</option>
                <option value="Uber">Uber</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm">Tracking Number</label>
              <input
                name="tracking_number"
                value={form.tracking_number}
                onChange={handleChange}
                className="mt-1 block w-full border rounded px-2 py-1"
              />
            </div>

            <div>
              <label className="block text-sm">Tracking Link</label>
              <input
                name="tracking_link"
                value={form.tracking_link}
                onChange={handleChange}
                className="mt-1 block w-full border rounded px-2 py-1"
              />
            </div>

            <div>
              <label className="block text-sm">Additional Info</label>
              <textarea
                name="additional_info"
                value={form.additional_info}
                onChange={handleChange}
                className="mt-1 block w-full border rounded px-2 py-1"
              />
            </div>

            <div>
              <label className="block text-sm">Date Dispatched</label>
              <input
                type="datetime-local"
                name="date_dispatched"
                value={form.date_dispatched}
                onChange={handleChange}
                className="mt-1 block w-full border rounded px-2 py-1"
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-violet-600 rounded text-violet-600"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delivery Tracker */}
      <DeliveryTracker
        stage={item.dispatch_status === 1 ? 1 : 0}
        steps={[
          {
            label: "Ordered",
            date: new Date(order.order_date).toLocaleDateString(),
          },
          {
            label: "Dispatched",
            date: item.date_dispatched
              ? new Date(item.date_dispatched).toLocaleDateString()
              : "Soon",
          },
          {
            label: "Delivered",
            note: item.receive_status === 1 ? "Delivered" : "Not confirmed",
          },
        ]}
      />

      {/* Tracking */}
      {/* <div className="mt-4 text-sm space-y-1">
        <p><strong>Carrier:</strong> {order.shipping_carrier || "N/A"}</p>
        <p><strong>Tracking #:</strong> {order.tracking_number || "N/A"}</p>
        <p>
          <strong>Link:</strong>{" "}
          {order.tracking_link
            ? <a href={order.tracking_link} target="_blank" className="underline">View</a>
            : "N/A"}
        </p>
        <p><strong>Additional info:</strong> {order.additional_info || "N/A"}</p>
      </div> */}

      {/* Tracking */}
      <div className="mt-4 bg-gray-50 p-4 text-sm rounded-md">
        <h4 className="font-medium text-gray-700 mb-2">Tracking Info:</h4>
        <div className="space-y-2">
          {/* Row 1 */}
          <div className="flex space-x-6">
            <div>
              <strong>Carrier:</strong> {order.shipping_carrier || "N/A"}
            </div>
            <div>
              <strong>Tracking #:</strong> {order.tracking_number || "N/A"}
            </div>
          </div>
          {/* Row 2 */}
          <div className="flex space-x-6">
            <div>
              <strong>Link:</strong>{" "}
              {order.tracking_link ? (
                <a
                  href={order.tracking_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  View
                </a>
              ) : (
                "N/A"
              )}
            </div>
            <div>
              <strong>Additional info:</strong> {order.additional_info || "N/A"}
            </div>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-6">
        <h3 className="font-semibold text-lg mb-2">Item info</h3>
        <div className="flex items-start gap-4">
          <img
            src={product?.product_images?.[0] || "/placeholder.png"}
            alt={product?.title}
            className="w-20 h-20 object-cover rounded-md"
          />
          <div>
            <p className="font-medium">{product.title}</p>
            <p className="text-sm">Seller item no.: {product.id}</p>
            <p className="text-sm">
              {item?.price_currency} {(item.price_cents / 100).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">
              Returns accepted until 12 May
            </p>
          </div>
        </div>
      </div>

      {/* Delivery & Payment */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
        <div>
          <h4 className="font-semibold mb-1">Delivery info</h4>
          <div className="flex items-center gap-2 text-gray-700">
            <AiOutlineHome />
            <span>
              {showFullInfo
                ? order.address.address_data.address_line_1
                : `${order.address.address_data.town}, ${order.address.address_data.country}`}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 mt-1">
            <AiOutlineUser />
            <span>
              {showFullInfo
                ? `${order.buyer.first_name} ${order.buyer.last_name}`
                : `${order.buyer.first_name} ${order.buyer.last_name[0]}.`}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 mt-1">
            <AiOutlinePhone />
            <span>
              {showFullInfo
                ? order.address.address_data.phone_number
                : "+233 *** ****"}
            </span>
          </div>
          <button
            onClick={() => setShowFullInfo(!showFullInfo)}
            className="text-purple-600 underline mt-2 text-sm"
          >
            {showFullInfo ? "Hide full address" : "View full address"}
          </button>
        </div>

        <div>
          <h4 className="font-semibold mb-1">
            Payment method # {order.payment_method || "N/A"}
          </h4>

          <p>
            1 item &nbsp;&nbsp;&nbsp;&nbsp; +
            {(item.price_cents / 100).toFixed(2)}
          </p>
          <p>Order Quantity # &nbsp;&nbsp;&nbsp;&nbsp; {item.quantity}</p>
          <p>Discount &nbsp;&nbsp;&nbsp;&nbsp; -0.00</p>
          <p>Postage &nbsp;&nbsp;&nbsp;&nbsp; 0.00</p>
          <p className="font-semibold">
            Total &nbsp;&nbsp;&nbsp;&nbsp; GHS{" "}
            {((item.price_cents * item.quantity) / 100).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
