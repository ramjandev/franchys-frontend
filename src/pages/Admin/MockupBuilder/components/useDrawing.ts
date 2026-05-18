import React, { useState } from "react";
import { type MockupLayer } from "../context/MockupContext";

interface UseDrawingProps {
  activeTool: string;
  zoom: number;
  activeView: string;
  canvasW: number;
  canvasH: number;
  activeColor: string;
  setLayersByView: React.Dispatch<React.SetStateAction<Record<string, MockupLayer[]>>>;
}

export const useDrawing = ({
  activeTool,
  zoom,
  activeView,
  canvasW,
  canvasH,
  activeColor,
  setLayersByView
}: UseDrawingProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState<{ x: number; y: number }[]>([]);
  const [drawingLayerId, setDrawingLayerId] = useState<string | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activeTool !== "pencil" && activeTool !== "brush") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left) / (zoom / 100));
    const y = Math.round((e.clientY - rect.top) / (zoom / 100));

    const id = `path_${Date.now()}`;
    const newLayer: MockupLayer = {
      id,
      type: "path",
      points: [{ x, y }],
      strokeWidth: activeTool === "pencil" ? 2.5 : 7,
      color: activeColor,
      x: 0,
      y: 0,
      w: canvasW,
      h: canvasH,
      rotation: 0,
      scale: 1,
      visible: true
    };

    setLayersByView((prev) => ({
      ...prev,
      [activeView]: [...(prev[activeView] || []), newLayer]
    }));
    setDrawingLayerId(id);
    setDrawingPoints([{ x, y }]);
    setIsDrawing(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDrawing || !drawingLayerId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left) / (zoom / 100));
    const y = Math.round((e.clientY - rect.top) / (zoom / 100));

    const updatedPoints = [...drawingPoints, { x, y }];
    setDrawingPoints(updatedPoints);

    setLayersByView((prev) => ({
      ...prev,
      [activeView]: (prev[activeView] || []).map((l) =>
        l.id === drawingLayerId ? { ...l, points: updatedPoints } : l
      )
    }));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDrawing) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDrawing(false);
    setDrawingLayerId(null);
    setDrawingPoints([]);
  };

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  };
};

export default useDrawing;
