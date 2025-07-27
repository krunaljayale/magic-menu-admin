import { Metadata } from "next";
import PastOrdersTable from "@/components/Tables/orderTables/pastOrders/PastOrdersTable/page";
import React from "react";
import SearchOrdersTable from "@/components/Tables/orderTables/pastOrders/SearchOrdersTable/page";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
  title: "Past Orders",
};

function PastOrders() {
  return (
    <>
    <Breadcrumb pageName="Past Orders" />
      <SearchOrdersTable />
      <PastOrdersTable />
    </>
  );
}

export default PastOrders;
