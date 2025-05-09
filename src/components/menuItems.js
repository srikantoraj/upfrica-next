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
        { label: "Affiliate", route: "/new-dashboard/affiliate" },
        { label: "finance", route: "/new-dashboard/finance" },
        { label: "Invoice", route: "/new-dashboard/invoice" },
        { label: "Helpdesk", route: "/new-dashboard/helpdesk" },
      ],
    },
    {
      label: "E-commerce",
      route: "/dashboard/chart",
      icon: IoMdCart,
      children: [
        { label: "Orders", route: "/new-dashboard/orders" },
        { label: "Product - Details", route: "/new-dashboard/" },
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
  