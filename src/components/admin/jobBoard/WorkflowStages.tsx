import CardContainer from "@/components/shared/CardContainer";
import CommonHeader from "@/components/shared/CommonHeader";
import { JobStatus } from "@/store/jobs/types/jobTypes";
import { MdOutlineArrowForward } from "react-icons/md";
import { STATUS_OPTIONS } from "./Data";

export type StatusFilterValue = JobStatus | "all";

interface WorkflowStagesProps {
  activeStatus?: StatusFilterValue;
  onStatusSelect?: (status: StatusFilterValue) => void;
}

const WorkflowStages: React.FC<WorkflowStagesProps> = ({
  activeStatus = "all",
  onStatusSelect,
}) => {
  return (
    <div>
      <CardContainer className="">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CommonHeader className="font-bold! text-[#0F172B]!">
            Workflow Stages (in order)
          </CommonHeader>
          {onStatusSelect && activeStatus !== "all" && (
            <button
              type="button"
              onClick={() => onStatusSelect("all")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
            >
              Show All Stages
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap mt-4">
          {onStatusSelect && (
            <button
              type="button"
              onClick={() => onStatusSelect("all")}
              className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all border ${
                activeStatus === "all"
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
              title="Show jobs in all stages"
            >
              All
            </button>
          )}

          {STATUS_OPTIONS.map((s, i) => {
            const isSelected = activeStatus === s.key;
            return (
              <div key={s.key} className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if (!onStatusSelect) return;
                    if (isSelected) {
                      onStatusSelect("all");
                    } else {
                      onStatusSelect(s.key as JobStatus);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-all ${
                    onStatusSelect ? "cursor-pointer" : "cursor-default"
                  } ${
                    isSelected
                      ? `${s.bg} ${s.text} border-2 ${s.border} ring-2 ring-blue-500/30 font-semibold shadow-xs`
                      : "bg-slate-50/80 text-[#5C7899] hover:bg-slate-100 border border-slate-200/80"
                  }`}
                  title={
                    onStatusSelect
                      ? isSelected
                        ? `Selected: ${s.label} (click to clear)`
                        : `Filter by ${s.label}`
                      : s.label
                  }
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: s.color }}
                  />
                  <span>{s.label}</span>
                </button>
                {i < STATUS_OPTIONS.length - 1 && (
                  <MdOutlineArrowForward className="text-[#A3B6CC] text-base shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </CardContainer>
    </div>
  );
};

export default WorkflowStages;
