"use client";
import InputGroup from "@/components/FormElements/InputGroup";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import { Button } from "@/components/ui-elements/button";
import React, { useState } from "react";

type Props = {
  id: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    id: string;
    paymentProofImageUrl: string;
    paymentMode: string;
    remarks: string;
  }) => void;
};

export default function MarkAsPaidModal({
  id,
  open,
  onClose,
  onSubmit,
}: Props) {
  const [paymentProofImageUrl, setPaymentProofImageUrl] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [remarks, setRemarks] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    if (!paymentProofImageUrl) {
      alert("❌ Upload proof.");
      return;
    }
    if (!paymentMode) {
      alert("❌ Enter payment mode.");
      return;
    }

    onSubmit({
      id,
      paymentProofImageUrl,
      paymentMode,
      remarks: remarks || "Payment has been processed.",
    });

    // Optionally clear and close
    setPaymentProofImageUrl("");
    setPaymentMode("");
    setRemarks("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 dark:bg-gray-900">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
          Upload Payment Proof
        </h2>

        <div className="space-y-4">
          <ImageUploader
            label="Upload Payment Proof"
            onUploadComplete={(url) => setPaymentProofImageUrl(url)}
          />

          <InputGroup
            label="Payment Mode"
            placeholder="e.g. UPI, Bank Transfer"
            name="paymentMode"
            value={paymentMode}
            handleChange={(e) => setPaymentMode(e.target.value)}
            type="text"
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Remarks (optional)
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-300 p-3 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              rows={3}
              placeholder="Remarks for this payment..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            label="Cancel"
            variant="dark"
            className="rounded-lg"
            onClick={onClose}
          />
          <Button
            label="Submit"
            variant="outlineGreen"
            onClick={handleSubmit}
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
