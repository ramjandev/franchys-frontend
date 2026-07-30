import { ChevronDown } from "lucide-react";
import { STATUS_MAP, STATUS_OPTIONS } from "./Data";
import useDropdown from "./useDropdown";
interface StatusPillProps {
  statusKey: string;
  onChange: (key: string) => void;
}

const StatusPill: React.FC<StatusPillProps> = ({ statusKey, onChange }) => {
  const s = STATUS_MAP[statusKey] ?? STATUS_MAP["quote"];
  const { open, setOpen, ref } = useDropdown();
  return (
    <div ref={ref} className="relative max-w-44">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center justify-between whitespace-nowrap  gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold cursor-pointer border-[1.13px] ${s.bg} ${s.text} ${s.border}  w-full`}
      >
        <span>
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: s.color }}
          />
          {s.label}
        </span>
        <ChevronDown className="w-3 h-3 " />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 bg-white border border-[#E2E8F0] rounded-lg shadow-lg z-50 min-w-[160px] overflow-hidden">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => {
                onChange(opt.key);
                setOpen(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-xs text-left hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: opt.color }}
              />
              <span className={opt.text} style={{ fontWeight: 500 }}>
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusPill;
