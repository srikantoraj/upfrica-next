import {
  FaTachometerAlt,
  FaPlus,
  FaEnvelope,
  FaClipboardList,
  FaBoxOpen,
  FaTag,
  FaChartBar,
  FaWallet,
  FaStore,
  FaShippingFast,
  FaFileAlt,
  FaStar,
  FaQuestionCircle,
  FaBalanceScale,
  FaInbox,
  FaBullhorn,
  FaLifeRing,
  FaTicketAlt,
  FaComments,
  FaUserCircle,
  FaSignOutAlt
} from "react-icons/fa";

export const menuItems = [
  {
    label: "Dashboard",
    route: "/new-dashboard",
    icon: FaTachometerAlt,
    children: [
      {
        label: "Overview",
        route: "/new-dashboard/overview"
      },
      // {
      //   label: "Quick Actions",
      //   route: "/new-dashboard/quick-actions",
      //   children: [
      //     {
      //       label: "➕ Add New Product",
      //       route: "/new-dashboard/quick-actions/add-product",
      //       icon: FaPlus
      //     },
      //     {
      //       label: "💬 Message Admin",
      //       route: "/new-dashboard/quick-actions/message-admin",
      //       icon: FaEnvelope
      //     }
      //   ]
      // }
    ]
  },
  {
    label: "Orders",
    route: "/orders",
    icon: FaClipboardList,
    children: [
      { label: "All Orders", route: "/new-dashboard/all-orders" },
      { label: "Pending Orders", route: "/new-dashboard/pending-orders" },
      { label: "Shipped Orders", route: "/new-dashboard/shipped-orders" },
      { label: "Cancelled / Refunded", route: "/new-dashboard/cancelled-orders" },
    ]
  },
  {
    label: "Products",
    route: "/all-products",
    icon: FaBoxOpen,
    children: [
      { label: "All Products", route: "/new-dashboard/all-products" },
      { label: "Add New Product", route: "/new-dashboard/add-new-product" },
      { label: "Drafts", route: "/new-dashboard/draft" },
      { label: "Out-of-Stock", route: "/new-dashboard/out-of-stock" },
      // { label: "Bulk Import / Export", route: "/products/import-export" }
    ]
  },
  {
    label: "My Purchases",
    route: "/new-dashboard/my-orders",
    icon: FaClipboardList,
    children: [
      { label: "All Purchases", route: "/new-dashboard/my-orders" },
      { label: "Processing", route: "/new-dashboard/my-orders/processing" },
      { label: "Unpaid", route: "/new-dashboard/my-orders/unpaid" },
      { label: "Returns & Cancelled", route: "/new-dashboard/my-orders/return-cancelled" },

    ]
  },
  {
    label: "Reviews",
    route: "/new-dashboard/lavel",
    icon: FaClipboardList,
    children: [
      { label: "Pending Reviews", route: "/new-dashboard/pending-reviews" },
      // { label: "Processing", route: "/new-dashboard/my-orders/processing" },
      // { label: "Unpaid", route: "/new-dashboard/my-orders/unpaid" },
      // { label: "Returns & Cancelled", route: "/new-dashboard/my-orders/return-cancelled" },
     
    ]
  },
  {
    label: "Promotions",
    route: "/promotions",
    icon: FaTag,
    children: [
      { label: "My Coupons", route: "/promotions/coupons" },
      { label: "Flash Sales", route: "/promotions/flash-sales" },
      { label: "Banner Ads", route: "/promotions/banner-ads" }
    ]
  },
  {
    label: "Reports",
    route: "/reports",
    icon: FaChartBar,
    children: [
      { label: "Sales by Product", route: "/reports/sales-by-product" },
      { label: "Traffic & Conversion", route: "/reports/traffic-conversion" },
      { label: "Top Customers", route: "/reports/top-customers" },
      { label: "Payout History", route: "/reports/payout-history" }
    ]
  },
  {
    label: "Payments",
    route: "/payments",
    icon: FaWallet,
    children: [
      { label: "Payout Settings", route: "/payments/settings" },
      { label: "Upcoming Payouts", route: "/payments/upcoming" },
      { label: "Transaction Logs", route: "/payments/logs" }
    ]
  },
  {
    label: "Help & Support",
    route: "/support",
    icon: FaLifeRing,
    children: [
      { label: "Seller FAQ", route: "/support/faq" },
      { label: "Submit a Ticket", route: "/support/ticket" },
      { label: "Live Chat with Admin", route: "/support/live-chat" }
    ]
  },
  // Sticky profile/logout at bottom
  {
    label: "My Profile",
    route: "/profile",
    icon: FaUserCircle
  },
  {
    label: "Sign Out",
    route: "/logout",
    icon: FaSignOutAlt
  }
];
