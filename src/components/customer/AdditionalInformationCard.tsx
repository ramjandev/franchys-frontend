import { inputClass } from "@/pages/Login";
import { Tag } from "lucide-react";
import CommonButton from "../shared/CommonButton";
const AdditionalInformationCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[#FFFBEB] flex items-center justify-center">
          <Tag className="w-5 h-5 text-[#D97706]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#111827]">
            Additional Information
          </h2>
          <p className="text-xs text-[#5C7899]">Tags and notes</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className={inputClass.label}>Tags</label>
          <div className="flex gap-2">
            <input
              placeholder="Add a tag (e.g., VIP, Regular)"
              className={inputClass.input}
            />

            <CommonButton className="bg-[#F1F5F9]! text-[#314158]!">
              Add
            </CommonButton>
          </div>
        </div>
        <div className="space-y-2">
          <label className={inputClass.label}>Notes</label>
          <textarea
            className={inputClass.input}
            placeholder="Add any additional notes about this customer..."
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};

export default AdditionalInformationCard;
