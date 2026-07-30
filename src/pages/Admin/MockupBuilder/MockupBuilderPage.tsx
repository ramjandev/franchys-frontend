import DashboardTopSection from "@/components/shared/DashboardTopSection";
import { useGetProductByIdQuery } from "@/store/Product/productAPI";
import React from "react";
import { useParams } from "react-router-dom";
import CenterCanvasArea from "./components/CenterCanvasArea";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";

const MockupBuilderPage: React.FC = () => {
  const { productId } = useParams();

  console.log("productId", productId);

  const { data, isLoading } = useGetProductByIdQuery(productId!, {
    skip: !productId,
    refetchOnMountOrArgChange: true,
  });
  console.log("data", data);
  return (
    <div className="flex flex-col h-auto xl:h-full xl:overflow-hidden">
      <div className="flex justify-between items-center gap-10">
        <DashboardTopSection
          title="Mockup Design"
          description="Create product mockups with your custom designs"
          backButton
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
