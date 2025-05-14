


"use client";
import React, { useState, useEffect } from "react";
import { HiXMark } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const LoadingDots = ({ color = "white" }) => (
  <div className="flex space-x-1 justify-center items-center h-5">
    <div className={`h-2 w-2 bg-${color} rounded-full animate-bounce [animation-delay:-0.3s]`}></div>
    <div className={`h-2 w-2 bg-${color} rounded-full animate-bounce [animation-delay:-0.15s]`}></div>
    <div className={`h-2 w-2 bg-${color} rounded-full animate-bounce`}></div>
  </div>
);

const DirectBuyPopup = ({
  product,
  isVisible,
  onClose,
  quantity,
  relatedProducts =[],
}) => {
  console.log("directbyproduct",product);
  
  const router = useRouter();
  const { token } = useSelector((state) => state.auth) || {};

  const [addresses, setAddresses] = useState([]);
  const [isAddressLoading, setIsAddressLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("paystack");
  const [acceptedPolicy, setAcceptedPolicy] = useState(true);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);
  const [error, setError] = useState("");

  const [directBuyQuantity, setDirectBuyQuantity] = useState(quantity);
  const [selectedProduct, setSelectedProduct] = useState({
    id: product?.id,
    image: product?.product_images?.[0] || "",
    title: product?.title || "",
    price: product?.price_cents || 0,
    currency: product?.price_currency || "GHS",
  });

  useEffect(() => {
    if (isVisible) {
      setDirectBuyQuantity(quantity);
      setSelectedProduct({
        id: product?.id,
        image: product?.product_images?.[0] || "",
        title: product?.title || "",
        price: product?.price_cents || 0,
        currency: product?.price_currency || "GHS",
      });
    }
  }, [isVisible, quantity, product]);

  useEffect(() => {
    if (!token) {
      router.push(`/signin?redirect=${encodeURIComponent(router.asPath)}`);
      return;
    }
    const fetchAddresses = async () => {
      try {
        const response = await fetch(
          "https://media.upfrica.com/api/addresses/",
          {
            method: "GET",
            headers: { Authorization: `Token ${token}` },
          }
        );
        if (!response.ok) throw new Error("Error fetching addresses");
        const data = await response.json();
        const options = data.map((addr) => ({
          id: addr.id,
          value: `${addr.address_data.address_line_1}, ${addr.address_data.town}, ${addr.address_data.country}`,
        }));
        setAddresses(options);
        if (options.length > 0) setSelectedAddressId(options[0].id);
      } catch (err) {
        console.error("Failed to fetch addresses:", err);
        const dummy = [
          {
            id: "dummy1",
            value: "123 Main Street, Dummy Town, Dummy Country",
          },
        ];
        setAddresses(dummy);
        setSelectedAddressId(dummy[0].id);
      } finally {
        setIsAddressLoading(false);
      }
    };
    fetchAddresses();
  }, [token, router]);

  const decrementQuantity = () =>
    setDirectBuyQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  const incrementQuantity = () => setDirectBuyQuantity((prev) => prev + 1);

  const handleConfirmPurchase = async () => {
    setError("");
    if (!acceptedPolicy) {
      setError(
        "You must agree to the rules, guidelines, and policies to continue."
      );
      return;
    }
    setIsConfirmLoading(true);
    try {
      const response = await fetch(
        "https://media.upfrica.com/api/cart/direct-buy/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            product: selectedProduct.id,
            quantity: directBuyQuantity,
            address: selectedAddressId,
            payment_method_id: paymentMethod,
          }),
        }
      );
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Error: ${errText}`);
      }
      const result = await response.json();
      if (result.payment_url) {
        router.push(result.payment_url);
      } else {
        throw new Error("Payment URL not received.");
      }
    } catch (err) {
      console.error("Direct buy error:", err);
      setError(
        "There was an issue processing your purchase. Please try again later."
      );
      setIsConfirmLoading(false);
    }
  };

  if (!isVisible) return null;

  const estimatedDelivery = (() => {
    if (product?.dispatch_time_in_days) {
      const d = new Date();
      d.setDate(d.getDate() + parseInt(product.dispatch_time_in_days));
      return d.toLocaleDateString();
    }
    return "N/A";
  })();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm overflow-hidden"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 p-4 md:p-6
                   relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center border-b pb-3 flex-shrink-0">
          <h3 className="text-xl font-semibold">Buy Now</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            <HiXMark className="h-6 w-6" />
          </button>
        </div>

        {/* PRODUCT DETAIL & QUANTITY (FIXED) */}
        <div className="flex items-center gap-4 p-3 border-b flex-shrink-0">
          <img
            src={selectedProduct.image || "https://via.placeholder.com/100"}
            alt={selectedProduct.title}
            className="w-[100px] h-[100px] object-cover rounded"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800 line-clamp-2">
              {selectedProduct.title}
            </p>
            <p className="text-sm text-gray-600">
              ₵{(selectedProduct.price / 100).toFixed(2)}
            </p>
            <div className="flex items-center mt-2">
              <button
                onClick={decrementQuantity}
                className="px-2 py-1 border rounded-l"
              >
                –
              </button>
              <div className="px-4 py-1 border-t border-b font-medium">
                {directBuyQuantity}
              </div>
              <button
                onClick={incrementQuantity}
                className="px-2 py-1 border rounded-r"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="overflow-y-auto flex-1 space-y-4 py-4 scrollbar-hide ">
          <div className="space-y-1 text-sm text-gray-700">
            <p>
              Estimated Delivery:{" "}
              <span className="font-medium">{estimatedDelivery}</span>
            </p>
            <p>
              Delivery Charges:{" "}
              <span className="font-medium">
                {product?.postage_fee_cents
                  ? `₵${(product.postage_fee_cents / 100).toFixed(2)}`
                  : "Free"}
              </span>
            </p>
          </div>

          {product.cancellable ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm">
              Return Policy: Can be returned within{" "}
              {product.secondary_data?.return_in_days || "N/A"} days (Cost by:{" "}
              {product.secondary_data?.returns_cost_by || "N/A"}).
            </div>
          ) : (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
              Return Policy: This product is not returnable.
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </p>
            <div className="flex gap-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="stripe"
                  checked={paymentMethod === "stripe"}
                  onChange={() => setPaymentMethod("stripe")}
                  className="mr-2"
                />
                Stripe
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="paystack"
                  checked={paymentMethod === "paystack"}
                  onChange={() => setPaymentMethod("paystack")}
                  className="mr-2"
                />
                Paystack
              </label>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">
              Total Charges: ₵
              {(
                (selectedProduct.price / 100) * directBuyQuantity +
                (product?.postage_fee_cents || 0) / 100
              ).toFixed(2)}
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={acceptedPolicy}
              onChange={() => setAcceptedPolicy(!acceptedPolicy)}
              className="mr-2"
            />
            <p className="text-sm text-gray-700">
              I agree to the rules, guidelines, and policies.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shipping Address
            </label>
            {isAddressLoading ? (
              <div className="animate-pulse">
                <div className="h-10 bg-gray-300 rounded w-full" />
              </div>
            ) : (
              <select
                value={selectedAddressId}
                onChange={(e) => setSelectedAddressId(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 text-sm"
              >
                {addresses.map((addr) => (
                  <option key={addr.id} value={addr.id}>
                    {addr.value}
                  </option>
                ))}
              </select>
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {relatedProducts && relatedProducts.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Related Products
              </p>
              <div className="flex overflow-x-auto space-x-3 pb-2">
                {relatedProducts
                  .filter((p) => p.image_url)
                  .slice(0, 10)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex-shrink-0 w-[100px] cursor-pointer hover:opacity-90 transition text-center"
                      onClick={() => {
                        setSelectedProduct({
                          id: item.id,
                          image: item.image_url,
                          title: item.title,
                          price: item.sale_price_cents || item.price_cents,
                          currency: item.price_currency || "GHS",
                        });
                        setDirectBuyQuantity(1);
                      }}
                    >
                      <div className="w-full h-[100px] border rounded overflow-hidden">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="mt-1 text-xs font-medium text-gray-700 truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-gray-800 font-semibold">
                        ₵
                        {(
                          (item.sale_price_cents || item.price_cents) /
                          100
                        ).toFixed(2)}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER (FIXED) */}
        <div className="flex-shrink-0">
          <button
            onClick={handleConfirmPurchase}
            disabled={isConfirmLoading}
            className="w-full bg-[#8710D8] text-white py-2 rounded hover:bg-purple-700 font-bold flex items-center justify-center"
          >
            {isConfirmLoading ? <LoadingDots color="white" /> : "Confirm Purchase"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DirectBuyPopup;




// "use client";
// import React, { useState, useEffect } from "react";
// import { HiXMark } from "react-icons/hi2";
// import { useRouter } from "next/navigation";
// import { useSelector } from "react-redux";

// const LoadingDots = ({ color = "white" }) => (
//   <div className="flex space-x-1 justify-center items-center h-5">
//     <div className={`h-2 w-2 bg-${color} rounded-full animate-bounce [animation-delay:-0.3s]`}></div>
//     <div className={`h-2 w-2 bg-${color} rounded-full animate-bounce [animation-delay:-0.15s]`}></div>
//     <div className={`h-2 w-2 bg-${color} rounded-full animate-bounce`}></div>
//   </div>
// );

// const DirectBuyPopup = ({ product, isVisible, onClose, quantity, relatedProducts }) => {
//   const router = useRouter();
//   const { token } = useSelector((state) => state.auth) || {};

//   const [addresses, setAddresses] = useState([]);
//   const [isAddressLoading, setIsAddressLoading] = useState(true);
//   const [selectedAddressId, setSelectedAddressId] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("paystack");
//   const [acceptedPolicy, setAcceptedPolicy] = useState(true);
//   const [directBuyQuantity, setDirectBuyQuantity] = useState(quantity);
//   const [isConfirmLoading, setIsConfirmLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [selectedImageData, setSelectedImageData] = useState({
//     image: product?.product_images?.[0] || "",
//     title: product?.title || "",
//     price: product?.price_cents || 0,
//     currency: product?.price_currency || "GHS",
//   });

//   const pricePerItem = product?.price_cents ? product.price_cents / 100 : 0;
//   const postageFee = product?.postage_fee_cents ? product.postage_fee_cents / 100 : 0;
//   const totalCharges = (pricePerItem * directBuyQuantity + postageFee).toFixed(2);

//   let estimatedDelivery = "N/A";
//   if (product?.dispatch_time_in_days) {
//     const deliveryDate = new Date();
//     deliveryDate.setDate(deliveryDate.getDate() + parseInt(product.dispatch_time_in_days, 10));
//     estimatedDelivery = deliveryDate.toLocaleDateString();
//   }

//   useEffect(() => {
//     if (!token) {
//       router.push(`/signin?redirect=${encodeURIComponent(router.asPath)}`);
//       return;
//     }

//     const fetchAddresses = async () => {
//       try {
//         const response = await fetch("https://media.upfrica.com/api/addresses/", {
//           method: "GET",
//           headers: { Authorization: `Token ${token}` },
//         });

//         if (!response.ok) throw new Error("Error fetching addresses");

//         const data = await response.json();
//         const options = data.map((addr) => ({
//           id: addr.id,
//           value: `${addr.address_data.address_line_1}, ${addr.address_data.town}, ${addr.address_data.country}`,
//         }));
//         setAddresses(options);
//         if (options.length > 0) setSelectedAddressId(options[0].id);
//       } catch (error) {
//         console.error("Failed to fetch addresses:", error);
//         const dummy = [{ id: "dummy1", value: "123 Main Street, Dummy Town, Dummy Country" }];
//         setAddresses(dummy);
//         setSelectedAddressId(dummy[0].id);
//       } finally {
//         setIsAddressLoading(false);
//       }
//     };

//     fetchAddresses();
//   }, [token, router]);

//   const decrementQuantity = () => setDirectBuyQuantity((prev) => (prev > 1 ? prev - 1 : 1));
//   const incrementQuantity = () => setDirectBuyQuantity((prev) => prev + 1);

//   const handleConfirmPurchase = async () => {
//     setError("");
//     if (!acceptedPolicy) {
//       setError("You must agree to the rules, guidelines, and policies to continue.");
//       return;
//     }
//     setIsConfirmLoading(true);

//     try {
//       const myHeaders = new Headers();
//       myHeaders.append("Authorization", `Token ${token}`);
//       myHeaders.append("Content-Type", "application/json");

//       const raw = JSON.stringify({
//         product: product.id,
//         quantity: directBuyQuantity,
//         address: selectedAddressId,
//         payment_method_id: paymentMethod,
//       });

//       const response = await fetch("https://media.upfrica.com/api/cart/direct-buy/", {
//         method: "POST",
//         headers: myHeaders,
//         body: raw,
//       });

//       if (!response.ok) {
//         const errText = await response.text();
//         throw new Error(`Error: ${errText}`);
//       }

//       const result = await response.json();
//       if (result.payment_url) {
//         router.push(result.payment_url);
//       } else {
//         throw new Error("Payment URL not received.");
//       }
//     } catch (err) {
//       console.error("Direct buy error:", err);
//       setError("There was an issue processing your purchase. Please try again later.");
//       setIsConfirmLoading(false);
//     }
//   };

//   if (!isVisible) return null;

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm overflow-y-auto"
//       onClick={onClose}
//     >
//       <div
//         className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 p-6 relative"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="flex justify-between items-center border-b pb-3">
//           <h3 className="text-xl font-semibold">Buy Now</h3>
//           <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
//             <HiXMark className="h-6 w-6" />
//           </button>
//         </div>

//         {/* Modal Body */}
//         <div className="mt-4 space-y-4">
//           {/* Selected Product Summary */}
//           <div className="flex items-center gap-4 p-3 border rounded">
//             <div className="flex flex-col items-start gap-2">
//               <img
//                 src={selectedImageData.image || "https://via.placeholder.com/80"}
//                 alt={selectedImageData.title}
//                 className="w-20 h-20 object-cover rounded"
//               />
//               <p className="text-sm font-medium text-gray-800 line-clamp-2" title={selectedImageData.title}>
//                 {selectedImageData.title}
//               </p>
//               <p className="text-sm text-gray-600 font-semibold">
//                 ₵{(selectedImageData.price / 100).toFixed(2)}
//               </p>
//             </div>

//             <div className="flex-1">
//               <p className="text-sm text-gray-600">
//                 {product.price_currency} {pricePerItem.toFixed(2)} x {directBuyQuantity}
//               </p>
//               <div className="flex items-center mt-2">
//                 <button onClick={decrementQuantity} className="px-2 py-1 border rounded-l text-gray-700">–</button>
//                 <div className="px-4 py-1 border-t border-b text-gray-800 font-medium">{directBuyQuantity}</div>
//                 <button onClick={incrementQuantity} className="px-2 py-1 border rounded-r text-gray-700">+</button>
//               </div>
//             </div>
//           </div>

//           {/* Delivery Info */}
//           <div className="space-y-1">
//             <p className="text-sm text-gray-700">Estimated Delivery: <span className="font-medium">{estimatedDelivery}</span></p>
//             <p className="text-sm text-gray-700">Delivery Charges: <span className="font-medium">{postageFee === 0 ? "Free" : `${product.price_currency} ${postageFee.toFixed(2)}`}</span></p>
//           </div>

//           {/* Return Policy */}
//           <div>
//             {product.cancellable ? (
//               <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
//                 <p className="text-sm">Return Policy: Can be returned within {product.secondary_data?.return_in_days || "N/A"} (Cost by: {product.secondary_data?.returns_cost_by || "N/A"}).</p>
//               </div>
//             ) : (
//               <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
//                 <p className="text-sm">Return Policy: This product is not returnable.</p>
//               </div>
//             )}
//           </div>

//           {/* Payment Method */}
//           <div>
//             <p className="text-sm font-medium text-gray-700 mb-2">Payment Method</p>
//             <div className="flex gap-6">
//               <label className="flex items-center">
//                 <input type="radio" name="paymentMethod" value="stripe" checked={paymentMethod === "stripe"} onChange={() => setPaymentMethod("stripe")} className="mr-2" />
//                 Stripe
//               </label>
//               <label className="flex items-center">
//                 <input type="radio" name="paymentMethod" value="paystack" checked={paymentMethod === "paystack"} onChange={() => setPaymentMethod("paystack")} className="mr-2" />
//                 Paystack
//               </label>
//             </div>
//           </div>

//           {/* Total Charges */}
//           <div>
//             <p className="text-sm font-medium text-gray-700">Total Charges: {product.price_currency} {totalCharges}</p>
//           </div>

//           {/* Policy Agreement */}
//           <div className="flex items-center">
//             <input type="checkbox" checked={acceptedPolicy} onChange={() => setAcceptedPolicy(!acceptedPolicy)} className="mr-2" />
//             <p className="text-sm text-gray-700">I agree to the rules, guidelines, and policies.</p>
//           </div>

//           {/* Address */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
//             {isAddressLoading ? (
//               <div className="animate-pulse">
//                 <div className="h-10 bg-gray-300 rounded w-full"></div>
//               </div>
//             ) : (
//               <select value={selectedAddressId} onChange={(e) => setSelectedAddressId(e.target.value)} className="w-full border border-gray-300 rounded p-2 text-sm">
//                 {addresses.map((addr) => (
//                   <option key={addr.id} value={addr.id}>{addr.value}</option>
//                 ))}
//               </select>
//             )}
//           </div>

//           {error && <p className="text-red-500 text-sm">{error}</p>}
//         </div>

//         {/* Related Product Images Section */}
//         {relatedProducts && relatedProducts.length > 0 && (
//           <div className="mt-6">
//             <p className="text-sm font-medium text-gray-700 mb-2">Related Products</p>
//             <div className="flex overflow-x-auto space-x-3 pb-2">
//               {relatedProducts
//                 .filter((item) => item.image_url)
//                 .slice(0, 10)
//                 .map((item) => (
//                   <div
//                     key={item.id}
//                     className="flex-shrink-0 w-[100px] cursor-pointer hover:opacity-90 transition text-center"
//                     onClick={() =>
//                       setSelectedImageData({
//                         image: item.image_url,
//                         title: item.title,
//                         price: item.sale_price_cents || item.price_cents,
//                         currency: item.price_currency || "GHS",
//                       })
//                     }
//                   >
//                     <div className="w-full h-[100px] border rounded overflow-hidden">
//                       <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
//                     </div>
//                     <p className="mt-1 text-xs font-medium text-gray-700 truncate" title={item.title}>{item.title}</p>
//                     <p className="text-[11px] text-gray-800 font-semibold">
//                       ₵{((item.sale_price_cents || item.price_cents) / 100).toFixed(2)}
//                     </p>
//                   </div>
//                 ))}
//             </div>
//           </div>
//         )}

//         {/* Confirm Button */}
//         <div className="mt-6">
//           <button
//             onClick={handleConfirmPurchase}
//             disabled={isConfirmLoading}
//             className="w-full bg-[#8710D8] text-white py-2 rounded hover:bg-purple-700 font-bold flex items-center justify-center"
//           >
//             {isConfirmLoading ? <LoadingDots color="white" /> : "Confirm Purchase"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DirectBuyPopup;
