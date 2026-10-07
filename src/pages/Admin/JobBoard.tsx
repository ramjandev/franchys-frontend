import JobFilters, {
  StatusFilterValue,
} from "@/components/admin/jobBoard/JobFilters";
import ListView from "@/components/admin/jobBoard/ListView";
import WorkflowStages from "@/components/admin/jobBoard/WorkflowStages";
import DashboardTopSection from "@/components/shared/DashboardTopSection";
import LoadingStatus from "@/components/shared/loading/LoadingStatus";
import { useDebounce } from "@/components/shared/useDebounce";
import { useGetJobsQuery } from "@/store/jobs/jobAPI";
import { JobSortBy, JobSortOrder } from "@/store/jobs/types/jobTypes";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

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

  const handleSortChange = (
    field: JobSortBy | "none",
    order: JobSortOrder | "none",
  ) => {
    setPage(1);
    setSortBy(field);
    setSortOrder(order);
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

      {/* Interactive Workflow Stages Pipeline Filter */}
      <WorkflowStages
        activeStatus={statusFilter}
        onStatusSelect={(newStatus) => {
          setStatusFilter(newStatus);
          setPage(1);
        }}
      />

      {/* Functional Job Filters Bar */}
      <JobFilters
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        statusFilter={statusFilter}
        onStatusChange={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
        dateFilter={dateFilter}
        onDateChange={(val) => {
          setDateFilter(val);
          setPage(1);
        }}
        amountFilter={amountFilter}
        onAmountChange={(val) => {
          setAmountFilter(val);
          setPage(1);
        }}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        isFetching={isSearchFetching}
        totalResults={jobs.length}
      />

      <LoadingStatus isLoading={isLoading} items={jobs} itemName="jobs" />

      {/* When no jobs match active filters, offer reset button */}
      {!isLoading && jobs.length === 0 && hasActiveFilters && (
        <div className="flex justify-center -mt-3">
          <button
            type="button"
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer border border-blue-200"
          >
            <RotateCcw className="w-4 h-4" />
            Clear all filters
          </button>
        </div>
      )}

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
