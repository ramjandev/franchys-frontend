import QuoteLists from "@/components/admin/quotes/QuoteLists";
import SearchWithFilter from "@/components/admin/quotes/SearchWithFilter";
import DashboardTopSection from "@/components/shared/DashboardTopSection";
import { useNavigate } from "react-router-dom";

const Quotes = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-6  w-full">
      <DashboardTopSection
        title="Quotes"
        description=" Create and manage customer quotes."
        buttonOne="New Quote"
        actionOne={() => navigate("/admin/quotes/new")}
      />

      <SearchWithFilter />

      <QuoteLists />
    </div>
  );
};

export default Quotes;
