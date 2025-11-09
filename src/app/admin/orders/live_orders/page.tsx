
import { Metadata } from "next";
import LiveOrdersPageTables from "./tables/page";

export const metadata: Metadata = {
  title: "LiveOrders Page",
};

function LiveOrders() {
  return <LiveOrdersPageTables/>;
}

export default LiveOrders;
