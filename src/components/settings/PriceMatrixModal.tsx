import { inputClass } from "@/pages/Login";
import { X } from "lucide-react";
import { useState } from "react";
import { GoPlusCircle } from "react-icons/go";
import ModalAction from "./ModalAction";
import ModalContainer from "./ModalContainer";

interface PricingTier {
  id: number;
  quantity: string;
  basePrice: string;
  markup: string;
}

interface PriceMatrixModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const PriceMatrixModal: React.FC<PriceMatrixModalProps> = ({
  setShowModal,
}) => {
  const [tiers, setTiers] = useState<PricingTier[]>([
    { id: 1, quantity: "12", basePrice: "25", markup: "50" },
  ]);

  const addRow = () => {
    setTiers((prev) => [
      ...prev,
      { id: Date.now(), quantity: "", basePrice: "", markup: "" },
    ]);
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
            className={inputClass.input}
          />
        </div>

        <div>
          <label className={inputClass.label}>Product Type</label>
          <input type="text" className={inputClass.input} />
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
      </div>
      <ModalAction close={() => setShowModal(false)} create="Create Matrix" />
    </ModalContainer>
  );
};

export default PriceMatrixModal;
