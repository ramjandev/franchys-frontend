import CommonHeader from "@/components/shared/CommonHeader";
import { ArrowRight } from "lucide-react";

const mockQuotes = [
  {
    id: "Q-1001",
    customer: "Riverside Church",
    amount: "$1,200",
    status: "Approved",
    date: "9/1/2025",
  },
  {
    id: "Q-1002",
    customer: "Metro Fire Department",
    amount: "$3,920",
    status: "Sent",
    date: "9/30/2025",
  },
  {
    id: "Q-1003",
    customer: "Lincoln High School",
    amount: "$1,782",
    status: "Draft",
    date: "9/5/2025",
  },
  {
    id: "Q-1004",
    customer: "Craft Brewery Co",
    amount: "$604.8",
    status: "Approved",
    date: "9/8/2025",
  },
  {
    id: "Q-1005",
    customer: "Summit CrossFit",
    amount: "$2,816",
    status: "Sent",
    date: "9/20/2025",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-700";
    case "Sent":
      return "bg-yellow-100 text-yellow-700";
    case "Draft":
      return "bg-slate-100 text-slate-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

export const tableDesign = {
  table:
    "w-full rounded-b-[16px] border-[1.173px] border-border bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)] overflow-hidden",
  thead: "border-b border-[#F1F5F9]  bg-[#F8FAFC]",
  tbody: "",
  tr: "border-b border-[#F1F5F9] hover:bg-[#F8FAFC] last:border-b-0",
  th: "text-left text-xs font-semibold text-[#45556C] uppercase tracking-wider p-6",
  td: "p-6 text-[#0F172B]",
};

export const tableHeaders = [
  { label: "Quote", align: "text-left" },
  { label: "Customer", align: "text-left" },
  { label: "Amount", align: "text-left" },
  { label: "Status", align: "text-left" },
  { label: "Date", align: "text-left" },
];

const RecentQuotes = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between border-b-[1.173px] border-border  p-6  bg-gradient-to-r from-[#F8FAFC] to-white rounded-t-[16px]">
        <CommonHeader size="lg" className="">
          Recent Quotes
        </CommonHeader>
        <CommonHeader size="sm" className="text-[#155DFC]! cursor-pointer">
          View all <ArrowRight className="w-4 h-4" />
        </CommonHeader>
      </div>

      <div className="overflow-x-auto h-full flex-1 ">
        <table className={tableDesign.table}>
          <thead className={tableDesign.thead}>
            <tr className={tableDesign.tr}>
              {tableHeaders.map((header) => (
                <th
                  key={header.label}
                  className={`${tableDesign.th} ${header.align}`}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={tableDesign.tbody}>
            {mockQuotes.map((quote) => (
              <tr key={quote.id} className={tableDesign.tr}>
                <td className={tableDesign.td}>
                  <a href="#" className="text-[#155DFC]  font-medium">
                    {quote.id}
                  </a>
                </td>
                <td className={`${tableDesign.td} `}>{quote.customer}</td>
                <td className={`${tableDesign.td}  font-bold!`}>
                  {quote.amount}
                </td>
                <td className={tableDesign.td}>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(quote.status)}`}
                  >
                    {quote.status}
                  </span>
                </td>
                <td
                  className={`${tableDesign.td} text-[#45556C]! font-normal!`}
                >
                  {quote.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentQuotes;
