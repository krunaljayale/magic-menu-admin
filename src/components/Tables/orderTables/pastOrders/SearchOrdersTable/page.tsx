"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SearchIcon } from "@/assets/icons";
import { API } from "@/constants/api";

const SearchOrdersTable = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchOrders = async (search = "") => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt_token");

      const response = await fetch(`${API.GET_SEARCHED_ORDER}/${search}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch past orders");
      const data = await response.json();
      setOrders(data.orders);
    } catch (err) {
      console.error("Error fetching orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query.length === 6) {
      fetchOrders(query);
    }
    if (query.length != 6) {
      setOrders([]);
    }
  }, [query]);

  return (
    <div className="rounded-[10px] bg-white pb-5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="flex justify-between px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          Search for Order
        </h2>
      </div>

      <div className="relative m-5 w-full max-w-[300px]">
        <input
          type="search"
          placeholder="Search Order Id, e.g. 526484"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex w-full items-center gap-3.5 rounded-full border bg-gray-2 py-3 pl-[53px] pr-6 outline-none transition-colors focus-visible:border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-dark-4 dark:hover:bg-dark-3 dark:hover:text-dark-6 dark:focus-visible:border-primary"
          maxLength={6}
        />

        <SearchIcon className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 max-[1015px]:size-5" />
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : orders.length === 0 ? null : (
        <Table>
          <TableHeader>
            <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
              <TableHead className="min-w-[120px] pl-5 sm:pl-6 xl:pl-7.5">
                Order Id #
              </TableHead>
              <TableHead>Hotel Name</TableHead>
              <TableHead>Ordered On</TableHead>
              <TableHead>Order Value (₹)</TableHead>
              <TableHead>Rider</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order.orderId}
                className="text-base font-medium text-dark dark:text-white"
              >
                <TableCell className="pl-5 sm:pl-6 xl:pl-7.5">
                  #{order.orderId}
                </TableCell>
                <TableCell>{order.hotelName}</TableCell>
                <TableCell>
                  {new Date(order.orderedOn).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </TableCell>
                <TableCell>₹{order.orderValue}</TableCell>
                <TableCell>{order.riderName}</TableCell>
                <TableCell>{order.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default SearchOrdersTable;
