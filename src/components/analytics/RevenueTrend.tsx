import CardContainer from "@/components/shared/CardContainer";
import { RevenueTrend } from "@/store/dashboard/types/dashboard";
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
  revenueTrends: RevenueTrend[];
}

const RevenueTrend: React.FC<RevenueTrendProps> = ({ revenueTrends }) => {
  return (
    <CardContainer className="bg-white border border-[#E6EBF2] rounded-2xl shadow-sm p-6 overflow-hidden flex flex-col gap-6">
      <div className="h-75">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={revenueTrends}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E6EBF2"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#A0B0C0", fontSize: 11, fontWeight: 600 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#A0B0C0", fontSize: 11, fontWeight: 600 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />

            <Tooltip
              formatter={(value) => [
                `$${Number(value ?? 0).toLocaleString()}`,
                "Revenue",
              ]}
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
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#5C7899]">
        <div className="w-2.5 h-2.5 rounded-full bg-[#4CAF50]" />
        <span>Revenue</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-4 border-t border-[#F1F5F9] text-center">
        {revenueTrends.map((item) => (
          <div key={item.month} className="flex flex-col gap-1">
            <span className="font-normal text-[#111827] text-sm leading-tight">
              ${item.revenue.toLocaleString()}
            </span>
            <span className="text-[11px] text-[#45556C] font-semibold">
              {item.month}
            </span>
          </div>
        ))}
      </div>
    </CardContainer>
  );
};

export default RevenueTrend;
