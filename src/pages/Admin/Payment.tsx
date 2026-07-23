import CardContainer from "@/components/shared/CardContainer";
import DashboardTopSection from "@/components/shared/DashboardTopSection";
import CommonTabs from "@/components/transaction/CommonTabs";
import Overview from "@/components/transaction/Overview";
import TransactionHistory from "@/components/transaction/TransactionHistory";
import { CheckCircle, Clock, DollarSign, XCircle } from "lucide-react";
import { useState } from "react";
export const transactionsData = [
  {
    id: "PAY-001",
    invoice: "INV-2024-089",
    customer: "Acme Corp",
    amount: "$1250.00",
    date: "2026-05-08",
    method: "Visa •••• 4242",
    status: "completed",
  },
  {
    id: "PAY-002",
    invoice: "INV-2024-088",
    customer: "TechStart Inc",
    amount: "$750.50",
    date: "2026-05-07",
    method: "Mastercard •••• 5555",
    status: "completed",
  },
  {
    id: "PAY-003",
    invoice: "INV-2024-087",
    customer: "Creative Agency",
    amount: "$2100.00",
    date: "2026-05-06",
    method: "Bank Transfer",
    status: "pending",
  },
  {
    id: "PAY-004",
    invoice: "INV-2024-086",
    customer: "Local Bakery",
    amount: "$450.00",
    date: "2026-05-05",
    method: "Visa •••• 4242",
    status: "failed",
  },
  {
    id: "PAY-005",
    invoice: "INV-2024-085",
    customer: "Fashion Brand",
    amount: "$3200.00",
    date: "2026-05-04",
    method: "Mastercard •••• 5555",
    status: "completed",
  },
];

export type TransactionsType = typeof transactionsData;
const metrics = [
  {
    label: "Total Revenue",
    val: "$8,100.00",
    bg: "bg-[#FFFDF5] border-[#FEF3C7]",
    iconBg: "bg-[#FDE68A]/60",
    iconColor: "text-[#B45309]",
    Icon: DollarSign,
  },
  {
    label: "Completed Payments",
    val: "18",
    bg: "bg-[#EFF6FF] border-[#DBEAFE]",
    iconBg: "bg-[#BFDBFE]/60",
    iconColor: "text-[#1D4ED8]",
    Icon: CheckCircle,
  },
  {
    label: "Pending Payments",
    val: "3",
    bg: "bg-[#FAF5FF] border-[#F3E8FF]",
    iconBg: "bg-[#E9D5FF]/60",
    iconColor: "text-[#7C3AED]",
    Icon: Clock,
  },
  {
    label: "Failed Payments",
    val: "1",
    bg: "bg-[#FFF5F5] border-[#FEE2E2]",
    iconBg: "bg-[#FCA5A5]/60",
    iconColor: "text-[#DC2626]",
    Icon: XCircle,
  },
];

const Payment = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "history">(
    "overview",
  );
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredTx =
    statusFilter === "All"
      ? transactionsData
      : transactionsData.filter((t) => t.status === statusFilter);

  return (
    <div className="flex flex-col gap-6 w-full">
      <DashboardTopSection
        title="Payment Center"
        description="Manage payment methods, view transactions, and track revenue"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(({ label, val, bg, iconBg, iconColor, Icon }) => (
          <div
            key={label}
            className={`border rounded-xl p-6 shadow-xs flex flex-col justify-between ${bg}`}
          >
            <div>
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${iconBg}`}
              >
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <p className="text-sm text-[#5C7899] font-semibold">{label}</p>
            </div>
            <h2 className="text-2xl font-black text-[#111827] mt-1">{val}</h2>
          </div>
        ))}
      </div>

      <CardContainer className="bg-white border border-[#E6EBF2] rounded-2xl shadow-sm !p-0 overflow-hidden">
        <CommonTabs
          tabs={[
            { label: "Overview", value: "overview" },
            { label: "Transaction History", value: "history" },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <div className="p-6">
          {activeTab === "overview" ? (
            <Overview />
          ) : (
            <TransactionHistory
              filteredTx={filteredTx}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />
          )}
        </div>
      </CardContainer>
    </div>
  );
};

export default Payment;
