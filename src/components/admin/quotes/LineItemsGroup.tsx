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
import { inputClass } from "@/pages/Login";
import { useGetProductsForAutoCompleteQuery } from "@/store/Product/productAPI";
import { ProductAutocompleteItem } from "@/store/Product/types/productTypes";
import { useGetSanmarProductsAutocompleteQuery } from "@/store/sanmar/sanmarApi";
import { SanmarProductAutocompleteItem } from "@/store/sanmar/types/sanmarTypes";

import {
  ProductType,
  setProductType,
  setSelectedProduct,
} from "@/store/imageSlice/imageSlice";
import { RootState } from "@/store/store";
import { Columns, Plus, Trash2, X } from "lucide-react";
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
                  ${calcTotal(rowItems, rowPrice, rowMarkup)}
                </span>

                {/* Mockup */}
                {columnVisibility.mockup !== false && (
                  <CommonButton
                    to={`../mockups/${selectedProduct?.productId!}`}
                    size="xs"
                    className="w-fit!"
                  >
                    Mockup
                  </CommonButton>
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
            onClick={() => setIsPriceMatrixOpen(true)}
          >
            <BsFillLightningChargeFill size={13} /> Imprint
          </CommonButton>
          <CommonButton
            onClick={onRefreshPricing}
            type="button"
            variant="secondary"
          >
            <TfiReload size={13} /> Refresh Pricing
          </CommonButton>
        </div>
      </div>

      {isPriceMatrixOpen && (
        <PriceMatrixModal setShowModal={setIsPriceMatrixOpen} />
      )}
    </div>
  );
};

export default LineItemsGroup;
