import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { type MockupLayer } from "../context/MockupContext";
import { CurvedText } from "./CurvedText";

interface CanvasLayersProps {
  activeLayers: MockupLayer[];
  selectedLayerId: string | null;
  setSelectedLayerId: (id: string | null) => void;
  activeTool: string;
  zoom: number;
  updateLayer: (id: string, updates: Partial<MockupLayer>) => void;
  removeLayer: (id: string) => void;
}

export const CanvasLayers: React.FC<CanvasLayersProps> = ({
  activeLayers,
  selectedLayerId,
  setSelectedLayerId,
  activeTool,
  zoom,
  updateLayer,
  removeLayer,
}) => {
  const [isEditingTextId, setIsEditingTextId] = useState<string | null>(null);

  return (
    <>
      {activeLayers.map((layer) => {
        const isSelected = selectedLayerId === layer.id;
        const isEraserMode = activeTool === "erase";
        return (
          <Rnd
            key={layer.id}
            size={{ width: layer.w, height: layer.h }}
            position={{ x: layer.x, y: layer.y }}
            bounds="parent"
            scale={zoom / 100}
            enableResizing={
              isSelected && !isEraserMode && layer.type !== "path"
                ? {
                    top: true,
                    right: true,
                    bottom: true,
                    left: true,
                    topRight: true,
                    bottomRight: true,
                    bottomLeft: true,
                    topLeft: true,
                  }
                : false
            }
            disableDragging={!isSelected || isEraserMode || layer.type === "path"}
            onDragStop={(_e, d) => {
              updateLayer(layer.id, { x: d.x, y: d.y });
            }}
            onResizeStop={(_e, _dir, refEl, _delta, pos) => {
              const newW = parseInt(refEl.style.width);
              const newH = parseInt(refEl.style.height);
              const ratio = layer.w > 0 ? newW / layer.w : 1;
              updateLayer(layer.id, {
                w: newW,
                h: newH,
                x: pos.x,
                y: pos.y,
                fontSize: layer.fontSize
                  ? Math.max(8, Math.round(layer.fontSize * ratio))
                  : undefined
              });
            }}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              if (isEraserMode) {
                removeLayer(layer.id);
              } else {
                setSelectedLayerId(layer.id);
              }
            }}
            style={{
              outline: isSelected && !isEraserMode ? "2px solid #3B82F6" : "none",
              cursor: isEraserMode ? "crosshair" : isSelected ? "move" : "pointer",
              transform: `rotate(${layer.rotation}deg)`,
              display: layer.visible ? "block" : "none"
            }}
          >
            {layer.type === "image" && layer.src && (
              <img
                src={layer.src}
                alt="layer"
                className="w-full h-full object-contain pointer-events-none select-none"
              />
            )}

            {layer.type === "text" && (
              <div
                className="w-full h-full flex items-center justify-center overflow-hidden"
                onDoubleClick={() => setIsEditingTextId(layer.id)}
              >
                {isEditingTextId === layer.id ? (
                  <input
                    value={layer.text || ""}
                    onChange={(e) => updateLayer(layer.id, { text: e.target.value })}
                    onBlur={() => setIsEditingTextId(null)}
                    onKeyDown={(e) => e.key === "Enter" && setIsEditingTextId(null)}
                    autoFocus
                    className="w-full text-center border-0 border-b border-[#3B82F6] focus:outline-none focus:ring-0 bg-white"
                    style={{
                      fontSize: layer.fontSize ?? 16,
                      color: layer.color ?? "#000000",
                      fontWeight: "bold",
                    }}
                  />
                ) : layer.curved ? (
                  <CurvedText layer={layer} />
                ) : (
                  <span
                    className="font-bold whitespace-nowrap select-none pointer-events-none"
                    style={{
                      fontSize: layer.fontSize ?? 18,
                      color: layer.color ?? "#000000",
                    }}
                  >
                    {layer.text}
                  </span>
                )}
              </div>
            )}

            {layer.type === "shape" && (
              <div
                className="w-full h-full border border-black/15 shadow-inner"
                style={{
                  backgroundColor: layer.color ?? "#4A90E2",
                  borderRadius: layer.shapeType === "circle" ? "50%" : "4px",
                  clipPath: layer.shapeType === "triangle"
                    ? "polygon(50% 0%, 0% 100%, 100% 100%)"
                    : layer.shapeType === "star"
                    ? "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"
                    : "none"
                }}
              />
            )}

            {layer.type === "path" && layer.points && (
              <svg className="w-full h-full overflow-visible pointer-events-none select-none">
                <polyline
                  points={layer.points.map((p) => `${p.x},${p.y}`).join(" ")}
                  fill="none"
                  stroke={layer.color ?? "#EF4444"}
                  strokeWidth={layer.strokeWidth ?? 3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </Rnd>
        );
      })}
    </>
  );
};

export default CanvasLayers;
