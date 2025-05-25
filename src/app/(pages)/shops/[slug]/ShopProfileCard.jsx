
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import {
//   FacebookShareButton,
//   TwitterShareButton,
//   WhatsappShareButton,
//   LinkedinShareButton,
//   FacebookIcon,
//   TwitterIcon,
//   WhatsappIcon,
//   LinkedinIcon,
// } from 'next-share';
// import { CopyToClipboard } from 'react-copy-to-clipboard';
// import { HiOutlinePlus } from 'react-icons/hi';
// import { FiShare2 } from 'react-icons/fi';
// import { FaCopy, FaCheckCircle, FaEdit, FaTimes } from 'react-icons/fa';
// import { motion, AnimatePresence } from 'framer-motion';

// export default function ShopProfileCard({ shop, user, setIsEditOpen }) {
//   const router = useRouter();
//   const [isFollowing, setIsFollowing] = useState(false);
//   const [copied, setCopied] = useState(false);
//   const [shareModalOpen, setShareModalOpen] = useState(false);
//   const [currentUrl, setCurrentUrl] = useState('');

//   // Grab the current URL client-side
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       setCurrentUrl(window.location.href);
//     }
//   }, [router]);

//   const handleCopy = () => {
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   if (!shop || !shop.name) {
//     return (
//       <div className="flex items-center justify-center h-40">
//         <span className="text-gray-400 animate-pulse">Loading shop...</span>
//       </div>
//     );
//   }

//   const shopType = shop.shoptype?.name || 'General Goods';

//   return (
//     <div className="relative w-full animate-fadeInUp">
//       {/* Background Cover */}
//       <img
//         src={
//           shop.top_banner ||
//           'https://images.pexels.com/photos/34577/pexels-photo.jpg'
//         }
//         alt="Shop Banner"
//         className="w-full object-cover h-[240px] md:h-[320px] rounded-lg"
//       />

//       {/* Profile Card */}
//       <div className="absolute inset-0 flex items-center justify-center px-4">
//         <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-4 w-full max-w-md text-center space-y-4">
//           {/* Logo */}
//           <div className="h-20 w-20 rounded-full bg-gray-200 overflow-hidden mx-auto">
//             {shop.shop_logo ? (
//               <img
//                 src={shop.shop_logo}
//                 alt="Shop Logo"
//                 className="object-cover w-full h-full"
//                 onError={(e) => (e.currentTarget.style.display = 'none')}
//               />
//             ) : (
//               <div className="h-full w-full flex items-center justify-center text-gray-500">
//                 Logo
//               </div>
//             )}
//           </div>

//           {/* Name + Edit */}
//           <div className="flex items-center justify-center gap-2">
//             <h1 className="text-2xl font-bold text-gray-800">{shop.name}</h1>
//             {user && (
//               <motion.button
//                 onClick={() => setIsEditOpen(true)}
//                 className="p-1 rounded-full hover:bg-gray-200"
//                 title="Edit Shop"
//                 whileTap={{ scale: 0.9 }}
//               >
//                 <FaEdit className="text-gray-500 text-sm" />
//               </motion.button>
//             )}
//           </div>

//           {/* Category */}
//           <p className="text-gray-600">{shopType}</p>

//           {/* Actions */}
//           <div className="flex items-center justify-center gap-4">
//             <button
//               onClick={() => setIsFollowing(!isFollowing)}
//               className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition ${isFollowing
//                   ? 'bg-gray-200 text-gray-700'
//                   : 'bg-violet-600 text-white'
//                 }`}
//             >
//               <HiOutlinePlus />
//               {isFollowing ? 'Following' : 'Follow'}
//             </button>
//             <span>2K followers</span>

//             <motion.button
//               onClick={() => setShareModalOpen(true)}
//               whileTap={{ scale: 0.9 }}
//               className="p-2 rounded-full hover:bg-gray-200"
//               title="Share shop"
//             >
//               <FiShare2 className="text-lg" />
//             </motion.button>
//           </div>

//           {/* Sold / Verified / Location */}
//           <div className="flex flex-wrap items-center justify-center gap-2 text-gray-700 text-sm">
//             <span>400+ items </span>
//             <FaCheckCircle />
//             <span>Verified</span>
//             <span>🇬🇭 Accra, GH</span>
//           </div>
//         </div>
//       </div>

//       {/* Share Modal */}
//       <AnimatePresence>
//         {shareModalOpen && (
//           <>
//             {/* Backdrop */}
//             <motion.div
//               className="fixed inset-0 bg-black bg-opacity-40 z-40"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setShareModalOpen(false)}
//             />

//             {/* Modal */}
//             <motion.div
//               className="fixed inset-0 flex items-center justify-center z-50"
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.8, opacity: 0 }}
//             >
//               <div className="relative bg-white rounded-lg p-6 space-y-4 max-w-xs w-full">
//                 {/* Close icon */}
//                 <button
//                   onClick={() => setShareModalOpen(false)}
//                   className="absolute top-2 right-2 p-1 rounded hover:bg-gray-100"
//                   title="Close"
//                 >
//                   <FaTimes className="text-gray-600" />
//                 </button>

