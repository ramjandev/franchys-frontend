import { transactionsData } from "@/pages/Admin/Payment";
import StatusBadge from "../shared/StatusBadge";

const Overview = () => {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-bold text-[#111827] mb-1">
        Recent Transactions
      </h3>
      <div className="flex flex-col gap-3">
        {transactionsData.map((tx) => (
          <div
            key={tx.id}
            className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:shadow-xs transition-all"
          >
            <div className="flex flex-col gap-1.5">
              <span className="font-bold text-[#111827] text-sm leading-tight">
                {tx.customer}
              </span>
              <span className="text-xs text-[#6B7280] font-medium leading-none">
                {tx.invoice}
              </span>
              <span className="text-xs text-[#6B7280] font-medium leading-none mt-1">
                {tx.method}
              </span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="font-extrabold text-[#111827] text-sm leading-tight">
                {tx.amount}
              </span>
              <span className="text-xs text-[#6B7280] font-medium leading-none mb-1">
                {tx.date}
              </span>
              <div>
                <StatusBadge status={tx.status} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;
