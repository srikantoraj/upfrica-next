// 'use client'

// import React, { useEffect, useState } from 'react'
// import Head from 'next/head'
// import { FaEdit, FaTrash } from 'react-icons/fa'
// import { useSelector } from 'react-redux'

// export default function BlogCategoriesPage() {
//     const { token } = useSelector((state) => state.auth)

//     const [categories, setCategories] = useState([])
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState(null)

//     const [showEditModal, setShowEditModal] = useState(false)
//     const [currentCat, setCurrentCat] = useState(null)
//     const [formData, setFormData] = useState({ name: '', slug: '', parent: null })

//     const [deleteLoadingId, setDeleteLoadingId] = useState(null)
//     const [updateLoading, setUpdateLoading] = useState(false)

//     const header = {
//         Authorization: `Token ${token}`,
//         'Content-Type': 'application/json',
//     }

//     // Fetch categories once (when token is available)
//     useEffect(() => {
//         if (!token) return
//         fetch('https://media.upfrica.com/api/blog-categories/', { headers: header })
//             .then((res) => {
//                 if (!res.ok) throw new Error(`Status ${res.status}`)
//                 return res.json()
//             })
//             .then((data) => {
//                 setCategories(data)
//                 setLoading(false)
//             })
//             .catch((err) => {
//                 console.error(err)
//                 setError('Failed to load categories.')
//                 setLoading(false)
//             })
//     }, [token])

//     // Open edit modal and pre-fill form
//     const openEdit = (cat) => {
//         setCurrentCat(cat)
//         setFormData({ name: cat.name, slug: cat.slug, parent: cat.parent })
//         setShowEditModal(true)
//     }

//     // Handle form field changes
//     const onChange = (e) => {
//         const { name, value } = e.target
//         setFormData((f) => ({
//             ...f,
//             [name]: name === 'parent' ? (value === '' ? null : Number(value)) : value,
//         }))
//     }

//     // Submit update
//     const submitUpdate = async (e) => {
//         e.preventDefault()
//         if (!confirm(`Update category “${currentCat.name}”?`)) return

//         setUpdateLoading(true)
//         try {
//             const res = await fetch(
//                 `https://media.upfrica.com/api/admin/blog-categories/${currentCat.id}/`,
//                 {
//                     method: 'PUT',
//                     headers: header,
//                     body: JSON.stringify(formData),
//                 }
//             )
//             if (!res.ok) throw new Error(`Status ${res.status}`)
//             const updated = await res.json()

//             // replace in list
//             setCategories((cats) =>
//                 cats.map((c) => (c.id === updated.id ? updated : c))
//             )
//             setShowEditModal(false)
//         } catch (err) {
//             console.error(err)
//             alert('Failed to update.')
//         } finally {
//             setUpdateLoading(false)
//         }
//     }

//     // Delete category
//     const deleteCat = async (id) => {
//         if (!confirm('Are you sure you want to delete this category?')) return
//         setDeleteLoadingId(id)
//         try {
//             const res = await fetch(
//                 `https://media.upfrica.com/api/admin/blog-categories/${id}/`,
//                 {
//                     method: 'DELETE',
//                     headers: header,
//                 }
//             )
//             if (!res.ok) throw new Error(`Status ${res.status}`)
//             setCategories((cats) => cats.filter((c) => c.id !== id))
//         } catch (err) {
//             console.error(err)
//             alert('Failed to delete.')
//         } finally {
//             setDeleteLoadingId(null)
//         }
//     }

//     // Render flat list of categories
//     const renderList = () =>
//         categories.map((cat) => {
//             // find the name of the parent, if any
//             const parentName =
//                 cat.parent != null
//                     ? categories.find((p) => p.id === cat.parent)?.name || '—'
//                     : 'None'

//             return (
//                 <div
//                     key={cat.id}
//                     className="flex items-center justify-between bg-white p-4 rounded shadow mb-2"
//                 >
//                     <div>
//                         <strong>{cat.name}</strong>{' '}
//                         <span className="text-sm text-gray-500">({cat.slug})</span>
//                         <div className="text-xs text-gray-600">Parent: {parentName}</div>
//                     </div>
//                     <div className="flex space-x-2">
//                         <button
//                             onClick={() => openEdit(cat)}
//                             className="p-2 hover:bg-gray-100 rounded"
//                         >
//                             <FaEdit />
//                         </button>
//                         <button
//                             onClick={() => deleteCat(cat.id)}
//                             disabled={deleteLoadingId === cat.id}
//                             className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
//                         >
//                             {deleteLoadingId === cat.id ? '…' : <FaTrash />}
//                         </button>
//                     </div>
//                 </div>
//             )
//         })

