"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAutosave from "@/components/useAutosave";

import WizardShell from "@/components/products/ProductWizard/WizardShell";
import StepBasics from "@/components/products/ProductWizard/steps/StepBasics";
import StepMedia from "@/components/products/ProductWizard/steps/StepMedia";
import StepSEO from "@/components/products/ProductWizard/steps/StepSEO";
import StepAttrVariants from "@/components/products/ProductWizard/steps/StepAttrVariants";
import StepReview from "@/components/products/ProductWizard/steps/StepReview";
import OverlayPageFrame from "@/components/ui/OverlaySheet";

const DRAFT_META_KEY = "upfrica:newProductDraftMeta";

export default function ProductEditorPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const idFromQuery = useMemo(() => {
    const n = Number(sp.get("id"));
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [sp]);

  const stepFromQuery = useMemo(() => {
    const raw = (sp.get("step") || "basics").toLowerCase();
    return raw.replace(/[^a-z\-]/g, "") || "basics";
  }, [sp]);

  const [productId, setProductId] = useState(idFromQuery);

  useEffect(() => { if (idFromQuery) setProductId(idFromQuery); }, [idFromQuery]);

  useEffect(() => {
    if (productId) return;
    try {
      const meta = JSON.parse(localStorage.getItem(DRAFT_META_KEY) || "null");
      const lsId = Number(meta?.id || 0);
      if (lsId > 0) {
        setProductId(lsId);
        const step = stepFromQuery || "basics";
        router.replace(`/new-dashboard/products/editor?id=${lsId}&step=${encodeURIComponent(step)}`);
      }
    } catch {}
  }, [productId, stepFromQuery, router]);

  const { save } = useAutosave({
    url: productId ? `/api/products/${productId}/` : "",
    method: "PATCH",
    delay: 500,
    fetchOptions: { credentials: "include", headers: { "Content-Type": "application/json", Accept: "application/json" } },
  });

  const steps = [
    { id: "basics",   title: "Basics",                component: (p) => <StepBasics {...p} /> },
    { id: "media",    title: "Media",                 component: (p) => <StepMedia {...p} /> },
    { id: "price",    title: "Price & Stock",         component: () => <div className="text-gray-500 dark:text-gray-400">Coming soon.</div> },
    { id: "delivery", title: "Delivery",              component: () => <div className="text-gray-500 dark:text-gray-400">Coming soon.</div> },
    { id: "variants", title: "Attributes & Variants", component: (p) => <StepAttrVariants {...p} /> },
    { id: "policies", title: "Policies",              component: () => <div className="text-gray-500 dark:text-gray-400">Coming soon.</div> },
    { id: "seo",      title: "SEO & Visibility",      component: (p) => <StepSEO {...p} /> },
    { id: "review",   title: "Review & Publish",      component: (p) => <StepReview {...p} /> },
  ];
  const validStepIds = useMemo(() => new Set(steps.map(s => s.id)), [steps]);
  const initialStepId = validStepIds.has(stepFromQuery) ? stepFromQuery : "basics";

  if (!productId) {
    return (
      <OverlayPageFrame
        title="Product Editor"
        onClose={() => router.push("/new-dashboard/products")}
        maxWidth="max-w-5xl"
      >
        <div className="space-y-3">
          <div className="text-lg font-medium">Missing ?id</div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Open this editor from <code>/products/new</code> (Save/Continue), or include
            <code className="ml-1">?id=YOUR_PRODUCT_ID</code> in the URL.
          </p>
          <div className="mt-4">
            <button
              className="px-3 py-2 rounded-md border bg-white dark:bg-gray-900"
              onClick={() => router.push("/new-dashboard/products/new")}
            >
              Go to “Add Product”
            </button>
          </div>
        </div>
      </OverlayPageFrame>
    );
  }

  return (
    <OverlayPageFrame
      title="Product Editor"
      onClose={() => router.push("/new-dashboard/products")}
      maxWidth="max-w-5xl"
      // Let the Wizard render its own sticky footer; no overlay footer here.
    >
      <WizardShell
        productId={productId}
        steps={steps}
        initialStepId={initialStepId}
        onSave={(patch) => save(patch)}
      />
    </OverlayPageFrame>
  );
}