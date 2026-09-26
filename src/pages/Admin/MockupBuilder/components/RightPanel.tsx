import CardContainer from "@/components/shared/CardContainer";
import CommonButton from "@/components/shared/CommonButton";
import { renderMockupToBlob } from "@/lib/corsImage";
import { mockupCaptureRef } from "@/lib/mockupCaptureRef";
import {
  addLineItemMockups,
  addMockupUrls,
} from "@/store/imageSlice/imageSlice";
import { useMockup } from "@/store/mockUp/hooks/useMockup";
import { useUploadMockupsMutation } from "@/store/quote/quoteAPI";
import { RootState } from "@/store/store";
import {
  ArrowLeft,
  Download,
  Eye,
  EyeOff,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CANVAS_W = 650;
const CANVAS_H = 650;

export interface RightPanelProps {
  isModal?: boolean;
  onClose?: () => void;
  onSaveSuccess?: (urls: string[]) => void;
}

const RightPanel: React.FC<RightPanelProps> = ({
  isModal = false,
  onClose,
  onSaveSuccess,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const { activeLineItemTarget } = useSelector(
    (state: RootState) => state.image,
  );

  const {
    canvasProductImage,
    productViews,
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

    const node = mockupCaptureRef.current;
    const canvasW = node?.clientWidth || CANVAS_W;
    const canvasH = node?.clientHeight || CANVAS_H;

    let newX = selectedLayer.x;
    let newY = selectedLayer.y;

    switch (alignment) {
      case "Center":
        newX = Math.round((canvasW - selectedLayer.w) / 2);
        newY = Math.round((canvasH - selectedLayer.h) / 2);
        break;
      case "Top":
        newY = 10;
        break;
      case "Left":
        newX = 10;
        break;
      case "Right":
        newX = Math.round(canvasW - selectedLayer.w - 10);
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
      toast.error("Nothing to save yet — add a product first.");
      return;
    }

    if (isSaving || isLoading) return;

    try {
      setIsSaving(true);
      const files: File[] = [];
      const canvasW = node.clientWidth || CANVAS_W;
      const canvasH = node.clientHeight || CANVAS_H;

      // Collect all target product view images
      const allTargetViews: string[] = [];

      // 1. If productViews has all images from the product catalog, add them in order
      if (productViews && productViews.length > 0) {
        allTargetViews.push(...productViews);
      } else if (canvasProductImage) {
        allTargetViews.push(canvasProductImage);
      }

      // 2. Also include any extra custom views that might have layers in layersByView
      Object.keys(layersByView).forEach((viewKey) => {
        if (
          viewKey !== "default" &&
          (viewKey.startsWith("http://") ||
            viewKey.startsWith("https://") ||
            viewKey.startsWith("data:")) &&
          !allTargetViews.includes(viewKey)
        ) {
          allTargetViews.push(viewKey);
        }
      });

      // Render each product view into a separate file in the payload
      for (let i = 0; i < allTargetViews.length; i++) {
        const viewUrl = allTargetViews[i];
        const isActive =
          viewUrl === canvasProductImage || viewUrl === activeView;

        let viewBlob: Blob | null = null;
        const viewLayers =
          layersByView[viewUrl] || (isActive ? activeLayers : []);

        // Render via pure offscreen composite with high quality JPEG compression
        viewBlob = await renderMockupToBlob({
          productImageUrl: viewUrl,
          layers: viewLayers,
          width: canvasW,
          height: canvasH,
          format: "image/jpeg",
          quality: 0.85,
        });

        if (viewBlob) {
          const fileName = `mockup-view-${i + 1}-${Date.now()}.jpg`;
          files.push(new File([viewBlob], fileName, { type: "image/jpeg" }));
        }
      }

      if (files.length === 0) {
        throw new Error("Canvas capture returned empty result");
      }

      // Upload all mockup files to POST /quote/upload-mockups
      const res = await uploadMockups(files).unwrap();
      const urls = res.data?.urls || [];

      // Save to Redux imageSlice!
      dispatch(addMockupUrls(urls));

      // If this mockup was launched for a specific quote line item, attach URLs directly!
      if (activeLineItemTarget) {
        const key = `${activeLineItemTarget.groupIndex}-${activeLineItemTarget.lineItemIndex}`;
        dispatch(addLineItemMockups({ key, urls }));
      }

      if (isModal) {
        onSaveSuccess?.(urls);
        onClose?.();
      } else {
        setTimeout(() => {
          navigate("/admin/quotes/new");
        }, 400);
      }
    } catch (err: any) {
      console.error("Save mockup error:", err);
      const errMsg =
        err?.data?.message ||
        err?.message ||
        "Failed to save and upload mockup image(s).";
      toast.error(errMsg);
    } finally {
      setIsSaving(false);
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
            <span>Product Image</span>
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
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleToggleVisibility(layer.id, layer.visible);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {layer.visible ? (
                      <Eye className="w-3.5 h-3.5" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeLayer(layer.id);
                    }}
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
          disabled={isLoading || isSaving}
        >
          {isLoading || isSaving ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Save size={16} />
          )}
          {isLoading || isSaving ? "Saving Mockups..." : "Save Mockup"}
        </CommonButton>

        {activeLineItemTarget && !isModal && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex flex-col gap-2">
            <span className="text-[11px] text-blue-700 font-semibold text-center">
              Target: Group {activeLineItemTarget.groupIndex + 1}, Line Item{" "}
              {activeLineItemTarget.lineItemIndex + 1}
            </span>
            <CommonButton
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="w-full! text-xs! flex items-center justify-center gap-1.5"
            >
              <ArrowLeft size={13} /> Return to Quote Form
            </CommonButton>
          </div>
        )}
      </CardContainer>
    </div>
  );
};

export default RightPanel;
