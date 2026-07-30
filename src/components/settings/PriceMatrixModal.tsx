import CommonSelect, { SelectOption } from "@/components/shared/CommonSelect";
import { inputClass } from "@/pages/Login";
import {
  useCreatePriceMatrixMutation,
  useUpdatePriceMatrixMutation,
} from "@/store/settings/PriceMatrices/priceMatrixAPI";
import { X } from "lucide-react";
import { useState } from "react";
import { GoPlusCircle } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import ModalAction from "./ModalAction";
import ModalContainer from "./ModalContainer";

interface PricingTier {
  id: number;
  quantity: string;
  basePrice: string;
  markup: string;
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
  initialTiers?: PricingTier[];
}

const PriceMatrixModal: React.FC<PriceMatrixModalProps> = ({
  setShowModal,
  editMatrixId,
  initialName = "",
  initialPriceType,
  initialTiers,
}) => {
  const [name, setName] = useState(initialName);
  const [priceType, setPriceType] = useState<PriceType | undefined>(
    initialPriceType,
  );
  const [tiers, setTiers] = useState<PricingTier[]>(
    initialTiers ?? [{ id: 1, quantity: "12", basePrice: "25", markup: "50" }],
  );
  const [error, setError] = useState("");

  const [createPriceMatrix, { isLoading: isCreating }] =
    useCreatePriceMatrixMutation();
  const [updatePriceMatrix, { isLoading: isUpdating }] =
    useUpdatePriceMatrixMutation();
  const navigate = useNavigate();
  const isSubmitting = isCreating || isUpdating;
  const isEditMode = Boolean(editMatrixId);

  const addRow = () => {
    setTiers((prev) => {
      const last = prev[prev.length - 1];
      return [
        ...prev,
        {
          id: Date.now(),
          quantity: last?.quantity ?? "",
          basePrice: last?.basePrice ?? "",
          markup: last?.markup ?? "",
        },
      ];
    });
  };

  const removeRow = (id: number) => {
    setTiers((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTier = (
    id: number,
    field: keyof Omit<PricingTier, "id">,
    value: string,
  ) => {
    setTiers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    );
  };

  const handleSubmit = async () => {
    setError("");

    if (!name.trim()) {
      setError("Matrix name is required.");
      return;
    }

    if (!priceType) {
      setError("Please select a product type.");
      return;
    }

    if (tiers.length === 0) {
      setError("Add at least one pricing tier.");
      return;
    }

    const priceTiers = [];
    for (const t of tiers) {
      const quantity = Number(t.quantity);
      const basePrice = Number(t.basePrice);
      const markup = Number(t.markup);

      if (
        !t.quantity ||
        !t.basePrice ||
        !t.markup ||
        Number.isNaN(quantity) ||
        Number.isNaN(basePrice) ||
        Number.isNaN(markup)
      ) {
        setError("Please fill in valid values for every tier.");
        return;
      }

      priceTiers.push({ quantity, basePrice, markup });
    }

    try {
      if (isEditMode && editMatrixId) {
        await updatePriceMatrix({
          id: editMatrixId,
          data: { name, priceType, priceTiers },
        }).unwrap();
      } else {
        await createPriceMatrix({ name, priceType, priceTiers }).unwrap();
      }
      navigate("/admin/settings/pricing");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <ModalContainer
      close={() => setShowModal(false)}
      title=" Create New Pricing Matrix"
    >
      <div className="p-6 space-y-4">
        <div>
          <label className={inputClass.label}>Matrix Name</label>
          <input
            type="text"
            placeholder="e.g., Hoodie Pricing"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass.input}
          />
        </div>

        <div>
          <label className={inputClass.label}>Product Type</label>
          <CommonSelect<PriceType>
            value={priceType}
            item={priceTypeOptions}
            onValueChange={(val) => setPriceType(val)}
            placeholder="Select product type"
            className="w-full"
          />
        </div>

        <hr className="border-border" />

        <div className="space-y-3">
          <label className={inputClass.label}>Pricing Tiers</label>

          <div className="border border-border rounded-xl overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_1fr_1fr_32px] gap-2 bg-[#F8FAFC] px-4 py-2.5 border-b border-border">
              <span className="text-xs font-semibold text-[#314158]">
                Quantity
              </span>
              <span className="text-xs font-semibold text-[#314158]">
                Base Price ($)
              </span>
              <span className="text-xs font-semibold text-[#314158]">
                Markup (%)
              </span>
              <span />
            </div>

            {/* Rows */}
            <div className="divide-y divide-border">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className="grid grid-cols-[1fr_1fr_1fr_32px] gap-2 items-center px-4 py-3"
                >
                  <input
                    value={tier.quantity}
                    placeholder="12"
                    onChange={(e) =>
                      updateTier(tier.id, "quantity", e.target.value)
                    }
                    className={inputClass.input}
                  />
                  <input
                    value={tier.basePrice}
                    placeholder="25"
                    onChange={(e) =>
                      updateTier(tier.id, "basePrice", e.target.value)
                    }
                    className={inputClass.input}
                  />
                  <input
                    value={tier.markup}
                    placeholder="50"
                    onChange={(e) =>
                      updateTier(tier.id, "markup", e.target.value)
                    }
                    className={inputClass.input}
                  />
                  <button
                    onClick={() => removeRow(tier.id)}
                    className="text-[#E7000B] hover:text-red-700 transition-colors cursor-pointer flex items-center justify-center"
                  >
                    <X size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={addRow}
            className="flex items-center gap-1.5 text-sm text-[#155DFC] hover:underline cursor-pointer"
          >
            <GoPlusCircle size={15} />
            Add Row
          </button>
        </div>

        {error && <p className="text-xs text-[#E7000B]">{error}</p>}
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
