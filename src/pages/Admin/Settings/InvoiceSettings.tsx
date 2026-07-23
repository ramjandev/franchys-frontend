import CheckboxField from "@/components/shared/CheckboxField";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import { inputClass } from "@/pages/Login";
import { Save } from "lucide-react";
import { designGrid } from "./ProfileSettings";

const InvoiceSettings = () => {
  return (
    <div className="">
      <CommonHeader
        size="2xl"
        className="font-medium! border-b border-border mb-6 pb-3"
      >
        Invoice Information
      </CommonHeader>

      <div className="space-y-4 sm:space-y-6">
        <div className={designGrid}>
          <label className={`${inputClass.label} sm:text-right`}>
            Invoice ID
          </label>
          <input className={inputClass.input} />
        </div>

        <div className={designGrid}>
          <label className={`${inputClass.label} sm:text-right`}>
            Currency
          </label>
          <input className={inputClass.input} />
        </div>

        <div className={designGrid}>
          <label className={`${inputClass.label} sm:text-right`}>
            Invoice Numbering
          </label>
          <CheckboxField description="Auto-generate invoice numbers sequentially" />
        </div>

        <div className={designGrid}>
          <label className={`${inputClass.label} sm:text-right`}>
            Invoice Seed
          </label>
          <input defaultValue="1" className={inputClass.input} />
        </div>

        <div className={designGrid}>
          <label className={`${inputClass.label} sm:text-right pt-2`}>
            Terms and Conditions
          </label>
          <div>
            <textarea className={`${inputClass.input} h-32 resize-none`} />
            <p className="text-xs text-[#62748E] mt-1.5">
              These terms will appear at the bottom of your invoices
            </p>
          </div>
        </div>

        <div className={designGrid}>
          <label className={`${inputClass.label} sm:text-right`}>
            Default Payment Terms
          </label>
          <input className={inputClass.input} />
        </div>

        <div className={designGrid}>
          <label className={`${inputClass.label} sm:text-right`}>
            Default Tax Rate (%)
          </label>
          <input defaultValue="8.00" className={inputClass.input} />
        </div>

        <div className={designGrid}>
          <label className={`${inputClass.label} sm:text-right`}>
            Invoice Language
          </label>
          <input className={inputClass.input} />
        </div>

        <div className="pt-6 mt-6 border-t border-border!">
          <CommonButton variant="primaryGreen">
            <Save />
            Save changes
          </CommonButton>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSettings;
