import DeleteAlert from "@/components/shared/DeleteButton";
import Pagination from "@/components/shared/Pagination";
import { Plus } from "lucide-react";

export const tableDesign = {
  table:
    "w-full border-separate border-spacing-0 border border-[#EEF2FF] rounded-lg overflow-hidden",
  thead: "bg-[#EEF2FF] text-black",
  tbody: "text-[#101828]",
  tr: "border-b last:border-b-0 border-[#EEF2FF] text-[#101828] text-sm",
  th: " py-4 px-6 text-xs font-normal text-[#4A5565] border-b",
  td: " py-4 px-6 text-sm text-[#101828] border-b border-border",
};

const quotes = [
  {
    id: "Q-1001",
    customer: "Riverside Church",
    items: "1 product",
    total: "$1,200.00",
    status: "Approved",
    statusColor: "bg-[#5CB85C]",
    date: "9/1/2025",
  },
  {
    id: "Q-1002",
    customer: "Metro Fire Department",
    items: "1 product",
    total: "$3,920.00",
    status: "Sent",
    statusColor: "bg-[#5BC0DE]",
    date: "9/1/2025",
  },
  {
    id: "Q-1003",
    customer: "Lincoln High School",
    items: "1 product",
    total: "$1,782.00",
    status: "Draft",
    statusColor: "bg-[#A0B0C0]",
    date: "9/1/2025",
  },
  {
    id: "Q-1004",
    customer: "Craft Brewery Co",
    items: "1 product",
    total: "$604.80",
    status: "Approved",
    statusColor: "bg-[#5CB85C]",
    date: "9/1/2025",
  },
  {
    id: "Q-1005",
    customer: "Summit CrossFit",
    items: "1 product",
    total: "$2,816.00",
    status: "Sent",
    statusColor: "bg-[#5BC0DE]",
    date: "9/1/2025",
  },
  {
    id: "Q-1006",
    customer: "Bay Area Tech Summit",
    items: "1 product",
    total: "$8,100.00",
    status: "Approved",
    statusColor: "bg-[#5CB85C]",
    date: "9/1/2025",
  },
  {
    id: "Q-1007",
    customer: "Golden State Realty",
    items: "1 product",
    total: "$756.00",
    status: "Approved",
    statusColor: "bg-[#5CB85C]",
    date: "9/1/2025",
  },
];

const tableHeaders = [
  { label: "Quote", align: "text-left" },
  { label: "Customer", align: "text-left" },
  { label: "Items", align: "text-left" },
  { label: "Total", align: "text-left" },
  { label: "Status", align: "text-center" },
  { label: "Date", align: "text-left" },
  { label: "Mockup", align: "text-center" },
  { label: "Action", align: "text-center" },
];

const QuoteLists = () => {
  return (
    <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-[#5C7899] bg-[#F9FAFB] border-b border-border">
            <tr>
              {tableHeaders.map((item, index) => (
                <th key={index} className={`${item.align} ${tableDesign.th}`}>
                  {item.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {quotes.map((quote) => (
              <tr
                key={quote.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className={tableDesign.td}>
                  <span className="">{quote.id}</span>
                </td>

                <td className={` ${tableDesign.td} text-left! `}>
                  {quote.customer}
                </td>

                <td className={tableDesign.td}>{quote.items}</td>

                <td className={`font-semibold ${tableDesign.td}`}>
                  {quote.total}
                </td>

                <td className={` ${tableDesign.td} text-center`}>
                  <span
                    className={`inline-flex items-center whitespace-nowrap px-2.5 py-1 rounded text-white text-xs font-semibold ${quote.statusColor}`}
                  >
                    {quote.status}
                  </span>
                </td>

                <td className={tableDesign.td}>{quote.date}</td>

                <td className={` ${tableDesign.td} text-center `}>
                  <div className="flex items-center justify-center">
                    <button className="text-blue font-semibold text-xs hover:underline flex items-center justify-center gap-1 ">
                      <Plus className="w-3 h-3" /> Create
                    </button>
                  </div>
                </td>

                <td className={tableDesign.td}>
                  <DeleteAlert action={() => {}} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="py-5">
        <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />
      </div>
    </div>
  );
};

export default QuoteLists;
