import AvatarUpload from "@/components/settings/AvatarUpload";
import CheckboxField from "@/components/shared/CheckboxField";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import { inputClass } from "@/pages/Login";
import { Save } from "lucide-react";
export const designGrid = "grid sm:grid-cols-[180px_1fr] sm:gap-3 items-center";

const ProfileSettings = () => {
  return (
    <div className="">
      <CommonHeader
        size="2xl"
        className="font-medium! border-b border-border mb-6 pb-3"
      >
        Personal Information
      </CommonHeader>

      <div className="space-y-4 sm:space-y-6">
        <AvatarUpload />

        <div className={designGrid}>
          <label className={`${inputClass.label} sm:text-right`}>Name</label>
          <input defaultValue="Franchesca" className={inputClass.input} />
        </div>

        <div className={designGrid}>
          <label className={` ${inputClass.label} sm:text-right`}>Email</label>
          <input
            type="email"
            defaultValue="franchesca@printavo.com"
            className={inputClass.input}
          />
        </div>

        <div className={designGrid}>
          <label className={` ${inputClass.label} sm:text-right`}>
            Timezone
          </label>
          <input placeholder="Select timezone…" className={inputClass.input} />
        </div>

        <div className={designGrid}>
          <label className={` ${inputClass.label} sm:text-right`}>
            Tasks Reminder Emails
          </label>

          <CheckboxField description="Send a reminder email for tasks due that day" />
        </div>

        <div className={designGrid}>
          <label className={` ${inputClass.label} sm:text-right`}>
            Task Assigned Emails
          </label>
          <CheckboxField description="Send a reminder email when a task is assigned to you" />
        </div>

        <div className={designGrid}>
          <label className={`${` ${inputClass.label} sm:text-right`} pt-2`}>
            Change Password
          </label>
          <div>
            <input
              type="password"
              placeholder="Enter new password"
              className={inputClass.input}
            />
            <p className="text-xs text-[#62748E] mt-1.5">
              Minimum 9 characters
            </p>
          </div>
        </div>

        <div className={designGrid}>
          <label className={` ${inputClass.label} sm:text-right`}>
            Password Confirmation
          </label>
          <input
            type="password"
            placeholder="Confirm new password"
            className={inputClass.input}
          />
        </div>

        <div className="pt-6 mt-6 border-t border-border!">
          <CommonButton className="bg-[#00A63E]! text-white">
            <Save size={15} />
            Save changes
          </CommonButton>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
