import CardContainer from "@/components/shared/CardContainer";
import CommonHeader from "@/components/shared/CommonHeader";
import type { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface RevenueTrend {
  month: string;
  revenue: number;
}

interface RevenueBarProps {
  total: number;
  trends: RevenueTrend[];
  isLoading?: boolean;
}

function formatCurrency(val = 0) {
  return val === 0
    ? "$0.00"
    : "$" +
        val.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
}

const RevenueBar = ({ total, trends, isLoading }: RevenueBarProps) => {
  const [animatedWidth, setAnimatedWidth] = useState(0);

  const currentRevenue = trends.reduce((acc, curr) => acc + curr.revenue, 0);
  const progressPercentage =
    total > 0 ? Math.min((currentRevenue / total) * 100, 100) : 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedWidth(progressPercentage);
    }, 200);

    return () => clearTimeout(timer);
  }, [progressPercentage]);

  const { privacy } = useSelector((s: RootState) => s.design);

  const privacyDesign = privacy
    ? "blur-md opacity-70 select-none pointer-events-none transition-all duration-300"
    : "transition-all duration-300";

  if (isLoading) {
    return (
      <CardContainer size="lg">
        <div className="animate-pulse flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-10">
          <div className="h-8 w-40 rounded bg-[#E5E7EB]" />
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 lg:flex gap-4 lg:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 w-20 rounded bg-[#E5E7EB]" />
            ))}
          </div>
        </div>
      </CardContainer>
    );
  }

  return (
    <CardContainer size="lg">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-10">
        {/* Total Revenue block */}
        <div className="flex-shrink-0">
          <CommonHeader size="2xl" className={privacyDesign}>
            {formatCurrency(total)}
          </CommonHeader>
          <CommonHeader size="xs" className={privacyDesign}>
            Total Revenue
          </CommonHeader>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex flex-wrap gap-4 lg:gap-6 flex-1">
          {trends.map((trend, i) => (
            <div
              key={`${trend.month}-${i}`}
              className="cursor-default flex flex-col justify-center items-center"
            >
              <CommonHeader
                size="sm"
                className={`${privacyDesign} font-semibold! text-[#101828]!`}
              >
                {formatCurrency(trend.revenue)}
              </CommonHeader>
              <CommonHeader size="xs">{trend.month}</CommonHeader>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-7">
        <div className="w-full rounded-full overflow-hidden bg-[#E5E7EB] h-1">
          <div
            className="h-full rounded-full bg-blue transition-all duration-1000 ease-out"
            style={{ width: `${animatedWidth}%` }}
          />
        </div>
      </div>
    </CardContainer>
  );
};

export default RevenueBar;
