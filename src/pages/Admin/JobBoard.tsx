import ListView from "@/components/admin/jobBoard/ListView";
import DashboardSearch from "@/components/shared/DashboardSearch";
import DashboardTopSection from "@/components/shared/DashboardTopSection";
import LoadingStatus from "@/components/shared/loading/LoadingStatus";
import { useDebounce } from "@/components/shared/useDebounce";
import { useGetJobsQuery } from "@/store/jobs/jobAPI";

import { useState } from "react";

export default function JobBoard() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const searchDebounced = useDebounce(search, 500);
  const { data, isLoading } = useGetJobsQuery({
    page,
    limit: 10,
    search: searchDebounced,
  });

  const jobs = data?.data ?? [];
  const totalPages = data?.meta.totalPages ?? 1;

  return (
    <div className="">
      <div className="flex flex-col sm:flex-row justify-between sm:gap-6">
        <DashboardTopSection
          title="Job Board"
          description="Manage all jobs in list view."
          backButton
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
