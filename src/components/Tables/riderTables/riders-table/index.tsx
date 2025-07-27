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
import { RidersTableSkeleton } from "./skeleton";
import { PreviewIcon } from "../../icons";

type Rider = {
  _id: string;
  name: string;
  number: number;
  todayOrders: number;
  pendingCOD: number;
  onDuty: boolean;
  isBlocked: boolean;
  isAvailable: boolean;
};

export function RidersTable({
  actionable,
  viewProfile,
}: {
  actionable: boolean;
  viewProfile?: (id: string) => void;
}) {
  const [ridersData, setRidersData] = useState<Rider[]>([]);
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
      const response = await fetch(API.GET_REGISTERED_RIDERS, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }), // Add token if available
        },
      });

      if (!response.ok) {
        const err = await response.json();
        console.error(
          "Failed to fetch riders:",
          err.message || "Unknown error",
        );
        return;
      }

      const data = await response.json();
      setRidersData(data);
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
    return <RidersTableSkeleton />;
  }

  if (ridersData.length === 0 && !loading) {
    return (
      <h2 className="mb-4 text-body-sm font-bold text-dark dark:text-white">
        No Registered Riders{" "}
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
          Total Registered Riders
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
            <TableHead className="min-w-[160px] !text-left">Name</TableHead>
            <TableHead>Number</TableHead>
            <TableHead>Today's Orders</TableHead>
            <TableHead>Pending COD ₹</TableHead>
            <TableHead>Status</TableHead>
            {actionable && <TableHead>Action</TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody>
          {ridersData.map((rider, i) => (
            <TableRow
              className="text-center text-base font-medium text-dark dark:text-white"
              key={i}
            >
              <TableCell className="flex min-w-fit items-center gap-3">
                {rider.name}
              </TableCell>

              <TableCell>{rider.number}</TableCell>

              <TableCell>{rider.todayOrders}</TableCell>

              <TableCell>₹{rider.pendingCOD}</TableCell>

              {rider.isBlocked ? (
                <TableCell className={"text-red-light-1"}>Blocked</TableCell>
              ) : (
                <TableCell
                  className={
                    rider.onDuty
                      ? "text-green-light-1"
                      : "text-gray-4 dark:text-gray-7"
                  }
                >
                  {rider.onDuty ? "Online" : "Offline"}
                </TableCell>
              )}

              {actionable && (
                <TableCell
                  className="flex cursor-pointer items-center justify-center gap-x-2 text-blue-light dark:text-blue-light-2"
                  onClick={() => handleView(rider._id)}
                >
                  View
                  <PreviewIcon />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
