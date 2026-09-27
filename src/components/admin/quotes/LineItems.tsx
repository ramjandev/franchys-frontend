import CardContainer from "@/components/shared/CardContainer";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import CommonSelect from "@/components/shared/CommonSelect";
import { useDebounce } from "@/components/shared/useDebounce";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { inputClass } from "@/pages/Login";
import { useGetProductsForAutoCompleteQuery } from "@/store/Product/productAPI";
import { ProductAutocompleteItem } from "@/store/Product/types/productTypes";
import { useGetSelectedSizesQuery } from "@/store/settings/customLineItems/lineItemCustomizationAPI";
import {
  useGetPriceMatrixQuery
} from "@/store/settings/PriceMatrices/priceMatrixAPI";
import { Image, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildGridTemplateColumns,
  buildTableHeaders,
  categoryOptions,
} from "./data";

interface Row {
  category: string;
  itemNo: string;
  color: string;
  description: string;
  imprint: string;
  sizes: Record<string, number>; // dynamic — keyed by whatever size labels the backend returns
  items: number;
  markup: number;
  price: number;
  taxed: boolean;
}

const makeDefaultRow = (sizeKeys: string[]): Row => ({
  category: "",
  itemNo: "",
  color: "",
  description: "",
  imprint: "",
  sizes: Object.fromEntries(sizeKeys.map((s) => [s, 0])),
  items: 0,
  markup: 0,
  price: 0,
  taxed: false,
});

const calcTotal = (row: Row) => {
  const items = Number(row.items) || 0;
  const price = Number(row.price) || 0;
  const markup = Number(row.markup) || 0;
  return (items * price * (1 + markup / 100)).toFixed(2);
};

const decodeHtmlEntities = (str?: string) => {
  if (!str) return "";
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
};

const getProductImage = (item: ProductAutocompleteItem) => {
  if (item.images && Array.isArray(item.images) && item.images.length > 0) {
    const first = item.images[0];
    if (typeof first === "string" && first.trim()) return first;
  }
  const anyItem = item as any;
  if (anyItem.primaryImageUrl && typeof anyItem.primaryImageUrl === "string") {
    return anyItem.primaryImageUrl;
  }
  if (anyItem.thumbnail && typeof anyItem.thumbnail === "string") {
    return anyItem.thumbnail;
  }
  if (anyItem.image && typeof anyItem.image === "string") {
    return anyItem.image;
  }
  return null;
};

const ProductThumbnail: React.FC<{
  src?: string | null;
  alt: string;
}> = ({ src, alt }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || hasError) {
    return (
      <div className="w-10 h-10 rounded-md bg-slate-100 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center text-slate-400">
        <Image size={18} className="text-slate-400" />
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-md bg-white border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center p-0.5">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain"
        onError={() => setHasError(true)}
        loading="lazy"
      />
    </div>
  );
};

