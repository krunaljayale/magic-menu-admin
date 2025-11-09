"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { PreviewIcon } from "@/components/Tables/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { API } from "@/constants/api";
import { useEffect, useState } from "react";

const PastOrdersTable = ({
  actionable,
  viewProfile,
}: {
  actionable: boolean;
  viewProfile?: (id: string) => void;
}) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchPastOrders = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    const currentPage = page;

    try {
      const token = localStorage.getItem("jwt_token");

      const response = await fetch(
        `${API.GET_PAST_ORDERS}?page=${currentPage}&limit=20`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Failed to fetch past orders");

      const data = await response.json();

      // Deduplicate entries
      setOrders((prev) => {
        const existingIds = new Set(prev.map((o) => o.orderId));
        const uniqueNewOrders = data.orders.filter(
          (o: any) => !existingIds.has(o.orderId),
        );
        return [...prev, ...uniqueNewOrders];
      });

      if (data.orders.length < 20) setHasMore(false);

      // ✅ Important: increment page AFTER fetch succeeds
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("[GET /admin/get-past-orders] Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPastOrders();
  }, []);

  const handleView = (id: string) => {
    if (viewProfile) {
      viewProfile(id);
    }
  };

  if (orders.length === 0) {
    return null;
  }

  return (
    <div className="mt-10 rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="flex justify-between px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          Total Past Orders
        </h2>
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
          {orders.map((order) => (
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
              <TableCell
                className={
                  order.status === "DELIVERED"
                    ? "text-green-light-1 dark:text-green-light-2"
                    : order.status === "REJECTED"
                      ? "text-red-light"
                      : ""
                }
              >
                {order.status}
              </TableCell>
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

      {hasMore && (
        <div className="mt-4 text-right">
          <button
            onClick={fetchPastOrders}
            disabled={loading}
            className="m-5 rounded-xl bg-primary px-4 py-2 text-white shadow-md disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PastOrdersTable;
