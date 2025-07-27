import React, { useState } from "react";
import WeeklyOrders from "./WeeklyOrders/WeeklyOrders";
import LifeTimeOrders from "./LifeTimeOrders/LifeTimeOrders";

function RestaurantOrdersCards({ id }: { id: string }) {
  const [activeTab, setActiveTab] = useState<"weekly" | "lifetime">("weekly");

  return (
    <div className="mt-10 grid rounded-[10px] bg-white p-6 text-dark shadow-1 dark:bg-gray-dark dark:text-white">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-3">
          <button
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
              activeTab === "weekly"
                ? "bg-primary text-white"
                : "bg-gray-2 text-gray-6 dark:bg-dark-3 dark:text-gray-4"
            }`}
            onClick={() => setActiveTab("weekly")}
          >
            Running Week Orders
          </button>
          <button
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
              activeTab === "lifetime"
                ? "bg-primary text-white"
                : "bg-gray-2 text-gray-6 dark:bg-dark-3 dark:text-gray-4"
            }`}
            onClick={() => setActiveTab("lifetime")}
          >
            Lifetime Orders
          </button>
        </div>
      </div>

      <div className="mt-4">
        {activeTab === "weekly" ? (
          <WeeklyOrders id={id} />
        ) : (
          <LifeTimeOrders id={id} />
        )}
      </div>
    </div>
  );
}

export default RestaurantOrdersCards;
