import CommonButton from "@/components/shared/CommonButton";
import CommonSelect from "@/components/shared/CommonSelect";
import { useDebounce } from "@/components/shared/useDebounce";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { TfiReload } from "react-icons/tfi";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { inputClass } from "@/pages/Login";
import { useGetProductsForAutoCompleteQuery } from "@/store/Product/productAPI";
import { ProductAutocompleteItem } from "@/store/Product/types/productTypes";
import { useGetSanmarProductsAutocompleteQuery } from "@/store/sanmar/sanmarApi";
import { SanmarProductAutocompleteItem } from "@/store/sanmar/types/sanmarTypes";

import MockupBuilderPage from "@/pages/Admin/MockupBuilder/MockupBuilderPage";
import {
  addLineItemMockups,
  ProductType,
  removeLineItemMockup,
  setActiveLineItemTarget,
  setProductType,
  setSelectedProduct,
} from "@/store/imageSlice/imageSlice";
import { useUploadMockupsMutation } from "@/store/quote/quoteAPI";
import { RootState } from "@/store/store";
import {
  Columns,
  Loader2,
  Palette,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import {
  Control,
  Controller,
  useFieldArray,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  buildGridTemplateColumns,
  buildTableHeaders,
  categoryOptions,
  defaultColumnVisibility,
  STANDARD_SIZE_PRESETS,
  TableColumnVisibility,
} from "./data";
import PriceMatrixModal from "./matrix/PriceMatrixModal";
import { makeDefaultLineItem, QuoteFormValues } from "./schema/quoteFormSchema";
import { useGetPriceMatrixQuery } from "@/store/settings/PriceMatrices/priceMatrixAPI";

interface LineItemsGroupProps {
  groupIndex: number;
  sizes: string[];
  onAddSize?: (size: string) => void;
  onRemoveSize?: (size: string) => void;
  control: Control<QuoteFormValues>;
  register: UseFormRegister<QuoteFormValues>;
  watch: UseFormWatch<QuoteFormValues>;
  setValue: UseFormSetValue<QuoteFormValues>;
  onRemoveGroup: () => void;
  canRemoveGroup: boolean;
  onRefreshPricing: () => void;
  isRefreshingPricing?: boolean;
}

const calcTotal = (items: number, price: number, markup: number) =>
  (items * price * (1 + markup / 100)).toFixed(2);

const distributeEvenly = (
  total: number,
  keys: string[],
): Record<string, number> => {
  const result: Record<string, number> = {};
  if (keys.length === 0) return result;

  const safeTotal = Number.isFinite(total) && total > 0 ? Math.floor(total) : 0;
  const base = Math.floor(safeTotal / keys.length);
  const remainder = safeTotal % keys.length;

  keys.forEach((key, i) => {
    result[key] = base + (i < remainder ? 1 : 0);
  });

  return result;
};

const LineItemsGroup: React.FC<LineItemsGroupProps> = ({
  groupIndex,
  sizes,
  onAddSize,
  onRemoveSize,
  control,
  register,
  watch,
  setValue,
  onRemoveGroup,
  canRemoveGroup,
  onRefreshPricing,
  isRefreshingPricing = false,
}) => {
  const [columnVisibility, setColumnVisibility] =
    useState<TableColumnVisibility>(defaultColumnVisibility);

  const tableHeaders = useMemo(
    () => buildTableHeaders(sizes, columnVisibility),
    [sizes, columnVisibility],
  );
  const gridTemplateColumns = useMemo(
    () => buildGridTemplateColumns(sizes, columnVisibility),
    [sizes, columnVisibility],
  );

  const {
    fields: lineItemFields,
    append: appendLineItem,
    remove: removeLineItem,
  } = useFieldArray({
    control,
    name: `groups.${groupIndex}.lineItems`,
  });

  const { data: matrixResponse } = useGetPriceMatrixQuery();
  const matrices = matrixResponse?.data ?? [];

  const watchedPriceMatrixId = watch(`groups.${groupIndex}.priceMatrixId`);
  const watchedPriceMatrixColumn = watch(
    `groups.${groupIndex}.priceMatrixColumn`,
  );
  const watchedImprintDetails = watch(`groups.${groupIndex}.imprintDetails`);
  const watchedImprints = watch(`groups.${groupIndex}.imprints`);

  const currentImprints = useMemo(() => {
    if (watchedImprints && watchedImprints.length > 0) {
      return watchedImprints;
    }
    if (watchedPriceMatrixId) {
      return [
        {
          matrixId: watchedPriceMatrixId,
          matrixColumn: watchedPriceMatrixColumn || "",
          details: watchedImprintDetails || "",
        },
      ];
    }
    return [];
  }, [
    watchedImprints,
    watchedPriceMatrixId,
    watchedPriceMatrixColumn,
    watchedImprintDetails,
  ]);

  const watchedLineItems = watch(`groups.${groupIndex}.lineItems`) || [];

  const hasSelectedImprint = useMemo(() => {
    const hasInImprints =
      currentImprints.length > 0 &&
      currentImprints.some(
        (imp) => Boolean(imp?.matrixId && String(imp.matrixId).trim() !== ""),
      );
    const hasGroupMatrix = Boolean(
      watchedPriceMatrixId && String(watchedPriceMatrixId).trim() !== "",
    );
    const hasLineItemMatrix = watchedLineItems.some(
      (li) => Boolean(li?.matrixId && String(li.matrixId).trim() !== ""),
    );

    return hasInImprints || hasGroupMatrix || hasLineItemMatrix;
  }, [currentImprints, watchedPriceMatrixId, watchedLineItems]);

  const handleDeleteImprint = (indexToDelete: number) => {
    const updated = currentImprints.filter((_, i) => i !== indexToDelete);
    setValue(`groups.${groupIndex}.imprints`, updated, { shouldDirty: true });
    const first = updated[0];
    if (first) {
      setValue(`groups.${groupIndex}.priceMatrixId`, first.matrixId, {
        shouldDirty: true,
      });
      setValue(
        `groups.${groupIndex}.priceMatrixColumn`,
        first.matrixColumn,
        { shouldDirty: true },
      );
      setValue(
        `groups.${groupIndex}.imprintDetails`,
        first.details || "",
        { shouldDirty: true },
      );
      lineItemFields.forEach((_, idx) => {
        setValue(
          `groups.${groupIndex}.lineItems.${idx}.matrixId`,
          first.matrixId,
          { shouldDirty: true },
        );
        setValue(
          `groups.${groupIndex}.lineItems.${idx}.matrixColumn`,
          first.matrixColumn,
          { shouldDirty: true },
        );
        if (first.details) {
          setValue(
            `groups.${groupIndex}.lineItems.${idx}.imprintType`,
            first.details,
            { shouldDirty: true },
          );
        }
      });
    } else {
      setValue(`groups.${groupIndex}.priceMatrixId`, "", {
        shouldDirty: true,
      });
      setValue(`groups.${groupIndex}.priceMatrixColumn`, "", {
        shouldDirty: true,
      });
      setValue(`groups.${groupIndex}.imprintDetails`, "", {
        shouldDirty: true,
      });
      lineItemFields.forEach((_, idx) => {
        setValue(`groups.${groupIndex}.lineItems.${idx}.matrixId`, "", {
          shouldDirty: true,
        });
        setValue(
          `groups.${groupIndex}.lineItems.${idx}.matrixColumn`,
          "",
          { shouldDirty: true },
        );
      });
    }
    toast.info("Imprint removed");
  };

  // --- product search / autocomplete popover state ---
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const productType = useSelector(
    (state: RootState) => state.image?.productType ?? "system",
  );
  const dispatch = useDispatch();

  const handleProductMatrix = (ProductType: ProductType) => {
    dispatch(setProductType(ProductType));
  };

  const { data: systemProducts } = useGetProductsForAutoCompleteQuery(
    { search: debouncedSearch },
    { skip: productType !== "system" || !debouncedSearch },
  );

  const { data: sanmarProducts } = useGetSanmarProductsAutocompleteQuery(
    { search: debouncedSearch },
    { skip: productType !== "sanmar" || !debouncedSearch },
  );
  const { selectedProduct } = useSelector((state: RootState) => state.image);
  const [uploadMockups] = useUploadMockupsMutation();
  const [uploadingRow, setUploadingRow] = useState<number | null>(null);
  const [previewMockupUrl, setPreviewMockupUrl] = useState<string | null>(null);
  const [mockupModalRowIndex, setMockupModalRowIndex] = useState<number | null>(
    null,
  );

  const handleUploadLineItemMockup = async (
    rowIdx: number,
    files: FileList | null,
  ) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);

    const oversized = fileArray.find((f) => f.size > 10 * 1024 * 1024);
    if (oversized) {
      toast.error("One or more files exceed 10MB limit.");
      return;
    }

    try {
      setUploadingRow(rowIdx);
      const res = await uploadMockups(fileArray).unwrap();
      const newUrls = res.data?.urls || [];

      if (newUrls.length > 0) {
        const key = `${groupIndex}-${rowIdx}`;
        dispatch(addLineItemMockups({ key, urls: newUrls }));

        const currentMockups =
          watch(`groups.${groupIndex}.lineItems.${rowIdx}.mockups`) || [];
        const merged = Array.from(new Set([...currentMockups, ...newUrls]));
        setValue(`groups.${groupIndex}.lineItems.${rowIdx}.mockups`, merged, {
          shouldValidate: true,
          shouldDirty: true,
        });

        toast.success(
          `${newUrls.length} mockup(s) uploaded to line item successfully!`,
        );
      }
    } catch (err) {
      console.error("Failed to upload mockups:", err);
      toast.error("Failed to upload mockup files.");
    } finally {
      setUploadingRow(null);
    }
  };

  const handleRemoveLineItemMockup = (rowIdx: number, urlToRemove: string) => {
    const key = `${groupIndex}-${rowIdx}`;
    dispatch(removeLineItemMockup({ key, url: urlToRemove }));

    const currentMockups =
      watch(`groups.${groupIndex}.lineItems.${rowIdx}.mockups`) || [];
    const filtered = currentMockups.filter((u) => u !== urlToRemove);
    setValue(`groups.${groupIndex}.lineItems.${rowIdx}.mockups`, filtered, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleOpenMockupBuilder = (rowIdx: number) => {
    const rowItemNumber = watch(
      `groups.${groupIndex}.lineItems.${rowIdx}.itemNumber`,
    );
    const rowDescription = watch(
      `groups.${groupIndex}.lineItems.${rowIdx}.description`,
    );
    const singleProductId =
      watch(`groups.${groupIndex}.lineItems.${rowIdx}.productId`) ||
      (selectedProduct as any)?.productId ||
      (selectedProduct as any)?.id ||
      (selectedProduct as any)?._id;

    if (!singleProductId || (!rowItemNumber && !rowDescription)) {
      toast.warning("Please select a product first to design a mockup.");
      return;
    }

    dispatch(
      setActiveLineItemTarget({
        groupIndex,
        lineItemIndex: rowIdx,
        itemNumber: rowItemNumber,
        productId: singleProductId,
      }),
    );
    setMockupModalRowIndex(rowIdx);
  };

  const handleMockupModalSave = (urls: string[]) => {
    if (mockupModalRowIndex !== null && urls.length > 0) {
      const key = `${groupIndex}-${mockupModalRowIndex}`;
      dispatch(addLineItemMockups({ key, urls }));

      const currentMockups =
        watch(
          `groups.${groupIndex}.lineItems.${mockupModalRowIndex}.mockups`,
        ) || [];
      const merged = Array.from(new Set([...currentMockups, ...urls]));
      setValue(
        `groups.${groupIndex}.lineItems.${mockupModalRowIndex}.mockups`,
        merged,
        {
          shouldValidate: true,
          shouldDirty: true,
        },
      );
      toast.success(
        `${urls.length} mockup(s) attached to line item! All quote details preserved.`,
      );
    }
    setMockupModalRowIndex(null);
  };

  const [activeRow, setActiveRow] = useState<number | null>(null);
  const justSelectedRef = useRef(false);

  const openDropdown = (idx: number) => setActiveRow(idx);
  const closeDropdown = () => setActiveRow(null);

  const handleSelectSystemProduct = (
    idx: number,
    item: ProductAutocompleteItem,
  ) => {
    dispatch(setSelectedProduct(item));
    justSelectedRef.current = true;
    const singleProdId =
      item.productId || (item as any).id || (item as any)._id;
    setValue(
      `groups.${groupIndex}.lineItems.${idx}.productId`,
      singleProdId,
      { shouldDirty: true },
    );
    setValue(`groups.${groupIndex}.lineItems.${idx}.itemNumber`, item.itemNo);
    setValue(`groups.${groupIndex}.lineItems.${idx}.color`, item.color ?? "");
    setValue(
      `groups.${groupIndex}.lineItems.${idx}.description`,
      item.productName,
    );
    const unitPrice = Number(item.unitPrice ?? item.price) || 0;
    setValue(`groups.${groupIndex}.lineItems.${idx}.price`, unitPrice);
    setValue(`groups.${groupIndex}.lineItems.${idx}.baseCost`, unitPrice);

    closeDropdown();
    setSearch("");

    setTimeout(() => {
      justSelectedRef.current = false;
    }, 0);
  };

  const handleSelectSanmarProduct = (
    idx: number,
    item: SanmarProductAutocompleteItem,
  ) => {
    dispatch(setSelectedProduct(item));
    justSelectedRef.current = true;
    const singleProdId =
      item.productId || (item as any).id || (item as any)._id;
    setValue(
      `groups.${groupIndex}.lineItems.${idx}.productId`,
      singleProdId,
      { shouldDirty: true },
    );
    setValue(
      `groups.${groupIndex}.lineItems.${idx}.itemNumber`,
      item.style || item.itemNo,
    );
    setValue(`groups.${groupIndex}.lineItems.${idx}.color`, item.color ?? "");
    setValue(
      `groups.${groupIndex}.lineItems.${idx}.description`,
      item.productName || item.label,
    );
    const unitPrice = Number(item.unitPrice ?? item.price) || 0;
    setValue(`groups.${groupIndex}.lineItems.${idx}.price`, unitPrice);
    setValue(`groups.${groupIndex}.lineItems.${idx}.baseCost`, unitPrice);

    // Auto-add available sizes from SanMar product to quote sizes if not present
    if (item.availableSizes && item.availableSizes.length > 0) {
      item.availableSizes.forEach((sz) => {
        if (sz && !sizes.includes(sz)) {
          onAddSize?.(sz);
        }
      });
    }

    closeDropdown();
    setSearch("");

    setTimeout(() => {
      justSelectedRef.current = false;
    }, 0);
  };

  // Add Size State
  const [customSizeInput, setCustomSizeInput] = useState("");
  const [isAddSizeOpen, setIsAddSizeOpen] = useState(false);

  const allPresetSizes = useMemo(
    () => Object.values(STANDARD_SIZE_PRESETS).flat(),
    [],
  );
  const customActiveSizes = useMemo(
    () => sizes.filter((s) => !allPresetSizes.includes(s)),
    [sizes, allPresetSizes],
  );

  const handleAddCustomSize = () => {
    const trimmed = customSizeInput.trim();
    if (!trimmed) return;
    onAddSize?.(trimmed);
    setCustomSizeInput("");
  };

  // Group summary calculations

  const [isPriceMatrixOpen, setIsPriceMatrixOpen] = useState(false);

  return (
    <div className="p-6 rounded-[10px] bg-[#F8FAFC] border border-[#CAD5E2] mb-6 shadow-xs">
      {/* Group Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-5 gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1 items-start sm:items-center">
          <input
            type="text"
            {...register(`groups.${groupIndex}.name`)}
            className={`${inputClass.input} w-48! font-semibold text-slate-800`}
            placeholder="Group Name"
          />
        </div>

        {/* Group Totals & Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Product Type Tabs */}
          <div className="inline-flex items-center p-1 bg-[#F1F5F9] rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => handleProductMatrix("system")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                productType === "system"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              System Products
            </button>
            <button
              type="button"
              onClick={() => handleProductMatrix("sanmar")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                productType === "sanmar"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              SanMar Catalog
            </button>
          </div>
          <Popover open={isAddSizeOpen} onOpenChange={setIsAddSizeOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 hover:border-blue-500 rounded-lg text-slate-700 hover:bg-blue-50/50 transition cursor-pointer"
              >
                <Plus size={13} className="text-blue-600" /> Add Size
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-84 p-3" align="end">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-800">
                    Toggle Size Columns
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Click to add or remove
                  </span>
                </div>

                {Object.entries(STANDARD_SIZE_PRESETS).map(
                  ([category, catSizes]) => (
                    <div key={category} className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {category}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {catSizes.map((s) => {
                          const alreadyActive = sizes.includes(s);
                          return (
                            <button
                              key={s}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (alreadyActive) {
                                  onRemoveSize?.(s);
                                } else {
                                  onAddSize?.(s);
                                }
                              }}
                              title={
                                alreadyActive
                                  ? `Click to remove ${s}`
                                  : `Click to add ${s}`
                              }
                              className={`px-2.5 py-0.5 text-xs rounded border transition cursor-pointer font-medium ${
                                alreadyActive
                                  ? "bg-blue-600 text-white border-blue-600 shadow-xs hover:bg-red-500 hover:border-red-500 hover:text-white"
                                  : "bg-white text-slate-700 border-slate-300 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700"
                              }`}
                            >
                              {s} {alreadyActive ? "✓" : ""}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ),
                )}

                {customActiveSizes.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Active Custom Sizes
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {customActiveSizes.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveSize?.(s);
                          }}
                          title={`Click to remove ${s}`}
                          className="px-2.5 py-0.5 text-xs rounded border transition cursor-pointer font-medium bg-blue-600 text-white border-blue-600 shadow-xs hover:bg-red-500 hover:border-red-500 hover:text-white"
                        >
                          {s} ✓
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Add Custom Size
                  </span>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="e.g. OSFA, 40x32"
                      value={customSizeInput}
                      onChange={(e) => setCustomSizeInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddCustomSize();
                        }
                      }}
                      className="text-xs px-2.5 py-1 rounded border border-slate-300 flex-1 outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddCustomSize();
                      }}
                      className="px-3 py-1 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Footer with Done button */}
                <div className="pt-2 border-t border-slate-200 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsAddSizeOpen(false)}
                    className="px-3 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer transition"
                  >
                    Done
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 hover:border-slate-400 rounded-lg text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                title="Manage table columns"
              >
                <Columns size={13} className="text-slate-500" /> Columns
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-52 p-3" align="end">
              <div className="space-y-2">
                <div className="pb-1.5 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-800">
                    Visible Columns
                  </span>
                </div>
                <div className="space-y-1.5">
                  {[
                    { key: "category", label: "Category" },
                    { key: "itemNumber", label: "Item #" },
                    { key: "color", label: "Color" },
                    { key: "markup", label: "Markup %" },
                    { key: "taxed", label: "Taxed" },
                    { key: "mockup", label: "Mockup" },
                  ].map((col) => (
                    <label
                      key={col.key}
                      className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none hover:text-slate-900"
                    >
                      <input
                        type="checkbox"
                        checked={
                          columnVisibility[
                            col.key as keyof TableColumnVisibility
                          ] !== false
                        }
                        onChange={(e) =>
                          setColumnVisibility((prev) => ({
                            ...prev,
                            [col.key]: e.target.checked,
                          }))
                        }
                        className="w-3.5 h-3.5 accent-blue-600 rounded cursor-pointer"
                      />
                      <span>{col.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {canRemoveGroup && (
            <button
              type="button"
              onClick={onRemoveGroup}
              className="p-2 text-[#E7000B] hover:bg-red-50 rounded-lg cursor-pointer transition-colors shrink-0"
              title="Remove group"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Table with Dynamic Columns */}
      <div className="overflow-x-auto">
        <div className="min-w-225">
          <div
            className="grid gap-1.5 pb-2 border-b border-[#CAD5E2] mb-2 items-center"
            style={{ gridTemplateColumns }}
          >
            {tableHeaders.map((h) => {
              const isSizeCol = sizes.includes(h);
              return (
                <div
                  key={h}
                  className="text-[12px] font-bold text-slate-700 flex items-center justify-between group relative"
                >
                  <span className="truncate">{h}</span>
                  {isSizeCol && (
                    <button
                      type="button"
                      onClick={() => onRemoveSize?.(h)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 cursor-pointer p-0.5"
                      title={`Remove size ${h}`}
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {lineItemFields.map((field, idx) => {
            const rowItems = watch(
              `groups.${groupIndex}.lineItems.${idx}.items`,
            );
            const rowPrice = watch(
              `groups.${groupIndex}.lineItems.${idx}.price`,
            );
            const rowMarkup = watch(
              `groups.${groupIndex}.lineItems.${idx}.markup`,
            );
            const rowDescription = watch(
              `groups.${groupIndex}.lineItems.${idx}.description`,
            );
            const rowSizes = watch(
              `groups.${groupIndex}.lineItems.${idx}.sizes`,
            );
            const rowTotal = watch(
              `groups.${groupIndex}.lineItems.${idx}.total`,
            );

            return (
              <div
                key={field.id}
                className="grid gap-1.5 mb-2 items-center"
                style={{ gridTemplateColumns }}
              >
                {/* Category */}
                {columnVisibility.category !== false && (
                  <Controller
                    control={control}
                    name={`groups.${groupIndex}.lineItems.${idx}.category`}
                    render={({ field: catField }) => (
                      <CommonSelect
                        item={categoryOptions}
                        value={catField.value}
                        onValueChange={catField.onChange}
                        placeholder="Select"
                        className="w-full! sm:w-auto!"
                      />
                    )}
                  />
                )}

                {/* Item # */}
                {columnVisibility.itemNumber !== false && (
                  <input
                    type="text"
                    {...register(
                      `groups.${groupIndex}.lineItems.${idx}.itemNumber`,
                    )}
                    className={inputClass.input}
                    placeholder="Item #"
                  />
                )}

                {/* Color */}
                {columnVisibility.color !== false && (
                  <input
                    type="text"
                    {...register(`groups.${groupIndex}.lineItems.${idx}.color`)}
                    className={inputClass.input}
                    placeholder="Color"
                  />
                )}

                {/* Description + product search popover (System vs SanMar) */}
                <Popover
                  open={activeRow === idx}
                  onOpenChange={(open) => {
                    if (!open) closeDropdown();
                  }}
                >
                  <PopoverTrigger asChild>
                    <input
                      type="text"
                      placeholder="Product description (search catalog)..."
                      value={rowDescription}
                      onFocus={() => {
                        if (justSelectedRef.current) return;
                        openDropdown(idx);
                        setSearch(rowDescription);
                      }}
                      onChange={(e) => {
                        setValue(
                          `groups.${groupIndex}.lineItems.${idx}.description`,
                          e.target.value,
                        );
                        setSearch(e.target.value);
                        openDropdown(idx);
                      }}
                      className={inputClass.input}
                    />
                  </PopoverTrigger>

                  <PopoverContent
                    align="start"
                    sideOffset={4}
                    className="w-115 max-h-85 overflow-hidden p-0 flex flex-col shadow-lg border-slate-200"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onCloseAutoFocus={(e) => e.preventDefault()}
                  >
                    {/* Results list */}
                    <div className="overflow-y-auto max-h-72 p-1">
                      {productType === "system" ? (
                        systemProducts?.data &&
                        systemProducts.data.length > 0 ? (
                          systemProducts.data.map(
                            (item: ProductAutocompleteItem) => (
                              <button
                                key={item.productId}
                                type="button"
                                onClick={() =>
                                  handleSelectSystemProduct(idx, item)
                                }
                                className="w-full text-left px-2.5 py-2 rounded hover:bg-slate-100 flex items-center justify-between gap-2 border-b border-slate-50 last:border-0 cursor-pointer"
                              >
                                <div className="flex flex-col min-w-0">
                                  <span className="text-[13px] text-slate-800 font-medium truncate">
                                    {item.label}
                                  </span>
                                  <span className="text-[11px] text-slate-500">
                                    Item #: {item.itemNo}
                                    {item.color
                                      ? ` · Color: ${item.color}`
                                      : ""}
                                  </span>
                                </div>
                                <div className="text-right shrink-0">
                                  <span className="text-xs font-bold text-blue-600 block">
                                    $
                                    {Number(
                                      item.unitPrice ?? item.price,
                                    ).toFixed(2)}
                                  </span>
                                  {item.brandName && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                      {item.brandName}
                                    </span>
                                  )}
                                </div>
                              </button>
                            ),
                          )
                        ) : (
                          <div className="py-4 text-center text-xs text-slate-400">
                            {debouncedSearch
                              ? "No system products found"
                              : "Type to search system catalog..."}
                          </div>
                        )
                      ) : sanmarProducts?.data &&
                        sanmarProducts.data.length > 0 ? (
                        sanmarProducts.data.map(
                          (item: SanmarProductAutocompleteItem) => (
                            <button
                              key={item.productId || item.itemNo}
                              type="button"
                              onClick={() =>
                                handleSelectSanmarProduct(idx, item)
                              }
                              className="w-full text-left px-2.5 py-2 rounded hover:bg-slate-100 flex items-center justify-between gap-2 border-b border-slate-50 last:border-0 cursor-pointer"
                            >
                              <div className="flex flex-col min-w-0">
                                <span className="text-[13px] text-slate-800 font-medium truncate">
                                  {item.productName || item.label}
                                </span>
                                <span className="text-[11px] text-slate-500">
                                  Style: {item.style || item.itemNo}
                                  {item.color ? ` · Color: ${item.color}` : ""}
                                  {item.availableSizes &&
                                    item.availableSizes.length > 0 &&
                                    ` · Sizes: ${item.availableSizes.join(", ")}`}
                                </span>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-xs font-bold text-blue-600 block">
                                  $
                                  {Number(item.unitPrice ?? item.price).toFixed(
                                    2,
                                  )}
                                </span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                                  SanMar
                                </span>
                              </div>
                            </button>
                          ),
                        )
                      ) : (
                        <div className="py-4 text-center text-xs text-slate-400">
                          {debouncedSearch
                            ? "No SanMar products found"
                            : "Type to search SanMar catalog..."}
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Dynamic size columns */}
                {sizes.map((sizeKey) => (
                  <input
                    key={sizeKey}
                    type="number"
                    min={0}
                    value={rowSizes?.[sizeKey] ?? 0}
                    onChange={(e) => {
                      const newValue = Number(e.target.value) || 0;
                      const updatedSizes = {
                        ...rowSizes,
                        [sizeKey]: newValue,
                      };
                      setValue(
                        `groups.${groupIndex}.lineItems.${idx}.sizes.${sizeKey}`,
                        newValue,
                      );

                      const newTotal = Object.values(updatedSizes).reduce(
                        (sum, v) => sum + (Number(v) || 0),
                        0,
                      );
                      setValue(
                        `groups.${groupIndex}.lineItems.${idx}.items`,
                        newTotal,
                        { shouldValidate: true },
                      );
                    }}
                    className={inputClass.input}
                  />
                ))}

                {/* Items */}
                <input
                  type="number"
                  min={0}
                  value={Number.isFinite(rowItems) ? rowItems : 0}
                  onChange={(e) => {
                    const newItems = Number(e.target.value) || 0;
                    setValue(
                      `groups.${groupIndex}.lineItems.${idx}.items`,
                      newItems,
                      { shouldValidate: true },
                    );

                    if (sizes.length > 0) {
                      setValue(
                        `groups.${groupIndex}.lineItems.${idx}.sizes`,
                        distributeEvenly(newItems, sizes),
                        { shouldValidate: true },
                      );
                    }
                  }}
                  className={inputClass.input}
                />

                {/* Markup % */}
                {columnVisibility.markup !== false && (
                  <input
                    type="number"
                    min={0}
                    {...register(
                      `groups.${groupIndex}.lineItems.${idx}.markup`,
                      {
                        valueAsNumber: true,
                      },
                    )}
                    className={inputClass.input}
                  />
                )}

                {/* Price */}
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[13px] pointer-events-none">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    {...register(
                      `groups.${groupIndex}.lineItems.${idx}.price`,
                      { valueAsNumber: true },
                    )}
                    className={`${inputClass.input} pl-5`}
                  />
                </div>

                {/* Taxed */}
                {columnVisibility.taxed !== false && (
                  <div className="flex justify-center">
                    <Controller
                      control={control}
                      name={`groups.${groupIndex}.lineItems.${idx}.taxed`}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          checked={!!field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="w-4 h-4 accent-blue-600 cursor-pointer"
                        />
                      )}
                    />
                  </div>
                )}

                {/* Total */}
                <span className="text-[13px] font-semibold text-slate-800">
                  $
                  {rowTotal !== undefined && rowTotal !== null && rowTotal > 0
                    ? Number(rowTotal).toFixed(2)
                    : calcTotal(rowItems, rowPrice, rowMarkup)}
                </span>

                {/* Mockup */}
                {columnVisibility.mockup !== false && (
                  <div className="flex items-center gap-1.5 flex-wrap min-w-[120px]">
                    {/* Render saved mockup thumbnails */}
                    {(() => {
                      const rowMockups: string[] =
                        watch(
                          `groups.${groupIndex}.lineItems.${idx}.mockups`,
                        ) || [];
                      return (
                        <>
                          {rowMockups.map((url, mIdx) => (
                            <div
                              key={mIdx}
                              className="relative group/mockup w-8 h-8 rounded border border-slate-200 overflow-hidden bg-slate-50 shrink-0 cursor-pointer shadow-2xs"
                              onClick={() => setPreviewMockupUrl(url)}
                              title="Click to view full preview"
                            >
                              <img
                                src={url}
                                alt={`Mockup ${mIdx + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveLineItemMockup(idx, url);
                                }}
                                className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover/mockup:opacity-100 transition-opacity hover:bg-red-700 shadow-xs cursor-pointer z-10"
                                title="Remove mockup"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ))}

                          {/* Loading spinner while uploading */}
                          {uploadingRow === idx && (
                            <div
                              className="w-8 h-8 rounded border border-blue-200 bg-blue-50/60 flex items-center justify-center shrink-0"
                              title="Uploading mockup..."
                            >
                              <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                            </div>
                          )}

                          {/* Action Buttons: Direct Upload & Mockup Builder */}
                          <div className="flex items-center gap-1 shrink-0">
                            {/* Hidden file input for direct upload */}
                            <label
                              htmlFor={`mockup-upload-${groupIndex}-${idx}`}
                              className="p-1.5 rounded-md border border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition cursor-pointer flex items-center justify-center"
                              title="Upload mockup image directly"
                            >
                              <Upload size={13} />
                              <input
                                id={`mockup-upload-${groupIndex}-${idx}`}
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                disabled={uploadingRow === idx}
                                onChange={(e) => {
                                  handleUploadLineItemMockup(
                                    idx,
                                    e.target.files,
                                  );
                                  e.target.value = "";
                                }}
                              />
                            </label>

                            {/* Open Mockup Builder (clickable only when single product is selected) */}
                            {(() => {
                              const rowItemNo = watch(
                                `groups.${groupIndex}.lineItems.${idx}.itemNumber`,
                              );
                              const rowDesc = watch(
                                `groups.${groupIndex}.lineItems.${idx}.description`,
                              );
                              const rowProdId =
                                watch(
                                  `groups.${groupIndex}.lineItems.${idx}.productId`,
                                ) ||
                                (selectedProduct as any)?.productId ||
                                (selectedProduct as any)?.id ||
                                (selectedProduct as any)?._id;
                              const isProductSelected = Boolean(
                                rowProdId && (rowItemNo || rowDesc),
                              );

                              return (
                                <button
                                  type="button"
                                  disabled={!isProductSelected}
                                  onClick={() => handleOpenMockupBuilder(idx)}
                                  className={`p-1.5 rounded-md border transition flex items-center justify-center ${
                                    isProductSelected
                                      ? "border-slate-200 text-slate-500 hover:text-purple-600 hover:bg-purple-50 hover:border-purple-300 cursor-pointer"
                                      : "border-slate-200/60 text-slate-300 opacity-40 cursor-not-allowed bg-slate-50"
                                  }`}
                                  title={
                                    isProductSelected
                                      ? "Design mockup in Mockup Builder"
                                      : "Please select a product first"
                                  }
                                >
                                  <Palette size={13} />
                                </button>
                              );
                            })()}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* Delete Row Action */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (lineItemFields.length > 1) {
                        removeLineItem(idx);
                      }
                    }}
                    disabled={lineItemFields.length <= 1}
                    className={`p-1.5 rounded-md transition flex items-center justify-center ${
                      lineItemFields.length > 1
                        ? "text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                        : "text-slate-200 cursor-not-allowed"
                    }`}
                    title={
                      lineItemFields.length > 1
                        ? "Delete this line item"
                        : "Group must have at least one line item"
                    }
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Imprint Cards (Printavo reference style) */}
      {currentImprints.length > 0 && (
        <div className="mt-4 space-y-3">
          {currentImprints.map((imp, idx) => {
            const mat = matrices.find((m) => m.priceMatrixId === imp.matrixId);
            const matName = mat?.name || imp.matrixId || "Matrix";
            const colName = imp.matrixColumn || "";

            return (
              <div
                key={idx}
                className="rounded-lg bg-[#F8FAFC] border border-slate-200/90 p-4"
              >
                <div className="flex items-center gap-3 text-sm flex-wrap">
                  <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">
                    IMPRINT {idx + 1}
                  </span>
                  <span className="font-semibold text-slate-800">
                    {matName} {colName ? `• ${colName}` : ""}
                  </span>
                  {imp.details && (
                    <span className="text-xs text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {imp.details}
                    </span>
                  )}
                </div>

                <hr className="border-slate-200/80 my-3" />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsPriceMatrixOpen(true);
                    }}
                    className="px-3 py-1 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteImprint(idx);
                    }}
                    className="px-2 py-1 text-xs font-medium text-slate-500 hover:text-red-600 transition cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-5 flex-wrap gap-3">
        <div className="flex gap-2.5">
          <CommonButton
            type="button"
            onClick={() => appendLineItem(makeDefaultLineItem(sizes))}
            variant="secondary"
          >
            <Plus size={13} /> Line Item
          </CommonButton>
          <CommonButton
            type="button"
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsPriceMatrixOpen(true);
            }}
          >
            <BsFillLightningChargeFill size={13} /> Imprint
          </CommonButton>
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className={
                    !hasSelectedImprint
                      ? "inline-flex cursor-not-allowed"
                      : "inline-flex"
                  }
                  title={
                    !hasSelectedImprint
                      ? "Add a pricing matrix to an imprint to enable quantity-based pricing"
                      : undefined
                  }
                >
                  <CommonButton
                    onClick={onRefreshPricing}
                    type="button"
                    variant="secondary"
                    disabled={!hasSelectedImprint || isRefreshingPricing}
                    isLoading={isRefreshingPricing}
                    loadingText="Refreshing..."
                  >
                    <TfiReload size={13} /> Refresh Pricing
                  </CommonButton>
                </span>
              </TooltipTrigger>
              {!hasSelectedImprint && (
                <TooltipContent
                  side="top"
                  className="bg-slate-900 text-white text-xs px-3 py-1.5 rounded-md shadow-lg border border-slate-700 max-w-xs text-center z-50"
                >
                  Add a pricing matrix to an imprint to enable quantity-based pricing
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {isPriceMatrixOpen && (
        <PriceMatrixModal
          setShowModal={setIsPriceMatrixOpen}
          initialImprints={currentImprints}
          onSave={(imprints) => {
            setValue(`groups.${groupIndex}.imprints`, imprints, {
              shouldDirty: true,
            });
            const first = imprints[0];
            if (first) {
              setValue(`groups.${groupIndex}.priceMatrixId`, first.matrixId, {
                shouldDirty: true,
              });
              setValue(
                `groups.${groupIndex}.priceMatrixColumn`,
                first.matrixColumn,
                { shouldDirty: true },
              );
              setValue(
                `groups.${groupIndex}.imprintDetails`,
                first.details || "",
                { shouldDirty: true },
              );
              lineItemFields.forEach((_, idx) => {
                setValue(
                  `groups.${groupIndex}.lineItems.${idx}.matrixId`,
                  first.matrixId,
                  { shouldDirty: true },
                );
                setValue(
                  `groups.${groupIndex}.lineItems.${idx}.matrixColumn`,
                  first.matrixColumn,
                  { shouldDirty: true },
                );
                if (first.details) {
                  setValue(
                    `groups.${groupIndex}.lineItems.${idx}.imprintType`,
                    first.details,
                    { shouldDirty: true },
                  );
                }
              });
              toast.success("Pricing matrix & column applied to group!");
            } else {
              setValue(`groups.${groupIndex}.priceMatrixId`, "", {
                shouldDirty: true,
              });
              setValue(`groups.${groupIndex}.priceMatrixColumn`, "", {
                shouldDirty: true,
              });
              setValue(`groups.${groupIndex}.imprintDetails`, "", {
                shouldDirty: true,
              });
              lineItemFields.forEach((_, idx) => {
                setValue(`groups.${groupIndex}.lineItems.${idx}.matrixId`, "", {
                  shouldDirty: true,
                });
                setValue(
                  `groups.${groupIndex}.lineItems.${idx}.matrixColumn`,
                  "",
                  { shouldDirty: true },
                );
              });
              toast.info("Imprint removed");
            }
          }}
        />
      )}

      {/* Mockup Full-Size Preview Modal */}
      {previewMockupUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewMockupUrl(null)}
        >
          <div
            className="relative max-w-3xl max-h-[85vh] bg-white rounded-xl shadow-2xl p-4 overflow-hidden flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <span className="text-sm font-semibold text-slate-800">
                Mockup Preview
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={previewMockupUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  Open Original
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewMockupUrl(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto flex items-center justify-center max-h-[70vh]">
              <img
                src={previewMockupUrl}
                alt="Mockup Preview"
                className="max-w-full max-h-full object-contain rounded-lg shadow-inner"
              />
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Mockup Tools Modal */}
      {mockupModalRowIndex !== null && (
        <MockupBuilderPage
          isModal={true}
          productIdOverride={
            (selectedProduct as any)?.productId ||
            (selectedProduct as any)?.id ||
            (selectedProduct as any)?._id ||
            watch(
              `groups.${groupIndex}.lineItems.${mockupModalRowIndex}.productId`,
            )
          }
          onClose={() => setMockupModalRowIndex(null)}
          onSaveSuccess={handleMockupModalSave}
        />
      )}
    </div>
  );
};

export default LineItemsGroup;
