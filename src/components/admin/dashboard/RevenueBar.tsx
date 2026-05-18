import CardContainer from "@/components/shared/CardContainer";
import CommonHeader from "@/components/shared/CommonHeader";
import type { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const weeks = [
  { label: "Apr 1 – Apr 7", value: 0 },
  { label: "Apr 8 – Apr 14", value: 0 },
  { label: "Apr 15 – Apr 21", value: 1039.15 },
  { label: "Apr 22 – Apr 28", value: 37087.99 },
];

const total = 490827.06;

function formatCurrency(val = 0) {
  return val === 0
    ? "$0.00"
    : "$" +
        val.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
}

const RevenueBar = () => {
  const [animatedWidth, setAnimatedWidth] = useState(0);

  const currentRevenue = weeks.reduce((acc, curr) => acc + curr.value, 0);
  const progressPercentage = Math.min((currentRevenue / total) * 100, 100);

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

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex  gap-4 lg:gap-6 flex-1">
          {weeks.map((week, i) => (
            <div
              key={i}
              className="cursor-default flex flex-col justify-center items-center"
            >
              <CommonHeader
                size="sm"
                className={`${privacyDesign} font-semibold! text-[#101828]!`}
              >
                {formatCurrency(week.value)}
              </CommonHeader>
              <CommonHeader size="xs">{week.label}</CommonHeader>
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
