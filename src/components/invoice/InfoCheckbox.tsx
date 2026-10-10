import { useState } from "react";
import { FaCheck } from "react-icons/fa6";

interface CheckboxProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

const InfoCheckbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  className,
  disabled = false,
}) => {
  const [internalChecked, setInternalChecked] = useState(false);
  const isChecked = checked !== undefined ? checked : internalChecked;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    const next = !isChecked;
    if (checked === undefined) {
      setInternalChecked(next);
    }
    onChange?.(next);
  };

  return (
    <div
      onClick={handleToggle}
      className={`flex items-center gap-3 select-none ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${className || ""}`}
    >
      <div
        className={`w-7 h-7 rounded-[10px] border-[1.5px] flex items-center justify-center shrink-0 transition-all duration-150 ${
          isChecked
            ? "bg-[#2B4EFF] border-[#2B4EFF]"
            : "bg-transparent border-[#294566]"
        }`}
      >
        {isChecked && (
          <FaCheck className="w-4 h-4 text-white" />
        )}
      </div>
      {label && <span className="text-sm text-[#1E293B]">{label}</span>}
    </div>
  );
};

export default InfoCheckbox;
