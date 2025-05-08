// src/data/menuItems.js
import {
    FaHome,
    FaUserCircle,
    FaRegEdit,
    FaCog,
    FaEllipsisH,
    FaChartBar,
    FaThLarge,
    FaSignInAlt,
  } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
  
  export const menuItems = [
    {
      label: "Dashboard",
      route: "/dashboard/chart",
      icon: FaHome,
      children: [
        { label: "Analytics", route: "/new-dashboard/analytics" },
        { label: "Sales & Revenue", route: "/dashboard/revenue" },
        { label: "Live Tour Items", route: "/dashboard/live-tour-items" },
        { label: "Live Hotel Items", route: "/dashboard/live-hotel-items" },
        { label: "All Bookings", route: "/dashboard/all-bookings" },
        { label: "All Payments", route: "/dashboard/all-payments" },
        { label: "Visa manament", route: "/dashboard/visa-management" },
        { label: "All Users", route: "/dashboard/all-users" },
        { label: "All Stories", route: "/dashboard/stories" },
        { label: "All Videos", route: "/dashboard/videos" },
      ],
    },
    {
      label: "E-commerce",
      route: "/dashboard/chart",
      icon: IoMdCart,
      children: [
        { label: "Product", route: "/new-dashboard/product" },
        { label: "Product - Detels", route: "/new-dashboard/product-detels" },
        { label: "Products - List", route: "/new-dashboard/porducts-list" },
        { label: "Product - Add", route: "/new-dashboard/product-add" },
        { label: "Checkout", route: "/new-dashboard/checkout" },
       
      ],
    },
    {
      label: "Profile",
      route: "/profile",
      icon: FaUserCircle,
    },
    {
      label: "Create Itineraries",
      route: "#",
      icon: FaRegEdit,
      children: [
        { label: "Create Tour Itinerary", route: "/dashboard/create-tour-itienrary" },
        { label: "Add new Hotel", route: "/dashboard/create-hotel-itienrary" },
        { label: "Add new Story", route: "/dashboard/add-new-story" },
        { label: "Add new Video", route: "/dashboard/add-new-video" },
      ],
    },
    {
      label: "Settings",
      route: "/settings",
      icon: FaCog,
    },
    {
      label: "Others",
      route: "/others",
      icon: FaEllipsisH,
    },
    {
      label: "Analytics",
      route: "/dashboard/chart",
      icon: FaChartBar,
    },
    {
      label: "Upadte Pages UI",
      route: "#",
      icon: FaThLarge,
    },
    {
      label: "Sign Out",
      route: "#",
      icon: FaSignInAlt,
    },
  ];
  