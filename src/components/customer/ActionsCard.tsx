import { FiSave } from "react-icons/fi";
import CommonButton from "../shared/CommonButton";

const ActionsCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6">
      <div className="pb-6">
        <h2 className="text-sm font-bold text-[#111827] mb-4">Actions</h2>
        <div className="space-y-3">
          <CommonButton className="bg-skyBlue! text-white! w-full!">
            <FiSave className="w-4 h-4" />
            Save Customer
          </CommonButton>
          <CommonButton className="bg-[#F1F5F9]! text-[#314158]! w-full!">
            Cancel
          </CommonButton>
        </div>
      </div>

      <div className=" border-t border-border pt-6 ">
        <h2 className="text-sm font-bold text-[#111827] mb-4">Quick Tips</h2>
        <ul className="space-y-3 text-xs text-[#5C7899] list-disc marker:text-[#0077FF] pl-4">
          <li>
            All fields marked with <span className="text-red-500">*</span> are
            required
          </li>
          <li>Use tags to organize customers</li>
          <li>Add notes for internal reference</li>
        </ul>
      </div>
    </div>
  );
};

export default ActionsCard;
