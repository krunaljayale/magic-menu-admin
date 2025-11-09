import React from 'react'

function OpenMapButton({ urls }: { urls?: { mapUrl?: string; osmUrl?: string } | null }) {
  const href = urls?.mapUrl ?? urls?.osmUrl ?? null;

  if (!href) {
    return (
      <button
        disabled
        className="mt-2 inline-flex items-center gap-2 rounded px-3 py-1.5 bg-gray-100 text-sm font-semibold text-gray-400 cursor-not-allowed"
        aria-disabled
      >
        Open in maps
      </button>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 inline-flex items-center gap-2 rounded px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
    >
      Open in maps
    </a>
  );
}

export default OpenMapButton
