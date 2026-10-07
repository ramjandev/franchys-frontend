import logo from "@/assets/images/logo.png";
import defaultImage from "@/assets/images/profile.png";
import { useGetMeQuery } from "@/store/Auth/authApi";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import CommonHeader from "../shared/CommonHeader";

interface LogoWithSearchProps {
  onToggle?: () => void;
  isCollapsed?: boolean;
}

const LogoWithSearch: React.FC<LogoWithSearchProps> = ({
  onToggle,
  isCollapsed = false,
}) => {
  const { data } = useGetMeQuery();
  const user = data?.data;

  const profileImageUrl =
    user?.profileImage || user?.avatar || defaultImage;

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center py-4 gap-3 shrink-0">
        <div className="w-10 h-10 flex items-center justify-center">
          <img className="w-full h-full object-contain" src={logo} alt="logo" />
        </div>

        <div className="relative">
          <img
            src={profileImageUrl}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-[#E6EBF2]"
            alt={user?.name || "Profile"}
            onError={(e) => {
              (e.target as HTMLImageElement).src = defaultImage;
            }}
          />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#17E933] rounded-full ring-2 ring-white"></span>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="rounded-full border-2 border-[#44AA5C] bg-[#50BB69] shadow-[inset_0_10px_10px_0_rgba(0,0,0,0.10)] w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-[#43a85b] active:scale-95 transition-all outline-none"
          title="Expand sidebar"
          aria-label="Expand sidebar"
        >
          <FaArrowRight className="w-4 h-4 text-white" />
        </button>

        <div className="w-10 h-[1px] bg-[#E2E8F0] mt-1" />
      </div>
    );
  }

  return (
    <div>
      <div className="w-full flex justify-center items-center pb-8">
        <div className="w-32.5 h-25 ">
          <img className="w-full h-full object-cover " src={logo} alt="logo" />
        </div>
      </div>
      <div className="flex justify-between items-center gap-3 mb-6 pl-5">
        <div className="relative">
          <img
            src={profileImageUrl}
            className="w-16 h-16 rounded-full object-cover ring-3 ring-[#E6EBF2] ring-offset-6"
            alt={user?.name || "Profile"}
            onError={(e) => {
              (e.target as HTMLImageElement).src = defaultImage;
            }}
          />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#17E933] rounded-full"></span>
        </div>
        <div>
          <CommonHeader size="md" className="font-semibold! text-[#294566]!">
            {user?.name}
          </CommonHeader>
          <CommonHeader size="xs" className="font-semibold!">
            {user?.email}
          </CommonHeader>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="rounded-l-[100px] border-2 border-[#44AA5C] bg-[#50BB69] shadow-[inset_0_10px_10px_0_rgba(0,0,0,0.10)] w-12.5 h-12.5 flex items-center justify-center cursor-pointer hover:bg-[#43a85b] active:scale-95 transition-all outline-none"
          title="Collapse sidebar"
          aria-label="Collapse sidebar"
        >
          <FaArrowLeft className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="p-4" />
    </div>
  );
};

export default LogoWithSearch;
