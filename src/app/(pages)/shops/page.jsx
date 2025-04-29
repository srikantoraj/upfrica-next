'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AiOutlineSearch, AiOutlineClose } from 'react-icons/ai'
import { FaArrowRight } from 'react-icons/fa'
import Image from 'next/image'

// — Skeleton placeholder while loading search results
function SearchResultSkeleton() {
    return (
        <div className="flex items-center p-4 border border-gray-200 rounded shadow animate-pulse bg-white mb-2">
            <div className="w-12 h-12 rounded bg-gray-300 flex-shrink-0" />
            <div className="ml-4 space-y-2 flex-1">
                <div className="h-4 bg-gray-300 rounded w-1/2" />
                <div className="h-3 bg-gray-300 rounded w-3/4" />
            </div>
        </div>
    )
}

function SearchResultItem({ shop }) {
    return (
        <div className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 h-16 overflow-y-hidden">
            {shop.shop_logo ? (
                <img
                    src={shop.shop_logo}
                    alt={shop?.name}
                    className="w-12 h-12 rounded object-cover flex-shrink-0"
                />
            ) : (
                <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-600 flex-shrink-0">
                    N/A
                </div>
            )}
            <div className="ml-4 flex-1 overflow-hidden">
                <p className="text-sm font-medium text-gray-900 truncate">
                    {shop?.name}
                </p>
                <p
                    className="text-xs text-gray-500 truncate"
                    dangerouslySetInnerHTML={{ __html: shop.description || '—' }}
                />
            </div>
        </div>
    )
}

export default function ShopGrid({ bgColor = '#E8EAED' }) {
    const router = useRouter()

    // — Grid state
    const [shops, setShops] = useState([])
    const [loadingShops, setLoadingShops] = useState(true)
    // track which shop button was clicked
    const [loadingShopId, setLoadingShopId] = useState(null)

    // — Search state
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [searchLoading, setSearchLoading] = useState(false)
    const [searchActive, setSearchActive] = useState(false)
    const debounceRef = useRef(null)
    const containerRef = useRef(null)

    // Fetch all shops once
    useEffect(() => {
        async function loadAll() {
            try {
                const res = await fetch('https://media.upfrica.com/api/shops/')
                const data = await res.json()
                console.log(data);
                
                setShops(data)
            } catch (err) {
                console.error('Error fetching shops:', err)
            } finally {
                setLoadingShops(false)
            }
        }
        loadAll()
    }, [])

    // Debounced search-as-you-type
    useEffect(() => {
        if (!searchQuery) {
            setSearchResults([])
            setSearchLoading(false)
            return
        }
        setSearchLoading(true)
        clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(async () => {
            try {
                const res = await fetch(
                    `https://media.upfrica.com/api/shops/search/?q=${encodeURIComponent(
                        searchQuery
                    )}`
                )
                const data = await res.json()
                setSearchResults(data)
            } catch (err) {
                console.error('Search error:', err)
            } finally {
                setSearchLoading(false)
            }
        }, 300)

        return () => clearTimeout(debounceRef.current)
    }, [searchQuery])

    // Close dropdown on outside clicks
    useEffect(() => {
        function handleClickOutside(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setSearchActive(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Handler for Visit Shop click
    const handleVisitShop = (slug, id) => {
        setLoadingShopId(id)
        router.push(`/shops/${slug}`)
    }

    // Grid skeletons
    const renderGridSkeletons = () =>
        Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse relative mb-24">
                <div className="bg-gray-300 h-[400px] rounded-lg" />
                <div className="p-6 bg-white absolute -bottom-24 left-1/2 transform -translate-x-1/2 w-4/5 shadow-lg rounded-lg flex flex-col items-center">
                    <div className="w-2/3 h-6 bg-gray-300 rounded mb-4" />
                    <div className="w-1/2 h-10 bg-gray-400 rounded" />
                </div>
            </div>
        ))

    return (
        <div className="px-4 max-w-7xl mx-auto" >
            {/* — Search Box — */}
            <div
                ref={containerRef}
                className="max-w-lg mx-auto my-10 mb-6 relative "
            >
                <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 text-xl" />
                <input
                    type="text"
                    placeholder="Search shops..."
                    className="w-full pl-10 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-gray-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchActive(true)}
                />
                {searchQuery && (
                    <AiOutlineClose
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 cursor-pointer"
                        onClick={() => setSearchQuery('')}
                    />
                )}

                {searchActive && searchQuery && (
                    <div className="absolute left-0 right-0 mt-1 z-20 bg-white shadow-lg border border-gray-200 rounded-md">
                        {searchLoading ? (
                            <>
                                <SearchResultSkeleton />
                                <SearchResultSkeleton />
                                <SearchResultSkeleton />
                            </>
                        ) : searchResults.length > 0 ? (
                            searchResults.map((shop) => (
                                <Link key={shop.id} href={`/shops/${shop.slug}`}>
                                    <span onMouseDown={(e) => e.preventDefault()}>
                                        <SearchResultItem shop={shop} />
                                    </span>
                                </Link>
                            ))
                        ) : (
                            <div className="p-4 text-center text-gray-500">
                                No shops found.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* — Header — */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Browse Online Shops</h1>
                <p className="text-gray-600 mb-1">
                    Variety of Shops in Ghana, Nigeria and more at low prices.
                </p>
                <Link href="/products/new" className="text-gray-600">
                    Have something to sell?{' '}
                    <span className="font-bold underline">Sell on Upfrica</span>
                </Link>
            </div>

            {/* — Shop Grid — */}
            <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-8 py-5">
                {loadingShops
                    ? renderGridSkeletons()
                    : shops && shops.map((shop) => (
                        <div key={shop.id} className="relative mb-16">
                            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                                <div className="h-[300px] lg:h-[400px]">
                                    {shop.top_banner ? (
                                        <Image
                                            src={shop.top_banner}
                                            alt={shop.name}
                                            fill
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    ) : (
                                        <div
                                            className="w-full h-full rounded-t-lg"
                                            style={{
                                                backgroundColor: shop?.bg_color || '#E8EAED',
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="p-4 bg-white absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-4/5 shadow-lg rounded-lg flex flex-col items-center">
                                <h2 className="text-base lg:text-lg  font-bold  text-gray-900 overflow-hidden text-wrap text-center hover:text-[#8710D8] cursor-pointer">
                                    {shop.name}
                                </h2>
                                <button
                                    onClick={() => handleVisitShop(shop.slug, shop.id)}
                                    disabled={loadingShopId === shop.id}
                                    className="mt-4 bg-black text-white font-bold py-2 px-5 rounded-lg flex items-center gap-2"
                                >
                                    {loadingShopId === shop.id ? (
                                        <div className="flex space-x-2 justify-center items-center h-6">
                                            <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                                            <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                                            <div className="h-2 w-2 bg-white rounded-full animate-bounce" />
                                        </div>
                                    ) : (
                                        <>
                                            <span className='text-sm font-bold flex items-center gap-2'>Visit Shop <FaArrowRight /></span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
}
