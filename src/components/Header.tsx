import { FiBell } from "react-icons/fi";
import image from "../assets/images/profile.png";
import DashboardSearch from "./shared/DashboardSearch";

const Header = () => {
  return (
    <div className="pr-8 py-4 pl-16 lg:pl-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full">
          <div className="relative w-full max-w-3xl">
            <DashboardSearch />
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button className="p-2 hover:bg-slate-100 rounded-lg relative">
            <FiBell className="w-6 h-6 text-[#45556C]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#FB2C36] shadow-[0_0_0_2px_#FFF] rounded-full"></span>
          </button>

          <div className="w-9 h-9">
            <img
              src={image}
              alt=""
              className="w-full h-full flex items-center justify-center rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
