import OpenMapButton from "@/components/Buttons/OpenMapButton";
import { API } from "@/constants/api";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

interface PastOrderProps {
  id: string;
}

interface OrderData {
  id: string;
  ticketNumber: number;
  orderOtp: number;
  status: string;
  restaurantStatus: string;
  customer: {
    name: string;
    number: number;
    locationFormatted?: string;
    locationMapUrls: {
      mapUrl?: string;
      osmUrl?: string;
    } | null;
  } | null;
  hotel: {
    hotel: string;
    number: string;
  } | null;
  rider: {
    name: string;
    number: number;
  } | null;
  riderMetaData: {
    acceptedAtTime?: string;
    restaurantDistanceAtAccept?: number;
    customerDistanceAtAccept?: number;
    reachedRestaurantAt?: string;
    selfieAtRestaurant?: string;
    pickupConfirmedAt?: string;
    dropAt?:string;
  } | null;
  payment: {
    transactionId: string;
    mode: string;
    status: string;
    amount: number;
  } | null;
  items: {
    name: string;
    discountedPrice: number;
    quantity: number;
    isVeg: boolean;
    category: string; // ✅ add this line
  }[];
  totalPriceFromDB: number;
  computedTotalFromItems: number;
  timeline: {
    orderedAt?: string;
    preparationTimeMinutes: number;
    servedAt?: string;
    deliveredAt?: string;
  };
}

function formatDistance(val?: number | null): string {
  return val === null || val === undefined ? "N/A" : `${val} kms`;
}

function PastOrderCard({ id }: PastOrderProps) {
  const [data, setData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await fetch(`${API.GET_PAST_ORDER_DATA}/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch past order data");

      const json = await response.json();
      setData(json.data); // ✅ API returns { success, data }
    } catch (err: any) {
      console.error("[GET /get-past-order-data/:id] Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, [id]);


  if (loading)
    return (
      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-dark">
        <p>Loading order data...</p>
      </div>
    );

  if (error)
    return (
      <div className="rounded-lg bg-red-50 p-6 text-red-600 shadow-md">
        Error: {error}
      </div>
    );

  if (!data)
    return (
      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-dark">
        <p>No order data available.</p>
      </div>
    );

  return (
    <div className="grid rounded-[10px] bg-white p-6 text-dark shadow-1 dark:bg-gray-dark dark:text-white">
      <div className="flex items-center justify-between">
        <h2 className="text-heading-5 font-bold">Order Details</h2>
        <button
          onClick={fetchOrderData}
          className="text-body-sm font-bold text-gray-6 hover:underline"
        >
          Refresh
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <InfoRow
          label="Ticket Number"
          value={`#${data.ticketNumber ?? "N/A"}`}
        />
        <InfoRow label="Order OTP" value={data.orderOtp ?? "N/A"} />
        <InfoRow label="Status" value={data.status ?? "N/A"} />
        <InfoRow
          label="Restaurant Status"
          value={data.restaurantStatus ?? "N/A"}
        />
        <InfoRow label="Hotel" value={data.hotel?.hotel ?? "N/A"} />
        <InfoRow label="Hotel Number" value={data.hotel?.number ?? "N/A"} />
        <InfoRow label="Customer Name" value={data.customer?.name ?? "N/A"} />
        <InfoRow
          label="Customer Number"
          value={data.customer?.number ?? "N/A"}
        />
        <div>
          <InfoRow
            label="Customer Location"
            value={data.customer?.locationFormatted ?? "N/A"}
          />
          <OpenMapButton urls={data.customer?.locationMapUrls ?? null} />
        </div>
        <InfoRow
          label="Rider"
          value={data.rider ? data.rider.name : "Not Assigned"}
        />
        <InfoRow
          label="Rider Number"
          value={data.rider ? data.rider.number : "N/A"}
        />
        <InfoRow
          label="Payment"
          value={`${data.payment?.mode || "N/A"} (${data.payment?.status || "N/A"})`}
        />
        <InfoRow
          label="Amount"
          value={`₹${data.payment?.amount || data.totalPriceFromDB || "N/A"}`}
        />
      </div>

      {/* Items Section */}
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-bold">
          Ordered Items | ₹{data.computedTotalFromItems}
        </h3>
        <div className="space-y-2">
          {data.items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between rounded-md bg-gray-50 p-3 dark:bg-gray-800"
            >
              <div className="flex flex-col">
                <span className="font-semibold">{item.name}</span>
                <span className="text-sm text-gray-500">
                  {item.isVeg ? "🌱 Veg" : "🍗 Non-Veg"} | {item.category}
                </span>
              </div>
              <div className="text-right">
                <span className="block font-semibold">
                  ₹{item.discountedPrice}
                </span>
                <span className="text-sm text-gray-500">x{item.quantity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Section */}
      <div className="mt-8">
        <h3 className="mb-2 text-lg font-bold">Timeline</h3>
        <div className="grid grid-cols-3 gap-4">
          <InfoRow
            label="Ordered At"
            value={
              data.timeline?.orderedAt
                ? new Date(data.timeline.orderedAt).toLocaleString()
                : "N/A"
            }
          />
          <InfoRow
            label="Preparation Time (mins)"
            value={
              data.timeline?.preparationTimeMinutes
                ? data.timeline.preparationTimeMinutes
                : "N/A"
            }
          />
          <InfoRow
            label="Order Ready At"
            value={
              data.timeline?.servedAt
                ? new Date(data.timeline.servedAt).toLocaleString()
                : "N/A"
            }
          />
        </div>
      </div>

      {/* RiderMetaData Section */}
      <div className="mt-8">
        <h3 className="mb-2 text-lg font-bold">Rider Meta-Data</h3>
        <div className="grid grid-cols-3 gap-4">
          <InfoRow
            label="Restaurant Distance At Accept"
            value={formatDistance(
              data.riderMetaData?.restaurantDistanceAtAccept,
            )}
          />

          <InfoRow
            label="Customer-Restaurant Distance"
            value={formatDistance(data.riderMetaData?.customerDistanceAtAccept)}
          />

          <InfoRow
            label="Accepted At"
            value={
              data.riderMetaData?.acceptedAtTime
                ? new Date(data.riderMetaData.acceptedAtTime).toLocaleString()
                : "N/A"
            }
          />

          <InfoRow
            label="Reached Hotel At"
            value={
              data.riderMetaData?.reachedRestaurantAt
                ? new Date(
                    data.riderMetaData.reachedRestaurantAt,
                  ).toLocaleString()
                : "N/A"
            }
          />
          <div>
            <InfoRow
              label="Rider Selfie"
              value={!data.riderMetaData?.selfieAtRestaurant ? "N/A" : ""}
            />
            {data.riderMetaData?.selfieAtRestaurant && (
              <a
                href={data.riderMetaData?.selfieAtRestaurant}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Open image
              </a>
            )}
          </div>
          <InfoRow
            label="Order Pickedup At"
            value={
              data.riderMetaData?.pickupConfirmedAt
                ? new Date(
                    data.riderMetaData.pickupConfirmedAt,
                  ).toLocaleString()
                : "N/A"
            }
          />
          <InfoRow
            label="Reached Drop At"
            value={
              data.riderMetaData?.dropAt
                ? new Date(
                    data.riderMetaData.dropAt,
                  ).toLocaleString()
                : "N/A"
            }
          />
        </div>
      </div>
    </div>
  );
}

export default PastOrderCard;

function InfoRow({
  label,
  value,
  className,
}: {
  label: string;
  value: string | number;
  className?: string;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </span>
      <span className={cn("text-base font-semibold", className)}>{value}</span>
    </div>
  );
}
