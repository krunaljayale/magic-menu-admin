import { InfoRow } from "@/components/ui/table";
import { API } from "@/constants/api";
import React, { useEffect, useState } from "react";
import { PendingPayoutsSkeleton } from "./PendingPayoutsSekeleton";
import MarkAsPaidModal from "@/components/Modals/MarkAsPaidModal/page";

function PendingPayouts({ id }: { id: string }) {
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [payouts, setPayouts] = useState<any[]>([]);

  const fetchPendingPayouts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt_token");
      const res = await fetch(`${API.GET_PENDING_PAYOUTS}/${id}`, {
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
    fetchPendingPayouts();
  }, []);

  const handleMarkAsPaid = (id: string) => {
    setSelectedId(id);
    setModalOpen(true);
  };

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt_token");
      const admin_id = localStorage.getItem("user_id");

      if (!token || !admin_id) {
        console.error("Missing authentication or admin ID");
        return;
      }

      const response = await fetch(`${API.PAY_PENDING_PAYOUT}/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data, admin_id }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(
          "Failed to process payout:",
          result.message || "Unknown error",
        );
        return;
      }

      fetchPendingPayouts();
    } catch (error) {
      console.error("Error while processing payout:", error);
    }
  };

  if (loading) return <PendingPayoutsSkeleton />;
  if (payouts.length === 0) return <p>No pending payouts found.</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h3 className="text-2xl font-semibold">Pending Payouts</h3>
        <h6
          className="cursor-pointer text-body-sm font-bold text-gray-6 hover:underline"
          onClick={fetchPendingPayouts}
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
                  weekday: "short", // e.g., "Thu"
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
                {payout.rejectedOrders || "0"}
              </p>
            </div>
            <span className="mt-1 text-sm font-semibold text-yellow-700 dark:text-yellow-400">
              {payout.status}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between rounded-xl py-4">
            <div>
              <p className="text-base text-gray-700 dark:text-gray-300">
                Payable Amount
              </p>
              <p className="text-2xl font-bold text-green-600">
                ₹{Math.round(payout.netRevenue)}{" "}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  (actual: ₹{payout.netRevenue.toFixed(2)})
                </span>
              </p>
            </div>

            <button
              className="rounded-lg bg-green-600 px-5 py-2.5 text-base font-medium text-white hover:bg-green-700"
              onClick={() => handleMarkAsPaid(payout._id)}
            >
              Mark as Paid
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <InfoRow label="Gross Revenue" value={`₹${payout.grossRevenue}`} />
            <InfoRow label="Commission" value={`₹${payout.commissionAmount}`} />

            <InfoRow
              label="Tax on Commission"
              value={`₹${payout.taxOnCommission}`}
            />

            <InfoRow
              label="Deductions"
              value={`₹${payout.deductions || "0"}`}
            />

            <InfoRow label="Remarks" value={payout.remarks || "–"} />
          </div>
        </div>
      ))}
      <MarkAsPaidModal
        id={selectedId}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default PendingPayouts;
