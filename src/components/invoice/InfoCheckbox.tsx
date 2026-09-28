import { useState } from "react";
import { FaCheck } from "react-icons/fa6";

interface CheckboxProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

const InfoCheckbox: React.FC<CheckboxProps> = ({
  label,
  checked = false,
  onChange,
  className,
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    const next = !isChecked;
    setIsChecked(next);
    onChange?.(next);
  };

  return (
    <div
      onClick={handleToggle}
      className={`flex items-center gap-3 ${className}`}
    >
      <div
        onClick={handleToggle}
        className={`w-7 h-7 rounded-[10px] border-[1.5px] flex items-center justify-center shrink-0 transition-all duration-150 cursor-pointer ${
          isChecked
            ? "bg-[#2B4EFF] border-[#2B4EFF]"
            : "bg-transparent border-[#294566]"
        }`}
      >
        {isChecked && (
          <span className="cursor-pointer">
            <FaCheck className="w-4 h-4 text-white " />
          </span>
        )}
      </div>
      {label && <span className="text-sm text-[#1E293B]">{label}</span>}
    </div>
  );
};

export default InfoCheckbox;
