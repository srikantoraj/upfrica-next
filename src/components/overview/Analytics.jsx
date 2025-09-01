import React from "react";
import SalesCardGroup from "./SalesCardGroup.jsx";
import OrdersData from "./SellerOrdersData.jsx";

const Analytics = () => {
  return (
    <div className="space-y-4">
      <SalesCardGroup />
      <OrdersData />
    </div>
  );
};

export default Analytics;
