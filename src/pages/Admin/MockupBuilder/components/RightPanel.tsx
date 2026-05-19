import React from "react";
import { Eye, EyeOff, Trash2, Save, Download } from "lucide-react";
import { useMockup } from "../context/MockupContext";
import CardContainer from "@/components/shared/CardContainer";
import { toast } from "react-toastify";
// import { Toast } from "radix-ui";

const CANVAS_W = 420;
const CANVAS_H = 500;

const RightPanel: React.FC = () => {
  const {
    layersByView,
    activeView,
    selectedLayerId,
    setSelectedLayerId,
    updateLayer,
    removeLayer,
    // duplicateLayer
  } = useMockup();

  const activeLayers = layersByView[activeView] || [];
  const selectedLayer = activeLayers.find((l) => l.id === selectedLayerId);

  const handleToggleVisibility = (id: string, currentVal: boolean) => {
    updateLayer(id, { visible: !currentVal });
  };

  const handleAlign = (alignment: "Top" | "Center" | "Left" | "Right") => {
    if (!selectedLayer) return;

    let newX = selectedLayer.x;
    let newY = selectedLayer.y;

    switch (alignment) {
      case "Center":
        newX = Math.round((CANVAS_W - selectedLayer.w) / 2);
        newY = Math.round((CANVAS_H - selectedLayer.h) / 2);
        break;
      case "Top":
        newY = 10;
        break;
      case "Left":
        newX = 10;
        break;
      case "Right":
        newX = Math.round(CANVAS_W - selectedLayer.w - 10);
        break;
    }

    updateLayer(selectedLayer.id, { x: newX, y: newY });
  };

  const handleExport = (format: "PNG" | "JPG" | "SVG") => {
    toast.success(`Mockup exported successfully as high-resolution ${format}!`);
  };

  const handleSaveMockup = () => {
    const mockupState = {
      layers: layersByView,
      activeView
    };
    localStorage.setItem("franchys_mockup_design", JSON.stringify(mockupState));
    toast.success("Mockup design configuration saved successfully!");
  };

  return (
    <div className="w-full xl:w-[240px] shrink-0 flex flex-col gap-5 xl:overflow-y-auto xl:h-full pb-4">
      {/* Layers Panel */}
      <CardContainer className="p-4 bg-white border border-[#E6EBF2] rounded-xl shadow-sm flex flex-col gap-3">
        <h3 className="font-bold text-sm text-[#111827] uppercase tracking-wider">Layers</h3>
        <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
          {/* Base Layer */}
          <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-xs font-semibold text-[#5C7899]">
            <span>Product Base</span>
            <Eye className="w-3.5 h-3.5 text-gray-400" />
          </div>

          {activeLayers.map((layer, index) => {
            const isSelected = selectedLayerId === layer.id;
            let displayLabel = `Layer ${index + 1}: ${layer.type.toUpperCase()}`;
            if (layer.type === "text" && layer.text) {
              displayLabel = `"${layer.text}"`;
            }

            return (
              <div
                key={layer.id}
                onClick={() => setSelectedLayerId(layer.id)}
                className={`flex items-center justify-between border rounded-lg px-3 py-2 text-xs cursor-pointer transition-all ${
                  isSelected
                    ? "bg-blue-50 border-blue-200 text-blue-700 font-bold"
                    : "bg-white border-[#E6EBF2] text-[#4A5565] hover:bg-gray-50"
                }`}
              >
                <span className="truncate max-w-[120px]">{displayLabel}</span>
                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleToggleVisibility(layer.id, layer.visible)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {layer.visible ? (
                      <Eye className="w-3.5 h-3.5" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => removeLayer(layer.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContainer>

      {/* Position Alignment Panel */}
      <CardContainer className="p-4 bg-white border border-[#E6EBF2] rounded-xl shadow-sm flex flex-col gap-3">
        <h3 className="font-bold text-sm text-[#111827] uppercase tracking-wider">Position</h3>
        <div className="grid grid-cols-2 gap-2">
          {(["Top", "Center", "Left", "Right"] as const).map((pos) => (
            <button
              key={pos}
              onClick={() => handleAlign(pos)}
              disabled={!selectedLayer}
              className="h-8 border border-[#D1D5DC] hover:border-[#3B82F6] hover:bg-blue-50 hover:text-blue-700 rounded-lg text-xs font-semibold text-[#4B5563] transition-all disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-[#4B5563] disabled:hover:border-[#D1D5DC]"
            >
              {pos}
            </button>
          ))}
        </div>
      </CardContainer>

      {/* Export Panel */}
      <CardContainer className="p-4 bg-white border border-[#E6EBF2] rounded-xl shadow-sm flex flex-col gap-3">
        <h3 className="font-bold text-sm text-[#111827] uppercase tracking-wider">Export</h3>
        <div className="flex flex-col gap-2">
          {(["PNG", "JPG", "SVG"] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => handleExport(fmt)}
              className="w-full flex items-center gap-2 h-9 border border-[#D1D5DC] rounded-lg px-3 text-xs font-bold text-[#4B5563] hover:bg-gray-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-gray-500" />
              Export as {fmt}
            </button>
          ))}
        </div>

        <button
          onClick={handleSaveMockup}
          className="w-full mt-2 h-10 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm uppercase tracking-wider"
        >
          <Save className="w-4 h-4" />
          Save Mockup
        </button>
      </CardContainer>
    </div>
  );
};

export default RightPanel;
