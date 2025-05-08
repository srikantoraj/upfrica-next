// 'use client'

// import React, { useState, useEffect } from 'react'
// import { useSearchParams, useRouter } from 'next/navigation'
// import { useSelector } from 'react-redux'
// import { AiOutlineLeft, AiOutlineRight, AiOutlineArrowDown } from 'react-icons/ai'
// import { MdCheck, MdChat } from 'react-icons/md'

// const PAGE_SIZE = 20
// // Remove "Delivered", keep "Received" as final status
// const STATUSES = ['Ordered', 'Processing', 'Shipped', 'Received']

// function Pagination({ currentPage, totalPages, onPageChange }) {
//   const [isMobile, setIsMobile] = useState(false)

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth <= 768)
//     handleResize()
//     window.addEventListener('resize', handleResize)
//     return () => window.removeEventListener('resize', handleResize)
//   }, [])

//   const handlePageClick = (page) => {
//     if (page >= 1 && page <= totalPages && page !== currentPage) {
//       onPageChange(page)
//     }
//   }

//   const getPageNumbers = () => {
//     if (isMobile) {
//       if (totalPages <= 2) return [1, ...(totalPages === 2 ? [2] : [])]
//       return [1, 2, '...']
//     }
//     if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
//     if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages]
//     if (currentPage >= totalPages - 2)
//       return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
//     return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
//   }

//   return (
//     <div className="mt-8 flex justify-center overflow-x-auto">
//       <div className="inline-flex items-center space-x-2 whitespace-nowrap px-2">
//         <button
//           onClick={() => handlePageClick(currentPage - 1)}
//           disabled={currentPage === 1}
//           className="px-3 py-1 flex items-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
//         >
//           <AiOutlineLeft className="mr-1" />
//           <span>Prev</span>
//         </button>
//         {getPageNumbers().map((page, i) =>
//           typeof page === 'number' ? (
//             <button
//               key={i}
//               onClick={() => handlePageClick(page)}
//               className={`px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 ${page === currentPage ? 'bg-violet-700 text-white font-semibold' : ''
//                 }`}
//             >
//               {page}
//             </button>
//           ) : (
//             <span key={i} className="px-3 py-1 text-gray-500">
//               …
//             </span>
//           )
//         )}
//         <button
//           onClick={() => handlePageClick(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           className="px-3 py-1 flex items-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
//         >
//           <span>Next</span>
//           <AiOutlineRight className="ml-1" />
//         </button>
//       </div>
//     </div>
//   )
// }

