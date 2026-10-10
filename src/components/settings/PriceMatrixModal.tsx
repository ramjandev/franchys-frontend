import CommonSelect, { SelectOption } from "@/components/shared/CommonSelect";
import { inputClass } from "@/pages/Login";
import {
  useCreatePriceMatrixMutation,
  useUpdatePriceMatrixMutation,
} from "@/store/settings/PriceMatrices/priceMatrixAPI";
import { Minus, Plus, X } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalAction from "./ModalAction";
import ModalContainer from "./ModalContainer";

export interface PricingTierRow {
  id: number;
  quantity: string;
  basePrice?: string;
  markup: string;
  columnPrices: Record<string, string>;
}

type PriceType = "percentage" | "fixed";

const priceTypeOptions: readonly SelectOption<PriceType>[] = [
  { label: "Percentage", value: "percentage" },
  { label: "Fixed", value: "fixed" },
];

interface PriceMatrixModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  editMatrixId?: string;
  initialName?: string;
  initialPriceType?: PriceType;
  initialColumns?: string[];
  initialTiers?: PricingTierRow[];
}

const PriceMatrixModal: React.FC<PriceMatrixModalProps> = ({
  setShowModal,
  editMatrixId,
  initialName = "",
  initialPriceType = "fixed",
  initialColumns = ["Column 1", "Column 2"],
  initialTiers,
}) => {
  const [name, setName] = useState(initialName);
  const [priceType, setPriceType] = useState<PriceType | undefined>(
    initialPriceType,
  );
  const [columns, setColumns] = useState<string[]>(initialColumns);
  const [tiers, setTiers] = useState<PricingTierRow[]>(
    initialTiers ?? [
      {
        id: 1,
        quantity: "",
        basePrice: "",
        markup: "",
        columnPrices: { "Column 1": "", "Column 2": "" },
      },
      {
        id: 2,
        quantity: "",
        basePrice: "",
        markup: "",
        columnPrices: { "Column 1": "", "Column 2": "" },
      },
    ],
  );
  const [error, setError] = useState("");

  const [createPriceMatrix, { isLoading: isCreating }] =
    useCreatePriceMatrixMutation();
  const [updatePriceMatrix, { isLoading: isUpdating }] =
    useUpdatePriceMatrixMutation();
  const navigate = useNavigate();
  const isSubmitting = isCreating || isUpdating;
  const isEditMode = Boolean(editMatrixId);

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
          id: Date.now(),
          quantity: "",
          basePrice: "",
          markup: last?.markup ?? "",
          columnPrices: initialColPrices,
        },
      ];
    });
  };

  const removeRow = (id: number) => {
    setTiers((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTierField = (
    id: number,
    field: "quantity" | "markup",
    value: string,
  ) => {
    setTiers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    );
  };

  const updateColumnPrice = (id: number, col: string, value: string) => {
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

  const handleSubmit = async () => {
    setError("");

    if (!name.trim()) {
      setError("Matrix name is required.");
      return;
    }

    if (!priceType) {
      setError("Please select a product price type.");
      return;
    }

    if (tiers.length === 0) {
      setError("Add at least one pricing tier.");
      return;
    }

    const priceTiers = [];
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

      priceTiers.push({
        quantity,
        markup: Number.isNaN(markup) ? 0 : markup,
        ...(columns.length > 0 && Object.keys(columnPricesObj).length > 0
          ? { columnPrices: columnPricesObj }
          : {}),
      });
    }

    try {
      const payload = {
        name,
        priceType,
        columns,
        priceTiers,
      };

      if (isEditMode && editMatrixId) {
        await updatePriceMatrix({
          id: editMatrixId,
          data: payload,
        }).unwrap();
      } else {
        await createPriceMatrix(payload).unwrap();
      }
      navigate("/admin/settings/pricing");
      setShowModal(false);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.data?.message || "Something went wrong. Please check your inputs.",
      );
    }
  };

  return (
    <ModalContainer
      close={() => setShowModal(false)}
      title={isEditMode ? "Edit Pricing Matrix" : "Create New Pricing Matrix"}
      description="Define columns and quantity markups, and column prices."
      size="max-w-[1450px]"
    >
      <div className="p-6 space-y-5">
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

        {/* Pricing Tiers Table */}
        <div className="space-y-3">
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
                        onClick={() => removeRow(tier.id)}
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

          {/* Action buttons below the table matching Printavo */}
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

        {error && <p className="text-xs text-[#E7000B] font-medium">{error}</p>}
      </div>

      <ModalAction
        close={() => setShowModal(false)}
        create={isEditMode ? "Save Changes" : "Save"}
        isSubmitting={isSubmitting}
        loadingText={isEditMode ? "Saving..." : "Saving..."}
        onSubmit={handleSubmit}
      />
    </ModalContainer>
  );
};

export default PriceMatrixModal;
