// "use client";
// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";

// const AddressTwo = () => {
//   const [address, setAddress] = useState(null);
//   const [loading, setLoading]   = useState(false);
//   const [error, setError]       = useState(null);
//   const token = useSelector((state) => state.auth.token);

//   useEffect(() => {
//     if (!token) return;

//     const fetchAddress = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const res = await fetch("https://media.upfrica.com/api/addresses/", {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Token ${token}`,
//           },
//         });

//         if (!res.ok) {
//         //   const txt = await res.text();
//           throw new Error(`HTTP ${res.status}`);
//         }

//         // যদি রেসপন্স Array হয় তো [address] ধরে নিতে পারেন
//         const data = await res.json();
//         // আপনার উদাহরণ রেসপন্সে শুধু একটি অবজেক্ট, তাই সোজা সেট
//         setAddress(data);
//       } catch (err) {
//         console.error("Fetch failed:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAddress();
//   }, [token]);

//   console.log(address);
  

//   // UI রেন্ডার
//   if (loading) return <p>লোড হচ্ছে…</p>;
//   if (error)   return <p style={{ color: "red" }}>Error: {error}</p>;
// //   if (!address) return null; // ডেটা এখনও নেই

//   // address_data থেকে প্রপার্টি আনলিশ
// //   const {
// //     full_name,
// //     default: isDefault,
// //     address_data: { street, city, state, country, zip_code },
// //     created_at,
// //     updated_at,
// //   } = address;

//   return (
//     // <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
//     //   <h2 className="text-2xl font-semibold mb-4">Delivery Address</h2>

//     //   <p className="mb-2">
//     //     <strong>Name:</strong> {full_name}
//     //   </p>
//     //   <p className="mb-2">
//     //     <strong>Default:</strong>{" "}
//     //     {isDefault ? "Yes" : "No"}
//     //   </p>

//     //   <div className="mb-4">
//     //     <p>
//     //       <strong>Street:</strong> {street}
//     //     </p>
//     //     <p>
//     //       <strong>City:</strong> {city}
//     //     </p>
//     //     <p>
//     //       <strong>State:</strong> {state}
//     //     </p>
//     //     <p>
//     //       <strong>Postal Code:</strong> {zip_code}
//     //     </p>
//     //     <p>
//     //       <strong>Country:</strong> {country}
//     //     </p>
//     //   </div>

//     //   <p className="text-sm text-gray-500">
//     //     Created at: {new Date(created_at).toLocaleString()}
//     //   </p>
//     //   <p className="text-sm text-gray-500">
//     //     Updated at: {new Date(updated_at).toLocaleString()}
//     //   </p>
//     // </div>
//    <div className="container mx-auto my-10 p-4">
//       <h1 className="text-2xl font-bold mb-4">Your Addresses</h1>

//       {address.length === 0 ? (
//         <p>No addresses found.</p>
//       ) : (
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {address.map((addr) => (
//             <div
//               key={addr.id}
//               className="p-4 bg-white rounded-lg shadow hover:shadow-md transition"
//             >
//               <h2 className="font-semibold mb-2">{addr.full_name}</h2>
//               <p>{addr.address_data.street}</p>
//               <p>
//                 {addr.address_data.city}, {addr.address_data.state}{" "}
//                 {addr.address_data.zip_code}
//               </p>
//               <p>{addr.address_data.country}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddressTwo;

"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const AddressTwo = () => {
  // ১) এখানে স্টেট ডিফাইন করা হচ্ছে অ্যারে হিসেবে
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (!token) return;

    const fetchAddresses = async () => {
      setLoading(true);
      setError(null);

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

        const data = await res.json();
        // ২) যদি রিসপন্সে অবজেক্ট আসে, সেটাকে অ্যারেতে প্যাক করে নিন,
        //    না হলে সরাসরি অ্যারে ধরুন
        const list = Array.isArray(data) ? data : [data];
        setAddresses(list);
      } catch (err) {
        console.error("Fetch failed:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [token]);

  console.log("address",addresses);
  

  // ৩) লোডিং / এরর হ্যান্ডেল
  if (loading) return <p>লোড হচ্ছে…</p>;
  if (error)   return <p style={{ color: "red" }}>Error: {error}</p>;

  // ৪) এখানে আমরা map করে প্রতিটি address দেখাব
  return (
    <div className="container mx-auto my-10 p-4">
      <h1 className="text-2xl font-bold mb-4">Your Addresses</h1>

      {addresses?.length === 0 ? (
        <p>No addresses found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition"
            >
              <h2 className="font-semibold mb-2">{addr.full_name}</h2>
              <p>{addr.address_data.street}</p>
              <p>
                {addr.address_data.city}, {addr.address_data.state}{" "}
                {addr.address_data.zip_code}
              </p>
              <p>{addr.address_data.country}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressTwo;

