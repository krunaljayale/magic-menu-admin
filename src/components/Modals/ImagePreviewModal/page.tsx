import React from "react";

interface ImagePreviewModalProps {
  url: string;
  open: boolean;
  onClose: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ url, open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="relative max-w-2xl rounded-2xl bg-white p-4 shadow-lg dark:bg-slate-900">
        <button
          className="absolute right-3 top-3 rounded-full bg-gray-200 p-1 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
        <img
          src={url}
          alt="Payment Proof"
          className="max-h-[75vh] w-full rounded-lg object-contain"
        />
      </div>
    </div>
  );
};

export default ImagePreviewModal;
