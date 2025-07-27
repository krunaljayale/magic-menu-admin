import { Metadata } from "next";
import React from "react";
import RidersTablesPage from "./tables/page";

export const metadata: Metadata = {
  title: "Riders Page",
};

function Riders() {
  return <RidersTablesPage />;
}

export default Riders;
