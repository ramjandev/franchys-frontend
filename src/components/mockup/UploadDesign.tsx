import {
  addLayer,
  removeLayer,
  resetCanvas,
  setDesignSize,
  setPrintMethod,
  setProductColor,
  setSelectedLayer,
  updateLayer,
} from "@/store/designSlice";
import type { RootState } from "@/store/store";
import { Plus, Upload } from "lucide-react";
import React, { useRef, useState } from "react";
import { LiaRedoAltSolid } from "react-icons/lia";
import { useDispatch, useSelector } from "react-redux";
import CardContainer from "../shared/CardContainer";
import CommonButton from "../shared/CommonButton";
import CommonHeader from "../shared/CommonHeader";
import CommonSelect from "../shared/CommonSelect";

// ── Shared input styles (import from your Login page or define here) ──────────
export const inputClass = {
  label: "block text-sm font-medium text-[#364153] mb-1",
  input:
    "w-full border border-[#D1D5DC] rounded-md px-3 py-2 text-sm text-[#101828] focus:outline-none focus:ring-1 focus:ring-[#4A90E2] focus:border-[#4A90E2] transition-colors",
};

let _layerIdCtr = 1;
const nextId = () => _layerIdCtr++;

const COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Navy", hex: "#1E3A8A" },
  { name: "Red", hex: "#DC2626" },
  { name: "Blue", hex: "#2563EB" },
  { name: "Green", hex: "#16A34A" },
  { name: "Gray", hex: "#6B7280" },
  { name: "Yellow", hex: "#EAB308" },
];

const TEXT_COLORS = [
  { label: "White", hex: "#ffffff" },
  { label: "Black", hex: "#000000" },
  { label: "Red", hex: "#DC2626" },
  { label: "Gold", hex: "#EAB308" },
  { label: "Blue", hex: "#2563EB" },
  { label: "Green", hex: "#16A34A" },
];

const PRINT_METHODS = [
  { label: "DTF (Direct to Film)", value: "dtf" },
  { label: "DTG (Direct to Garment)", value: "dtg" },
  { label: "Sublimation", value: "sublimation" },
  { label: "Screen Printing", value: "screen" },
];

