import { Package } from "lucide-react";
import { BiSolidImageAlt } from "react-icons/bi";
import { BsBookFill } from "react-icons/bs";
import { CiSliderHorizontal } from "react-icons/ci";
import { FaFileInvoiceDollar, FaPowerOff } from "react-icons/fa6";
import { GoHomeFill } from "react-icons/go";
// import { HiPlus } from "react-icons/hi";
import { logout } from "@/store/Auth/authSlice";
import { memo } from "react";
import { LuChartNoAxesCombined } from "react-icons/lu";
import { PiUsersThreeFill } from "react-icons/pi";
import { SlHandbag } from "react-icons/sl";
import { TbBrandAdobe, TbMessageCircleFilled } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import LogoWithSearch from "../shared/LogoWithSearch";

interface AdminSidebarProps {
  onItemClick: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onItemClick }) => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };

  const menuGroups = [
    {
      title: "GENERAL",
      items: [
        {
          path: "dashboard",
          label: "Dashboard",
          icon1: GoHomeFill,
          icon2: CiSliderHorizontal,
        },
        { path: "quotes", label: "Quotes", icon1: BsBookFill },
        { path: "invoices", label: "Invoices", icon1: FaFileInvoiceDollar },
        { path: "customers", label: "Customers", icon1: PiUsersThreeFill },
        { path: "job-board", label: "Job Board", icon1: SlHandbag },
        { path: "mockups", label: "Mockups", icon1: BiSolidImageAlt },
        {
          path: "category-brand",
          label: "Category & Brand",
          icon1: TbBrandAdobe,
        },
        { path: "products", label: "Products", icon1: Package },
      ],
    },
    {
      title: "EXTRAS",
      items: [
        { path: "messages", label: "Messages", icon1: TbMessageCircleFilled },
      ],
    },
    {
      title: "FINANCIALS",
      items: [
        { path: "payment", label: "Payment", icon1: FaFileInvoiceDollar },
        { path: "analytics", label: "Analytics", icon1: LuChartNoAxesCombined },
      ],
    },
  ];

  // Icon2 wrapper: size/padding are ALWAYS the same.
  // Only color/background change on active state — this prevents
  // the row from growing/shrinking (which caused the vertical jump + blink).
  const getIconClass = (isActive: boolean) => {
    return `rounded-full p-2 flex items-center justify-center transition-colors duration-200 ${
      isActive
        ? "text-white bg-[#0077FF] shadow-[inset_0_0_8.853px_#62ABFF]"
        : "text-[#5C7899] bg-transparent"
    }`;
  };

  return (
    <div className="border-2 border-[#F0F3F7] bg-[#F5F7FA] shadow-[inset_0_40px_50px_0_#EBEFF4,_0_40px_34px_-10px_rgba(106,117,131,0.05)] backdrop-blur-[13.5914px] w-full h-full flex flex-col">
      <LogoWithSearch />

      <nav className="flex-1 px-6 py-4 space-y-6 overflow-y-auto">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-4">
            <h3 className="text-xs font-bold text-[#294566] uppercase tracking-wider pl-4">
              {group.title}
            </h3>
            <div className="space-y-2">
              {group.items.map((item) => {
                const isActive = pathname.includes(item.path);
                const Icon1 = item.icon1;
                const Icon2 = item.icon2;
                return (
                  <NavLink
                    to={item.path}
                    key={item.path}
                    onClick={onItemClick}
                    className={`w-full h-12 flex items-center justify-between gap-3 py-3 pr-2 rounded-full text-sm font-medium outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 transition-colors duration-150 ${
                      isActive
                        ? "border-[1.771px] border-[#3885DE] bg-[#0077FF] shadow-[inset_0_8.853px_20.361px_0_rgba(36,80,130,0.40),_0_17.705px_53.116px_0_rgba(0,119,255,0.10)] font-bold text-white pl-4"
                        : "text-[#5C7899] font-semibold hover:bg-gray-100 pl-4"
                    }`}
                    onMouseDown={(e) => e.currentTarget.blur()}
                  >
                    <div className="flex items-center gap-4">
                      {Icon1 && <Icon1 className="text-xl shrink-0" />}
                      <span className="truncate">{item.label}</span>
                    </div>

                    {Icon2 && (
                      <div className={getIconClass(isActive)}>
                        <Icon2 className="text-xl" />
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-[#E13F38] rounded-base text-base font-medium transition cursor-pointer hover:bg-gray-100"
        >
          <FaPowerOff className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default memo(AdminSidebar);
