import Header from "@/components/Header";
import Sidebar from "@/components/sidebar/AdminSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex h-screen bg-[#E7ECEF] overflow-hidden">
      <div className="hidden lg:block w-80 h-full shrink-0 ">
        <Sidebar onItemClick={() => setOpen(false)} />
      </div>

      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <div className=" border-b border-[#E2E8F0] bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.10),_0_1px_2px_-1px_rgba(0,0,0,0.10)] shrink-0">
          <Header />
        </div>

        <div className="lg:hidden absolute top-4 left-4 z-20">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="p-2 bg-white rounded-lg shadow cursor-pointer">
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>

            <SheetContent side="left" className="p-0 w-64">
              <Sidebar onItemClick={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;                                           
