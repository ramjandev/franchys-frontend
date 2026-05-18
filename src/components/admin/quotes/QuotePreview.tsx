import CardContainer from "@/components/shared/CardContainer";
import CommonButton from "@/components/shared/CommonButton";
import { ArrowLeft, CreditCard, Image, Plus, Zap } from "lucide-react";
import { BiEdit } from "react-icons/bi";
import { FiFileText } from "react-icons/fi";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import QuoteHeader from "./QuoteHeader";
import QuoteStatus from "./QuoteStatus";

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
    card: "border-blue-200 bg-blue-50",
    badge: "bg-blue-600",
    totalVal: "text-blue-600",
    imprint: "bg-indigo-50 border-indigo-200",
    imprintLabel: "text-indigo-700",
    sizeVal: "text-blue-600 border-blue-300",
  },
  purple: {
    card: "border-purple-200 bg-purple-50",
    badge: "bg-purple-700",
    totalVal: "text-purple-700",
    imprint: "bg-purple-50 border-purple-200",
    imprintLabel: "text-purple-700",
    sizeVal: "text-purple-700 border-purple-300",
  },
  amber: {
    card: "border-amber-300 bg-amber-50",
    badge: "bg-amber-600",
    totalVal: "text-amber-700",
    imprint: "",
    imprintLabel: "",
    sizeVal: "text-amber-700 border-amber-300",
  },
};

const QuotePreview = () => {
  const navigate = useNavigate();
  return (
    <div className="">
      <div className="flex items-center justify-between mb-6">
        <p
          onClick={() => navigate(-1)}
          className="mt-3 cursor-pointer text-skyBlue  flex items-center gap-1.5"
        >
          <ArrowLeft className="w-5 h-5 " />
          Back to Quotes
        </p>
        <div className="flex items-center gap-2">
          <CommonButton className="bg-[#FF8B5A]! text-white!">
            <FiFileText className="w-3.5 h-3.5" />
            Production Sheet
          </CommonButton>
          <CommonButton className="">
            <BiEdit className="w-3.5 h-3.5" />
            Admin View
          </CommonButton>
          <CommonButton className="">
            <MdOutlineRemoveRedEye className="w-3.5 h-3.5" />
            Public Invoice View
          </CommonButton>
        </div>
      </div>

      <div className="flex gap-3 items-start">
        <CardContainer size="lg" className="flex-1 ">
          <QuoteHeader />

          {/* Items */}
          <div className="text-sm font-bold text-gray-900 mb-3">Items</div>

          {lineItems.map((item) => {
            const c = colorMap[item.color as keyof typeof colorMap];
            return (
              <div
                key={item.id}
                className={`rounded-xl border p-3.5 mb-3 ${c.card}`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 tracking-wide mb-2">
                  <span
                    className={`w-4 h-4 rounded-full ${c.badge} text-white flex items-center justify-center text-[10px] font-bold`}
                  >
                    {item.id}
                  </span>
                  LINE ITEM
                </div>

                <div className="flex gap-4 mb-2">
                  <div>
                    <div className="text-[10px] text-gray-400 font-medium">
                      Category
                    </div>
                    <div className="text-xs font-bold text-gray-900">
                      {item.category}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 font-medium">
                      Item #
                    </div>
                    <div className="text-xs font-bold text-gray-900">
                      {item.itemNo}
                    </div>
                  </div>
                  {item.colorName && (
                    <div>
                      <div className="text-[10px] text-gray-400 font-medium">
                        Color
                      </div>
                      <div className="text-xs font-bold text-gray-900">
                        {item.colorName}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-[10px] text-gray-400 font-medium">
                      Total Items
                    </div>
                    <div className={`text-xs font-bold ${c.totalVal}`}>
                      {item.totalItems}
                    </div>
                  </div>
                </div>

                <div className="text-sm font-bold text-gray-900 mb-1">
                  {item.productName}
                </div>
                {item.description && (
                  <div className="text-xs text-gray-500 mb-2">
                    {item.description}
                  </div>
                )}

                {item.sizes && (
                  <>
                    <div className="text-[10px] font-semibold text-gray-500 tracking-wider mb-1">
                      SIZES
                    </div>
                    <div className="flex gap-1 mb-1">
                      {Object.keys(item.sizes).map((s) => (
                        <span
                          key={s}
                          className="text-xs font-semibold text-gray-700 border border-gray-300 rounded px-1.5 py-0.5 bg-white"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-1 mb-2">
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

                {item.imprint && (
                  <div className={`rounded-lg border p-2 mb-2 ${c.imprint}`}>
                    <div
                      className={`flex items-center gap-1 text-[10px] font-bold tracking-wider mb-1 ${c.imprintLabel}`}
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

                {item.mockupCaption && (
                  <>
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-gray-500 tracking-wider mb-1.5">
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

                <div className="flex justify-between items-center pt-2 border-t border-black/5 mt-1">
                  <span className="text-xs text-gray-500">{item.calc}</span>
                  <span className="text-sm font-black text-gray-900">
                    {item.total}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Summary */}
          <div className="pt-4 border-t border-gray-100">
            {[
              ["Subtotal:", "$725.00", ""],
              ["Discount (3.45%):", "-$25.00", "text-red-500"],
              ["Tax (8%):", "$56.00", ""],
            ].map(([k, v, cls]) => (
              <div
                key={k}
                className="flex justify-between text-xs text-gray-500 py-1"
              >
                <span>{k}</span>
                <span className={`font-semibold text-gray-900 ${cls}`}>
                  {v}
                </span>
              </div>
            ))}

            <div className="flex justify-between items-center bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 my-2">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-orange-600" />
                <div>
                  <div className="text-xs font-semibold text-orange-700">
                    Credit Card Fee (3.5%)
                  </div>
                  <div className="text-[10px] text-orange-500">
                    Applied when paying by card
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-orange-700">
                  +$26.46
                </span>
                <div className="w-8 h-4 bg-green-500 rounded-full relative cursor-pointer">
                  <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t-2 border-gray-200">
              <span className="text-sm font-black text-gray-900">
                Total Amount:
              </span>
              <span className="text-2xl font-black text-blue-600">$782.46</span>
            </div>
          </div>
        </CardContainer>

        <QuoteStatus />
      </div>
    </div>
  );
};

export default QuotePreview;
