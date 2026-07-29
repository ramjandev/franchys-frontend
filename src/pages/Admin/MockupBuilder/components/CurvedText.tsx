import { MockupLayer } from "@/store/mockUp/designSlice";
import React from "react";

interface CurvedTextProps {
  layer: MockupLayer;
}

export const CurvedText: React.FC<CurvedTextProps> = ({ layer }) => {
  const text = layer.text || "";
  const radius = 64;
  const letters = text.split("");
  const totalAngle = 130;
  const anglePerLetter = totalAngle / (letters.length - 1 || 1);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {letters.map((char, i) => {
        const angle = -totalAngle / 2 + i * anglePerLetter;
        const rad = (angle * Math.PI) / 180;
        const x = radius * Math.sin(rad);
        const y = radius * (1 - Math.cos(rad));
        return (
          <span
            key={i}
            className="absolute font-bold whitespace-nowrap select-none"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(40% + ${y}px)`,
              transform: `translate(-50%, -50%) rotate(${angle}deg)`,
              transformOrigin: "center center",
              fontSize: layer.fontSize ?? 16,
              color: layer.color ?? "#000000",
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};

export default CurvedText;
