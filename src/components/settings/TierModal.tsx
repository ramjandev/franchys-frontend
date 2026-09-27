import ModalAction from "@/components/settings/ModalAction";
import ModalContainer from "@/components/settings/ModalContainer";
import { inputClass } from "@/pages/Login";
import {
  useCreatePriceTierMutation,
  useUpdatePriceTierMutation,
} from "@/store/settings/PriceMatrices/priceMatrixAPI";
import React, { useEffect, useState } from "react";

export interface TierData {
  priceTierId?: string;
  quantity: number | string;
  basePrice?: number | string;
  markup: number | string;
  columnPrices?: Record<string, number | string> | null;
}

interface TierModalProps {
  isOpen: boolean;
  onClose: () => void;
  priceMatrixId: string;
  columns: string[];
  editingTier?: TierData | null;
}

const TierModal: React.FC<TierModalProps> = ({
  isOpen,
  onClose,
  priceMatrixId,
  columns = [],
  editingTier,
}) => {
  const [quantity, setQuantity] = useState("");
  const [markup, setMarkup] = useState("");
  const [columnPrices, setColumnPrices] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  const [createPriceTier, { isLoading: isCreating }] =
    useCreatePriceTierMutation();
  const [updatePriceTier, { isLoading: isUpdating }] =
    useUpdatePriceTierMutation();

  const isSubmitting = isCreating || isUpdating;
  const isEditMode = Boolean(editingTier?.priceTierId);

  useEffect(() => {
    if (!isOpen) return;

    if (editingTier) {
      setQuantity(String(editingTier.quantity ?? ""));
      setMarkup(String(editingTier.markup ?? ""));

      const colPrices: Record<string, string> = {};
      columns.forEach((col) => {
        const val = editingTier.columnPrices?.[col];
        colPrices[col] = val !== undefined && val !== null ? String(val) : "";
      });
      setColumnPrices(colPrices);
    } else {
      setQuantity("");
      setMarkup("");
      const emptyCols: Record<string, string> = {};
      columns.forEach((col) => {
        emptyCols[col] = "";
      });
      setColumnPrices(emptyCols);
    }
    setError("");
  }, [isOpen, editingTier, columns]);

  if (!isOpen) return null;

  const handleColumnPriceChange = (col: string, val: string) => {
    setColumnPrices((prev) => ({
      ...prev,
      [col]: val,
    }));
  };

  const handleSubmit = async () => {
    setError("");

    const parsedQty = Number(quantity);
    if (!quantity || Number.isNaN(parsedQty) || parsedQty <= 0) {
      setError("Please provide a valid quantity greater than 0.");
      return;
    }

    const parsedMarkup = markup ? Number(markup) : 0;
    if (Number.isNaN(parsedMarkup) || parsedMarkup < 0) {
      setError("Please provide a valid markup percentage.");
      return;
    }

    const colPricesPayload: Record<string, number> = {};
    columns.forEach((col) => {
      const val = columnPrices[col];
      if (val !== undefined && val !== "") {
        const num = Number(val);
        if (!Number.isNaN(num)) {
          colPricesPayload[col] = num;
        }
      }
    });

    const payload = {
      quantity: parsedQty,
      markup: parsedMarkup,
      ...(columns.length > 0 && Object.keys(colPricesPayload).length > 0
        ? { columnPrices: colPricesPayload }
        : {}),
    };

    try {
      if (isEditMode && editingTier?.priceTierId) {
        await updatePriceTier({
          priceMatrixId,
          priceTierId: editingTier.priceTierId,
          data: payload,
        }).unwrap();
      } else {
        await createPriceTier({
          priceMatrixId,
          data: payload,
        }).unwrap();
      }
      onClose();
    } catch (err: any) {
      console.error("Failed to save price tier", err);
      setError(
        err?.data?.message ||
          "Failed to save price tier. Please check your inputs.",
      );
    }
  };

  return (
    <ModalContainer
      close={onClose}
      title={isEditMode ? "Update Price Tier" : "Add New Price Tier"}
      description={
        isEditMode
          ? "Modify quantity breaks, base price, and column pricing for this tier."
          : "Add a quantity tier break with base pricing, markup, and column prices."
      }
      size="max-w-xl"
    >
      <div className="p-6 space-y-4">
        {/* Core Tier Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className={inputClass.label}>
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="e.g., 12"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className={inputClass.input}
              autoFocus
            />
          </div>

          <div>
            <label className={inputClass.label}>Markup (%)</label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g., 20"
              value={markup}
              onChange={(e) => setMarkup(e.target.value)}
              className={inputClass.input}
            />
          </div>
        </div>

        {/* 2D Columns Price Breakdown */}
        {columns.length > 0 && (
          <div className="pt-3 border-t border-slate-200 space-y-2.5">
            <div>
              <span className="text-xs font-semibold text-slate-800">
                Column Prices ($)
              </span>
              <p className="text-[11px] text-slate-500">
                Specify custom price for each column at this quantity tier.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto p-1">
              {columns.map((col) => (
                <div key={col}>
                  <label className="text-[11px] font-medium text-slate-600 block mb-1">
                    {col}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={columnPrices[col] ?? ""}
                    onChange={(e) =>
                      handleColumnPriceChange(col, e.target.value)
                    }
                    className={`${inputClass.input} !py-1.5 !text-xs`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <p className="text-xs text-[#E7000B] font-medium bg-red-50 p-2.5 rounded-lg border border-red-200">
            {error}
          </p>
        )}
      </div>

      <ModalAction
        close={onClose}
        create={isEditMode ? "Save Changes" : "Add Tier"}
        isSubmitting={isSubmitting}
        loadingText={isEditMode ? "Saving..." : "Adding..."}
        onSubmit={handleSubmit}
      />
    </ModalContainer>
  );
};

export default TierModal;
