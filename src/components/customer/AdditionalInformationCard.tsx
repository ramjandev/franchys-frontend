import { inputClass } from "@/pages/Login";
import { Tag, X } from "lucide-react";
import { UseFormRegister } from "react-hook-form";
import CommonButton from "../shared/CommonButton";
import { CustomerFormValues } from "./schema/customerSchema";

interface AdditionalInformationCardProps {
  tags: string[];
  tagInput: string;
  setTagInput: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  register: UseFormRegister<CustomerFormValues>;
}

const AdditionalInformationCard: React.FC<AdditionalInformationCardProps> = ({
  tags,
  tagInput,
  setTagInput,
  onAddTag,
  onRemoveTag,
  register,
}) => {
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
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onAddTag();
                }
              }}
            />

            <CommonButton
              type="button"
              variant="ghost"
              className=""
              onClick={onAddTag}
            >
              Add
            </CommonButton>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 bg-[#F1F5F9] text-[#314158] text-xs px-2 py-1 rounded-md"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => onRemoveTag(tag)}
                    className="cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <label className={inputClass.label}>Notes</label>
          <textarea
            className={inputClass.input}
            placeholder="Add any additional notes about this customer..."
            rows={4}
            {...register("notes")}
          />
        </div>
      </div>
    </div>
  );
};

export default AdditionalInformationCard;
