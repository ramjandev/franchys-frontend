import { quoteStatuses, topCustomers } from "@/pages/Admin/AnalyticsData";
import CardContainer from "../shared/CardContainer";

const StatusBreakdown = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <CardContainer className="bg-white border border-[#E6EBF2] rounded-2xl shadow-sm p-6 overflow-hidden flex flex-col gap-5">
        <h2 className="text-lg font-bold text-[#111827]">Top Customers</h2>
        <div className="flex flex-col gap-4">
          {topCustomers.map((cust) => (
            <div key={cust.rank} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#1D4ED8] flex items-center justify-center font-medium text-xs">
                  {cust.rank}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-[#111827] text-sm leading-tight">
                    {cust.name}
                  </span>
                  <span className="text-xs text-[#6B7280] font-semibold leading-none">
                    {cust.orders}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <span className="font-medium text-[#111827] text-sm leading-tight">
                  {cust.amount}
                </span>
                <span className="text-[11px] text-[#10B981] font-bold leading-none">
                  {cust.trend}
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
          {quoteStatuses.map((status) => {
            const fillW = 28 > 0 ? (status.count / 28) * 100 : 0;
            return (
              <div key={status.name} className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-[#0F172B]">{status.name}</span>
                  <div className="flex items-center gap-1.5 text-[#5C7899]">
                    <span>{status.count}</span>
                    <span className="text-[10px] font-semibold">
                      ({status.percent})
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${status.color} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.max(4, fillW)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContainer>
    </div>
  );
};

export default StatusBreakdown;
