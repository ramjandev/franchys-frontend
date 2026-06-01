import { inputClass } from "@/pages/Login";
import { Building2 } from "lucide-react";

const CompanyInformation = () => {
  return (
    <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[#FAF5FF] flex items-center justify-center">
          <Building2 className="w-5 h-5 text-[#7E22CE]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#111827]">
            Company Information
          </h2>
          <p className="text-xs text-[#5C7899]">Business details</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className={inputClass.label}>
            Company Name <span className="text-red-500">*</span>
          </label>
          <input placeholder="Acme Corporation" className={inputClass.input} />
        </div>
        <div className="space-y-2">
          <label className={inputClass.label}>Tax ID / EIN</label>
          <input placeholder="XX-XXXXXXX" className={inputClass.input} />
        </div>
      </div>
    </div>
  );
};

export default CompanyInformation;
