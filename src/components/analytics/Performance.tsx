import { productPerformanceData } from "@/pages/Admin/AnalyticsData";
import CardContainer from "../shared/CardContainer";

const Performance = () => {
  return (
    <CardContainer className="bg-white border border-[#E6EBF2] rounded-2xl shadow-sm p-6 overflow-hidden flex flex-col gap-4">
      <h2 className="text-lg font-bold text-[#111827]">Product Performance</h2>
      <div className="border border-[#E6EBF2] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01)] overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-xs text-[#5C7899] bg-[#F8FAFC] border-b border-[#E6EBF2]">
            <tr>
              {["PRODUCT", "CATEGORY", "UNITS SOLD", "REVENUE"].map((h) => (
                <th key={h} className="px-4 py-3.5 font-bold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {productPerformanceData.map((prod) => (
              <tr
                key={prod.product}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-4 py-3.5 text-[#0F172B] font-semibold">
                  {prod.product}
                </td>
                <td className="px-4 py-3.5 text-[#45556C] font-semibold">
                  {prod.category}
                </td>
                <td className="px-4 py-3.5 text-[#0F172B] font-semibold">
                  {prod.sold}
                </td>
                <td className="px-4 py-3.5 font-semibold text-[#0F172B]">
                  {prod.revenue}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContainer>
  );
};

export default Performance;
