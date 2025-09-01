// src/app/(pages)/new-dashboard/settings/shop/page.jsx
"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import Image from "next/image";
import { Editor } from "@tinymce/tinymce-react";
import { HiChevronDown } from "react-icons/hi";

import { BASE_API_URL } from "@/app/constants";
import { getCleanToken } from "@/lib/getCleanToken";
import FAQsEditor from "@/components/new-dashboard/settings/FAQs";

/* ----------------------- small helpers ----------------------- */
function Section({ id, title, subtitle, open, onToggle, children, actions }) {
  return (
    <section id={id} className="mb-4">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between rounded-md bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 px-4 py-3 text-left"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
      >
        <div className="min-w-0">
          <h2 className="font-semibold text-base">{title}</h2>
          {subtitle ? (
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          {actions}
          <HiChevronDown
            className={`h-5 w-5 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>
      <div
        id={`${id}-panel`}
        className={`overflow-hidden transition-[max-height] duration-300 ${
          open ? "max-h-[3000px]" : "max-h-0"
        }`}
      >
        <div className="p-4 bg-white dark:bg-slate-900 border-x border-b border-gray-200 dark:border-gray-800 rounded-b-md">
          {children}
        </div>
      </div>
    </section>
  );
}

/* -------------------------- page ----------------------------- */
export default function ShopSettingsPage() {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // profile/branding
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [bgColor, setBgColor] = useState("#E8EAED");
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  // SEO article
  const [seoContent, setSeoContent] = useState("");
  const [seoSaving, setSeoSaving] = useState(false);
  const [seoSavedAt, setSeoSavedAt] = useState(null);
  const [seoError, setSeoError] = useState(null);
  const editorRef = useRef(null);

  // layout: desktop keeps all open; mobile collapses
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= 1024);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const [openProfile, setOpenProfile] = useState(true);
  const [openSeo, setOpenSeo] = useState(true);
  const [openFaqs, setOpenFaqs] = useState(true);
  useEffect(() => {
    // On mount, collapse on mobile, expand on desktop
    setOpenProfile(isDesktop);
    setOpenSeo(isDesktop);
    setOpenFaqs(isDesktop);
  }, [isDesktop]);

  const token = useMemo(() => getCleanToken(), []);

  // load my shop
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${BASE_API_URL}/api/shops/my/`, {
          headers: token ? { Authorization: `Token ${token}` } : {},
          cache: "no-store",
        });
        if (!r.ok) throw new Error(`Failed to load shop (${r.status})`);
        const data = await r.json();

        setShop(data);
        setName(data?.name || "");
        setDescription(data?.description || "");
        setPhone(data?.seller_contact_number || "");
        setBgColor(data?.bg_color || "#E8EAED");
        setSeoContent(data?.seo_content || "");
      } catch (e) {
        setError(e?.message || "Failed to load shop.");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const logoUrl = shop?.shop_logo || null;
  const bannerUrl = shop?.top_banner || null;

  // entitlements
  const canEditSeo = useMemo(() => {
    const ents = new Set(Array.isArray(shop?.entitlements) ? shop.entitlements : []);
    return ents.has("seo_article") || ents.has("storefront_unlock");
  }, [shop?.entitlements]);

  /* ---------------------- actions ----------------------- */
  const handleSave = async (e) => {
    e?.preventDefault?.();
    if (!shop?.slug) return;

    setSaving(true);
    setError(null);

    try {
      const fd = new FormData();
      if (name) fd.append("name", name);
      if (description !== undefined) fd.append("description", description);
      if (phone) fd.append("seller_contact_number", phone);
      if (bgColor) fd.append("bg_color", bgColor);
      if (logoFile) fd.append("shop_logo_upload", logoFile);
      if (bannerFile) fd.append("top_banner_upload", bannerFile);

      const r = await fetch(`${BASE_API_URL}/api/shops/${shop.slug}/update/`, {
        method: "PATCH",
        headers: token ? { Authorization: `Token ${token}` } : {},
        body: fd,
      });

      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j?.detail || `Save failed (${r.status})`);
      }

      const updated = await r.json();
      setShop(updated);
      setLogoFile(null);
      setBannerFile(null);
    } catch (e) {
      setError(e?.message || "Could not save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSeo = async () => {
    if (!shop?.slug) return;
    setSeoSaving(true);
    setSeoError(null);
    try {
      const html =
        editorRef.current?.getContent?.({ format: "html" }) ?? seoContent ?? "";
      const fd = new FormData();
      fd.append("seo_content", html);

      const r = await fetch(`${BASE_API_URL}/api/shops/${shop.slug}/update/`, {
        method: "PATCH",
        headers: token ? { Authorization: `Token ${token}` } : {},
        body: fd,
      });

      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j?.detail || `Save failed (${r.status})`);
      }

      const updated = await r.json();
      setShop(updated);
      setSeoContent(updated?.seo_content || html);
      setSeoSavedAt(new Date());
    } catch (e) {
      setSeoError(e?.message || "Could not save SEO article.");
    } finally {
      setSeoSaving(false);
    }
  };

  /* -------------------- TinyMCE config ------------------- */
  const tinymceApiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY || "";
  const editorInit = useMemo(
    () => ({
      height: 520,
      menubar: "file edit view insert format tools table help",
      plugins:
        "advlist autolink lists link image charmap preview anchor " +
        "searchreplace visualblocks code fullscreen " +
        "insertdatetime media table code help wordcount autoresize",
      toolbar:
        "undo redo | blocks | bold italic underline | " +
        "alignleft aligncenter alignright | bullist numlist | " +
        "link table blockquote | removeformat | preview code",
      block_formats:
        "Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Blockquote=blockquote",
      branding: false,
      default_link_target: "_self",
      convert_urls: false,
      toolbar_mode: "sliding",
      content_style:
        "body{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,'Helvetica Neue',Arial,'Noto Sans',sans-serif;line-height:1.65;font-size:16px} h1,h2,h3{margin-top:1.25em} ul,ol{padding-left:1.25em}",
      setup: (editor) => {
        editorRef.current = editor;
      },
    }),
    []
  );

  // SEO template
  const buildSeoTemplate = useCallback(() => {
    const shopName = shop?.name || "Our Shop";
    const town = shop?.user?.town || "";
    const country = shop?.user?.country_name || shop?.user?.country || "";
    return `
<h1>Machines in ${country || "Ghana"} — ${shopName}</h1>
<p><em>Updated ${new Date().toLocaleDateString()}</em></p>

<h2>Why buy from ${shopName}?</h2>
<ul>
  <li>Verified seller with buyer protection</li>
  <li>Fast delivery in ${town || country || "your area"}</li>
  <li>Local support, warranty options, and genuine parts</li>
</ul>

<h2>Top Categories</h2>
<ul>
  <li><a href="/shops/${shop?.slug}?category=generators">Generators</a></li>
  <li><a href="/shops/${shop?.slug}?category=construction">Construction Equipment</a></li>
  <li><a href="/shops/${shop?.slug}?category=agriculture">Agricultural Machinery</a></li>
</ul>

<h2>Buying Guide</h2>
<h3>Power & Capacity</h3>
<p>Match power and capacity to your intended use. Consider duty cycle, fuel type, and efficiency.</p>
<h3>Condition & Warranty</h3>
<p>We list condition clearly and offer warranty options on select items.</p>
<h3>Delivery & Installation</h3>
<p>We deliver nationwide with optional installation and training.</p>

<h2>How to Order</h2>
<ol>
  <li>Open a product and review specs, price, and delivery.</li>
  <li>Click <strong>Add to Basket</strong> or <strong>Buy Now</strong>.</li>
  <li>Choose address and complete checkout securely.</li>
</ol>

<p><strong>Need help?</strong> Contact <a href="/shops/${shop?.slug}">${shopName}</a> for quotes or bulk orders.</p>
`.trim();
  }, [shop?.name, shop?.slug, shop?.user?.town, shop?.user?.country, shop?.user?.country_name]);

  const applyTemplateIfEmpty = () => {
    const txt = (editorRef.current?.getContent?.({ format: "text" }) || "").trim();
    if (!txt) {
      const tpl = buildSeoTemplate();
      editorRef.current?.setContent?.(tpl);
      setSeoContent(tpl);
    }
  };

  const wordCount = useMemo(() => {
    const text = String(seoContent || "")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return text ? text.split(" ").length : 0;
  }, [seoContent]);

  /* ----------------------- render ------------------------ */
  if (loading) return <div className="p-6 text-gray-500">Loading…</div>;
  if (!shop) return <div className="p-6 text-red-500">{error || "Shop not found."}</div>;

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Store Settings</h1>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
          {error}
        </div>
      )}

      {/* Profile / Branding */}
      <Section
        id="profile"
        title="Profile & Branding"
        subtitle="Shop name, intro, phone, theme color, and media"
        open={openProfile}
        onToggle={() => setOpenProfile((v) => !v)}
        actions={
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-xs px-3 py-1.5 rounded bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        }
      >
        <form onSubmit={handleSave} className="grid gap-6">
          {/* Shop name */}
          <div>
            <label className="block text-sm font-medium mb-1">Shop Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border px-3 py-2"
              placeholder="Your shop name"
            />
          </div>

          {/* Short intro */}
          <div>
            <label className="block text-sm font-medium mb-1">Public Intro (short)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded border px-3 py-2 h-28"
              placeholder="A brief intro shown on the shop page."
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">Contact Phone Number</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded border px-3 py-2"
              placeholder="+233201234567"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use international format, e.g., +233245123456
            </p>
          </div>

          {/* BG color */}
          <div>
            <label className="block text-sm font-medium mb-1">Background Color</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="h-10 w-16 p-0 border rounded"
            />
          </div>

          {/* Logo */}
          <div>
            <label className="block text-sm font-medium mb-2">Logo</label>
            <div className="flex items-center gap-4">
              <div className="h-20 w-32 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                {logoFile ? (
                  <Image
                    src={URL.createObjectURL(logoFile)}
                    alt="logo preview"
                    width={128}
                    height={80}
                    className="object-cover h-full w-full"
                  />
                ) : shop?.shop_logo ? (
                  <Image
                    src={shop.shop_logo}
                    alt="current logo"
                    width={128}
                    height={80}
                    className="object-cover h-full w-full"
                  />
                ) : (
                  <span className="text-xs text-gray-500">No logo</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          {/* Banner */}
          <div>
            <label className="block text-sm font-medium mb-2">Banner</label>
            <div className="flex items-center gap-4">
              <div className="h-24 w-40 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                {bannerFile ? (
                  <Image
                    src={URL.createObjectURL(bannerFile)}
                    alt="banner preview"
                    width={160}
                    height={96}
                    className="object-cover h-full w-full"
                  />
                ) : shop?.top_banner ? (
                  <Image
                    src={shop.top_banner}
                    alt="current banner"
                    width={160}
                    height={96}
                    className="object-cover h-full w-full"
                  />
                ) : (
                  <span className="text-xs text-gray-500">No banner</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>
        </form>
      </Section>

      {/* SEO Article */}
      <Section
        id="seo-article"
        title="SEO Article"
        subtitle="Evergreen content (800–1,800 words) with H1/H2s, bullets, and internal links"
        open={openSeo}
        onToggle={() => setOpenSeo((v) => !v)}
        actions={
          canEditSeo ? (
            <button
              onClick={handleSaveSeo}
              disabled={seoSaving}
              className="text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {seoSaving ? "Saving…" : "Save Article"}
            </button>
          ) : null
        }
      >
        {!canEditSeo ? (
          <div className="rounded border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
            Your current plan doesn’t include the SEO Article editor.
            <a className="ml-2 underline" href="/new-dashboard/plan">Upgrade to unlock</a>.
          </div>
        ) : (
          <div className="space-y-3">
            {seoError && (
              <div className="rounded border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
                {seoError}
              </div>
            )}

            <div className="flex items-center gap-2 mb-1">
              <button
                type="button"
                onClick={applyTemplateIfEmpty}
                className="px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50 text-sm"
                title="Insert a helpful outline if the editor is empty"
              >
                Use SEO Template
              </button>
              <span className="ml-auto text-xs text-gray-500">
                {wordCount} words{seoSavedAt ? ` • Saved ${seoSavedAt.toLocaleTimeString()}` : ""}
              </span>
            </div>

            <Editor
              apiKey={tinymceApiKey}
              value={seoContent}
              onEditorChange={(html) => setSeoContent(html)}
              init={editorInit}
            />

            <p className="text-xs text-gray-500">
              Tip: link to <code>/shops/{shop?.slug}?category=…</code> and your top product pages.
            </p>
          </div>
        )}
      </Section>

      {/* FAQs */}
      <Section
        id="faqs"
        title="FAQs"
        subtitle="Add question–answer pairs that help customers and your SEO"
        open={openFaqs}
        onToggle={() => setOpenFaqs((v) => !v)}
      >
        <FAQsEditor
          shopSlug={shop.slug}
          shopName={shop.name}
          entitlements={Array.isArray(shop.entitlements) ? shop.entitlements : []}
        />
      </Section>
    </div>
  );
}