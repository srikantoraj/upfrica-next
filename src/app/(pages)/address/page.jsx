// "use client";
// import Loading from "@/components/ui/Loading";
// import React, { useEffect, useState } from "react";
// import { GoDotFill } from "react-icons/go";
// import { IoIosArrowForward } from "react-icons/io";


// // Custom hook for fetching addresses
// const useFetchAddresses = () => {
  
//   const [data, setData] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   console.log(data);

//   return { data, error, loading };
//   // const [data, setData]     = useState([]);
//   // const [error, setError]   = useState(null);
//   // const [loading, setLoading] = useState(true);
//   //  const token = useSelector((state) => state.auth.token);

//   // useEffect(() => {
//   //   const fetchAddresses = async () => {
//   //     try {
//   //       const res = await fetch(
//   //         "https://upfrica-staging.herokuapp.com/api/v1/addresses/", // সঠিক এন্ডপয়েন্ট
//   //         {
//   //           headers: {
//   //             Authorization: `Token ${token}`,
//   //             "Content-Type": "application/json",
//   //           },
//   //         }
//   //       );

//   //       if (!res.ok) {
//   //         // স্ট্যাটাস কোড, বডি দেখার জন্য
//   //         const text = await res.text();
//   //         throw new Error(`HTTP ${res.status}: ${text}`);
//   //       }

//   //       const json = await res.json();
//   //       // পেজিনেটেড হলে results, না হলে পুরো json
//   //       const list = Array.isArray(json)
//   //         ? json
//   //         : json.results || json.data || [];
//   //       setData(list);
//   //     } catch (err) {
//   //       console.error("Fetch addresses failed:", err);
//   //       setError(err.message);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchAddresses();
//   // }, []);

//   // console.log(data,data);
  

//   // return { data, error, loading };
// };

// // AddressCard component
// const AddressCard = ({ item: data, isEditing, toggleEdit }) => {
//   const [item, setItem] = useState(data);

//   const [formData, setFormData] = useState({
//     fullName: item?.full_name,
//     addressLine: item?.address_data.address_line_1,
//     town: item?.address_data?.town,
//     postcode: item?.address_data?.postcode,
//     country: item?.address_data?.country,
//     phoneNumber: item?.address_data.phone_number,
//   });
  

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // Here, you can handle the update of the address
//     console.log("Updated Address:", formData);

//     // Prepare the data for submission
//     const updatedAddress = {
//       full_name: formData.fullName,
//       address_line_1: formData.addressLine,
//       town: formData.town,
//       postcode: formData.postcode,
//       country: formData.country,
//       phone_number: formData.phoneNumber,
//     };

//     try {
//       console.log(item?.id);
//       const response = await fetch(
//         `https://upfrica-staging.herokuapp.com/api/v1/addresses/${item.id}`,
//         {
//           method: "PATCH", // or "PATCH" depending on your API
//           headers: {
//             Authorization: "Bearer 7pTf7h9BZgf9JFy3ssZbs2DQ",
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ address: updatedAddress }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to update address.");
//       }
//       const result = await response.json();
//       setItem(result?.address);

//       console.log("Updated Address:", result); // Log the updated address returned from the API

//       // Optionally, you might want to update your local state here if necessary
//       // For example, you can call a function to fetch the updated list of addresses again.
//     } catch (error) {
//       console.error("Error updating address:", error.message);
//     }

//     toggleEdit(); // Close the edit form after submission
//   };

//   // Handle from delet
//   const handleDelete = async () => {
//     try {
//       const response = await fetch(
//         `https://upfrica-staging.herokuapp.com/api/v1/addresses/${item.id}`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: "Bearer 7pTf7h9BZgf9JFy3ssZbs2DQ",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to delete address.");
//       }
//       const result = await response.json();
//       console.log(result);

//       setItem(() => null);

//       console.log("Address deleted successfully");

//       // Card ta frontend theke remove kora
//       // Tumake state update kore nite hobe frontend theke oi address ta remove korar jonno.
//     } catch (error) {
//       console.error("Error deleting address:", error.message);
//     }
//   };

//   if (!item) return;

//   return (
//     <div
//       className={`address-card bg-white p-5 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out ${isEditing ? "h-auto" : "h-60"
//         }`}
//     >
//       <h3 className="font-bold text-xl text-gray-800 mb-2">
//         {item.id} {item.full_name}
//       </h3>
//       <p className=""></p>
//       <p className="text-gray-600 mb-1">
//         {item?.address_data.address_line_1}</p>
//       <p className="text-gray-600 mb-1">
//         {item.address_data.town}, {item.address_data.postcode}
//       </p>
//       <p className="text-gray-600 mb-1">{item.address_data.country}</p>

//       <p className="text-gray-600 mb-1">
//         Phone: {item.address_data.phone_number}
//       </p>

