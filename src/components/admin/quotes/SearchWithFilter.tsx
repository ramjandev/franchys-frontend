import CommonSelect from "@/components/shared/CommonSelect";
import { IoSearchSharp } from "react-icons/io5";

interface SearchWithFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
}

const SearchWithFilter: React.FC<SearchWithFilterProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 ">
      <div className="flex-1  w-full border border-border bg-white rounded-md  outline-none text-text text-base placeholder:text-[#90A1B9] flex items-center gap-2 pl-3">
        <IoSearchSharp className=" text-xl text-[#90A1B9]  " />
        <input
          type="search"
          placeholder="Search quotes or customers..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`py-3 w-full outline-none text-text text-base placeholder:text-[#90A1B9] `}
        />
      </div>

      <CommonSelect
        item={[
          { label: "All", value: "all" },
          { label: "Draft", value: "DRAFT" },
          { label: "Sent", value: "SENT" },
          { label: "Approved", value: "APPROVED" },
          { label: "Revision Requested", value: "REVISION_REQUESTED" },
          { label: "Declined", value: "DECLINED" },
        ]}
        value={status}
        onValueChange={onStatusChange}
        placeholder="All Status"
        className="w-full! sm:w-auto!"
      />
    </div>
  );
};

export default SearchWithFilter;