//     return (
//         <>
//             <Head>
//                 <title>Blog Categories</title>
//             </Head>
//             <main className="min-h-screen bg-gray-50 p-6">
//                 <h1 className="text-2xl font-bold mb-4">Blog Categories</h1>

//                 {loading && <p>Loading…</p>}
//                 {error && <p className="text-red-500">{error}</p>}
//                 {!loading && !error && renderList()}

//                 {/* Edit Modal */}
//                 {showEditModal && (
//                     <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
//                         <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
//                             <h2 className="text-lg font-semibold mb-4">Edit Category</h2>
//                             <form onSubmit={submitUpdate} className="space-y-4">
//                                 <div>
//                                     <label className="block text-sm">Name</label>
//                                     <input
//                                         name="name"
//                                         value={formData.name}
//                                         onChange={onChange}
//                                         className="w-full border px-3 py-2 rounded"
//                                         required
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm">Slug</label>
//                                     <input
//                                         name="slug"
//                                         value={formData.slug}
//                                         onChange={onChange}
//                                         className="w-full border px-3 py-2 rounded"
//                                         required
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm">Parent (optional)</label>
//                                     <select
//                                         name="parent"
//                                         value={formData.parent ?? ''}
//                                         onChange={onChange}
//                                         className="w-full border px-3 py-2 rounded"
//                                     >
//                                         <option value="">None</option>
//                                         {categories
//                                             .filter((c) => c.id !== currentCat.id)
//                                             .map((c) => (
//                                                 <option key={c.id} value={c.id}>
//                                                     {c.name}
//                                                 </option>
//                                             ))}
//                                     </select>
//                                 </div>
//                                 <div className="flex justify-end space-x-2">
//                                     <button
//                                         type="button"
//                                         onClick={() => setShowEditModal(false)}
//                                         className="px-4 py-2 rounded border"
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button
//                                         type="submit"
//                                         disabled={updateLoading}
//                                         className="px-4 py-2 rounded bg-violet-600 text-white disabled:opacity-50"
//                                     >
//                                         {updateLoading ? '…' : 'Save'}
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 )}
//             </main>
//         </>
//     )
// }


'use client'

import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { FaEdit, FaTrash, FaTimes, FaPlus, FaSearch } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import LoaderButton from '@/components/LoaderButton'
import { FaP } from 'react-icons/fa6'
import LoadingSkeleton from '../help-blogs/edit/[slug]/LoadingSkeleton'

