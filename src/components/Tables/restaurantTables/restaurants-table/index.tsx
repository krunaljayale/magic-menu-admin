"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { API } from "@/constants/api";
import { RestaurantTableSkeleton } from "./skeleton";
import { PreviewIcon } from "../../icons";
import Image from "next/image";

type Logo = {
  url: string;
  filename: string;
};

type Restaurant = {
  _id: string;
  hotel: string;
  number: number;
  logo: Logo;
  isServing: boolean;
  todayOrders: number;
  weeklySales: number;
};

export function RestaurantsTable({
  actionable,
  viewProfile,
}: {
  actionable: boolean;
  viewProfile?: (id: string) => void;
}) {
  const [restaurantsData, setRestaurantsData] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  const handleView = (id: string) => {
    if (viewProfile) {
      viewProfile(id);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("jwt_token");

    if (!token) {
      console.warn("No token found in localStorage");
      return;
    }

    try {
      const response = await fetch(API.GET_REGISTERED_RESTAURANTS, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const err = await response.json();
        console.error(
          "Failed to fetch restaurants:",
          err.message || "Unknown error",
        );
        return;
      }

      const data = await response.json();
      setRestaurantsData(data);
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <RestaurantTableSkeleton />;
  }

  if (restaurantsData.length === 0 && !loading) {
    return (
      <h2 className="mb-4 text-body-sm font-bold text-dark dark:text-white">
        No Registered Restaurants{" "}
      </h2>
    );
  }

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
      )}
    >
      <div className="flex justify-between">
        <h2 className="mb-4 text-body-2xlg font-bold text-dark dark:text-white">
          Total Registered Restaurants
        </h2>
        <h6
          className="cursor-pointer text-body-sm font-bold text-gray-6"
          onClick={fetchData}
        >
          Refresh
        </h6>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead className="min-w-[160px] !text-left">
              Hotel Logo
            </TableHead>
            <TableHead className="!text-left">Hotel Name</TableHead>
            <TableHead>Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Today's Orders</TableHead>
            <TableHead>Weekly Sales (₹)</TableHead>
            
            {actionable && <TableHead>Action</TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody>
          {restaurantsData.map((restaurant, i) => (
            <TableRow
              className="text-center text-base font-medium text-dark dark:text-white"
              key={i}
            >
              <TableCell className="flex min-w-fit items-center gap-3 pl-5 sm:pl-6 xl:pl-7.5">
                <Image
                  src={`${restaurant.logo.url}`}
                  className="aspect-[6/5] w-15 rounded-[5px] object-cover"
                  width={60}
                  height={50}
                  alt={"Image for product "}
                  role="presentation"
                />
              </TableCell>

              <TableCell className="text-left">{restaurant.hotel}</TableCell>

              <TableCell>{restaurant.number}</TableCell>

              <TableCell
                className={
                  restaurant.isServing
                    ? "text-green-light-1"
                    : "text-gray-4 dark:text-gray-7"
                }
              >
                {restaurant.isServing ? "Online" : "Offline"}
              </TableCell>

              <TableCell>{restaurant.todayOrders}</TableCell>

              <TableCell>₹{restaurant.weeklySales}</TableCell>

              {actionable && (
                <TableCell
                  className="text-blue-light dark:text-blue-light-2"
                  onClick={() => handleView(restaurant._id)}
                >
                  <div className="flex cursor-pointer items-center justify-center gap-x-2">
                    View
                    <PreviewIcon />
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
