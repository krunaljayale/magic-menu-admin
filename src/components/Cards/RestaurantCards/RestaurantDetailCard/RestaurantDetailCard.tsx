"use client";

import { useEffect, useState } from "react";
import { API } from "@/constants/api";
import { cn } from "@/lib/utils";
import { RestaurantDetailCardSkeleton } from "./RestaurantDetailsSkeleton";
import SwitcherThree from "@/components/FormElements/Switchers/SwitcherThree";
import { InfoRow } from "@/components/ui/table";

interface RestaurantDetailCardProps {
  id: string;
}

interface RestaurantData {
  _id: string;
  hotel: string;
  name: string;
  number: number;
  email: string;
  address: string;
  isServing: boolean;
  isVeg: boolean;
  isBrand: boolean;
  createdAt: string;
}

export default function RestaurantDetailCard({
  id,
}: RestaurantDetailCardProps) {
  const [data, setData] = useState<RestaurantData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchrestaurant = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await fetch(`${API.GET_RESTAURANT_DATA}/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch restaurant");
      const restaurant = await response.json();
      setData(restaurant);
    } catch (err) {
      console.error("[GET /admin/get-restaurant-data/:id] Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // const editrestaurant = async (value: string) => {
  //   setLoading(true);

  //   try {
  //     const token = localStorage.getItem("jwt_token");

  //     const response = await fetch(`${API.EDIT_restaurant_DEPOSIT}/${id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({ value }),
  //     });

  //     if (!response.ok) {
  //       const err = await response.json();
  //       console.error("Failed to edit restaurant:", err.message || "Unknown error");
  //       return;
  //     }

  //     fetchrestaurant();
  //   } catch (error) {
  //     console.error("Error while editing restaurant:", error);
  //   }
  // };

  // const toggleBlockrestaurant = async (restaurant: restaurantData) => {
  //   setLoading(true);

  //   try {
  //     const token = localStorage.getItem("jwt_token");

  //     const response = await fetch(`${API.TOGGLE_BLOCK_restaurant}/${id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({ isBlocked: !restaurant.isBlocked }),
  //     });

  //     if (!response.ok) {
  //       const err = await response.json();
  //       console.error(
  //         "Failed to toggle restaurant block status:",
  //         err.message || "Unknown error",
  //       );
  //       return;
  //     }

  //     fetchrestaurant(); // Refresh after success
  //   } catch (error) {
  //     console.error("Error while toggling block status:", error);
  //   }
  // };

  useEffect(() => {
    fetchrestaurant();
  }, [id]);

  const toggleBrandrestaurant = async (s: boolean) => {
    setLoading(true);

    try {
      const token = localStorage.getItem("jwt_token");

      const response = await fetch(`${API.TOGGLE_BRAND_RESTAURANT}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isBrand: s }),
      });

      if (!response.ok) {
        const err = await response.json();
        console.error(
          "Failed to toggle rider block status:",
          err.message || "Unknown error",
        );
        return;
      }

      fetchrestaurant();
    } catch (error) {
      console.error("Error while toggling block status:", error);
    }
  };

  if (loading) {
    return <RestaurantDetailCardSkeleton />;
  }

  if (!data) {
    return <div className="text-lg text-red-500">Restaurant not found.</div>;
  }

  return (
    <div className="grid rounded-[10px] bg-white p-6 text-dark shadow-1 dark:bg-gray-dark dark:text-white">
      <div className="flex justify-between">
        <h2 className="mb-6 text-heading-5 font-bold">Restaurant Details</h2>
        <h6
          className="cursor-pointer text-body-sm font-bold text-gray-6 hover:underline"
          onClick={fetchrestaurant}
        >
          Refresh
        </h6>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <InfoRow label="Hotel Name" value={data.hotel} />
        <InfoRow label="Legal Name" value={data.name} />
        <InfoRow label="Email" value={data.email} />
        <InfoRow label="Phone Number" value={data.number} />
        <InfoRow label="Address" value={data.address} />
        <InfoRow
          label="Status"
          value={data.isServing ? "Online" : "Offline"}
          className={
            data.isServing
              ? "text-green-light-1"
              : "text-gray-5 dark:text-gray-7"
          }
        />
        <InfoRow label="Veg Only" value={data.isVeg ? "Yes" : "No"} />
        <div>
          <InfoRow
            label="Brand Status"
            value={data.isBrand ? "Brand" : "No Brand"}
          />
          <SwitcherThree
            enabled={data.isBrand}
            onChange={(s) => toggleBrandrestaurant(s)}
          />
        </div>
        <InfoRow
          label="Account Created"
          value={new Date(data.createdAt).toLocaleDateString()}
        />
      </div>

      {/* <div className="mt-8 flex justify-end">
        <button
          disabled={!data.isBlocked && !data.isAvailable}
          // onClick={() => toggleBlockrestaurant(data)}
          className={cn(
            "rounded px-4 py-2 text-white shadow-md transition",
            data.isBlocked
              ? "bg-green-500 hover:bg-green-600"
              : "bg-red-500 hover:bg-red-600",
            !data.isBlocked &&
              !data.isAvailable &&
              "cursor-not-allowed opacity-50",
          )}
        >
          {data.isBlocked ? "Unblock restaurant" : "Block restaurant"}
        </button>
      </div> */}
    </div>
  );
}


