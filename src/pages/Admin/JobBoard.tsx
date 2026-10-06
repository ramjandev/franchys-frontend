import ListView from "@/components/admin/jobBoard/ListView";
import CommonSelect from "@/components/shared/CommonSelect";
import DashboardTopSection from "@/components/shared/DashboardTopSection";
import LoadingStatus from "@/components/shared/loading/LoadingStatus";
import SearchSpinner from "@/components/shared/loading/SearchSpinner";
import { useDebounce } from "@/components/shared/useDebounce";
import { useGetJobsQuery } from "@/store/jobs/jobAPI";
import {
  JobSortBy,
  JobSortOrder,
  JobStatus,
} from "@/store/jobs/types/jobTypes";
import { Calendar, RotateCcw, X } from "lucide-react";
import { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";

type StatusFilterValue = JobStatus | "all";

const jobStatusOptions: { label: string; value: StatusFilterValue }[] = [
  { label: "All", value: "all" },
  { label: "Quote", value: "QUOTE" },
  { label: "Approved", value: "APPROVED" },
  { label: "Art", value: "ART" },
  { label: "Need to Order", value: "NEED_TO_ORDER" },
  { label: "Order Arrived", value: "ORDER_ARRIVED" },
  { label: "Production", value: "PRODUCTION" },
  { label: "Payment", value: "PAYMENT" },
  { label: "Ship", value: "SHIP" },
  { label: "Completed", value: "COMPLETED" },
];

export default function JobBoard() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");
  const [dateFilter, setDateFilter] = useState("");
  const [amountFilter, setAmountFilter] = useState("");
  const [sortBy, setSortBy] = useState<string>("none");
  const [sortOrder, setSortOrder] = useState<string>("none");

  const searchDebounced = useDebounce(search, 500);
  const amountDebounced = useDebounce(amountFilter, 500);

  const { data, isLoading, isFetching } = useGetJobsQuery({
    page,
    limit: 10,
    search: searchDebounced || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    date: dateFilter || undefined,
    amount: amountDebounced || undefined,
    sortBy: sortBy !== "none" ? (sortBy as JobSortBy) : undefined,
    sortOrder: sortOrder !== "none" ? (sortOrder as JobSortOrder) : undefined,
  });

  const jobs = data?.data ?? [];
  const totalPages = data?.meta.totalPages ?? 1;
  const isSearchFetching = isFetching && !!searchDebounced;

  const handleSort = (field: JobSortBy) => {
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

  const hasActiveFilters = Boolean(
    search ||
    statusFilter !== "all" ||
    dateFilter ||
    amountFilter ||
    sortBy !== "none" ||
    sortOrder !== "none",
  );

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setDateFilter("");
    setAmountFilter("");
    setSortBy("none");
    setSortOrder("none");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:gap-6">
        <DashboardTopSection
          title="Job Board"
          description="Manage all jobs in list view."
          backButton
        />
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="flex-1 relative w-full border border-border bg-white rounded-md outline-none text-text text-base placeholder:text-[#90A1B9] flex items-center gap-2 pl-3">
          <IoSearchSharp className="text-xl text-[#90A1B9]" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="py-2.5 w-full outline-none text-text text-sm sm:text-base placeholder:text-[#90A1B9]"
          />
          {isSearchFetching && (
            <SearchSpinner className="absolute right-3 top-1/2 -translate-y-1/2" />
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <CommonSelect
            item={jobStatusOptions}
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value as StatusFilterValue);
              setPage(1);
            }}
            placeholder="Filter by status"
            className="w-full! sm:w-auto!"
            w={170}
          />

          {/* Date Filter */}
          <div className="relative flex items-center border border-border bg-white rounded-md px-3 py-2 w-full sm:w-auto">
            <Calendar className="w-4 h-4 text-[#90A1B9] mr-2 shrink-0" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setPage(1);
              }}
              className="outline-none text-sm text-[#0F172B] bg-transparent cursor-pointer"
              title="Filter by date (YYYY-MM-DD)"
            />
            {dateFilter && (
              <button
                type="button"
                onClick={() => {
                  setDateFilter("");
                  setPage(1);
                }}
                className="ml-1.5 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
                title="Clear date filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Amount Filter */}
          <div className="relative flex items-center border border-border bg-white rounded-md px-3 py-2 w-full sm:w-auto">
            <span className="text-[#90A1B9] text-sm font-medium mr-1">$</span>
            <input
              type="number"
              placeholder="Amount"
              value={amountFilter}
              onChange={(e) => {
                setAmountFilter(e.target.value);
                setPage(1);
              }}
              className="outline-none text-sm text-[#0F172B] w-20 bg-transparent placeholder:text-[#90A1B9]"
              title="Filter by amount"
            />
            {amountFilter && (
              <button
                type="button"
                onClick={() => {
                  setAmountFilter("");
                  setPage(1);
                }}
                className="ml-1 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
                title="Clear amount filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md border border-red-200 transition-colors cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>

      <LoadingStatus isLoading={isLoading} items={jobs} itemName="jobs" />
      {!isLoading && jobs.length > 0 && (
        <ListView
          jobs={jobs}
          isLoading={isLoading}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      )}
    </div>
  );
}
