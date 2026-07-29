import { GARMENT_OPTIONS } from "@/store/mockUp/designSlice";
import React from "react";

interface ProductModalProps {
  show: boolean;
  onClose: () => void;
  onSelect: (code: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  show,
  onClose,
  onSelect,
}) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <h4 className="font-bold text-lg text-gray-900">
            Choose Base Garment
          </h4>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-bold text-lg"
          >
            ×
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {GARMENT_OPTIONS.map((g) => (
            <button
              key={g.code}
              onClick={() => onSelect(g.code)}
              className="flex items-center gap-3 bg-gray-50 hover:bg-blue-50/50 hover:border-blue-500 rounded-xl px-4 py-3 text-sm text-left border border-gray-200 transition-all font-semibold"
            >
              <span className="font-bold text-blue-600 text-base">
                {g.code}
              </span>
              <span className="text-gray-700">{g.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
