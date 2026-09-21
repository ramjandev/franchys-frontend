import CommonSelect from "@/components/shared/CommonSelect";
import SearchSpinner from "@/components/shared/loading/SearchSpinner";
import { IoSearchSharp } from "react-icons/io5";

interface StatusOption {
  label: string;
  value: string;
}

interface SearchWithFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  isFetching?: boolean;
  placeholder?: string;
  statusOptions?: StatusOption[];
  statusPlaceholder?: string;
}

const defaultStatusOptions: StatusOption[] = [
  { label: "All", value: "all" },
  { label: "Draft", value: "DRAFT" },
  { label: "Sent", value: "SENT" },
  { label: "Approved", value: "APPROVED" },
  { label: "Revision Requested", value: "REVISION_REQUESTED" },
  { label: "Declined", value: "DECLINED" },
];

const SearchWithFilter: React.FC<SearchWithFilterProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  isFetching = false,
  placeholder = "Search quotes or customers...",
  statusOptions = defaultStatusOptions,
  statusPlaceholder = "All Status",
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 ">
      <div className="flex-1 relative w-full border border-border bg-white rounded-md  outline-none text-text text-base placeholder:text-[#90A1B9] flex items-center gap-2 pl-3">
        <IoSearchSharp className=" text-xl text-[#90A1B9]  " />
        <input
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`py-3 w-full outline-none text-text text-base placeholder:text-[#90A1B9] `}
        />
        {isFetching && (
          <SearchSpinner className="absolute right-3 top-1/2 -translate-y-1/2" />
        )}
      </div>

      <CommonSelect
        item={statusOptions}
        value={status}
        onValueChange={onStatusChange}
        placeholder={statusPlaceholder}
        className="w-full! sm:w-auto!"
        w={200}
      />
    </div>
  );
};

export default SearchWithFilter;
