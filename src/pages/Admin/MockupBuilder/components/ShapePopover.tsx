import React from "react";

interface ShapePopoverProps {
  show: boolean;
  onSelect: (shape: "rect" | "circle" | "triangle" | "star") => void;
}

export const ShapePopover: React.FC<ShapePopoverProps> = ({ show, onSelect }) => {
  if (!show) return null;
  return (
    <div className="absolute left-[110px] top-[260px] bg-white border border-gray-200 rounded-xl shadow-xl p-3.5 z-50 flex flex-col gap-2">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Select Shape</p>
      <div className="flex gap-2">
        {[
          { id: "rect", label: "Rect" },
          { id: "circle", label: "Circle" },
          { id: "triangle", label: "Triangle" },
          { id: "star", label: "Star" }
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id as any)}
            className="px-3.5 py-1.5 bg-gray-50 border border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-lg text-xs font-bold text-[#4B5563] transition-all"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShapePopover;
