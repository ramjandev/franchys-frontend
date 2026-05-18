import React, { useRef } from "react";
import { Upload, Sparkles, RotateCcw } from "lucide-react";
import { useMockup, GARMENT_OPTIONS } from "../context/MockupContext";
import CardContainer from "@/components/shared/CardContainer";

export const inputClass = {
  label: "block text-xs font-semibold text-[#4A5565] mb-1.5 uppercase tracking-wider",
  input:
    "w-full border border-[#D1D5DC] rounded-lg px-3 py-2 text-sm text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] bg-white transition-all shadow-sm",
};

const LeftPanel: React.FC = () => {
  const {
    clothingCode,
    setClothingCode,
    setHasGarment,
    selectedGarment,
    setSelectedGarment,
    productColor,
    setProductColor,
    scale,
    setScale,
    rotation,
    setRotation,
    addLayer,
    resetCanvas,
    selectedLayerId
  } = useMockup();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    if (!clothingCode.trim()) return;
    const found = GARMENT_OPTIONS.find(
      (g) => g.code.toLowerCase() === clothingCode.trim().toLowerCase()
    );
    if (found) {
      setSelectedGarment(found);
      setProductColor(found.colors[0].hex);
      setHasGarment(true);
    } else {
      alert(`Garment code "${clothingCode}" not found. Try 3001, 5000, 8000, or 18500.`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large. Maximum size is 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      addLayer("image", { src, w: 100, h: 100 });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProductColor(e.target.value);
  };

  return (
    <div className="w-full xl:w-[300px] shrink-0 flex flex-col gap-5 xl:overflow-y-auto">
      <CardContainer className="p-5 flex flex-col gap-5 bg-white border border-[#E6EBF2] rounded-xl shadow-sm">
        <h3 className="font-bold text-[#111827] text-lg border-b border-gray-100 pb-3">Tools</h3>

        {/* Clothing Code Search */}
        <div>
          <label className={inputClass.label}>Clothing Code</label>
          <p className="text-xs text-[#6B7280] mb-2 leading-relaxed">
            Enter a product code (e.g. 8000) to load a blank garment
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={clothingCode}
              onChange={(e) => setClothingCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="e.g. 8000"
              className={`${inputClass.input} flex-1`}
            />
            <button
              onClick={handleSearch}
              className="px-4 h-[38px] bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center shadow-sm"
            >
              Search
            </button>
          </div>
        </div>

        {/* Upload Logo */}
        <div>
          <label className={inputClass.label}>Upload Logo</label>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-2 justify-center h-10 border-2 border-dashed border-[#D1D5DC] hover:border-[#3B82F6] rounded-lg text-sm text-[#4B5563] hover:bg-gray-50 transition-all font-medium"
            >
              <Upload className="w-4 h-4 text-[#6B7280]" />
              Choose File
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            <button
              onClick={() => alert("Background removal is a premium feature connected to the API.")}
              className="w-full flex items-center gap-2 justify-center h-10 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-sm text-purple-700 font-semibold transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Remove Background
            </button>
          </div>
        </div>

        {/* Product Variant Dropdown */}
        <div>
          <label className={inputClass.label}>Product Variant</label>
          <select
            value={productColor}
            onChange={handleColorChange}
            disabled={!selectedGarment}
            className={`${inputClass.input} disabled:bg-gray-50 disabled:text-gray-400`}
          >
            {!selectedGarment ? (
              <option>No Garment Selected</option>
            ) : (
              selectedGarment.colors.map((c) => (
                <option key={c.hex} value={c.hex}>
                  {selectedGarment.name} — {c.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Scale Slider */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className={inputClass.label}>Scale</label>
            <span className="text-xs font-semibold text-[#4B5563]">{scale}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="200"
            value={scale}
            disabled={!selectedLayerId}
            onChange={(e) => setScale(Number(e.target.value))}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3B82F6] disabled:opacity-50"
          />
        </div>

        {/* Rotation Slider */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className={inputClass.label}>Rotation</label>
            <span className="text-xs font-semibold text-[#4B5563]">{rotation}°</span>
          </div>
          <input
            type="range"
            min="-180"
            max="180"
            value={rotation}
            disabled={!selectedLayerId}
            onChange={(e) => setRotation(Number(e.target.value))}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3B82F6] disabled:opacity-50"
          />
        </div>

        {/* Bottom Actions */}
        <div className="flex gap-3 pt-2 border-t border-gray-100 mt-2">
          <button
            onClick={() => alert("Info: This allows saving mockup template.")}
            className="flex-1 flex items-center justify-center h-10 border border-[#D1D5DC] rounded-lg text-sm text-[#4B5563] hover:bg-gray-50 transition-colors font-medium shadow-sm"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </button>
          <button
            onClick={resetCanvas}
            className="flex-1 flex items-center justify-center gap-1.5 h-10 border border-[#D1D5DC] rounded-lg text-sm text-[#4B5563] hover:bg-gray-50 transition-colors font-semibold shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </CardContainer>
    </div>
  );
};

export default LeftPanel;
