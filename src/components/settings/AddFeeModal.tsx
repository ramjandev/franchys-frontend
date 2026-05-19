import { inputClass } from "@/pages/Login";
import { useState } from "react";
import ModalAction from "./ModalAction";
import ModalContainer from "./ModalContainer";

interface AddFeeModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddFeeModal: React.FC<AddFeeModalProps> = ({ setShowModal }) => {
  const [taxed, setTaxed] = useState(false);
  const [isDefault, setIsDefault] = useState(false);

  return (
    <ModalContainer close={() => setShowModal(false)} title="Add New Fee">
      <div className="p-6 space-y-4">
        <div>
          <label className={inputClass.label}>Fee Name</label>
          <input
            type="text"
            placeholder="e.g., Setup Fee, Shipping & Handling"
            className={inputClass.input}
          />
        </div>

        <div>
          <label className={inputClass.label}>Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#62748E] text-sm">
              $
            </span>
            <input
              type="number"
              placeholder="0.00"
              className={`${inputClass.input} pl-7`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Taxed toggle */}
          <div className="border border-border rounded-xl px-4 py-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#0F172B]">Taxed</p>
              <p className="text-xs text-[#62748E] mt-0.5">
                Apply tax to this fee
              </p>
            </div>
            <button
              onClick={() => setTaxed((v) => !v)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                taxed ? "bg-[#155DFC]" : "bg-[#CBD5E1]"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 ${
                  taxed ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="border border-border rounded-xl px-4 py-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#0F172B]">Default</p>
              <p className="text-xs text-[#62748E] mt-0.5">
                Auto-add to invoices
              </p>
            </div>
            <button
              onClick={() => setIsDefault((v) => !v)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                isDefault ? "bg-[#155DFC]" : "bg-[#CBD5E1]"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 ${
                  isDefault ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <ModalAction close={() => setShowModal(false)} create="Add Fee" />
    </ModalContainer>
  );
};

export default AddFeeModal;
