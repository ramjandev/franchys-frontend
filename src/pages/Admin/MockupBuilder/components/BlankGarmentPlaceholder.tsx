import { GARMENT_OPTIONS } from "@/store/mockUp/designSlice";
import React from "react";

interface BlankGarmentPlaceholderProps {
  onSelectQuickGarment: (code: string) => void;
}

export const BlankGarmentPlaceholder: React.FC<
  BlankGarmentPlaceholderProps
> = ({ onSelectQuickGarment }) => {
  return (
    <div className="flex flex-col items-center gap-4 max-w-md text-center">
      <div className="w-[53px] h-[53px] bg-gray-200 rounded-2xl flex justify-center items-center">
        <div className="text-gray-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
          >
            <path
              d="M21.2432 3.6058L16.6778 2.08398C16.6778 3.18976 16.2385 4.25026 15.4566 5.03216C14.6747 5.81406 13.6142 6.25333 12.5084 6.25333C11.4027 6.25333 10.3422 5.81406 9.56027 5.03216C8.77836 4.25026 8.33909 3.18976 8.33909 2.08398L3.77365 3.6058C3.30187 3.76298 2.90182 4.08362 2.64569 4.50986C2.38957 4.9361 2.29424 5.43986 2.37692 5.93021L2.98148 9.54712C3.02117 9.79198 3.14688 10.0147 3.33602 10.1751C3.52516 10.3356 3.76534 10.4234 4.01339 10.4227H6.25442V20.8461C6.25442 21.9926 7.19252 22.9307 8.33909 22.9307H16.6778C17.2307 22.9307 17.7609 22.7111 18.1519 22.3201C18.5428 21.9292 18.7625 21.3989 18.7625 20.8461V10.4227H21.0035C21.2515 10.4234 21.4917 10.3356 21.6809 10.1751C21.87 10.0147 21.9957 9.79198 22.0354 9.54712L22.64 5.93021C22.7226 5.43986 22.6273 4.9361 22.3712 4.50986C22.1151 4.08362 21.715 3.76298 21.2432 3.6058Z"
              stroke="#99A1AF"
              stroke-width="2.08467"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
      <div>
        <p className="text-[#99A1AF] font-medium text-lg">
          No garment selected
        </p>
        <p className="text-sm text-[#99A1AF] mt-2 leading-relaxed">
          Enter a clothing code (e.g.{" "}
          <span className="font-bold text-[#6B7280]">8000</span>) in the Tools
          panel to load a blank garment, or click a quick option below.
        </p>
      </div>

      <div className="flex flex-col gap-2 w-72 mt-1">
        {GARMENT_OPTIONS.map((g) => (
          <button
            key={g.code}
            onClick={() => onSelectQuickGarment(g.code)}
            className="flex items-center gap-3 bg-white rounded-[10px] px-3 py-2 text-sm text-left hover:border-[#3B82F6] hover:shadow-sm border border-[#E6EBF2] transition-all font-semibold"
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
            >
              <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />
            </svg>
            <div>
              <span className="font-medium text-[#364153] mr-1.5">
                {g.code}
              </span>
              <span className="text-[#9CA3AF] text-xs font-medium">
                {g.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BlankGarmentPlaceholder;
