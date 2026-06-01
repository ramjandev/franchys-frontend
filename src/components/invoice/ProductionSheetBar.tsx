import { Printer, X } from "lucide-react";
import CommonButton from "../shared/CommonButton";

const ProductionSheetBar = () => {
  const handlePrint = () => {
    window.print();
  };
  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white w-full border border-border shadow-[0_1px_3px_0_rgba(0,0,0,0.10),_0_1px_2px_-1px_rgba(0,0,0,0.10)]  ">
      <div className="max-w-[1420px] mx-auto w-full flex justify-between ml-10 sm:ml-0">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm text-[#5C7899] hover:text-[#1E293B] transition-colors cursor-pointer  print:hidden"
        >
          <X size={16} />

          <span className="hidden  sm:block">Close Production Sheet</span>
        </button>

        <CommonButton
          onClick={handlePrint}
          className="bg-[#50BB69]! text-white!"
        >
          <Printer size={16} />
          Print Production Sheet
        </CommonButton>
      </div>
    </div>
  );
};

export default ProductionSheetBar;
