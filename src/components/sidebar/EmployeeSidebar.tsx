import { Package } from "lucide-react";
import { BsBookFill } from "react-icons/bs";
import { CiSliderHorizontal } from "react-icons/ci";
import { FaFileInvoiceDollar, FaPowerOff } from "react-icons/fa6";
import { GoHomeFill } from "react-icons/go";
import { HiPlus } from "react-icons/hi";
import { PiUsersThreeFill } from "react-icons/pi";
import { SlHandbag } from "react-icons/sl";
import { NavLink, useLocation } from "react-router-dom";
import LogoWithSearch from "../shared/LogoWithSearch";

const EmployeeSidebar = () => {
  const { pathname } = useLocation();

  const menuItems = [
    {
      path: "dashboard",
      label: "Dashboard",
      icon1: GoHomeFill,
      icon2: CiSliderHorizontal,
    },
    {
      path: "my-invoices",
      label: "My Invoices",
      icon1: FaFileInvoiceDollar,
    },
    {
      path: "customers",
      label: "Customers",
      icon1: PiUsersThreeFill,
      icon2: HiPlus,
    },
    {
      path: "quotes",
      label: "Quotes",
      icon1: BsBookFill,
      icon2: HiPlus,
    },
    {
      path: "jobs",
      label: "Jobs",
      icon1: SlHandbag,
    },
    { path: "payments", label: "Payments", icon1: Package },
  ];

  const getIconClass = (isActive: boolean, i: number) => {
    if (isActive) {
      return "rounded-full text-white p-2 bg-[#0077FF] shadow-[inset_0_0_8.853px_#62ABFF] flex items-center justify-center ";
    }

    if (i === 2 || i === 3) {
      return "rounded-full text-[#0077FF] p-1 border-2 border-dashed border-[#0077FF] bg-[#0077FF]/20";
    }
    if (i === 3) {
      return "rounded-full bg-[#E6ECF2]  flex items-center justify-center min-w-6.5 min-h-6.5";
    }

    return "";
  };
  return (
    <div className="border-2 border-[#F0F3F7] bg-[#F5F7FA] shadow-[inset_0_40px_50px_0_#EBEFF4,_0_40px_34px_-10px_rgba(106,117,131,0.05)] backdrop-blur-[13.5914px] w-full h-full   flex flex-col">
      <LogoWithSearch />
      <nav className="flex-1 px-6 py-4 space-y-4 overflow-y-auto">
        {menuItems.map((item, i) => {
          const isActive = pathname.includes(item.path);
          const Icon1 = item.icon1;
          const Icon2 = item.icon2;
          return (
            <div
              key={item.path}
              className={`w-full flex items-center justify-between gap-3 py-2  pr-2 rounded-full text-sm font-medium transition  ${
                isActive
                  ? "rounded-full border-[1.771px] border-[#3885DE] bg-[#0077FF] shadow-[inset_0_8.853px_20.361px_0_rgba(36,80,130,0.40),_0_17.705px_53.116px_0_rgba(0,119,255,0.10)] font-bold text-white transition-all duration-300 ease-in-out pl-4"
                  : "text-[#5C7899] font-semibold"
              }`}
            >
              <div className="flex items-center gap-6.5">
                {Icon1 && <Icon1 className=" text-2xl" />}

                <NavLink to={item.path} className="">
                  {item.label}
                </NavLink>
              </div>
              {i === 4 && (
                <div className={getIconClass(isActive, i)}>
                  <span className="w-6.5 h-6.5 bg-[#E6ECF2] text-[#7D96B3] rounded-full flex items-center justify-center">
                    5
                  </span>
                </div>
              )}

              {Icon2 && (
                <div className={getIconClass(isActive, i)}>
                  <Icon2 className="text-2xl " />
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 ">
        <button className="w-full flex items-center gap-3 px-4 py-2 text-[#E13F38]  rounded-base text-base font-medium transition">
          <FaPowerOff className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};
export default EmployeeSidebar;
