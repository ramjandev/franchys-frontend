import { useState } from "react";
import { DollarSign, CheckCircle, Clock, XCircle, Download, Filter } from "lucide-react";
import CardContainer from "@/components/shared/CardContainer";
import { transactionsData, getStatusBadge } from "../../components/PaymentStatus";

const metrics = [
  { label: "Total Revenue", val: "$8,100.00", bg: "bg-[#FFFDF5] border-[#FEF3C7]", iconBg: "bg-[#FDE68A]/60", iconColor: "text-[#B45309]", Icon: DollarSign },
  { label: "Completed Payments", val: "18", bg: "bg-[#EFF6FF] border-[#DBEAFE]", iconBg: "bg-[#BFDBFE]/60", iconColor: "text-[#1D4ED8]", Icon: CheckCircle },
  { label: "Pending Payments", val: "3", bg: "bg-[#FAF5FF] border-[#F3E8FF]", iconBg: "bg-[#E9D5FF]/60", iconColor: "text-[#7C3AED]", Icon: Clock },
  { label: "Failed Payments", val: "1", bg: "bg-[#FFF5F5] border-[#FEE2E2]", iconBg: "bg-[#FCA5A5]/60", iconColor: "text-[#DC2626]", Icon: XCircle },
];

const Payment = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "history">("overview");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredTx = statusFilter === "All" ? transactionsData : transactionsData.filter((t) => t.status === statusFilter);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-3xl font-bold text-[#111827] mb-1">Payment Center</h1>
        <p className="text-sm text-[#5C7899]">Manage payment methods, view transactions, and track revenue</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(({ label, val, bg, iconBg, iconColor, Icon }) => (
          <div key={label} className={`border rounded-xl p-6 shadow-xs flex flex-col justify-between ${bg}`}>
            <div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${iconBg}`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <p className="text-sm text-[#5C7899] font-semibold">{label}</p>
            </div>
            <h2 className="text-2xl font-black text-[#111827] mt-1">{val}</h2>
          </div>
        ))}
      </div>

      <CardContainer className="bg-white border border-[#E6EBF2] rounded-2xl shadow-sm !p-0 overflow-hidden">
        <div className="flex items-center gap-6 p-3.5 border-b border-[#F1F5F9] bg-[#F8FAFC]">
          {(["overview", "history"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all capitalize ${
                activeTab === tab ? "bg-[#007FFF] text-white shadow-xs" : "text-[#5C7899] hover:text-[#111827]"
              }`}
            >
              {tab === "history" ? "Transaction History" : tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "overview" ? (
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold text-[#111827] mb-1">Recent Transactions</h3>
              <div className="flex flex-col gap-3">
                {transactionsData.map((tx) => (
                  <div key={tx.id} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:shadow-xs transition-all">
                    <div className="flex flex-col gap-1.5">
                      <span className="font-bold text-[#111827] text-sm leading-tight">{tx.customer}</span>
                      <span className="text-xs text-[#6B7280] font-medium leading-none">{tx.invoice}</span>
                      <span className="text-xs text-[#6B7280] font-medium leading-none mt-1">{tx.method}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-extrabold text-[#111827] text-sm leading-tight">{tx.amount}</span>
                      <span className="text-xs text-[#6B7280] font-medium leading-none mb-1">{tx.date}</span>
                      <div>{getStatusBadge(tx.status)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 mr-1.5">
                    <Filter className="w-4 h-4 text-[#5C7899]" />
                    <span className="text-sm font-semibold text-[#5C7899]">Filter:</span>
                  </div>
                  {["All", "Completed", "Pending", "Failed"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setStatusFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        statusFilter === f ? "bg-[#007FFF] text-white shadow-xs" : "text-[#5C7899] hover:bg-slate-100"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <button className="flex items-center justify-center gap-1.5 px-4 py-2 border border-[#E6EBF2] bg-white rounded-lg text-xs text-[#4B5563] hover:bg-slate-50 font-bold shadow-xs transition-colors">
                  <Download className="w-3.5 h-3.5 text-gray-500" /> Export
                </button>
              </div>

              <div className="border border-[#E6EBF2] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01)] overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="text-xs text-[#5C7899] bg-[#F8FAFC] border-b border-[#E6EBF2]">
                    <tr>
                      {["Payment ID", "Invoice", "Customer", "Amount", "Date", "Method", "Status"].map((h) => (
                        <th key={h} className="px-4 py-3.5 font-bold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {filteredTx.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 text-[#6B7280] font-normal">{tx.id}</td>
                        <td className="px-4 py-3 text-[#4A90E2] font-normal hover:underline cursor-pointer">{tx.invoice}</td>
                        <td className="px-4 py-3 text-[#111827] font-normal">{tx.customer}</td>
                        <td className="px-4 py-3 font-semibold text-[#111827]">{tx.amount}</td>
                        <td className="px-4 py-3 text-[#6B7280] font-normal">{tx.date}</td>
                        <td className="px-4 py-3 text-[#6B7280] font-normal">{tx.method}</td>
                        <td className="px-4 py-3">{getStatusBadge(tx.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </CardContainer>
    </div>
  );
};

export default Payment;
