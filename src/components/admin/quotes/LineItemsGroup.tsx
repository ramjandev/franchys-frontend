import CommonButton from "@/components/shared/CommonButton";
import CommonSelect from "@/components/shared/CommonSelect";
import { useDebounce } from "@/components/shared/useDebounce";
import { TfiReload } from "react-icons/tfi";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { inputClass } from "@/pages/Login";
import { useGetProductsForAutoCompleteQuery } from "@/store/Product/productAPI";
import { ProductAutocompleteItem } from "@/store/Product/types/productTypes";
import { useGetPriceMatrixQuery } from "@/store/settings/PriceMatrices/priceMatrixAPI";
import { Plus, Trash2, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import {
  Control,
  Controller,
  useFieldArray,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import {
  buildGridTemplateColumns,
  buildTableHeaders,
  categoryOptions,
} from "./data";
import { makeDefaultLineItem, QuoteFormValues } from "./schema/quoteFormSchema";

interface LineItemsGroupProps {
  groupIndex: number;
  sizes: string[];
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
  control,
  register,
  watch,
  setValue,
  onRemoveGroup,
  canRemoveGroup,
  onRefreshPricing,
}) => {
  const tableHeaders = useMemo(() => buildTableHeaders(sizes), [sizes]);
  const gridTemplateColumns = useMemo(
    () => buildGridTemplateColumns(sizes),
    [sizes],
  );

  const { data: matrixData } = useGetPriceMatrixQuery();
  const priceMatrixOptions =
    matrixData?.data?.map((m) => ({
      label: m.name,
      value: m.priceMatrixId,
    })) ?? [];

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
  const debouncedSearch = useDebounce(search, 500);
  const { data: products } = useGetProductsForAutoCompleteQuery({
    search: debouncedSearch,
  });

  const [activeRow, setActiveRow] = useState<number | null>(null);
  const justSelectedRef = useRef(false);

  const openDropdown = (idx: number) => setActiveRow(idx);
  const closeDropdown = () => setActiveRow(null);

  const handleSelectProduct = (idx: number, item: ProductAutocompleteItem) => {
    justSelectedRef.current = true;

    setValue(`groups.${groupIndex}.lineItems.${idx}.itemNumber`, item.itemNo);
    setValue(`groups.${groupIndex}.lineItems.${idx}.color`, item.color ?? "");
    setValue(
      `groups.${groupIndex}.lineItems.${idx}.description`,
      item.productName,
    );
    setValue(
      `groups.${groupIndex}.lineItems.${idx}.price`,
      Number(item.unitPrice ?? item.price) || 0,
    );

    closeDropdown();
    setSearch("");

    setTimeout(() => {
      justSelectedRef.current = false;
    }, 0);
  };

  return (
    <div className="p-6 rounded-[10px] bg-[#F8FAFC] border border-[#CAD5E2] mb-6">
      <div className="flex items-center justify-between mb-5 gap-4">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <input
            type="text"
            {...register(`groups.${groupIndex}.name`)}
            className={`${inputClass.input} w-50!`}
          />

          <div className="flex flex-col md:flex-row md:items-center md:gap-2.5">
            <label className={inputClass.label}> Price Matrix:</label>
            <Controller
              control={control}
              name={`groups.${groupIndex}.priceMatrixId`}
              render={({ field }) => (
                <CommonSelect
                  item={priceMatrixOptions}
                  value={field.value}
                  placeholder="Select price matrix"
                  onValueChange={field.onChange}
                  w={200}
                />
              )}
            />
          </div>
        </div>

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

      <div className="overflow-x-auto">
        <div className="min-w-225">
          <div
            className="grid gap-1.5 pb-2 border-b border-[#CAD5E2] mb-2"
            style={{ gridTemplateColumns }}
          >
            {tableHeaders.map((h) => (
              <div key={h} className="text-[12px] font-bold text-slate-700">
                {h}
              </div>
            ))}
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

                <input
                  type="text"
                  {...register(
                    `groups.${groupIndex}.lineItems.${idx}.itemNumber`,
                  )}
                  className={inputClass.input}
                />
                <input
                  type="text"
                  {...register(`groups.${groupIndex}.lineItems.${idx}.color`)}
                  className={inputClass.input}
                />

                {/* Description + product search popover */}
                <Popover
                  open={activeRow === idx}
                  onOpenChange={(open) => {
                    if (!open) closeDropdown();
                  }}
                >
                  <PopoverTrigger asChild>
                    <input
                      type="text"
                      placeholder="Product description..."
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

                  {products?.data && products.data.length > 0 && (
                    <PopoverContent
                      align="start"
                      sideOffset={4}
                      className="w-105 max-h-80 overflow-y-auto p-1"
                      onOpenAutoFocus={(e) => e.preventDefault()}
                      onCloseAutoFocus={(e) => e.preventDefault()}
                    >
                      {products.data.map((item: ProductAutocompleteItem) => (
                        <button
                          key={item.productId}
                          type="button"
                          onClick={() => handleSelectProduct(idx, item)}
                          className="w-full text-left px-2 py-1.5 rounded-sm hover:bg-slate-100
                                     flex items-center justify-between gap-2"
                        >
                          <span className="text-[13px] text-slate-800">
                            {item.label}
                          </span>
                          {item.brandName && (
                            <span className="shrink-0 text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              {item.brandName}
                            </span>
                          )}
                        </button>
                      ))}
                    </PopoverContent>
                  )}
                </Popover>

                <Controller
                  control={control}
                  name={`groups.${groupIndex}.lineItems.${idx}.imprintType`}
                  render={({ field: imprintField }) => (
                    <CommonSelect
                      value={imprintField.value}
                      item={[
                        { label: "Embroidery", value: "Embroidery" },
                        { label: "Screen Print", value: "Screen Print" },
                        { label: "DTG", value: "DTG" },
                      ]}
                      className="w-full! sm:w-auto!"
                      placeholder="Select imprint"
                      onValueChange={imprintField.onChange}
                    />
                  )}
                />

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
                <input
                  type="number"
                  min={0}
                  {...register(`groups.${groupIndex}.lineItems.${idx}.markup`, {
                    valueAsNumber: true,
                  })}
                  className={inputClass.input}
                />
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[13px] pointer-events-none">
                    $
                  </span>
                  <input
                    type="number"
                    min={0}
                    {...register(
                      `groups.${groupIndex}.lineItems.${idx}.price`,
                      { valueAsNumber: true },
                    )}
                    className={`${inputClass.input} pl-5`}
                  />
                </div>

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

                <span className="text-[13px] font-semibold text-slate-800">
                  ${calcTotal(rowItems, rowPrice, rowMarkup)}
                </span>

                <CommonButton to="../mockups" size="xs" className="w-fit!">
                  Mockup
                </CommonButton>
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
          >
            <Plus size={13} /> Line Item
          </CommonButton>
          <CommonButton
            type="button"
            variant="destructive"
            onClick={() => {
              if (lineItemFields.length > 1) {
                removeLineItem(lineItemFields.length - 1);
              }
            }}
          >
            <Trash2 size={13} /> Line Item
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
    </div>
  );
};

export default LineItemsGroup;
