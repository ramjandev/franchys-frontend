import React from "react";
import { ArrowLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MockupProvider } from "./context/MockupContext";
import LeftPanel from "./components/LeftPanel";
import CenterCanvasArea from "./components/CenterCanvasArea";
import RightPanel from "./components/RightPanel";

const MockupBuilderPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MockupProvider>
      <div className="flex flex-col h-full  overflow-hidden">
        {/* Header */}
        <div className=" px-0 pt-6 pb-4 shrink-0">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="text-[#6B7280] hover:text-[#111827] transition-colors p-1 hover:bg-gray-200/50 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-[#111827]">Mockup Design</h1>
                <p className="text-xs text-[#6B7280]">Create product mockups with your custom designs</p>
              </div>
            </div>

            {/* Search Jobs... Input -> Matches the right side of the UI */}
            <div className="ml-auto flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search jobs..."
                  className="pl-10 pr-4 py-2 border border-[#D1D5DB] rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] bg-white transition-all shadow-sm text-[#111827]"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                  <Search size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto xl:overflow-hidden pb-8 xl:pb-0">
          <div className="flex flex-col xl:flex-row items-stretch gap-6 h-full min-h-[500px]">
            <LeftPanel />
            <CenterCanvasArea />
            <RightPanel />
          </div>
        </div>
      </div>
    </MockupProvider>
  );
};

export default MockupBuilderPage;
