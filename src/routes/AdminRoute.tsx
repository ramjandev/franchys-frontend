import AdminLayout from "@/layout/AdminLayout";
import Billing from "@/pages/Admin/Billing";
import Customers from "@/pages/Admin/Customers";
import Dashboard from "@/pages/Admin/Dashboard";
import Jobs from "@/pages/Admin/Jobs";
import Messages from "@/pages/Admin/Messages";
import Mockups from "@/pages/Admin/Mockups";
import Products from "@/pages/Admin/Products";
import Quotes from "@/pages/Admin/Quotes";
import Reports from "@/pages/Admin/Reports";

const AdminRoute = {
  path: "/admin",
  element: <AdminLayout />,
  children: [
    {
      index: true,
      element: <Dashboard />,
    },

    { path: "dashboard", element: <Dashboard /> },
    { path: "customers", element: <Customers /> },
    { path: "quotes", element: <Quotes /> },
    { path: "jobs", element: <Jobs /> },
    { path: "mockups", element: <Mockups /> },
    { path: "products", element: <Products /> },
    { path: "messages", element: <Messages /> },
    { path: "billing", element: <Billing /> },
    { path: "reports", element: <Reports /> },
  ],
};

export default AdminRoute;
