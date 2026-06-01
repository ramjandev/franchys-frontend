import { inputClass } from "@/pages/Login";
import { MapPin } from "lucide-react";
import CommonSelect from "../shared/CommonSelect";

const AddressInformationCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[#ECFDF5] flex items-center justify-center">
          <MapPin className="w-5 h-5 text-[#10B981]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#111827]">
            Address Information
          </h2>
          <p className="text-xs text-[#5C7899]">Billing and shipping address</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className={inputClass.label}>Street Address</label>
          <input
            placeholder="123 Main Street, Suite 100"
            className={inputClass.input}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className={inputClass.label}>City</label>
            <input placeholder="New York" className={inputClass.input} />
          </div>
          <div className="space-y-2">
            <label className={inputClass.label}>State / Province</label>
            <input placeholder="NY" className={inputClass.input} />
          </div>
          <div className="space-y-2">
            <label className={inputClass.label}>ZIP / Postal Code</label>
            <input placeholder="10001" className={inputClass.input} />
          </div>
          <div className="space-y-2">
            <label className={inputClass.label}>Country</label>
            <CommonSelect
              item={[
                { label: "United States", value: "United States" },
                { label: "Canada", value: "Canada" },
                { label: "United Kingdom", value: "United Kingdom" },
              ]}
              placeholder="Select country"
              value="United States"
              onValueChange={() => {}}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressInformationCard;
