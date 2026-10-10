import CustomerSearchSelect from "@/components/admin/quotes/CustomerSearchSelect";
import InvoicePreviewModal from "@/components/invoice/InvoicePreviewModal";
import InvoiceTab from "@/components/invoice/InvoiceTab";
import InvoiceTable from "@/components/invoice/InvoiceTable";
import PaymentModal from "@/components/invoice/PaymentModal";
import CardContainer from "@/components/shared/CardContainer";
import CommonHeader from "@/components/shared/CommonHeader";
import CommonSelect from "@/components/shared/CommonSelect";
import DashboardTopSection from "@/components/shared/DashboardTopSection";
import LoadingStatus from "@/components/shared/loading/LoadingStatus";
import SearchSpinner from "@/components/shared/loading/SearchSpinner";
import { useDebounce } from "@/components/shared/useDebounce";
import {
  useGetInvoicesQuery,
  useGetInvoiceSummaryQuery,
} from "@/store/invoice/invoiceAPI";
import {
  InvoiceSortBy,
  InvoiceSortOrder,
  InvoiceStatus,
} from "@/store/invoice/types/invoiceTypes";
import { ArrowDown, ArrowUp, RotateCcw, X } from "lucide-react";
import { useMemo, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";

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

const STATUS_OPTIONS = [
  { label: "--", value: "--" },
  { label: "DRAFT", value: "DRAFT" },
  { label: "OPEN", value: "OPEN" },
  { label: "PARTIAL", value: "PARTIAL" },
  { label: "PAID", value: "PAID" },
  { label: "OVERDUE", value: "OVERDUE" },
  { label: "VOID", value: "VOID" },
  { label: "UNCOLLECTIBLE", value: "UNCOLLECTIBLE" },
];

const SORT_BY_OPTIONS = [
  { label: "Sort: Default", value: "none" },
  { label: "Amount Due", value: "amountDue" },
  { label: "Amount Paid", value: "amountPaid" },
  { label: "Total Amount", value: "total" },
  { label: "Date Created", value: "createdAt" },
];

export type TabOption = { name: string; count: number };

const Invoices = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("--");
  const [search, setSearch] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [sortBy, setSortBy] = useState<string>("none");
  const [sortOrder, setSortOrder] = useState<string>("none");
  const [page, setPage] = useState(1);

  const searchDebounced = useDebounce(search, 500);

  const [isVoiceDetailsOpen, setIsVoiceDetailsOpen] = useState(false);
  const [isInvoiceCreate, setIsInvoiceCreate] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null,
  );

  const activeStatus: InvoiceStatus | undefined =
    selectedStatus !== "--"
      ? (selectedStatus as InvoiceStatus)
      : STATUS_TABS.find((t) => t.name === activeTab)?.status;

  const { data, isLoading, isFetching } = useGetInvoicesQuery({
    page,
    limit: 10,
    status: activeStatus,
    search: searchDebounced || undefined,
    customerId: customerId || undefined,
    sortBy: sortBy !== "none" ? (sortBy as InvoiceSortBy) : undefined,
    sortOrder:
      sortOrder !== "none" ? (sortOrder as InvoiceSortOrder) : undefined,
  });

  const invoicesData = data?.data ?? [];
  const totalPages = data?.meta.totalPages ?? 1;
  const isSearchFetching = isFetching && !!searchDebounced;

  const handleStatusChange = (val: string) => {
    setSelectedStatus(val);
    setPage(1);
    if (val === "--") {
      setActiveTab("All");
    } else {
      const matchedTab = STATUS_TABS.find((t) => t.status === val);
      if (matchedTab) {
        setActiveTab(matchedTab.name);
      }
    }
  };

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
    setPage(1);
    const matchedTab = STATUS_TABS.find((t) => t.name === tabName);
    setSelectedStatus(matchedTab?.status ?? "--");
  };

  const handleSort = (field: InvoiceSortBy) => {
    setPage(1);
    if (sortBy === field) {
      if (sortOrder === "desc") {
        setSortOrder("asc");
      } else if (sortOrder === "asc") {
        setSortBy("none");
        setSortOrder("none");
      } else {
        setSortOrder("desc");
      }
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const handleSortByChange = (val: string) => {
    setPage(1);
    setSortBy(val);
    if (val !== "none" && sortOrder === "none") {
      setSortOrder("desc");
    } else if (val === "none") {
      setSortOrder("none");
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setActiveTab("All");
    setSelectedStatus("--");
    setCustomerId("");
    setSortBy("none");
    setSortOrder("none");
    setPage(1);
  };

  const isFiltered =
    Boolean(search) ||
    selectedStatus !== "--" ||
    activeTab !== "All" ||
    Boolean(customerId) ||
    sortBy !== "none";

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
        <DashboardTopSection
          title="Invoices"
          description="Manage billing and collect payments."
          backButton
        />

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
          setActiveTab={handleTabChange}
        />

        {/* Filter bar like CustomersTable */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex-1 relative w-full border border-border bg-white rounded-md outline-none text-text text-base placeholder:text-[#90A1B9] flex items-center gap-2 pl-3">
            <IoSearchSharp className="text-xl text-[#90A1B9]" />
            <input
              type="text"
              placeholder="Search across invoice #, quote #, customer, company..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="py-3 w-full outline-none text-text text-base placeholder:text-[#90A1B9]"
            />
            {isSearchFetching && (
              <SearchSpinner className="absolute right-3 top-1/2 -translate-y-1/2" />
            )}
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <CommonSelect
              item={STATUS_OPTIONS}
              value={selectedStatus}
              onValueChange={handleStatusChange}
              placeholder="Status"
              className="w-full! sm:w-auto!"
              w={140}
            />

            <div className="w-full sm:w-[210px] relative">
              <CustomerSearchSelect
                value={customerId}
                onValueChange={(val) => {
                  setCustomerId(val);
                  setPage(1);
                }}
                placeholder="Filter by customer"
              />
              {customerId && (
                <button
                  type="button"
                  onClick={() => {
                    setCustomerId("");
                    setPage(1);
                  }}
                  className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-0.5"
                  title="Clear customer filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <CommonSelect
              item={SORT_BY_OPTIONS}
              value={sortBy}
              onValueChange={handleSortByChange}
              placeholder="Sort by"
              className="w-full! sm:w-auto!"
              w={150}
            />

            {sortBy !== "none" && (
              <button
                type="button"
                onClick={() => {
                  setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                  setPage(1);
                }}
                className="px-3 py-3 border border-border bg-white rounded-md hover:bg-slate-50 transition-colors flex items-center justify-center cursor-pointer text-sm"
                title={
                  sortOrder === "asc"
                    ? "Ascending (click for Descending)"
                    : "Descending (click for Ascending)"
                }
              >
                {sortOrder === "asc" ? (
                  <ArrowUp className="w-4 h-4 text-blue-600" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-blue-600" />
                )}
              </button>
            )}

            {isFiltered && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-3 border border-border bg-white rounded-md hover:bg-slate-50 text-xs font-medium text-gray-600 hover:text-red-600 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        <LoadingStatus
          isLoading={isLoading}
          items={invoicesData}
          itemName="Invoices"
        />

        {!isLoading && invoicesData.length > 0 && (
          <InvoiceTable
            invoicesData={invoicesData}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            onOpenDetails={handleOpenDetails}
            onOpenPayment={handleOpenPayment}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
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
