import { Copy, MoreVertical, Trash2 } from "lucide-react";
import useDropdown from "./useDropdown";
interface ActionMenuProps {
  onView?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ onDuplicate, onDelete }) => {
  const { open, setOpen, ref } = useDropdown();
  return (
    <div ref={ref} className="relative ">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1.5 rounded-md hover:bg-[#F1F5F9] text-[#9CA3AF] hover:text-[#374151] transition-colors cursor-pointer"
        aria-label="Actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-[#E2E8F0] rounded-lg shadow-lg z-50 min-w-35 overflow-hidden">
          <button
            onClick={() => {
              onDuplicate?.();
              setOpen(false);
            }}
            className="flex items-center gap-2 w-full px-3 py-2.5 text-xs text-[#374151] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" /> Duplicate
          </button>
          <div className="border-t border-[#F1F5F9]" />
          <button
            onClick={() => {
              onDelete?.();
              setOpen(false);
            }}
            className="flex items-center gap-2 w-full px-3 py-2.5 text-xs text-[#EF4444] hover:bg-[#FEF2F2] transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      )}
    </div>
  );
};
export default ActionMenu;
