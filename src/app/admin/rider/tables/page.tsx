"use client";

import { ArrowLeftIcon } from "@/assets/icons";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import RiderDetailCard from "@/components/Cards/RiderDetailCard/RiderDetailCard";
import { InvoiceTable } from "@/components/Tables/invoice-table";
import { RidersTable } from "@/components/Tables/riderTables/riders-table";
import { UnsettledOrders } from "@/components/Tables/riderTables/unsettledOrders";

import {useState } from "react";

const RidersTablesPage = () => {
  const [profile, setProfile] = useState("");

  return (
    <>
      <Breadcrumb pageName="Riders" />

      <div>
        {profile ? (
          <>
            <h2
              className="mb-4 flex cursor-pointer items-center gap-1 px-1 text-body-sm font-bold text-gray-7 hover:underline dark:text-gray-4"
              onClick={() => setProfile("")}
            >
              <ArrowLeftIcon />
              Go Back
            </h2>
            <RiderDetailCard id={profile} />
            <UnsettledOrders id={profile} />
          </>
        ) : (
          <RidersTable
            actionable={true}
            viewProfile={(_id: string) => setProfile(_id)}
          />
        )}

        {/* <Suspense fallback={<TopProductsSkeleton />}>
          <TopProducts />
        </Suspense>*/}

        {/* <InvoiceTable />  */}
      </div>
    </>
  );
};

export default RidersTablesPage;
