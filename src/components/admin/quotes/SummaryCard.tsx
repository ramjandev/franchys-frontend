import CardContainer from "@/components/shared/CardContainer";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";
import { UseFormRegister } from "react-hook-form";
import { QuoteFormValues } from "./schema/quoteFormSchema";

interface SummaryCardProps {
  register: UseFormRegister<QuoteFormValues>;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  taxRate: number;
  total: number;
  onSaveDraft: () => void;
  onSaveAndContinue?: () => void;
  isSaving: boolean;
  isSavingAndContinuing?: boolean;
  isEditMode: boolean;
}

const formatMoney = (n: number) => `$${n.toFixed(2)}`;

const SummaryCard: React.FC<SummaryCardProps> = ({
  register,
  subtotal,
  discountAmount,
  taxAmount,
  taxRate,
  total,
  onSaveDraft,
  onSaveAndContinue,
  isSaving,
  isSavingAndContinuing,
  isEditMode,
}) => {
  return (
    <CardContainer className="space-y-4">
      <CommonHeader size="lg" className="">
        Summary
      </CommonHeader>

      <div className="space-y-2 ">
        <div className="flex items-center justify-between text-sm">
          <CommonHeader size="xs">Subtotal</CommonHeader>
          <CommonHeader size="xs" className="text-[#0F172B]!">
            {formatMoney(subtotal)}
          </CommonHeader>
        </div>
        <div className="flex items-center justify-between text-sm">
          <CommonHeader size="xs">Discount</CommonHeader>

          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={0}
              max={100}
              className="w-16 h-8 text-right px-2"
              {...register("discount", { valueAsNumber: true })}
            />
            <span>%</span>
            <CommonHeader size="xs" className="text-[#0F172B]!">
              {formatMoney(discountAmount)}
            </CommonHeader>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <CommonHeader size="xs">Tax ({taxRate}%)</CommonHeader>

          <CommonHeader size="xs" className="text-[#0F172B]!">
            {formatMoney(taxAmount)}
          </CommonHeader>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[#F1F5F9]  ">
        <CommonHeader size="lg" className="text-[#0F172B]!">
          Total
        </CommonHeader>
        <CommonHeader size="xl" className="text-[#0F172B]!">
          {formatMoney(
            total > 0 ? total : Math.max(0, subtotal - discountAmount + taxAmount),
          )}
        </CommonHeader>
      </div>

      <div className="space-y-2.5">
        <CommonButton
          type="button"
          className="w-full! "
          variant="primaryBlue"
          onClick={onSaveDraft}
          isLoading={isSaving}
          loadingText="Saving..."
        >
          <Save size={15} />
          {isEditMode ? "Save Quote" : "Save as Draft"}
        </CommonButton>

        {onSaveAndContinue && (
          <CommonButton
            type="button"
            className="w-full! bg-slate-100! text-slate-800! hover:bg-slate-200! border border-slate-300!"
            variant="secondary"
            onClick={onSaveAndContinue}
            isLoading={isSavingAndContinuing}
            loadingText="Saving..."
          >
            <Save size={15} />
            Save & Continue Editing
          </CommonButton>
        )}
      </div>
    </CardContainer>
  );
};

export default SummaryCard;
