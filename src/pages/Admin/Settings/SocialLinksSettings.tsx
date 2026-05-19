import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import { inputClass } from "@/pages/Login";
import { Save } from "lucide-react";

const SocialLinksSettings = () => {
  return (
    <div className="">
      <div className="pb-6">
        <CommonHeader size="2xl" className="font-medium!">
          Social Links
        </CommonHeader>
        <CommonHeader size="sm">
          Connect your social media profiles
        </CommonHeader>
      </div>
      <div className=" space-y-4">
        <div className="">
          <label className={inputClass.label}>Facebook</label>
          <input
            placeholder="https://facebook.com/yourpage"
            className={inputClass.input}
          />
        </div>

        <div className="">
          <label className={inputClass.label}>Instagram</label>
          <input
            placeholder="https://instagram.com/yourprofile"
            className={inputClass.input}
          />
        </div>

        <div className="">
          <label className={inputClass.label}>Tiktok</label>
          <input className={inputClass.input} />
        </div>

        <div className="">
          <label className={inputClass.label}>Whatsapp</label>
          <input
            placeholder="https://youtube.com/@yourchannel"
            className={inputClass.input}
          />
        </div>
      </div>

      <div className="pt-6 mt-6 border-t border-border">
        <CommonButton className="bg-[#00A63E]! text-white">
          <Save size={15} />
          Save changes
        </CommonButton>
      </div>
    </div>
  );
};

export default SocialLinksSettings;
