import React, { useRef } from "react";
import { Upload, Sparkles, RotateCcw } from "lucide-react";
import { useMockup, GARMENT_OPTIONS } from "../context/MockupContext";
import CardContainer from "@/components/shared/CardContainer";
import { toast } from "react-toastify";

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
      toast.error(`Garment code "${clothingCode}" not found. Try 3001, 5000, 8000, or 18500.`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 10MB.");
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
              onClick={() => toast.info("Background removal is a premium feature connected to the API.")}
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
            onClick={() => toast.info("This allows saving a mockup template.")}
            className="flex-1 flex items-center justify-center h-10 bg-[#F3F4F6] hover:bg-blue-50 hover:text-blue-700 rounded-lg text-sm text-[#4B5563] transition-colors font-medium shadow-sm"
          >
           <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
            <g clip-path="url(#clip0_750_4170)">
              <path d="M4.81018 1.80469H3.0063C2.68735 1.80469 2.38147 1.93139 2.15594 2.15692C1.93041 2.38245 1.80371 2.68833 1.80371 3.00727V11.4254C1.80371 12.0868 2.34487 12.628 3.0063 12.628H4.81018" stroke="#364153" stroke-width="1.20259" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9.62061 1.80469H11.4245C11.7434 1.80469 12.0493 1.93139 12.2748 2.15692C12.5004 2.38245 12.6271 2.68833 12.6271 3.00727V11.4254C12.6271 11.7443 12.5004 12.0502 12.2748 12.2757C12.0493 12.5013 11.7434 12.628 11.4245 12.628H9.62061" stroke="#364153" stroke-width="1.20259" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7.21558 12.0273V13.2299" stroke="#364153" stroke-width="1.20259" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7.21558 8.41797V9.62055" stroke="#364153" stroke-width="1.20259" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7.21558 4.81055V6.01313" stroke="#364153" stroke-width="1.20259" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7.21558 1.20312V2.40571" stroke="#364153" stroke-width="1.20259" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
              <clipPath id="clip0_750_4170">
                <rect width="14.431" height="14.431" fill="white"/>
              </clipPath>
            </defs>
          </svg>
          </button>
          <button
            onClick={resetCanvas}
            className="flex-1 flex items-center justify-center gap-1.5 h-10 bg-[#F3F4F6] hover:bg-blue-50 hover:text-blue-700 rounded-lg text-sm text-[#4B5563] transition-colors font-medium shadow-sm"
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
