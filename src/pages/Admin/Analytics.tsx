import { ArrowLeft, TrendingUp, Users, FileCheck, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const performanceData = [
  { name: "Jan", revenue: 4000, quotes: 24 },
  { name: "Feb", revenue: 3000, quotes: 13 },
  { name: "Mar", revenue: 2000, quotes: 98 },
  { name: "Apr", revenue: 2780, quotes: 39 },
  { name: "May", revenue: 1890, quotes: 48 },
  { name: "Jun", revenue: 2390, quotes: 38 },
  { name: "Jul", revenue: 3490, quotes: 43 },
];

const Analytics = () => {
  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full pb-10">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link to="/admin/dashboard" className="mt-1">
            <ArrowLeft className="w-5 h-5 text-[#5C7899] hover:text-[#111827]" />
          </Link>
          <div>
            <h1 className="text-3xl font-semibold text-[#111827] mb-1">
              Analytics
            </h1>
            <p className="text-sm text-[#5C7899]">
              View detailed reports and performance metrics.
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <select className="h-10 rounded-md border border-[#E6EBF2] bg-white px-3 py-2 text-sm outline-none focus:border-[#0077FF]">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 border border-[#F1F5F9]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#E0F2FE] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#0284C7]" />
            </div>
            <p className="text-sm text-[#5C7899] font-medium">Total Revenue</p>
          </div>
          <h2 className="text-3xl font-bold text-[#111827]">$124,500</h2>
          <p className="text-xs text-[#16A34A] mt-2 font-medium">+14.5% from last period</p>
        </div>

        <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 border border-[#F1F5F9]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#F3E8FF] flex items-center justify-center">
              <Users className="w-5 h-5 text-[#9333EA]" />
            </div>
            <p className="text-sm text-[#5C7899] font-medium">New Customers</p>
          </div>
          <h2 className="text-3xl font-bold text-[#111827]">45</h2>
          <p className="text-xs text-[#16A34A] mt-2 font-medium">+5.2% from last period</p>
        </div>

        <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 border border-[#F1F5F9]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-[#D97706]" />
            </div>
            <p className="text-sm text-[#5C7899] font-medium">Quotes Accepted</p>
          </div>
          <h2 className="text-3xl font-bold text-[#111827]">128</h2>
          <p className="text-xs text-[#E11D48] mt-2 font-medium">-2.1% from last period</p>
        </div>

        <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 border border-[#F1F5F9]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#ECFDF5] flex items-center justify-center">
              <Activity className="w-5 h-5 text-[#059669]" />
            </div>
            <p className="text-sm text-[#5C7899] font-medium">Conversion Rate</p>
          </div>
          <h2 className="text-3xl font-bold text-[#111827]">68.4%</h2>
          <p className="text-xs text-[#16A34A] mt-2 font-medium">+8.4% from last period</p>
        </div>
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 border border-[#F1F5F9]">
          <h2 className="text-lg font-bold text-[#111827] mb-6">Revenue Over Time</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0077FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0077FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6EBF2" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#A0B0C0', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A0B0C0', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0077FF" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 border border-[#F1F5F9]">
          <h2 className="text-lg font-bold text-[#111827] mb-6">Quotes Created vs Accepted</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorQuotes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333EA" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#9333EA" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6EBF2" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#A0B0C0', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A0B0C0', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                />
                <Area type="monotone" dataKey="quotes" stroke="#9333EA" strokeWidth={3} fillOpacity={1} fill="url(#colorQuotes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
