import {
  removeLayer,
  setPosition,
  setSelectedLayer,
  updateLayer,
} from "@/store/designSlice";
import type { RootState } from "@/store/store";
import html2canvas from "html2canvas";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { DraggableData, DraggableEvent } from "react-draggable";
import { FiZoomOut } from "react-icons/fi";
import { HiOutlineZoomIn } from "react-icons/hi";
import { LiaRedoAltSolid } from "react-icons/lia";
import { useDispatch, useSelector } from "react-redux";
import { Rnd } from "react-rnd";
import CardContainer from "../shared/CardContainer";
import CommonHeader from "../shared/CommonHeader";

// ─── Constants ───────────────────────────────────────────────────────────────
const designPositions = [
  "Top Left",
  "Top Center",
  "Top Right",
  "Middle Left",
  "Center",
  "Middle Right",
  "Bottom Left",
  "Bottom Center",
  "Bottom Right",
];

const POSITION_FRACS: Record<string, { xf: number; yf: number }> = {
  "Top Left": { xf: 0.15, yf: 0.15 },
  "Top Center": { xf: 0.5, yf: 0.15 },
  "Top Right": { xf: 0.85, yf: 0.15 },
  "Middle Left": { xf: 0.15, yf: 0.5 },
  Center: { xf: 0.5, yf: 0.5 },
  "Middle Right": { xf: 0.85, yf: 0.5 },
  "Bottom Left": { xf: 0.15, yf: 0.85 },
  "Bottom Center": { xf: 0.5, yf: 0.85 },
  "Bottom Right": { xf: 0.85, yf: 0.92 },
};

// Shirt container fixed size
const SHIRT_W = 420;
const SHIRT_H = 500;
// Pixels per inch
const PX_PER_INCH = 14;

// ─── T-Shirt SVG ─────────────────────────────────────────────────────────────
const TShirtSVG = ({
  color,
  template,
}: {
  color: string;
  template: string;
}) => (
  <svg
    viewBox="0 0 290 345"
    width={SHIRT_W}
    height={SHIRT_H}
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "block", position: "absolute", top: 0, left: 0 }}
  >
    <defs>
      <filter id="shirtShadow">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
      </filter>
    </defs>
    {/* Main shirt body */}
    <path
      d="M72 8 L8 62 L42 82 L42 338 L248 338 L248 82 L282 62 L218 8 L183 32 Q145 52 107 32 Z"
      fill={color}
      stroke="rgba(0,0,0,0.12)"
      strokeWidth="1.5"
      filter="url(#shirtShadow)"
    />
    {/* Collar */}
    <path
      d="M107 32 Q145 52 183 32"
      fill="none"
      stroke="rgba(0,0,0,0.18)"
      strokeWidth="2"
    />
    {/* Left sleeve seam */}
    <path
      d="M72 8 L8 62 L42 82"
      fill="none"
      stroke="rgba(0,0,0,0.1)"
      strokeWidth="1"
    />
    {/* Right sleeve seam */}
    <path
      d="M218 8 L282 62 L248 82"
      fill="none"
      stroke="rgba(0,0,0,0.1)"
      strokeWidth="1"
    />
    {/* Shoulder seam left */}
    <path
      d="M42 82 L42 100"
      fill="none"
      stroke="rgba(0,0,0,0.08)"
      strokeWidth="1"
    />
    {/* Shoulder seam right */}
    <path
      d="M248 82 L248 100"
      fill="none"
      stroke="rgba(0,0,0,0.08)"
      strokeWidth="1"
    />
    {/* Side seams */}
    <path
      d="M42 100 L42 338"
      fill="none"
      stroke="rgba(0,0,0,0.06)"
      strokeWidth="0.8"
    />
    <path
      d="M248 100 L248 338"
      fill="none"
      stroke="rgba(0,0,0,0.06)"
      strokeWidth="0.8"
    />
    {/* Bottom hem */}
    <path
      d="M42 334 L248 334"
      fill="none"
      stroke="rgba(0,0,0,0.1)"
      strokeWidth="1.5"
    />
    {/* Template label */}
    <rect
      x="95"
      y="326"
      width="100"
      height="16"
      rx="3"
      fill="rgba(0,0,0,0.25)"
    />
    <text
      x="145"
      y="337"
      textAnchor="middle"
      fontSize="9"
      fill="rgba(255,255,255,0.9)"
      fontFamily="sans-serif"
    >
      T-Shirt — {template === "front" ? "Front" : "Back"}
    </text>
  </svg>
);

