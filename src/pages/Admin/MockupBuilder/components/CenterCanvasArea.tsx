import CardContainer from "@/components/shared/CardContainer";
import { mockupCaptureRef } from "@/lib/mockupCaptureRef";
import { GARMENT_OPTIONS, useMockup } from "@/store/mockUp/hooks/useMockup";
import { ZoomIn, ZoomOut } from "lucide-react";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";

// Subcomponents & hooks
import { BlankGarmentPlaceholder } from "./BlankGarmentPlaceholder";
import { CanvasLayers } from "./CanvasLayers";
import { CanvasToolStrip } from "./CanvasToolStrip";
import { FillPopover } from "./FillPopover";
import { HoodieSVG, SHIRT_H, SHIRT_W, TShirtSVG } from "./GarmentSVGs";
import { ProductModal } from "./ProductModal";
import { ShapePopover } from "./ShapePopover";
import { useDrawing } from "./useDrawing";

const CenterCanvasArea: React.FC = () => {
  const {
    hasGarment,
    setHasGarment,
    selectedGarment,
    setSelectedGarment,
    productColor,
    setProductColor,
    activeView,
    setActiveView,
    layersByView,
    setLayersByView,
    selectedLayerId,
    setSelectedLayerId,
    activeTool,
    setActiveTool,
    zoom,
    setZoom,
    addLayer,
    updateLayer,
    removeLayer,
    setClothingCode,
  } = useMockup();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth > 1439 && window.innerWidth < 1536,
  );

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth > 1439 && window.innerWidth < 1536);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    mockupCaptureRef.current = containerRef.current;
  }, [hasGarment, selectedGarment, activeView, productColor]);

  const [showProductModal, setShowProductModal] = useState(false);
  const [showShapePopover, setShowShapePopover] = useState(false);
  const [activeColor, setActiveColor] = useState("#EF4444");

  const canvasW = SHIRT_W; // 420
  const canvasH = SHIRT_H; // 500
  const canvasLeft = 0;
  const canvasTop = 0;

  const activeLayers = layersByView[activeView] || [];

  // Drawing Pointer Events hook
  const { handlePointerDown, handlePointerMove, handlePointerUp } = useDrawing({
    activeTool,
    zoom,
    activeView,
    canvasW,
    canvasH,
    activeColor,
    setLayersByView,
  });

  const handleSelectQuickGarment = (code: string) => {
    const found = GARMENT_OPTIONS.find((g) => g.code === code);
    if (found) {
      setSelectedGarment(found);
      setProductColor(found.colors[0].hex);
      setClothingCode(code);
      setHasGarment(true);
      setShowProductModal(false);
    }
  };

  const handleToolbarAction = (toolId: string) => {
    setActiveTool(toolId);
    setShowShapePopover(false);

    if (toolId === "add-product") {
      setShowProductModal(true);
    } else if (toolId === "erase") {
      if (selectedLayerId) {
        removeLayer(selectedLayerId);
      } else {
        toast.info(
          "Erase Mode Active: Click any design layer on the canvas to erase it immediately.",
        );
      }
    } else if (toolId === "add-logo") {
      fileInputRef.current?.click();
    } else if (toolId === "add-text") {
      addLayer("text", { text: "Double Click to Edit", color: activeColor });
    } else if (toolId === "add-shape") {
      setShowShapePopover(true);
    } else if (toolId === "curve") {
      const selected = activeLayers.find((l) => l.id === selectedLayerId);
      if (selected && selected.type === "text") {
        updateLayer(selected.id, { curved: !selected.curved });
      } else {
        toast.warn(
          "Please select a text layer first to apply the Curve effect.",
        );
      }
    } else if (toolId === "open-project") {
      jsonInputRef.current?.click();
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      addLayer("image", { src });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleJSONImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (parsed.layersByView) {
          setLayersByView(parsed.layersByView);
          if (parsed.productColor) setProductColor(parsed.productColor);
          if (parsed.selectedGarment) {
            setSelectedGarment(parsed.selectedGarment);
            setClothingCode(parsed.selectedGarment.code);
            setHasGarment(true);
          }
          toast.success("Project imported successfully!");
        } else {
          toast.error("Invalid mockup configuration file.");
        }
      } catch {
        toast.error("Error reading mockup project JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden h-[600px] xl:h-full relative">
      <CanvasToolStrip
        activeTool={activeTool}
        onActionClick={handleToolbarAction}
        fileInputRef={fileInputRef}
        jsonInputRef={jsonInputRef}
        handleLogoUpload={handleLogoUpload}
        handleJSONImport={handleJSONImport}
      />

      <ShapePopover
        show={showShapePopover}
        onSelect={(shape) => {
          addLayer("shape", { shapeType: shape, color: activeColor });
          setShowShapePopover(false);
        }}
      />

      <FillPopover
        show={activeTool === "fill"}
        activeColor={activeColor}
        onSelectColor={(color) => {
          setActiveColor(color);
          if (selectedLayerId) {
            updateLayer(selectedLayerId, { color });
          } else {
            setProductColor(color);
          }
        }}
      />

      <ProductModal
        show={showProductModal}
        onClose={() => setShowProductModal(false)}
        onSelect={handleSelectQuickGarment}
      />

      <div className="flex-1 flex flex-col bg-[#F9FAFB] border border-[#E6EBF2] rounded-xl shadow-sm overflow-hidden relative">
        <div className="flex flex-wrap gap-4 md:items-center justify-between px-5 py-3 border-b border-[#E5E7EB] bg-[#F9FAFB]">
          <div className="flex flex-col md:flex-row gap-1.5">
            {["Front", "Back", "Left Sleeve", "Right Sleeve"].map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  activeView === view
                    ? "bg-[#3B82F6] text-white shadow-sm"
                    : "text-[#5C7899] hover:bg-gray-100"
                }`}
              >
                {view}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 text-[#5C7899]">
            <button
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="p-1.5 border border-[#E6EBF2] rounded-lg hover:text-[#111827] hover:bg-gray-50 bg-white shadow-sm"
            >
              <ZoomOut size={15} />
            </button>
            <span className="text-xs font-bold w-9 text-center">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(200, zoom + 10))}
              className="p-1.5 border border-[#E6EBF2] rounded-lg hover:text-[#111827] hover:bg-gray-50 bg-white shadow-sm"
            >
              <ZoomIn size={15} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto flex items-center justify-center bg-[#F3F4F6] relative p-8">
          {!hasGarment ? (
            <BlankGarmentPlaceholder
              onSelectQuickGarment={handleSelectQuickGarment}
            />
          ) : (
            <CardContainer
              className="relative shadow-xl overflow-hidden border-0"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "center center",
                transition: "transform 0.15s ease",
                padding: 0,
                width: isMobile || isTablet ? SHIRT_W * 0.5 : SHIRT_W,
                height: isMobile || isTablet ? SHIRT_H * 0.5 : SHIRT_H,
                background: "transparent",
              }}
            >
              <div
                style={{
                  transform: isMobile || isTablet ? "scale(0.5)" : "scale(1)",
                  transformOrigin: "top left",
                  width: SHIRT_W,
                  height: SHIRT_H,
                }}
              >
                <div
                  ref={containerRef}
                  className="relative w-full h-full"
                  onClick={() => setSelectedLayerId(null)}
                >
                  {selectedGarment?.code === "18500" ? (
                    <HoodieSVG color={productColor} template={activeView} />
                  ) : (
                    <TShirtSVG color={productColor} template={activeView} />
                  )}

                  <div
                    className="absolute border border-dashed border-[#3B82F6]/40 overflow-hidden"
                    style={{
                      left: canvasLeft,
                      top: canvasTop,
                      width: canvasW,
                      height: canvasH,
                      zIndex: 10,
                      touchAction: "none",
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                  >
                    <CanvasLayers
                      activeLayers={activeLayers}
                      selectedLayerId={selectedLayerId}
                      setSelectedLayerId={setSelectedLayerId}
                      activeTool={activeTool}
                      zoom={zoom}
                      updateLayer={updateLayer}
                      removeLayer={removeLayer}
                    />
                  </div>
                </div>
              </div>
            </CardContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default CenterCanvasArea;
