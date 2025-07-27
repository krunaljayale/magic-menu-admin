import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Form Layout",
};

export default function Page() {
  return <Breadcrumb pageName="Form Layout" />;
}
