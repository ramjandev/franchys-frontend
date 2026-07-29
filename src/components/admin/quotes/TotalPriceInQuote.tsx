import CommonHeader from "@/components/shared/CommonHeader";
import CustomSwitch from "@/components/shared/CustomSwitch";
import { Quote } from "@/store/quote/types/quoteTypes";
import { CreditCard } from "lucide-react";
import { useState } from "react";

interface TotalPriceInQuoteProps {
  quote?: Quote;
}

const formatMoney = (n: number) => `$${n.toFixed(2)}`;

// Not returned by the API — kept in sync with the "Credit Card Fee (3.5%)"
// label below, which was already hardcoded in the design.
const CREDIT_CARD_FEE_RATE = 0.035;

const TotalPriceInQuote: React.FC<TotalPriceInQuoteProps> = ({ quote }) => {
  const [enabled, setEnabled] = useState(true);

  const subtotal = Number(quote?.subtotal ?? 0);
  const discountPct = Number(quote?.discount ?? 0);
  const taxRate = Number(quote?.taxRate ?? 0);
  const taxAmount = Number(quote?.taxAmount ?? 0);
  const baseTotal = Number(quote?.total ?? 0);

  const discountAmount = subtotal * (discountPct / 100);
  const creditCardFee = baseTotal * CREDIT_CARD_FEE_RATE;
  const grandTotal = enabled ? baseTotal + creditCardFee : baseTotal;

  const pricingDetails = [
    {
      label: "Subtotal:",
      value: formatMoney(subtotal),
    },
    {
      label: `Discount (${discountPct}%):`,
      value: `-${formatMoney(discountAmount)}`,
    },
    {
      label: `Tax (${taxRate}%):`,
      value: formatMoney(taxAmount),
    },
  ];

  return (
    <div className=" space-y-3">
      <div className="space-y-3">
        {pricingDetails.map((item, i) => (
          <div key={item.label} className="flex justify-between items-center ">
            <CommonHeader size="xs">{item.label}</CommonHeader>
            <CommonHeader
              size="xs"
              className={`font-semibold! ${i === 1 ? "text-[#00A63E]! " : "text-[#0F172B]!"}`}
            >
              {item.value}
            </CommonHeader>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center bg-[#FFF7ED] border border-[#FED7AA] rounded-lg px-3 py-2 my-3">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-orange-600 hidden sm:block" />
          <div>
            <CommonHeader size="xs" className="text-[#9A3412]! font-semibold!">
              Credit Card Fee (3.5%)
            </CommonHeader>

            <div className="text-[10px] text-[#C2410C]">
              Applied when paying by card
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CommonHeader size="xs" className="text-[#EA580C]! font-semibold!">
            +{formatMoney(creditCardFee)}
          </CommonHeader>

          <CustomSwitch checked={enabled} onChange={setEnabled} />
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t-2 border-gray-200">
        <CommonHeader size="lg" className=" font-bold!">
          Total Amount:
        </CommonHeader>
        <CommonHeader size="2xl" className=" font-bold! text-skyBlue!">
          {formatMoney(grandTotal)}
        </CommonHeader>
      </div>
    </div>
  );
};

export default TotalPriceInQuote;
