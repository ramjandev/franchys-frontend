import { useState } from "react";
import { DollarSign, CheckCircle, Clock, XCircle, Download, Filter } from "lucide-react";
import CardContainer from "@/components/shared/CardContainer";

const transactionsData = [
  {
    id: "PAY-001",
    invoice: "INV-2024-089",
    customer: "Acme Corp",
    amount: "$1250.00",
    date: "2026-05-08",
    method: "Visa •••• 4242",
    status: "Completed",
  },
  {
    id: "PAY-002",
    invoice: "INV-2024-088",
    customer: "TechStart Inc",
    amount: "$750.50",
    date: "2026-05-07",
    method: "Mastercard •••• 5555",
    status: "Completed",
  },
  {
    id: "PAY-003",
    invoice: "INV-2024-087",
    customer: "Creative Agency",
    amount: "$2100.00",
    date: "2026-05-06",
    method: "Bank Transfer",
    status: "Pending",
  },
  {
    id: "PAY-004",
    invoice: "INV-2024-086",
    customer: "Local Bakery",
    amount: "$450.00",
    date: "2026-05-05",
    method: "Visa •••• 4242",
    status: "Failed",
  },
  {
    id: "PAY-005",
    invoice: "INV-2024-085",
    customer: "Fashion Brand",
    amount: "$3200.00",
    date: "2026-05-04",
    method: "Mastercard •••• 5555",
    status: "Completed",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Completed":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4CAF50] text-white text-[11px] font-bold shadow-xs">
          <CheckCircle className="w-3.5 h-3.5" />
          Completed
        </span>
      );
    case "Pending":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2196F3] text-white text-[11px] font-bold shadow-xs">
          <Clock className="w-3.5 h-3.5" />
          Pending
        </span>
      );
    case "Failed":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F44336] text-white text-[11px] font-bold shadow-xs">
          <XCircle className="w-3.5 h-3.5" />
          Failed
        </span>
      );
    default:
      return null;
  }
};