export default function BlogCategoriesPage() {
    const { token } = useSelector((state) => state.auth)

    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')

    // Edit modal state
    const [showEditModal, setShowEditModal] = useState(false)
    const [currentCat, setCurrentCat] = useState(null)
    const [formData, setFormData] = useState({ name: '', slug: '', parent: null })
    const [updateLoading, setUpdateLoading] = useState(false)

    // Create modal state
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [createForm, setCreateForm] = useState({ name: '', slug: '', parent: null })
    const [createLoading, setCreateLoading] = useState(false)

    const [deleteLoadingId, setDeleteLoadingId] = useState(null)

    const headers = {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
    }

    // Fetch categories
    useEffect(() => {
        if (!token) return
        fetch('https://media.upfrica.com/api/blog-categories/', { headers })
            .then((res) => {
                if (!res.ok) throw new Error(`Status ${res.status}`)
                return res.json()
            })
            .then((data) => {
                setCategories(data)
                setLoading(false)
            })
            .catch(() => {
                setError('Failed to load categories.')
                setLoading(false)
            })
    }, [token])

    // Auto-generate slug (spaces → hyphens; append “-1” if name exists)
    const generateSlug = (name, excludeId = null) => {
        const base = name.trim().replace(/\s+/g, '-')
        const exists = categories.some(
            (c) => c.name === name && c.id !== excludeId
        )
        return exists ? `${base}-1` : base
    }

    // ── CREATE ───────────────────────────────────────────────────────────────────

    const openCreate = () => {
        setCreateForm({ name: '', slug: '', parent: null })
        setShowCreateModal(true)
    }

    const handleCreateChange = (e) => {
        const { name, value } = e.target
        if (name === 'name') {
            const slug = generateSlug(value)
            setCreateForm((f) => ({ ...f, name: value, slug }))
        } else {
            setCreateForm((f) => ({
                ...f,
                parent: value === '' ? null : Number(value),
            }))
        }
    }

    const submitCreate = async (e) => {
        e.preventDefault()
        setCreateLoading(true)
        try {
            const res = await fetch(
                'https://media.upfrica.com/api/blog-categories/',
                {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        name: createForm.name,
                        slug: createForm.slug,
                        parent: createForm.parent,
                    }),
                }
            )
            if (!res.ok) throw new Error(`Status ${res.status}`)
            const created = await res.json()
            setCategories((cats) => [...cats, created])
            setShowCreateModal(false)
        } catch {
            alert('Failed to create category.')
        } finally {
            setCreateLoading(false)
        }
    }

    // ── EDIT ─────────────────────────────────────────────────────────────────────

    const openEdit = (cat) => {
        setCurrentCat(cat)
        setFormData({ name: cat.name, slug: cat.slug, parent: cat.parent })
        setShowEditModal(true)
    }

    const handleEditChange = (e) => {
        const { name, value } = e.target
        if (name === 'name') {
            const slug = generateSlug(value, currentCat.id)
            setFormData((f) => ({ ...f, name: value, slug }))
        } else {
            setFormData((f) => ({
                ...f,
                parent: value === '' ? null : Number(value),
            }))
        }
    }

    const submitUpdate = async (e) => {
        e.preventDefault()
        if (!confirm(`Update category “${currentCat.name}”?`)) return
        setUpdateLoading(true)
        try {
            const res = await fetch(
                `https://media.upfrica.com/api/blog-categories/${currentCat.id}/`,
                {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(formData),
                }
            )
            if (!res.ok) throw new Error(`Status ${res.status}`)
            const updated = await res.json()
            setCategories((cats) =>
                cats.map((c) => (c.id === updated.id ? updated : c))
            )
            setShowEditModal(false)
        } catch {
            alert('Failed to update.')
        } finally {
            setUpdateLoading(false)
        }
    }

    // ── DELETE ───────────────────────────────────────────────────────────────────

    const deleteCat = async (id) => {
        if (!confirm('Are you sure you want to delete this category?')) return
        setDeleteLoadingId(id)
        try {
            const res = await fetch(
                `https://media.upfrica.com/api/blog-categories/${id}/`,
                { method: 'DELETE', headers }
            )
            if (!res.ok) throw new Error(`Status ${res.status}`)
            setCategories((cats) => cats.filter((c) => c.id !== id))
        } catch {
            alert('Failed to delete.')
        } finally {
            setDeleteLoadingId(null)
        }
    }

    // ── SEARCH & RENDER ─────────────────────────────────────────────────────────

    const displayed = categories.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const renderList = () =>
        displayed.map((cat) => {
            const parentName =
                cat.parent != null
                    ? categories.find((p) => p.id === cat.parent)?.name || '—'
                    : 'None'
            return (
                <div
                    key={cat.id}
                    className="flex items-center justify-between bg-white p-4 rounded shadow mb-2"
                >
                    <div>
                        <strong>{cat.name}</strong>{' '}
                        <span className="text-sm text-gray-500">({cat.slug})</span>
                        <div className="text-xs text-gray-600">Parent: {parentName}</div>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => openEdit(cat)}
                            className="p-2 hover:bg-gray-100 rounded"
                        >
                            <FaEdit />
                        </button>
                        <button
                            onClick={() => deleteCat(cat.id)}
                            disabled={deleteLoadingId === cat.id}
                            className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
                        >
                            {deleteLoadingId === cat.id ? '…' : <FaTrash />}
                        </button>
                    </div>
                </div>
            )
        })

    return (
        <>
            <Head>
                <title>Blog Categories</title>
            </Head>
            <main className="min-h-screen bg-gray-50 p-6">
                {/* Top bar: Create (left), Search (center), Title (right) */}

                <div className="flex justify-center mb-6">
                    <div className="relative w-full max-w-md">
                        {/* Search icon */}
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <FaSearch />
                        </div>

                        {/* Input field */}
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search categories..."
                            className="
                            w-full
                            border border-gray-300
                            rounded-lg
                            pl-10 pr-4 py-2
                            text-gray-700
                            placeholder-gray-400
                            focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent
                            transition
                        "
                                            />
                    </div>
                </div>
                <div className="flex flex-row justify-between items-center mb-4">
                    <button
                        onClick={openCreate}
                        className="px-6 py-3 bg-violet-700 text-white rounded-lg font-semibold hover:bg-violet-800"
                    >
                        <FaPlus className="inline mr-2" />
                        Create Category 
                        
                    </button>
                    
                    <h1 className="text-2xl font-bold text-right">Blog Categories</h1>
                </div>

                {loading && <div>
                    <div>
                        {[1, 2].map((item) => (
                            <div
                                key={item}
                                className="border border-gray-300 rounded-md p-4 bg-gray-100 mb-4"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <div className="h-5 bg-gray-300 rounded w-1/4"></div>
                                    <div className="h-5 bg-gray-300 rounded w-8"></div>
                                </div>
                                <div className="mb-2">
                                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-1"></div>
                                    <div className="h-10 bg-gray-300 rounded"></div>
                                </div>
                                <div>
                                    <div className="h-4 bg-gray-300 rounded w-1/3 mb-1"></div>
                                    <div className="h-10 bg-gray-300 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && !error && renderList()}

                {/* ── CREATE MODAL ── */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <div className="relative bg-white p-6 rounded shadow-lg w-full max-w-md">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded"
                            >
                                <FaTimes />
                            </button>
                            <h2 className="text-lg font-semibold mb-4">Create Category</h2>
                            <form onSubmit={submitCreate} className="space-y-4">
                                <div>
                                    <label className="block text-sm">Name</label>
                                    <input
                                        name="name"
                                        value={createForm.name}
                                        onChange={handleCreateChange}
                                        className="w-full border px-3 py-2 rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm">Slug</label>
                                    <input
                                        name="slug"
                                        value={createForm.slug.toLowerCase()}
                                        onChange={(e) =>
                                            setCreateForm((f) => ({
                                                ...f,
                                                slug: e.target.value.toLowerCase(),
                                            }))
                                        }
                                        readOnly
                                        className="w-full border px-3 py-2 rounded bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm">Parent (optional)</label>
                                    <select
                                        name="parent"
                                        value={createForm.parent ?? ''}
                                        onChange={handleCreateChange}
                                        className="w-full border px-3 py-2 rounded"
                                    >
                                        <option value="">None</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="px-4 py-2 rounded border"
                                    >
                                        Cancel
                                    </button>
                                    <LoaderButton
                                        loading={createLoading}
                                        className="px-4 py-2 bg-violet-700 text-white rounded-lg disabled:opacity-50"
                                    >
                                        Create
                                    </LoaderButton>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ── EDIT MODAL ── */}
                {showEditModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <div className="relative bg-white p-6 rounded shadow-lg w-full max-w-md">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded"
                            >
                                <FaTimes />
                            </button>
                            <h2 className="text-lg font-semibold mb-4">Edit Category</h2>
                            <form onSubmit={submitUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-sm">Name</label>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleEditChange}
                                        className="w-full border px-3 py-2 rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm">Slug</label>
                                    <input
                                        name="slug"
                                        value={formData.slug.toLowerCase()}
                                        onChange={(e) =>
                                            setFormData((f) => ({
                                                ...f,
                                                slug: e.target.value.toLowerCase(),
                                            }))
                                        }
                                        readOnly
                                        className="w-full border px-3 py-2 rounded bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm">Parent (optional)</label>
                                    <select
                                        name="parent"
                                        value={formData.parent ?? ''}
                                        onChange={handleEditChange}
                                        className="w-full border px-3 py-2 rounded"
                                    >
                                        <option value="">None</option>
                                        {categories
                                            .filter((c) => c.id !== currentCat.id)
                                            .map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="px-4 py-2 rounded border"
                                    >
                                        Cancel
                                    </button>
                                    <LoaderButton
                                        loading={updateLoading}
                                        className="px-4 py-2 bg-violet-700 text-white rounded-lg disabled:opacity-50"
                                    >
                                        Save
                                    </LoaderButton>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </>
    )
}
