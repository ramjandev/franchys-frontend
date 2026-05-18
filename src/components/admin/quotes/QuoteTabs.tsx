import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons/lib";

interface Tab {
  tabs: {
    name: string;
    icon: LucideIcon | IconType;
  }[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}
const QuoteTabs: React.FC<Tab> = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div>
      <div className="flex bg-white rounded-xl  overflow-hidden border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === tab.name
                ? "text-blue border-b-2 border-blue bg-[#EFF6FF]"
                : "text-[#45556C] hover:text-[#111827] hover:bg-slate-50"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuoteTabs;
