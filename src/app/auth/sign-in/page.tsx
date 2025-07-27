import Signin from "@/components/Auth/Signin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Sign In | Magic Menu",
};

export default function SignInPage() {
  return (
    <div className="bg-muted flex min-h-screen items-center justify-center px-4 dark:bg-dark">
      <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-xl bg-white shadow-md dark:bg-gray-dark xl:grid-cols-2">
        {/* Left: Sign-in Form */}
        <div className="p-6 sm:p-10">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-dark dark:text-white">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Sign in to access your admin dashboard.
            </p>
          </div>

          <Signin />
        </div>

        {/* Right: Branding Section (same as signup) */}
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
