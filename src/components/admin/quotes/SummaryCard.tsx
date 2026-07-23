import CardContainer from "@/components/shared/CardContainer";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import { Input } from "@/components/ui/input";
import { Save, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
const SummaryCard = () => {
  const navigate = useNavigate();

  return (
    <CardContainer>
      <CommonHeader size="lg" className="mb-6">
        Summary
      </CommonHeader>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between text-sm">
          <CommonHeader size="xs">Subtotal</CommonHeader>
          <CommonHeader size="xs" className="text-[#0F172B]!">
            $0.00
          </CommonHeader>
        </div>
        <div className="flex items-center justify-between text-sm">
          <CommonHeader size="xs">Discount</CommonHeader>

          <div className="flex items-center gap-2">
            <Input defaultValue="0" className="w-16 h-8 text-right px-2" />
            <span>%</span>
            <CommonHeader size="xs" className="text-[#0F172B]!">
              $0.00
            </CommonHeader>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <CommonHeader size="xs">Tax (7%)</CommonHeader>

          <CommonHeader size="xs" className="text-[#0F172B]!">
            $0.00
          </CommonHeader>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-4 mb-6">
        <CommonHeader size="lg" className="text-[#0F172B]!">
          Total
        </CommonHeader>
        <CommonHeader size="xl" className="text-[#0F172B]!">
          $0.00
        </CommonHeader>
      </div>

      <div className="space-y-3">
        <CommonButton
          onClick={() => navigate("../quotes/preview")}
          variant="primaryBlue"
          className="w-full!"
        >
          <Send /> Save & Send Quote
        </CommonButton>
        <CommonButton className="w-full!" variant="secondary">
          <Save /> Save as Draft
        </CommonButton>
      </div>
    </CardContainer>
  );
};

export default SummaryCard;
