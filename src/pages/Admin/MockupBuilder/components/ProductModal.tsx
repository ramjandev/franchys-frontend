import { useDebounce } from "@/components/shared/useDebounce";
import { useGetProductsForAutoCompleteQuery } from "@/store/Product/productAPI";
import { ProductAutocompleteItem } from "@/store/Product/types/productTypes";
import { useGetSanmarProductsAutocompleteQuery } from "@/store/sanmar/sanmarApi";
import { SanmarProductAutocompleteItem } from "@/store/sanmar/types/sanmarTypes";
import { Loader2, Search, Upload, X } from "lucide-react";
import React, { useRef, useState } from "react";

export type ProductSourceType = "system" | "sanmar";

interface ProductModalProps {
  show: boolean;
  onClose: () => void;
  onSelectProduct: (productId: string, initialImage?: string) => void;
  onCustomImageUpload?: (imageUrl: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  show,
  onClose,
  onSelectProduct,
  onCustomImageUpload,
}) => {
  const [sourceType, setSourceType] = useState<ProductSourceType>("system");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: systemData, isFetching: isFetchingSystem } =
    useGetProductsForAutoCompleteQuery(
      { search: debouncedSearch || undefined },
      { skip: !show || sourceType !== "system" },
    );

  const { data: sanmarData, isFetching: isFetchingSanmar } =
    useGetSanmarProductsAutocompleteQuery(
      { search: debouncedSearch || undefined },
      { skip: !show || sourceType !== "sanmar" },
    );

  if (!show) return null;

  const isFetching =
    sourceType === "system" ? isFetchingSystem : isFetchingSanmar;

  const handleCustomFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      onCustomImageUpload?.(src);
      onClose();
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 flex flex-col gap-4 max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
          <div>
            <h4 className="font-bold text-lg text-gray-900">
              Select Product for Mockup
            </h4>
            <p className="text-xs text-gray-500">
              Choose a product from System or SanMar catalog to load its images
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Source Tabs & Custom Upload Button */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="inline-flex items-center p-1 bg-gray-100 rounded-lg border border-gray-200">
            <button
              type="button"
              onClick={() => setSourceType("system")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                sourceType === "system"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              System Products
            </button>
            <button
              type="button"
              onClick={() => setSourceType("sanmar")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                sourceType === "sanmar"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              SanMar Catalog
            </button>
          </div>

          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-gray-300 hover:border-blue-500 text-gray-700 hover:bg-blue-50/50 rounded-lg transition-colors cursor-pointer"
            >
              <Upload size={13} className="text-blue-600" />
              Upload Custom Image
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleCustomFileChange}
            />
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${sourceType === "system" ? "System" : "SanMar"} products by name, style, item #...`}
            className="w-full h-10 pl-9 pr-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:bg-white transition-colors"
          />
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto min-h-[260px] max-h-[380px] flex flex-col gap-2 pr-1">
          {isFetching ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
              <Loader2 size={24} className="animate-spin text-blue-600" />
              <span className="text-xs">Searching products...</span>
            </div>
          ) : sourceType === "system" ? (
            systemData?.data && systemData.data.length > 0 ? (
              systemData.data.map((item: ProductAutocompleteItem) => {
                const previewImg =
                  item.images && item.images.length > 0
                    ? item.images[0]
                    : undefined;
                return (
                  <button
                    type="button"
                    key={item.productId}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onSelectProduct(item.productId, previewImg);
                      onClose();
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/40 transition-all text-left group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gray-100 shrink-0 overflow-hidden flex items-center justify-center border border-gray-200">
                      {previewImg ? (
                        <img
                          src={previewImg}
                          alt={item.productName}
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <span className="text-[10px] text-gray-400 font-bold uppercase">
                          No Pic
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {item.productName || item.label}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                        {item.itemNo && <span>Item #: {item.itemNo}</span>}
                        {item.brandName && (
                          <span className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-[10px] font-medium">
                            {item.brandName}
                          </span>
                        )}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                    </div>
                    {item.price && (
                      <span className="text-xs font-bold text-blue-600 shrink-0">
                        ${Number(item.price).toFixed(2)}
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-gray-400 text-xs">
                No system products found. Try a different search term.
              </div>
            )
          ) : sanmarData?.data && sanmarData.data.length > 0 ? (
            sanmarData.data.map((item: SanmarProductAutocompleteItem) => {
              const previewImg =
                item.images && item.images.length > 0
                  ? item.images[0]
                  : undefined;
              return (
                <button
                  type="button"
                  key={item.productId || item.itemNo}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onSelectProduct(item.productId, previewImg);
                    onClose();
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/40 transition-all text-left group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-lg bg-gray-100 shrink-0 overflow-hidden flex items-center justify-center border border-gray-200">
                    {previewImg ? (
                      <img
                        src={previewImg}
                        alt={item.productName}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <span className="text-[10px] text-gray-400 font-bold uppercase">
                        No Pic
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                      {item.productName || item.label}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <span>Style: {item.style || item.itemNo}</span>
                      {item.brandName && (
                        <span className="bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded text-[10px] font-medium">
                          {item.brandName}
                        </span>
                      )}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                  </div>
                  {item.unitPrice || item.price ? (
                    <span className="text-xs font-bold text-blue-600 shrink-0">
                      ${Number(item.unitPrice ?? item.price).toFixed(2)}
                    </span>
                  ) : null}
                </button>
              );
            })
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-gray-400 text-xs">
              No SanMar products found. Try a different search term.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
