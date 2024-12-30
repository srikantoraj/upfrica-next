// app/orders/[section]/page.js
'use client';
import React from "react";
import { useParams } from "next/navigation";
import OrderCart from "@/components/order/OrderCart";


const OrderSectionPage = () => {
  const { section } = useParams();

  let content;
  switch (section) {
    case "order":
      content = <OrderCart/>;
      break;
    case "your-sales":
      content = <p>sale page</p>;
      break;
    case "orders":
      content = <p>order page</p>;
      break;
    case "cancellations":
      content = <p>cancellations page</p>;
      break;
    case "returns":
      content =  <p>returns page</p>;
      break;
    default:
      content = <AllOrders />; // Default Content
  }

  return <div>{content}</div>;
};

export default OrderSectionPage;
