import defaultImage from "@/assets/images/profile.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetMeQuery } from "@/store/Auth/authApi";
import { Lock, Settings, User } from "lucide-react";
import { FiBell } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DashboardSearch from "./shared/DashboardSearch";

const Header = () => {
  const navigate = useNavigate();
  const { data } = useGetMeQuery();
  const user = data?.data;

  const profileImageUrl =
    user?.profileImage || user?.avatar || defaultImage;

  return (
    <div className="pr-8 py-4 pl-16 lg:pl-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full">
          <div className="relative w-full max-w-3xl">
            <DashboardSearch value="" onChange={() => {}} />
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            className="p-2 hover:bg-slate-100 rounded-lg relative cursor-pointer"
            title="Notifications"
          >
            <FiBell className="w-6 h-6 text-[#45556C]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#FB2C36] shadow-[0_0_0_2px_#FFF] rounded-full"></span>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="w-9 h-9 rounded-full overflow-hidden focus:outline-none cursor-pointer ring-2 ring-[#E6EBF2] hover:ring-blue-400 transition-all"
                title={user?.name || "User profile"}
              >
                <img
                  src={profileImageUrl}
                  alt={user?.name || "Profile"}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = defaultImage;
                  }}
                />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 rounded-xl border border-[#E6EBF2] shadow-lg p-1"
            >
              <div className="px-3 py-2 border-b border-[#E6EBF2] mb-1">
                <p className="text-sm font-semibold text-[#0F172B] truncate">
                  {user?.name || "Admin"}
                </p>
                <p className="text-xs text-[#5C7899] truncate">
                  {user?.email || ""}
                </p>
              </div>

              <DropdownMenuItem
                onClick={() => navigate("/admin/settings")}
                className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm text-[#0F172B] hover:bg-slate-50 rounded-lg"
              >
                <User className="w-4 h-4 text-[#5C7899]" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/admin/change-password")}
                className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm text-[#0F172B] hover:bg-slate-50 rounded-lg"
              >
                <Lock className="w-4 h-4 text-[#5C7899]" />
                Change Password
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/admin/settings")}
                className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm text-[#0F172B] hover:bg-slate-50 rounded-lg"
              >
                <Settings className="w-4 h-4 text-[#5C7899]" />
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
