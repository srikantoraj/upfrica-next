// /src/app/[region]/[slug]/write-review/page.jsx
// ✅ FULLY UPDATED REVIEW FORM WITH VIDEO SUPPORT AND MEDIA LIMITS FIXED
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FaStar } from 'react-icons/fa'
import classNames from 'classnames'
import { BASE_API_URL } from '@/app/constants'
import { useAuth } from '@/contexts/AuthContext'
import { showToast } from '@/app/utils/showToast'
import axios from 'axios'

export default function WriteReviewForm() {
  const { user, token, hydrated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const productIdRaw = searchParams.get('product_id')
  const productId = Number.isInteger(Number(productIdRaw)) ? Number(productIdRaw) : null
  const orderItemId = searchParams.get('order_item_id')

  const [rating, setRating] = useState(0)
  const [sellerRating, setSellerRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [sellerComment, setSellerComment] = useState('')
  const [images, setImages] = useState([])
  const [video, setVideo] = useState(null)
  const [media, setMedia] = useState([])
  const [previewUrls, setPreviewUrls] = useState([])
  const [product, setProduct] = useState(null)
  const [tags, setTags] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [tagGroups, setTagGroups] = useState([])
  const [allTags, setAllTags] = useState([])
  const [uploadProgress, setUploadProgress] = useState(null)

  useEffect(() => {
    if (hydrated && !user) {
      const nextUrl = window.location.pathname + window.location.search
      router.push(`/login?next=${encodeURIComponent(nextUrl)}`)
    }
  }, [hydrated, user, router])

  useEffect(() => {
    if (!user || !token || !productId) return
    const fetchProduct = async () => {
      try {
        const authToken = token || localStorage.getItem("token")?.replace(/^"|"$/g, "")
        const res = await fetch(`${BASE_API_URL}/api/products/${productId}/`, {
          headers: { Authorization: `Token ${authToken}` },
        })
        if (!res.ok) throw new Error('Failed to fetch product')
        setProduct(await res.json())
      } catch (err) {
        console.error('❌ Failed to fetch product info:', err)
      }
    }
    fetchProduct()
  }, [user, token, productId])

  useEffect(() => {
    if (!user || !token) return
    const fetchTags = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/api/review-tags/grouped/`)
        const data = await res.json()
        if (Array.isArray(data?.results)) {
          setTagGroups(data.results)
          setAllTags(data.results.flatMap(group => group.tags))
        }
      } catch (err) {
        console.error('❌ Failed to fetch tags:', err)
      }
    }
    fetchTags()
  }, [user, token])

  const toggleTag = (tagLabel) => {
    const tag = allTags.find(t => t.label === tagLabel)
    if (!tag) return
    const conflicts = tag.conflicts.map(id => allTags.find(t => t.id === id)?.label).filter(Boolean)
    const conflictingSelected = conflicts.find((c) => tags.includes(c))
    if (conflictingSelected) {
      showToast(`Tag conflict: "${tagLabel}" conflicts with "${conflictingSelected}".`)
      return
    }
    setTags((prev) => prev.includes(tagLabel) ? prev.filter(t => t !== tagLabel) : [...prev, tagLabel])
  }

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files)
    const imageFiles = files.filter(f => f.type.startsWith('image/'))
    const videoFiles = files.filter(f => f.type.startsWith('video/'))

    if (videoFiles.length > 0 && video) {
      showToast('Only one video is allowed per review')
      return
    }

    const newImageCount = images.length + imageFiles.length
    if (newImageCount > 4) {
      showToast('You can upload a maximum of 4 images.')
      return
    }

    if (videoFiles.length > 0) {
      const videoFile = videoFiles[0]
      if (videoFile.size > 60 * 1024 * 1024) {
        showToast('Video must be under 60MB.')
        return
      }
      setVideo(videoFile)
      setPreviewUrls(prev => [...prev, URL.createObjectURL(videoFile)])
    }

    const updatedImages = [...images, ...imageFiles]
    setImages(updatedImages)
    setPreviewUrls(prev => [...prev, ...imageFiles.map(f => URL.createObjectURL(f))])
    setMedia([...updatedImages, ...(videoFiles.length ? [videoFiles[0]] : video ? [video] : [])])
  }

  const handleRemoveFile = (index) => {
    const isVideo = video && index === images.length
    const newImages = [...images]
    const newPreviews = [...previewUrls]

    if (isVideo) {
      setVideo(null)
      newPreviews.splice(index, 1)
    } else {
      newImages.splice(index, 1)
      newPreviews.splice(index, 1)
    }

    setImages(newImages)
    setPreviewUrls(newPreviews)
    setMedia([...newImages, ...(video ? [video] : [])])

    if (newImages.length === 0 && !video) {
      setPreviewUrls([])
    }
  }

const handleSubmit = async (e) => {
  e.preventDefault()
  const authToken = token || localStorage.getItem("token")?.replace(/^"|"$/g, "")
  if (!orderItemId || !user || !authToken || !productId) {
    showToast("Missing required data. Please log in again.")
    return
  }

  try {
    const formData = new FormData()

    // Required fields
    if (productId) formData.append("product_id", String(productId))
    if (orderItemId) formData.append("order_item_id", String(orderItemId))
    if (rating !== null && rating !== undefined) formData.append("rating", String(rating))
    if (title?.trim()) formData.append("title", title.trim())
    if (comment?.trim()) formData.append("comment", comment.trim())

    // Optional seller review
    if (sellerRating > 0) {
      formData.append("seller_rating", String(sellerRating))
    }
    if (sellerComment?.trim() && sellerRating > 0) {
      formData.append("seller_comment", sellerComment.trim())
    }

    // Tags
    if (Array.isArray(tags)) {
      tags.forEach(tag => {
        if (tag?.trim()) formData.append("tags", tag)
      })
    }

    // Media
    if (Array.isArray(images)) {
      images.forEach(file => {
        if (file instanceof File) formData.append("media", file)
      })
    }

    if (video && video instanceof File) {
      formData.append("media", video)
    }

    const res = await axios.post(`${BASE_API_URL}/api/reviews/submit/`, formData, {
      headers: {
        Authorization: `Token ${authToken}`,
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (event) => {
        const percent = Math.round((event.loaded * 100) / event.total)
        setUploadProgress(percent)
      },
    })

    const data = res.data

    // ✅ Reset form fields
    setTitle("")
    setComment("")
    setRating(null)
    setSellerRating(0)
    setSellerComment("")
    setTags([])
    setImages([])
    setVideo(null)
    setUploadProgress(null)
    setSubmitted(true)

    // ✅ Delay redirect
    setTimeout(() => {
      const region = window.location.pathname.split("/")[1]
      const slug = data?.product_slug || window.location.pathname.split("/")[2]
      router.push(`/${region}/${slug}#reviews`)
    }, 3000)

  } catch (err) {
    console.error('❌ Submit failed:', err)
    setUploadProgress(null)

    const error = err?.response?.data?.detail || 'Submit failed. Please try again.'
    showToast(error)
  }
}
  const getCommentPlaceholder = () => {
    if (rating <= 2) return 'What went wrong or disappointed you?'
    if (rating === 3) return 'What was okay and what could be improved?'
    if (rating >= 4) return 'What did you love most about the product?'
    return 'Share your product experience'
  }

  const score = rating * 5 + sellerRating * 2 + tags.length + (comment.length > 20 ? 5 : 0)

  if (!hydrated) return <div className="text-center py-10">Loading...</div>
  if (!user) return null

const mainImage =
  product?.image ||
  product?.thumbnail ||
  product?.image_objects?.find(img => img.is_main)?.image_url ||
  product?.image_objects?.[0]?.image_url ||
  "/placeholder.png"


  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">📝 Write a Review</h1>

{product && (
  <div className="flex items-start gap-4 mb-6">
    <img
      src={mainImage}
      alt={product.title}
      className="w-20 h-20 object-cover rounded border"
    />
    <div>
      <p className="font-semibold text-lg">{product.title}</p>
      <p className="text-sm text-gray-500">You're reviewing this product</p>
    </div>
  </div>
)}

      <div className="sticky top-0 z-20 bg-white py-2">
        <label className="font-semibold text-base flex justify-between">
          🎯 Review Score <span>{score} / 50 points</span>
        </label>
        <div className="h-2 bg-gray-200 rounded">
          <div
            className="h-2 bg-purple-500 rounded transition-all"
            style={{ width: `${Math.min(score, 50)}%` }}
          />
        </div>
      </div>

{submitted && (
  <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded mb-6">
    ✅ Review submitted successfully! Your review will be reviewed before points are awarded.
    <button
      className="ml-4 underline text-sm text-green-800"
      onClick={() => {
        const region = window.location.pathname.split("/")[1]
        const slug = window.location.pathname.split("/")[2]
        router.push(`/${region}/${slug}#reviews`)
      }}
    >
      Return to product
    </button>
  </div>
)}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="font-semibold text-lg flex items-center gap-2">📦 Rate the Product</label>
          <StarRating rating={rating} setRating={setRating} />
          {rating > 0 && <p className="text-sm text-purple-600 mt-1">👍 Great! Now tell us what stood out.</p>}
        </div>

        {rating > 0 && (
          <>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              placeholder="Title your review (required)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              className="w-full border px-3 py-2 rounded"
              rows={4}
              placeholder={getCommentPlaceholder()}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </>
        )}


{uploadProgress !== null && (
  <div className="my-4">
    <label className="text-sm font-medium text-gray-700">Uploading media...</label>
    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
      <div
        className="bg-purple-600 h-2.5 rounded-full transition-all"
        style={{ width: `${uploadProgress}%` }}
      ></div>
    </div>
    <p className="text-sm text-gray-600 mt-1 text-right">{uploadProgress}%</p>
  </div>
)}


        {rating > 0 && (
          <div>
            <label className="font-semibold flex items-center gap-2">
              📷 Add photos or videos <span className="text-sm text-gray-500">(up to 5 files)</span>
            </label>

<input
  type="file"
  accept="image/*,video/*"
  capture="environment"
  multiple
  onChange={handleMediaChange}
  className="mt-2 block w-full"
  disabled={images.length >= 4 && video !== null}
/>

{(images.length >= 4 || video) && (
  <p className="text-sm text-gray-500 mt-1">
    {images.length >= 4 && video
      ? 'Limit reached: 4 images and 1 video.'
      : images.length >= 4
      ? 'You’ve reached the 4-image limit.'
      : video
      ? 'You’ve uploaded the maximum 1 video.'
      : ''}
  </p>
)}
            {previewUrls.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {previewUrls.map((src, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded overflow-hidden border shadow group">
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(idx)}
                      className="absolute top-0 right-0 bg-black bg-opacity-60 text-white text-xs rounded-bl px-1 py-0.5 group-hover:block z-10"
                      title="Remove"
                    >
                      ✕
                    </button>
                    {src.endsWith('.mp4') || src.includes('blob:') && video ? (
                      <video src={src} className="w-full h-full object-cover" controls />
                    ) : (
                      <img src={src} className="w-full h-full object-cover" alt={`upload-${idx}`} />
                    )}
                    <p className="text-xs mt-0.5 text-center truncate">{media[idx]?.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {rating > 0 && Array.isArray(tagGroups) && tagGroups.map((group) => (
          <div key={group.id}>
            <label className="font-semibold flex items-center gap-2 text-lg mt-4">{group.icon} {group.name}</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {group.tags.map((tag) => {
                const tagLabel = tag.label
                const conflicts = tag.conflicts.map(id => allTags.find(t => t.id === id)?.label).filter(Boolean)
                const disabled = conflicts.some(conflict => tags.includes(conflict))
                const tooltip = disabled
                  ? `Conflicts with “${conflicts.find((c) => tags.includes(c))}”`
                  : tag.description || ''

                return (
                  <label
                    key={tag.id}
                    title={tooltip}
                    className={classNames(
                      'flex items-center gap-2 text-sm rounded px-2 py-1 border transition-colors',
                      {
                        'border-red-500 bg-red-50 text-red-700 opacity-60 cursor-not-allowed': disabled,
                        'border-gray-300 hover:bg-purple-100 cursor-pointer': !disabled,
                      }
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={tags.includes(tagLabel)}
                      disabled={disabled}
                      onChange={() => toggleTag(tagLabel)}
                      className="accent-purple-600 disabled:cursor-not-allowed"
                    />
                    {tagLabel}
                  </label>
                )
              })}
            </div>
          </div>
        ))}

        {rating > 0 && (
          <div>
            <label className="font-semibold text-lg flex items-center gap-2 mt-6">🎁 Rate the Seller</label>
            <StarRating rating={sellerRating} setRating={setSellerRating} />
            <textarea
              className="w-full border px-3 py-2 rounded mt-2"
              rows={3}
              placeholder="How was your experience with the seller?"
              value={sellerComment}
              onChange={(e) => setSellerComment(e.target.value)}
            />
          </div>
        )}

        {rating > 0 && (
<button
  type="submit"
  disabled={uploadProgress !== null}
  className={`bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold text-base flex items-center gap-2 ${uploadProgress !== null ? 'opacity-50 cursor-not-allowed' : ''}`}
>
  🎁 Submit Review & Earn Points
</button>
        )}
      </form>
    </div>
  )
}

function StarRating({ rating, setRating }) {
  const [hover, setHover] = useState(null)
  return (
    <div className="flex gap-2 mt-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => setRating(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          <FaStar
            size={40}
            className={(hover || rating) >= i ? 'text-yellow-500' : 'text-gray-300'}
          />
        </button>
      ))}
    </div>
  )
}