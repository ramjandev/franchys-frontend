import AvatarUpload from "@/components/settings/AvatarUpload";
import CommonButton from "@/components/shared/CommonButton";
import CommonHeader from "@/components/shared/CommonHeader";
import { inputClass } from "@/pages/Login";
import { Save } from "lucide-react";
import { designGrid } from "./ProfileSettings";

const ShopSettings = () => {
  return (
    <div className="">
      <CommonHeader
        size="2xl"
        className="font-medium! border-b border-border mb-6 pb-3"
      >
        Shop Information
      </CommonHeader>

      <div className="space-y-4 sm:space-y-6">
        <AvatarUpload
          label="Logo"
          hint="Recommended size for logos are 600px by 300px using jpg, gif, or png format"
        />

        <div className={designGrid}>
          <label className={`${inputClass.label} sm:text-right`}>
            Company Name
          </label>
          <input defaultValue="Printavo" className={inputClass.input} />
        </div>

        <div className={designGrid}>
          <label className={`${inputClass.label} sm:text-right pt-2`}>
            Company Email
          </label>
          <div>
            <input
              type="email"
              defaultValue="info@makservius.com"
              className={inputClass.input}
            />
            <p className="text-xs text-[#62748E] mt-1.5">
              This is used when a customer replies to an invoice being emailed
              out.
            </p>
          </div>
        </div>

        <div className={designGrid}>
          <label className={`${inputClass.label} sm:text-right`}>Address</label>
          <input
            defaultValue="1102 Pontiac Avenue"
            className={inputClass.input}
          />
        </div>

        <div className={designGrid}>
          <label className={`${inputClass.label} sm:text-right`}>
            Address 2
          </label>
          <input
            placeholder="Apartment, suite, etc. (optional)"
            className={inputClass.input}
          />
        </div>

        <div className={designGrid}>
          <label className={`${inputClass.label} sm:text-right`}>City</label>
          <input className={inputClass.input} />
        </div>

        <div className={designGrid}>
          <label className={`${inputClass.label} sm:text-right`}>State</label>
          <input className={inputClass.input} />
        </div>

        <div className={designGrid}>
          <label className={`${inputClass.label} sm:text-right`}>Zip</label>
          <input className={inputClass.input} />
        </div>

        <div className={designGrid}>
          <label className={`${inputClass.label} sm:text-right`}>Country</label>
          <input className={inputClass.input} />
        </div>

        <div className={designGrid}>
          <label className={`${inputClass.label} sm:text-right`}>Phone</label>
          <input className={inputClass.input} />
        </div>

        <div className={designGrid}>
          <label className={`${inputClass.label} sm:text-right`}>
            Your Website
          </label>
          <input className={inputClass.input} />
        </div>

        <div className={designGrid}>
          <label className={`${inputClass.label} sm:text-right pt-2`}>
            Custom URL Branding
          </label>
          <div>
            <input defaultValue="makservius" className={inputClass.input} />
            <p className="text-xs text-[#62748E] mt-1.5">
              Enter your company name. Resulting example:
              http://shop-name.printavo.com/invoice/123
            </p>
          </div>
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

export default ShopSettings;
