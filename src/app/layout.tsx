import "@/css/satoshi.css";
import "@/css/style.css";


import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:'Magic Menu',
  description: "Magic Menu.",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

