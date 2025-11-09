"use client";

import { ArrowLeftIcon } from "@/assets/icons";
import LiveOrderCard from "@/components/Cards/OrderCards/LiveOrderCard/LiveOrderCard";
import LiveOrdersTable from "@/components/Tables/orderTables/liveOrders/live_orders/page";
import React, { useState } from "react";

const LiveOrdersPageTables = () => {
  const [orderID, setOrderID] = useState("");

  return (
    <div>
      {orderID ? (
        <>
          <h2
            className="mb-4 flex cursor-pointer items-center gap-1 px-1 text-body-sm font-bold text-gray-7 hover:underline dark:text-gray-4"
            onClick={() => setOrderID("")}
          >
            <ArrowLeftIcon />
            Go Back
          </h2>
          <LiveOrderCard id={orderID} />
        </>
      ) : (
        <LiveOrdersTable
          actionable={true}
          viewProfile={(_id: string) => setOrderID(_id)}
        />
      )}
    </div>
  );
};

export default LiveOrdersPageTables;
