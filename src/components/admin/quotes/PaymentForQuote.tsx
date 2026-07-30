import CardContainer from "@/components/shared/CardContainer";
import CommonHeader from "@/components/shared/CommonHeader";
import {
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Pencil,
  Send,
} from "lucide-react";
import { useState } from "react";

const paymentOptions = [
  { id: "card", label: "Credit Card / Debit Card (via Stripe)" },
  { id: "ach", label: "ACH / Bank Transfer" },
  { id: "cash", label: "Cash / Check (Manual)" },
];

const orderHistory = [
  {
    id: 1,
    icon: FileText,
    iconBg: "bg-[#EFF6FF]",
    iconColor: "text-[#2563EB]",
    title: "Quote Created",
    desc: "Quote #Q-2026-0511 was created",
    by: "by Jackson D.",
    date: "May 11, 2026",
    time: "9:15 AM",
  },
  {
    id: 2,
    icon: Pencil,
    iconBg: "bg-[#FFFBEB]",
    iconColor: "text-[#D97706]",
    title: "Quote Modified",
    desc: "Payment terms updated from Net 30 to Net 15",
    by: "by Jackson D.",
    date: "May 11, 2026",
    time: "10:30 AM",
  },
  {
    id: 3,
    icon: Send,
    iconBg: "bg-[#EFF6FF]",
    iconColor: "text-[#2563EB]",
    title: "Quote Sent to Customer",
    desc: "Quote sent to customer@example.com",
    by: "by Jackson D.",
    date: "May 11, 2026",
    time: "11:00 AM",
  },
  {
    id: 4,
    icon: CheckCircle,
    iconBg: "bg-[#F0FDF4]",
    iconColor: "text-[#16A34A]",
    title: "Quote Approved",
    desc: "Customer approved the quote",
    by: "by Customer",
    date: "May 11, 2026",
    time: "2:20 PM",
  },
  {
    id: 5,
    icon: DollarSign,
    iconBg: "bg-[#F0FDF4]",
    iconColor: "text-[#16A34A]",
    title: "Payment Received",
    desc: "Payment of $5,450.00 received via Stripe",
    by: "by System",
    date: "May 11, 2026",
    time: "2:25 PM",
  },
  {
    id: 6,
    icon: Clock,
    iconBg: "bg-[#F5F3FF]",
    iconColor: "text-[#7C3AED]",
    title: "Status Changed",
    desc: "Quote converted to Job #J-2026-0511",
    by: "by System",
    date: "May 11, 2026",
    time: "2:26 PM",
  },
];

const PaymentForQuote = () => {
  const [checked, setChecked] = useState<string[]>([]);

  const toggle = (id: string) =>
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  return (
    <CardContainer>
      <CommonHeader size="lg" className="mb-2">
        Payment Collection
      </CommonHeader>
      <CommonHeader className="mb-6">
        Configure how you'll collect payment when the customer approves this
        quote
      </CommonHeader>

      <div className="bg-[#F0FDF4] border border-[#B9F8CF] rounded-xl p-5 mb-4">
        <CommonHeader size="lg" className="mb-1 text-[#0D542B]!">
          Payment Options for Customer
        </CommonHeader>
        <CommonHeader size="sm" className="mb-4 text-[#008236]!">
          After approval, the customer will be able to pay using:
        </CommonHeader>

        <div className="space-y-3">
          {paymentOptions.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-2.5 text-sm text-[#008236] font-medium cursor-pointer"
            >
              <input
                type="checkbox"
                checked={checked.includes(opt.id)}
                onChange={() => toggle(opt.id)}
                className="w-4 h-4 rounded border-[#86EFAC] text-[#008236] accent-[#008236] cursor-pointer"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div className="border border-[#E6EBF2] rounded-xl p-4 text-sm text-[#5C7899] bg-[#F8FAFC] mb-8">
        Once the customer approves the quote and makes payment, you'll receive a
        notification and the quote will be converted to a job automatically.
      </div>
      <div className="border-t border-border-[#E6EBF2] py-6">
        <CommonHeader size="lg">Order History</CommonHeader>
        <CommonHeader size="sm">
          Complete timeline of all changes, approvals, and actions taken on this
          quote
        </CommonHeader>
      </div>
      <div className="space-y-0">
        {orderHistory.map((item, idx) => {
          const Icon = item.icon;
          const isLast = idx === orderHistory.length - 1;
          return (
            <div key={item.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.iconBg}`}
                >
                  <Icon className={`w-4 h-4 ${item.iconColor}`} />
                </div>
                {!isLast && <div className="w-0.5 flex-1 bg-[#E6EBF2] my-1" />}
              </div>

              {/* Content */}
              <div className={`flex-1 pb-5 ${isLast ? "" : ""}`}>
                <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-4">
                  <div>
                    <CommonHeader
                      size="sm"
                      className="text-[#0F172B]! font-semibold!"
                    >
                      {item.title}
                    </CommonHeader>
                    <CommonHeader size="xs" className="">
                      {item.desc}
                    </CommonHeader>
                    <CommonHeader size="xs" className="">
                      {item.by}
                    </CommonHeader>
                  </div>
                  <div className="text-right  gap-2 shrink-0 flex">
                    <CommonHeader size="xs" className="">
                      {item.date}
                    </CommonHeader>
                    <CommonHeader
                      size="xs"
                      className="text-[#475569]! font-medium!"
                    >
                      {item.time}
                    </CommonHeader>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </CardContainer>
  );
};

export default PaymentForQuote;