//                 <h2 className="text-lg font-semibold">Share this shop</h2>

//                 <div className="flex justify-around">
//                   <FacebookShareButton url={currentUrl} quote={shop.name}>
//                     <FacebookIcon size={48} round />
//                   </FacebookShareButton>
//                   <TwitterShareButton url={currentUrl} title={shop.name}>
//                     <TwitterIcon size={48} round />
//                   </TwitterShareButton>
//                   <WhatsappShareButton url={currentUrl} title={shop.name}>
//                     <WhatsappIcon size={48} round />
//                   </WhatsappShareButton>
//                   <LinkedinShareButton url={currentUrl} title={shop.name}>
//                     <LinkedinIcon size={48} round />
//                   </LinkedinShareButton>
//                 </div>

//                 <div className="flex items-center justify-center gap-2">
//                   <CopyToClipboard text={currentUrl} onCopy={handleCopy}>
//                     <button className="flex items-center gap-1 px-3 py-2 border rounded-full hover:bg-gray-100">
//                       {copied ? (
//                         <FaCheckCircle className="text-green-500" />
//                       ) : (
//                         <FaCopy />
//                       )}
//                       <span>{copied ? 'Copied' : 'Copy link'}</span>
//                     </button>
//                   </CopyToClipboard>
//                 </div>

//                 <button
//                   onClick={() => setShareModalOpen(false)}
//                   className="mt-2 text-sm text-gray-500 hover:underline"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }



