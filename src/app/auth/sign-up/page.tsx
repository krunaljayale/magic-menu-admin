"use client";

import InputGroup from "@/components/FormElements/InputGroup";
import Link from "next/link";
import { useState } from "react";
import RoleDropdown from "./component/RoleDropDown";
import { API } from "@/constants/api";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
    role: "",
  });

  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const admin_role = localStorage.getItem("admin_role");

    const { name, number, email, password, confirmPassword, city, role } =
      formData;

    if (
      !name ||
      !number ||
      !email ||
      !password ||
      !confirmPassword ||
      !city ||
      !role
    ) {
      return setMessage("❌ All fields are required.");
    }

    if (number.length != 10) {
      return setMessage("❌ Incorrect mobile number.");
    }

    if (password !== confirmPassword) {
      return setMessage("❌ Passwords do not match.");
    }

    if (!role) {
      return setMessage("❌ Please select a role.");
    }

    if (admin_role !== "SUPER_ADMIN") {
      return setMessage("❌ You are not authorized to create a new account.");
    }

    try {
      const admin_id = localStorage.getItem("user_id");
      const res = await fetch(`${API.REGISTER_ADMIN}/${admin_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          number,
          email: email.trim(),
          password: password.trim(),
          city: city.trim(),
          role,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Admin created successfully.");
        setFormData({
          name: "",
          number: "",
          email: "",
          password: "",
          confirmPassword: "",
          city: "",
          role: "",
        });
        router.push("/admin");
      } else {
        setMessage(data.message || "❌ Something went wrong.");
      }
    } catch (err) {
      // console.error(err);
      setMessage("❌ Server error. Please try again.");
    }
  };

  return (
    <div className="bg-muted flex items-center justify-center px-4 py-10 dark:bg-dark">
      <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-xl bg-white shadow-md dark:bg-gray-dark xl:grid-cols-2">
        {/* Left: Sign Up Form */}
        <div className="p-6 sm:p-10">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-dark dark:text-white">
              Create an Account
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Sign up to access the MagicMenu Admin Dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <InputGroup
              label="Full Name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              handleChange={handleChange}
              className="mb-4"
              required
            />
            <InputGroup
              label="Mobile Number"
              name="number"
              type="text"
              placeholder="9876543210"
              value={formData.number}
              handleChange={handleChange}
              className="mb-4"
              required
            />
            <InputGroup
              label="Email Address"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              handleChange={handleChange}
              className="mb-4"
              required
            />
            <InputGroup
              label="City"
              name="city"
              type="text"
              placeholder="Your city"
              value={formData.city}
              handleChange={handleChange}
              className="mb-4"
              required
            />
            {/* Role Dropdown Styled */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Role <span className="text-red">*</span>
              </label>
              <RoleDropdown
                selected={formData.role}
                onSelect={(value: string) =>
                  setFormData((prev) => ({ ...prev, role: value }))
                }
              />
            </div>
            <InputGroup
              label="Password"
              name="password"
              type="password"
              placeholder="********"
              value={formData.password}
              handleChange={handleChange}
              className="mb-4"
              required
            />
            <InputGroup
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="********"
              value={formData.confirmPassword}
              handleChange={handleChange}
              className="mb-6"
              required
            />

            {/* Error or Success Message */}
            {message && (
              <p
                className={`mb-4 text-sm font-medium ${
                  String(message).startsWith("✅")
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {String(message)}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-primary p-[13px] font-semibold text-white transition-all duration-150 hover:bg-opacity-90"
            >
              Sign Up
            </button>
          </form>

          {/* <div className="mt-6 text-center">
            <p>
              Already have an account?{" "}
              <Link href="/admin/auth/sign-in" className="text-primary">
                Sign In
              </Link>
            </p>
          </div> */}
        </div>

        {/* Right: Branding Block */}
        <div className="hidden flex-col items-center justify-center rounded-r-[10px] bg-gradient-to-br from-[#573CFF] to-[#FF0069] p-10 text-white dark:bg-dark-2 xl:flex">
          <h1 className="mb-1 bg-gradient-to-br from-white to-gray-300 bg-clip-text pb-1 text-4xl font-extrabold leading-tight text-transparent">
            MagicMenu Admin
          </h1>
          <h2 className="mb-2 text-center text-xl font-semibold text-white">
            Manage operations with confidence.
          </h2>
          <p className="max-w-sm text-center text-base text-white text-opacity-90">
            Access restaurants, orders, customers, and riders — all from a
            single streamlined dashboard. Built for performance. Built for
            scale.
          </p>
        </div>
      </div>
    </div>
  );
}
