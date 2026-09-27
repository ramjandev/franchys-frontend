import CardContainer from "@/components/shared/CardContainer";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import {
  useSendQuoteEmailMutation,
  useSendQuoteWhatsappMutation,
} from "@/store/quote/quoteAPI";
import { Quote } from "@/store/quote/types/quoteTypes";
import { CreditCard, Download, Pencil, Send } from "lucide-react";
import { useState } from "react";
import MiniTabs from "./MiniTabs";

interface QuoteStatusProps {
  quote?: Quote;
  isExporting: boolean;
  onSubmit: () => void;
}

const formatDate = (date?: string | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};

const formatMoney = (n: number | string) => `$${Number(n).toFixed(2)}`;

// Extended from the single hardcoded "Sent -> yellow" badge to cover
// every QuoteStatus value, keeping the same badge markup/classes.
const statusStyles: Record<string, string> = {
  DRAFT: "bg-[#F1F5F9] text-[#334155]",
  SENT: "bg-[#FEF9C2] text-[#A65F00]",
  APPROVED: "bg-[#DCFCE7] text-[#00A63E]",
  DECLINED: "bg-[#FFE2E2] text-[#E7000B]",
  REVISION_REQUESTED: "bg-[#FFEDD4] text-[#C2410C]",
};

const statusLabels: Record<string, string> = {
  DRAFT: "Draft",
  SENT: "Sent",
  APPROVED: "Approved",
  DECLINED: "Declined",
  REVISION_REQUESTED: "Revision Requested",
};

const QuoteStatus: React.FC<QuoteStatusProps> = ({
  quote,
  isExporting,
  onSubmit,
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "email" | "whatsapp">(
    "all",
  );
  const status = quote?.status ?? "DRAFT";
  const badgeClass = statusStyles[status] ?? statusStyles.DRAFT;
  const statusLabel = statusLabels[status] ?? status;
  const [sendQuoteEmail, { isLoading: isSendingEmail }] =
    useSendQuoteEmailMutation();
  const [sendQuoteWhatsapp, { isLoading: isSendingWhatsapp }] =
    useSendQuoteWhatsappMutation();

  const handleSend = async (id: string) => {
    if (!id) return;

    try {
      switch (activeTab) {
        case "all":
          if (!isSendingEmail) {
            await sendQuoteEmail(id).unwrap();
          }

          if (!isSendingWhatsapp) {
            await sendQuoteWhatsapp(id).unwrap();
          }
          break;

        case "email":
          if (!isSendingEmail) {
            await sendQuoteEmail(id).unwrap();
          }
          break;

        case "whatsapp":
          if (!isSendingWhatsapp) {
            await sendQuoteWhatsapp(id).unwrap();
          }
          break;
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="w-full flex flex-col gap-2.5">
      <CardContainer>
        <CommonHeader className="font-bold! text-[#0F172B]!">
          Status
        </CommonHeader>
        <div className="flex justify-between items-center text-xs mb-1.5">
          <CommonHeader size="xs">Current Status:</CommonHeader>
          <span
            className={`${badgeClass} text-[11px] font-bold px-3 py-1 rounded`}
          >
            {statusLabel}
          </span>
        </div>
        <div className="flex justify-between text-xs mb-1.5">
          <CommonHeader size="xs">Expires:</CommonHeader>
          <CommonHeader size="xs" className="text-[#0F172B]! font-bold!">
            {formatDate(quote?.dueDate)}
          </CommonHeader>
        </div>
        <div className="flex justify-between text-xs mb-3">
          <CommonHeader size="xs">Quote Total:</CommonHeader>
          <CommonHeader size="xl" className="text-skyBlue!">
            {formatMoney(quote?.total ?? 0)}
          </CommonHeader>
        </div>
      </CardContainer>

      <MiniTabs value={activeTab} onChange={setActiveTab} />
      <CardContainer className="space-y-4">
        <CommonHeader className="font-bold! text-[#0F172B]!">
          Actions
        </CommonHeader>
        <CommonButton
          isLoading={isSendingEmail}
          loadingText="Sending..."
          onClick={() => handleSend(quote?.id!)}
          variant="primaryBlue"
          className="w-full!"
        >
          <Send /> Send to Customer
        </CommonButton>
        <CommonButton
          to={`/admin/quotes/edit/${quote?.id}`}
          variant="ghost"
          className="  w-full!"
        >
          <Pencil /> Edit Quote
        </CommonButton>
        <CommonButton
          onClick={onSubmit}
          loadingText="Exporting..."
          isLoading={isExporting}
          variant="ghost"
          className=" w-full!"
        >
          <Download /> Download PDF
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
