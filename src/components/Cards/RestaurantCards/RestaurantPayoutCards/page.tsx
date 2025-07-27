import React, { useState } from "react";
import PendingPayouts from "./PendingPayouts/PendingPayouts";
import PaidPayouts from "./PaidPayouts/PaidPayouts";

function RestaurantPayoutCards({ id }: { id: string }) {
  const [activeTab, setActiveTab] = useState<"pending" | "paid">("pending");

  return (
    <div className="mt-10 grid rounded-[10px] bg-white p-6 text-dark shadow-1 dark:bg-gray-dark dark:text-white">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-3">
          <button
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
              activeTab === "pending"
                ? "bg-primary text-white"
                : "bg-gray-2 text-gray-6 dark:bg-dark-3 dark:text-gray-4"
            }`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Payouts
          </button>
          <button
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
              activeTab === "paid"
                ? "bg-primary text-white"
                : "bg-gray-2 text-gray-6 dark:bg-dark-3 dark:text-gray-4"
            }`}
            onClick={() => setActiveTab("paid")}
          >
            Paid Payouts
          </button>
        </div>
      </div>

      <div className="mt-4">
        {activeTab === "pending" ? <PendingPayouts id={id} /> : <PaidPayouts id={id} />}
      </div>
    </div>
  );
}

export default RestaurantPayoutCards;
