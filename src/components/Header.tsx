import { FiBell } from "react-icons/fi";
import image from "../assets/images/profile.png";
import DashboardSearch from "./shared/DashboardSearch";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Lock, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="pr-8 py-4 pl-16 lg:pl-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full">
          <div className="relative w-full max-w-3xl">
            <DashboardSearch value="" onChange={() => {}} />
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button className="p-2 hover:bg-slate-100 rounded-lg relative">
            <FiBell className="w-6 h-6 text-[#45556C]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#FB2C36] shadow-[0_0_0_2px_#FFF] rounded-full"></span>
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-9 h-9 rounded-full overflow-hidden focus:outline-none cursor-pointer">
                <img
                  src={image}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-50 rounded-xl border border-[#E6EBF2] shadow-lg"
            >
              <DropdownMenuItem
                onClick={() => navigate("/admin/change-password")}
                className="cursor-pointer flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Change Password
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/admin/settings")}
                className="cursor-pointer flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Header;
