"use client";

import PastOrdersTable from "@/components/Tables/orderTables/pastOrders/PastOrdersTable/page";
import React, { useState } from "react";
import SearchOrdersTable from "@/components/Tables/orderTables/pastOrders/SearchOrdersTable/page";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ArrowLeftIcon } from "@/assets/icons";
import PastOrderCard from "@/components/Cards/OrderCards/PastOrderCard/PastOrderCard";

function PastOrdersTablesPage() {
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
          <PastOrderCard id={orderID} />
        </>
      ) : (
        <>
          <Breadcrumb pageName="Past Orders" />
          <SearchOrdersTable />
          <PastOrdersTable
            actionable={true}
            viewProfile={(_id: string) => setOrderID(_id)}
          />
        </>
      )}
    </div>
  );
}

export default PastOrdersTablesPage;