const Payment = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "history">("overview");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredTx =
    statusFilter === "All"
      ? transactionsData
      : transactionsData.filter((t) => t.status === statusFilter);

  return (
    <div className="flex flex-col gap-6  w-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#111827] mb-1">Payment Center</h1>
        <p className="text-sm text-[#5C7899]">
          Manage payment methods, view transactions, and track revenue
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-[#FFFDF5] border border-[#FEF3C7] rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-[#FDE68A]/60 flex items-center justify-center mb-3">
              <DollarSign className="w-5 h-5 text-[#B45309]" />
            </div>
            <p className="text-sm text-[#5C7899] font-semibold">Total Revenue</p>
          </div>
          <h2 className="text-2xl font-black text-[#111827] mt-1">$8,100.00</h2>
        </div>

        {/* Completed Payments */}
        <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-[#BFDBFE]/60 flex items-center justify-center mb-3">
              <CheckCircle className="w-5 h-5 text-[#1D4ED8]" />
            </div>
            <p className="text-sm text-[#5C7899] font-semibold">Completed Payments</p>
          </div>
          <h2 className="text-2xl font-black text-[#111827] mt-1">18</h2>
        </div>

        {/* Pending Payments */}
        <div className="bg-[#FAF5FF] border border-[#F3E8FF] rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-[#E9D5FF]/60 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5 text-[#7C3AED]" />
            </div>
            <p className="text-sm text-[#5C7899] font-semibold">Pending Payments</p>
          </div>
          <h2 className="text-2xl font-black text-[#111827] mt-1">3</h2>
        </div>

        {/* Failed Payments */}
        <div className="bg-[#FFF5F5] border border-[#FEE2E2] rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-[#FCA5A5]/60 flex items-center justify-center mb-3">
              <XCircle className="w-5 h-5 text-[#DC2626]" />
            </div>
            <p className="text-sm text-[#5C7899] font-semibold">Failed Payments</p>
          </div>
          <h2 className="text-2xl font-black text-[#111827] mt-1">1</h2>
        </div>
      </div>

      {/* Main Tab Content Card Container enclosing the Tab Bar inside the header row */}
      <CardContainer className="bg-white border border-[#E6EBF2] rounded-2xl shadow-sm !p-0 overflow-hidden">
        {/* Tab Switcher Header Row */}
        <div className="flex items-center gap-6 p-3.5 border-b border-[#F1F5F9] bg-[#F8FAFC]">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === "overview"
                ? "bg-[#007FFF] text-white shadow-xs"
                : "text-[#5C7899] hover:text-[#111827]"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === "history"
                ? "bg-[#007FFF] text-white shadow-xs"
                : "text-[#5C7899] hover:text-[#111827]"
            }`}
          >
            Transaction History
          </button>
        </div>

        {/* Tab Body Contents Container */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold text-[#111827] mb-1">Recent Transactions</h3>
              <div className="flex flex-col gap-3">
                {transactionsData.map((tx) => (
                  <div
                    key={tx.id}
                    className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:shadow-xs transition-all"
                  >
                    <div className="flex flex-col gap-1.5">
                      <span className="font-bold text-[#111827] text-base leading-tight">{tx.customer}</span>
                      <span className="text-xs text-[#6B7280] font-medium leading-none">{tx.invoice}</span>
                      <span className="text-xs text-[#6B7280] font-medium leading-none">{tx.method}</span>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-extrabold text-[#111827] text-base leading-tight">{tx.amount}</span>
                      <span className="text-xs text-[#6B7280] font-medium leading-none">{tx.date}</span>
                      <div>{getStatusBadge(tx.status)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transaction History Tab */}
          {activeTab === "history" && (
            <div className="flex flex-col gap-5">
              {/* Filter and Export Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 mr-1.5">
                    <Filter className="w-4 h-4 text-[#5C7899]" />
                    <span className="text-sm font-semibold text-[#5C7899]">Filter by status:</span>
                  </div>
                  {["All", "Completed", "Pending", "Failed"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setStatusFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        statusFilter === f
                          ? "bg-[#007FFF] text-white shadow-xs"
                          : "text-[#5C7899] hover:bg-slate-100"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <button className="flex items-center justify-center gap-1.5 px-4 py-2 border border-[#E6EBF2] bg-white rounded-lg text-xs text-[#4B5563] hover:bg-slate-50 font-bold shadow-xs transition-colors self-start sm:self-auto">
                  <Download className="w-3.5 h-3.5 text-gray-500" />
                  Export
                </button>
              </div>

              {/* Rounded Table */}
              <div className="border border-[#E6EBF2] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-[#5C7899] bg-[#F8FAFC] border-b border-[#E6EBF2]">
                      <tr>
                        <th className="px-4 py-3.5 font-bold">Payment ID</th>
                        <th className="px-4 py-3.5 font-bold">Invoice</th>
                        <th className="px-4 py-3.5 font-bold">Customer</th>
                        <th className="px-4 py-3.5 font-bold">Amount</th>
                        <th className="px-4 py-3.5 font-bold">Date</th>
                        <th className="px-4 py-3.5 font-bold">Method</th>
                        <th className="px-4 py-3.5 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9]">
                      {filteredTx.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3 text-[#6B7280] font-semibold">{tx.id}</td>
                          <td className="px-4 py-3 text-[#007FFF] font-bold hover:underline cursor-pointer">
                            {tx.invoice}
                          </td>
                          <td className="px-4 py-3 text-[#111827] font-bold">{tx.customer}</td>
                          <td className="px-4 py-3 font-extrabold text-[#111827]">{tx.amount}</td>
                          <td className="px-4 py-3 text-[#6B7280] font-semibold">{tx.date}</td>
                          <td className="px-4 py-3 text-[#6B7280] font-semibold">{tx.method}</td>
                          <td className="px-4 py-3">{getStatusBadge(tx.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContainer>
    </div>
  );
};

export default Payment;
