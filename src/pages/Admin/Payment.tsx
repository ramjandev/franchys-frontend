import { useState } from "react";
import { DollarSign, CheckCircle, Clock, XCircle, Download, Filter } from "lucide-react";

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
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#D1FAE5] text-[#065F46] text-xs font-semibold">
          <CheckCircle className="w-3.5 h-3.5" />
          Completed
        </span>
      );
    case "Pending":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#DBEAFE] text-[#1D4ED8] text-xs font-semibold">
          <Clock className="w-3.5 h-3.5" />
          Pending
        </span>
      );
    case "Failed":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FEE2E2] text-[#B91C1C] text-xs font-semibold">
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
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-[#111827] mb-1">Payment Center</h1>
        <p className="text-sm text-[#5C7899]">
          Manage payment methods, view transactions, and track revenue
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFFFF0] border border-[#FEF3C7] rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="w-10 h-10 rounded-lg bg-[#FDE68A] flex items-center justify-center mb-3">
            <DollarSign className="w-5 h-5 text-[#B45309]" />
          </div>
          <p className="text-sm text-[#5C7899] font-medium">Total Revenue</p>
          <h2 className="text-2xl font-bold text-[#111827] mt-1">$8,100.00</h2>
        </div>

        <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="w-10 h-10 rounded-lg bg-[#A7F3D0] flex items-center justify-center mb-3">
            <CheckCircle className="w-5 h-5 text-[#059669]" />
          </div>
          <p className="text-sm text-[#5C7899] font-medium">Completed Payments</p>
          <h2 className="text-2xl font-bold text-[#111827] mt-1">18</h2>
        </div>

        <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="w-10 h-10 rounded-lg bg-[#BFDBFE] flex items-center justify-center mb-3">
            <Clock className="w-5 h-5 text-[#2563EB]" />
          </div>
          <p className="text-sm text-[#5C7899] font-medium">Pending Payments</p>
          <h2 className="text-2xl font-bold text-[#111827] mt-1">3</h2>
        </div>

        <div className="bg-[#FFF1F2] border border-[#FFE4E6] rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="w-10 h-10 rounded-lg bg-[#FECDD3] flex items-center justify-center mb-3">
            <XCircle className="w-5 h-5 text-[#E11D48]" />
          </div>
          <p className="text-sm text-[#5C7899] font-medium">Failed Payments</p>
          <h2 className="text-2xl font-bold text-[#111827] mt-1">1</h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
        {/* Tab Bar */}
        <div className="flex border-b border-[#F1F5F9] px-6 pt-4 gap-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-t-lg text-sm font-semibold transition-colors ${
              activeTab === "overview"
                ? "bg-[#0077FF] text-white"
                : "text-[#5C7899] hover:text-[#111827] hover:bg-slate-50"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-t-lg text-sm font-semibold transition-colors ${
              activeTab === "history"
                ? "bg-[#0077FF] text-white"
                : "text-[#5C7899] hover:text-[#111827] hover:bg-slate-50"
            }`}
          >
            Transaction History
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="p-6">
            <h3 className="text-lg font-bold text-[#111827] mb-4">Recent Transactions</h3>
            <div className="divide-y divide-[#F1F5F9]">
              {transactionsData.map((tx) => (
                <div key={tx.id} className="py-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-[#111827]">{tx.customer}</div>
                    <div className="text-xs text-[#A0B0C0] mt-0.5">{tx.invoice}</div>
                    <div className="text-sm text-[#5C7899] mt-1">{tx.method}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#111827]">{tx.amount}</div>
                    <div className="text-xs text-[#A0B0C0] mt-0.5">{tx.date}</div>
                    <div className="mt-1">{getStatusBadge(tx.status)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transaction History Tab */}
        {activeTab === "history" && (
          <div className="p-6">
            {/* Filter Bar */}
            <div className="flex items-center justify-between mb-4 gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#5C7899]" />
                <span className="text-sm font-medium text-[#5C7899]">Filter by status:</span>
                {["All", "Completed", "Pending", "Failed"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                      statusFilter === f
                        ? "bg-[#0077FF] text-white"
                        : "text-[#5C7899] hover:bg-slate-100"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E6EBF2] rounded-lg text-xs text-[#5C7899] hover:bg-slate-50 font-medium">
                <Download className="w-3.5 h-3.5" />
                Export
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-[#5C7899] bg-[#F8FAFC] border-b border-[#F1F5F9]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Payment ID</th>
                    <th className="px-4 py-3 font-semibold">Invoice</th>
                    <th className="px-4 py-3 font-semibold">Customer</th>
                    <th className="px-4 py-3 font-semibold">Amount</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Method</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredTx.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-[#5C7899] font-medium">{tx.id}</td>
                      <td className="px-4 py-3 text-[#0077FF] font-medium hover:underline cursor-pointer">
                        {tx.invoice}
                      </td>
                      <td className="px-4 py-3 text-[#111827]">{tx.customer}</td>
                      <td className="px-4 py-3 font-bold text-[#111827]">{tx.amount}</td>
                      <td className="px-4 py-3 text-[#5C7899]">{tx.date}</td>
                      <td className="px-4 py-3 text-[#5C7899]">{tx.method}</td>
                      <td className="px-4 py-3">{getStatusBadge(tx.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
