import CommonSelect, { SelectOption } from "@/components/shared/CommonSelect";
import { inputClass } from "@/pages/Login";
import {
  useCreatePriceMatrixMutation,
  useUpdatePriceMatrixMutation,
} from "@/store/settings/PriceMatrices/priceMatrixAPI";
import { Plus, X } from "lucide-react";
import React, { useState } from "react";
import { GoPlusCircle } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import ModalAction from "./ModalAction";
import ModalContainer from "./ModalContainer";

export interface PricingTierRow {
  id: number;
  quantity: string;
  basePrice: string;
  markup: string;
  columnPrices: Record<string, string>;
}

type PriceType = "percentage" | "fixed";

const priceTypeOptions: readonly SelectOption<PriceType>[] = [
  { label: "Percentage", value: "percentage" },
  { label: "Fixed", value: "fixed" },
];

const QUICK_PRESETS = [
  "1 Color",
  "2 Colors",
  "3 Colors",
  "4 Colors",
  "5 Colors",
  "6 Colors",
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
  initialColumns = ["1 Color", "2 Colors"],
  initialTiers,
}) => {
  const [name, setName] = useState(initialName);
  const [priceType, setPriceType] = useState<PriceType | undefined>(
    initialPriceType,
  );
  const [columns, setColumns] = useState<string[]>(initialColumns);
  const [newColumnName, setNewColumnName] = useState("");
  const [tiers, setTiers] = useState<PricingTierRow[]>(
    initialTiers ?? [
      {
        id: 1,
        quantity: "12",
        basePrice: "15",
        markup: "50",
        columnPrices: { "1 Color": "3.5", "2 Colors": "4.5" },
      },
      {
        id: 2,
        quantity: "24",
        basePrice: "12",
        markup: "45",
        columnPrices: { "1 Color": "2.5", "2 Colors": "3.5" },
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

  const handleAddColumn = (colName?: string) => {
    const trimmed = (colName ?? newColumnName).trim();
    if (!trimmed) return;
    if (columns.includes(trimmed)) {
      setError(`Column "${trimmed}" already exists.`);
      return;
    }
    setColumns((prev) => [...prev, trimmed]);
    setNewColumnName("");
    setError("");
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
          quantity: last?.quantity ?? "",
          basePrice: last?.basePrice ?? "",
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
    field: "quantity" | "basePrice" | "markup",
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
      const basePrice = t.basePrice ? Number(t.basePrice) : 0;
      const markup = Number(t.markup);

      if (!t.quantity || Number.isNaN(quantity)) {
        setError("Please provide a valid quantity for every tier.");
        return;
      }

      if (Number.isNaN(basePrice) || Number.isNaN(markup)) {
        setError("Please fill in valid numbers for base price and markup.");
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
        basePrice,
        markup,
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
      description="Define columns and quantity tiers with base prices, markups, and column prices."
      size="max-w-4xl"
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

        {/* 2D Columns Section */}
        <div className="space-y-2.5 p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-semibold text-slate-800">
                Matrix Columns (e.g., Colors, Print Positions, Dimensions)
              </span>
              <p className="text-[11px] text-slate-500">
                Columns add dimensions to your pricing grid. Line items can select a column for specialized pricing.
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddColumn();
                  }
                }}
                placeholder="e.g., 3 Colors"
                className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-blue-500 w-36"
              />
              <button
                type="button"
                onClick={() => handleAddColumn()}
                className="flex items-center gap-1 text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition cursor-pointer"
              >
                <Plus size={13} /> Add
              </button>
            </div>
          </div>

          {/* Quick presets & active columns */}
          <div className="flex items-center flex-wrap gap-2 pt-1">
            {columns.length > 0 ? (
              columns.map((col) => (
                <span
                  key={col}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium"
                >
                  {col}
                  <button
                    type="button"
                    onClick={() => handleRemoveColumn(col)}
                    className="hover:text-red-600 transition cursor-pointer"
                    title={`Remove ${col}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">
                No custom columns added yet. Standard base pricing will be used.
              </span>
            )}

            {/* Quick preset suggestions */}
            <div className="flex items-center gap-1 ml-auto text-[11px] text-slate-400">
              <span>Quick add:</span>
              {QUICK_PRESETS.filter((p) => !columns.includes(p))
                .slice(0, 3)
                .map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleAddColumn(preset)}
                    className="hover:text-blue-600 hover:underline cursor-pointer"
                  >
                    +{preset}
                  </button>
                ))}
            </div>
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
                  <th className="px-3 py-2.5 w-24">Quantity</th>
                  <th className="px-3 py-2.5 w-28">Base Price ($)</th>
                  <th className="px-3 py-2.5 w-24">Markup (%)</th>
                  {columns.map((col) => (
                    <th key={col} className="px-3 py-2.5 min-w-[100px]">
                      <div className="flex items-center justify-between gap-1">
                        <span className="truncate">{col} ($)</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveColumn(col)}
                          className="text-slate-400 hover:text-red-600 transition cursor-pointer"
                          title={`Remove ${col} column`}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </th>
                  ))}
                  <th className="px-3 py-2.5 w-10 text-center" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tiers.map((tier) => (
                  <tr key={tier.id} className="hover:bg-slate-50/50">
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
                    <td className="p-2">
                      <input
                        value={tier.basePrice}
                        placeholder="10.00"
                        onChange={(e) =>
                          updateTierField(tier.id, "basePrice", e.target.value)
                        }
                        className={`${inputClass.input} !py-1.5 !text-xs`}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        value={tier.markup}
                        placeholder="20"
                        onChange={(e) =>
                          updateTierField(tier.id, "markup", e.target.value)
                        }
                        className={`${inputClass.input} !py-1.5 !text-xs`}
                      />
                    </td>
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

          <button
            type="button"
            onClick={addRow}
            className="flex items-center gap-1.5 text-xs text-[#155DFC] hover:underline cursor-pointer font-medium"
          >
            <GoPlusCircle size={15} />
            Add Row
          </button>
        </div>

        {error && <p className="text-xs text-[#E7000B] font-medium">{error}</p>}
      </div>

      <ModalAction
        close={() => setShowModal(false)}
        create={isEditMode ? "Save Changes" : "Create Matrix"}
        isSubmitting={isSubmitting}
        loadingText={isEditMode ? "Saving..." : "Creating..."}
        onSubmit={handleSubmit}
      />
    </ModalContainer>
  );
};

export default PriceMatrixModal;
