"use client";

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

interface Coupon {
  _id: string;
  code: string;
  isActive: boolean;
  discountType: "PERCENTAGE" | "FLAT";
  discountValue: number;
}

const CouponsTable = ({
  viewCoupon,
}: {
  viewCoupon?: (id: string) => void;
}) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCoupons = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("jwt_token");
      const response = await fetch(`${API.GET_ALL_COUPONS}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch coupons");

      const data = await response.json();

      if (data.success && data.coupons) {
        setCoupons(data.coupons);
      }
    } catch (err) {
      console.error("[GET /api/coupons] Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleView = (id: string) => {
    if (viewCoupon) {
      viewCoupon(id);
    }
  };

  if (coupons.length === 0 && !loading) {
    return null;
  }

  return (
    <div className="mt-10 rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="flex justify-between px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          Total Coupons
        </h2>
        <h6
          className="cursor-pointer text-body-sm font-bold text-gray-6"
          onClick={fetchCoupons}
        >
          Refresh
        </h6>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead className="min-w-[120px] pl-5 sm:pl-6 xl:pl-7.5">
              Coupon Code
            </TableHead>
            <TableHead>Discount Type</TableHead>
            <TableHead>Discount Value</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {coupons.map((coupon) => (
            <TableRow
              key={coupon._id}
              className="text-base font-medium text-dark dark:text-white"
            >
              <TableCell className="pl-5 sm:pl-6 xl:pl-7.5">
                <span className="rounded bg-gray-100 px-2 py-1 font-mono text-sm tracking-wider dark:bg-gray-800">
                  {coupon.code}
                </span>
              </TableCell>

              <TableCell>
                {coupon.discountType === "PERCENTAGE"
                  ? "Percentage"
                  : "Flat Amount"}
              </TableCell>

              <TableCell>
                {coupon.discountType === "PERCENTAGE"
                  ? `${coupon.discountValue}%`
                  : `₹${coupon.discountValue}`}
              </TableCell>

              <TableCell
                className={
                  coupon.isActive
                    ? "text-green-light-1 dark:text-green-light-2"
                    : "text-red-light"
                }
              >
                {coupon.isActive ? "Active" : "Inactive"}
              </TableCell>

              <TableCell
                className="flex cursor-pointer items-center justify-center gap-x-2 text-blue-light dark:text-blue-light-2"
                onClick={() => handleView(coupon._id)}
              >
                View
                <PreviewIcon />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CouponsTable;
