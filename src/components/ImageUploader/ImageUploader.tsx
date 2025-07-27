"use client";
import { cloudName, resPresetName } from "@/constants/cloudinary";
import React, { useState } from "react";

type Props = {
  label?: string;
  onUploadComplete: (url: string) => void;
};

export default function ImageUploader({ label, onUploadComplete }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", resPresetName);
    formData.append("folder", "admin-payment-proofs"); // optional folder

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      onUploadComplete(data.secure_url);
    } catch (err: any) {
      console.error(err);
      setError("❌ Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-gray-400">{label}</label>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-900 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-white hover:file:bg-indigo-700 focus:outline-none"
      />

      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="mt-2 h-32 w-32 rounded-md border object-cover"
        />
      )}

      {uploading && <p className="text-sm text-gray-400">Uploading...</p>}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
