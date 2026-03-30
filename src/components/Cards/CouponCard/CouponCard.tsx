"use client";

import { useEffect, useState } from "react";
import { API } from "@/constants/api";
import { cn } from "@/lib/utils";
import SwitcherThree from "@/components/FormElements/Switchers/SwitcherThree";
import { InfoRow } from "@/components/ui/table";

interface CouponDetailCardProps {
  id: string;
}

interface CouponData {
  _id: string;
  code: string;
  isActive: boolean;
  isHidden: boolean;
  discountType: "FLAT" | "PERCENTAGE";
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderValue: number;
  validFrom: string;
  validUntil: string;
  allowedHotels: string[];
  targetAudience: string;
  createdAt: string;
}

export default function CouponDetailCard({ id }: CouponDetailCardProps) {
  const [data, setData] = useState<CouponData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchCoupon = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt_token");
      // Ensure API.GET_COUPON is defined in your constants
      const response = await fetch(`${API.GET_COUPON}/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch coupon");
      const result = await response.json();
      
      // Assuming your API returns { success: true, coupon: { ... } } or just the object
      setData(result.coupon || result);
    } catch (err) {
      console.error("[GET /admin/get-coupon/:id] Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupon();
  }, [id]);

  // Unified function to update specific boolean fields (isActive, isHidden)
  const updateCouponStatus = async (field: "isActive" | "isHidden", value: boolean) => {
    setIsUpdating(true);
    // Optimistic UI update
    setData((prev) => (prev ? { ...prev, [field]: value } : prev));

    try {
      const token = localStorage.getItem("jwt_token");
      const response = await fetch(`${API.EDIT_COUPON}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: value }),
      });

      if (!response.ok) {
        const err = await response.json();
        console.error(`Failed to update ${field}:`, err.message || "Unknown error");
        // Revert on failure
        fetchCoupon(); 
        return;
      }
    } catch (error) {
      console.error(`Error while updating ${field}:`, error);
      fetchCoupon(); // Revert on failure
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="grid h-40 place-items-center rounded-[10px] bg-white text-dark shadow-1 dark:bg-gray-dark dark:text-white">
        <p className="animate-pulse font-medium">Loading coupon details...</p>
      </div>
    );
  }

  if (!data) {
    return <div className="text-lg text-red-500">Coupon not found.</div>;
  }

  // Formatting helpers
  const isExpired = new Date(data.validUntil) < new Date();
  const formatValue = (type: string, val: number) => 
    type === "PERCENTAGE" ? `${val}%` : `₹${val}`;

  return (
    <div className={cn("grid rounded-[10px] bg-white p-6 text-dark shadow-1 dark:bg-gray-dark dark:text-white transition-opacity", isUpdating && "opacity-70")}>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-heading-5 font-bold">Coupon Details</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage settings for <span className="font-bold text-primary">{data.code}</span>
          </p>
        </div>
        <h6
          className="cursor-pointer text-body-sm font-bold text-gray-6 hover:text-primary hover:underline transition-colors"
          onClick={fetchCoupon}
        >
          Refresh
        </h6>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Core Details */}
        <InfoRow label="Coupon Code" value={data.code} />
        <InfoRow label="Discount Type" value={data.discountType === "PERCENTAGE" ? "Percentage" : "Flat Amount"} />
        <InfoRow label="Discount Value" value={formatValue(data.discountType, data.discountValue)} />
        
        {/* Constraints */}
        <InfoRow 
          label="Min. Order Value" 
          value={data.minOrderValue > 0 ? `₹${data.minOrderValue}` : "No Minimum"} 
        />
        <InfoRow 
          label="Max. Discount" 
          value={data.maxDiscountAmount ? `₹${data.maxDiscountAmount}` : "No Limit"} 
        />
        <InfoRow 
          label="Target Audience" 
          value={data.targetAudience.replace("_", " ")} 
          className="capitalize"
        />

        {/* Timings */}
        <InfoRow 
          label="Valid From" 
          value={new Date(data.validFrom).toLocaleDateString("en-IN", { dateStyle: "medium" })} 
        />
        <InfoRow 
          label="Valid Until" 
          value={new Date(data.validUntil).toLocaleDateString("en-IN", { dateStyle: "medium" })} 
          className={isExpired ? "text-red-500 font-medium" : ""}
        />
        <InfoRow 
          label="Status" 
          value={isExpired ? "Expired" : "Active Timeline"} 
          className={isExpired ? "text-red-500" : "text-green-500"}
        />

        {/* Relations */}
        <InfoRow 
          label="Applicable Restaurants" 
          value={data.allowedHotels && data.allowedHotels.length > 0 ? `${data.allowedHotels.length} Selected` : "All Restaurants"} 
        />
        <InfoRow 
          label="Created On" 
          value={new Date(data.createdAt).toLocaleDateString("en-IN")} 
        />

        {/* Interactive Toggles (Empty div to maintain grid alignment if needed, or place them naturally) */}
        <div className="col-span-1 md:col-span-3 mt-4 pt-4 border-t border-stroke dark:border-dark-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-center justify-between rounded-lg border border-stroke p-4 dark:border-dark-3">
            <div>
              <p className="font-medium text-dark dark:text-white">Active Status</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Turn off to temporarily disable this coupon
              </p>
            </div>
            <SwitcherThree
              enabled={data.isActive}
              onChange={(s) => updateCouponStatus("isActive", s)}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-stroke p-4 dark:border-dark-3">
            <div>
              <p className="font-medium text-dark dark:text-white">Hidden Status</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Hide from user-facing promotional lists
              </p>
            </div>
            <SwitcherThree
              enabled={data.isHidden}
              onChange={(s) => updateCouponStatus("isHidden", s)}
            />
          </div>
        </div>

      </div>
    </div>
  );
}