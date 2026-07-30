import QuoteLists from "@/components/admin/quotes/QuoteLists";
import SearchWithFilter from "@/components/admin/quotes/SearchWithFilter";
import DashboardTopSection from "@/components/shared/DashboardTopSection";
import LoadingStatus from "@/components/shared/loading/LoadingStatus";
import { useDebounce } from "@/components/shared/useDebounce";
import { useGetQuotesQuery } from "@/store/quote/quoteAPI";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Quotes = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const searchDebounced = useDebounce(search, 500);
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetQuotesQuery({
    page,
    limit: 10,
    search: searchDebounced,
    status: status === "all" ? undefined : status,
  });
  const quotes = data?.data ?? [];
  const totalPages = data?.meta.totalPages ?? 1;

  return (
    <div className="flex flex-col gap-6  w-full">
      <DashboardTopSection
        title="Quotes"
        description=" Create and manage customer quotes."
        buttonOne="New Quote"
        actionOne={() => navigate("/admin/quotes/new")}
      />

      <SearchWithFilter
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
      />

      <LoadingStatus isLoading={isLoading} items={quotes} itemName="quotes" />

      {!isLoading && quotes.length > 0 && (
        <QuoteLists
          quotes={quotes}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default Quotes;
