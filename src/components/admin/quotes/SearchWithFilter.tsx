import CommonSelect from "@/components/shared/CommonSelect";
import { IoSearchSharp } from "react-icons/io5";

const SearchWithFilter = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 ">
      <div className="flex-1  w-full border border-border bg-white rounded-md  outline-none text-text text-base placeholder:text-[#90A1B9] flex items-center gap-2 pl-3">
        <IoSearchSharp className=" text-xl text-[#90A1B9]  " />
        <input
          type="search"
          placeholder="Search quotes or customers..."
          className={`py-3 w-full outline-none text-text text-base placeholder:text-[#90A1B9] `}
        />
      </div>

      <CommonSelect
        item={[
          { label: "All Status", value: "all" },
          { label: "Approved", value: "approved" },
          { label: "Sent", value: "sent" },
          { label: "Draft", value: "draft" },
        ]}
        value="all"
        onValueChange={(e) => console.log(e)}
        placeholder="All Status"
        className="w-full! sm:w-auto!"
      />
    </div>
  );
};

export default SearchWithFilter;
