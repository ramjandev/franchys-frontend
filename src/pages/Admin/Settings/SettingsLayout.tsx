import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  User, 
  Store, 
  FileText, 
  Box, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Link as LinkIcon, 
  MessageSquare,
  Building
} from "lucide-react";

const settingsLinks = [
  { name: "Profile Information", path: "/admin/settings/profile", icon: User },
  { name: "Shop Information", path: "/admin/settings/shop", icon: Store },
  { name: "Invoice Information", path: "/admin/settings/invoice", icon: FileText },
  { name: "Customize Your Line Items", path: "/admin/settings/line-items", icon: Box },
  { name: "Invoice Fees", path: "/admin/settings/fees", icon: DollarSign },
  { name: "Pricing Matrix", path: "/admin/settings/pricing", icon: TrendingUp },
  { name: "Vendors", path: "/admin/settings/vendors", icon: Building },
  { name: "Users", path: "/admin/settings/users", icon: Users },
  { name: "Social Links", path: "/admin/settings/social", icon: LinkIcon },
  { name: "Messaging", path: "/admin/settings/messaging", icon: MessageSquare },
];

const SettingsLayout = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-[1600px] mx-auto w-full h-[calc(100vh-8rem)]">
      {/* Settings Sidebar */}
      <div className="w-full lg:w-64 shrink-0 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#F1F5F9] overflow-hidden flex flex-col h-full">
        <div className="bg-[#0077FF] px-6 py-4 flex items-center gap-3">
          <div className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          </div>
          <h2 className="text-white font-bold text-lg">Settings</h2>
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
                    ? "bg-[#F5F8FF] text-[#0077FF]"
                    : "text-[#5C7899] hover:bg-[#F8FAFC] hover:text-[#111827]"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#F1F5F9] overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default SettingsLayout;
