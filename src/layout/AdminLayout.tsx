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
  const { pathname } = useLocation();
  const isInvoiceDetails = /^\/admin\/invoices\/[^/]+$/.test(pathname);

  const dispatch = useDispatch();
  const { data } = useGetMeQuery();
  useEffect(() => {
    if (data?.data) {
      dispatch(addCurrentUser(data.data));
    }
  }, [data, dispatch]);
  return (
    <div className="flex h-screen bg-[#E7ECEF] overflow-hidden">
      {!isInvoiceDetails && (
        <div className="hidden lg:block w-80 h-full shrink-0  print:hidden">
          <Sidebar onItemClick={() => setOpen(false)} />
        </div>
      )}

      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {isInvoiceDetails ? (
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