//       {/* Buttons section */}
//       <div className="mt-4 flex justify-between">
//         <button
//           onClick={toggleEdit}
//           className="bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition duration-300"
//         >
//           Edit
//         </button>
//         <button
//           onClick={handleDelete}
//           className="bg-gray-200 text-red-400 py-2 px-4 rounded hover:bg-gray-300 transition duration-300"
//         >
//           Delete
//         </button>

//         <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition duration-300">
//           Set as Default
//         </button>
//       </div>

//       {/* Dropdown Form for Editing */}
//       {isEditing && (
//         <form
//           className="mt-4 p-4 border border-gray-300 rounded-lg"
//           onSubmit={handleSubmit}
//         >
//           <div className="mb-3">
//             <label className="block mb-1" htmlFor="fullName">
//               Full Name
//             </label>
//             <input
//               type="text"
//               name="fullName"
//               id="fullName"
//               value={formData.fullName}
//               onChange={handleChange}
//               className="border border-gray-300 rounded-lg p-2 w-full"
//             />
//           </div>
//           <div className="mb-3">
//             <label className="block mb-1" htmlFor="addressLine">
//               Address Line
//             </label>
//             <input
//               type="text"
//               name="addressLine"
//               id="addressLine"
//               value={formData.addressLine}
//               onChange={handleChange}
//               className="border border-gray-300 rounded-lg p-2 w-full"
//             />
//           </div>
//           <div className="mb-3">
//             <label className="block mb-1" htmlFor="town">
//               Town
//             </label>
//             <input
//               type="text"
//               name="town"
//               id="town"
//               value={formData.town}
//               onChange={handleChange}
//               className="border border-gray-300 rounded-lg p-2 w-full"
//             />
//           </div>
//           <div className="mb-3">
//             <label className="block mb-1" htmlFor="postcode">
//               Postcode
//             </label>
//             <input
//               type="text"
//               name="postcode"
//               id="postcode"
//               value={formData.postcode}
//               onChange={handleChange}
//               className="border border-gray-300 rounded-lg p-2 w-full"
//             />
//           </div>
//           <div className="mb-3">
//             <label className="block mb-1" htmlFor="country">
//               Country
//             </label>
//             <input
//               type="text"
//               name="country"
//               id="country"
//               value={formData.country}
//               onChange={handleChange}
//               className="border border-gray-300 rounded-lg p-2 w-full"
//             />
//           </div>
//           <div className="mb-3">
//             <label className="block mb-1" htmlFor="phoneNumber">
//               Phone Number
//             </label>
//             <input
//               type="text"
//               name="phoneNumber"
//               id="phoneNumber"
//               value={formData.phoneNumber}
//               onChange={handleChange}
//               className="border border-gray-300 rounded-lg p-2 w-full"
//             />
//           </div>
//           <button
//             type="submit"
//             className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
//           >
//             Save Changes
//           </button>
//         </form>
//       )}
//     </div>
//   );
// };

// const AddressPage = () => {
//   const { data, error, loading } = useFetchAddresses();
//   const [activeCardId, setActiveCardId] = useState(null);




//   const toggleEdit = (id) => {
//     setActiveCardId((prevId) => (prevId === id ? null : id)); // Toggle active card
//   };

//   // if (loading) return <Loading />;
//   if (error) return <p style={{ color: "red" }}>{error}</p>;

//   return (
//     <div className="address-page-container container mx-auto my-20 px-2">
//       <div className="address-info flex items-center gap-4 text-purple-500">
//         <p className="flex items-center">
//           <GoDotFill className="mr-2" /> Home
//         </p>
//         <p className="flex items-center">
//           <IoIosArrowForward className="mr-1" />
//           <IoIosArrowForward className="mr-1" />
//           Your delivery locations
//         </p>
//       </div>
//       <div className="address-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-20">
//         {data.length > 0 ? (
//           data.map((item) => (
//             <AddressCard
//               key={item.id}
//               item={item}
//               isEditing={activeCardId === item.id}
//               toggleEdit={() => toggleEdit(item.id)}
//             />
//           ))
//         ) : (
//           <p>No addresses available.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AddressPage;

// ------------x------------

// "use client";
// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import Loading from "@/components/ui/Loading";
// import { GoDotFill } from "react-icons/go";
// import { IoIosArrowForward } from "react-icons/io";
// import { FaEdit, FaTrash } from "react-icons/fa";

// // 1) Fetch hook (ইউজ করুন আগের মতো)
// const useFetchAddresses = () => {
//   const [data, setData]       = useState([]);
//   const [error, setError]     = useState(null);
//   const [loading, setLoading] = useState(true);
//   const token = useSelector((s) => s.auth.token);

