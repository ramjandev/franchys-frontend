import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

type Tab = "all" | "email" | "whatsapp";

interface MiniTabsProps {
  value: Tab;
  onChange: (value: Tab) => void;
  className?: string;
}

const TABS: { value: Tab; label: string; icon: React.ElementType }[] = [
  { value: "all", label: "All", icon: () => null },
  { value: "email", label: "Email", icon: Mail },
  { value: "whatsapp", label: "WhatsApp", icon: FaWhatsapp },
];

const MiniTabs = ({ value, onChange, className }: MiniTabsProps) => {
  return (
    <div className={cn("flex gap-2", className)}>
      {TABS.map(({ value: tabValue, label, icon: Icon }) => (
        <button
          key={tabValue}
          onClick={() => onChange(tabValue)}
          className={cn(
            "flex items-center gap-1 cursor-pointer rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
            value === tabValue
              ? "bg-[#155DFC] text-white border-[#155DFC]"
              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50",
          )}
        >
          <Icon size={12} />
          {label}
        </button>
      ))}
    </div>
  );
};

export default MiniTabs;
