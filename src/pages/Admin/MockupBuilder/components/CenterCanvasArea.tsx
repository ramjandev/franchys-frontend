import CardContainer from "@/components/shared/CardContainer";
import { DEFAULT_GARMENT_SVG } from "@/lib/defaultGarment";
import { getCorsSafeUrl } from "@/lib/corsImage";
import { mockupCaptureRef } from "@/lib/mockupCaptureRef";
import { useMockup } from "@/store/mockUp/hooks/useMockup";
import { ZoomIn, ZoomOut } from "lucide-react";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Subcomponents & hooks
import { CanvasLayers } from "./CanvasLayers";
import { CanvasToolStrip } from "./CanvasToolStrip";
import { FillPopover } from "./FillPopover";
import { ProductModal } from "./ProductModal";
import { ShapePopover } from "./ShapePopover";
import { useDrawing } from "./useDrawing";

export const CANVAS_W = 420;
export const CANVAS_H = 500;

interface CenterCanvasAreaProps {
  onOpenProductModal?: () => void;
  onSelectProduct?: (productId: string, initialImage?: string) => void;
}

const CenterCanvasArea: React.FC<CenterCanvasAreaProps> = ({
  onOpenProductModal,
  onSelectProduct,
}) => {
  const {
    canvasProductImage,
    setCanvasProductImage,
    productViews,
    activeView,
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
  } = useMockup();

  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive scaling states
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 650,
    height: 650,
  });

  const effectiveProductImage =
    canvasProductImage ||
    (productViews && productViews.length > 0
      ? productViews[0]
      : DEFAULT_GARMENT_SVG);

  React.useEffect(() => {
    if (!canvasProductImage) {
      setCanvasProductImage(effectiveProductImage);
    }
  }, [canvasProductImage, effectiveProductImage, setCanvasProductImage]);

  React.useEffect(() => {
    const targetSrc = canvasProductImage || effectiveProductImage;
    if (!targetSrc) return;
    const img = new Image();
    img.onload = () => {
      const nw = img.naturalWidth || 600;
      const nh = img.naturalHeight || 700;
      const maxW = isMobile ? 360 : 700;
      const maxH = isMobile ? 480 : 660;

      let targetW = maxW;
      let targetH = Math.round((nh / nw) * maxW);

      if (targetH > maxH) {
        targetH = maxH;
        targetW = Math.round((nw / nh) * maxH);
      }

      targetW = Math.max(isMobile ? 300 : 450, targetW);
      targetH = Math.max(isMobile ? 320 : 450, targetH);

      setCanvasDimensions({ width: targetW, height: targetH });
    };
    img.src = targetSrc;
  }, [canvasProductImage, effectiveProductImage, isMobile]);

  React.useEffect(() => {
    mockupCaptureRef.current = containerRef.current;
  }, [canvasProductImage, activeView, canvasDimensions]);

  const [showProductModal, setShowProductModal] = useState(false);
  const [showShapePopover, setShowShapePopover] = useState(false);
  const [activeColor, setActiveColor] = useState("#EF4444");

  const canvasW = canvasDimensions.width;
  const canvasH = canvasDimensions.height;

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

  const handleOpenProductSelection = () => {
    if (onOpenProductModal) {
      onOpenProductModal();
    } else {
      setShowProductModal(true);
    }
  };

  const handleToolbarAction = (toolId: string) => {
    setActiveTool(toolId);
    setShowShapePopover(false);

    if (toolId === "add-product") {
      handleOpenProductSelection();
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
      addLayer("image", { src, w: 120, h: 120 });
      toast.success("Logo added to mockup! Drag & resize it on the canvas.");
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
          if (parsed.canvasProductImage) {
            setCanvasProductImage(parsed.canvasProductImage);
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
          }
        }}
      />

      <ProductModal
        show={showProductModal}
        onClose={() => setShowProductModal(false)}
        onSelectProduct={(productId, initialImage) => {
          if (initialImage) {
            setCanvasProductImage(initialImage);
          }
          if (onSelectProduct) {
            onSelectProduct(productId, initialImage);
          } else {
            navigate(`/admin/mockups/${productId}`);
          }
          setShowProductModal(false);
        }}
        onCustomImageUpload={(customImg) => {
          setCanvasProductImage(customImg);
          setShowProductModal(false);
        }}
      />

      <div className="flex-1 flex flex-col bg-[#F9FAFB] border border-[#E6EBF2] rounded-xl shadow-sm overflow-hidden relative">
        {/* Top Controls Bar */}
        <div className="flex flex-wrap gap-4 md:items-center justify-end px-5 py-3 border-b border-[#E5E7EB] bg-[#F9FAFB]">
          <div className="flex items-center gap-3 text-[#5C7899]">
            <button
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="p-1.5 border border-[#E6EBF2] rounded-lg hover:text-[#111827] hover:bg-gray-50 bg-white shadow-sm cursor-pointer"
            >
              <ZoomOut size={15} />
            </button>
            <span className="text-xs font-bold w-9 text-center">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(200, zoom + 10))}
              className="p-1.5 border border-[#E6EBF2] rounded-lg hover:text-[#111827] hover:bg-gray-50 bg-white shadow-sm cursor-pointer"
            >
              <ZoomIn size={15} />
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto flex items-center justify-center bg-[#F3F4F6] relative p-3 md:p-6">
          <CardContainer
            className="relative shadow-xl overflow-hidden border border-gray-200/80 rounded-2xl"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: "center center",
              transition: "transform 0.15s ease",
              padding: 0,
              width: canvasDimensions.width,
              height: canvasDimensions.height,
              maxWidth: "100%",
              background: "#FFFFFF",
            }}
          >
            <div
              ref={containerRef}
              className="relative w-full h-full flex items-center justify-center bg-white"
              onClick={() => setSelectedLayerId(null)}
            >
              <img
                src={getCorsSafeUrl(canvasProductImage || effectiveProductImage)}
                crossOrigin="anonymous"
                onError={(e) => {
                  const target = e.currentTarget;
                  const currentSrc = canvasProductImage || effectiveProductImage;
                  if (currentSrc && target.src !== currentSrc) {
                    target.removeAttribute("crossorigin");
                    target.src = currentSrc;
                  }
                }}
                alt="Product Canvas"
                className="w-full h-full object-contain pointer-events-none select-none"
              />

                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{
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
            </CardContainer>
        </div>
      </div>
    </div>
  );
};

export default CenterCanvasArea;
