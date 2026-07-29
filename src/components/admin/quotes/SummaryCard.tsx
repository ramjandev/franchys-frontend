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
  // activeTab: "all" | "email" | "whatsapp";
  // setActiveTab: (tab: "all" | "email" | "whatsapp") => void;
  discountAmount: number;
  taxAmount: number;
  taxRate: number;
  total: number;
  onSaveDraft: () => void;
  isSaving: boolean;
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
  isSaving,
  isEditMode,
  // activeTab,
  // setActiveTab,
}) => {
  // const navigate = useNavigate();

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
          {formatMoney(total)}
        </CommonHeader>
      </div>

      <div>{/* <MiniTabs value={activeTab} onChange={setActiveTab} /> */}</div>
      <div className="space-y-3">
        <CommonButton
          type="button"
          className="w-full! "
          variant="primaryBlue"
          onClick={onSaveDraft}
          isLoading={isSaving}
          loadingText="Saving..."
        >
          <Save />
          {isEditMode ? "Update" : "Save as Draft"}
        </CommonButton>
      </div>
    </CardContainer>
  );
};

export default SummaryCard;
