import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import CommonSelect, { SelectOption } from "@/components/shared/CommonSelect";
import { inputClass } from "@/pages/Login";
import {
  useCreatePriceTierMutation,
  useDeletePriceTierMutation,
  useGetPriceMatrixByIdQuery,
  useUpdatePriceMatrixMutation,
  useUpdatePriceTierMutation,
} from "@/store/settings/PriceMatrices/priceMatrixAPI";
import { ArrowLeft, Minus, Plus, Save, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export interface PricingTierRow {
  id: string | number;
  priceTierId?: string;
  quantity: string;
  markup: string;
  columnPrices: Record<string, string>;
}

type PriceType = "percentage" | "fixed";

const priceTypeOptions: readonly SelectOption<PriceType>[] = [
  { label: "Percentage", value: "percentage" },
  { label: "Fixed", value: "fixed" },
];

const PricingMatrixDetail = () => {
  const { id } = useParams();

  const { data, isLoading } = useGetPriceMatrixByIdQuery(id!, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  const [updatePriceMatrix] = useUpdatePriceMatrixMutation();
  const [deletePriceTier] = useDeletePriceTierMutation();
  const [createPriceTier] = useCreatePriceTierMutation();
  const [updatePriceTier] = useUpdatePriceTierMutation();

  const [name, setName] = useState("");
  const [priceType, setPriceType] = useState<PriceType | undefined>("fixed");
  const [columns, setColumns] = useState<string[]>(["Column 1", "Column 2"]);
  const [tiers, setTiers] = useState<PricingTierRow[]>([]);
  const [deletedTierIds, setDeletedTierIds] = useState<string[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  // Sync state with fetched matrix data
  useEffect(() => {
    if (data?.data) {
      setName(data.data.name ?? "");
      setPriceType((data.data.priceType as PriceType) ?? "fixed");
      const loadedCols =
        data.data.columns && data.data.columns.length > 0
          ? data.data.columns
          : ["Column 1", "Column 2"];
      setColumns(loadedCols);

      if (data.data.priceTiers && data.data.priceTiers.length > 0) {
        setTiers(
          data.data.priceTiers.map((t) => {
            const colPrices: Record<string, string> = {};
            loadedCols.forEach((col) => {
              const val = t.columnPrices?.[col];
              colPrices[col] =
                val !== undefined && val !== null ? String(val) : "";
            });
            return {
              id: t.priceTierId || Date.now() + Math.random(),
              priceTierId: t.priceTierId,
              quantity:
                t.quantity !== undefined && t.quantity !== null
                  ? String(t.quantity)
                  : "",
              markup:
                t.markup !== undefined && t.markup !== null
                  ? String(t.markup)
                  : "",
              columnPrices: colPrices,
            };
          }),
        );
      } else {
        setTiers([
          {
            id: 1,
            quantity: "",
            markup: "130",
            columnPrices: {
              [loadedCols[0] || "Column 1"]: "",
              [loadedCols[1] || "Column 2"]: "",
            },
          },
          {
            id: 2,
            quantity: "",
            markup: "130",
            columnPrices: {
              [loadedCols[0] || "Column 1"]: "",
              [loadedCols[1] || "Column 2"]: "",
            },
          },
        ]);
      }
    }
  }, [data]);

  const handleAddColumn = () => {
    let colNum = columns.length + 1;
    let candidate = `Column ${colNum}`;
    while (columns.includes(candidate)) {
      colNum++;
      candidate = `Column ${colNum}`;
    }
    setColumns((prev) => [...prev, candidate]);
    setError("");
  };

  const handleRemoveLastColumn = () => {
    if (columns.length === 0) return;
    const colToRemove = columns[columns.length - 1];
    handleRemoveColumn(colToRemove);
  };

  const handleRemoveColumn = (colToRemove: string) => {
    setColumns((prev) => prev.filter((c) => c !== colToRemove));
    setTiers((prev) =>
      prev.map((t) => {
        const nextColPrices = { ...t.columnPrices };
        delete nextColPrices[colToRemove];
        return { ...t, columnPrices: nextColPrices };
      }),
    );
  };

  const handleRenameColumn = (index: number, newName: string) => {
    const oldName = columns[index];
    if (oldName === newName) return;

    setColumns((prev) => {
      const next = [...prev];
      next[index] = newName;
      return next;
    });

    setTiers((prev) =>
      prev.map((t) => {
        const nextColPrices = { ...t.columnPrices };
        if (oldName in nextColPrices) {
          nextColPrices[newName] = nextColPrices[oldName];
          delete nextColPrices[oldName];
        }
        return { ...t, columnPrices: nextColPrices };
      }),
    );
  };

  const addRow = () => {
    setTiers((prev) => {
      const last = prev[prev.length - 1];
      const initialColPrices: Record<string, string> = {};
      columns.forEach((col) => {
        initialColPrices[col] = last?.columnPrices?.[col] ?? "";
      });

      return [
        ...prev,
        {
          id: Date.now() + Math.random(),
          quantity: "",
          markup: last?.markup ?? "",
          columnPrices: initialColPrices,
        },
      ];
    });
  };

  const removeRow = (id: string | number, priceTierId?: string) => {
    if (priceTierId) {
      setDeletedTierIds((prev) => [...prev, priceTierId]);
    }
    setTiers((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTierField = (
    id: string | number,
    field: "quantity" | "markup",
    value: string,
  ) => {
    setTiers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    );
  };

  const updateColumnPrice = (
    id: string | number,
    col: string,
    value: string,
  ) => {
    setTiers((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              columnPrices: {
                ...t.columnPrices,
                [col]: value,
              },
            }
          : t,
      ),
    );
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!id) return;
    setError("");

    if (!name.trim()) {
      setError("Matrix name is required.");
      return;
    }

    if (tiers.length === 0) {
      setError("Add at least one pricing tier.");
      return;
    }

    const priceTiersPayload = [];
    for (const t of tiers) {
      const quantity = Number(t.quantity);
      const markup = Number(t.markup);

      if (!t.quantity || Number.isNaN(quantity)) {
        setError("Please provide a valid quantity for every tier.");
        return;
      }

      const columnPricesObj: Record<string, number> = {};
      columns.forEach((col) => {
        const val = t.columnPrices[col];
        if (val !== undefined && val !== "") {
          const num = Number(val);
          if (!Number.isNaN(num)) {
            columnPricesObj[col] = num;
          }
        }
      });

      priceTiersPayload.push({
        priceTierId: t.priceTierId,
        quantity,
        markup: Number.isNaN(markup) ? 0 : markup,
        ...(columns.length > 0 && Object.keys(columnPricesObj).length > 0
          ? { columnPrices: columnPricesObj }
          : {}),
      });
    }

    try {
      setIsSaving(true);
      setSaveSuccessMsg("");

      // 1. Delete removed tiers that existed on the backend
      if (deletedTierIds.length > 0) {
        await Promise.allSettled(
          deletedTierIds.map((pId) =>
            deletePriceTier({ priceMatrixId: id, priceTierId: pId }).unwrap(),
          ),
        );
        setDeletedTierIds([]);
      }

      // 2. Update price matrix metadata & columns
      await updatePriceMatrix({
        id,
        data: {
          name: name.trim(),
          priceType,
          columns,
          priceTiers: priceTiersPayload.map(
            ({ priceTierId: _, ...rest }) => rest,
          ),
        },
      }).unwrap();

      // 3. Sync individual tiers in case backend uses tier routes
      await Promise.allSettled(
        priceTiersPayload.map((t) => {
          const tierPayload = {
            quantity: t.quantity,
            markup: t.markup,
            columnPrices: t.columnPrices,
          };
          if (t.priceTierId) {
            return updatePriceTier({
              priceMatrixId: id,
              priceTierId: t.priceTierId,
              data: tierPayload,
            }).unwrap();
          } else {
            return createPriceTier({
              priceMatrixId: id,
              data: tierPayload,
            }).unwrap();
          }
        }),
      );

      setSaveSuccessMsg("Matrix and pricing tiers saved successfully!");
      setTimeout(() => setSaveSuccessMsg(""), 4000);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.data?.message || "Something went wrong while saving the matrix.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="pb-10">
      <form onSubmit={handleSave}>
        <div className="mb-6 pb-4 border-b border-border">
          <CommonHeader size="2xl" className="font-medium!">
            Pricing Matrix Detail
          </CommonHeader>
          <CommonHeader size="sm">
            Configure dimensions, columns, and quantity tiers with live volume pooling support.
          </CommonHeader>
        </div>

        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex items-center gap-1.5 text-sm text-[#155DFC] hover:underline mb-6 cursor-pointer"
        >
          <ArrowLeft size={14} />
          Back to All Matrices
        </button>

        <div className="border border-border rounded-xl p-6 mb-6 space-y-5 bg-white shadow-xs">
          <CommonHeader size="lg" className="font-medium! mb-2">
            General Information
          </CommonHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={inputClass.label}>Matrix Name</label>
              <input
                type="text"
                placeholder="e.g., Screen Printing or Wholesale Tier"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass.input}
              />
            </div>

            <div>
              <label className={inputClass.label}>Price Type</label>
              <CommonSelect<PriceType>
                value={priceType}
                item={priceTypeOptions}
                onValueChange={(val) => setPriceType(val)}
                placeholder="Select price type"
                className="w-full"
              />
            </div>
          </div>

          {/* Pricing Tiers Table matching Create Modal */}
          <div className="space-y-3 border-t border-border pt-5">
            <div className="flex items-center justify-between">
              <label className={inputClass.label}>Pricing Tiers</label>
              <span className="text-xs text-slate-500">
                {tiers.length} quantity {tiers.length === 1 ? "tier" : "tiers"}
              </span>
            </div>

            <div className="border border-border rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[550px]">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-border text-[#314158] font-semibold">
                    <th className="px-3 py-3 w-28 text-xs font-semibold text-slate-700">
                      Quantity
                    </th>

                    {columns.map((col, cIdx) => (
                      <th
                        key={col}
                        className="px-3 py-3 min-w-[120px] text-xs font-semibold text-slate-700"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <input
                            type="text"
                            value={col}
                            onChange={(e) =>
                              handleRenameColumn(cIdx, e.target.value)
                            }
                            className="bg-transparent border-0 font-semibold text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-400 rounded px-1 -ml-1 w-full"
                            title="Click to rename column"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveColumn(col)}
                            className="text-slate-400 hover:text-red-600 transition cursor-pointer p-0.5 shrink-0"
                            title={`Remove ${col} column`}
                          >
                            <X size={13} />
                          </button>
                        </div>
                      </th>
                    ))}

                    <th className="px-3 py-3 min-w-[220px] text-xs font-semibold text-slate-700">
                      <div className="flex flex-col">
                        <span>Product Markup %</span>
                        <span className="text-[10px] text-slate-400 font-normal leading-tight mt-0.5">
                          Markup % should be greater than 100%. Ex: To add a 30%
                          markup, enter in 130%
                        </span>
                      </div>
                    </th>

                    <th className="px-3 py-3 w-10 text-center" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tiers.map((tier) => (
                    <tr key={tier.id} className="hover:bg-slate-50/50">
                      {/* Quantity */}
                      <td className="p-2">
                        <input
                          value={tier.quantity}
                          placeholder="12"
                          onChange={(e) =>
                            updateTierField(tier.id, "quantity", e.target.value)
                          }
                          className={`${inputClass.input} !py-1.5 !text-xs`}
                        />
                      </td>

                      {/* Column Prices */}
                      {columns.map((col) => (
                        <td key={col} className="p-2">
                          <input
                            value={tier.columnPrices[col] ?? ""}
                            placeholder="0.00"
                            onChange={(e) =>
                              updateColumnPrice(tier.id, col, e.target.value)
                            }
                            className={`${inputClass.input} !py-1.5 !text-xs`}
                          />
                        </td>
                      ))}

                      {/* Product Markup % */}
                      <td className="p-2">
                        <input
                          value={tier.markup}
                          placeholder="130"
                          onChange={(e) =>
                            updateTierField(tier.id, "markup", e.target.value)
                          }
                          className={`${inputClass.input} !py-1.5 !text-xs`}
                        />
                      </td>

                      {/* Delete Row */}
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeRow(tier.id, tier.priceTierId)}
                          className="text-[#E7000B] hover:text-red-700 transition-colors cursor-pointer p-1 rounded"
                          title="Delete tier"
                        >
                          <X size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Action buttons below the table matching Create Modal / Printavo */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={addRow}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 rounded-md transition cursor-pointer shadow-xs"
              >
                <Plus size={13} className="text-slate-500" />
                Add Row
              </button>
              <button
                type="button"
                onClick={handleAddColumn}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 rounded-md transition cursor-pointer shadow-xs"
              >
                <Plus size={13} className="text-slate-500" />
                Add Column
              </button>
              {columns.length > 0 && (
                <button
                  type="button"
                  onClick={handleRemoveLastColumn}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-slate-300 hover:bg-red-50 hover:border-red-300 rounded-md transition cursor-pointer shadow-xs"
                >
                  <Minus size={13} className="text-red-500" />
                  Remove Last Column
                </button>
              )}
            </div>
          </div>

          {error && (
            <p className="text-xs text-[#E7000B] font-medium pt-2">{error}</p>
          )}
        </div>

        <div className="flex items-center gap-4 pt-2">
          <CommonButton
            type="submit"
            className="bg-[#00A63E]! text-white"
            disabled={isSaving || isLoading}
          >
            <Save size={15} />
            {isSaving ? "Saving..." : "Save changes"}
          </CommonButton>
          {saveSuccessMsg && (
            <span className="text-xs font-semibold text-emerald-600">
              {saveSuccessMsg}
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default PricingMatrixDetail;
