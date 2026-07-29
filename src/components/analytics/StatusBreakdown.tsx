import {
  QuoteStatusBreakdown,
  ReportsTopCustomer,
} from "@/store/dashboard/types/dashboard";
import CardContainer from "../shared/CardContainer";

interface StatusBreakdownProps {
  topCustomers: ReportsTopCustomer[];
  quoteStatusBreakdown?: QuoteStatusBreakdown;
}

const statusColorMap: Record<string, string> = {
  approved: "bg-[#10B981]",
  sent: "bg-[#3B82F6]",
  draft: "bg-[#F59E0B]",
  declined: "bg-[#EF4444]",
};

const statusLabelMap: Record<string, string> = {
  approved: "Approved",
  sent: "Sent",
  draft: "Draft",
  declined: "Declined",
};

const StatusBreakdown: React.FC<StatusBreakdownProps> = ({
  topCustomers,
  quoteStatusBreakdown,
}) => {
  const breakdownEntries = quoteStatusBreakdown
    ? Object.entries(quoteStatusBreakdown.breakdown)
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <CardContainer className="bg-white border border-[#E6EBF2] rounded-2xl shadow-sm p-6 overflow-hidden flex flex-col gap-5">
        <h2 className="text-lg font-bold text-[#111827]">Top Customers</h2>
        <div className="flex flex-col gap-4">
          {topCustomers.map((customer, index) => (
            <div
              key={customer.customerId}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#1D4ED8] flex items-center justify-center font-medium text-xs">
                  {index + 1}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-[#111827] text-sm leading-tight">
                    {customer.name}
                  </span>
                  <span className="text-xs text-[#6B7280] font-semibold leading-none">
                    {customer.ordersCount} orders
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <span className="font-medium text-[#111827] text-sm leading-tight">
                  ${customer.totalSpent}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContainer>

      <CardContainer className="bg-white border border-[#E6EBF2] rounded-2xl shadow-sm p-6 overflow-hidden flex flex-col gap-5">
        <h2 className="text-lg font-bold text-[#111827]">
          Quote Status Breakdown
        </h2>
        <div className="flex flex-col gap-5">
          {breakdownEntries.map(([status, entry]) => (
            <div key={status} className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-[#0F172B]">
                  {statusLabelMap[status] ?? status}
                </span>
                <div className="flex items-center gap-1.5 text-[#5C7899]">
                  <span>{entry.count}</span>
                  <span className="text-[10px] font-semibold">
                    ({entry.percentage}%)
                  </span>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    statusColorMap[status] ?? "bg-gray-400"
                  } rounded-full transition-all duration-500`}
                  style={{ width: `${Math.max(4, entry.percentage)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContainer>
    </div>
  );
};

export default StatusBreakdown;
