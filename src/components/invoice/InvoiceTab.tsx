import CommonSelect from "../shared/CommonSelect";

interface TabOption {
  name: string;
  count: number;
}

interface Tab {
  tabs: TabOption[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}
const InvoiceTab: React.FC<Tab> = ({ tabs, activeTab, setActiveTab }) => {
  const tabOptions = tabs.map((tab) => ({
    label: tab.name,
    value: tab.name,
  }));
  return (
    <div className="">
      <div className="hidden md:block">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`relative cursor-pointer px-5 py-3 rounded-[14px] text-sm font-medium transition-all duration-200 ${
              activeTab === tab.name
                ? "bg-[#EFF6FF] text-skyBlue"
                : "text-[#45556C] hover:text-skyBlue"
            }`}
          >
            <span>{tab.name}</span>
            <span className="ml-1 opacity-80">{tab.count}</span>
          </button>
        ))}
      </div>
      <div className=" md:hidden">
        <CommonSelect
          value={activeTab}
          item={tabOptions}
          onValueChange={setActiveTab}
          placeholder="All Status"
          className="w-full! sm:w-auto!"
        />
      </div>
    </div>
  );
};

export default InvoiceTab;
