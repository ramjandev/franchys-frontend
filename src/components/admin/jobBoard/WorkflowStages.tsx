import CardContainer from "@/components/shared/CardContainer";
import CommonHeader from "@/components/shared/CommonHeader";
import { MdOutlineArrowForward } from "react-icons/md";
import { STATUS_OPTIONS } from "./Data";

const WorkflowStages = () => {
  return (
    <div>
      <CardContainer className="">
        <CommonHeader className="font-bold! text-[#0F172B]!">
          Workflow Stages (in order)
        </CommonHeader>

        <div className="flex items-center gap-2 flex-wrap mt-4">
          {STATUS_OPTIONS.map((s, i) => (
            <div key={s.key} className="flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ background: s.color }}
              />
              <span className="text-[13px] text-[#5C7899]">{s.label}</span>
              {i < STATUS_OPTIONS.length - 1 && (
                <MdOutlineArrowForward className="text-[#A3B6CC] text-lg" />
              )}
            </div>
          ))}
        </div>
      </CardContainer>
    </div>
  );
};

export default WorkflowStages;
