import ListView from "@/components/admin/jobBoard/ListView";
import SearchWithFilter from "@/components/admin/quotes/SearchWithFilter";
import DashboardTopSection from "@/components/shared/DashboardTopSection";
import LoadingStatus from "@/components/shared/loading/LoadingStatus";
import { useDebounce } from "@/components/shared/useDebounce";
import { useGetJobsQuery } from "@/store/jobs/jobAPI";
import { JobStatus } from "@/store/jobs/types/jobTypes";

import { useState } from "react";

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
  const searchDebounced = useDebounce(search, 500);
  const { data, isLoading, isFetching } = useGetJobsQuery({
    page,
    limit: 10,
    search: searchDebounced,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const jobs = data?.data ?? [];
  const totalPages = data?.meta.totalPages ?? 1;
  const isSearchFetching = isFetching && !!searchDebounced;
  return (
    <div className=" space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:gap-6">
        <DashboardTopSection
          title="Job Board"
          description="Manage all jobs in list view."
          backButton
        />
      </div>

      <SearchWithFilter
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        status={statusFilter}
        onStatusChange={(value) => {
          setStatusFilter(value as StatusFilterValue);
          setPage(1);
        }}
        isFetching={isSearchFetching}
        placeholder="Search jobs..."
        statusOptions={jobStatusOptions}
        statusPlaceholder="Filter by status"
      />

      <LoadingStatus isLoading={isLoading} items={jobs} itemName="jobs" />
      {!isLoading && jobs.length > 0 && (
        <ListView
          jobs={jobs}
          isLoading={isLoading}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}
