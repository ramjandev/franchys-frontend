import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ArrowLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const invoicesData = [
  {
    id: "INV-3001",
    customer: "Bay Area Tech Summit",
    jobId: "J-2003",
    amount: "$8100.00",
    balance: "$0.00",
    status: "Paid",
    due: "9/25/2025",
  },
  {
    id: "INV-3002",
    customer: "Riverside Church",
    jobId: "",
    amount: "$1200.00",
    balance: "$600.00",
    status: "Partial",
    due: "10/10/2025",
  },
  {
    id: "INV-3003",
    customer: "Golden State Realty",
    jobId: "J-2020",
    amount: "$756.00",
    balance: "$756.00",
    status: "Overdue",
    due: "9/1/2025",
  },
  {
    id: "INV-3004",
    customer: "Craft Brewery Co",
    jobId: "J-2002",
    amount: "$604.80",
    balance: "$604.80",
    status: "Unpaid",
    due: "10/18/2025",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Paid":
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#D1FAE5] text-[#065F46] text-xs font-semibold">
          Paid
        </span>
      );
    case "Partial":
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#FEF3C7] text-[#92400E] text-xs font-semibold">
          Partial
        </span>
      );
    case "Overdue":
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#FEE2E2] text-[#B91C1C] text-xs font-semibold">
          Overdue
        </span>
      );
    case "Unpaid":
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#F3F4F6] text-[#4B5563] text-xs font-semibold">
          Unpaid
        </span>
      );
    default:
      return null;
  }
};

const Invoices = () => {
  const [activeTab, setActiveTab] = useState("All");

  const tabs = [
    { name: "All", count: 4 },
    { name: "Unpaid", count: 1 },
    { name: "Partial", count: 1 },
    { name: "Paid", count: 1 },
    { name: "Overdue", count: 1 },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link to="/admin/dashboard" className="mt-1">
            <ArrowLeft className="w-5 h-5 text-[#5C7899] hover:text-[#111827]" />
          </Link>
          <div>
            <h1 className="text-3xl font-semibold text-[#111827] mb-1">
              Invoices
            </h1>
            <p className="text-sm text-[#5C7899]">
              Manage billing and collect payments.
            </p>
          </div>
        </div>
        <div className="w-full md:w-64">
          <InputGroup className="h-10 border-[#E6EBF2] bg-transparent focus-within:ring-0 focus-within:border-[#0077FF]">
            <InputGroupAddon>
              <Search className="w-4 h-4 text-[#A0B0C0]" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search invoices..."
              className="text-sm placeholder:text-[#A0B0C0] bg-transparent"
            />
          </InputGroup>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Outstanding */}
        <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#A0B0C0]" />
            <p className="text-sm text-[#5C7899] font-medium">Outstanding</p>
          </div>
          <h2 className="text-3xl font-bold text-[#111827]">$1,960.8</h2>
        </div>

        {/* Overdue */}
        <div className="bg-[#FFF1F2] border border-[#FFE4E6] rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#E11D48]" />
            <p className="text-sm text-[#E11D48] font-medium">Overdue</p>
          </div>
          <h2 className="text-3xl font-bold text-[#E11D48]">$756</h2>
        </div>

        {/* Collected */}
        <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#16A34A]" />
            <p className="text-sm text-[#16A34A] font-medium">Collected</p>
          </div>
          <h2 className="text-3xl font-bold text-[#16A34A]">$8,700</h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-[#E6EBF2]">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`pb-3 text-sm font-semibold transition-colors relative ${
              activeTab === tab.name
                ? "text-[#0077FF]"
                : "text-[#5C7899] hover:text-[#111827]"
            }`}
          >
            {tab.name} <span className="ml-1 font-normal opacity-70">{tab.count}</span>
            {activeTab === tab.name && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0077FF] rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[#5C7899] bg-white border-b border-[#F1F5F9]">
              <tr>
                <th className="px-6 py-4 font-semibold w-32">Invoice</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Balance</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Due</th>
                <th className="px-6 py-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {invoicesData.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="text-[#0077FF] font-medium hover:underline cursor-pointer">
                      {invoice.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[#111827] font-medium">{invoice.customer}</div>
                    {invoice.jobId && (
                      <div className="text-xs text-[#A0B0C0] mt-0.5">{invoice.jobId}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-[#111827] font-medium">{invoice.amount}</td>
                  <td className="px-6 py-4 text-[#111827] font-medium">{invoice.balance}</td>
                  <td className="px-6 py-4">{getStatusBadge(invoice.status)}</td>
                  <td className="px-6 py-4 text-[#5C7899]">{invoice.due}</td>
                  <td className="px-6 py-4">
                    <button className="text-[#0077FF] font-semibold text-xs hover:underline">
                      {invoice.status === "Paid" ? "View" : "Pay Now"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