const UploadDesign: React.FC = () => {
  const dispatch = useDispatch();
  const {
    productColor,
    designWidth,
    designHeight,
    printMethod,
    layers,
    selectedLayerId,
  } = useSelector((s: RootState) => s.design);

  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  const [localText, setLocalText] = useState("Your Text");
  const [localFontSize, setLocalFontSize] = useState(20);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Derived ──────────────────────────────────────────────────────────────
  const selectedColorName =
    COLORS.find((c) => c.hex.toLowerCase() === productColor.toLowerCase())
      ?.name ?? "Custom";

  const selectedLayer = layers.find((l) => l.id === selectedLayerId) ?? null;
  const isTextSelected = selectedLayer?.type === "text";
  const textLayers = layers.filter((l) => l.type === "text");

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleColorSelect = (hex: string) => dispatch(setProductColor(hex));

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseFloat(e.target.value) || 1;
    const newHeight = maintainAspectRatio
      ? Math.round(((newWidth * designHeight) / designWidth) * 100) / 100
      : designHeight;
    dispatch(setDesignSize({ width: newWidth, height: newHeight }));
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseFloat(e.target.value) || 1;
    const newWidth = maintainAspectRatio
      ? Math.round(((newHeight * designWidth) / designHeight) * 100) / 100
      : designWidth;
    dispatch(setDesignSize({ width: newWidth, height: newHeight }));
  };

  // ── Image upload ──────────────────────────────────────────────────────────
  const loadFile = (file: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("File too large. Max 10MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;

      // Detect actual image dimensions for better initial sizing
      const img = new Image();
      img.onload = () => {
        const id = nextId();
        const canvasW = Math.max(40, Math.round(designWidth * 14) - 8);
        const canvasH = Math.max(30, Math.round(designHeight * 14) - 8);
        // Fit image inside canvas preserving aspect ratio
        const imgAspect = img.width / img.height;
        let lw = canvasW;
        let lh = Math.round(canvasW / imgAspect);
        if (lh > canvasH) {
          lh = canvasH;
          lw = Math.round(canvasH * imgAspect);
        }
        dispatch(
          addLayer({
            id,
            type: "image",
            src,
            x: Math.round((canvasW - lw) / 2),
            y: Math.round((canvasH - lh) / 2),
            w: lw,
            h: lh,
            color: "#ffffff",
            fontSize: 20,
          }),
        );
        dispatch(setSelectedLayer(id));
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) loadFile(file);
  };

  // ── Text layer ────────────────────────────────────────────────────────────
  const handleAddText = () => {
    const id = nextId();
    dispatch(
      addLayer({
        id,
        type: "text",
        text: "Your Text",
        x: 10,
        y: 10,
        w: 100,
        h: 36,
        color: "#ffffff",
        fontSize: 20,
      }),
    );
    dispatch(setSelectedLayer(id));
    setLocalText("Your Text");
    setLocalFontSize(20);
  };

  const handleReset = () => dispatch(resetCanvas());

  const handleSelectTextLayer = (id: number) => {
    const l = layers.find((x) => x.id === id);
    if (!l) return;
    dispatch(setSelectedLayer(id));
    setLocalText(l.text ?? "");
    setLocalFontSize(l.fontSize ?? 20);
  };

  const handleTextInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalText(val);
    if (selectedLayerId != null)
      dispatch(updateLayer({ id: selectedLayerId, data: { text: val } }));
  };

  const changeFontSize = (delta: number) => {
    const newSize = Math.max(8, Math.min(120, localFontSize + delta));
    setLocalFontSize(newSize);
    if (selectedLayerId != null)
      dispatch(
        updateLayer({ id: selectedLayerId, data: { fontSize: newSize } }),
      );
  };

  const handleTextColor = (hex: string) => {
    if (selectedLayerId != null)
      dispatch(updateLayer({ id: selectedLayerId, data: { color: hex } }));
  };

  const handleDeleteSelected = () => {
    if (selectedLayerId != null) {
      dispatch(removeLayer(selectedLayerId));
      dispatch(setSelectedLayer(null));
    }
  };

  return (
    <div className="space-y-5">
      {/* ── Upload Design ──────────────────────────────────────────────── */}
      <CardContainer>
        <CommonHeader size="lg" className="pb-8">
          Upload Design
        </CommonHeader>
        <div
          className={`border-2 border-dashed rounded-xl h-52 flex flex-col items-center justify-center hover:border-blue-400 transition-colors cursor-pointer gap-1 ${
            isDragOver ? "border-blue-400 bg-blue-50" : "border-[#D1D5DC]"
          }`}
          onClick={handleUploadClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="w-16 h-16 flex items-center justify-center text-[#99A1AF]">
            <Upload className="w-8 h-8" />
          </div>
          <p className="text-[#4A5565] font-medium text-base">
            Click to upload
          </p>
          <p className="text-[#4A5565] text-sm">PNG, JPG, SVG (Max 10MB)</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.svg"
          style={{ display: "none" }}
          onChange={handleFileInput}
        />
      </CardContainer>

      {/* ── Product Color ──────────────────────────────────────────────── */}
      <CardContainer>
        <CommonHeader size="lg" className="pb-8">
          Product Color
        </CommonHeader>
        <div className="grid grid-cols-4 gap-4">
          {COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() => handleColorSelect(color.hex)}
              className={`aspect-square rounded-md border-2 transition-all cursor-pointer ${
                productColor.toLowerCase() === color.hex.toLowerCase()
                  ? "border-[#4A90E2] scale-105 shadow-[0_0_0_2px_#4A90E2]"
                  : "border-[#D1D5DC] hover:border-[#9CA3AF]"
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
        <CommonHeader className="pt-8">
          Selected:{" "}
          <span className="ml-1 font-semibold">{selectedColorName}</span>
        </CommonHeader>
      </CardContainer>

      {/* ── Design Size ────────────────────────────────────────────────── */}
      <CardContainer>
        <CommonHeader size="lg" className="pb-8">
          Design Size
        </CommonHeader>
        <div className="space-y-5">
          <div>
            <label className={inputClass.label}>Width (inches)</label>
            <input
              type="number"
              value={designWidth}
              onChange={handleWidthChange}
              className={inputClass.input}
              min={1}
              max={20}
              step={0.5}
            />
          </div>
          <div>
            <label className={inputClass.label}>Height (inches)</label>
            <input
              type="number"
              value={designHeight}
              onChange={handleHeightChange}
              className={inputClass.input}
              min={1}
              max={20}
              step={0.5}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="aspectRatio"
              checked={maintainAspectRatio}
              onChange={(e) => setMaintainAspectRatio(e.target.checked)}
              className="w-4 h-4 border border-gray-300 rounded-sm accent-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <label
              htmlFor="aspectRatio"
              className="text-sm text-[#364153] cursor-pointer"
            >
              Maintain aspect ratio
            </label>
          </div>
        </div>
      </CardContainer>

      {/* ── Print Method ───────────────────────────────────────────────── */}
      <CardContainer>
        <CommonHeader size="lg" className="pb-8">
          Print Method
        </CommonHeader>
        <CommonSelect
          item={PRINT_METHODS}
          value={printMethod}
          onValueChange={(val) => dispatch(setPrintMethod(val))}
          placeholder="Select print method"
          className="w-full"
        />
      </CardContainer>

      {/* ── Quick Actions ──────────────────────────────────────────────── */}
      <CardContainer>
        <CommonHeader size="lg" className="pb-8">
          Quick Actions
        </CommonHeader>
        <div className="flex flex-col gap-3">
          <CommonButton onClick={handleAddText}>
            <Plus className="w-5 h-5" />
            Add Text
          </CommonButton>
          <CommonButton onClick={handleReset}>
            <LiaRedoAltSolid className="w-5 h-5" />
            Reset Canvas
          </CommonButton>
        </div>

        {/* ── Text layer editor ─────────────────────────────────────── */}
        {textLayers.length > 0 && (
          <div className="mt-5 pt-5 border-t border-[#E5E7EB] space-y-4">
            <CommonHeader>Text Layers</CommonHeader>

            {/* Layer picker */}
            <div className="flex flex-col gap-2">
              {textLayers.map((l) => (
                <button
                  key={l.id}
                  onClick={() => handleSelectTextLayer(l.id)}
                  className={`text-left px-3 py-2 rounded-md border text-sm truncate transition-colors ${
                    selectedLayerId === l.id
                      ? "border-[#4A90E2] bg-blue-50 text-[#1D4ED8]"
                      : "border-[#D1D5DC] text-[#374151] hover:bg-gray-50"
                  }`}
                >
                  &ldquo;{l.text}&rdquo;
                </button>
              ))}
            </div>

            {/* Controls for selected text layer */}
            {isTextSelected && selectedLayer && (
              <div className="space-y-4">
                {/* Edit text */}
                <div>
                  <label className={inputClass.label}>Edit Text</label>
                  <input
                    type="text"
                    value={localText}
                    onChange={handleTextInput}
                    className={inputClass.input}
                    placeholder="Type your text..."
                  />
                </div>

                {/* Font size */}
                <div>
                  <label className={inputClass.label}>
                    Font Size: {localFontSize}px
                  </label>
                  <div className="flex items-center gap-3 mt-1">
                    <button
                      onClick={() => changeFontSize(-2)}
                      className="w-8 h-8 border border-[#D1D5DC] rounded-md bg-white text-[#374151] font-bold flex items-center justify-center hover:bg-gray-50 text-lg"
                    >
                      −
                    </button>
                    <input
                      type="range"
                      min={8}
                      max={120}
                      value={localFontSize}
                      onChange={(e) => {
                        const v = parseInt(e.target.value);
                        setLocalFontSize(v);
                        if (selectedLayerId != null)
                          dispatch(
                            updateLayer({
                              id: selectedLayerId,
                              data: { fontSize: v },
                            }),
                          );
                      }}
                      className="flex-1 accent-blue-600"
                    />
                    <button
                      onClick={() => changeFontSize(2)}
                      className="w-8 h-8 border border-[#D1D5DC] rounded-md bg-white text-[#374151] font-bold flex items-center justify-center hover:bg-gray-50 text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Text color */}
                <div>
                  <label className={inputClass.label}>Text Color</label>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {TEXT_COLORS.map((c) => (
                      <button
                        key={c.hex}
                        title={c.label}
                        onClick={() => handleTextColor(c.hex)}
                        className={`w-7 h-7 rounded-md border-2 transition-all ${
                          selectedLayer.color?.toLowerCase() ===
                          c.hex.toLowerCase()
                            ? "border-[#4A90E2] scale-110"
                            : "border-[#D1D5DC]"
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={handleDeleteSelected}
                  className="w-full px-3 py-2 border border-red-200 rounded-md text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Delete Selected Layer
                </button>
              </div>
            )}
          </div>
        )}
      </CardContainer>
    </div>
  );
};

export default UploadDesign;
