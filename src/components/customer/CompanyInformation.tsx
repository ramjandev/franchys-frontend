import CustomSwitch from "@/components/shared/CustomSwitch";
import { inputClass } from "@/pages/Login";
import { Building2 } from "lucide-react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import { CustomerFormValues } from "./schema/customerSchema";

interface CompanyInformationProps {
  register: UseFormRegister<CustomerFormValues>;
  control: Control<CustomerFormValues>;
  errors: FieldErrors<CustomerFormValues>;
  watch: UseFormWatch<CustomerFormValues>;
}

const CompanyInformation: React.FC<CompanyInformationProps> = ({
  register,
  control,
  errors,
  watch,
}) => {
  const isTaxExempt = watch("isTaxExempt");

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
          <label className={inputClass.label}>Company Name</label>
          <input
            placeholder="Acme Corporation"
            className={inputClass.input}
            {...register("companyName")}
          />
          {errors.companyName && (
            <p className="text-xs text-red-500">{errors.companyName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className={inputClass.label}>Tax ID / EIN</label>
          <input
            placeholder="XX-XXXXXXX"
            className={inputClass.input}
            {...register("taxId")}
          />
        </div>

        {/* Tax Exempt Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
          <div>
            <p className="text-sm font-semibold text-[#111827]">Tax Exempt</p>
            <p className="text-xs text-[#5C7899]">
              Enable if this business is exempt from sales tax
            </p>
          </div>
          <Controller
            name="isTaxExempt"
            control={control}
            render={({ field }) => (
              <CustomSwitch
                checked={field.value ?? false}
                onChange={field.onChange}
                className={field.value ? "bg-[#00A63E]" : "bg-gray-300"}
              />
            )}
          />
        </div>

        {isTaxExempt && (
          <div className="space-y-2">
            <label className={inputClass.label}>
              Tax Exemption Certificate # (Optional)
            </label>
            <input
              placeholder="e.g. EX-987654 or Resale Certificate"
              className={inputClass.input}
              {...register("taxExemptNumber")}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyInformation;
