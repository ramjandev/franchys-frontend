import CommonHeader from "@/components/shared/CommonHeader";
import { Image, Plus, Zap } from "lucide-react";
import TotalPriceInQuote from "./TotalPriceInQuote";

const lineItems = [
  {
    id: 1,
    color: "blue",
    category: "Apparel/Accessories",
    itemNo: "8000",
    colorName: "Black",
    totalItems: 15,
    productName: "Gildan - Unisex DryBlend® T-Shirt - 8000",
    sizes: { XS: null, S: null, M: 5, L: 5, XL: 5, "2XL": null },
    imprint: { type: "DTF - Full (11×11) - 11×11", location: "Front Center" },
    mockupCaption: "Gildan 8000 – Black – DTF Print Front Center",
    calc: "15 × $20.00",
    total: "$300.00",
  },
  {
    id: 2,
    color: "purple",
    category: "Apparel/Accessories",
    itemNo: "18500",
    colorName: "Navy",
    totalItems: 10,
    productName: "Gildan - Heavy Blend™ Hooded Sweatshirt",
    sizes: { XS: null, S: null, M: 3, L: 4, XL: 3, "2XL": null },
    imprint: { type: "Embroidery - Left Chest", location: "Left Chest" },
    mockupCaption: "Gildan 18500 – Navy – Embroidery Left Chest",
    calc: "10 × $35.00",
    total: "$350.00",
  },
  {
    id: 3,
    color: "amber",
    category: "Design Services",
    itemNo: "SETUP",
    colorName: null,
    totalItems: 1,
    productName: "Design & Setup Fee",
    description: "Logo digitization, artwork setup, and design coordination",
    sizes: null,
    imprint: null,
    mockupCaption: null,
    calc: "1 × $75.00",
    total: "$75.00",
  },
];

