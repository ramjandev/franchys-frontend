export interface TabItem<T extends string = string> {
  label: string;
  value: T;
}

interface CommonTabsProps<T extends string> {
  tabs: readonly TabItem<T>[];
  activeTab: T;
  onChange: (tab: T) => void;
  className?: string;
}

const CommonTabs = <T extends string>({
  tabs,
  activeTab,
  onChange,
  className = "",
}: CommonTabsProps<T>) => {
  return (
    <div
      className={`flex items-center gap-2 p-3.5 border-b border-[#F1F5F9] bg-[#F8FAFC] ${className}`}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-bold transition-all ${
            activeTab === tab.value
              ? "bg-[#07F] shadow-md text-white"
              : "text-[#4A5565] bg-white"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default CommonTabs;
