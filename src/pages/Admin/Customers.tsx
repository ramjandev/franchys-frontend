import CustomersTable from "@/components/customer/CustomersTable";
import DashboardTopSection from "@/components/shared/DashboardTopSection";
import { useNavigate } from "react-router-dom";

const Customers = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-6 ">
      <DashboardTopSection
        title="Customers"
        description="Manage your clients and their details."
        backButton
        buttonOne="Add Customer"
        actionOne={() => navigate("/admin/customers/new")}
      />
      <CustomersTable />
    </div>
  );
};

export default Customers;
