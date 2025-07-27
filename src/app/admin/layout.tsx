import "@/css/satoshi.css";
import "@/css/style.css";

import { Sidebar } from "@/components/Layouts/sidebar";
import { Header } from "@/components/Layouts/header";
import { Providers } from "./providers";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: {
    template: "%s | MagicMenu Admin",
    default: "Dashboard | MagicMenu Admin",
  },
  description: "Admin dashboard for managing MagicMenu operations efficiently.",
};

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <Providers>
      {/* <NextTopLoader color="#5750F1" showSpinner={false} /> */}

      <div className="flex min-h-screen">
        <Sidebar />

        <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
          <Header />
          <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-5">
            {children}
          </main>
        </div>
      </div>
    </Providers>
  );
}
