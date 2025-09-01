//components/review/SubmitReviewForm.jsx
"use client"

import { useState } from "react"

export default function SubmitReviewForm({ product }) {
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState("")
  const [text, setText] = useState("")
  const [files, setFiles] = useState([])
  const [agreed, setAgreed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!agreed || !rating || !text) return alert("Please complete the form")
    setSubmitting(true)

    const formData = new FormData()
    formData.append("product", product.id)
    formData.append("rating", rating)
    formData.append("title", title)
    formData.append("text", text)
    files.forEach((f) => formData.append("media", f))

    const res = await fetch(`/api/product/${product.id}/reviews/`, {
      method: "POST",
      body: formData,
    })

    if (res.ok) {
      setSuccess(true)
    } else {
      alert("Failed to submit review")
    }

    setSubmitting(false)
  }

  if (success) {
    return (
      <div className="text-green-600">
        🎉 Thanks for your review! You've earned 20 points.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <label className="block">
        ⭐ Rating:
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
          className="ml-2 border p-1 w-16"
        />
      </label>

      <label className="block">
        📝 Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Superb Product"
          className="w-full border p-2 rounded"
        />
      </label>

      <label className="block">
        💬 Review:
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your experience"
          className="w-full border p-2 rounded"
          rows={4}
          required
        />
      </label>

      <label className="block">
        📷 Upload photo(s) or video (optional):
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={(e) => setFiles([...e.target.files])}
          className="block mt-1"
        />
      </label>

      <label className="block text-sm">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mr-2"
        />
        ✅ I agree to the terms and confirm my review is honest.
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
      >
        {submitting ? "Submitting..." : "Submit Review & Earn Points"}
      </button>
    </form>
  )
}