"use client";

import { useEffect, useState } from "react";
import { API } from "@/constants/api";
import { cn } from "@/lib/utils";
import { RiderDetailCardSkeleton } from "./RiderDetailsSkeleton";
import { PencilSquareIcon } from "@/assets/icons";
import { EditableInfoRow } from "@/components/Tables/riderTables/riders-table/editableInfoRow/EditableInfoRow";

interface RiderDetailCardProps {
  id: string;
}

interface RiderData {
  _id: string;
  name: string;
  number: number;
  email: string;
  gender: string;
  dob: string;
  isBlocked: boolean;
  onDuty: boolean;
  isAvailable: boolean;
  depositAmount: number;
  status: string;
  createdAt: string;
  // Add more fields if needed later
}

export default function RiderDetailCard({ id }: RiderDetailCardProps) {
  const [data, setData] = useState<RiderData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRider = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await fetch(`${API.GET_RIDER_DATA}/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch rider");
      const rider = await response.json();
      setData(rider);
    } catch (err) {
      console.error("[GET /admin/get-rider-data/:id] Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const editRider = async (value: string) => {
    setLoading(true);

    try {
      const token = localStorage.getItem("jwt_token");

      const response = await fetch(`${API.EDIT_RIDER_DEPOSIT}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ value }),
      });

      if (!response.ok) {
        const err = await response.json();
        console.error("Failed to edit rider:", err.message || "Unknown error");
        return;
      }

      fetchRider();
    } catch (error) {
      console.error("Error while editing rider:", error);
    }
  };

  const toggleBlockRider = async (rider: RiderData) => {
    setLoading(true);

    try {
      const token = localStorage.getItem("jwt_token");

      const response = await fetch(`${API.TOGGLE_BLOCK_RIDER}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isBlocked: !rider.isBlocked }),
      });

      if (!response.ok) {
        const err = await response.json();
        console.error(
          "Failed to toggle rider block status:",
          err.message || "Unknown error",
        );
        return;
      }

      fetchRider(); // Refresh after success
    } catch (error) {
      console.error("Error while toggling block status:", error);
    }
  };

  useEffect(() => {
    fetchRider();
  }, [id]);

  if (loading) {
    return <RiderDetailCardSkeleton />;
  }

  if (!data) {
    return <div className="text-lg text-red-500">Rider not found.</div>;
  }

  return (
    <div className="grid rounded-[10px] bg-white p-6 text-dark shadow-1 dark:bg-gray-dark dark:text-white">
      <div className="flex justify-between">
        <h2 className="mb-6 text-heading-5 font-bold">Rider Details</h2>
        <h6
          className="cursor-pointer text-body-sm font-bold text-gray-6 hover:underline"
          onClick={fetchRider}
        >
          Refresh
        </h6>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <InfoRow label="Name" value={data.name} />
        <InfoRow label="Phone Number" value={data.number} />
        <InfoRow label="Email" value={data.email} />
        <InfoRow label="Gender" value={data.gender} />
        <InfoRow label="DOB" value={new Date(data.dob).toDateString()} />
        <InfoRow
          label="Status"
          value={
            data.isBlocked ? "Blocked" : data.onDuty ? "Online" : "Offline"
          }
          className={
            data.isBlocked
              ? "text-red-light"
              : data.onDuty
                ? "text-green-light-1"
                : "text-gray-5"
          }
        />
        <div className="flex">
          <EditableInfoRow
            label="Deposit Amount"
            value={data.depositAmount}
            onChange={(val) => editRider(val)}
          />
        </div>
        <InfoRow label="Order Status" value={!data.isAvailable ? 'Serving Order': data.status} />
        <InfoRow
          label="Account Created"
          value={new Date(data.createdAt).toLocaleDateString()}
        />
      </div>

      <div className="mt-8 flex justify-end">
        <button
          disabled={!data.isBlocked && !data.isAvailable}
          onClick={() => toggleBlockRider(data)}
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
          {data.isBlocked ? "Unblock Rider" : "Block Rider"}
        </button>
      </div>
    </div>
  );
}

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
      <span className="text-sm font-medium text-gray-5 dark:text-gray-6">
        {label}
      </span>
      <span className={cn("text-base font-semibold", className)}>{value}</span>
    </div>
  );
}

// function EditableInfoRow({
//   label,
//   value,
//   className,
// }: {
//   label: string;
//   value: string | number;
//   className?: string;
// }) {
//   return (
//     <div className="flex flex-col">
//       <span className="text-sm font-medium text-gray-5 dark:text-gray-6">
//         {label}
//       </span>
//       <div className="flex items-center gap-2">
//         <span className={cn("text-base font-semibold", className)}>
//           {value}
//         </span>
//         <PencilSquareIcon />
//       </div>
//     </div>
//   );
// }
