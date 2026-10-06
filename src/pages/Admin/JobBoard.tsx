import ListView from "@/components/admin/jobBoard/ListView";
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
