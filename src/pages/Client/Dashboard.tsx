import DashboardTopSection from "@/components/shared/DashboardTopSection";

const Dashboard = () => {
  return (
    <div>
      <DashboardTopSection
        title="Account Overview"
        description="View your invoices and payment history"
        buttonText="Create Invoice"
      />
    </div>
  );
};

export default Dashboard;
