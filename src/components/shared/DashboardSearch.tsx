import { Search } from "lucide-react";

const DashboardSearch = () => {
  return (
    <div className=" relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#90A1B9]" />
      <input
        type="text"
        placeholder="Search customers, quotes, products..."
        className="w-full pl-9 pr-4 py-2.5 border border-border rounded-[14px] bg-[#F8FAFC] outline-none "
      />
    </div>
  );
};

export default DashboardSearch;
