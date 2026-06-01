import CardContainer from "@/components/shared/CardContainer";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import { CreditCard, Download, Pencil, Send } from "lucide-react";
const QuoteStatus = () => {
  return (
    <div className="w-full flex flex-col gap-2.5">
      <CardContainer>
        <CommonHeader className="font-bold! text-[#0F172B]!">
          Status
        </CommonHeader>
        <div className="flex justify-between items-center text-xs mb-1.5">
          <CommonHeader size="xs">Current Status:</CommonHeader>
          <span className="bg-[#FEF9C2] text-[#A65F00] text-[11px] font-bold px-3 py-1 rounded">
            Sent
          </span>
        </div>
        <div className="flex justify-between text-xs mb-1.5">
          <CommonHeader size="xs">Expires:</CommonHeader>
          <CommonHeader size="xs" className="text-[#0F172B]! font-bold!">
            05/15/2026
          </CommonHeader>
        </div>
        <div className="flex justify-between text-xs mb-3">
          <CommonHeader size="xs">Quote Total:</CommonHeader>
          <CommonHeader size="xl" className="text-skyBlue!">
            $782.46
          </CommonHeader>
        </div>
      </CardContainer>
      <CardContainer className="space-y-4">
        <CommonHeader className="font-bold! text-[#0F172B]!">
          Actions
        </CommonHeader>
        <CommonButton className="bg-skyBlue! text-white! w-full!">
          <Send className="w-3 h-3" /> Send to Customer
        </CommonButton>
        <CommonButton className="bg-[#F1F5F9]  w-full!">
          <Pencil className="w-3 h-3" /> Edit Quote
        </CommonButton>
        <CommonButton className="bg-[#F1F5F9]  w-full!">
          <Download className="w-3 h-3" /> Download PDF
        </CommonButton>
      </CardContainer>

      <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-xl p-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#9A3412] mb-1.5">
          <CreditCard className="w-3.5 h-3.5" /> Credit Card Fee
        </div>
        <div className="text-[11px] text-[#C2410C] leading-relaxed">
          A 3.5% processing fee is added when payment is made by credit or debit
          card. The fee applies to the total order amount.
        </div>
      </div>
    </div>
  );
};

export default QuoteStatus;
