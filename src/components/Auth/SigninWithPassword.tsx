"use client";
import { CallIcon, PasswordIcon } from "@/assets/icons";
import React, { useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { API } from "@/constants/api";
import { useRouter } from "next/navigation";

type LoginResponse = {
  token: string;
  userId: string;
  error?: string;
  name:string;
  number:number;
  role:string;
};

export default function SigninWithPassword() {
  const [data, setData] = useState({
    number: "",
    password: "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { number, password } = data;

    if (!number || !password) {
      setMessage("❌ All fields are required.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(API.LOGIN_ADMIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          number: number.toString(),
          password: password.trim(),
        }),
      });

      const result: LoginResponse = await response.json();

      if (response.ok) {
        const { token, userId, name, number,role } = result;

        // Store JWT and userId for future use
        localStorage.setItem("jwt_token", token);
        localStorage.setItem("user_id", userId);
        localStorage.setItem("admin_name", name);
        localStorage.setItem("admin_role", role);
        localStorage.setItem("admin_number", number.toString());

        await fetch("/api/set-cookie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, userId }),
        });

        setMessage("✅ Login successful.");

        // Optionally redirect
        router.push("/admin");
      } else {
        setMessage(`❌ ${result?.error || "Login failed."}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("❌ Server error. Please try again.");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup
        type="number"
        label="Number"
        className="mb-4 [&_input]:py-[15px]"
        placeholder="Enter your number"
        name="number"
        handleChange={handleChange}
        value={data.number}
        icon={<CallIcon />}
        required
      />

      <InputGroup
        type="password"
        label="Password"
        className="mb-5 [&_input]:py-[15px]"
        placeholder="Enter your password"
        name="password"
        handleChange={handleChange}
        value={data.password}
        icon={<PasswordIcon />}
        required
      />

      {/* <div className="mb-6 flex items-center justify-between gap-2 py-2 font-medium">
        <Checkbox
          label="Remember me"
          name="remember"
          withIcon="check"
          minimal
          radius="md"
          onChange={(e) =>
            setData({
              ...data,
              remember: e.target.checked,
            })
          }
        />

        <Link
          href="/auth/forgot-password"
          className="hover:text-primary dark:text-white dark:hover:text-primary"
        >
          Forgot Password?
        </Link>
      </div> */}

      <div className="mb-4.5">
        <button
          type="submit"
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
        >
          Sign In
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
          )}
        </button>
        {message && (
          <p
            className={`mb-4 mt-4 text-sm font-medium ${
              String(message).startsWith("✅")
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {String(message)}
          </p>
        )}
      </div>
    </form>
  );
}
