"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { API } from "@/constants/api";
import { LiveOrdersSkeleton } from "./skeleton";
import { PreviewIcon } from "@/components/Tables/icons";

const LiveOrdersTable = ({
  actionable,
  viewProfile,
}: {
  actionable: boolean;
  viewProfile?: (id: string) => void;
}) => {
  const [liveOrders, setLiveOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLiveOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await fetch(`${API.GET_LIVE_ORDERS}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch orders");

      const formattedOrders = await response.json();
      setLiveOrders(formattedOrders);
    } catch (err) {
      console.error("[GET /admin/get-live-orders] Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveOrders();
  }, []);

  const handleView = (id: string) => {
    if (viewProfile) {
      viewProfile(id);
    }
  };

  if (loading) return <LiveOrdersSkeleton />;

  if (liveOrders.length === 0)
    return (
      <h3 className="p-4 text-center text-lg font-semibold text-gray-500 dark:text-gray-400">
        No live orders found
      </h3>
    );

  return (
    <>
      <Breadcrumb pageName="Live Orders" />
      <div className="mt-10 rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="flex justify-between px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            Total Live Orders
          </h2>
          <h6
            className="cursor-pointer text-body-sm font-bold text-gray-6 hover:underline"
            onClick={fetchLiveOrders}
          >
            Refresh
          </h6>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
              <TableHead className="min-w-[120px] pl-5 sm:pl-6 xl:pl-7.5">
                Order Id #
              </TableHead>
              <TableHead>Hotel Name</TableHead>
              <TableHead>Ordered On</TableHead>
              <TableHead>Order Value (₹)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {liveOrders.map((order) => (
              <TableRow
                key={order.orderTicketNumber}
                className="text-base font-medium text-dark dark:text-white"
              >
                <TableCell className="pl-5 sm:pl-6 xl:pl-7.5">
                  #{order.orderTicketNumber}
                </TableCell>

                <TableCell>{order.hotelName}</TableCell>

                <TableCell>
                  {new Date(order.orderedOn).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </TableCell>

                <TableCell>₹{order.orderValue}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell
                  className="flex cursor-pointer items-center justify-center gap-x-2 text-blue-light dark:text-blue-light-2"
                  onClick={() => handleView(order.orderId)}
                >
                  View
                  <PreviewIcon />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default LiveOrdersTable;
