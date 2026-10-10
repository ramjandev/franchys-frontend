import CustomSwitch from "@/components/shared/CustomSwitch";
import { Quote } from "@/store/quote/types/quoteTypes";
import { CreditCard } from "lucide-react";
import { useState } from "react";

interface TotalPriceInQuoteProps {
  quote?: Quote;
}

const formatMoney = (n: number) => `$${n.toFixed(2)}`;

// Kept in sync with "Credit Card Fee (3.5%)" label
const CREDIT_CARD_FEE_RATE = 0.035;

const TotalPriceInQuote: React.FC<TotalPriceInQuoteProps> = ({ quote }) => {
  const [enabled, setEnabled] = useState(true);

  // Fallback to summing line items if quote.subtotal is missing or 0
  const lineItemsSum = (quote?.groups ?? []).flatMap((g) => g.lineItems).reduce(
    (acc, li) => acc + (Number(li.total) || 0),
    0,
  );
  const subtotal = Number(quote?.subtotal) > 0 ? Number(quote?.subtotal) : lineItemsSum;

  const discountPct = Number(quote?.discount ?? 0);
  const discountAmount = subtotal * (discountPct / 100);

  const taxRate = Number(quote?.taxRate ?? 0);
  const calculatedTax = Math.max(0, (subtotal - discountAmount) * (taxRate / 100));
  const taxAmount = Number(quote?.taxAmount) > 0 ? Number(quote?.taxAmount) : calculatedTax;

  const calculatedBaseTotal = Math.max(0, subtotal - discountAmount + taxAmount);
  const baseTotal =
    calculatedBaseTotal > 0
      ? calculatedBaseTotal
      : Number(quote?.total ?? 0);

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
    <div className="w-full space-y-3">
      <div className="space-y-3">
        {pricingDetails.map((item, i) => (
          <div key={item.label} className="flex justify-between items-center text-sm">
            <span className="text-slate-500 font-medium">{item.label}</span>
            <span
              className={`font-semibold ${i === 1 ? "text-emerald-600" : "text-slate-900"}`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center bg-[#FFF7ED] border border-[#FED7AA] rounded-lg px-3 py-2.5 my-3">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-orange-600 hidden sm:block" />
          <div>
            <div className="text-xs text-[#9A3412] font-semibold">
              Credit Card Fee (3.5%)
            </div>
            <div className="text-[10px] text-[#C2410C]">
              Applied when paying by card
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#EA580C] font-semibold">
            +{formatMoney(creditCardFee)}
          </span>
          <CustomSwitch checked={enabled} onChange={setEnabled} />
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t-2 border-slate-200">
        <span className="text-base sm:text-lg font-bold text-slate-900">
          Total Amount:
        </span>
        <span className="text-xl sm:text-2xl font-black text-sky-600">
          {formatMoney(grandTotal)}
        </span>
      </div>
    </div>
  );
};

export default TotalPriceInQuote;
