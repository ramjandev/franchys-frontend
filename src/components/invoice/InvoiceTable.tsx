import type { InvoiceType } from "@/pages/Admin/Invoices";
import { Link } from "react-router-dom";
import { tableDesign } from "../admin/quotes/QuoteLists";
import Pagination from "../shared/Pagination";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Paid":
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#5CB85C] text-white text-xs font-semibold">
          Paid
        </span>
      );
    case "Partial":
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#F0AD4E] text-white text-xs font-semibold">
          Partial
        </span>
      );
    case "Overdue":
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#D9534F] text-white text-xs font-semibold">
          Overdue
        </span>
      );
    case "Unpaid":
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#A0B0C0] text-white text-xs font-semibold">
          Unpaid
        </span>
      );
    default:
      return null;
  }
};

const tableHeaders = [
  { label: "Invoice", align: "text-left" },
  { label: "Customer", align: "text-left" },
  { label: "Amount", align: "text-left" },
  { label: "Balance", align: "text-left" },
  { label: "Status", align: "text-center" },
  { label: "Due", align: "text-left" },
  { label: "Action", align: "text-center" },
];

interface InvoiceTableProps {
  invoicesData: InvoiceType[];
  setIsVoiceDetailsOpen: (value: boolean) => void;
  setIsInvoiceCreate: (value: boolean) => void;
}
const InvoiceTable: React.FC<InvoiceTableProps> = ({
  setIsVoiceDetailsOpen,
  setIsInvoiceCreate,
  invoicesData,
}) => {
  return (
    <div className="bg-white rounded-xl  overflow-hidden">
      <div className="overflow-x-auto">
        <table className={tableDesign.table}>
          <thead className={tableDesign.thead}>
            <tr>
              {tableHeaders.map((item, index) => (
                <th key={index} className={`${item.align} ${tableDesign.th}`}>
                  {item.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={tableDesign.tbody}>
            {invoicesData.map((invoice) => (
              <tr key={invoice.id} className={tableDesign.tr}>
                <td
                  onClick={() => setIsVoiceDetailsOpen(true)}
                  className={tableDesign.td}
                >
                  <span className="text-[#0077FF] font-medium hover:underline cursor-pointer">
                    {invoice.id}
                  </span>
                </td>
                <td className={tableDesign.td}>
                  <div className="text-[#101828] font-medium">
                    {invoice.customer}
                  </div>
                  {invoice.jobId && (
                    <div className="text-xs text-[#A0B0C0] mt-0.5">
                      {invoice.jobId}
                    </div>
                  )}
                </td>
                <td className={`${tableDesign.td} font-semibold`}>
                  {invoice.amount}
                </td>
                <td className={`${tableDesign.td} font-semibold`}>
                  {invoice.balance}
                </td>
                <td className={`${tableDesign.td} text-center`}>
                  {getStatusBadge(invoice.status)}
                </td>
                <td className={tableDesign.td}>{invoice.due}</td>
                <td className={`${tableDesign.td} text-center`}>
                  {invoice.status === "Paid" ? (
                    <Link
                      to={`/admin/invoices/${invoice.id}`}
                      className="text-[#0077FF] font-medium hover:underline cursor-pointer"
                    >
                      View
                    </Link>
                  ) : (
                    <span
                      onClick={() => setIsInvoiceCreate(true)}
                      className="text-[#0077FF] font-medium hover:underline cursor-pointer"
                    >
                      Pay Now
                    </span>
                  )}
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

export default InvoiceTable;
