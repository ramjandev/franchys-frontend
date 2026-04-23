import EmployeeLayout from "@/layout/EmployeeLayout";

import Customers from "@/pages/Employee/Customers";
import Dashboard from "@/pages/Employee/Dashboard";
import Jobs from "@/pages/Employee/Jobs";
import MyInvoices from "@/pages/Employee/MyInvoices";
import Payments from "@/pages/Employee/Payments";
import Quotes from "@/pages/Employee/Quotes";

const EmployeeRoute = {
  path: "/employee",
  element: <EmployeeLayout />,
  children: [
    { index: true, element: <Dashboard /> },
    { path: "dashboard", element: <Dashboard /> },
    { path: "my-invoices", element: <MyInvoices /> },
    { path: "customers", element: <Customers /> },
    { path: "quotes", element: <Quotes /> },
    { path: "jobs", element: <Jobs /> },
    { path: "payments", element: <Payments /> },
  ],
};

export default EmployeeRoute;
