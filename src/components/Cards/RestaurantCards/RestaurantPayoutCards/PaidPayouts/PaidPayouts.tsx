import { PreviewIcon } from "@/components/Tables/icons";
import { InfoRow } from "@/components/ui/table";
import { API } from "@/constants/api";
import React, { useEffect, useState } from "react";
import { PendingPayoutsSkeleton } from "../PendingPayouts/PendingPayoutsSekeleton";
import ImagePreviewModal from "@/components/Modals/ImagePreviewModal/page";

function PaidPayouts({ id }: { id: string }) {
  const [loading, setLoading] = useState(true);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const fetchPaidPayouts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt_token");
      const res = await fetch(`${API.GET_PAID_PAYOUTS}/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch pending payouts");

      const data = await res.json();
      setPayouts(data);
    } catch (err) {
      console.error("[GET /get-pending-payouts] error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaidPayouts();
  }, []);

  if (loading) return <PendingPayoutsSkeleton />;
  if (payouts.length === 0) return <p>No pending payouts found.</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h3 className="text-2xl font-semibold">Paid Payouts</h3>
        <h6
          className="cursor-pointer text-body-sm font-bold text-gray-6 hover:underline"
          onClick={fetchPaidPayouts}
        >
          Refresh
        </h6>
      </div>

      {payouts.map((payout) => (
        <div
          key={payout._id}
          className="space-y-6 rounded-2xl bg-white p-6 shadow-md dark:bg-slate-900"
        >
          <div className="flex items-start justify-between text-base">
            <div>
              <p className="text-lg font-medium">
                Week:{" "}
                {new Date(payout.weekStart).toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}{" "}
                –{" "}
                {new Date(payout.weekEnd).toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Orders: {payout.totalOrders} | Rejected:{" "}
                {payout.rejectedOrders || 0}
              </p>
            </div>
            <span className="mt-1 text-sm font-semibold text-green-700 dark:text-green-400">
              {payout.status}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <InfoRow
              label="Gross Revenue"
              value={`₹${payout.grossRevenue.toFixed(2)}`}
            />
            <InfoRow
              label="Commission"
              value={`₹${payout.commissionAmount.toFixed(2)}`}
            />
            <InfoRow
              label="Tax on Commission"
              value={`₹${payout.taxOnCommission.toFixed(2)}`}
            />
            <InfoRow
              label="Net Revenue/Paid Amount"
              value={`₹${payout.netRevenue.toFixed(2)}`}
            />
            <InfoRow label="Deductions" value={`₹${payout.deductions || 0}`} />
            <InfoRow label="Paid By" value={payout.paidBy?.name || "–"} />
            <div>
              <InfoRow label="Payment Mode" value={payout.paymentMode || "–"} />
              <div
                className="flex cursor-pointer items-center gap-x-2 text-primary"
                onClick={() => {
                  setImageUrl(payout.paymentProofImageUrl);
                  setModalOpen(true);
                }}
              >
                Payment Proof
                <PreviewIcon />
              </div>
            </div>
            <InfoRow
              label="Paid At"
              value={new Date(payout.paidAt).toLocaleString("en-GB")}
            />
            <InfoRow label="Remarks" value={payout.remarks || "–"} />
          </div>
          <ImagePreviewModal
            url={imageUrl}
            open={modalOpen}
            onClose={() => setModalOpen(false)}
          />
        </div>
      ))}
    </div>
  );
}

export default PaidPayouts;
