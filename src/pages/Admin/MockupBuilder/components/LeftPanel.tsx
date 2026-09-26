import { DEFAULT_GARMENT_SVG, extractProductImages } from "@/lib/defaultGarment";
import CardContainer from "@/components/shared/CardContainer";
import CommonButton from "@/components/shared/CommonButton";
import { inputClass } from "@/pages/Login";
import { useMockup } from "@/store/mockUp/hooks/useMockup";
import { SingleProduct } from "@/store/Product/types/productTypes";
import { Image as ImageIcon, RotateCcw, Sparkles, Upload } from "lucide-react";
import React, { useEffect, useMemo, useRef } from "react";
import { TbBracketsContain } from "react-icons/tb";
import { toast } from "react-toastify";

interface LeftPanelProps {
  product?: SingleProduct;
  onOpenProductModal?: () => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
  product,
  onOpenProductModal,
}) => {
  const {
    canvasProductImage,
    setCanvasProductImage,
    productViews,
    setProductViews,
    activeView,
    setActiveView,
    layersByView,
    scale,
    setScale,
    rotation,
    setRotation,
    addLayer,
    resetCanvas,
    selectedLayerId,
  } = useMockup();

  const logoInputRef = useRef<HTMLInputElement>(null);
  const customProductInputRef = useRef<HTMLInputElement>(null);

  // Extract all valid images from product (handles System and SanMar shapes)
  const productImages = useMemo(() => {
    const fromProduct = extractProductImages(product);
    if (fromProduct.length > 0) return fromProduct;
    return [DEFAULT_GARMENT_SVG];
  }, [product]);

  // When product changes or loads, sync productViews and auto-select first image
  useEffect(() => {
    if (productImages.length > 0) {
      setProductViews(productImages);
      if (!canvasProductImage || !productImages.includes(canvasProductImage)) {
        setCanvasProductImage(productImages[0]);
        setActiveView(productImages[0]);
      }
    }
  }, [productImages, canvasProductImage, setCanvasProductImage, setActiveView, setProductViews]);

  // Handle uploading logo to place on product
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      addLayer("image", { src, w: 120, h: 120 });
      toast.success("Logo added to mockup! Drag & resize it on the canvas.");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Handle custom product image upload
  const handleCustomProductUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setCanvasProductImage(src);
      setActiveView(src);
      setProductViews([src, ...productViews]);
      toast.success("Custom product image loaded onto canvas!");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const isSanMar = Boolean(
    product && "isSanMar" in product && product.isSanMar,
  );

  return (
    <div className="w-full xl:w-80 shrink-0 flex flex-col gap-4 xl:overflow-y-auto">
      <CardContainer className="p-4 flex flex-col gap-4 bg-white border border-[#E6EBF2] rounded-xl shadow-sm">
        {/* Header / Product summary */}
        <div className="border-b border-gray-100 pb-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[#111827] text-base">Mockup Tools</h3>
            {onOpenProductModal && (
              <button
                type="button"
                onClick={onOpenProductModal}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
              >
                {product ? "Change Product" : "Select Product"}
              </button>
            )}
          </div>

          {product ? (
            <div className="bg-[#F8FAFC] p-2.5 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    isSanMar
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : "bg-blue-100 text-blue-800 border border-blue-200"
                  }`}
                >
                  {isSanMar ? "SanMar Catalog" : "System Product"}
                </span>
                <span className="text-[11px] text-gray-500 font-medium">
                  {"itemNo" in product && product.itemNo
                    ? `#${product.itemNo}`
                    : "style" in product && product.style
                      ? `Style: ${product.style}`
                      : ""}
                </span>
              </div>
              <p
                className="font-semibold text-xs text-[#111827] truncate"
                title={product.productName}
              >
                {product.productName}
              </p>
            </div>
          ) : (
            <div className="bg-[#F8FAFC] p-3 rounded-lg border border-dashed border-gray-300 text-center flex flex-col gap-2">
              <p className="text-xs text-gray-500">
                No product loaded from catalog
              </p>
              {onOpenProductModal && (
                <button
                  type="button"
                  onClick={onOpenProductModal}
                  className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Select SanMar / System Product
                </button>
              )}
            </div>
          )}
        </div>

        {/* Product Images (Small Version) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon size={14} className="text-blue-600" />
              Product Views
            </label>
            <span className="text-[11px] font-medium text-gray-400">
              {productImages.length} available
            </span>
          </div>

          {productImages.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {productImages.map((image, index) => {
                const isSelected =
                  canvasProductImage === image || activeView === image;
                const isEdited = (layersByView[image] || []).length > 0;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setCanvasProductImage(image);
                      setActiveView(image);
                    }}
                    className={`w-full aspect-square rounded-lg border p-1 bg-white hover:border-blue-400 transition-all flex items-center justify-center relative overflow-hidden group cursor-pointer ${
                      isSelected
                        ? "border-blue-600 ring-2 ring-blue-500/40 bg-blue-50/20"
                        : "border-gray-200 hover:shadow-xs"
                    }`}
                    title={`View ${index + 1}: Click to open on canvas`}
                  >
                    <img
                      src={image}
                      alt={`Product view ${index + 1}`}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 pointer-events-none"
                    />
                    {isSelected && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-white" />
                    )}
                    {isEdited && (
                      <span className="absolute bottom-1 left-1 px-1 py-0.5 text-[8px] font-bold bg-green-600 text-white rounded">
                        Edited
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-3 px-3 rounded-lg border border-dashed border-gray-200 text-center flex flex-col gap-2">
              <p className="text-xs text-gray-400">No images on this product</p>
              <button
                type="button"
                onClick={() => customProductInputRef.current?.click()}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1 cursor-pointer"
              >
                <Upload size={12} /> Upload Product Image
              </button>
            </div>
          )}

          <input
            ref={customProductInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleCustomProductUpload}
          />
        </div>

        {/* Upload Logo Section */}
        <div className="border-t border-gray-100 pt-3">
          <label className={inputClass.label}>Upload Logo</label>
          <div className="flex flex-col gap-2 mt-1">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                logoInputRef.current?.click();
              }}
              className="w-full flex items-center gap-2 justify-center h-10 border-2 border-dashed border-[#D1D5DC] hover:border-[#3B82F6] rounded-lg text-sm text-[#4B5563] hover:bg-gray-50 transition-all font-medium cursor-pointer"
            >
              <Upload className="w-4 h-4 text-[#6B7280]" />
              Upload Logo
            </button>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleLogoUpload}
            />

            <button
              type="button"
              onClick={() =>
                toast.info(
                  "Background removal is a premium feature connected to the API.",
                )
              }
              className="w-full flex items-center gap-2 justify-center h-9 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-xs text-purple-700 font-semibold transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Remove Background
            </button>
          </div>
        </div>

        {/* Scale Slider */}
        <div className="border-t border-gray-100 pt-3">
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
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3B82F6] disabled:opacity-40"
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
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3B82F6] disabled:opacity-40"
          />
        </div>

        {/* Bottom Actions */}
        <div className="flex gap-2 border-t border-gray-100 pt-3">
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
