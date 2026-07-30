import React from "react";

interface FillPopoverProps {
  show: boolean;
  activeColor: string;
  onSelectColor: (color: string) => void;
}

export const FillPopover: React.FC<FillPopoverProps> = ({ show, activeColor, onSelectColor }) => {
  if (!show) return null;
  return (
    <div className="absolute left-[110px] top-[340px] bg-white border border-gray-200 rounded-xl shadow-xl p-3 z-50 flex flex-col gap-2">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Select Fill Color</p>
      <div className="grid grid-cols-4 gap-2">
        {["#FFFFFF", "#000000", "#1E3A8A", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"].map((c) => (
          <button
            key={c}
            onClick={() => onSelectColor(c)}
            className={`w-6 h-6 rounded-full border border-gray-300 shadow-sm transition-transform hover:scale-110 ${
              activeColor === c ? "ring-2 ring-blue-500" : ""
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
    </div>
  );
};

export default FillPopover;
