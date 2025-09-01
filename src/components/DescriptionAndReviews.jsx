"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { MdOutlinePhone } from "react-icons/md";
import { FaEdit, FaHeart, FaRegHeart } from "react-icons/fa";

// If you still use these elsewhere, keep the imports
// import CustomerReviewsSection from "./CustomerReviewsSection";
// import CreateReview from "./CreateReview";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/+$/, "") ||
  "https://media.upfrica.com";

const decodeIfEscaped = (s) => {
  if (typeof s !== "string") return s;
  if (/[&]lt;|[&]gt;|&amp;/.test(s)) {
    try {
      const doc = new DOMParser().parseFromString(s, "text/html");
      return doc.documentElement.textContent || s;
    } catch {
      return s;
    }
  }
  return s;
};

export default function DescriptionAndReviews({
  details,
  condition,
  user,      // seller (optional; will be derived from product if missing)
  shop,      // optional; will be derived from product if missing
  product,   // optional; preferred path
}) {
  const params = useParams(); // expects route like /(pages)/[region]/[slug]
  const region = params?.region;
  const slug = params?.slug;

  // If parent didn’t pass product, we’ll fetch it
  const [fetchedProduct, setFetchedProduct] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [fetchErr, setFetchErr] = useState("");

  // Normalize product: prefer prop, else details.product, else details, else fetched
  const prod = useMemo(
    () => product ?? details?.product ?? details ?? fetchedProduct ?? null,
    [product, details, fetchedProduct]
  );

  // Derive seller/shop/condition from product if not provided
  const seller = user ?? prod?.user ?? prod?.seller ?? null;
  const shopData = shop ?? prod?.shop ?? null;
  const conditionObj = condition ?? prod?.condition ?? null;

  // Debug what arrives
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("[DescriptionAndReviews] incoming:", { product, details });
    // eslint-disable-next-line no-console
    console.log("[DescriptionAndReviews] normalized prod:", prod);
  }, [product, details, prod]);

  // Fetch the product if it wasn't passed and we have region/slug
  useEffect(() => {
    if (prod) return;                 // already have it
    if (!region || !slug) return;     // cannot fetch without them

    const controller = new AbortController();
    const doFetch = async () => {
      try {
        setFetching(true);
        setFetchErr("");
        const res = await fetch(`${API_BASE}/api/${region}/${slug}`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error(`Failed to load product ${region}/${slug}`);
        }
        const json = await res.json();
        setFetchedProduct(json);
      } catch (e) {
        if (e.name !== "AbortError") setFetchErr(e.message || "Failed to load product");
      } finally {
        setFetching(false);
      }
    };

    doFetch();
    return () => controller.abort();
  }, [prod, region, slug]);

  // Auth / follow bits
  const { user: currentUser, token } = useSelector((s) => s.auth);
  const [showPhone, setShowPhone] = useState(false);
  const [openTab, setOpenTab] = useState("specifics");

  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [sellerProducts, setSellerProducts] = useState(0);
  const [loadingFollow, setLoadingFollow] = useState(false);

  const conditionValue = conditionObj?.name || "N/A";
  const phoneText = showPhone ? seller?.phone_number : "Click to view number";
  const properties = prod?.properties || [];

  const canEditSpecifics =
    properties.length >= 1
      ? currentUser?.admin === true
      : currentUser?.username === seller?.username;

  // Fetch initial follow status/count
  useEffect(() => {
    if (!seller?.id) return;
    const headers = {};
    if (token) headers["Authorization"] = `Token ${token}`;
    fetch(`${API_BASE}/api/users/${seller.id}/follow/status/`, {
      method: "GET",
      headers,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch follow status");
        return res.json();
      })
      .then((data) => {
        setIsFollowing(data.is_following);
        setFollowersCount(data.followers_count);
        setSellerProducts(data.products_count);
      })
      .catch((err) => console.error(err));
  }, [seller?.id, token]);

  // Compute final HTML for description (first non-empty, decode if escaped)
  const descriptionHtml = useMemo(() => {
    const pick = (...vals) =>
      vals.find((v) => typeof v === "string" && v.trim().length > 0)?.trim();

    const raw = pick(
      prod?.description_html,
      prod?.rich_description_html,
      prod?.description,
      prod?.action_text?.description?.body
    );

    return decodeIfEscaped(raw) || "<p>No description provided.</p>";
  }, [
    prod?.description_html,
    prod?.rich_description_html,
    prod?.description,
    prod?.action_text?.description?.body,
  ]);

  const handleToggleFollow = async () => {
    if (!token) {
      alert("Please log in to follow sellers.");
      return;
    }
    if (!seller?.id) return;
    setLoadingFollow(true);
    try {
      const res = await fetch(`${API_BASE}/api/users/${seller.id}/follow/`, {
        method: isFollowing ? "DELETE" : "POST",
        headers: { Authorization: `Token ${token}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 400 && data.detail === "Can't follow yourself.") {
          alert("cant follow yourself");
        } else {
          throw new Error(data.detail || "Follow action failed");
        }
      } else {
        setIsFollowing((f) => !f);
        setFollowersCount((n) => n + (isFollowing ? -1 : 1));
      }
    } catch (err) {
      console.error(err);
      if (err.message !== "Can't follow yourself.") {
        alert("Could not update follow status.");
      }
    } finally {
      setLoadingFollow(false);
    }
  };

  // Loading / error states if we needed to fetch
  if (!prod) {
    return (
      <main className="mx-auto max-w-screen-xl py-8 text-gray-800">
        <div className="border rounded-xl p-6">
          <p className="text-sm text-gray-600">
            {fetchErr ? `Error: ${fetchErr}` : "Loading item details…"}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-screen-xl py-8 text-gray-800">
      {/* ITEM DETAILS */}
      <header className="pb-4 border-b border-gray-300">
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold">
          Item Details
        </h2>
      </header>

      <section className="mt-6 space-y-4">
        {/* specifics */}
        <div className="border rounded-xl">
          <button
            onClick={() =>
              setOpenTab(openTab === "specifics" ? "" : "specifics")
            }
            className="w-full flex justify-between items-center p-4 font-medium text-left"
          >
            Product specifics
            <span>{openTab === "specifics" ? "−" : "+"}</span>
          </button>
          {openTab === "specifics" && (
            <div className="p-4 border-t text-sm text-gray-700 space-y-2">
              {canEditSpecifics && (
                <Link
                  href={`/products/edit/specifics/${prod?.id}`}
                  className="flex items-center gap-2 mb-2 text-violet-700"
                >
                  <FaEdit className="h-4 w-4" />
                  <span className="hover:underline">Edit Specifics</span>
                </Link>
              )}
              <p>
                <b>Seller location:</b> {seller?.town} – {seller?.country}
              </p>
              <p>
                <b>Condition:</b> {conditionValue}
              </p>
              {(prod?.properties || []).map((item) => (
                <p key={item.id}>
                  <b>{item.property.label}:</b> {item.value}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* description */}
        <div className="border rounded-xl">
          <button
            onClick={() =>
              setOpenTab(openTab === "description" ? "" : "description")
            }
            className="w-full flex justify-between items-center p-4 font-medium text-left"
          >
            Item description from seller
            <span>{openTab === "description" ? "−" : "+"}</span>
          </button>

          {openTab === "description" && (
            <div
              className="p-4 border-t text-sm text-gray-700 leading-relaxed prose max-w-none"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              suppressHydrationWarning
            />
          )}
        </div>
      </section>

      {/* SELLER INFO */}
      <section className="mt-8 max-w-xl">
        <div className="p-6 bg-white rounded-xl shadow-sm space-y-4">
          <div className="flex items-center gap-4">
            {shopData?.shop_logo ? (
              <img
                src={shopData.shop_logo}
                alt={shopData?.name}
                className="w-16 h-16 rounded-full shadow"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                N/A
              </div>
            )}
            <div>
              <h6 className="text-base font-medium mb-1">{seller?.username}</h6>
              <ul className="flex items-center gap-4 text-sm text-gray-600">
                <li>
                  {followersCount} follower{followersCount === 1 ? "" : "s"}
                </li>
                <li className="text-green-600">
                  {sellerProducts ?? "—"} Items
                </li>
              </ul>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleToggleFollow}
              disabled={loadingFollow}
              className={`
                flex-1 flex justify-center items-center gap-2
                border rounded-full px-4 py-2 text-sm font-semibold
                ${isFollowing ? "border-violet-700" : "border-gray-300"}
                ${loadingFollow ? "bg-violet-700" : "bg-white"}
                disabled:opacity-50
              `}
            >
              {loadingFollow ? (
                <div className="flex space-x-2 justify-center items-center h-6">
                  <div className="h-2 w-2 rounded-full animate-bounce [animation-delay:-0.3s] bg-violet-700" />
                  <div className="h-2 w-2 rounded-full animate-bounce [animation-delay:-0.15s] bg-violet-700" />
                  <div className="h-2 w-2 rounded-full animate-bounce bg-violet-700" />
                </div>
              ) : (
                <>
                  {React.createElement(isFollowing ? FaHeart : FaRegHeart, {
                    className: `h-5 w-5 ${
                      isFollowing ? "text-violet-700" : "text-gray-600"
                    }`,
                  })}
                  <span
                    className={`ml-2 ${
                      isFollowing ? "text-violet-700" : "text-gray-600"
                    }`}
                  >
                    {isFollowing ? "Followed" : "Not Followed"}
                  </span>
                </>
              )}
            </button>

            <Link
              href={`/shops/${shopData?.slug}`}
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm font-semibold text-center"
            >
              Shop all items
            </Link>
          </div>

          <button
            onClick={() => setShowPhone(!showPhone)}
            className="w-full flex items-center justify-center gap-2 border border-purple-500 text-purple-500 rounded-full px-4 py-2 text-sm font-semibold"
          >
            <MdOutlinePhone />
            {phoneText}
          </button>
        </div>
      </section>
    </main>
  );
}