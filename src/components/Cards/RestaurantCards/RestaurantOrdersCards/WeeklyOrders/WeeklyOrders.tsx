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
import { WeeklyOrdersSkeleton } from "./skeleton";
import { API } from "@/constants/api";

type WeeklyOrder = {
  _id: string;
  ticketNumber: number;
  orderedAt: string;
  totalPrice: number;
  status: "DELIVERED" | "REJECTED" | "CANCELLED";
  payment: {
    type: string;
    status: number;
  };
};

function WeeklyOrders({ id }: { id: string }) {
  const [orders, setOrders] = useState<WeeklyOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWeeklyOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt_token");
      const res = await fetch(`${API.GET_WEEKLY_ORDERS}/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch weekly orders");

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("[GET /get-weekly-orders] error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklyOrders();
  }, []);

  if (loading) return <WeeklyOrdersSkeleton />;

  if (!orders.length) return <p className="mt-6">No weekly orders found.</p>;

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 dark:bg-gray-dark",
      )}
    >
      <div className="flex items-center justify-between px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        <div className="flex flex-col items-start">
          <p className="text-base text-gray-6 dark:text-gray-4">
            Total Orders:{" "}
            <span className="font-semibold text-dark dark:text-white">
              {orders.length}
            </span>
          </p>

          <p className="text-base text-gray-6 dark:text-gray-4">
            Gross Revenue (Delivered): ₹{" "}
            <span className="font-semibold text-dark dark:text-white">
              {orders
                .filter((order) => order.status === "DELIVERED")
                .reduce((sum, order) => sum + order.totalPrice, 0)
                .toFixed(2)}
            </span>
          </p>
        </div>

        <h6
          className="cursor-pointer text-body-sm font-bold text-gray-6 hover:underline"
          onClick={fetchWeeklyOrders}
        >
          Refresh
        </h6>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead className="pl-6">Order Id #</TableHead>
            <TableHead>Ordered At</TableHead>
            <TableHead>Order Value (₹)</TableHead>
            <TableHead>Order Status</TableHead>
            <TableHead>Payment Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id} className="text-dark dark:text-white">
              <TableCell className="pl-6">#{order.ticketNumber}</TableCell>

              <TableCell>
                {new Date(order.orderedAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </TableCell>
              <TableCell>₹{order.totalPrice}</TableCell>
              <TableCell
                className={cn(
                  order.status === "DELIVERED"
                    ? "text-green-light-1"
                    : order.status === "REJECTED"
                      ? "text-red-light"
                      : "text-yellow-light",
                )}
              >
                {order.status}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{order.payment.type}</span>
                  <span className="text-sm text-gray-5 dark:text-gray-6">
                    {order.payment.status}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default WeeklyOrders;
