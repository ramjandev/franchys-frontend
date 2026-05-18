import CustomerList from "@/components/admin/dashboard/CustomerList";
import RevenueBar from "@/components/admin/dashboard/RevenueBar";
import DashboardTopSection from "@/components/shared/DashboardTopSection";
import StatsCard from "@/components/shared/StatsCard";
import { togglePrivacy } from "@/store/designSlice";
import { Briefcase, CircleDot, DollarSign, FileText } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const statsData = [
  {
    title: "Total Revenue",
    value: "$8,100",
    icon: DollarSign,
    cardClassName: "bg-[#FEFCE8] border-[#FFF085]",
    iconWrapperClassName: "bg-[#FFF085]",
    iconClassName: "text-[#A65F00]",
  },
  {
    title: "Active Jobs",
    value: "5",
    icon: Briefcase,
    cardClassName: "bg-[#EFF6FF] border-[#BEDBFF]",
    iconWrapperClassName: "bg-[#BEDBFF]",
    iconClassName: "text-[#1447E6]",
  },
  {
    title: "Pending Approvals",
    value: "2",
    icon: CircleDot,
    cardClassName: "bg-[#FAF5FF] border-[#E9D4FF]",
    iconWrapperClassName: "bg-[#E9D4FF]",
    iconClassName: "text-[#8200DB]",
  },
  {
    title: "Unpaid Invoices",
    value: "2",
    icon: FileText,
    cardClassName: "bg-[#FDF2F8] border-[#FCCEE8]",
    iconWrapperClassName: "bg-[#FCCEE8]",
    iconClassName: "text-[#C6005C]",
  },
];
const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handlePrivacy = () => {
    dispatch(togglePrivacy());
  };

  return (
    <div className="flex flex-col gap-6 ">
      <DashboardTopSection
        title="Dashboard"
        description="Welcome back. Here's what's happening with your business today."
        buttonOne="Create Quote"
        buttonTwo="Add Customer"
        buttonThree="Privacy On"
        actionOne={() => navigate("../quotes")}
        actionTwo={() => navigate("../customers")}
        actionThree={handlePrivacy}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <RevenueBar />
      <CustomerList />
    </div>
  );
};

export default Dashboard;
