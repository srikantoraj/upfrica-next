"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { BASE_API_URL } from "@/app/constants";

export default function ShopSettingsPage() {
  const { token } = useAuth();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!token) {
      console.log("⛔️ No auth token yet");
      return;
    }

    const fetchShop = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/api/shops/me/`, {
          headers: { Authorization: `Token ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load shop");
        const data = await res.json();
        setShop(data);
      } catch (err) {
        console.error("❌ FETCH ERROR:", err);
        setShop(null);
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [token]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Shop name is required"),
    description: Yup.string().nullable(),
    seller_contact_number: Yup.string()
      .matches(
        /^\+\d{6,20}$/,
        "Use full international format, e.g. +233245123456",
      )
      .nullable(),
    bg_color: Yup.string().nullable(),
  });

  if (loading) return <p className="p-4">Loading shop...</p>;
  if (!shop) return <p className="p-4 text-red-500">Shop not found.</p>;

  const initialValues = {
    name: shop.name || "",
    description: shop.description || "",
    seller_contact_number: shop.seller_contact_number || "",
    bg_color: shop.bg_color || "#ffffff",
    logo: null,
    banner: null,
  };

  return (
    <main className="max-w-xl mx-auto p-6 text-black dark:text-white">
      <h1 className="text-2xl font-semibold mb-4">Store Settings</h1>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("description", values.description);
            formData.append(
              "seller_contact_number",
              values.seller_contact_number || "",
            );
            formData.append("bg_color", values.bg_color);
            if (values.logo) formData.append("logo", values.logo);
            if (values.banner) formData.append("banner", values.banner);

            const res = await fetch(
              `${BASE_API_URL}/api/shops/${shop.slug}/update/`,
              {
                method: "PATCH",
                headers: { Authorization: `Token ${token}` },
                body: formData,
              },
            );

            if (!res.ok) throw new Error("Failed to update shop");
            setSaved(true);
          } catch (err) {
            console.error("❌ SUBMIT ERROR:", err);
            alert("Failed to save changes");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form className="space-y-4">
            {/* Shop Name */}
            <div>
              <label className="block mb-1 font-medium">Shop Name</label>
              <Field name="name" className="w-full border px-3 py-2 rounded" />
              <ErrorMessage
                name="name"
                component="p"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block mb-1 font-medium">Description</label>
              <Field
                name="description"
                as="textarea"
                rows="3"
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            {/* Seller Phone */}
            <div>
              <label className="block mb-1 font-medium">
                Contact Phone Number
              </label>
              <Field
                name="seller_contact_number"
                placeholder="+233245123456"
                className="w-full border px-3 py-2 rounded"
              />
              <ErrorMessage
                name="seller_contact_number"
                component="p"
                className="text-red-500 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be full international format, e.g. +233245123456.
              </p>
            </div>

            {/* Background Color */}
            <div>
              <label className="block mb-1 font-medium">Background Color</label>
              <Field
                name="bg_color"
                type="color"
                className="w-16 h-10 border rounded"
              />
            </div>

            {/* Logo */}
            <div>
              <label className="block mb-1 font-medium">Logo</label>
              {shop.shop_logo && (
                <img
                  src={shop.shop_logo}
                  alt="Logo"
                  className="h-20 mb-2 rounded border"
                />
              )}
              <input
                name="logo"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFieldValue("logo", e.currentTarget.files[0])
                }
              />
            </div>

            {/* Banner */}
            <div>
              <label className="block mb-1 font-medium">Banner</label>
              {shop.top_banner && (
                <img
                  src={shop.top_banner}
                  alt="Banner"
                  className="h-20 mb-2 rounded border"
                />
              )}
              <input
                name="banner"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFieldValue("banner", e.currentTarget.files[0])
                }
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>

            {saved && (
              <p className="text-green-600 mt-2">Changes saved successfully!</p>
            )}
          </Form>
        )}
      </Formik>
    </main>
  );
}
