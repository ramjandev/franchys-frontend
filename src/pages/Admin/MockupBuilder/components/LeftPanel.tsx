import CardContainer from "@/components/shared/CardContainer";
import CommonButton from "@/components/shared/CommonButton";
import CommonSelect from "@/components/shared/CommonSelect";
import { inputClass } from "@/pages/Login";
import { GARMENT_OPTIONS, useMockup } from "@/store/mockUp/hooks/useMockup";
import { RotateCcw, Sparkles, Upload } from "lucide-react";
import React, { useRef } from "react";
import { TbBracketsContain } from "react-icons/tb";
import { toast } from "react-toastify";
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
    selectedLayerId,
  } = useMockup();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    if (!clothingCode.trim()) return;
    const found = GARMENT_OPTIONS.find(
      (g) => g.code.toLowerCase() === clothingCode.trim().toLowerCase(),
    );
    if (found) {
      setSelectedGarment(found);
      setProductColor(found.colors[0].hex);
      setHasGarment(true);
    } else {
      toast.error(
        `Garment code "${clothingCode}" not found. Try 3001, 5000, 8000, or 18500.`,
      );
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

  const productVariantOptions =
    selectedGarment?.colors.map((c) => ({
      label: `${selectedGarment.name} — ${c.name}`,
      value: c.hex,
    })) ?? [];

  return (
    <div className="w-full xl:w-75 shrink-0 flex flex-col gap-5 xl:overflow-y-auto">
      <CardContainer className="p-5 flex flex-col gap-5 bg-white border border-[#E6EBF2] rounded-xl shadow-sm">
        <h3 className="font-bold text-[#111827] text-lg border-b border-gray-100 pb-3">
          Tools
        </h3>

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

            <CommonButton variant="primaryBlue" onClick={handleSearch}>
              Search
            </CommonButton>
          </div>
        </div>

        {/* Upload Logo */}
        <div>
          <label className={inputClass.label}>Upload Logo</label>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-2 justify-center h-10 border-2 border-dashed border-[#D1D5DC] hover:border-[#3B82F6] rounded-lg text-sm text-[#4B5563] hover:bg-gray-50 transition-all font-medium cursor-pointer"
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
              onClick={() =>
                toast.info(
                  "Background removal is a premium feature connected to the API.",
                )
              }
              className="w-full flex items-center gap-2 justify-center h-10 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-sm text-purple-700 font-semibold transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Remove Background
            </button>
          </div>
        </div>

        {/* Product Variant Dropdown (CommonSelect) */}
        <div>
          <label className={inputClass.label}>Product Variant</label>
          <CommonSelect
            value={productColor}
            item={productVariantOptions}
            onValueChange={(value) => setProductColor(value)}
            disabled={!selectedGarment}
            placeholder={
              !selectedGarment ? "No Garment Selected" : "Select a variant"
            }
            className="w-full!"
          />
        </div>

        {/* Scale Slider */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className={inputClass.label}>Scale</label>
            <span className="text-xs font-semibold text-[#4B5563]">
              {scale}%
            </span>
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
            <span className="text-xs font-semibold text-[#4B5563]">
              {rotation}°
            </span>
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
        <div className="flex gap-3 ">
          <CommonButton
            onClick={() => toast.info("This allows saving a mockup template.")}
            variant="ghost"
            className="w-full!"
          >
            <TbBracketsContain />
          </CommonButton>
          <CommonButton
            onClick={resetCanvas}
            variant="ghost"
            className="w-full!"
          >
            <RotateCcw />
            Reset
          </CommonButton>
        </div>
      </CardContainer>
    </div>
  );
};

export default LeftPanel;
