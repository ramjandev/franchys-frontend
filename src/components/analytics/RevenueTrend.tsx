import CardContainer from "@/components/shared/CardContainer";
import { monthlySummaries, trendData } from "@/pages/Admin/AnalyticsData";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface RevenueTrendProps {
  activeChartTab: "revenue" | "quotes" | "customers";
  setActiveChartTab: (tab: "revenue" | "quotes" | "customers") => void;
}
const RevenueTrend: React.FC<RevenueTrendProps> = ({
  activeChartTab,
  setActiveChartTab,
}) => {
  return (
    <CardContainer className="bg-white border border-[#E6EBF2] rounded-2xl shadow-sm p-6 overflow-hidden flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-5">
        <h2 className="text-lg font-bold text-[#111827]">Revenue Trend</h2>
        <div className="flex items-center gap-4 text-xs font-bold">
          {(["revenue", "quotes", "customers"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveChartTab(tab)}
              className={`capitalize transition-all px-3 py-1.5 rounded-lg ${activeChartTab === tab ? "text-[#007FFF] bg-[#007FFF]/5 font-bold" : "text-[#5C7899] hover:text-[#111827]"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={trendData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E6EBF2"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#A0B0C0", fontSize: 11, fontWeight: "600" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#A0B0C0", fontSize: 11, fontWeight: "600" }}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #E6EBF2",
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                fontSize: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#4CAF50"
              strokeWidth={3.5}
              dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="#F44336"
              strokeWidth={3.5}
              dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 text-xs font-bold text-[#5C7899]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#4CAF50]" />
          <span>Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#F44336]" />
          <span>Expenses</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-4 border-t border-[#F1F5F9] text-center">
        {monthlySummaries.map((m) => (
          <div key={m.label} className="flex flex-col gap-1">
            <span className="font-normal text-[#111827] text-sm leading-tight">
              {m.value}
            </span>
            <span className="text-[11px] text-[#45556C] font-semibold">
              {m.label}
            </span>
          </div>
        ))}
      </div>
    </CardContainer>
  );
};

export default RevenueTrend;
