
import { Metadata } from "next";
import AddCoupon from "./create-new/NewCoupon";

export const metadata: Metadata = {
  title: "Add New Coupon",
};

function NewCoupon() {
  return <AddCoupon/>;
}

export default NewCoupon;
