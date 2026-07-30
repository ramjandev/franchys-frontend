import { inputClass } from "@/pages/Login";
import { User } from "lucide-react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import AvatarUpload from "../settings/AvatarUpload";
import CommonButton from "../shared/CommonButton";
import CommonSelect from "../shared/CommonSelect";
import SecondaryContact from "./SecondaryContact";
import { CustomerFormValues } from "./schema/customerSchema";

interface PersonalInformationProps {
  customerType: "business" | "personal";
  register: UseFormRegister<CustomerFormValues>;
  control: Control<CustomerFormValues>;
  errors: FieldErrors<CustomerFormValues>;
  showSecondary: boolean;
  setShowSecondary: (value: boolean) => void;
}

const languageOptions = [
  { label: "English", value: "English" },
  { label: "Spanish", value: "Spanish" },
  { label: "French", value: "French" },
];

const PersonalInformation: React.FC<PersonalInformationProps> = ({
  customerType,
  register,
  control,
  errors,
  showSecondary,
  setShowSecondary,
}) => {
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

      <div>
        <div className="flex justify-center mb-6">
          <Controller
            name="profileImage"
            control={control}
            render={({ field }) => (
              <AvatarUpload
                value={field.value}
                label="Profile Image"
                onChange={(dataUrl: string | null) =>
                  field.onChange(dataUrl ?? "")
                }
              />
            )}
          />
        </div>
        {errors.profileImage && (
          <p className="text-xs text-red-500 text-center -mt-4 mb-4">
            {errors.profileImage.message as string}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <label className={inputClass.label}>
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            placeholder="John"
            className={inputClass.input}
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="text-xs text-red-500">{errors.firstName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className={inputClass.label}>
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            placeholder="Smith"
            className={inputClass.input}
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="text-xs text-red-500">{errors.lastName.message}</p>
          )}
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className={inputClass.label}>
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            placeholder="john.smith@example.com"
            className={inputClass.input}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className={inputClass.label}>
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            placeholder="(555) 123-4567"
            className={inputClass.input}
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone.message}</p>
          )}
        </div>
        {customerType === "business" && (
          <div className="space-y-2">
            <label className={inputClass.label}>Website</label>
            <input
              placeholder="https://example.com"
              className={inputClass.input}
              {...register("website")}
            />
            {errors.website && (
              <p className="text-xs text-red-500">{errors.website.message}</p>
            )}
          </div>
        )}
        <div className="space-y-2 md:col-span-2">
          <label className={inputClass.label}>
            Language Preference <span className="text-red-500">*</span>
          </label>
          <Controller
            name="language"
            control={control}
            render={({ field }) => (
              <CommonSelect
                item={languageOptions}
                value={field.value}
                onValueChange={field.onChange}
                placeholder="English"
                className="w-full!"
              />
            )}
          />
          {errors.language && (
            <p className="text-xs text-red-500">{errors.language.message}</p>
          )}
        </div>
      </div>

      {!showSecondary && customerType === "business" && (
        <CommonButton
          type="button"
          variant="ghost"
          className=" w-full"
          onClick={() => setShowSecondary(true)}
        >
          + Add Secondary Contact
        </CommonButton>
      )}
      {showSecondary && customerType === "business" && (
        <SecondaryContact
          register={register}
          errors={errors}
          onRemove={() => setShowSecondary(false)}
        />
      )}
    </div>
  );
};

export default PersonalInformation;
