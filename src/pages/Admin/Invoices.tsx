import InvoicePreviewModal from "@/components/invoice/InvoicePreviewModal";
import InvoiceTab from "@/components/invoice/InvoiceTab";
import InvoiceTable from "@/components/invoice/InvoiceTable";
import PaymentModal from "@/components/invoice/PaymentModal";
import CardContainer from "@/components/shared/CardContainer";
import CommonHeader from "@/components/shared/CommonHeader";
import DashboardSearch from "@/components/shared/DashboardSearch";
import DashboardTopSection from "@/components/shared/DashboardTopSection";
import LoadingStatus from "@/components/shared/loading/LoadingStatus";
import { useDebounce } from "@/components/shared/useDebounce";
import {
  useGetInvoicesQuery,
  useGetInvoiceSummaryQuery,
} from "@/store/invoice/invoiceAPI";
import { InvoiceStatus } from "@/store/invoice/types/invoiceTypes";
import { useMemo, useState } from "react";

interface StatusTab {
  name: string;
  status?: InvoiceStatus;
}

const STATUS_TABS: StatusTab[] = [
  { name: "All" },
  { name: "Draft", status: "DRAFT" },
  { name: "Open", status: "OPEN" },
  { name: "Partial", status: "PARTIAL" },
  { name: "Paid", status: "PAID" },
  { name: "Overdue", status: "OVERDUE" },
  { name: "Void", status: "VOID" },
  { name: "Uncollectible", status: "UNCOLLECTIBLE" },
];

export type TabOption = { name: string; count: number };

const Invoices = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const searchDebounced = useDebounce(search, 500);
  const [page, setPage] = useState(1);

  const [isVoiceDetailsOpen, setIsVoiceDetailsOpen] = useState(false);
  const [isInvoiceCreate, setIsInvoiceCreate] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null,
  );

  const activeStatus = STATUS_TABS.find((t) => t.name === activeTab)?.status;

  // NOTE: search is sent to backend now too (see below) — remove if your
  // API doesn't support a `search` param yet, and I'll add it server-side instead.
  const { data, isLoading } = useGetInvoicesQuery({
    page,
    limit: 10,
    status: activeStatus,
    search: searchDebounced || undefined,
  });

  const invoicesData = data?.data ?? [];
  const totalPages = data?.meta.totalPages ?? 1;

  // Backend already filters by status + search, so no client-side filtering needed.
  const filteredInvoices = invoicesData;

  // Tab counts now come from the backend's statusCounts, not the current page.
  const tabs: TabOption[] = useMemo(() => {
    const counts = data?.statusCounts;
    const total = data?.meta.total ?? 0;

    return STATUS_TABS.map((t) => ({
      name: t.name,
      count: t.status ? (counts?.[t.status] ?? 0) : total,
    }));
  }, [data]);

  const { data: dataSummary } = useGetInvoiceSummaryQuery();

  const statsCards = [
    {
      title: "Outstanding",
      amount: `$${dataSummary?.data.outstanding ?? 0}`,
      dotColor: "bg-[#90A1B9]",
      textColor: "text-[#0F172B]",
      borderColor: "border border-[#E2E8F0]!",
    },
    {
      title: "Overdue",
      amount: `$${dataSummary?.data.collected ?? 0}`,
      dotColor: "bg-[#FB2C36]",
      textColor: "text-[#E7000B]",
      borderColor: "border border-[#FFC9C9]!",
    },
    {
      title: "Collected",
      amount: `$${dataSummary?.data.collected ?? 0}`,
      dotColor: "bg-[#00BC7D]",
      textColor: "text-[#009966]",
      borderColor: "border border-[#A4F4CF]!",
    },
  ];

  const handleOpenDetails = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setIsVoiceDetailsOpen(true);
  };

  const handleOpenPayment = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setIsInvoiceCreate(true);
  };

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
              value={search}
              onChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
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
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setPage(1);
          }}
        />
        <LoadingStatus
          isLoading={isLoading}
          items={filteredInvoices}
          itemName="Invoices"
        />
        {!isLoading && filteredInvoices.length > 0 && (
          <InvoiceTable
            invoicesData={filteredInvoices}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            onOpenDetails={handleOpenDetails}
            onOpenPayment={handleOpenPayment}
          />
        )}
      </div>

      {isVoiceDetailsOpen && selectedInvoiceId && (
        <InvoicePreviewModal
          invoiceId={selectedInvoiceId}
          setShowModal={setIsVoiceDetailsOpen}
        />
      )}
      {isInvoiceCreate && selectedInvoiceId && (
        <PaymentModal
          invoiceId={selectedInvoiceId}
          setShowModal={setIsInvoiceCreate}
        />
      )}
    </>
  );
};

export default Invoices;
