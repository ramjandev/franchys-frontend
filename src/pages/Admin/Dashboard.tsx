import CustomerList from "@/components/admin/dashboard/CustomerList";
import RevenueBar from "@/components/admin/dashboard/RevenueBar";
import DashboardTopSection from "@/components/shared/DashboardTopSection";
import StatsCard from "@/components/shared/StatsCard";
import { useGetDashboardQuery } from "@/store/dashboard/dashboardApi";
import { togglePrivacy } from "@/store/mockUp/designSlice";
import { Briefcase, CircleDot, DollarSign, FileText } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handlePrivacy = () => {
    dispatch(togglePrivacy());
  };

  const { data } = useGetDashboardQuery();

  const summary = data?.data?.summary;
  // const revenueTrends = data?.data?.revenueTrends;
  const statsData = [
    {
      title: "Total Revenue",
      value: summary?.totalRevenue ?? 0,
      icon: DollarSign,
      cardClassName: "bg-[#FEFCE8] border-[#FFF085]",
      iconWrapperClassName: "bg-[#FFF085]",
      iconClassName: "text-[#A65F00]",
    },
    {
      title: "Active Jobs",
      value: summary?.activeJobs ?? 0,
      icon: Briefcase,
      cardClassName: "bg-[#EFF6FF] border-[#BEDBFF]",
      iconWrapperClassName: "bg-[#BEDBFF]",
      iconClassName: "text-[#1447E6]",
    },
    {
      title: "Pending Approvals",
      value: summary?.conversionRate ?? 0,
      icon: CircleDot,
      cardClassName: "bg-[#FAF5FF] border-[#E9D4FF]",
      iconWrapperClassName: "bg-[#E9D4FF]",
      iconClassName: "text-[#8200DB]",
    },
    {
      title: "Unpaid Invoices",
      value: summary?.campaignsSent ?? 0,
      icon: FileText,
      cardClassName: "bg-[#FDF2F8] border-[#FCCEE8]",
      iconWrapperClassName: "bg-[#FCCEE8]",
      iconClassName: "text-[#C6005C]",
    },
  ];
  return (
    <div className="flex flex-col gap-6 ">
      <DashboardTopSection
        title="Dashboard"
        description="Welcome back. Here's what's happening with your business today."
        buttonOne="Create Quote"
        buttonTwo="Add Customer"
        buttonThree="Privacy On"
        actionOne={() => navigate("../quotes/new")}
        actionTwo={() => navigate("../customers/new")}
        actionThree={handlePrivacy}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <RevenueBar
        total={490827.06}
        trends={[
          { month: "Apr 1 – Apr 7", revenue: 0 },
          { month: "Apr 8 – Apr 14", revenue: 0 },
          { month: "Apr 15 – Apr 21", revenue: 1039.15 },
          { month: "Apr 22 – Apr 28", revenue: 37087.99 },
        ]}
      />
      <CustomerList />
    </div>
  );
};

export default Dashboard;
