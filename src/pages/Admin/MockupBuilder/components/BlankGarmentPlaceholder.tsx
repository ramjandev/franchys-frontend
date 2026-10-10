import React from "react";

interface BlankGarmentPlaceholderProps {
  onSelectProduct?: () => void;
}

export const BlankGarmentPlaceholder: React.FC<
  BlankGarmentPlaceholderProps
> = ({ onSelectProduct }) => {
  return (
    <div className="flex flex-col items-center gap-4 max-w-md text-center p-6 bg-white rounded-2xl border border-gray-200">
      <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
      <div>
        <p className="text-[#111827] font-semibold text-base">
          No Product Selected
        </p>
        <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
          Select a product from the catalog or click an image from the left panel to begin customizing.
        </p>
      </div>

      {onSelectProduct && (
        <button
          type="button"
          onClick={onSelectProduct}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          Select Product
        </button>
      )}
    </div>
  );
};

export default BlankGarmentPlaceholder;
