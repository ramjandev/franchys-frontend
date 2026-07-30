import CommonHeader from "@/components/shared/CommonHeader";
import { Quote } from "@/store/quote/types/quoteTypes";
import { Image, Plus, Zap } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImagesDialog from "./ImagesDialog";
import TotalPriceInQuote from "./TotalPriceInQuote";

interface QuoteLineItemsProps {
  quote?: Quote;
  isAdmin?: boolean;
}

const colorThemes = [
  {
    card: "border-[1.62px] border-skyBlue border-l-[5px] ",
    badge: "bg-skyBlue",
    category: "bg-[#F0F7FF]",
    totalVal: "text-skyBlue!",
    imprint: "bg-[#FAF5FF] border-[#E9D4FF]",
    imprintLabel: "text-indigo-700",
    sizeVal: "text-blue-600 border-blue-300",
  },
  {
    card: "border-[#7C3AED] border-[1.62px]  border-l-[5px]  ",
    badge: "bg-[#7C3AED]",
    category: "bg-[#F0F7FF]",
    totalVal: "text-[#7C3AED]!",
    imprint: "bg-[#FAF5FF] border-[#E9D4FF]",
    imprintLabel: "text-[#7C3AED]",
    sizeVal: "text-[#7C3AED] border-purple-300",
  },
  {
    card: "border-[#D97706] border-[1.62px]  border-l-[5px]  ",
    badge: "bg-[#D97706]",
    category: "bg-[#F0F7FF]",
    totalVal: "text-[#D97706]!",
    imprint: "",
    imprintLabel: "",
    sizeVal: "text-amber-700 border-[#D97706]",
  },
];

const formatMoney = (n: number | string) => `$${Number(n).toFixed(2)}`;

const QuoteLineItems: React.FC<QuoteLineItemsProps> = ({ quote, isAdmin }) => {
  const lineItems = (quote?.groups ?? []).flatMap((group) =>
    group.lineItems.map((li) => ({ ...li, groupName: group.name })),
  );

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const navigate = useNavigate();
  return (
    <div className=" border-t border-border w-full  ">
      <CommonHeader size="lg" className="my-6">
        Items
      </CommonHeader>

      <div className="space-y-7">
        {lineItems.map((item, index) => {
          const c = colorThemes[index % colorThemes.length];
          const sizeEntries = Object.entries(item.sizeBreakdown ?? {});
          const mockupCaption = [item.itemNumber, item.color, item.imprintType]
            .filter(Boolean)
            .join(" – ");

          return (
            <div
              key={item.id}
              className={`rounded-xl border py-4    ${c.card}`}
            >
              <div className="flex items-center gap-1.5 px-6 pb-1 ">
                <span
                  className={`w-4 h-4 rounded-full ${c.badge} text-white flex items-center justify-center text-[10px] font-bold`}
                >
                  {index + 1}
                </span>

                <CommonHeader size="lg" className="text-[#64748B]">
                  LINE ITEM
                </CommonHeader>
              </div>
              <div
                className={`${c.category} flex flex-col md:flex-row gap-3 md:gap-10 px-6 py-2`}
              >
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
                    {item.itemNumber || "-"}
                  </CommonHeader>
                </div>
                {item.color && (
                  <div>
                    <CommonHeader className="text-[#62748E]!">
                      Color
                    </CommonHeader>
                    <CommonHeader className="text-[#0F172B]! font-semibold!">
                      {item.color}
                    </CommonHeader>
                  </div>
                )}
                <div>
                  <div>
                    <CommonHeader className="text-[#62748E]!">
                      Total Items
                    </CommonHeader>
                    <CommonHeader className={` ${c.totalVal} font-semibold! `}>
                      {item.itemsCount}
                    </CommonHeader>
                  </div>
                </div>
              </div>

              <div className="px-6 space-y-4.5 pb-4">
                <div className="pt-4.5 ">
                  <CommonHeader size="xl">{item.description}</CommonHeader>
                </div>
                {sizeEntries.length > 0 && (
                  <>
                    <div className="text-[10px] font-semibold text-[#64748B] tracking-wider mb-1 ">
                      SIZES
                    </div>
                    <div className="flex gap-1 mb-1 ">
                      {sizeEntries.map(([size]) => (
                        <span
                          key={size}
                          className="text-xs font-semibold text-gray-700 border border-gray-300 rounded px-1.5 py-0.5 bg-white"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-1 mb-4 ">
                      {sizeEntries.map(([size, qty]) =>
                        qty ? (
                          <span
                            key={size}
                            className={`text-xs font-bold border rounded px-1.5 py-0.5 bg-white text-center min-w-[24px] ${c.sizeVal}`}
                          >
                            {qty}
                          </span>
                        ) : (
                          <span
                            key={size}
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
                  {item.imprintType && (
                    <div className={`rounded-lg border p-2 mb-2 ${c.imprint}`}>
                      <div
                        className={`flex items-center gap-1 text-[10px] font-bold tracking-wider mb-1  ${c.imprintLabel}`}
                      >
                        <Zap className="w-3 h-3" /> IMPRINTS
                      </div>
                      <div className="text-xs text-gray-700">
                        • {item.imprintType}
                      </div>
                    </div>
                  )}
                </div>
                <div className="">
                  {item.mockups && item.mockups.length > 0 && (
                    <>
                      <div className="flex items-center gap-1 text-[10px]  font-semibold text-[#64748B] tracking-wider mb-1.5">
                        <Image className="w-3 h-3" /> MOCKUP PREVIEW
                      </div>

                      <div className="flex gap-1.5 mb-1">
                        {item.mockups.map((url, i) => (
                          <div
                            key={url}
                            onClick={() => setPreviewImage(url)}
                            className="w-12 h-12 rounded-md border border-gray-200 bg-slate-100 overflow-hidden cursor-pointer transition hover:scale-105"
                          >
                            <img
                              src={url}
                              alt={`Mockup ${i + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}

                        {isAdmin && (
                          <div
                            onClick={() => navigate("/admin/mockups")}
                            className="w-12 h-12 rounded-md border border-dashed border-gray-300 flex items-center justify-center cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="text-[10px] text-gray-400 mb-2">
                        {mockupCaption}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-black/5 mt-1 px-6">
                <span className="text-xs text-[#64748B]">
                  {item.itemsCount} × {formatMoney(item.unitPrice)}
                </span>
                <span className="text-sm font-black text-gray-900">
                  {formatMoney(item.total)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <ImagesDialog
        previewImage={previewImage}
        setPreviewImage={setPreviewImage}
      />
      <div className="mt-8 pt-8 border-t border-border w-full  flex justify-end ">
        <TotalPriceInQuote quote={quote} />
      </div>
    </div>
  );
};

export default QuoteLineItems;