// function SkeletonOrderCard() {
//   return (
//     <div className="bg-white rounded-lg shadow p-6 space-y-6 animate-pulse border border-gray-700">
//       <div className="h-6 bg-gray-300 rounded w-1/3" />
//       <div className="h-4 bg-gray-300 rounded w-1/4" />
//       <div className="grid grid-cols-3 gap-4">
//         {Array.from({ length: 3 }).map((_, i) => (
//           <div key={i} className="flex space-x-3 items-center">
//             <div className="w-16 h-16 bg-gray-300 rounded" />
//             <div className="flex-1 space-y-2">
//               <div className="h-4 bg-gray-300 rounded w-3/4" />
//               <div className="h-4 bg-gray-300 rounded w-1/2" />
//               <div className="h-3 bg-gray-300 rounded w-1/3" />
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="grid grid-cols-2 gap-6">
//         <div className="space-y-2">
//           <div className="h-4 bg-gray-300 rounded w-1/2" />
//           <div className="h-4 bg-gray-300 rounded w-2/3" />
//           <div className="h-4 bg-gray-300 rounded w-1/3" />
//         </div>
//         <div className="space-y-2">
//           <div className="h-4 bg-gray-300 rounded w-1/2" />
//           <div className="h-4 bg-gray-300 rounded w-2/3" />
//           <div className="h-6 bg-gray-300 rounded w-1/4" />
//         </div>
//       </div>
//       <div className="space-y-2">
//         <div className="h-4 bg-gray-300 rounded w-1/6" />
//         <div className="w-full bg-gray-200 h-1 rounded-full">
//           <div className="bg-gray-300 h-full" />
//         </div>
//         <div className="flex justify-between">
//           {Array.from({ length: 4 }).map((_, i) => (
//             <div key={i} className="h-4 w-12 bg-gray-300 rounded" />
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default function OrdersPage() {
//   const searchParams = useSearchParams()
//   const router = useRouter()
//   const token = useSelector((state) => state.auth.token)

//   const pageParam = parseInt(searchParams.get('page') || '1', 10)
//   const [orders, setOrders] = useState([])
//   const [count, setCount] = useState(0)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   // status index per orderId+sellerId
//   const [statusesByOrder, setStatusesByOrder] = useState({})
//   // loading state for the "receive" action per orderId+sellerId
//   const [loadingReceiveBy, setLoadingReceiveBy] = useState({})

//   useEffect(() => {
//     if (!token) return
//     setLoading(true)
//     fetch(`https://media.upfrica.com/api/buyer/orders/?page=${pageParam}`, {
//       headers: { Authorization: `Token ${token}` },
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error(`HTTP ${res.status}`)
//         return res.json()
//       })
//       .then((data) => {
//         setOrders(data.results)
//         setCount(data.count)
//       })
//       .catch((err) => setError(err.message))
//       .finally(() => setLoading(false))
//   }, [token, pageParam])

//   // Initialize statuses, marking "Received" if receive_status===1
//   useEffect(() => {
//     const init = {}
//     orders.forEach((order) => {
//       const bySeller = {}
//       order.order_items.forEach((item) => {
//         const sid = item.product.user
//         // if any item for that seller is already received, mark as Received
//         const received = item.receive_status === 1
//         bySeller[sid] = received ? STATUSES.length - 1 : 0
//       })
//       init[order.id] = bySeller
//     })
//     setStatusesByOrder(init)
//   }, [orders])

//   const totalPages = Math.ceil(count / PAGE_SIZE)

//   const handlePageChange = (page) => {
//     router.push(`/orders?page=${page}`)
//   }

//   // Handle status clicks, including PATCH for Received
//   const handleStatusClick = async (orderId, sellerId, idx) => {
//     const currentIdx = statusesByOrder[orderId]?.[sellerId] ?? 0
//     const lastIdx = STATUSES.length - 1
//     // if already at final "Received", do nothing
//     if (currentIdx === lastIdx) return

//     const statusName = STATUSES[idx]

//     // Only for "Received" do we call the API
//     if (statusName === 'Received') {
//       if (
//         !window.confirm(
//           'By clicking OK, you confirm that you have received the product.'
//         )
//       ) {
//         return
//       }

//       const key = `${orderId}_${sellerId}`
//       setLoadingReceiveBy((p) => ({ ...p, [key]: true }))

//       try {
//         // gather all items for this seller
//         const items = orders
//           .find((o) => o.id === orderId)
//           .order_items.filter((it) => it.product.user === sellerId)

//         const myHeaders = new Headers()
//         myHeaders.append('Authorization', `Token ${token}`)
//         myHeaders.append('Content-Type', 'application/json')

//         const raw = JSON.stringify({ receive_status: 1 })

//         // send PATCH for each item
//         const requests = items.map((item) =>
//           fetch(
//             `https://media.upfrica.com/api/buyer/order-item/${item.id}/`,
//             {
//               method: 'PATCH',
//               headers: myHeaders,
//               body: raw,
//               redirect: 'follow',
//             }
//           )
//         )
//         const responses = await Promise.all(requests)
//         // check all succeeded
//         for (let res of responses) {
//           if (!res.ok) throw new Error(`HTTP ${res.status}`)
//           const data = await res.json()
//           if (data.receive_status !== 1) throw new Error('Bad response')
//         }

//         // success!
//         setStatusesByOrder((prev) => ({
//           ...prev,
//           [orderId]: {
//             ...prev[orderId],
//             [sellerId]: lastIdx,
//           },
//         }))
//         alert('Marked as received!')
//       } catch (err) {
//         console.error(err)
//         alert('Error marking as received: ' + err.message)
//       } finally {
//         setLoadingReceiveBy((p) => ({ ...p, [key]: false }))
//       }

//       return
//     }

//     // For other statuses, local update only
//     if (
//       !window.confirm(`Are you sure you want to mark this as "${statusName}"?`)
//     ) {
//       return
//     }
//     setStatusesByOrder((prev) => ({
//       ...prev,
//       [orderId]: {
//         ...prev[orderId],
//         [sellerId]: idx,
//       },
//     }))
//   }

//   if (loading) {
//     return (
//       <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
//         {Array.from({ length: 3 }).map((_, i) => (
//           <SkeletonOrderCard key={i} />
//         ))}
//       </main>
//     )
//   }

//   if (error) {
//     return (
//       <p className="p-6 text-center text-red-600">
//         Error fetching orders: {error}
//       </p>
//     )
//   }

//   return (
//     <main className="space-y-8 max-w-6xl mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold">My Orders</h1>

//       <div className="space-y-6">
//         {orders.map((order) => {
//           const placedDate = new Date(order.created_at)
//           const formattedPlaced = placedDate.toLocaleDateString(undefined, {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric',
//           })
//           const itemsBySeller = order.order_items.reduce((acc, item) => {
//             const sid = item.product.user
//             if (!acc[sid]) acc[sid] = []
//             acc[sid].push(item)
//             return acc
//           }, {})

//           return (
//             <div
//               key={order.id}
//               className="bg-white rounded-lg shadow p-6 space-y-1 border border-gray-700"
//             >
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h2 className="text-xl font-semibold">
//                     Order #{String(order.id).padStart(5, '0')}
//                   </h2>
//                   <p className="text-gray-600 text-sm">
//                     Placed{' '}
//                     <time dateTime={order.created_at}>{formattedPlaced}</time>
//                   </p>
//                 </div>
//                 <a
//                   href={`/dashboard/all-orders/${order.id}/`}
//                   className="text-indigo-600 hover:underline text-sm font-medium"
//                 >
//                   View details&nbsp;→
//                 </a>
//               </div>

//               {Object.entries(itemsBySeller).map(([sellerId, items]) => {
//                 const currentIdx =
//                   statusesByOrder[order.id]?.[sellerId] ?? 0
//                 const progressPercent = ((currentIdx + 1) / STATUSES.length) * 100
//                 const needsGuide = currentIdx < STATUSES.length - 1
//                 const key = `${order.id}_${sellerId}`
//                 const isLoadingReceive = loadingReceiveBy[key]
//                 const lastIdx = STATUSES.length - 1

//                 return (
//                   <div key={sellerId} className="space-y-4">
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm font-medium text-gray-700">
//                         From seller #{sellerId}
//                       </span>
//                       <button
//                         onClick={() => router.push(`/chat/${sellerId}`)}
//                         className="flex flex-col items-center text-violet-700 hover:text-violet-700 text-sm font-medium"
//                       >
//                         <div className="p-2 pe-1 rounded-full bg-gray-200 hover:bg-gray-300">
//                           <MdChat size={18} />
//                         </div>
//                         Contact seller
//                       </button>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                       {items.map((item) => (
//                         <div
//                           key={item.id}
//                           className="flex space-x-3 items-center"
//                         >
//                           <img
//                             src={item.product.product_images[0]}
//                             alt={item.product.title}
//                             className="w-16 h-16 rounded object-cover"
//                           />
//                           <div>
//                             <h3 className="text-sm font-medium">
//                               {item.product.title}
//                             </h3>
//                             <p className="text-sm text-gray-500">
//                               ${(item.price_cents / 100).toFixed(2)}
//                             </p>
//                             <p className="text-xs text-gray-400">
//                               Qty: {item.quantity}
//                             </p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>

//                     <div>
//                       <h4 className="text-sm font-medium mb-1">Status</h4>
//                       <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
//                         <div
//                           className="bg-indigo-600 h-full"
//                           style={{ width: `${progressPercent}%` }}
//                         />
//                       </div>
//                       <div className="flex justify-between text-xs mt-1">
//                         {STATUSES.map((status, idx) => (
//                           <div
//                             key={status}
//                             className="relative flex-1 flex justify-center"
//                           >
//                             {/* Arrow now points at "Received" */}
//                             {idx === lastIdx && needsGuide && (
//                               <div className="absolute -top-16 flex flex-col items-center bg-white">
//                                 <span className="text-xs text-gray-700 border border-gray-700 p-1 rounded">
//                                   Click here to receive
//                                 </span>
//                                 <AiOutlineArrowDown className="text-gray-700" />
//                               </div>
//                             )}

//                             <button
//                               onClick={() =>
//                                 handleStatusClick(order.id, Number(sellerId), idx)
//                               }
//                               disabled={isLoadingReceive || currentIdx === lastIdx}
//                               className={`flex items-center focus:outline-none ${idx === currentIdx
//                                   ? 'text-indigo-600 font-semibold'
//                                   : 'text-gray-500'
//                                 }`}
//                             >
//                               <div
//                                 className={`rounded-full p-1 mr-1 ${idx === currentIdx
//                                     ? 'bg-indigo-600'
//                                     : 'bg-gray-300'
//                                   }`}
//                               >
//                                 {isLoadingReceive && idx === lastIdx ? (
//                                   '...'
//                                 ) : (
//                                   <MdCheck
//                                     className={`text-white ${idx === currentIdx ? 'text-xs' : 'text-[0.6rem]'
//                                       } font-bold`}
//                                   />
//                                 )}
//                               </div>
//                               {status}
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 )
//               })}

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700 mt-4 pt-4">
//                 <dl className="space-y-1">
//                   <dt className="font-medium">Delivery address</dt>
//                   {(() => {
//                     const a = order.address.address_data
//                     return (
//                       <>
//                         <dd>
//                           {a.address_line_1}
//                           {a.address_line_2 && `, ${a.address_line_2}`}
//                         </dd>
//                         <dd>
//                           {a.local_area && `${a.local_area}, `}
//                           {a.town}
//                           {a.postcode && ` ${a.postcode}`}
//                         </dd>
//                         <dd>{a.country}</dd>
//                       </>
//                     )
//                   })()}
//                 </dl>
//                 <dl className="space-y-1">
//                   <dt className="font-medium">Buyer</dt>
//                   <dd>
//                     {order.buyer.first_name} {order.buyer.last_name}
//                   </dd>
//                   <dd>{order.buyer.email}</dd>
//                   <dd>{order.buyer.phone_number}</dd>
//                   {/* <button className="mt-2 text-indigo-600 hover:underline text-xs font-medium">
//                     Edit
//                   </button> */}
//                 </dl>
//               </div>
//             </div>
//           )
//         })}
//       </div>

