"use client";

import { API } from "@/constants/api";
import React, { useState, useEffect } from "react";
import { CustomButton } from "@/components/Buttons/CustomButtton";

interface Restaurant {
  _id: string;
  name: string;
}

function AddCoupon() {
  // Form Submission & Status State
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Restaurant Selection Logic State
  const [applyToAll, setApplyToAll] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isFetchingRestaurants, setIsFetchingRestaurants] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  // Core Form Data State
  const [formData, setFormData] = useState({
    code: "",
    isActive: true,
    isHidden: false,
    discountType: "PERCENTAGE",
    discountValue: "",
    maxDiscountAmount: "",
    minOrderValue: 0,
    validFrom: "",
    validUntil: "",
    targetAudience: "ALL",
    allowedHotels: [] as string[],
  });

  // Lazy-Load Restaurants Effect
  useEffect(() => {
    if (!applyToAll && !hasFetched) {
      const fetchRestaurants = async () => {
        setIsFetchingRestaurants(true);
        try {
          const token = localStorage.getItem("jwt_token");
          const res = await fetch(`${API.GET_ALL_RESTAURANTS}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.ok) {
            const data = await res.json();
            setRestaurants(data.restaurants || data);
            setHasFetched(true);
          }
        } catch (err) {
          console.error("Failed to fetch restaurants", err);
        } finally {
          setIsFetchingRestaurants(false);
        }
      };

      fetchRestaurants();
    }
  }, [applyToAll, hasFetched]);

  // General Input Handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "code" ? value.toUpperCase() : value,
      }));
    }
  };

  // Individual Hotel Toggle Handler
  const toggleHotel = (hotelId: string) => {
    setFormData((prev) => {
      const isSelected = prev.allowedHotels.includes(hotelId);
      return {
        ...prev,
        allowedHotels: isSelected
          ? prev.allowedHotels.filter((id) => id !== hotelId)
          : [...prev.allowedHotels, hotelId],
      };
    });
  };

  // Search Filtering Logic
  const filteredHotels = restaurants.filter((hotel) =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Context-Aware Select All Handler
  const isAllFilteredSelected =
    filteredHotels.length > 0 &&
    filteredHotels.every((hotel) => formData.allowedHotels.includes(hotel._id));

  const handleSelectAll = (e: React.MouseEvent) => {
    e.preventDefault();
    const filteredIds = filteredHotels.map((h) => h._id);

    setFormData((prev) => {
      if (isAllFilteredSelected) {
        return {
          ...prev,
          allowedHotels: prev.allowedHotels.filter(
            (id) => !filteredIds.includes(id),
          ),
        };
      } else {
        return {
          ...prev,
          allowedHotels: Array.from(
            new Set([...prev.allowedHotels, ...filteredIds]),
          ),
        };
      }
    });
  };

  // Form Submission Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setStatus("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("jwt_token");

      // Format payload to match schema types strictly
      const payload = {
        ...formData,
        discountValue: Number(formData.discountValue),
        maxDiscountAmount: formData.maxDiscountAmount
          ? Number(formData.maxDiscountAmount)
          : undefined,
        minOrderValue: Number(formData.minOrderValue),
        // Send raw YYYY-MM-DD strings directly to the backend
        validFrom: formData.validFrom || undefined,
        validUntil: formData.validUntil,
        // Crucial: Send empty array if applyToAll is true
        allowedHotels: applyToAll ? [] : formData.allowedHotels,
      };

      const res = await fetch(`${API.CREATE_COUPON}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus("✅ Coupon created successfully");
        // Reset form and logic gates
        setFormData({
          code: "",
          isActive: true,
          isHidden: false,
          discountType: "PERCENTAGE",
          discountValue: "",
          maxDiscountAmount: "",
          minOrderValue: 0,
          validFrom: "",
          validUntil: "",
          targetAudience: "ALL",
          allowedHotels: [],
        });
        setApplyToAll(true);
        setSearchTerm("");
      } else {
        const err = await res.json();
        setStatus(`❌ Failed: ${err.message || "Server error"}`);
      }
    } catch (err) {
      setStatus("❌ Network error while creating coupon");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClassName =
    "w-full rounded border border-gray-300 bg-white px-4 py-2 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="grid rounded-[10px] bg-white p-6 text-dark shadow-1 dark:bg-gray-dark dark:text-white">
      {/* Header Area */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-heading-6 font-bold">Add New Coupon</h2>
          <h6 className="text-body-sm font-medium text-gray-6 dark:text-gray-400">
            Define restrictions and applicable restaurants
          </h6>
        </div>
        <div className="flex gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              disabled={isLoading}
              className="h-4 w-4 accent-primary"
            />
            Active
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              name="isHidden"
              checked={formData.isHidden}
              onChange={handleChange}
              disabled={isLoading}
              className="h-4 w-4 accent-primary"
            />
            Hidden
          </label>
        </div>
      </div>

      <form
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
        onSubmit={handleSubmit}
      >
        {/* Row 1: Code & Target */}
        <div>
          <label className="mb-2 block text-base font-medium">
            Coupon Code *
          </label>
          <input
            type="text"
            name="code"
            className={inputClassName}
            placeholder="SUMMER25"
            value={formData.code}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-base font-medium">
            Target Audience *
          </label>
          <select
            name="targetAudience"
            className={inputClassName}
            value={formData.targetAudience}
            onChange={handleChange}
            disabled={isLoading}
          >
            <option value="ALL">All Users</option>
            <option value="NEW_USERS">New Users Only</option>
            <option value="INACTIVE_USERS">Inactive Users</option>
            <option value="VIP_USERS">VIP Users</option>
          </select>
        </div>

        {/* Row 2: Discount Limits */}
        <div>
          <label className="mb-2 block text-base font-medium">
            Discount Type *
          </label>
          <select
            name="discountType"
            className={inputClassName}
            value={formData.discountType}
            onChange={handleChange}
            disabled={isLoading}
          >
            <option value="PERCENTAGE">Percentage (%)</option>
            <option value="FLAT">Flat Amount (₹)</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-base font-medium">
            Discount Value *
          </label>
          <input
            type="number"
            name="discountValue"
            min="0"
            step="0.01"
            className={inputClassName}
            placeholder={
              formData.discountType === "PERCENTAGE" ? "e.g. 15" : "e.g. 50"
            }
            value={formData.discountValue}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>

        {/* Row 3: Constraints */}
        <div>
          <label className="mb-2 block text-base font-medium">
            Max Discount Amount
          </label>
          <input
            type="number"
            name="maxDiscountAmount"
            min="0"
            step="0.01"
            className={inputClassName}
            placeholder="No limit"
            value={formData.maxDiscountAmount}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="mb-2 block text-base font-medium">
            Minimum Order Value
          </label>
          <input
            type="number"
            name="minOrderValue"
            min="0"
            step="0.01"
            className={inputClassName}
            placeholder="0"
            value={formData.minOrderValue}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        {/* Row 4: Dates */}
        <div>
          <label className="mb-2 block text-base font-medium">Valid From</label>
          {/* Changed to type="date" */}
          <input
            type="date"
            name="validFrom"
            className={inputClassName}
            value={formData.validFrom}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="mb-2 block text-base font-medium">
            Valid Until *
          </label>
          {/* Changed to type="date" */}
          <input
            type="date"
            name="validUntil"
            className={inputClassName}
            value={formData.validUntil}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>

        {/* Row 5: Restaurant Availability (Lazy Loaded) */}
        <div className="col-span-1 pt-2 md:col-span-2">
          <label className="mb-3 block text-base font-medium">
            Restaurant Availability
          </label>

          {/* Logic Gates */}
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:gap-8">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
              <input
                type="radio"
                checked={applyToAll}
                onChange={() => {
                  setApplyToAll(true);
                  setFormData((prev) => ({ ...prev, allowedHotels: [] }));
                }}
                disabled={isLoading}
                className="h-4 w-4 accent-primary"
              />
              Apply to all restaurants
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
              <input
                type="radio"
                checked={!applyToAll}
                onChange={() => setApplyToAll(false)}
                disabled={isLoading}
                className="h-4 w-4 accent-primary"
              />
              Restrict to specific restaurants
            </label>
          </div>

          {/* Conditional Selection Area */}
          {!applyToAll && (
            <div className="animate-in fade-in rounded-lg border border-gray-300 p-4 shadow-sm dark:border-gray-600">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold">
                  Selected ({formData.allowedHotels.length})
                </span>
                {filteredHotels.length > 0 && !isFetchingRestaurants && (
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="dark:text-primary-light text-sm font-medium text-primary hover:underline"
                  >
                    {isAllFilteredSelected
                      ? "Deselect All Visible"
                      : "Select All Visible"}
                  </button>
                )}
              </div>

              <input
                type="text"
                placeholder="Search restaurants..."
                className="mb-4 w-full border-b border-gray-200 bg-transparent pb-2 text-sm outline-none focus:border-primary dark:border-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoading}
              />

              <div className="grid h-48 grid-cols-1 overflow-y-auto pr-2 sm:grid-cols-2 md:grid-cols-3">
                {isFetchingRestaurants ? (
                  <p className="col-span-full py-8 text-center text-sm italic text-gray-500">
                    Fetching active restaurants...
                  </p>
                ) : filteredHotels.length > 0 ? (
                  filteredHotels.map((hotel) => (
                    <label
                      key={hotel._id}
                      className="flex cursor-pointer items-center gap-3 rounded p-2 transition hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <input
                        type="checkbox"
                        checked={formData.allowedHotels.includes(hotel._id)}
                        onChange={() => toggleHotel(hotel._id)}
                        disabled={isLoading}
                        className="h-4 w-4 rounded border-gray-300 accent-primary"
                      />
                      <span className="truncate text-sm" title={hotel.name}>
                        {hotel.name}
                      </span>
                    </label>
                  ))
                ) : (
                  <p className="col-span-full py-8 text-center text-sm text-gray-500">
                    No restaurants match your search.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Submit Area */}
        <div className="col-span-1 mt-2 flex flex-col items-end border-t border-gray-200 pt-6 dark:border-gray-700 md:col-span-2">
          <CustomButton
            type="submit"
            isLoading={isLoading}
            disabled={
              !formData.code ||
              !formData.discountValue ||
              !formData.validUntil ||
              (!applyToAll && formData.allowedHotels.length === 0)
            }
            className="w-full md:w-auto"
          >
            Create Coupon
          </CustomButton>

          {status && (
            <p
              className={`mt-4 text-sm font-medium ${status.includes("✅") ? "text-green-600 dark:text-green-400" : "text-red-500"}`}
            >
              {status}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

export default AddCoupon;
