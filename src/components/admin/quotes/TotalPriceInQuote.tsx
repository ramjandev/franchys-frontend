import CommonHeader from "@/components/shared/CommonHeader";
import CustomSwitch from "@/components/shared/CustomSwitch";
import { CreditCard } from "lucide-react";
import { useState } from "react";
const pricingDetails = [
  {
    label: "Subtotal:",
    value: "$725.00",
    color: "",
  },
  {
    label: "Discount (3.45%):",
    value: "-$25.00",
    color: "",
  },
  {
    label: "Tax (8%):",
    value: "$56.00",
    color: "",
  },
];
const TotalPriceInQuote = () => {
  const [enabled, setEnabled] = useState(true);

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
            +$26.46
          </CommonHeader>

          <CustomSwitch checked={enabled} onChange={setEnabled} />
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t-2 border-gray-200">
        <CommonHeader size="lg" className=" font-bold!">
          Total Amount:
        </CommonHeader>
        <CommonHeader size="2xl" className=" font-bold! text-skyBlue!">
          $782.46
        </CommonHeader>
      </div>
    </div>
  );
};

export default TotalPriceInQuote;
