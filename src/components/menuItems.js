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
  FaSignOutAlt,
  FaCogs,
  FaChartLine,
  FaMoneyBillWave,
} from "react-icons/fa";

export const menuItems = [
  // Direct click menus
  {
    label: "Dashboard",
    route: "/dashboard",
    icon: FaTachometerAlt,
  },
  {
    label: "Analytics",
    route: "/analytics",
    icon: FaChartLine,
  },
  {
    label: "Plan & Add-ons",
    route: "/plan",
    icon: FaTag,
  },
  {
    label: "Payouts & Finances",
    route: "/finance",
    icon: FaWallet,
  },

  // Collapsible sections for Sellers
  {
    label: "Products",
    route: "/products",
    icon: FaBoxOpen,
    role: "seller",
    children: [
      { label: "View All Products", route: "/products" },
      { label: "Add Product", route: "/products/add" },
      { label: "Product Reviews", route: "/products/reviews" },
      { label: "Drafts / Archived", route: "/products/drafts" },
    ],
  },
  {
    label: "Orders",
    route: "/orders",
    icon: FaClipboardList,
    role: "seller",
    children: [
      { label: "All Orders", route: "/orders/all" },
      { label: "Unfulfilled", route: "/orders/unfulfilled" },
      { label: "Returns & Cancellations", route: "/orders/returns" },
      { label: "Order Settings", route: "/orders/settings" },
    ],
  },
  {
    label: "Marketing Tools",
    route: "/marketing",
    icon: FaBullhorn,
    role: "seller",
    children: [
      { label: "Discounts", route: "/marketing/discounts" },
      { label: "Promotions", route: "/marketing/promotions" },
      { label: "Email Campaigns", route: "/marketing/email" },
      { label: "SEO Booster", route: "/marketing/seo" },
      { label: "Ad Boosts", route: "/marketing/boosts" },
    ],
  },
  {
    label: "Store Settings",
    route: "/settings",
    icon: FaCogs,
    role: "seller",
    children: [
      { label: "Store Details", route: "/settings/details" },
      { label: "Shipping Methods", route: "/settings/shipping" },
      { label: "Payment Settings", route: "/settings/payments" },
      { label: "Tax Settings", route: "/settings/taxes" },
      { label: "Store Policies", route: "/settings/policies" },
    ],
  },

  // Messages shared by all roles
  {
    label: "Messages",
    route: "/messages",
    icon: FaEnvelope,
    children: [
      { label: "Inbox", route: "/messages/inbox" },
      { label: "Buyer Questions", route: "/messages/questions" },
      { label: "System Alerts", route: "/messages/alerts" },
    ],
  },

  // Buyer role-specific entries (if needed)
  {
    label: "My Orders",
    route: "/my-orders",
    icon: FaClipboardList,
    role: "buyer",
    children: [
      { label: "All Purchases", route: "/my-orders" },
      { label: "Processing", route: "/my-orders/processing" },
      { label: "Unpaid", route: "/my-orders/unpaid" },
      { label: "Returns & Cancelled", route: "/my-orders/returns" },
    ],
  },

  // Sourcing Agent role-specific entries
  {
    label: "Sourcing Tasks",
    route: "/sourcing",
    icon: FaShippingFast,
    role: "agent",
    children: [
      { label: "Assigned Requests", route: "/sourcing/tasks" },
      { label: "Sourced Products", route: "/sourcing/products" },
    ],
  },

  // All Settings
  {
    label: "Settings",
    route: "/settings",
    icon: FaCogs,
    children: [
      { label: "Account Type", route: "/settings/account-type" },
      { label: "Payout Info", route: "/settings/payouts" },
      { label: "Security", route: "/settings/security" },
      { label: "Notifications", route: "/settings/notifications" },
      { label: "Preferences", route: "/settings/preferences" },
      // optionally add billing, user management etc.
    ],
  },

  // Shared profile/logout
  {
    label: "My Profile",
    route: "/profile",
    icon: FaUserCircle,
    children: [
      { label: "Profile Settings", route: "/profile/settings" },
      { label: "Address Book", route: "/profile/addresses" },
    ],
  },
  {
    label: "Sign Out",
    route: "/logout",
    icon: FaSignOutAlt,
  },
];
