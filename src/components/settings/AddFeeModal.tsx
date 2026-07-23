import { inputClass } from "@/pages/Login";
import {
  useCreateFeeMutation,
  useUpdateFeeMutation,
} from "@/store/settings/fees/feeAPI";
import { Fee } from "@/store/settings/fees/types/feeTypes";
import { useState } from "react";
import { z } from "zod";
import ModalAction from "./ModalAction";
import ModalContainer from "./ModalContainer";

interface AddFeeModalProps {
  close: () => void;
  selectedFee?: Fee;
}

const feeSchema = z.object({
  feeName: z
    .string()
    .trim()
    .min(1, "Fee name is required")
    .max(100, "Fee name must be under 100 characters"),
  amount: z.coerce
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Amount is required"
          : "Amount must be a number",
    })
    .positive("Amount must be greater than 0"),
  isTax: z.boolean(),
  isDefaultAutoAdd: z.boolean(),
});

type FeeFormErrors = Partial<Record<keyof z.infer<typeof feeSchema>, string>>;

const AddFeeModal: React.FC<AddFeeModalProps> = ({ close, selectedFee }) => {
  const isEditMode = Boolean(selectedFee);

  const [createFee, { isLoading: isCreating }] = useCreateFeeMutation();
  const [updateFee, { isLoading: isUpdating }] = useUpdateFeeMutation();

  const [feeName, setFeeName] = useState(selectedFee?.feeName ?? "");
  const [amount, setAmount] = useState(
    selectedFee ? String(selectedFee.amount) : "",
  );
  const [taxed, setTaxed] = useState(selectedFee?.isTax ?? false);
  const [isDefault, setIsDefault] = useState(
    selectedFee?.isDefaultAutoAdd ?? false,
  );
  const [errors, setErrors] = useState<FeeFormErrors>({});

  const isSubmitting = isCreating || isUpdating;

  const handleSubmit = async () => {
    const result = feeSchema.safeParse({
      feeName,
      amount,
      isTax: taxed,
      isDefaultAutoAdd: isDefault,
    });

    if (!result.success) {
      const fieldErrors: FeeFormErrors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof FeeFormErrors;
        fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    try {
      if (isEditMode && selectedFee) {
        await updateFee({ infId: selectedFee.infId, ...result.data }).unwrap();
      } else {
        await createFee(result.data).unwrap();
      }
      close();
    } catch {}
  };

  return (
    <ModalContainer
      close={() => close()}
      title={isEditMode ? "Edit Fee" : "Add New Fee"}
    >
      <form className="p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className={inputClass.label}>Fee Name</label>
          <input
            type="text"
            placeholder="e.g., Setup Fee, Shipping & Handling"
            className={inputClass.input}
            value={feeName}
            onChange={(e) => setFeeName(e.target.value)}
          />
          {errors.feeName && (
            <p className="text-xs text-red-500 mt-1">{errors.feeName}</p>
          )}
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
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          {errors.amount && (
            <p className="text-xs text-red-500 mt-1">{errors.amount}</p>
          )}
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
      </form>

      <ModalAction
        close={() => close()}
        create={isEditMode ? "Save Changes" : "Add Fee"}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </ModalContainer>
  );
};

export default AddFeeModal;
