import { PaymentHistoryItem } from "@/pages/Admin/Payment";
import { Download, Filter } from "lucide-react";
import CommonButton from "../shared/CommonButton";
import StatusBadge from "../shared/StatusBadge";
import CommonTabs from "./CommonTabs";

interface TransactionHistoryProps {
  filteredTx: PaymentHistoryItem[];
  setStatusFilter: (f: string) => void;
  statusFilter: string;
  isLoading?: boolean;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  filteredTx,
  statusFilter,
  setStatusFilter,
  isLoading,
}) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 mr-1.5">
            <Filter className="w-4 h-4 text-[#5C7899]" />
            <span className="text-sm font-semibold text-[#5C7899]">
              Filter:
            </span>
          </div>

          <CommonTabs
            tabs={[
              { label: "All", value: "All" },
              { label: "Completed", value: "Completed" },
              { label: "Pending", value: "Pending" },
              { label: "Failed", value: "Failed" },
            ]}
            activeTab={statusFilter}
            onChange={setStatusFilter}
          />
        </div>

        <CommonButton variant="secondary">
          <Download />
          Export
        </CommonButton>
      </div>

      <div className="border border-[#E6EBF2] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01)] overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-xs text-[#5C7899] bg-[#F8FAFC] border-b border-[#E6EBF2]">
            <tr>
              {[
                "Payment ID",
                "Invoice",
                "Customer",
                "Amount",
                "Date",
                "Method",
                "Status",
              ].map((h) => (
                <th key={h} className="px-4 py-3.5 font-bold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {isLoading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-[#6B7280]"
                >
                  Loading transactions…
                </td>
              </tr>
            ) : filteredTx.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-[#6B7280]"
                >
                  No transactions found.
                </td>
              </tr>
            ) : (
              filteredTx.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-4 py-3 text-[#6B7280] font-normal">
                    {tx.paymentId}
                  </td>
                  <td className="px-4 py-3 text-[#4A90E2] font-normal hover:underline cursor-pointer">
                    {tx.invoiceNumber}
                  </td>
                  <td className="px-4 py-3 text-[#111827] font-normal">
                    {tx.customerName}
                  </td>
                  <td className="px-4 py-3 font-semibold text-[#111827]">
                    {formatCurrency(tx.amount)}
                  </td>
                  <td className="px-4 py-3 text-[#6B7280] font-normal">
                    {formatDate(tx.date)}
                  </td>
                  <td className="px-4 py-3 text-[#6B7280] font-normal">
                    {tx.method ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={tx.status.toLocaleLowerCase()} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
