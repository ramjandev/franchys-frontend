import ClientLayout from "@/layout/ClientLayout";

import Dashboard from "@/pages/Client/Dashboard";
import MyInvoices from "@/pages/Employee/MyInvoices";
import Payments from "@/pages/Employee/Payments";

const ClientRoute = {
  path: "/client",
  element: <ClientLayout />,
  children: [
    { index: true, element: <Dashboard /> },
    { path: "dashboard", element: <Dashboard /> },
    { path: "my-invoices", element: <MyInvoices /> },
    { path: "payments", element: <Payments /> },
  ],
};

export default ClientRoute;
