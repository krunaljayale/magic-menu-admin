"use client";

import { ArrowLeftIcon } from "@/assets/icons";
import CouponDetailCard from "@/components/Cards/CouponCard/CouponCard";
import CouponsTable from "@/components/Tables/couponsTable/CouponsTable/page";
import React, { useState } from "react";

const CouponsTablePage = () => {
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
          <CouponDetailCard id={orderID} />
        </>
      ) : (
        <>
          <CouponsTable viewCoupon={(id: string) => setOrderID(id)} />
        </>
      )}
    </div>
  );
};

export default CouponsTablePage;