// ─── Types ────────────────────────────────────────────────────────────────────
export interface PreviewHandle {
  exportMockup: () => Promise<void>;
}

// ─── Component ────────────────────────────────────────────────────────────────
const Preview = forwardRef<PreviewHandle>((_, ref) => {
  const dispatch = useDispatch();
  const {
    layers,
    position,
    designWidth,
    designHeight,
    productColor,
    selectedLayerId,
    template,
  } = useSelector((s: RootState) => s.design);

  const [zoom, setZoom] = useState(100);
  const shirtContainerRef = useRef<HTMLDivElement>(null);

  // ── Canvas dimensions ────────────────────────────────────────────────────
  const canvasW = Math.max(40, Math.round(designWidth * PX_PER_INCH));
  const canvasH = Math.max(30, Math.round(designHeight * PX_PER_INCH));

  // ── Canvas position ──────────────────────────────────────────────────────
  const frac = POSITION_FRACS[position] ?? POSITION_FRACS["Center"];
  const canvasLeft = Math.round(SHIRT_W * frac.xf - canvasW / 2);
  const canvasTop = Math.round(SHIRT_H * frac.yf - canvasH / 2);

  // ── Zoom controls ────────────────────────────────────────────────────────
  const handleZoom = (delta: number) =>
    setZoom((z) => Math.max(50, Math.min(200, z + delta)));

  // ── Keyboard shortcuts ───────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedLayerId != null
      ) {
        dispatch(removeLayer(selectedLayerId));
        dispatch(setSelectedLayer(null));
      }
      if (e.key === "Escape") dispatch(setSelectedLayer(null));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedLayerId, dispatch]);

  // ── Export via html2canvas ───────────────────────────────────────────────
  useImperativeHandle(ref, () => ({
    exportMockup: async () => {
      if (!shirtContainerRef.current) return;
      dispatch(setSelectedLayer(null));
      await new Promise((r) => setTimeout(r, 80));
      try {
        const canvas = await html2canvas(shirtContainerRef.current, {
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          scale: 2,
          logging: false,
        });
        const link = document.createElement("a");
        link.download = "mockup.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      } catch (err) {
        console.error("Export failed:", err);
      }
    },
  }));

  const isImageUploaded = layers.length > 0;

  return (
    <div>
      <CardContainer size="lg" className="flex flex-col gap-8">
        {/* ── Toolbar ──────────────────────────────────────────────────── */}
        <div className="flex justify-between items-center">
          <CommonHeader size="lg">Preview</CommonHeader>
          <div className="flex items-center gap-4 text-[#0A0A0A]">
            <span
              className="text-xl border border-black/10 rounded-md p-1.5 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => handleZoom(-10)}
            >
              <FiZoomOut />
            </span>
            <span className="text-base text-[#4A5565] min-w-[40px] text-center">
              {zoom}%
            </span>
            <span
              className="text-xl border border-black/10 rounded-md p-1.5 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => handleZoom(10)}
            >
              <HiOutlineZoomIn />
            </span>
            <span
              className="text-xl border border-black/10 rounded-md p-1.5 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setZoom(100)}
              title="Reset zoom"
            >
              <LiaRedoAltSolid />
            </span>
          </div>
        </div>

        {/* ── Canvas area ──────────────────────────────────────────────── */}
        <div className="bg-[#F3F4F6]! border-[#D1D5DC]! h-[750px] flex items-center justify-center relative overflow-hidden">
          {isImageUploaded ? (
            <CardContainer
              className="relative shadow-[0_13.016px_19.523px_-3.905px_rgba(0,0,0,0.10),_0_5.206px_7.809px_-5.206px_rgba(0,0,0,0.10)]"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "center center",
                transition: "transform 0.15s ease",
                padding: 0,
                border: "none",
                background: "transparent",
              }}
            >
              {/* Captured by html2canvas */}
              <div
                ref={shirtContainerRef}
                className="relative w-105 h-125"
                onClick={() => dispatch(setSelectedLayer(null))}
              >
                {/* T-Shirt SVG background */}
                <TShirtSVG color={productColor} template={template} />

                {/* ── Design canvas ── */}
                <div
                  className="absolute border-2 border-dashed border-[#4A90E2]/70 overflow-hidden"
                  style={{
                    left: canvasLeft,
                    top: canvasTop,
                    width: canvasW,
                    height: canvasH,
                    zIndex: 2,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {layers.map((layer) => {
                    const isSelected = selectedLayerId === layer.id;
                    return (
                      <Rnd
                        key={layer.id}
                        size={{ width: layer.w, height: layer.h }}
                        position={{ x: layer.x, y: layer.y }}
                        bounds="parent"
                        scale={zoom / 100}
                        enableResizing={
                          isSelected
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
                        disableDragging={false}
                        onDragStop={(_e: DraggableEvent, d: DraggableData) => {
                          dispatch(
                            updateLayer({
                              id: layer.id,
                              data: { x: d.x, y: d.y },
                            }),
                          );
                        }}
                        onResizeStop={(_e, _dir, refEl, _delta, pos) => {
                          const newW = parseInt(refEl.style.width);
                          const newH = parseInt(refEl.style.height);
                          const ratio = layer.w > 0 ? newW / layer.w : 1;
                          dispatch(
                            updateLayer({
                              id: layer.id,
                              data: {
                                w: newW,
                                h: newH,
                                x: pos.x,
                                y: pos.y,
                                fontSize: layer.fontSize
                                  ? Math.max(
                                      8,
                                      Math.round(layer.fontSize * ratio),
                                    )
                                  : undefined,
                              },
                            }),
                          );
                        }}
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          dispatch(setSelectedLayer(layer.id));
                        }}
                        style={{
                          outline: isSelected ? "2px solid #4A90E2" : "none",
                          cursor: "move",
                          userSelect: "none",
                        }}
                      >
                        {layer.type === "image" && (
                          <img
                            src={layer.src}
                            alt="Design layer"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              display: "block",
                              pointerEvents: "none",
                              userSelect: "none",
                            }}
                            draggable={false}
                          />
                        )}

                        {layer.type === "text" && (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "hidden",
                            }}
                          >
                            <span
                              style={{
                                fontSize: layer.fontSize ?? 20,
                                color: layer.color ?? "#101828",
                                fontWeight: 700,
                                textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
                                whiteSpace: "nowrap",
                                pointerEvents: "none",
                                userSelect: "none",
                              }}
                            >
                              {layer.text}
                            </span>
                          </div>
                        )}
                      </Rnd>
                    );
                  })}
                </div>
              </div>
            </CardContainer>
          ) : (
            <div className="border-2 border-dashed border-[#99A1AF] w-62.5 h-62.5 flex items-center justify-center rounded-md">
              <p className="text-[#6A7282] max-w-50 text-center">
                Upload a design to see preview
              </p>
            </div>
          )}
        </div>

        {/* ── Design Position ──────────────────────────────────────────── */}
        <CardContainer className="bg-[#F9FAFB]!">
          <CommonHeader size="lg">Design Position</CommonHeader>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {designPositions.map((pos) => (
              <button
                key={pos}
                className={`${
                  position === pos
                    ? "bg-[#DBEAFE] border-[#4A90E2]"
                    : "bg-white border-[#D1D5DC]"
                } border rounded px-4 py-3 cursor-pointer text-[#0A0A0A] text-base transition-all hover:bg-[#F9FAFB]`}
                onClick={() => dispatch(setPosition(pos))}
              >
                {pos}
              </button>
            ))}
          </div>
        </CardContainer>
      </CardContainer>
    </div>
  );
});

Preview.displayName = "Preview";
export default Preview;
