
"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loading from "@/components/ui/Loading";
import { GoDotFill } from "react-icons/go";
import { IoIosArrowForward } from "react-icons/io";
import { FaEdit, FaTrash } from "react-icons/fa";

// 1) Custom hook: fetch addresses
const useFetchAddresses = () => {
  const [data, setData]       = useState([]);
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(true);
  const token = useSelector((s) => s.auth.token);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchAddresses = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://media.upfrica.com/api/addresses/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`HTTP ${res.status}: ${txt}`);
        }
        const json = await res.json();
        setData(Array.isArray(json) ? json : [json]);
      } catch (err) {
        console.error("Fetch failed:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [token]);

  return { data, error, loading };
};

// 2) Modal for edit/delete
const EditModal = ({ address, onClose, onSaved, onDeleted }) => {
  const [form, setForm] = useState({
    full_name: address.full_name,
    street:    address.address_data.street,
    city:      address.address_data.city,
    state:     address.address_data.state,
    zip_code:  address.address_data.zip_code,
    country:   address.address_data.country,
    phone:     address.address_data.phone_number,
  });
  const token = useSelector((s) => s.auth.token);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    try {
      const res = await fetch(
        `https://media.upfrica.com/api/addresses/${address.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            full_name: form.full_name,
            address_data: {
              street: form.street,
              city: form.city,
              state: form.state,
              zip_code: form.zip_code,
              country: form.country,
              phone_number: form.phone,
            },
          }),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      console.log('updated',updated);
      
      onSaved(updated);
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed: " + err.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await fetch(
        `https://media.upfrica.com/api/addresses/${address.id}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Token ${token}` },
        }
      );
      if (!res.ok) throw new Error(await res.text());
      onDeleted(address.id);
      onClose();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Address</h2>

        {[
          ["full_name", "Name"],
          ["street", "Street"],
          ["city", "City"],
          ["state", "State"],
          ["zip_code", "Postal Code"],
          ["country", "Country"],
          ["phone", "Phone Number"],
        ].map(([key, label]) => (
          <div className="mb-3" key={key}>
            <label className="block text-sm mb-1" htmlFor={key}>
              {label}
            </label>
            <input
              id={key}
              name={key}
              value={form[key]}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        ))}

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2">
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-red-600 border rounded"
          >
            Delete
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// 3) Card component
const AddressCard = ({ item, onEdit }) => {
  const {
    full_name,
    address_data: {
      street,
      city,
      state,
      zip_code,
      country,
      phone_number,
    },
  } = item;

  return (
    <div className="relative bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
      {/* Action Icons */}
      <div className="absolute top-4 right-4 flex space-x-3">
        <FaEdit
          className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer"
          onClick={() => onEdit(item)}
          title="Edit"
        />
        <FaTrash
          className="w-5 h-5 text-red-400 hover:text-red-500 cursor-pointer"
          onClick={() => onEdit(item)}
          title="Delete"
        />
      </div>

      {/* Header */}
      <h4 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
        {full_name}
      </h4>

      {/* Details List */}
      <dl className="space-y-3 text-gray-700">
        <div className="flex">
          <dt className="w-32 font-medium">Street:</dt>
          <dd className="flex-1">{street}</dd>
        </div>
        <div className="flex">
          <dt className="w-32 font-medium">City:</dt>
          <dd className="flex-1">{city}</dd>
        </div>
        <div className="flex">
          <dt className="w-32 font-medium">State:</dt>
          <dd className="flex-1">{state}</dd>
        </div>
        <div className="flex">
          <dt className="w-32 font-medium">Postal Code:</dt>
          <dd className="flex-1">{zip_code}</dd>
        </div>
        <div className="flex">
          <dt className="w-32 font-medium">Country:</dt>
          <dd className="flex-1">{country}</dd>
        </div>
        <div className="flex">
          <dt className="w-32 font-medium">Phone:</dt>
          <dd className="flex-1">{phone_number}</dd>
        </div>
      </dl>

      {/* Footer (Optional) */}
      {/* <div className="mt-6 text-right">
        <button
          onClick={() => onEdit(item)}
          className="text-blue-600 hover:underline text-sm"
        >
          Edit Address
        </button>
      </div> */}
    </div>
  );
};

// 4) Page component
export default function AddressPage() {
  const { data: addresses, error, loading } = useFetchAddresses();
  const [modalAddress, setModalAddress]    = useState(null);
  const [list, setList]                    = useState([]);

  // keep local copy of data to update/delete
  useEffect(() => {
    setList(addresses);
  }, [addresses]);

  const handleSaved = (updated) => {
    setList((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
  };

  const handleDeleted = (id) => {
    setList((prev) => prev.filter((a) => a.id !== id));
  };

  if (loading) return <Loading />;
  if (error)   return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto my-10">
      <div className="flex items-center gap-2 text-purple-500 mb-6">
        <GoDotFill /> Home <IoIosArrowForward /> Your delivery locations
      </div>

      {list.length === 0 ? (
        <p>No addresses available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((addr) => (
            <AddressCard
              key={addr.id}
              item={addr}
              onEdit={(item) => setModalAddress(item)}
            />
          ))}
        </div>
      )}

      {modalAddress && (
        <EditModal
          address={modalAddress}
          onClose={() => setModalAddress(null)}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}


