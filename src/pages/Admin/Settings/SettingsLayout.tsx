import CardContainer from "@/components/shared/CardContainer";
import CommonSelect from "@/components/shared/CommonSelect";
import {
  Box,
  Building,
  DollarSign,
  FileText,
  Link as LinkIcon,
  Store,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { LuDatabaseBackup } from "react-icons/lu";
import { MdOutlinePayment } from "react-icons/md";

import { IoSettingsOutline } from "react-icons/io5";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const settingsLinks = [
  { name: "Profile Information", path: "/admin/settings/profile", icon: User },
  { name: "Shop Information", path: "/admin/settings/shop", icon: Store },
  {
    name: "Invoice Information",
    path: "/admin/settings/invoice",
    icon: FileText,
  },
  {
    name: "Customize Your Line Items",
    path: "/admin/settings/line-items",
    icon: Box,
  },
  { name: "Invoice Fees", path: "/admin/settings/fees", icon: DollarSign },
  { name: "Pricing Matrix", path: "/admin/settings/pricing", icon: TrendingUp },
  {
    name: "Payment Terms",
    path: "/admin/settings/payment-terms",
    icon: MdOutlinePayment,
  },
  { name: "Vendors", path: "/admin/settings/vendors", icon: Building },
  { name: "Users", path: "/admin/settings/users", icon: Users },
  { name: "Social Links", path: "/admin/settings/social", icon: LinkIcon },
  { name: "SanMar", path: "/admin/settings/sanmar", icon: LuDatabaseBackup },
];

const selectOptions = settingsLinks.map((link) => ({
  label: link.name,
  value: link.path,
}));

const SettingsLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const activePath = settingsLinks.find((link) =>
    location.pathname.includes(link.path),
  )?.path;

  return (
    <div className="flex flex-col xl:flex-row gap-6 items-start">
      {/* Mobile select — hidden on xl+ */}
      <div className="w-full xl:hidden">
        <CommonSelect
          value={activePath}
          item={selectOptions}
          w={300}
          className="w-full"
          onValueChange={(val) => navigate(val)}
        />
      </div>

      {/* Sidebar — hidden below xl */}
      <div className="hidden xl:flex w-70 shrink-0 bg-white rounded-xl overflow-hidden flex-col h-full">
        <div className="bg-[linear-gradient(90deg,_#155DFC_0%,_#1447E6_100%)] px-6 py-4 flex items-center gap-2">
          <div className="text-white">
            <IoSettingsOutline className="w-6 h-6" />
          </div>
          <h2 className="text-white font-bold text-xl">Settings</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {settingsLinks.map((link) => {
            const isActive = location.pathname.includes(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#EFF6FF] text-[#1447E6]"
                    : "text-[#314158] hover:bg-[#F8FAFC] hover:text-[#111827]"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>

      <CardContainer size="xl" className="flex-1">
        <Outlet />
      </CardContainer>
    </div>
  );
};

export default SettingsLayout;
