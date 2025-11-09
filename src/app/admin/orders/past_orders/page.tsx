
import { Metadata } from "next";
import PastOrdersTablesPage from "./tables/page";

export const metadata: Metadata = {
  title: "PastOrders Page",
};

function PastOrders() {
  return <PastOrdersTablesPage/>;
}

export default PastOrders;