const LineItems = () => {
  const { data: sizesData } = useGetSelectedSizesQuery();
  const sizes = sizesData?.data ?? [];

  const tableHeaders = useMemo(() => buildTableHeaders(sizes), [sizes]);
  const gridTemplateColumns = useMemo(
    () => buildGridTemplateColumns(sizes),
    [sizes],
  );

  const [priceMatrixId, setPriceMatrixId] = useState("");
  const { data } = useGetPriceMatrixQuery();
  const priceMatrixOptions =
    data?.data?.map((m) => ({
      label: m.name,
      value: m.priceMatrixId,
    })) ?? [];

  // const { data: priceMatrixData } = useGetPriceMatrixByIdQuery(priceMatrixId, {
  //   skip: !priceMatrixId,
  //   refetchOnMountOrArgChange: true,
  // });

  const [groupName, setGroupName] = useState("Group 1");
  const [rows, setRows] = useState<Row[]>([makeDefaultRow(sizes)]);

  // if sizes load AFTER the initial empty row was created, backfill any
  // missing size keys on existing rows so inputs don't break
  useMemo(() => {
    if (sizes.length === 0) return;
    setRows((prev) =>
      prev.map((row) => {
        const merged = { ...row.sizes };
        sizes.forEach((s) => {
          if (!(s in merged)) merged[s] = 0;
        });
        return { ...row, sizes: merged };
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sizes.join(",")]);

  const updateRow = (
    idx: number,
    field: keyof Omit<Row, "sizes">,
    value: string | number | boolean,
  ) => {
    setRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r)),
    );
  };

  const updateRowSize = (idx: number, sizeKey: string, value: number) => {
    setRows((prev) =>
      prev.map((r, i) =>
        i === idx ? { ...r, sizes: { ...r.sizes, [sizeKey]: value } } : r,
      ),
    );
  };

  // --- Product search / autocomplete popover state ---
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const { data: products } = useGetProductsForAutoCompleteQuery({
    search: debouncedSearch,
  });

  // which row's popover is currently open (null = none)
  const [activeRow, setActiveRow] = useState<number | null>(null);
  // guards against onFocus re-opening the popover right after a selection
  const justSelectedRef = useRef(false);

  const openDropdown = (idx: number) => setActiveRow(idx);
  const closeDropdown = () => setActiveRow(null);

  const handleSelectProduct = (idx: number, item: ProductAutocompleteItem) => {
    justSelectedRef.current = true;

    setRows((prev) =>
      prev.map((r, i) => {
        if (i !== idx) return r;

        return {
          ...r,
          itemNo: item.itemNo,
          color: item.color ?? "",
          description: decodeHtmlEntities(item.productName || item.label),
          price: Number(item.unitPrice ?? item.price) || 0,
        };
      }),
    );
    closeDropdown();
    setSearch("");

    // release the guard on the next tick, after the focus event has passed
    setTimeout(() => {
      justSelectedRef.current = false;
    }, 0);
  };

  return (
    <CardContainer size="lg" className="">
      <div className="flex items-center justify-between mb-6">
        <CommonHeader size="lg">Line Items</CommonHeader>

        <CommonButton variant="primaryBlue">
          <Plus /> Add Group
        </CommonButton>
      </div>

      <div className="p-6 rounded-[10px] bg-[#F8FAFC] border border-[#CAD5E2]">
        <div className="flex flex-col md:flex-row  gap-4 mb-5">
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className={`${inputClass.input} w-50!`}
          />

          <div className="flex flex-col md:flex-row md:items-center  md:gap-2.5 ">
            <label className={inputClass.label}> Price Matrix:</label>
            <CommonSelect
              item={priceMatrixOptions}
              value={priceMatrixId}
              placeholder="Select price matrix"
              onValueChange={(value) => setPriceMatrixId(value)}
              w={200}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
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

            {/* Rows */}
            {rows.map((row, idx) => (
              <div
                key={idx}
                className="grid gap-1.5 mb-2 items-center"
                style={{ gridTemplateColumns }}
              >
                <CommonSelect
                  item={categoryOptions}
                  value={row.category}
                  onValueChange={(e) => updateRow(idx, "category", e)}
                  placeholder="Select"
                  className="w-full! sm:w-auto!"
                />

                <input
                  type="text"
                  value={row.itemNo}
                  onChange={(e) => updateRow(idx, "itemNo", e.target.value)}
                  className={inputClass.input}
                />
                <input
                  type="text"
                  value={row.color}
                  onChange={(e) => updateRow(idx, "color", e.target.value)}
                  className={inputClass.input}
                />

                {/* Description + product search popover (shadcn) */}
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
                      value={row.description}
                      onFocus={() => {
                        if (justSelectedRef.current) return;
                        openDropdown(idx);
                        setSearch(row.description);
                      }}
                      onChange={(e) => {
                        updateRow(idx, "description", e.target.value);
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
                      className="w-[480px] max-w-[90vw] max-h-[320px] overflow-y-auto p-1"
                      onOpenAutoFocus={(e) => e.preventDefault()}
                      onCloseAutoFocus={(e) => e.preventDefault()}
                    >
                      {products.data.map((item: ProductAutocompleteItem) => {
                        const previewImg = getProductImage(item);
                        return (
                          <button
                            key={item.productId}
                            type="button"
                            onClick={() => handleSelectProduct(idx, item)}
                            className="w-full text-left px-2 py-1.5 rounded-sm hover:bg-slate-100
                                       flex items-center gap-3 border-b border-slate-50 last:border-0 cursor-pointer"
                          >
                            <ProductThumbnail
                              src={previewImg}
                              alt={item.label || item.productName}
                            />
                            <div className="flex flex-col min-w-0 flex-1">
                              <span className="text-[13px] text-slate-800 font-medium truncate">
                                {decodeHtmlEntities(item.label || item.productName)}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                Item #: {item.itemNo}
                                {item.color ? ` · Color: ${item.color}` : ""}
                              </span>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-xs font-bold text-blue-600 block">
                                ${Number(item.unitPrice ?? item.price).toFixed(2)}
                              </span>
                              {item.brandName && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                  {item.brandName}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </PopoverContent>
                  )}
                </Popover>

                <CommonSelect
                  value={row.imprint}
                  item={[
                    { label: "Embroidery", value: "embroidery" },
                    { label: "Screen Print", value: "screen" },
                    { label: "DTG", value: "dtg" },
                  ]}
                  className="w-full! sm:w-auto!"
                  placeholder="Select imprint"
                  onValueChange={(value) => updateRow(idx, "imprint", value)}
                />

                {/* Dynamic size columns — one input per selected size */}
                {sizes.map((sizeKey) => (
                  <input
                    key={sizeKey}
                    type="number"
                    min={0}
                    value={row.sizes[sizeKey] ?? 0}
                    onChange={(e) =>
                      updateRowSize(idx, sizeKey, Number(e.target.value))
                    }
                    className={inputClass.input}
                  />
                ))}

                <input
                  type="number"
                  min={0}
                  value={row.items}
                  onChange={(e) =>
                    updateRow(idx, "items", Number(e.target.value))
                  }
                  className={inputClass.input}
                />
                <input
                  type="number"
                  min={0}
                  value={row.markup}
                  onChange={(e) =>
                    updateRow(idx, "markup", Number(e.target.value))
                  }
                  className={inputClass.input}
                />
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[13px] pointer-events-none">
                    $
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={row.price}
                    onChange={(e) =>
                      updateRow(idx, "price", Number(e.target.value))
                    }
                    className={`${inputClass.input} pl-5`}
                  />
                </div>
                <div className="flex justify-center">
                  <input
                    type="checkbox"
                    checked={row.taxed}
                    onChange={(e) => updateRow(idx, "taxed", e.target.checked)}
                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                  />
                </div>
                <span className="text-[13px] font-semibold text-slate-800">
                  ${calcTotal(row)}
                </span>

                <CommonButton to="../mockups" size="xs" className="w-fit!">
                  <Image /> Mockup
                </CommonButton>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-5 flex-wrap gap-3">
          <div className="flex gap-2.5">
            <CommonButton
              onClick={() =>
                setRows((prev) => [...prev, makeDefaultRow(sizes)])
              }
            >
              <Plus size={13} /> Line Item
            </CommonButton>
            <CommonButton
              variant="destructive"
              onClick={() => setRows((prev) => prev.slice(0, -1))}
            >
              <Trash2 size={13} /> Line Item
            </CommonButton>
          </div>
        </div>
      </div>
    </CardContainer>
  );
};

export default LineItems;
