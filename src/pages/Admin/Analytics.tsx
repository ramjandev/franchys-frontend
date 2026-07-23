import Performance from "@/components/analytics/Performance";
import RevenueTrend from "@/components/analytics/RevenueTrend";
import StatusBreakdown from "@/components/analytics/StatusBreakdown";
import CardContainer from "@/components/shared/CardContainer";
import DashboardTopSection from "@/components/shared/DashboardTopSection";
import { FileText, Package, TrendingUp, Users } from "lucide-react";
import { useState } from "react";

const metrics = [
  {
    label: "Total Revenue",
    val: "$45,280",
    pct: "↗ +18.2%",
    bg: "bg-[#EFF6FF]",
    text: "text-[#1D4ED8]",
    Icon: TrendingUp,
  },
  {
    label: "Active Customers",
    val: "127",
    pct: "↗ +12.5%",
    bg: "bg-[#EAFAF1]",
    text: "text-[#10B981]",
    Icon: Users,
  },
  {
    label: "Quotes Sent",
    val: "89",
    pct: "↗ +8.1%",
    bg: "bg-[#FAF5FF]",
    text: "text-[#7C3AED]",
    Icon: FileText,
  },
  {
    label: "Products Sold",
    val: "2,847",
    pct: "↗ +24.3%",
    bg: "bg-[#FFF7ED]",
    text: "text-[#F97316]",
    Icon: Package,
  },
];

const Analytics = () => {
  const [activeChartTab, setActiveChartTab] = useState<
    "revenue" | "quotes" | "customers"
  >("revenue");

  return (
    <div className="flex flex-col gap-6 w-full ">
      <DashboardTopSection
        title="Reports & Analytics"
        description="Track performance and analyze business metrics."
        backButton
        buttonOne="Export"
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(({ label, val, pct, bg, text, Icon }) => (
          <CardContainer
            key={label}
            className="bg-white border border-[#E6EBF2] rounded-xl p-5 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${bg}`}
              >
                <Icon className={`w-5 h-5 ${text}`} />
              </div>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[#009966] text-xs font-bold">
                {pct}
              </span>
            </div>
            <div className="mt-4">
              <h2 className="text-2xl font-medium text-[#111827]">{val}</h2>
              <p className="text-xs text-[#5C7899] font-semibold mt-0.5">
                {label}
              </p>
            </div>
          </CardContainer>
        ))}
      </div>

      <RevenueTrend
        activeChartTab={activeChartTab}
        setActiveChartTab={setActiveChartTab}
      />

      <StatusBreakdown />

      <Performance />
    </div>
  );
};

export default Analytics;
