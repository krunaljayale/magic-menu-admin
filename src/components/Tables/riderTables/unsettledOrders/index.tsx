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
import { UnsettledOrdersSkeleton } from "./skeleton";
import { Checkbox } from "@/components/FormElements/checkbox";

export interface UnsettledOrder {
  _id: string;
  ticketNumber: number;
  deliveredAt: string;
  totalPrice: number;
  payment: {
    status: "SUCCESS" | "NOT_COLLECTED" | "PENDING" | "FAILURE";
    amount: number;
    _id: string;
  };
  customer: {
    name: string;
    number: number;
  };
  hotel: {
    name: string;
  };
}

export function UnsettledOrders({ id }: { id: string }) {
  const [loading, setLoading] = useState(true);
  const [unsettledOrders, setUnsettledOrders] = useState<UnsettledOrder[]>([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string[]>([]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await fetch(`${API.GET_UNSETTLED_ORDERS}/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch orders");

      const { orders }: { orders: UnsettledOrder[] } = await response.json();
      setUnsettledOrders(orders);
    } catch (err) {
      console.error("[GET /admin/get-unsettled-orders/:id] Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (unsettledOrders.length === 0) {
    return null;
  }

  if (loading) {
    return <UnsettledOrdersSkeleton />;
  }

  const handleCheckboxChange = (paymentId: string, isChecked: boolean) => {
    setSelectedPaymentId((prev) => {
      if (isChecked) {
        // Add to array if not already present
        return prev.includes(paymentId) ? prev : [...prev, paymentId];
      } else {
        // Remove from array
        return prev.filter((id) => id !== paymentId);
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedPaymentId.length === unsettledOrders.length) {
      // All are already selected → unselect all
      setSelectedPaymentId([]);
    } else {
      // Select all _id's
      const allOrderIds = unsettledOrders.map((order) => order.payment._id);
      setSelectedPaymentId(allOrderIds);
    }
  };

  const handleSettleOrders = async () => {
    if (!selectedPaymentId) {
      return null;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("jwt_token");
      const admin_id = localStorage.getItem("user_id");
      const response = await fetch(`${API.MARK_SETTLED_ORDERS}/${admin_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ selectedPaymentId }),
      });

      if (!response.ok) throw new Error("Failed to fetch orders");

      fetchOrders();
      setSelectedPaymentId([])
    } catch (err) {
      console.error("[GET /admin/mark-settled-orders/:id] Error:", err);
    }
  };

  const selectedTotalAmount = unsettledOrders
    .filter((order) => selectedPaymentId.includes(order.payment._id))
    .reduce((sum, order) => sum + order.payment.amount, 0);

  return (
    <div className="mt-10 rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="flex justify-between px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          Unsettled orders
        </h2>
        <h6
          className="cursor-pointer text-body-sm font-bold text-gray-6 hover:underline"
          onClick={fetchOrders}
        >
          Refresh
        </h6>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead className="min-w-[120px] pl-5 sm:pl-6 xl:pl-7.5">
              Ticket #
            </TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Hotel</TableHead>
            <TableHead>Delivered On</TableHead>
            <TableHead>Order Value (₹)</TableHead>
            <TableHead>Payment Status</TableHead>
            {/* <TableHead>Select</TableHead> */}
            <TableHead>
              <Checkbox
                label="Select all"
                checked={
                  unsettledOrders.length > 0 &&
                  selectedPaymentId.length === unsettledOrders.length
                }
                onChange={handleSelectAll}
              />
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {unsettledOrders.map((order, index) => (
            <TableRow
              key={order.ticketNumber}
              className="text-base font-medium text-dark dark:text-white"
            >
              {/* Ticket Number */}
              <TableCell className="pl-5 sm:pl-6 xl:pl-7.5">
                #{order.ticketNumber}
              </TableCell>

              {/* Customer Info */}
              <TableCell>
                <div className="flex flex-col">
                  <span>{order.customer.name}</span>
                  <span className="text-sm text-gray-5 dark:text-gray-6">
                    {order.customer.number}
                  </span>
                </div>
              </TableCell>

              {/* Restaurant Name */}
              <TableCell>{order.hotel.name}</TableCell>

              {/* Delivered At */}
              <TableCell>
                {new Date(order.deliveredAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </TableCell>

              {/* Total Amount */}
              <TableCell>₹{order.totalPrice}</TableCell>

              <TableCell
                className={cn(
                  "",
                  order.payment.status === "SUCCESS"
                    ? "text-green-light-1"
                    : "text-red-light",
                )}
              >
                {order.payment.status}
              </TableCell>
              <TableCell>
                <Checkbox
                  label=""
                  checked={selectedPaymentId.includes(order.payment._id)}
                  onChange={(e) =>
                    handleCheckboxChange(order.payment._id, e.target.checked)
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedPaymentId.length > 0 && (
        <div className="mt-5 flex flex-col px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-5 xl:px-8.5">
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            Total: ₹{selectedTotalAmount.toFixed(2)}
          </h3>
          <button
            disabled={loading}
            className={cn(
              "mt-3 rounded px-4 py-2 text-white shadow-md transition sm:mt-0",
              loading
                ? "cursor-not-allowed bg-gray-400"
                : "bg-green-600 hover:bg-green-500",
            )}
            onClick={handleSettleOrders}
          >
            {loading ? "Processing..." : "Mark as settled"}
          </button>
        </div>
      )}
    </div>
  );
}
