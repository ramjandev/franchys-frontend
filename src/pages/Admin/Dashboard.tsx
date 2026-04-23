import RecentActivity from "@/components/admin/dasboard/RecentActivity";
import RecentQuotes from "@/components/admin/dasboard/RecentQuotes";
import CardContainer from "@/components/shared/CardContainer";
import CommonHeader from "@/components/shared/CommonHeader";
import DashboardTopSection from "@/components/shared/DashboardTopSection";
import { Briefcase, Clock, DollarSign, FileText } from "lucide-react";

const statsData = [
  {
    title: "Total Revenue",
    value: "$8,100",
    icon: DollarSign,
    bg: "bg-[#FEFCE8]",
    border: "border-[#FFF085]",
    text: "text-[#0F172B]",
    iconColor: "text-[#A65F00]",
    iconBg: "bg-[#FFF085]",
  },
  {
    title: "Active Jobs",
    value: "5",
    icon: Briefcase,
    bg: "bg-[#EFF6FF]",
    border: "border-[#BEDBFF]",
    text: "text-[#0F172B]",
    iconColor: "text-[#1447E6]",
    iconBg: "bg-[#BEDBFF]",
  },
  {
    title: "Pending Approvals",
    value: "2",
    icon: Clock,
    bg: "bg-[#FAF5FF]",
    border: "border-[#E9D4FF]",
    text: "text-[#0F172B]",
    iconColor: "text-[#8200DB]",
    iconBg: "bg-[#E9D4FF]",
  },
  {
    title: "Unpaid Invoices",
    value: "2",
    icon: FileText,
    bg: "bg-[#FDF2F8]",
    border: "border-[#FCCEE8]",
    text: "text-[#0F172B]",
    iconColor: "text-[#C6005C]",
    iconBg: "bg-[#FCCEE8]",
  },
];
const Dashboard = () => {
  return (
    <div className="">
      <DashboardTopSection
        title="Dashboard"
        description="Welcome back. Here's what's happening with your business today."
        buttonText="Create Quote"
        action={() => console.log("Create Invoice")}
        secondaryButtonText="Add Customer"
        secondaryAction={() => console.log("Create Job")}
      />
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {statsData.map((item, index) => {
            const Icon = item.icon;
            return (
              <CardContainer
                size="lg"
                key={index}
                className={` ${item.bg} border ${item.border} `}
              >
                <div className=" space-y-2">
                  <div className={`${item.iconBg} mb-3 p-2 rounded-md w-fit`}>
                    <Icon className={`w-5 h-5 ${item.iconColor}`} />
                  </div>
                  <CommonHeader size="sm" className={` ${item.text}`}>
                    {item.title}
                  </CommonHeader>

                  <CommonHeader size="3xl" className={` ${item.text}`}>
                    {item.value}
                  </CommonHeader>
                </div>
              </CardContainer>
            );
          })}
        </div>

        <div className="grid grid-cols-1  2xl:grid-cols-3 gap-6 items-stretch">
          <div className=" 2xl:col-span-2 h-full">
            <RecentQuotes />
          </div>
          <div className="h-full">
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
