import { useState } from "react";
import { ArrowLeft, TrendingUp, Users, FileText, Package, Download, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import CardContainer from "@/components/shared/CardContainer";

const trendData = [
  { name: "Jan", revenue: 210000, expenses: 130000 },
  { name: "Feb", revenue: 240000, expenses: 140000 },
  { name: "Mar", revenue: 280000, expenses: 155000 },
  { name: "Apr", revenue: 310000, expenses: 160000 },
  { name: "May", revenue: 330000, expenses: 180000 },
  { name: "Jun", revenue: 380000, expenses: 195000 },
];

const monthlySummaries = [
  { label: "Jan", value: "$8.2k" },
  { label: "Feb", value: "$7.8k" },
  { label: "Mar", value: "$9.5k" },
  { label: "Apr", value: "$9.9k" },
  { label: "May", value: "$10.2k" },
  { label: "Jun", value: "$11.3k" },
];

const topCustomers = [
  { rank: "#1", name: "Bay Area Tech Summit", orders: "5 orders", amount: "$8,100", trend: "+12%" },
  { rank: "#2", name: "Golden State Realty", orders: "3 orders", amount: "$5,450", trend: "+9%" },
  { rank: "#3", name: "Riverside Church", orders: "3 orders", amount: "$4,200", trend: "+8%" },
  { rank: "#4", name: "Metro Fire Department", orders: "4 orders", amount: "$3,850", trend: "+12%" },
  { rank: "#5", name: "Craft Brewery Co", orders: "6 orders", amount: "$3,200", trend: "+5%" },
];

const quoteStatuses = [
  { name: "Approved", count: 24, percent: "58.2%", color: "bg-[#00BC7D]" },
  { name: "Sent", count: 28, percent: "15.5%", color: "bg-[#FE9A00]" },
  { name: "Draft", count: 16, percent: "20.3%", color: "bg-[#90A1B9]" },
  { name: "Declined", count: 0, percent: "10.1%", color: "bg-[#FB2C36]" },
];

const productPerformanceData = [
  { product: "Classic Collar T-Shirt", category: "T-Shirts", sold: 842, revenue: "$26,944" },
  { product: "Premium Performance Polo", category: "Polos", sold: 523, revenue: "$21,505" },
  { product: "Heavyweight Pullover Hoodie", category: "Hoodies", sold: 412, revenue: "$18,540" },
  { product: "50/50 Crewneck Tee", category: "T-Shirts", sold: 287, revenue: "$10,082" },
  { product: "Structured Trucker Hat", category: "Headwear", sold: 205, revenue: "$5,862" },
];

const Analytics = () => {
  const [activeChartTab, setActiveChartTab] = useState<"revenue" | "quotes" | "customers">("revenue");

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link to="/admin/dashboard" className="mt-1">
            <ArrowLeft className="w-5 h-5 text-[#5C7899] hover:text-[#111827] transition-colors" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#111827] mb-1">
              Reports & Analytics
            </h1>
            <p className="text-sm text-[#5C7899]">
              Track performance and analyze business metrics.
            </p>
          </div>
        </div>
        
        {/* Date Filter & Export Button */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Select Date Range..."
              className="pl-9 pr-3 py-2 border border-[#D1D5DB] rounded-lg text-xs font-semibold text-[#4B5563] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] bg-white shadow-xs w-48"
            />
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2.5 bg-[#111827] text-white hover:bg-black rounded-lg text-xs font-semibold shadow-sm transition-colors uppercase tracking-wider">
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>
      </div>

      {/* 4 Metric Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <CardContainer className="bg-white border border-[#E6EBF2] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#1D4ED8]" />
            </div>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full  text-[#009966] text-xs font-bold">
              ↗ +18.2%
            </span>
          </div>
          <div className="mt-4">
            <h2 className="text-2xl font-medium text-[#111827]">$45,280</h2>
            <p className="text-xs text-[#5C7899] font-semibold mt-0.5">Total Revenue</p>
          </div>
        </CardContainer>

        {/* Active Customers */}
        <CardContainer className="bg-white border border-[#E6EBF2] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-lg bg-[#EAFAF1] flex items-center justify-center">
              <Users className="w-5 h-5 text-[#10B981]" />
            </div>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full  text-[#009966] text-xs font-bold">
              ↗ +12.5%
            </span>
          </div>
          <div className="mt-4">
            <h2 className="text-2xl font-medium text-[#111827]">127</h2>
            <p className="text-xs text-[#5C7899] font-semibold mt-0.5">Active Customers</p>
          </div>
        </CardContainer>

        {/* Quotes Sent */}
        <CardContainer className="bg-white border border-[#E6EBF2] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-lg bg-[#FAF5FF] flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#7C3AED]" />
            </div>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full  text-[#009966] text-xs font-bold">
              ↗ +8.1%
            </span>
          </div>
          <div className="mt-4">
            <h2 className="text-2xl font-medium text-[#111827]">89</h2>
            <p className="text-xs text-[#5C7899] font-semibold mt-0.5">Quotes Sent</p>
          </div>
        </CardContainer>

        {/* Products Sold */}
        <CardContainer className="bg-white border border-[#E6EBF2] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-lg bg-[#FFF7ED] flex items-center justify-center">
              <Package className="w-5 h-5 text-[#F97316]" />
            </div>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[#009966] text-xs font-bold">
              ↗ +24.3%
            </span>
          </div>
          <div className="mt-4">
            <h2 className="text-2xl font-medium text-[#111827]">2,847</h2>
            <p className="text-xs text-[#5C7899] font-semibold mt-0.5">Products Sold</p>
          </div>
        </CardContainer>
      </div>

      {/* Revenue Trend Massive Chart */}
      <CardContainer className="bg-white border border-[#E6EBF2] rounded-2xl shadow-sm p-6 overflow-hidden flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-5">
          <h2 className="text-lg font-bold text-[#111827]">Revenue Trend</h2>
          <div className="flex items-center gap-4 text-xs font-bold">
            {(["revenue", "quotes", "customers"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveChartTab(tab)}
                className={`capitalize transition-all px-3 py-1.5 rounded-lg ${
                  activeChartTab === tab
                    ? "text-[#007FFF] bg-[#007FFF]/5 font-bold"
                    : "text-[#5C7899] hover:text-[#111827]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Line Chart Render */}
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6EBF2" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#A0B0C0', fontSize: 11, fontWeight: '600' }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#A0B0C0', fontSize: 11, fontWeight: '600' }}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #E6EBF2',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  fontSize: '12px'
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

        {/* Legend Custom Draw */}
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

        {/* Monthly summaries grid list */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-4 border-t border-[#F1F5F9] text-center">
          {monthlySummaries.map((m) => (
            <div key={m.label} className="flex flex-col gap-1">
              <span className="font-normal text-[#111827] text-sm leading-tight">{m.value}</span>
              <span className="text-[11px] text-[#45556C] font-semibold">{m.label}</span>
            </div>
          ))}
        </div>
      </CardContainer>

      {/* Top Customers & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers Card */}
        <CardContainer className="bg-white border border-[#E6EBF2] rounded-2xl shadow-sm p-6 overflow-hidden flex flex-col gap-5">
          <h2 className="text-lg font-bold text-[#111827]">Top Customers</h2>
          <div className="flex flex-col gap-4">
            {topCustomers.map((cust) => (
              <div key={cust.rank} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#1D4ED8] flex items-center justify-center font-medium text-xs">
                    {cust.rank}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-[#111827] text-sm leading-tight">{cust.name}</span>
                    <span className="text-xs text-[#6B7280] font-semibold leading-none">{cust.orders}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="font-medium text-[#111827] text-sm leading-tight">{cust.amount}</span>
                  <span className="text-[11px] text-[#10B981] font-bold leading-none">{cust.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContainer>

        {/* Quote Status Breakdown Card */}
        <CardContainer className="bg-white border border-[#E6EBF2] rounded-2xl shadow-sm p-6 overflow-hidden flex flex-col gap-5">
          <h2 className="text-lg font-bold text-[#111827]">Quote Status Breakdown</h2>
          <div className="flex flex-col gap-5">
            {quoteStatuses.map((status) => {
              // Convert count to fill percentage for rendering
              const maxVal = 28;
              const fillW = maxVal > 0 ? (status.count / maxVal) * 100 : 0;
              return (
                <div key={status.name} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-[#0F172B]">{status.name}</span>
                    <div className="flex items-center gap-1.5 text-[#5C7899]">
                      <span>{status.count}</span>
                      <span className="text-[10px] font-semibold">({status.percent})</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${status.color} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(4, fillW)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContainer>
      </div>

      {/* Footer Table Product Performance */}
      <CardContainer className="bg-white border border-[#E6EBF2] rounded-2xl shadow-sm p-6 overflow-hidden flex flex-col gap-4">
        <h2 className="text-lg font-bold text-[#111827]">Product Performance</h2>
        
        <div className="border border-[#E6EBF2] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-[#5C7899] bg-[#F8FAFC] border-b border-[#E6EBF2]">
                <tr>
                  <th className="px-4 py-3.5 font-bold">PRODUCT</th>
                  <th className="px-4 py-3.5 font-bold">CATEGORY</th>
                  <th className="px-4 py-3.5 font-bold">UNITS SOLD</th>
                  <th className="px-4 py-3.5 font-bold">REVENUE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {productPerformanceData.map((prod) => (
                  <tr key={prod.product} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5 text-[#0F172B] font-semibold">{prod.product}</td>
                    <td className="px-4 py-3.5 text-[#45556C] font-semibold">{prod.category}</td>
                    <td className="px-4 py-3.5 text-[#0F172B] font-semibold">{prod.sold}</td>
                    <td className="px-4 py-3.5 font-semibold text-[#0F172B]">{prod.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContainer>
    </div>
  );
};

export default Analytics;
