const infoRegistry = {
  public_shop_page: {
    label: "Public Shop Page",
    description: (
      <>
        Get a public URL listing all your products — great for sharing and SEO.
        <br />
        <a
          href="/help-center/shop-page"
          target="_blank"
          className="underline text-blue-400"
        >
          Learn more
        </a>
      </>
    ),
  },
  bulk_product_upload: {
    label: "Bulk Product Upload",
    description:
      "Upload many products at once using CSV. Ideal for large sellers.",
  },
  allow_bnpl: {
    label: "Buy Now Pay Later",
    description: (
      <>
        Enable products for Upfrica’s BNPL program.{" "}
        <a
          href="/help-center/bnpl"
          target="_blank"
          className="underline text-blue-400"
        >
          BNPL Terms
        </a>
      </>
    ),
  },
  max_products: {
    label: "Max Listings",
    description: "Maximum number of active listings allowed in your shop.",
  },
  allow_display_seller_contact: {
    label: "Display Phone Number",
    description:
      "Buyers can view your number directly on product and shop pages.",
  },
};

export default infoRegistry;
