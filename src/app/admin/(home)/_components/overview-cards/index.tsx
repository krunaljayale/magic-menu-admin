"use client";

import { useEffect, useState } from "react";
import { compactFormat } from "@/lib/format-number";
import { OverviewCard } from "./card";
import * as icons from "./icons";
import { API } from "@/constants/api";

export function OverviewCardsGroup() {
  const [metrics, setMetrics] = useState<{
    liveOrders?: number;
    deliveredToday?: number;
    servingRestaurants?: number;
    servingRiders?: number;
  }>({});

  useEffect(() => {
    async function fetchOverviewStats() {
      try {
        const token = localStorage.getItem("jwt_token");
        const res = await fetch(API.GET_DASHBOARD_DATA, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setMetrics(data);
      } catch (error) {
        console.error("Error fetching overview stats:", error);
      }
    }

    fetchOverviewStats();
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      {metrics.liveOrders !== undefined && (
        <OverviewCard
          label="Live Orders"
          data={{
            value: compactFormat(metrics.liveOrders),
          }}
          Icon={icons.Views}
        />
      )}

      {metrics.deliveredToday !== undefined && (
        <OverviewCard
          label="Delivered Today"
          data={{
            value: compactFormat(metrics.deliveredToday),
          }}
          Icon={icons.Profit}
        />
      )}

      {metrics.servingRestaurants !== undefined && (
        <OverviewCard
          label="Serving Restaurants"
          data={{
            value: compactFormat(metrics.servingRestaurants),
          }}
          Icon={icons.Product}
        />
      )}

      {metrics.servingRiders !== undefined && (
        <OverviewCard
          label="Serving Riders"
          data={{
            value: compactFormat(metrics.servingRiders),
          }}
          Icon={icons.Users}
        />
      )}
    </div>
  );
}
