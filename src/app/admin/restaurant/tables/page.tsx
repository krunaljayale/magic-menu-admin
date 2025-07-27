"use client";

import { ArrowLeftIcon } from "@/assets/icons";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import RestaurantDetailCard from "@/components/Cards/RestaurantCards/RestaurantDetailCard/RestaurantDetailCard";
import RestaurantOrdersCards from "@/components/Cards/RestaurantCards/RestaurantOrdersCards/page";
import RestaurantPayoutCards from "@/components/Cards/RestaurantCards/RestaurantPayoutCards/page";
import { RestaurantsTable } from "@/components/Tables/restaurantTables/restaurants-table";
import { UnsettledOrders } from "@/components/Tables/riderTables/unsettledOrders";

import { useState } from "react";

const RestaurantsTablesPage = () => {
  const [profile, setProfile] = useState("");

  return (
    <div>
      <Breadcrumb pageName="Restaurants" />
      {profile ? (
        <>
          <h2
            className="mb-4 flex cursor-pointer items-center gap-1 px-1 text-body-sm font-bold text-gray-7 hover:underline dark:text-gray-4"
            onClick={() => setProfile("")}
          >
            <ArrowLeftIcon />
            Go Back
          </h2>
          <RestaurantDetailCard id={profile} />
          <RestaurantPayoutCards id={profile} />
          <RestaurantOrdersCards id={profile} />
        </>
      ) : (
        <RestaurantsTable
          actionable={true}
          viewProfile={(_id: string) => setProfile(_id)}
        />
      )}
    </div>
  );
};

export default RestaurantsTablesPage;