const colorMap = {
  blue: {
    card: "border-[1.62px] border-skyBlue border-l-[5px] ",
    badge: "bg-skyBlue",
    category: "bg-[#F0F7FF]",
    totalVal: "text-skyBlue!",
    imprint: "bg-[#FAF5FF] border-[#E9D4FF]",
    imprintLabel: "text-indigo-700",
    sizeVal: "text-blue-600 border-blue-300",
  },
  purple: {
    card: "border-[#7C3AED] border-[1.62px]  border-l-[5px]  ",
    badge: "bg-[#7C3AED]",
    category: "bg-[#F0F7FF]",
    totalVal: "text-[#7C3AED]!",
    imprint: "bg-[#FAF5FF] border-[#E9D4FF]",
    imprintLabel: "text-[#7C3AED]",
    sizeVal: "text-[#7C3AED] border-purple-300",
  },
  amber: {
    card: "border-[#D97706] border-[1.62px]  border-l-[5px]  ",
    badge: "bg-[#D97706]",
    category: "bg-[#F0F7FF]",
    totalVal: "text-[#D97706]!",
    imprint: "",
    imprintLabel: "",
    sizeVal: "text-amber-700 border-[#D97706]",
  },
};
const QuoteLineItems = () => {
  return (
    <div className=" border-t border-border w-full  ">
      <CommonHeader size="lg" className="my-6">
        Items
      </CommonHeader>
      <div className="space-y-7">
        {lineItems.map((item) => {
          const c = colorMap[item.color as keyof typeof colorMap];
          return (
            <div
              key={item.id}
              className={`rounded-xl border py-4    ${c.card}`}
            >
              <div className="flex items-center gap-1.5 px-6 pb-1 ">
                <span
                  className={`w-4 h-4 rounded-full ${c.badge} text-white flex items-center justify-center text-[10px] font-bold`}
                >
                  {item.id}
                </span>

                <CommonHeader size="lg" className="text-[#64748B]">
                  LINE ITEM
                </CommonHeader>
              </div>
              <div className={`${c.category} flex gap-10 px-6 py-2`}>
                <div>
                  <CommonHeader className="text-[#62748E]!">
                    Category
                  </CommonHeader>
                  <CommonHeader className="text-[#0F172B]! font-semibold!">
                    {item.category}
                  </CommonHeader>
                </div>
                <div>
                  <CommonHeader className="text-[#62748E]!">
                    Item #
                  </CommonHeader>
                  <CommonHeader className="text-[#0F172B]! font-semibold!">
                    {item.itemNo}
                  </CommonHeader>
                </div>
                {item.colorName && (
                  <div>
                    <CommonHeader className="text-[#62748E]!">
                      Color
                    </CommonHeader>
                    <CommonHeader className="text-[#0F172B]! font-semibold!">
                      {item.colorName}
                    </CommonHeader>
                  </div>
                )}
                <div>
                  <div>
                    <CommonHeader className="text-[#62748E]!">
                      Total Items
                    </CommonHeader>
                    <CommonHeader className={` ${c.totalVal} font-semibold! `}>
                      {item.totalItems}
                    </CommonHeader>
                  </div>
                </div>
              </div>

              <div className="px-6 space-y-4.5 pb-4">
                <div className="pt-4.5 ">
                  <CommonHeader size="xl">{item.productName}</CommonHeader>

                  {item.description && (
                    <div className="text-xs text-[#64748B]  ">
                      {item.description}
                    </div>
                  )}
                </div>
                {item.sizes && (
                  <>
                    <div className="text-[10px] font-semibold text-[#64748B] tracking-wider mb-1 ">
                      SIZES
                    </div>
                    <div className="flex gap-1 mb-1 ">
                      {Object.keys(item.sizes).map((s) => (
                        <span
                          key={s}
                          className="text-xs font-semibold text-gray-700 border border-gray-300 rounded px-1.5 py-0.5 bg-white"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-1 mb-4 ">
                      {Object.values(item.sizes).map((v, i) =>
                        v ? (
                          <span
                            key={i}
                            className={`text-xs font-bold border rounded px-1.5 py-0.5 bg-white text-center min-w-[24px] ${c.sizeVal}`}
                          >
                            {v}
                          </span>
                        ) : (
                          <span
                            key={i}
                            className="text-gray-400 text-xs px-1.5 py-0.5"
                          >
                            —
                          </span>
                        ),
                      )}
                    </div>
                  </>
                )}
                <div className="">
                  {item.imprint && (
                    <div className={`rounded-lg border p-2 mb-2 ${c.imprint}`}>
                      <div
                        className={`flex items-center gap-1 text-[10px] font-bold tracking-wider mb-1  ${c.imprintLabel}`}
                      >
                        <Zap className="w-3 h-3" /> IMPRINTS
                      </div>
                      <div className="text-xs text-gray-700">
                        • {item.imprint.type}{" "}
                        <span className="text-gray-400">
                          ({item.imprint.location})
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="">
                  {item.mockupCaption && (
                    <>
                      <div className="flex items-center gap-1 text-[10px]  font-semibold text-[#64748B] tracking-wider mb-1.5">
                        <Image className="w-3 h-3" /> MOCKUP PREVIEW
                      </div>
                      <div className="flex gap-1.5 mb-1">
                        {["Front", "Back"].map((label) => (
                          <div
                            key={label}
                            className="w-12 h-12 rounded-md border border-gray-200 bg-slate-100 flex items-center justify-center text-[9px] text-gray-400"
                          >
                            {label}
                          </div>
                        ))}
                        <div className="w-12 h-12 rounded-md border border-dashed border-gray-300 flex items-center justify-center">
                          <Plus className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                      </div>
                      <div className="text-[10px] text-gray-400 mb-2">
                        {item.mockupCaption}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-black/5 mt-1 px-6">
                <span className="text-xs text-[#64748B]">{item.calc}</span>
                <span className="text-sm font-black text-gray-900">
                  {item.total}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-8 border-t border-border w-full  flex justify-end ">
        <TotalPriceInQuote />
      </div>
    </div>
  );
};

export default QuoteLineItems;
