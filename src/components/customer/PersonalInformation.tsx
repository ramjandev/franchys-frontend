import { inputClass } from "@/pages/Login";
import { User } from "lucide-react";
import { useState } from "react";
import CommonButton from "../shared/CommonButton";
import CommonSelect from "../shared/CommonSelect";
import SecondaryContact from "./SecondaryContact";

interface PersonalInformationProps {
  customerType: "business" | "personal";
}
const PersonalInformation: React.FC<PersonalInformationProps> = ({
  customerType,
}) => {
  const [showSecondary, setShowSecondary] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[#F0F7FF] flex items-center justify-center">
          <User className="w-5 h-5 text-[#0077FF]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#111827]">
            Personal Information
          </h2>
          <p className="text-xs text-[#5C7899]">Basic contact details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <label className={inputClass.label}>
            First Name <span className="text-red-500">*</span>
          </label>
          <input placeholder="John" className={inputClass.input} />
        </div>
        <div className="space-y-2">
          <label className={inputClass.label}>
            Last Name <span className="text-red-500">*</span>
          </label>
          <input placeholder="Smith" className={inputClass.input} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className={inputClass.label}>
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            placeholder="john.smith@example.com"
            className={inputClass.input}
          />
        </div>
        <div className="space-y-2">
          <label className={inputClass.label}>
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input placeholder="(555) 123-4567" className={inputClass.input} />
        </div>
        {customerType === "business" && (
          <div className="space-y-2">
            <label className={inputClass.label}>Website</label>
            <input
              placeholder="https://example.com"
              className={inputClass.input}
            />
          </div>
        )}
        <div className="space-y-2 md:col-span-2">
          <label className={inputClass.label}>
            Language Preference <span className="text-red-500">*</span>
          </label>
          <CommonSelect
            item={[
              { label: "English", value: "en" },
              { label: "Spanish", value: "es" },
              { label: "French", value: "fr" },
            ]}
            value="en"
            onValueChange={() => {}}
            placeholder="English"
            className="w-full!"
          />
        </div>
      </div>

      {!showSecondary && customerType === "business" && (
        <CommonButton
          className="bg-[#EFF6FF]! border-[#3B82F6]! text-[#3B82F6]! w-full"
          onClick={() => setShowSecondary(true)}
        >
          + Add Secondary Contact
        </CommonButton>
      )}
      {showSecondary && customerType === "business" && (
        <SecondaryContact onRemove={() => setShowSecondary(false)} />
      )}
    </div>
  );
};

export default PersonalInformation;
