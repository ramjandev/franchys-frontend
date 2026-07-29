import DashboardSearch from "@/components/shared/DashboardSearch";
import DashboardTopSection from "@/components/shared/DashboardTopSection";
import React from "react";
import CenterCanvasArea from "./components/CenterCanvasArea";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";

const MockupBuilderPage: React.FC = () => {
  return (
    <div className="flex flex-col h-auto xl:h-full xl:overflow-hidden">
      <div className="flex justify-between items-center gap-10">
        <DashboardTopSection
          title="Mockup Design"
          description="Create product mockups with your custom designs"
          backButton
        />
        <DashboardSearch
          value=""
          onChange={() => {}}
          className="bg-transparent! border-[#CAD5E2]! text-[#0A0A0A]/50!"
        />
      </div>
      <div className="flex-1 overflow-y-auto xl:overflow-hidden pb-8 xl:pb-0">
        <div className="flex flex-col xl:flex-row items-stretch gap-6 h-auto xl:h-full min-h-125">
          <LeftPanel />
          <CenterCanvasArea />
          <RightPanel />
        </div>
      </div>
    </div>
  );
};

export default MockupBuilderPage;
