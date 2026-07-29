import CardContainer from "@/components/shared/CardContainer";
import DashboardTopSection from "@/components/shared/DashboardTopSection";
import CommonTabs from "@/components/transaction/CommonTabs";
import Overview from "@/components/transaction/Overview";
import TransactionHistory from "@/components/transaction/TransactionHistory";
import {
  useGetPaymentSummaryQuery,
  useGetTransactionSummaryQuery,
} from "@/store/invoice/invoiceAPI";
import { CheckCircle, Clock, DollarSign, XCircle } from "lucide-react";
import { useState } from "react";

export type PaymentHistoryItem = {
  id: string;
  paymentId: string;
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  date: string;
  method: string | null;
  status: "Completed" | "Pending" | "Failed" | string;
};

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PaymentHistoryResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: PaymentHistoryItem[];
  meta: PaginationMeta;
};

const Payment = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "history">(
    "overview",
  );
  const [statusFilter, setStatusFilter] = useState("All");

  const { data: transactionsRes, isLoading: isTxLoading } =
    useGetTransactionSummaryQuery();
  const transactions = transactionsRes?.data ?? [];

  const filteredTx =
    statusFilter === "All"
      ? transactions
      : transactions.filter(
          (t) => t.status?.toLowerCase() === statusFilter.toLowerCase(),
        );

  const { data } = useGetPaymentSummaryQuery();
  const metrics = [
    {
      label: "Total Revenue",
      val: `$${data?.data?.totalRevenue ?? 0}`,
      bg: "bg-[#FFFDF5] border-[#FEF3C7]",
      iconBg: "bg-[#FDE68A]/60",
      iconColor: "text-[#B45309]",
      Icon: DollarSign,
    },
    {
      label: "Completed Payments",
      val: `$${data?.data?.completedPayments ?? 0}`,
      bg: "bg-[#EFF6FF] border-[#DBEAFE]",
      iconBg: "bg-[#BFDBFE]/60",
      iconColor: "text-[#1D4ED8]",
      Icon: CheckCircle,
    },
    {
      label: "Pending Payments",
      val: `$${data?.data?.pendingPayments ?? 0}`,
      bg: "bg-[#FAF5FF] border-[#F3E8FF]",
      iconBg: "bg-[#E9D5FF]/60",
      iconColor: "text-[#7C3AED]",
      Icon: Clock,
    },
    {
      label: "Failed Payments",
      val: `$${data?.data?.failedPayments ?? 0}`,
      bg: "bg-[#FFF5F5] border-[#FEE2E2]",
      iconBg: "bg-[#FCA5A5]/60",
      iconColor: "text-[#DC2626]",
      Icon: XCircle,
    },
  ];

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
            <Overview transactions={transactions} isLoading={isTxLoading} />
          ) : (
            <TransactionHistory
              filteredTx={filteredTx}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              isLoading={isTxLoading}
            />
          )}
        </div>
      </CardContainer>
    </div>
  );
};

export default Payment;
