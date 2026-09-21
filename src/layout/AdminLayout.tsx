import Header from "@/components/Header";
import ProductionSheetBar from "@/components/invoice/ProductionSheetBar";
import Sidebar from "@/components/sidebar/AdminSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useGetMeQuery } from "@/store/Auth/authApi";
import { addCurrentUser } from "@/store/Auth/authSlice";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";

const AdminLayout = () => {
  const [open, setOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("admin_sidebar_collapsed");
    return saved !== null ? saved === "true" : false;
  });

  const { pathname } = useLocation();
  const isJobDetails = /^\/admin\/job-board\/[^/]+$/.test(pathname);

  const dispatch = useDispatch();
  const { data } = useGetMeQuery();
  useEffect(() => {
    if (data?.data) {
      dispatch(addCurrentUser(data.data));
    }
  }, [data, dispatch]);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("admin_sidebar_collapsed", String(next));
      return next;
    });
  };

  return (
    <div className="fixed inset-0 flex bg-[#E7ECEF]">
      {!isJobDetails && (
        <div
          className={`hidden lg:block h-full shrink-0 print:hidden transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? "w-20" : "w-80"
          }`}
        >
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            onItemClick={() => setOpen(false)}
            onToggle={handleToggleSidebar}
          />
        </div>
      )}

      <div className="flex flex-col flex-1 min-h-0 overflow-hidden w-full ">
        {isJobDetails ? (
          <ProductionSheetBar />
        ) : (
          <div className="  border-b border-[#E2E8F0] bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.10),_0_1px_2px_-1px_rgba(0,0,0,0.10)] shrink-0">
            <Header />
          </div>
        )}

        <div className="lg:hidden absolute top-4 left-4 z-20">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="p-2 bg-white rounded-lg shadow cursor-pointer">
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>

            <SheetContent side="left" className="p-0 w-64">
              <Sidebar
                onItemClick={() => setOpen(false)}
                onToggle={() => setOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex-1 overflow-y-auto  p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