'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
} from 'next-share';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy, FaCheckCircle, FaEdit, FaTimes, FaHeart, FaRegHeart } from 'react-icons/fa';
import { FiShare2 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function ShopProfileCard({ shop, user: seller, setIsEditOpen }) {
  const router = useRouter();
  const { user: currentUser, token } = useSelector(s => s.auth);

  // share state
  const [copied, setCopied] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  // follow state
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [loadingFollow, setLoadingFollow] = useState(false);

  const API_BASE = 'https://media.upfrica.com/api';

  // grab URL client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, [router]);

  // fetch initial follow status & counts
  useEffect(() => {
    if (!shop?.user?.id) return;
    const headers = {};
    if (token) headers['Authorization'] = `Token ${token}`;

    fetch(`${API_BASE}/users/${shop?.user?.id}/follow/status/`, {
      method: 'GET',
      headers,
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch follow status');
        return res.json();
      })
      .then(data => {
        console.log('Follow status data:', data);
        setIsFollowing(data.is_following);
        setFollowersCount(data.followers_count);
        setProductsCount(data.products_count);
      })
      .catch(console.error);
  }, [seller?.id, token]);

  // toggle follow/unfollow
  const handleToggleFollow = async () => {
    if (!token) {
      alert('Please log in to follow sellers.');
      return;
    }
    if (!seller?.id) return;
    setLoadingFollow(true);

    try {
      const res = await fetch(`${API_BASE}/users/${shop?.user?.id}/follow/`, {
        method: isFollowing ? 'DELETE' : 'POST',
        headers: { 'Authorization': `Token ${token}` },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 400 && errData.detail === "Can't follow yourself.") {
          alert("You can't follow yourself.");
        } else {
          throw new Error(errData.detail || 'Follow action failed');
        }
      } else {
        setIsFollowing(f => !f);
        setFollowersCount(n => n + (isFollowing ? -1 : 1));
      }
    } catch (err) {
      console.error(err);
      alert('Could not update follow status.');
    } finally {
      setLoadingFollow(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl).catch(console.error);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!shop || !shop.name) {
    return (
      <div className="flex items-center justify-center h-40">
        <span className="text-gray-400 animate-pulse">Loading shop...</span>
      </div>
    );
  }

  const shopType = shop.shoptype?.name || 'General Goods';

  return (
    <div className="relative w-full animate-fadeInUp">
      {/* Background Cover */}
      <img
        src={shop.top_banner || 'https://images.pexels.com/photos/34577/pexels-photo.jpg'}
        alt="Shop Banner"
        className="w-full object-cover h-[240px] md:h-[320px] rounded-lg"
      />

      {/* Profile Card */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-4 w-full max-w-md text-center space-y-4">
          {/* Logo */}
          <div className="h-20 w-20 rounded-full bg-gray-200 overflow-hidden mx-auto">
            {shop.shop_logo ? (
              <img
                src={shop.shop_logo}
                alt="Shop Logo"
                className="object-cover w-full h-full"
                onError={e => (e.currentTarget.style.display = 'none')}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-500">
                Logo
              </div>
            )}
          </div>

          {/* Name + Edit */}
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-bold text-gray-800">{shop.name}</h1>
            {currentUser && currentUser.id === seller.id && (
              <motion.button
                onClick={() => setIsEditOpen(true)}
                className="p-1 rounded-full hover:bg-gray-200"
                title="Edit Shop"
                whileTap={{ scale: 0.9 }}
              >
                <FaEdit className="text-gray-500 text-sm" />
              </motion.button>
            )}
          </div>

          {/* Category */}
          <p className="text-gray-600">{shopType}</p>

          {/* Actions */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleToggleFollow}
              disabled={loadingFollow}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition
                ${isFollowing ? 'bg-gray-200 text-violet-700 border border-violet-700' : 'bg-white text-gray-700 border border-gray-300'}
                disabled:opacity-50
              `}
            >
              {loadingFollow ? (
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-gray-700 rounded-full animate-bounce" />
                  <div className="h-2 w-2 bg-gray-700 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="h-2 w-2 bg-gray-700 rounded-full animate-bounce [animation-delay:-0.3s]" />
                </div>
              ) : (
                <>
                  {isFollowing ? <FaHeart className="text-violet-700" /> : <FaRegHeart className="text-gray-600" />}
                  <span>{isFollowing ? 'Following' : 'Follow'}</span>
                </>
              )}
            </button>

            <span>{followersCount} follower{followersCount !== 1 && 's'}</span>

            <motion.button
              onClick={() => setShareModalOpen(true)}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-gray-200"
              title="Share shop"
            >
              <FiShare2 className="text-lg" />
            </motion.button>
          </div>

          {/* Sold / Verified / Location */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-gray-700 text-sm">
            <span>{productsCount ?? '—'} items</span>
            <FaCheckCircle />
            <span>Verified</span>
            <span>🇬🇭 Accra, GH</span>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {shareModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShareModalOpen(false)}
            />

            {/* Modal */}
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="relative bg-white rounded-lg p-6 space-y-4 max-w-xs w-full">
                {/* Close icon */}
                <button
                  onClick={() => setShareModalOpen(false)}
                  className="absolute top-2 right-2 p-1 rounded hover:bg-gray-100"
                  title="Close"
                >
                  <FaTimes className="text-gray-600" />
                </button>

                <h2 className="text-lg font-semibold">Share this shop</h2>

                <div className="flex justify-around">
                  <FacebookShareButton url={currentUrl} quote={shop.name}>
                    <FacebookIcon size={48} round />
                  </FacebookShareButton>
                  <TwitterShareButton url={currentUrl} title={shop.name}>
                    <TwitterIcon size={48} round />
                  </TwitterShareButton>
                  <WhatsappShareButton url={currentUrl} title={shop.name}>
                    <WhatsappIcon size={48} round />
                  </WhatsappShareButton>
                  <LinkedinShareButton url={currentUrl} title={shop.name}>
                    <LinkedinIcon size={48} round />
                  </LinkedinShareButton>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <CopyToClipboard text={currentUrl} onCopy={handleCopy}>
                    <button className="flex items-center gap-1 px-3 py-2 border rounded-full hover:bg-gray-100">
                      {copied ? (
                        <FaCheckCircle className="text-green-500" />
                      ) : (
                        <FaCopy />
                      )}
                      <span>{copied ? 'Copied' : 'Copy link'}</span>
                    </button>
                  </CopyToClipboard>
                </div>

                <button
                  onClick={() => setShareModalOpen(false)}
                  className="mt-2 text-sm text-gray-500 hover:underline"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
