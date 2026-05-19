import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import { inputClass } from "@/pages/Login";
import { ArrowLeft, Plus, Save, X } from "lucide-react";
import { useState } from "react";

interface PricingTier {
  id: number;
  quantity: string;
  basePrice: string;
  markup: string;
}

const initialTiers: PricingTier[] = [
  { id: 1, quantity: "12", basePrice: "25", markup: "50" },
  { id: 2, quantity: "24", basePrice: "22", markup: "50" },
  { id: 3, quantity: "48", basePrice: "18", markup: "50" },
  { id: 4, quantity: "72", basePrice: "15", markup: "50" },
  { id: 5, quantity: "144", basePrice: "12", markup: "50" },
];

const PricingMatrixDetail = () => {
  const [tiers, setTiers] = useState<PricingTier[]>(initialTiers);

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
    <div className="">
      <div className="mb-6 pb-4 border-b border-border">
        <CommonHeader size="2xl" className="font-medium!">
          Pricing Matrix
        </CommonHeader>
        <CommonHeader size="sm">
          Create pricing matrices for different products and services with
          quantity-based pricing.
        </CommonHeader>
      </div>

      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-1.5 text-sm text-[#155DFC] hover:underline mb-6 cursor-pointer"
      >
        <ArrowLeft size={14} />
        Back to All Matrices
      </button>

      <div className="border border-border rounded-xl p-6 mb-6 space-y-4">
        <CommonHeader size="lg" className="font-medium! mb-2">
          General
        </CommonHeader>

        <div className="grid grid-cols-[140px_1fr] gap-3 items-center">
          <label className={inputClass.label}>Name</label>
          <input defaultValue="T-Shirt Pricing" className={inputClass.input} />
        </div>

        <div className="grid grid-cols-[140px_1fr] gap-3 items-center">
          <label className={inputClass.label}>Product Type</label>
          <input className={inputClass.input} />
        </div>

        <div className=" border-t border-border pt-6">
          <CommonHeader size="lg" className="font-medium! mb-4">
            Pricing Tiers
          </CommonHeader>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8FAFC] ">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#314158] w-1/3">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#314158] w-1/3">
                    Base Price ($)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#314158] w-1/3">
                    Markup (%)
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[#314158]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {tiers.map((tier) => (
                  <tr key={tier.id}>
                    <td className="px-2 py-2">
                      <input
                        value={tier.quantity}
                        onChange={(e) =>
                          updateTier(tier.id, "quantity", e.target.value)
                        }
                        className={`${inputClass.input} !py-2`}
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        value={tier.basePrice}
                        onChange={(e) =>
                          updateTier(tier.id, "basePrice", e.target.value)
                        }
                        className={`${inputClass.input} !py-2`}
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        value={tier.markup}
                        onChange={(e) =>
                          updateTier(tier.id, "markup", e.target.value)
                        }
                        className={`${inputClass.input} !py-2`}
                      />
                    </td>
                    <td className="px-2 py-2 text-center">
                      <button
                        onClick={() => removeRow(tier.id)}
                        className="text-[#E7000B] hover:text-red-700 transition-colors cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={addRow}
              className="mx-6 mb-6 flex items-center gap-1.5 text-sm text-[#155DFC] hover:underline cursor-pointer"
            >
              <Plus size={15} />
              Add Row
            </button>
          </div>
        </div>
      </div>

      <div className="pt-6 mt-6 border-t border-border">
        <CommonButton className="bg-[#00A63E]! text-white">
          <Save size={15} />
          Save changes
        </CommonButton>
      </div>
    </div>
  );
};

export default PricingMatrixDetail;
