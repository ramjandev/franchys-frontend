import { tableDesign } from "@/components/admin/quotes/QuoteLists";
import InvoicePreviewModal from "@/components/invoice/InvoicePreviewModal";
import PaymentModal from "@/components/invoice/PaymentModal";
import CardContainer from "@/components/shared/CardContainer";
import CommonHeader from "@/components/shared/CommonHeader";
import DashboardSearch from "@/components/shared/DashboardSearch";
import DashboardTopSection from "@/components/shared/DashboardTopSection";
import Pagination from "@/components/shared/Pagination";
import { useState } from "react";
import { Link } from "react-router-dom";

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

const statsCards = [
  {
    title: "Outstanding",
    amount: "$1,960.8",
    dotColor: "bg-[#90A1B9]",
    textColor: "text-[#0F172B]",
    borderColor: "border border-[#E2E8F0]!",
  },
  {
    title: "Overdue",
    amount: "$756",
    dotColor: "bg-[#FB2C36]",
    textColor: "text-[#E7000B]",
    borderColor: "border border-[#FFC9C9]!",
  },
  {
    title: "Collected",
    amount: "$8,700",
    dotColor: "bg-[#00BC7D]",
    textColor: "text-[#009966]",
    borderColor: "border border-[#A4F4CF]!",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Paid":
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#5CB85C] text-white text-xs font-semibold">
          Paid
        </span>
      );
    case "Partial":
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#F0AD4E] text-white text-xs font-semibold">
          Partial
        </span>
      );
    case "Overdue":
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#D9534F] text-white text-xs font-semibold">
          Overdue
        </span>
      );
    case "Unpaid":
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#A0B0C0] text-white text-xs font-semibold">
          Unpaid
        </span>
      );
    default:
      return null;
  }
};

const tableHeaders = [
  { label: "Invoice", align: "text-left" },
  { label: "Customer", align: "text-left" },
  { label: "Amount", align: "text-left" },
  { label: "Balance", align: "text-left" },
  { label: "Status", align: "text-center" },
  { label: "Due", align: "text-left" },
  { label: "Action", align: "text-center" },
];

const Invoices = () => {
  const [activeTab, setActiveTab] = useState("All");

  const tabs = [
    { name: "All", count: 4 },
    { name: "Unpaid", count: 1 },
    { name: "Partial", count: 1 },
    { name: "Paid", count: 1 },
    { name: "Overdue", count: 1 },
  ];

  const [isVoiceDetailsOpen, setIsVoiceDetailsOpen] = useState(false);
  const [isInvoiceCreate, setIsInvoiceCreate] = useState(false);
  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between">
          <DashboardTopSection
            title="Invoices"
            description="Manage billing and collect payments."
            backButton
          />
          <div className="max-w-[255px]">
            <DashboardSearch
              className="bg-transparent! border-[#CAD5E2]! text-[#0A0A0A]/50!"
              placeholder="Search invoices..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statsCards.map((card, index) => (
            <CardContainer size="lg" key={index} className={card.borderColor}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${card.dotColor}`} />
                <CommonHeader size="sm" className="text-[#45556C]!">
                  {card.title}
                </CommonHeader>
              </div>
              <CommonHeader size="3xl" className={card.textColor}>
                {card.amount}
              </CommonHeader>
            </CardContainer>
          ))}
        </div>

        <div className="flex items-center gap-2 border-b border-[#E6EBF2]">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`relative cursor-pointer px-5 py-3 rounded-[14px] text-sm font-medium transition-all duration-200 ${
                activeTab === tab.name
                  ? "bg-[#EFF6FF] text-skyBlue"
                  : "text-[#45556C] hover:text-skyBlue"
              }`}
            >
              <span>{tab.name}</span>
              <span className="ml-1 opacity-80">{tab.count}</span>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl  overflow-hidden">
          <div className="overflow-x-auto">
            <table className={tableDesign.table}>
              <thead className={tableDesign.thead}>
                <tr>
                  {tableHeaders.map((item, index) => (
                    <th
                      key={index}
                      className={`${item.align} ${tableDesign.th}`}
                    >
                      {item.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={tableDesign.tbody}>
                {invoicesData.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td
                      onClick={() => setIsVoiceDetailsOpen(true)}
                      className={tableDesign.td}
                    >
                      <span className="text-[#0077FF] font-medium hover:underline cursor-pointer">
                        {invoice.id}
                      </span>
                    </td>
                    <td className={tableDesign.td}>
                      <div className="text-[#101828] font-medium">
                        {invoice.customer}
                      </div>
                      {invoice.jobId && (
                        <div className="text-xs text-[#A0B0C0] mt-0.5">
                          {invoice.jobId}
                        </div>
                      )}
                    </td>
                    <td className={`${tableDesign.td} font-semibold`}>
                      {invoice.amount}
                    </td>
                    <td className={`${tableDesign.td} font-semibold`}>
                      {invoice.balance}
                    </td>
                    <td className={`${tableDesign.td} text-center`}>
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className={tableDesign.td}>{invoice.due}</td>
                    <td className={`${tableDesign.td} text-center`}>
                      {invoice.status === "Paid" ? (
                        <Link
                          to={`/admin/invoices/${invoice.id}`}
                          className="text-[#0077FF] font-medium hover:underline cursor-pointer"
                        >
                          View
                        </Link>
                      ) : (
                        <span
                          onClick={() => setIsInvoiceCreate(true)}
                          className="text-[#0077FF] font-medium hover:underline cursor-pointer"
                        >
                          Pay Now
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="py-5">
            <Pagination
              currentPage={1}
              totalPages={5}
              onPageChange={() => {}}
            />
          </div>
        </div>
      </div>

      {isVoiceDetailsOpen && (
        <InvoicePreviewModal setShowModal={setIsVoiceDetailsOpen} />
      )}
      {isInvoiceCreate && <PaymentModal setShowModal={setIsInvoiceCreate} />}
    </>
  );
};

export default Invoices;
