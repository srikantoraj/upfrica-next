"use client";

import React, { useEffect, useState, useMemo } from "react";
import { CountryDropdown } from "react-country-region-selector";
import {
  AiOutlineClose,
} from "react-icons/ai";
import {
  FiTruck,
  FiCreditCard,
  FiEdit,
  FiPlus,
} from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";

const Checkout = () => {
  const { user, token } = useSelector((state) => state.auth);
  const router = useRouter();
  const cartId = useSearchParams().get("cart_id");

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [basket, setBasket] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load basket
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("basket")) || [];
    setBasket(stored);
  }, []);

  // Fetch addresses & pick default
  useEffect(() => {
    if (!token) return;
    fetch("https://media.upfrica.com/api/addresses/", {
      headers: { Authorization: `Token ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setAddresses(data);
        const def = data.find((a) => a.default) || data[0];
        setSelectedAddress(def?.id || null);
      })
      .catch(console.error);
  }, [token]);

  // Totals
  const subtotal = useMemo(
    () =>
      basket.reduce(
        (sum, i) => sum + (i.price_cents / 100) * i.quantity,
        0
      ),
    [basket]
  );
  const shippingCost = useMemo(() => {
    const bySeller = {};
    basket.forEach((i) => {
      const s = i.seller || "default";
      bySeller[s] = bySeller[s] || [];
      for (let n = 0; n < i.quantity; n++) {
        bySeller[s].push({
          primary: i.postage_fee / 100,
          secondary: i.secondary_postage_fee / 100,
        });
      }
    });
    return Object.values(bySeller).reduce((sum, units) => {
      if (!units.length) return sum;
      if (units.length === 1) return sum + units[0].primary;
      units.sort((a, b) => b.primary - a.primary);
      const [first, ...rest] = units;
      return (
        sum +
        first.primary +
        rest.reduce((sub, u) => sub + (u.secondary > 0 ? u.secondary : 0), 0)
      );
    }, 0);
  }, [basket]);
  const total = subtotal + shippingCost;

  const LoadingDots = ({ color = "white" }) => (
    <div className="flex space-x-1">
      <div className={`h-2 w-2 bg-${color} rounded-full animate-bounce`} />
      <div className={`h-2 w-2 bg-${color} rounded-full animate-bounce delay-150`} />
      <div className={`h-2 w-2 bg-${color} rounded-full animate-bounce delay-300`} />
    </div>
  );

  const placeOrder = async () => {
    if (!selectedAddress || !paymentMethod || !cartId) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        "https://media.upfrica.com/api/cart/checkout/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            cart_id: Number(cartId),
            address: selectedAddress,
            payment_method_id: paymentMethod,
          }),
        }
      );
      const json = await res.json();
      setIsLoading(false);
      router.push(json.payment_url || json.stripe_url || "/");
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const addressSchema = Yup.object({
    full_name: Yup.string().required("Required"),
    street: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    state: Yup.string().required("Required"),
    zip_code: Yup.string().required("Required"),
    country: Yup.string().required("Required"),
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Shipping & Payment */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold flex items-center mb-4">
              <FiTruck className="mr-2 text-indigo-600" />
              Shipping Address
            </h2>
            {selectedAddress ? (
              <>
                <div className="relative bg-gray-50 border rounded-lg p-4">
                  {(() => {
                    const a = addresses.find((x) => x.id === selectedAddress);
                    return (
                      <>
                        <p className="font-medium">
                          {a.address_data.street}, {a.address_data.city}
                        </p>
                        <p className="text-sm text-gray-600">
                          {a.address_data.state}, {a.address_data.zip_code},{" "}
                          {a.address_data.country}
                        </p>
                      </>
                    );
                  })()}
                  <button
                    onClick={() => setShowChangeModal(true)}
                    className="absolute top-4 right-4 flex items-center text-indigo-600 hover:underline"
                  >
                    <FiEdit className="mr-1" /> Change
                  </button>
                </div>
                <button
                  onClick={() => setShowNewModal(true)}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-dashed border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50"
                >
                  <FiPlus className="mr-2" /> Add New Address
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowNewModal(true)}
                className="inline-flex items-center px-4 py-2 border border-dashed border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50"
              >
                <FiPlus className="mr-2" /> Add New Address
              </button>
            )}
          </section>

          {/* Payment Method */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold flex items-center mb-4">
              <FiCreditCard className="mr-2 text-indigo-600" />
              Payment Method
            </h2>
            <div className="space-y-3">
              {["paystack", "stripe"].map((m) => (
                <label
                  key={m}
                  className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-indigo-400"
                >
                  <input
                    type="radio"
                    name="payment"
                    value={m}
                    checked={paymentMethod === m}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="form-radio text-indigo-600"
                  />
                  <span className="ml-3 capitalize">{m}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Order Summary */}
        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="divide-y flex-grow">
              {basket.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between py-4 items-center"
                >
                  <div className="flex items-center">
                    <img
                      src={item.image?.[0] || "/placeholder.png"}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium">
                    ₵{((item.price_cents / 100) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="pt-4 space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>₵{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span>₵{shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₵{total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={placeOrder}
              disabled={!selectedAddress || !paymentMethod || isLoading}
              className={`mt-6 w-full py-3 text-white font-semibold rounded-lg ${!selectedAddress || !paymentMethod || isLoading
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
                }`}
            >
              {isLoading ? <LoadingDots color="white" /> : "Place Order"}
            </button>
          </div>
        </aside>
      </div>

      {/* Change Address Modal */}
      {showChangeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg relative">
            <button
              onClick={() => setShowChangeModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <AiOutlineClose size={24} />
            </button>
            <h3 className="text-xl font-semibold mb-4">
              Select Shipping Address
            </h3>
            <div className="grid gap-4">
              {addresses.map((a) => (
                <button
                  key={a.id}
                  onClick={() => {
                    setSelectedAddress(a.id);
                    setShowChangeModal(false);
                  }}
                  className={`p-4 border rounded-lg text-left hover:border-indigo-400 ${selectedAddress === a.id
                      ? "border-indigo-600"
                      : "border-gray-200"
                    }`}
                >
                  <p className="font-medium">
                    {a.address_data.street}, {a.address_data.city}
                  </p>
                  <p className="text-sm text-gray-600">
                    {a.address_data.state}, {a.address_data.zip_code},{" "}
                    {a.address_data.country}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add New Address Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg relative">
            <button
              onClick={() => setShowNewModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <AiOutlineClose size={24} />
            </button>
            <h3 className="text-xl font-semibold mb-4">Add New Address</h3>
            <Formik
              initialValues={{
                full_name: "",
                street: "",
                city: "",
                state: "",
                zip_code: "",
                country: "",
              }}
              validationSchema={addressSchema}
              onSubmit={async (vals, { setSubmitting, resetForm }) => {
                try {
                  const res = await fetch(
                    "https://media.upfrica.com/api/addresses/",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                      },
                      body: JSON.stringify({
                        owner_id: user.id,
                        owner_type: "USER",
                        default: false,
                        full_name: vals.full_name,
                        address_data: {
                          street: vals.street,
                          city: vals.city,
                          state: vals.state,
                          zip_code: vals.zip_code,
                          country: vals.country,
                        },
                      }),
                    }
                  );
                  const json = await res.json();
                  setAddresses((prev) => [...prev, json]);
                  setSelectedAddress(json.id);
                  resetForm();
                  setShowNewModal(false);
                } catch (e) {
                  console.error(e);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting, setFieldValue, values }) => (
                <Form className="space-y-6">
                  {[
                    { name: "full_name", label: "Full Name" },
                    { name: "street", label: "Street" },
                    { name: "city", label: "City" },
                    { name: "state", label: "State" },
                    { name: "zip_code", label: "Zip Code" },
                  ].map((f) => (
                    <div key={f.name}>
                      <label className="block text-sm font-medium text-gray-700">
                        {f.label}
                      </label>
                      <Field
                        name={f.name}
                        className="mt-1 block w-full border-b border-gray-300 focus:border-indigo-500 focus:outline-none py-3"
                      />
                      <ErrorMessage
                        name={f.name}
                        component="p"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <CountryDropdown
                      value={values.country}
                      onChange={(val) => setFieldValue("country", val)}
                      defaultOptionLabel="Select Country"
                      className="mt-1 block w-full border-b border-gray-300 focus:border-indigo-500 focus:outline-none py-3"
                    />
                    <ErrorMessage
                      name="country"
                      component="p"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                  >
                    {isSubmitting ? <LoadingDots color="white" /> : "Save Address"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </main>
  );
};

export default Checkout;
