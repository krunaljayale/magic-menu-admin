"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import { API } from "@/constants/api";
import { CameraIcon } from "./_components/icons";

type Profile = {
  name: string;
  number: number;
  email: string;
  role: string;
  city: string;
};

export default function ProfilePage() {
  const [data, setData] = useState<Profile | null>(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      const user_id = localStorage.getItem("user_id");

      const response = await fetch(`${API.GET_PROFILE_DATA}/${user_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch profile");
      const profile = await response.json();
      setData(profile);
    } catch (err) {
      console.error("[GET /admin/profile/:admin_id] Error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="mx-auto w-full max-w-[970px]">
      <Breadcrumb pageName="Profile" />

      <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        {/* Cover Photo */}
        <div className="relative z-20 h-35 md:h-65">
          <Image
            src={require("@/assets/features/admin-feature-dark.png")}
            alt="Profile cover"
            className="hidden h-full w-full rounded-tl-[10px] rounded-tr-[10px] object-cover object-center dark:block"
            width={970}
            height={260}
          />
          <Image
            src={require("@/assets/features/admin-feature-light.jpg")}
            alt="Profile cover"
            className="block h-full w-full rounded-tl-[10px] rounded-tr-[10px] object-cover object-center dark:hidden"
            width={970}
            height={260}
          />
        </div>

        {/* Profile Photo Placeholder */}
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-[176px] sm:p-3">
            <div className="relative drop-shadow-2">
              <Image
                src="https://res.cloudinary.com/dcgskimn8/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1751378543/icon_smizvh.png"
                width={160}
                height={160}
                className="overflow-hidden rounded-full"
                alt="profile"
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="mt-6">
            <h3 className="mb-2 text-heading-6 font-bold text-dark dark:text-white">
              {data?.name}
            </h3>
            <p className="text-body-sm text-gray-6 dark:text-gray-4">
              {data?.role}
            </p>
          </div>

          {/* Details Section - No Card */}
          <div className="mt-6 px-4 text-left sm:px-6 lg:px-8">
            <div className="mb-4">
              <p className="text-body-sm text-gray-5 dark:text-gray-4">Email</p>
              <p className="text-base font-medium text-dark dark:text-white">
                {data?.email}
              </p>
            </div>

            <div className="mb-4">
              <p className="text-body-sm text-gray-5 dark:text-gray-4">
                Phone Number
              </p>
              <p className="text-base font-medium text-dark dark:text-white">
                {data?.number}
              </p>
            </div>

            <div className="mb-4">
              <p className="text-body-sm text-gray-5 dark:text-gray-4">City</p>
              <p className="text-base font-medium text-dark dark:text-white">
                {data?.city}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