//       {totalPages > 1 && (
//         <Pagination
//           currentPage={pageParam}
//           totalPages={totalPages}
//           onPageChange={handlePageChange}
//         />
//       )}
//     </main>
//   )
// }


// 'use client'

// import React, { useState, useEffect } from 'react'
// import { useSearchParams, useRouter } from 'next/navigation'
// import { useSelector } from 'react-redux'
// import { MdCheck, MdChat } from 'react-icons/md'
// import {
//   AiOutlineLeft,
//   AiOutlineRight,
//   AiOutlineUser,
//   AiOutlineMail,
//   AiOutlinePhone,
//   AiOutlineHome,
// } from 'react-icons/ai'

// const PAGE_SIZE = 20
// const STATUSES = ['Ordered', 'Processing', 'Shipped', 'Received']

// function Pagination({ currentPage, totalPages, onPageChange }) {
//   const [isMobile, setIsMobile] = useState(false)

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth <= 768)
//     handleResize()
//     window.addEventListener('resize', handleResize)
//     return () => window.removeEventListener('resize', handleResize)
//   }, [])

//   const pages = isMobile
//     ? totalPages <= 2
//       ? [1, ...(totalPages === 2 ? [2] : [])]
//       : [1, 2, '...']
//     : totalPages <= 5
//       ? Array.from({ length: totalPages }, (_, i) => i + 1)
//       : currentPage <= 3
//         ? [1, 2, 3, 4, '...', totalPages]
//         : currentPage >= totalPages - 2
//           ? [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
//           : [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]

