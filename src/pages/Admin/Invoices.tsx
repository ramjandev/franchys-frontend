import InvoicePreviewModal from "@/components/invoice/InvoicePreviewModal";
import InvoiceTab from "@/components/invoice/InvoiceTab";
import InvoiceTable from "@/components/invoice/InvoiceTable";
import PaymentModal from "@/components/invoice/PaymentModal";
import CardContainer from "@/components/shared/CardContainer";
import CommonHeader from "@/components/shared/CommonHeader";
import DashboardSearch from "@/components/shared/DashboardSearch";
import DashboardTopSection from "@/components/shared/DashboardTopSection";
import { useState } from "react";

const invoicesData = [
  {
    id: "INV-3001",
    customer: "Bay Area Tech Summit",
    jobId: "J-2003",
    amount: "$8100.00",
    balance: "$0.00",
    status: "paid",
    due: "9/25/2025",
  },
  {
    id: "INV-3002",
    customer: "Riverside Church",
    jobId: "",
    amount: "$1200.00",
    balance: "$600.00",
    status: "partial",
    due: "10/10/2025",
  },
  {
    id: "INV-3003",
    customer: "Golden State Realty",
    jobId: "J-2020",
    amount: "$756.00",
    balance: "$756.00",
    status: "overdue",
    due: "9/1/2025",
  },
  {
    id: "INV-3004",
    customer: "Craft Brewery Co",
    jobId: "J-2002",
    amount: "$604.80",
    balance: "$604.80",
    status: "unpaid",
    due: "10/18/2025",
  },
];

export type InvoiceType = (typeof invoicesData)[number];
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
const tabs = [
  { name: "All", count: 4 },
  { name: "Unpaid", count: 1 },
  { name: "Partial", count: 1 },
  { name: "Paid", count: 1 },
  { name: "Overdue", count: 1 },
];

export type TabOption = (typeof tabs)[number];
const Invoices = () => {
  const [activeTab, setActiveTab] = useState("All");

  const [isVoiceDetailsOpen, setIsVoiceDetailsOpen] = useState(false);
  const [isInvoiceCreate, setIsInvoiceCreate] = useState(false);
  const filteredInvoices =
    activeTab === "All"
      ? invoicesData
      : invoicesData.filter((invoice) => invoice.status === activeTab);
  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between sm:gap-6">
          <DashboardTopSection
            title="Invoices"
            description="Manage billing and collect payments."
            backButton
            className="pb-0!"
          />
          <div className=" w-full sm:max-w-[255px]">
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

        <InvoiceTab
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <InvoiceTable
          setIsVoiceDetailsOpen={setIsVoiceDetailsOpen}
          setIsInvoiceCreate={setIsInvoiceCreate}
          invoicesData={filteredInvoices}
        />
      </div>

      {isVoiceDetailsOpen && (
        <InvoicePreviewModal setShowModal={setIsVoiceDetailsOpen} />
      )}
      {isInvoiceCreate && <PaymentModal setShowModal={setIsInvoiceCreate} />}
    </>
  );
};

export default Invoices;
