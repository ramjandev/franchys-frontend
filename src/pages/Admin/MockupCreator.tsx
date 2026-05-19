import Preview, { type PreviewHandle } from "@/components/mockup/Preview";
import Template from "@/components/mockup/Template";
import UploadDesign from "@/components/mockup/UploadDesign";
import DashboardTopSection from "@/components/shared/DashboardTopSection";
import { useRef } from "react";

const MockupCreator = () => {
  const previewRef = useRef<PreviewHandle>(null);

  const handleExport = async () => {
    await previewRef.current?.exportMockup();
  };

  return (
    <div>
      <DashboardTopSection
        title="Mockup Creator"
        description="Welcome back. Here's what's happening with your business today."
        buttonOne="Save to Quote"
        actionOne={() => console.log("Save to Quote")}
        buttonTwo="Export Mockup"
        actionTwo={handleExport}
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-10">
        <Template />
        <div className="md:col-span-2">
          <Preview ref={previewRef} />
        </div>
        <UploadDesign />
      </div>
    </div>
  );
};

export default MockupCreator;
