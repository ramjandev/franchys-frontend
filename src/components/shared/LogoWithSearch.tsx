import { Search } from "lucide-react";
import { FaArrowLeft } from "react-icons/fa6";
import CommonHeader from "../shared/CommonHeader";

const LogoWithSearch = () => {
  return (
    <div>
      <div className="p-6 ">
        <CommonHeader size="3xl" className=" justify-center!  !text-[#294566] ">
          LOGO
        </CommonHeader>
      </div>

      <div className="flex justify-between items-center gap-3 mb-6 pl-5">
        <div className="relative">
          <img
            src="https://i.pravatar.cc/100"
            className="w-16 h-16 rounded-full object-cover ring-3 ring-[#E6EBF2] ring-offset-6"
          />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#17E933] rounded-full "></span>
        </div>
        <div>
          <CommonHeader size="md" className="font-semibold! text-[#294566]!">
            Jackson D.
          </CommonHeader>
          <CommonHeader size="xs" className="font-semibold!">
            Admin
          </CommonHeader>
        </div>
        <div className="rounded-l-[100px] border-2 border-[#44AA5C] bg-[#50BB69] shadow-[inset_0_10px_10px_0_rgba(0,0,0,0.10)] w-12.5 h-12.5 flex items-center justify-center">
          <FaArrowLeft className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="p-6">
        <div className="relative rounded-[28px] border-2 border-[#FAFBFC] bg-[#FAFBFC] shadow-[inset_0_11px_13px_0_rgba(230,236,242,0.40),_0_10px_15px_0_rgba(230,236,242,0.50)]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8C7D9]" />

          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-4 text-sm bg-transparent rounded-[28px] outline-none placeholder:text-[#7D96B3] placeholder:font-bold"
          />
        </div>
      </div>
    </div>
  );
};

export default LogoWithSearch;
