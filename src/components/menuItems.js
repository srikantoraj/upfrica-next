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
    label: "Admin Approvals",
    route: "/new-dashboard/lavel",
    icon: FaClipboardList,
    children: [
      { label: "Draft Products", route: "/new-dashboard/draft-products" },
      { label: "Pending Reviews", route: "/new-dashboard/pending-reviews" },
    
     
    ]
  },
  {
    label: "Blogs",
    route: "/new-dashboard",
    icon: FaTag,
    children: [
      { label: "All Blogs", route: "/new-dashboard/help-blogs" },
      { label: "Draft Blogs", route: "/new-dashboard/help-blogs/draft-blogs" },
      { label: "Crate A Blog", route: "/new-dashboard/help-blogs/create-help-blog" },
    
    ]
  },
  {
    label: "Jobs & Careers",
    route: "/new-dashboard",
    icon: FaLifeRing,
    children: [
      { label: "All Jobs", route: "/new-dashboard/jobs" },
      { label: "Create a Job", route: "/new-dashboard/jobs/create-job" }
  
    ]
  },
  {
    label: "User Management",
    route: "/new-dashboard",
    icon: FaChartBar,
    children: [
      { label: "All Users", route: "/new-dashboard/all-users" }
    ]
  },
  {
    label: "Payments",
    route: "/payments",
    icon: FaWallet,
    children: [
      { label: "Transaction Settings", route: "/new-dashboard/payments" },
 
    ]
  },
 
  // Sticky profile/logout at bottom
  {
    label: "My Profile",
    route: "/profile",
    icon: FaUserCircle,
    children: [
      { label: "Profile Settings", route: "/new-dashboard/profile-settings" },
      { label: "Address Book", route: "/new-dashboard/profile-settings/address-book" },
      // { label: "Payment Methods", route: "/new-dashboard/payment-methods" },
      // { label: "My Reviews", route: "/new-dashboard/my-reviews" },
      // { label: "My Wishlist", route: "/new-dashboard/wishlist" },
      // { label: "My Tickets", route: "/new-dashboard/tickets" }

    ]
  },
  {
    label: "Sign Out",
    route: "/logout",
    icon: FaSignOutAlt
  }
];