//   return (
//     <div className="mt-8 flex justify-center overflow-x-auto">
//       <div className="inline-flex items-center space-x-2 px-2">
//         <button
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className="px-3 py-1 flex items-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
//         >
//           <AiOutlineLeft className="mr-1" />
//           Prev
//         </button>
//         {pages.map((p, i) =>
//           typeof p === 'number' ? (
//             <button
//               key={i}
//               onClick={() => onPageChange(p)}
//               className={`px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 ${p === currentPage ? 'bg-violet-700 text-white font-semibold' : ''
//                 }`}
//             >
//               {p}
//             </button>
//           ) : (
//             <span key={i} className="px-3 py-1 text-gray-500">
//               …
//             </span>
//           )
//         )}
//         <button
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           className="px-3 py-1 flex items-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
//         >
//           Next
//           <AiOutlineRight className="ml-1" />
//         </button>
//       </div>
//     </div>
//   )
// }

// function ListingSkeletonCard() {
//   return (
//     <div className="bg-white rounded-lg shadow p-6 space-y-6 animate-pulse">
//       <div className="h-6 bg-gray-200 rounded w-1/4" />
//       <div className="h-5 bg-gray-200 rounded w-1/6 mt-2" />
//       <div className="flex items-center space-x-4 mt-4">
//         <div className="w-24 h-24 bg-gray-300 rounded" />
//         <div className="flex-1 space-y-2">
//           <div className="h-4 bg-gray-200 rounded w-1/2" />
//           <div className="h-4 bg-gray-200 rounded w-1/3" />
//         </div>
//         <div className="w-24 h-8 bg-gray-300 rounded-full" />
//       </div>
//       <div className="relative mt-6">
//         <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 rounded" />
//         <div className="relative flex justify-between z-10">
//           {STATUSES.map((_, i) => (
//             <div key={i} className="w-8 h-8 bg-gray-200 rounded-full" />
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default function OrdersPage() {
//   const searchParams = useSearchParams()
//   const router = useRouter()
//   const token = useSelector((state) => state.auth.token)

//   const pageParam = parseInt(searchParams.get('page') || '1', 10)
//   const [orders, setOrders] = useState([])
//   const [count, setCount] = useState(0)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [statusesByOrder, setStatusesByOrder] = useState({})
//   const [loadingReceiveBy, setLoadingReceiveBy] = useState({})

//   useEffect(() => {
//     if (!token) return
//     setLoading(true)
//     fetch(`https://media.upfrica.com/api/buyer/orders/?page=${pageParam}`, {
//       headers: { Authorization: `Token ${token}` },
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error(`HTTP ${res.status}`)
//         return res.json()
//       })
//       .then((data) => {
//         setOrders(data.results)
//         setCount(data.count)
//       })
//       .catch((err) => setError(err.message))
//       .finally(() => setLoading(false))
//   }, [token, pageParam])

//   useEffect(() => {
//     const init = {}
//     orders.forEach((order) => {
//       const bySeller = {}
//       order.order_items.forEach((item) => {
//         const sid = item.product.user
//         bySeller[sid] =
//           bySeller[sid] ?? (item.receive_status === 1 ? STATUSES.length - 1 : 0)
//       })
//       init[order.id] = bySeller
//     })
//     setStatusesByOrder(init)
//   }, [orders])

//   const totalPages = Math.ceil(count / PAGE_SIZE)
//   const gotoPage = (p) => router.push(`/orders?page=${p}`)

//   const handleReceive = async (orderId, sellerId) => {
//     const key = `${orderId}_${sellerId}`
//     const idx = statusesByOrder[orderId]?.[sellerId] ?? 0
//     const lastIdx = STATUSES.length - 1
//     if (idx === lastIdx) return
//     if (
//       !window.confirm('Confirm you have received all items from this seller.')
//     )
//       return

//     setLoadingReceiveBy((p) => ({ ...p, [key]: true }))
//     try {
//       const order = orders.find((o) => o.id === orderId)
//       const items = order.order_items.filter(
//         (it) => it.product.user === sellerId
//       )
//       const headers = new Headers({
//         Authorization: `Token ${token}`,
//         'Content-Type': 'application/json',
//       })
//       const body = JSON.stringify({ receive_status: 1 })
//       await Promise.all(
//         items.map((it) =>
//           fetch(
//             `https://media.upfrica.com/api/buyer/order-item/${it.id}/`,
//             { method: 'PATCH', headers, body }
//           ).then((r) => {
//             if (!r.ok) throw new Error(`Item ${it.id} failed`)
//             return r.json()
//           })
//         )
//       )
//       setStatusesByOrder((prev) => ({
//         ...prev,
//         [orderId]: { ...prev[orderId], [sellerId]: lastIdx },
//       }))
//       alert('Items marked as received.')
//     } catch (err) {
//       console.error(err)
//       alert('Failed to mark received: ' + err.message)
//     } finally {
//       setLoadingReceiveBy((p) => ({ ...p, [key]: false }))
//     }
//   }

//   if (loading) {
//     return (
//       <main className="space-y-6 max-w-6xl mx-auto px-4 py-8">
//         {Array.from({ length: 3 }).map((_, i) => (
//           <ListingSkeletonCard key={i} />
//         ))}
//       </main>
//     )
//   }
//   if (error) {
//     return <p className="p-6 text-center text-red-600">Error: {error}</p>
//   }

//   return (
//     <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
//       <h1 className="text-3xl font-bold">My Orders</h1>

//       <div className="space-y-8">
//         {orders.map((order) => {
//           const placedDate = new Date(order.created_at).toLocaleDateString(
//             undefined,
//             { year: 'numeric', month: 'long', day: 'numeric' }
//           )
//           const itemsBySeller = order.order_items.reduce((acc, item) => {
//             const sid = item.product.user
//               ; (acc[sid] ||= []).push(item)
//             return acc
//           }, {})

//           return (
//             <div
//               key={order.id}
//               className="bg-white rounded-lg shadow p-6 space-y-1 border border-gray-200"
//             >
//               {/* header + view details */}
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h2 className="text-xl font-semibold">
//                     Order #{String(order.id).padStart(5, '0')}
//                   </h2>
//                   <p className="text-gray-600 text-sm">Placed {placedDate}</p>
//                 </div>
//                 <div
//                   onClick={() => router.push(`/dashboard/all-orders/${order.id}`)}
//                   className="flex items-center space-x-1 text-violet-600 cursor-pointer hover:underline"
//                 >
//                   <span>View Details</span>
//                   <AiOutlineRight />
//                 </div>
//               </div>

//               {/* buyer & delivery address */}
//               <span>Delivery Info:</span>
//               <div className="grid grid-cols-1 items-center ">
//                 <div className="flex items-center space-x-2">
//                   <AiOutlineHome className="text-violet-600" size={18} />
//                   <span className="text-gray-700">
//                     {order.address.address_data.address_line_1}
//                     {order.address.address_data.address_line_2 &&
//                       `, ${order.address.address_data.address_line_2}`}
//                     , {order.address.address_data.local_area},{' '}
//                     {order.address.address_data.town},{' '}
//                     {order.address.address_data.country}
//                   </span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <AiOutlineUser className="text-violet-600" size={18} />
//                   <span className="text-gray-700">
//                     {order.buyer.first_name} {order.buyer.last_name}
//                   </span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <AiOutlineMail className="text-violet-600" size={18} />
//                   <span className="text-gray-700">{order.buyer.email}</span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <AiOutlinePhone className="text-violet-600" size={18} />
//                   <span className="text-gray-700">
//                     {order.address.address_data.phone_number}
//                   </span>
//                 </div>
                
//               </div>

//               {/* per-seller sections */}
//               {Object.entries(itemsBySeller).map(([sellerId, items]) => {
//                 const idx = statusesByOrder[order.id]?.[sellerId] ?? 0
//                 const key = `${order.id}_${sellerId}`
//                 const isLoading = loadingReceiveBy[key]

//                 return (
//                   <section key={sellerId} className="space-y-4">
//                     <div className="flex justify-between items-center">
//                       <h3 className="text-lg font-medium">
//                         Seller #{sellerId}
//                       </h3>
//                       <button
//                         // onClick={() => router.push(`/chat/${sellerId}`)}
//                         className="flex items-center space-x-1 px-4 py-2 bg-violet-600 text-white rounded-full hover:bg-violet-700 transition"
//                       >
//                         <MdChat size={18} />
//                         <span>Contact Seller</span>
//                       </button>
//                     </div>

//                     {/* products */}
//                     <div className="space-y-4">
//                       {items.map((item) => (
//                         <div
//                           key={item.id}
//                           className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm"
//                         >
//                           <img
//                             src={item.product.product_images[0]}
//                             alt={item.product.title}
//                             className="w-24 h-24 object-cover rounded"
//                           />
//                           <div className="ml-4 flex-1">
//                             <h4 className="font-semibold">
//                               {item.product.title}
//                             </h4>
//                             <p className="text-gray-700 mt-1">
//                               ${(item.price_cents / 100).toFixed(2)} ×{' '}
//                               {item.quantity}
//                             </p>
//                           </div>
//                           <button
//                             onClick={() =>
//                               handleReceive(order.id, Number(sellerId))
//                             }
//                             disabled={idx === STATUSES.length - 1 || isLoading}
//                             className={`px-4 py-2 rounded-full font-medium transition ${idx === STATUSES.length - 1
//                                 ? 'bg-gray-300 text-gray-600 cursor-default'
//                                 : 'bg-violet-600 text-white hover:bg-violet-700'
//                               }`}
//                           >
//                             {isLoading
//                               ? 'Receiving…'
//                               : idx === STATUSES.length - 1
//                                 ? 'Received'
//                                 : 'Mark Received'}
//                           </button>
//                         </div>
//                       ))}
//                     </div>

//                     {/* status bar */}
//                     <div className="relative my-6">
//                       <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 rounded" />
//                       <div className="relative flex justify-between z-10">
//                         {STATUSES.map((_, i) => (
//                           <div
//                             key={i}
//                             className={`w-8 h-8 flex items-center justify-center rounded-full ${i <= idx
//                                 ? 'bg-violet-600 text-white'
//                                 : 'bg-gray-200 text-gray-400'
//                               }`}
//                           >
//                             {i <= idx && <MdCheck />}
//                           </div>
//                         ))}
//                       </div>
//                       <div className="relative flex justify-between mt-2 text-sm text-center">
//                         {STATUSES.map((label, i) => (
//                           <span key={i} className="w-16">
//                             {label}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   </section>
//                 )
//               })}
//             </div>
//           )
//         })}
//       </div>

//       {totalPages > 1 && (
//         <Pagination
//           currentPage={pageParam}
//           totalPages={totalPages}
//           onPageChange={gotoPage}
//         />
//       )}
//     </main>
//   )
// }

import React from 'react';

const page1 = () => {
  return (
    <div>
      <h1>orders2</h1>
    </div>
  );
};

export default page1;
