import BorderTitle from "@/components/invoice/BorderTitle";
import CardContainer from "@/components/shared/CardContainer";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import InfoCard from "@/components/shared/InfoCard";
import { useState } from "react";

const items = [
  { id: 1, description: "Polo Shirt - Navy", size: "M", quantity: 50 },
  { id: 2, description: "Polo Shirt - Navy", size: "L", quantity: 60 },
  { id: 3, description: "Polo Shirt - Navy", size: "XL", quantity: 40 },
  { id: 4, description: "Embroidery Setup", size: "—", quantity: 1 },
  { id: 5, description: "Left Chest Logo", size: "—", quantity: 150 },
];

const qcItems = [
  "All items produced according to specifications",
  "Artwork placement and alignment verified",
  "Color matching approved",
  "Size breakdown confirmed",
  "Final inspection completed",
];

import shirt from "@/assets/images/shirt.jpg";
import InfoCheckbox from "@/components/invoice/InfoCheckbox";
import { FiPackage } from "react-icons/fi";

const InvoiceDetails = () => {
  const [doneCells, setDoneCells] = useState<Record<number, boolean>>({});

  const infoData = [
    {
      label: "Customer",
      value: "Company Status Workflow",
      bg: "bg-[#F8F9FB] border-[#E2E8F0]",
      labelColor: "text-[#64748B]",
      valueColor: "text-[#294566]",
    },
    {
      label: "Order Date",
      value: "Dec 18, 2025",
      bg: "bg-[#F8F9FB] border-[#E2E8F0]",
      labelColor: "text-[#64748B]",
      valueColor: "text-[#294566]",
    },
    {
      label: "Due Date",
      value: "Jan 15, 2026",

      bg: "bg-[#FEF2F2] border-[#FECACA]",
      labelColor: "text-[#991B1B]",
      valueColor: "text-[#DC2626]",
    },
    {
      label: "Total Units",
      value: "150",

      bg: "bg-[#F0FDF4] border-[#BBF7D0]",
      labelColor: "text-[#166534]",
      valueColor: "text-[#16A34A]",
    },
  ];
  return (
    <CardContainer
      size="3xl"
      className="shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),_0_4px_6px_-4px_rgba(0,0,0,0.10)] max-w-[1356px] mx-auto"
    >
      <div className=" space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CommonButton className="bg-[#FF8B5A]! text-white! rounded-full! py-1.5! cursor-auto!">
              Production Sheet
            </CommonButton>

            <h1 className="text-2xl sm:text-4xl font-black text-[#294566] tracking-tight leading-none">
              Job #Q-1001
            </h1>

            <CommonHeader className="text-[#5C7899]!">
              For Production Team Only · No Pricing Info
            </CommonHeader>
          </div>
          <button className=" border border-[#FF6B6B]/37 text-[#FF6B6B] text-sm font-bold px-5 py-2 rounded-xl hover:bg-[#e07b39] hover:text-white transition-all duration-200 tracking-wide bg-[#FF6B6B]/12">
            Art
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {infoData.map((item) => (
            <InfoCard
              key={item.label}
              label={item.label}
              value={item.value}
              cardClassName={item.bg}
              labelClassName={item.labelColor}
              valueClassName={item.valueColor}
            />
          ))}
        </div>

        <section className="space-y-4">
          <BorderTitle title="Artwork / Mockup" />

          <div className="rounded-2xl border border-[#CBD5E1] bg-[linear-gradient(135deg,_#F8F9FB_0%,_#F4F6F9_16.67%,_#F1F3F7_33.33%,_#EDF0F6_50%,_#E9EEF4_66.67%,_#E6EBF2_83.33%,_#E2E8F0_100%)] shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.05)] p-8">
            <div className="rounded-[14px] bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.10),_0_2px_4px_-2px_rgba(0,0,0,0.10)] p-6">
              <div className="flex items-center justify-center">
                <div className="w-[400px] h-[400px] rounded-[10px] overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={shirt}
                    alt="shirt"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <BorderTitle title="Decoration Method & Specifications" />
          <InfoCard
            label="Embroidery – Left Chest"
            value="Embroidery thread: Navy #3842. Position: 4″ from shoulder seam,
                centered."
            cardClassName="border border-[#FF8B5A] bg-[linear-gradient(90deg,_#FFF7ED_0%,_#FFF6EA_14.29%,_#FFF4E6_28.57%,_#FFF3E3_42.86%,_#FFF1DF_57.14%,_#FFF0DC_71.43%,_#FFEED8_85.71%,_#FFEDD5_100%)] shadow-[0_1px_3px_0_rgba(0,0,0,0.10),_0_1px_2px_-1px_rgba(0,0,0,0.10)]"
            image={
              <div className="w-10 h-10 rounded-xl bg-yellow  flex items-center justify-center shrink-0">
                <FiPackage className="text-white text-2xl" />
              </div>
            }
            labelClassName="text-[#294566]! font-bold"
            valueClassName="text-[#5C7899]! font-normal! "
          />
        </section>

        <section className="space-y-4 overflow-hidden ">
          <BorderTitle title="Items to Produce" />
          <div className=" rounded-2xl overflow-hidden border border-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#294566]">
                  {["Item Description", "Size", "Quantity", "Done"].map(
                    (h, i) => (
                      <th
                        key={h}
                        className={`px-5 py-3 text-center ${i === 0 && "text-left!"} text-[13px] font-bold tracking-[0.12em] uppercase text-white`}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={`border-t border-border transition-colors ${
                      doneCells[item.id]
                        ? "bg-emerald-50"
                        : idx % 2 === 0
                          ? "bg-white"
                          : "bg-[#fafaf8]"
                    }`}
                  >
                    <td className="px-5 py-3.5 text-[#294566] font-medium text-[15px] text-left">
                      {item.description}
                    </td>
                    <td className="px-5 py-3.5 text-[#5C7899] text-[15px] text-center">
                      {item.size}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-[#294566] text-[15px] text-center">
                      {item.quantity}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <div className="flex justify-center">
                        <InfoCheckbox
                          checked={doneCells[item.id]}
                          onChange={(checked) => {
                            setDoneCells({
                              ...doneCells,
                              [item.id]: checked,
                            });
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <BorderTitle title="Additional Production Notes" />
          <InfoCard
            label="Customer wants navy blue polos with company logo on left chest. Logo artwork approved."
            cardClassName="bg-[#FFFBEB]! border-[#FDE68A]!"
            labelClassName="text-[#78350F]! py-2"
          />
        </section>

        <section className="space-y-4">
          <BorderTitle title="Quality Control Checklist" />
          <div className="flex flex-col gap-3 ">
            {qcItems.map((item, i) => (
              <InfoCheckbox
                key={i}
                label={item}
                className="bg-white border border-border rounded-xl px-4 py-3.5 cursor-pointer select-none hover:border-[#CBD5E1] transition-colors"
              />
            ))}
          </div>
        </section>
      </div>
    </CardContainer>
  );
};

export default InvoiceDetails;
