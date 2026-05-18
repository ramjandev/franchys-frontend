import React from "react";
import { GARMENT_OPTIONS } from "../context/MockupContext";

interface BlankGarmentPlaceholderProps {
  onSelectQuickGarment: (code: string) => void;
}

export const BlankGarmentPlaceholder: React.FC<BlankGarmentPlaceholderProps> = ({
  onSelectQuickGarment,
}) => {
  return (
    <div className="flex flex-col items-center gap-6 max-w-md text-center">
      <div className="text-gray-300">
        <svg viewBox="0 0 80 80" width="70" height="70" fill="currentColor">
          <path d="M25 5 L10 20 L20 25 L20 70 L60 70 L60 25 L70 20 L55 5 C55 5 50 15 40 15 C30 15 25 5 25 5Z" />
        </svg>
      </div>
      <div>
        <p className="text-[#374151] font-bold text-lg">No garment selected</p>
        <p className="text-sm text-[#6B7280] mt-1.5 leading-relaxed">
          Enter a clothing code (e.g. <span className="font-bold text-[#3B82F6]">8000</span>) in the Tools panel to load a blank garment, or click a quick option below.
        </p>
      </div>

      <div className="flex flex-col gap-2 w-72 mt-2">
        {GARMENT_OPTIONS.map((g) => (
          <button
            key={g.code}
            onClick={() => onSelectQuickGarment(g.code)}
            className="flex items-center gap-3 bg-white rounded-xl px-4 py-2.5 text-sm text-left hover:border-[#3B82F6] hover:shadow-sm border border-[#E6EBF2] transition-all font-semibold"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#3B82F6" strokeWidth="2">
              <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />
            </svg>
            <div>
              <span className="font-bold text-[#3B82F6] mr-1.5">{g.code}</span>
              <span className="text-[#4B5563] text-xs font-semibold">{g.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BlankGarmentPlaceholder;
