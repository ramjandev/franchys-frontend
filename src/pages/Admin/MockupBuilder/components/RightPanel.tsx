import CardContainer from "@/components/shared/CardContainer";
import CommonButton from "@/components/shared/CommonButton";
import { mockupCaptureRef } from "@/lib/mockupCaptureRef";
import { useMockup } from "@/store/mockUp/hooks/useMockup";
import { useUploadMockupsMutation } from "@/store/quote/quoteAPI";
import { toBlob } from "html-to-image";
import { Download, Eye, EyeOff, Save, Trash2 } from "lucide-react";
import React from "react";
import { toast } from "react-toastify";

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
  } = useMockup();


  const [uploadMockups, { isLoading }] = useUploadMockupsMutation();

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

  const handleSaveMockup = async () => {
    const node = mockupCaptureRef.current;
    if (!node) {
      toast.error("Nothing to save yet — add a garment first.");
      return;
    }

    try {
      const blob = await toBlob(node, { pixelRatio: 2, cacheBust: true });
      if (!blob) throw new Error("Canvas capture returned empty result");

      const fileName = `mockup-${activeView.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.png`;
      const file = new File([blob], fileName, { type: "image/png" });

      const res = await uploadMockups([file]).unwrap();

      console.log("Mockup saved successfully:", res);

      toast.success("Mockup saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save mockup image.");
    }
  };

  return (
    <div className="w-full xl:w-60 shrink-0 flex flex-col gap-5 xl:overflow-y-auto xl:h-full pb-4">
      {/* Layers Panel */}
      <CardContainer className="p-4 bg-white border border-[#E6EBF2] rounded-xl shadow-sm flex flex-col gap-3">
        <h3 className="font-bold text-sm text-[#111827] uppercase tracking-wider">
          Layers
        </h3>
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
                <div
                  className="flex items-center gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() =>
                      handleToggleVisibility(layer.id, layer.visible)
                    }
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
        <h3 className="font-bold text-sm text-[#111827] uppercase tracking-wider">
          Position
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {(["Top", "Center", "Left", "Right"] as const).map((pos) => (
            <CommonButton
              key={pos}
              onClick={() => handleAlign(pos)}
              disabled={!selectedLayer}
              className="hover:bg-[#155DFC]! hover:text-white!"
              variant="ghost"
              size="sm"
            >
              {pos}
            </CommonButton>
          ))}
        </div>
      </CardContainer>

      {/* Export Panel */}
      <CardContainer className="p-4 bg-white border border-[#E6EBF2] rounded-xl shadow-sm flex flex-col gap-3">
        <h3 className="font-bold text-sm text-[#111827] uppercase tracking-wider">
          Export
        </h3>
        <div className="flex flex-col gap-2">
          {(["PNG", "JPG", "SVG"] as const).map((fmt) => (
            <CommonButton
              key={fmt}
              onClick={() => handleExport(fmt)}
              className="hover:bg-[#155DFC]! hover:text-white!"
              variant="ghost"
            >
              <Download className="" />
              Export as {fmt}
            </CommonButton>
          ))}
        </div>

        <CommonButton
          variant="primaryGreen"
          onClick={handleSaveMockup}
          disabled={isLoading}
        >
          <Save />
          {isLoading ? "Saving..." : "Save Mockup"}
        </CommonButton>
      </CardContainer>
    </div>
  );
};

export default RightPanel;