//   useEffect(() => {
//     if (!token) return setLoading(false);
//     (async () => {
//       try {
//         const res = await fetch("https://media.upfrica.com/api/addresses/", {
//           headers: { Authorization: `Token ${token}` },
//         });
//         if (!res.ok) throw new Error(await res.text());
//         const json = await res.json();
//         setData(Array.isArray(json) ? json : [json]);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [token]);

//   return { data, error, loading };
// };

// // 2) Modal component
// const EditModal = ({ address, onClose, onSaved, onDeleted }) => {
//   const [form, setForm] = useState({
//     full_name: address.full_name,
//     street:    address.address_data.street,
//     city:      address.address_data.city,
//     state:     address.address_data.state,
//     zip_code:  address.address_data.zip_code,
//     country:   address.address_data.country,
//   });
//   const token = useSelector((s) => s.auth.token);

//   const handleChange = (e) => {
//     setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
//   };

//   const handleSave = async () => {
//     try {
//       const res = await fetch(
//         `https://media.upfrica.com/api/addresses/${address.id}/`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Token ${token}`,
//           },
//           body: JSON.stringify({ address_data: form, full_name: form.full_name }),
//         }
//       );
//       if (!res.ok) throw new Error(await res.text());
//       const updated = await res.json();
//       onSaved(updated);
//       onClose();
//     } catch (err) {
//       console.error(err);
//       alert("Update failed: " + err.message);
//     }
//   };

//   const handleDelete = async () => {
//     if (!confirm("Really delete this address?")) return;
//     try {
//       const res = await fetch(
//         `https://media.upfrica.com/api/addresses/${address.id}/`,
//         {
//           method: "DELETE",
//           headers: { Authorization: `Token ${token}` },
//         }
//       );
//       if (!res.ok) throw new Error(await res.text());
//       onDeleted(address.id);
//       onClose();
//     } catch (err) {
//       console.error(err);
//       alert("Delete failed: " + err.message);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-lg w-full max-w-md">
//         <h2 className="text-xl font-semibold mb-4">Edit Address</h2>
//         {/* Form fields */}
//         {["full_name","street","city","state","zip_code","country"].map((key) => (
//           <div className="mb-3" key={key}>
//             <label className="block text-sm mb-1 capitalize" htmlFor={key}>
//               {key.replace("_", " ")}
//             </label>
//             <input
//               id={key}
//               name={key}
//               value={form[key]}
//               onChange={handleChange}
//               className="w-full border p-2 rounded"
//             />
//           </div>
//         ))}
//         {/* Actions */}
//         <div className="flex justify-end gap-3 mt-4">
//           <button onClick={onClose} className="px-4 py-2">Cancel</button>
//           <button
//             onClick={handleDelete}
//             className="px-4 py-2 text-red-600 border rounded"
//           >
//             Delete
//           </button>
//           <button
//             onClick={handleSave}
//             className="px-4 py-2 bg-blue-600 text-white rounded"
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // 3) Card component
// const AddressCard = ({ item, onEdit }) => (
//   <div className="relative p-4 bg-white rounded-lg shadow hover:shadow-md transition">
//     {/* icon buttons */}
//     <div className="absolute top-2 right-2 flex space-x-2">
//       <FaEdit
//         className="cursor-pointer text-blue-600"
//         onClick={() => onEdit(item)}
//       />
//       <FaTrash className="cursor-pointer text-red-600" onClick={() => onEdit(item, true)} />
//     </div>

//     <h3 className="font-semibold mb-2">{item.full_name}</h3>
//     <p>{item.address_data.street}</p>
//     <p>
//       {item.address_data.city}, {item.address_data.state} {item.address_data.zip_code}
//     </p>
//     <p>{item.address_data.country}</p>
//   </div>
// );

// // 4) Page component
// export default function AddressPage() {
//   const { data: addresses, error, loading } = useFetchAddresses();
//   const [modalAddress, setModalAddress]    = useState(null);

//   const handleSaved = (updated) => {
//     // state আপডেট করুন List এ
//     setModalAddress(null);
//     // ... or re-fetch
//   };

//   const handleDeleted = (id) => {
//     // remove from list
//     setModalAddress(null);
//     // ... or re-fetch
//   };

//   if (loading) return <Loading />;
//   if (error)   return <p className="text-red-500">Error: {error}</p>;

//   return (
//     <div className="container mx-auto my-10">
//       <div className="flex items-center gap-2 text-purple-500 mb-6">
//         <GoDotFill /> Home <IoIosArrowForward /> Your delivery locations
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//         {addresses.map((addr) => (
//           <AddressCard
//             key={addr.id}
//             item={addr}
//             onEdit={(item) => setModalAddress(item)}
//           />
//         ))}
//       </div>

//       {modalAddress && (
//         <EditModal
//           address={modalAddress}
//           onClose={() => setModalAddress(null)}
//           onSaved={handleSaved}
//           onDeleted={handleDeleted}
//         />
//       )}
//     </div>
//   );
// }


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


